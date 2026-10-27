"""Exercise data loss, targeting and concurrency risks in the CSV companion."""
import copy
import json
from pathlib import Path
import tempfile
import unittest
import zipfile
import xml.etree.ElementTree as ET
from unittest.mock import patch
import catalog_data as c


def fixture():
    definitions = {}
    for feature in c.FEATURES:
        names = ['code', 'label', 'value'] if feature == 'specifications' else c.HEADERS[feature][1:]
        fields = []
        for name in names:
            kind = 'list.product_reference' if name in c.PRODUCT_LISTS else 'list.single_line_text_field' if name in c.LISTS else 'multi_line_text_field' if name in ['value', 'application_notes'] else 'url' if name == 'reference_url' else 'single_line_text_field'
            fields.append({'key': name, 'type': {'name': kind}, 'required': name in ['entry_name', 'code']})
        did = 'gid://shopify/MetaobjectDefinition/' + feature
        owner_definition = {'type': {'name': 'list.metaobject_reference' if feature == 'specifications' else 'metaobject_reference'}, 'validations': [{'name': 'metaobject_definition_id', 'value': did}], 'access': {'storefront': 'PUBLIC_READ'}}
        definitions[feature] = {'metaobject': {'id': did, 'fieldDefinitions': fields, 'access': {'storefront': 'PUBLIC_READ'}}, 'owners': {key: [owner_definition] for key in ['PRODUCT', 'PRODUCTVARIANT']}}
    variant = {'id': 'gid://shopify/ProductVariant/9007199254740993', 'title': '24 V', 'sku': '0012-A', **{f: None for f in c.FEATURES}}
    product = {'id': 'gid://shopify/Product/1', 'handle': 'fixture-inflator', 'title': 'Inflator', 'status': 'ACTIVE', 'variants': [variant], **{f: None for f in c.FEATURES}}
    return {'version': 1, 'store': 'fixture.myshopify.com', 'namespace': 'siftwell', 'products': {'fixture-inflator': product}, 'objects': {}, 'linked_products': {}, 'definitions': definitions}


def tables():
    result = {name: [] for name in c.HEADERS}
    result['assignments'] = [{'product_handle': 'fixture-inflator', 'variant_id': '9007199254740993', 'variant_sku': '0012-A', 'specifications': '', 'compatibility': '', 'parts': 'kit'}]
    result['parts'] = [{'set_key': 'kit', 'entry_name': 'Kit', 'included_items': 'Inflator × 1\nHose, long × 1', 'required_extras': 'Suitable supply', 'optional_extras': '', 'required_products': '', 'optional_products': ''}]
    return result


class CatalogTests(unittest.TestCase):
    def test_blank_workbook_has_no_import_records(self):
        path = Path(__file__).resolve().parents[1] / 'docs/downloads/Siftwell-catalog-template.xlsx'
        self.assertTrue(all(not rows for rows in c.read_tables(path).values()))

    def test_xlsx_formulas_are_rejected(self):
        source = Path(__file__).resolve().parents[1] / 'docs/downloads/Siftwell-catalog-template.xlsx'
        ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / 'formula-input.xlsx'
            with zipfile.ZipFile(source) as original, zipfile.ZipFile(target, 'w') as output:
                for info in original.infolist():
                    content = original.read(info.filename)
                    if info.filename == 'xl/worksheets/sheet1.xml':
                        root = ET.fromstring(content)
                        cell = next(cell for cell in root.findall('.//s:c', ns) if cell.attrib['r'] == 'A2')
                        ET.SubElement(cell, '{' + ns['s'] + '}f').text = '1+1'
                        content = ET.tostring(root)
                    output.writestr(info.filename, content)
            with self.assertRaises(c.Invalid): c.read_tables(target)

    def test_csv_round_trip_and_formula_text(self):
        data = tables()
        data['parts'][0]['included_items'] = '=untrusted()\nHose, "long" × 1'
        data['parts'][0]['optional_extras'] = "'=literal"
        with tempfile.TemporaryDirectory() as directory:
            c.write_tables(directory, data)
            self.assertEqual(c.read_tables(directory), data)
            self.assertIn("'=untrusted()", (Path(directory) / 'parts.csv').read_text(encoding='utf-8-sig'))
            with self.assertRaises(c.Invalid):
                c.write_tables(directory, data)

    def test_blank_assignments_preserve_data(self):
        state = fixture()
        state['products']['fixture-inflator']['variants'][0]['compatibility'] = {'value': 'existing', 'type': 'metaobject_reference', 'compareDigest': 'abc'}
        plan = c.build_plan(tables(), state)
        self.assertEqual([change['key'] for change in plan['changes']], ['parts'])
        self.assertIsNone(plan['changes'][0]['compareDigest'])
        self.assertEqual(plan['changes'][0]['ownerId'], 'gid://shopify/ProductVariant/9007199254740993')

    def test_invalid_keys_lists_and_conflicting_extras(self):
        changes = [lambda t: t['parts'][0].update(included_items='\n'.join(str(i) for i in range(11))),
                   lambda t: t['parts'][0].update(required_products='fixture-inflator', optional_products='fixture-inflator'),
                   lambda t: t['assignments'][0].update(parts='missing'),
                   lambda t: t['assignments'][0].update(variant_id='9.007199254740993E15'),
                   lambda t: t['assignments'].append(copy.deepcopy(t['assignments'][0]))]
        for change in changes:
            data = tables(); change(data)
            with self.assertRaises(c.Invalid): c.validate(data)

    def test_exact_variant_resolution_and_duplicate_skus(self):
        state = fixture(); data = tables()
        data['assignments'][0]['variant_id'] = ''
        twin = copy.deepcopy(state['products']['fixture-inflator']['variants'][0]); twin['id'] = 'gid://shopify/ProductVariant/2'
        state['products']['fixture-inflator']['variants'].append(twin)
        with self.assertRaises(c.Invalid): c.build_plan(data, state)
        data['assignments'][0]['variant_id'] = '9007199254740993'
        self.assertEqual(len(c.build_plan(data, state)['changes']), 1)
        data['assignments'][0]['variant_sku'] = 'conflicting-sku'
        with self.assertRaises(c.Invalid): c.build_plan(data, state)

    def test_clone_changed_shared_data_and_reuse_unchanged(self):
        state = fixture(); data = tables(); owner = state['products']['fixture-inflator']['variants'][0]
        value = c.validate(data)['parts']['kit']
        obj = {'id': 'gid://shopify/Metaobject/1', 'type': 'parts_set', 'handle': 'old-kit', 'fields': [{'key': key, 'value': json.dumps(v) if isinstance(v, list) else v} for key, v in value.items()]}
        state['objects'][obj['id']] = obj
        owner['parts'] = {'value': obj['id'], 'type': 'metaobject_reference', 'compareDigest': 'old-digest'}
        plan = c.build_plan(data, state)
        self.assertEqual(plan['changes'], []); self.assertEqual(plan['objects'], {})
        data['parts'][0]['included_items'] += '\nAdapter × 1'
        before = copy.deepcopy(state)
        plan = c.build_plan(data, state)
        self.assertEqual(state, before, 'Existing shared entries must not be modified')
        self.assertEqual(len(plan['objects']), 1)
        self.assertEqual(plan['changes'][0]['compareDigest'], 'old-digest')
        self.assertTrue(plan['changes'][0]['after'].startswith('parts_set:siftwell-'))

    def test_specs_suppression_and_order_limits(self):
        data = tables(); data['assignments'][0]['parts'] = ''; data['assignments'][0]['specifications'] = 'specs'
        data['specifications'] = [{'set_key': 'specs', 'code': 'fit', 'label': '', 'value': ''}]
        self.assertEqual(len(c.build_plan(data, fixture())['changes']), 1)
        data['specifications'].append(copy.deepcopy(data['specifications'][0]))
        with self.assertRaises(c.Invalid): c.validate(data)
        data['specifications'] = [{'set_key': 'specs', 'code': 'row-' + str(i), 'label': 'Label', 'value': 'Value'} for i in range(21)]
        with self.assertRaises(c.Invalid): c.validate(data)

    def test_missing_schema_and_self_links_block_plan(self):
        state = fixture(); data = tables()
        state['definitions']['parts']['owners']['PRODUCTVARIANT'] = []
        with self.assertRaises(c.Invalid): c.build_plan(data, state)
        state = fixture(); data['parts'][0]['required_products'] = 'fixture-inflator'
        with self.assertRaises(c.Invalid): c.build_plan(data, state)

    def test_stale_preview_and_tampered_plan_never_write(self):
        state = fixture(); plan = c.build_plan(tables(), state); plan['plan_id'] = c.digest(plan)
        class Client:
            store = 'fixture.myshopify.com'
            def query(self, *args, **kwargs): raise AssertionError('No API mutation may run')
        with tempfile.TemporaryDirectory() as directory:
            receipt = Path(directory) / 'receipt.json'
            changed = copy.deepcopy(plan); changed.pop('plan_id'); changed['baseline'] = 'different'
            with patch.object(c, 'refresh', return_value=(state, changed)):
                with self.assertRaises(c.Invalid): c.apply_plan(Client(), plan, plan['plan_id'], receipt)
                self.assertFalse(receipt.exists())
            plan['changes'][0]['key'] = 'inventory'
            with self.assertRaises(c.Invalid): c.apply_plan(Client(), plan, plan['plan_id'], receipt)

    def test_apply_uses_only_create_and_cas_then_verifies(self):
        state = fixture(); plan = c.build_plan(tables(), state); plan['plan_id'] = c.digest(plan)
        calls = []
        class Client:
            store = 'fixture.myshopify.com'
            def query(self, query, variables, mutation=False):
                calls.append((query, variables, mutation))
                if 'metaobjectCreate' in query: return {'metaobjectCreate': {'metaobject': {'id': 'gid://shopify/Metaobject/2'}}}
                if 'metafieldsSet' in query: return {'metafieldsSet': {'metafields': []}}
                raise AssertionError(query)
        expected = {key: value for key, value in plan.items() if key != 'plan_id'}
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'receipt.json'
            with patch.object(c, 'refresh', side_effect=[(state, expected), (state, {'changes': [], 'objects': {}})]):
                receipt = c.apply_plan(Client(), plan, plan['plan_id'], path)
            self.assertEqual(receipt['status'], 'complete'); self.assertTrue(receipt['readback_verified'])
            update = calls[1][1]['metafields'][0]
            self.assertIn('compareDigest', update); self.assertIsNone(update['compareDigest'])
            self.assertEqual(update['value'], 'gid://shopify/Metaobject/2')
            self.assertFalse(any('metaobjectUpdate' in query or 'Delete' in query for query, _, _ in calls))
            self.assertNotIn('capabilities', calls[0][1]['metaobject'], 'Definitions without publication status must not receive unsupported status input')

    def test_active_status_only_when_schema_supports_it(self):
        state = fixture()
        state['definitions']['parts']['metaobject']['capabilities'] = {'publishable': {'enabled': True}}
        plan = c.build_plan(tables(), state)
        self.assertTrue(next(iter(plan['objects'].values()))['publishable'])
        plan['plan_id'] = c.digest(plan)
        calls = []
        class Client:
            store = 'fixture.myshopify.com'
            def query(self, query, variables, mutation=False):
                calls.append(variables)
                return {'metaobjectCreate': {'metaobject': {'id': 'gid://shopify/Metaobject/2'}}} if 'metaobjectCreate' in query else {'metafieldsSet': {'metafields': []}}
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(c, 'refresh', side_effect=[(state, {key: value for key, value in plan.items() if key != 'plan_id'}), (state, {'changes': [], 'objects': {}})]):
                c.apply_plan(Client(), plan, plan['plan_id'], Path(directory) / 'receipt.json')
        self.assertEqual(calls[0]['metaobject']['capabilities']['publishable']['status'], 'ACTIVE')

    def test_partial_failure_is_recorded_without_retry(self):
        state = fixture(); plan = c.build_plan(tables(), state); plan['plan_id'] = c.digest(plan)
        class Client:
            store = 'fixture.myshopify.com'
            def query(self, query, variables, mutation=False):
                if 'metaobjectCreate' in query: return {'metaobjectCreate': {'metaobject': {'id': 'gid://shopify/Metaobject/2'}}}
                raise c.Invalid('Concurrent assignment changed')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'receipt.json'
            with patch.object(c, 'refresh', return_value=(state, {key: value for key, value in plan.items() if key != 'plan_id'})):
                with self.assertRaises(c.Invalid): c.apply_plan(Client(), plan, plan['plan_id'], path)
            saved = json.loads(path.read_text())
            self.assertEqual(saved['status'], 'incomplete'); self.assertEqual(len(saved['created']), 1)
            self.assertEqual(saved['assignments'], [])


if __name__ == '__main__':
    unittest.main()
