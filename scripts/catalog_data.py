#!/usr/bin/env python3
"""Developer-assisted CSV round trip for Siftwell's optional product facts.

Uses an authenticated official Shopify CLI. Never edits prices, stock, product
copy or existing metaobjects. Plans are read-only; apply rechecks the complete
plan and uses Shopify compareDigest on every changed assignment.
"""
import argparse
import csv
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import zipfile
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

VERSION = 1
API_VERSION = '2026-07'
FEATURES = ('specifications', 'compatibility', 'parts')
HEADERS = {
    'assignments': ['product_handle', 'variant_id', 'variant_sku', *FEATURES],
    'specifications': ['set_key', 'code', 'label', 'value'],
    'compatibility': ['set_key', 'entry_name', 'requirements', 'exclusions', 'application_notes', 'reference_url', 'reference_label'],
    'parts': ['set_key', 'entry_name', 'included_items', 'required_extras', 'optional_extras', 'required_products', 'optional_products'],
}
TYPES = {'specifications': 'specification_row', 'compatibility': 'compatibility_profile', 'parts': 'parts_set'}
LISTS = {'requirements', 'exclusions', 'included_items', 'required_extras', 'optional_extras', 'required_products', 'optional_products'}
PRODUCT_LISTS = {'required_products', 'optional_products'}
KEY = re.compile(r'[a-z0-9]+(?:-[a-z0-9]+)*\Z')


class Invalid(ValueError):
    pass


def require(condition, message):
    if not condition:
        raise Invalid(message)


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest()


def save(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def encode_cell(value):
    """Prevent exported supplier text being interpreted as a spreadsheet formula."""
    return "'" + value if value.startswith(("'", '=', '+', '-', '@', '\t', '\r')) else value


def decode_cell(value):
    return value[1:] if value.startswith("'") and value[1:].startswith(("'", '=', '+', '-', '@', '\t', '\r')) else value


def read_tables(directory):
    if Path(directory).is_file():
        return read_workbook(directory)
    tables = {}
    for name, headers in HEADERS.items():
        path = Path(directory) / (name + '.csv')
        require(path.is_file(), f'Missing {path.name}. Export the four working tabs as CSV files.')
        with path.open(encoding='utf-8-sig', newline='') as stream:
            reader = csv.DictReader(stream)
            require(reader.fieldnames is not None and len(reader.fieldnames) == len(set(reader.fieldnames)), f'{path.name}: missing or duplicate headers')
            require(set(reader.fieldnames) == set(headers), f'{path.name}: use these exact headers: {", ".join(headers)}')
            rows = []
            for line, row in enumerate(reader, 2):
                require(None not in row and all(v is not None for v in row.values()), f'{path.name}:{line}: incorrect number of cells')
                row = {key: decode_cell(value).replace('\r\n', '\n').replace('\r', '\n').strip() for key, value in row.items()}
                if any(row.values()):
                    require(not any('\x00' in v for v in row.values()), f'{path.name}:{line}: invalid null character')
                    rows.append(row)
            tables[name] = rows
    return tables


def read_workbook(path):
    """Read the four working tabs from XLSX without Excel or a third-party parser."""
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    relationships = 'http://schemas.openxmlformats.org/package/2006/relationships'
    document_relationships = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    require(Path(path).suffix.lower() == '.xlsx', 'Use an XLSX workbook or a directory containing the four CSV files')
    with zipfile.ZipFile(path) as archive:
        require(sum(info.file_size for info in archive.infolist()) <= 40_000_000, 'Workbook exceeds the 40 MB uncompressed limit')
        strings = []
        if 'xl/sharedStrings.xml' in archive.namelist():
            strings = [''.join(node.itertext()) for node in ET.fromstring(archive.read('xl/sharedStrings.xml')).findall('s:si', ns)]
        rels = {item.attrib['Id']: item.attrib['Target'] for item in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels')).findall('{' + relationships + '}Relationship')}
        tables = {}
        for sheet in ET.fromstring(archive.read('xl/workbook.xml')).findall('s:sheets/s:sheet', ns):
            name = sheet.attrib['name'].lower()
            if name not in HEADERS:
                continue
            require(name not in tables, 'Duplicate working tab: ' + name)
            target = rels[sheet.attrib['{' + document_relationships + '}id']]
            target = target.lstrip('/') if target.startswith('/') else 'xl/' + target
            rows = []
            for row in ET.fromstring(archive.read(target)).findall('s:sheetData/s:row', ns):
                cells = {}
                for cell in row.findall('s:c', ns):
                    require(cell.find('s:f', ns) is None, f'{name}!{cell.attrib.get("r")}: formulas are not accepted in import cells; paste verified values')
                    address = re.match(r'([A-Z]+)', cell.attrib['r'])[1]
                    column = 0
                    for character in address:
                        column = column * 26 + ord(character) - 64
                    value = cell.find('s:v', ns)
                    if cell.attrib.get('t') == 'inlineStr':
                        value = ''.join(cell.find('s:is', ns).itertext())
                    elif cell.attrib.get('t') == 's':
                        value = strings[int(value.text)] if value is not None else ''
                    else:
                        value = value.text if value is not None and value.text else ''
                    cells[column - 1] = value.strip()
                if any(cells.values()):
                    rows.append(cells)
            require(rows, 'Missing headers in ' + name)
            header = [rows[0].get(i, '') for i in range(max(rows[0]) + 1)]
            require(set(header) == set(HEADERS[name]) and len(header) == len(set(header)), name + ': headers differ from the template')
            tables[name] = []
            for cells in rows[1:]:
                require(all(index < len(header) or not value for index, value in cells.items()), name + ': unexpected data outside the table')
                tables[name].append({key: cells.get(i, '') for i, key in enumerate(header)})
        require(set(tables) == set(HEADERS), 'Workbook needs Assignments, Specifications, Compatibility and Parts tabs')
        return tables


def write_tables(directory, tables):
    directory = Path(directory)
    directory.mkdir(parents=True, exist_ok=True)
    for name, headers in HEADERS.items():
        path = directory / (name + '.csv')
        require(not path.exists(), f'{path} already exists. Export to a new directory to preserve your edits.')
    for name, headers in HEADERS.items():
        with (directory / (name + '.csv')).open('w', encoding='utf-8-sig', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=headers)
            writer.writeheader()
            for row in tables[name]:
                writer.writerow({key: encode_cell(str(row.get(key, ''))) for key in headers})


def lines(value):
    return [part.strip() for part in value.splitlines() if part.strip()]


def validate(tables):
    groups = {name: {} for name in FEATURES}
    for feature in FEATURES:
        for number, row in enumerate(tables[feature], 2):
            key = row['set_key']
            require(KEY.fullmatch(key) and len(key) <= 100, f'{feature}:{number}: set_key must be a short lowercase key with hyphens')
            if feature == 'specifications':
                require(KEY.fullmatch(row['code']) and len(row['code']) <= 64, f'{feature}:{number}: code must be lowercase with hyphens')
                group = groups[feature].setdefault(key, [])
                require(not any(old['code'] == row['code'] for old in group), f'{feature}:{number}: duplicate code {row["code"]} in {key}')
                group.append({field: row[field] for field in ['code', 'label', 'value']})
                require(len(group) <= 20, f'{feature}:{number}: a set can contain at most 20 rows')
            else:
                require(key not in groups[feature], f'{feature}:{number}: duplicate set_key {key}')
                values = {field: (lines(row[field]) if field in LISTS else row[field]) for field in HEADERS[feature][1:]}
                values['entry_name'] = values['entry_name'] or key
                for field, value in values.items():
                    if field in LISTS:
                        require(len(value) <= 10, f'{feature}:{number}: {field} can contain at most 10 lines')
                    if field in PRODUCT_LISTS:
                        require(len(value) == len(set(value)), f'{feature}:{number}: duplicate handle in {field}')
                        require(all(KEY.fullmatch(handle) for handle in value), f'{feature}:{number}: product links use handles, one per line')
                if feature == 'parts':
                    require(not set(values['required_products']) & set(values['optional_products']), f'parts:{number}: a linked product cannot be both required and optional')
                if feature == 'compatibility' and values['reference_url']:
                    url = urlsplit(values['reference_url'])
                    require(url.scheme in ['http', 'https'] and url.netloc and not url.username and not url.password, f'compatibility:{number}: reference_url must be a public HTTP(S) URL without credentials')
                groups[feature][key] = values
    owners = set()
    require(len(tables['assignments']) <= 500, 'First version supports up to 500 assignment rows per plan. Split the product family into smaller batches.')
    for number, row in enumerate(tables['assignments'], 2):
        require(KEY.fullmatch(row['product_handle']), f'assignments:{number}: enter the product handle, not its title or full URL')
        require(not row['variant_id'] or re.fullmatch(r'(?:gid://shopify/ProductVariant/)?[1-9][0-9]*', row['variant_id']), f'assignments:{number}: keep variant_id as exported text, without scientific notation')
        target = (row['product_handle'], row['variant_id'], row['variant_sku'])
        require(target not in owners, f'assignments:{number}: duplicate target')
        owners.add(target)
        for feature in FEATURES:
            value = row[feature]
            require(not value or value in groups[feature], f'assignments:{number}: unknown {feature} set {value!r}. Blank means leave unchanged; deletions are made in Shopify.')
    return groups


def object_fields(obj):
    return {field['key']: field['value'] for field in obj['fields']}


def canonical_fields(feature, fields):
    names = ['code', 'label', 'value'] if feature == 'specifications' else HEADERS[feature][1:]
    result = {}
    for name in names:
        value = fields.get(name, '[]' if name in LISTS else '')
        if name in LISTS:
            if value is None:
                value = []
            if isinstance(value, str):
                value = json.loads(value)
            if value is None:
                value = []
            result[name] = value
        else:
            result[name] = value or ''
    return result


def active(obj):
    status = (obj.get('capabilities') or {}).get('publishable')
    return status is None or status['status'] == 'ACTIVE'


class Shopify:
    def __init__(self, store, command='shopify'):
        require(re.fullmatch(r'[a-z0-9][a-z0-9-]*\.myshopify\.com', store), 'Use the exact store.myshopify.com domain without a URL scheme')
        self.store = store
        self.command = command

    def query(self, query, variables=None, mutation=False):
        with tempfile.TemporaryDirectory(prefix='siftwell-catalog-') as temporary:
            directory = Path(temporary)
            save(directory / 'variables.json', variables or {})
            (directory / 'query.graphql').write_text(query)
            cmd = [self.command, 'store', 'execute', '--store', self.store, '--version', API_VERSION,
                   '--query-file', str(directory / 'query.graphql'), '--variable-file', str(directory / 'variables.json'),
                   '--json', '--output-file', str(directory / 'result.json')]
            if mutation:
                cmd.append('--allow-mutations')
            result = subprocess.run(cmd, text=True, capture_output=True, env=dict(os.environ, SHOPIFY_CLI_NO_ANALYTICS='1', OPT_OUT_INSTRUMENTATION='true'))
            require(result.returncode == 0, 'Shopify CLI request failed. Confirm the selected store, login and required scopes.\n' + result.stderr[-3000:])
            data = json.loads((directory / 'result.json').read_text())
            require(not data.get('errors'), 'Shopify API errors: ' + json.dumps(data.get('errors')))
            for value in data.values():
                if isinstance(value, dict):
                    require(not value.get('userErrors'), 'Shopify rejected the change: ' + json.dumps(value.get('userErrors')))
            return data


OBJECT_FRAGMENT = 'id type handle fields { key value } capabilities { publishable { status } }'


def field_selection(namespace):
    output = []
    for feature in FEATURES:
        references = 'references(first:20) { nodes { ... on Metaobject { ' + OBJECT_FRAGMENT + ' } } pageInfo { hasNextPage } }' if feature == 'specifications' else 'reference { ... on Metaobject { ' + OBJECT_FRAGMENT + ' } }'
        output.append(feature + ': metafield(namespace:' + json.dumps(namespace) + ',key:' + json.dumps(feature) + ') { id type value compareDigest ' + references + ' }')
    return ' '.join(output)


def snapshot(client, handles, namespace='siftwell'):
    require(re.fullmatch(r'[A-Za-z0-9_-]{3,255}', namespace), 'Invalid metafield namespace')
    state = {'version': VERSION, 'store': client.store, 'namespace': namespace, 'products': {}, 'objects': {}, 'definitions': {}}
    require(len(handles) <= 100, 'Use at most 100 product handles per batch')
    selection = field_selection(namespace)
    for handle in sorted(set(handles)):
        require(KEY.fullmatch(handle), 'Invalid product handle: ' + handle)
        data = client.query('query($search:String!){ shop { myshopifyDomain } products(first:2,query:$search){nodes{id handle title status ' + selection + ' variants(first:10){nodes{id title sku ' + selection + '}pageInfo{hasNextPage endCursor}}}}}', {'search': 'handle:' + handle})
        require(data['shop']['myshopifyDomain'] == client.store, 'Authenticated store does not match the requested store')
        found = [product for product in data['products']['nodes'] if product['handle'] == handle]
        require(len(found) == 1, f'Product {handle!r} was not uniquely found')
        product = found[0]
        page = product['variants']['pageInfo']
        while page['hasNextPage']:
            extra = client.query('query($id:ID!,$after:String!){product(id:$id){variants(first:10,after:$after){nodes{id title sku ' + selection + '}pageInfo{hasNextPage endCursor}}}}', {'id': product['id'], 'after': page['endCursor']})['product']['variants']
            product['variants']['nodes'].extend(extra['nodes'])
            page = extra['pageInfo']
        product['variants'] = product['variants']['nodes']
        state['products'][handle] = product
        for owner in [product, *product['variants']]:
            for feature in FEATURES:
                field = owner.get(feature)
                if not field:
                    continue
                references = field.get('references')
                require(not references or not references['pageInfo']['hasNextPage'], f'{handle}: {feature} exceeds the theme rendering limit; edit it in Shopify first')
                for obj in ([field['reference']] if field.get('reference') else []) + (references['nodes'] if references else []):
                    if obj and obj.get('id'):
                        state['objects'][obj['id']] = obj
    for feature in FEATURES:
        definition = client.query('query($type:String!){metaobjectDefinitionByType(type:$type){id type fieldDefinitions{key required type{name}} access{storefront} capabilities{publishable{enabled}}}}', {'type': TYPES[feature]})['metaobjectDefinitionByType']
        state['definitions'][feature] = {'metaobject': definition, 'owners': {}}
        for owner in ['PRODUCT', 'PRODUCTVARIANT']:
            defs = client.query('query($owner:MetafieldOwnerType!,$namespace:String!,$key:String!){metafieldDefinitions(first:2,ownerType:$owner,namespace:$namespace,key:$key){nodes{type{name} validations{name value} access{storefront}}}}', {'owner': owner, 'namespace': namespace, 'key': feature})['metafieldDefinitions']['nodes']
            state['definitions'][feature]['owners'][owner] = defs
    # Resolve native product-reference GIDs into friendly handles for export.
    ids = set()
    for obj in state['objects'].values():
        if obj['type'] == TYPES['parts']:
            fields = object_fields(obj)
            for name in PRODUCT_LISTS:
                ids.update(json.loads(fields.get(name, '[]')))
    state['linked_products'] = {}
    for offset in range(0, len(ids), 100):
        batch = sorted(ids)[offset:offset + 100]
        data = client.query('query($ids:[ID!]!){nodes(ids:$ids){...on Product{id handle title status}}}', {'ids': batch})
        for node in data['nodes']:
            if node:
                state['linked_products'][node['id']] = node
    return state


def export_tables(state):
    tables = {key: [] for key in HEADERS}
    seen = {key: {} for key in FEATURES}
    for handle, product in sorted(state['products'].items()):
        for owner in [product, *product['variants']]:
            row = {key: '' for key in HEADERS['assignments']}
            row.update(product_handle=handle)
            if owner is not product:
                row.update(variant_id=owner['id'], variant_sku=owner.get('sku', ''))
            for feature in FEATURES:
                field = owner.get(feature)
                if not field:
                    continue
                require(field['type'] == ('list.metaobject_reference' if feature == 'specifications' else 'metaobject_reference'), f'{handle}: unexpected {feature} metafield type')
                ids = json.loads(field['value']) if feature == 'specifications' else [field['value']]
                if not ids:
                    continue
                objects = []
                for oid in ids:
                    obj = state['objects'].get(oid)
                    require(obj and active(obj), f'{handle}: {feature} has an inaccessible or Draft entry; resolve it in Shopify before exporting')
                    require(obj['type'] == TYPES[feature], f'{handle}: unexpected saved-set type')
                    objects.append(obj)
                identity = tuple(ids)
                if identity not in seen[feature]:
                    key = (objects[0]['handle'][:70] + '-' + digest(ids)[:8]) if feature != 'specifications' else 'specs-' + digest(ids)[:12]
                    seen[feature][identity] = key
                    for obj in objects:
                        fields = canonical_fields(feature, object_fields(obj))
                        if feature == 'parts':
                            for name in PRODUCT_LISTS:
                                require(all(oid in state['linked_products'] for oid in fields[name]), f'{handle}: inaccessible linked extra; resolve it in Shopify first')
                                fields[name] = [state['linked_products'][oid]['handle'] for oid in fields[name]]
                        tables[feature].append({'set_key': key, **{name: '\n'.join(value) if isinstance(value, list) else value for name, value in fields.items()}})
                row[feature] = seen[feature][identity]
            tables['assignments'].append(row)
    validate(tables)
    return tables


def resolve_owner(row, state):
    product = state['products'].get(row['product_handle'])
    require(product, 'Missing product: ' + row['product_handle'])
    if not row['variant_id'] and not row['variant_sku']:
        return product, product
    variants = product['variants']
    if row['variant_id']:
        variants = [v for v in variants if v['id'].split('/')[-1] == row['variant_id'].split('/')[-1]]
    if row['variant_sku']:
        variants = [v for v in variants if v.get('sku') == row['variant_sku']]
    require(len(variants) == 1, f'{row["product_handle"]}: variant ID/SKU is missing, conflicting or ambiguous')
    return product, variants[0]


def check_definition(state, feature, variant):
    definition = state['definitions'][feature]
    meta = definition['metaobject']
    require(meta and meta['access']['storefront'] == 'PUBLIC_READ', f'{feature}: complete the native saved-set definition and storefront access first')
    definitions = definition['owners']['PRODUCTVARIANT' if variant else 'PRODUCT']
    expected = 'list.metaobject_reference' if feature == 'specifications' else 'metaobject_reference'
    require(len(definitions) == 1 and definitions[0]['type']['name'] == expected, f'{feature}: missing or incompatible product/variant metafield definition')
    require(definitions[0]['access']['storefront'] == 'PUBLIC_READ', f'{feature}: metafield must allow storefront access')
    require({'name': 'metaobject_definition_id', 'value': meta['id']} in definitions[0]['validations'], f'{feature}: metafield points to another saved-set definition')
    expected_fields = {'code': 'single_line_text_field', 'label': 'single_line_text_field', 'value': 'multi_line_text_field'} if feature == 'specifications' else {name: 'list.product_reference' if name in PRODUCT_LISTS else 'list.single_line_text_field' if name in LISTS else 'multi_line_text_field' if name == 'application_notes' else 'url' if name == 'reference_url' else 'single_line_text_field' for name in HEADERS[feature][1:]}
    actual = {f['key']: f['type']['name'] for f in meta['fieldDefinitions']}
    require(all(actual.get(key) == kind for key, kind in expected_fields.items()), f'{feature}: saved-set field keys/types differ from the supported structure')
    supported = set(expected_fields)
    require(not any(f['required'] and f['key'] not in supported for f in meta['fieldDefinitions']), f'{feature}: definition has extra required fields; extend the importer mapping before using it')


def build_plan(tables, state):
    groups = validate(tables)
    objects, changes, seen_owners = {}, [], set()
    catalog = {p['handle']: p for p in [*state['products'].values(), *state.get('linked_products', {}).values()]}
    shared_specs = {row['product_handle']: groups['specifications'][row['specifications']] for row in tables['assignments'] if not row['variant_id'] and not row['variant_sku'] and row['specifications']}
    for row in tables['assignments']:
        product, owner = resolve_owner(row, state)
        require(owner['id'] not in seen_owners, 'Two rows resolve to the same product or variant')
        seen_owners.add(owner['id'])
        for feature in FEATURES:
            key = row[feature]
            if not key:
                continue  # A blank assignment never clears existing data.
            check_definition(state, feature, owner is not product)
            desired = groups[feature][key]
            values = desired if feature == 'specifications' else [desired]
            if feature == 'specifications' and owner is product:
                require(all(value['label'] and value['value'] for value in values), f'{key}: product specification rows need a label and value; blank values are only for deliberate variant suppression')
            elif feature == 'specifications':
                base = shared_specs.get(product['handle'])
                if base is None:
                    product_field = product.get('specifications')
                    base = [canonical_fields(feature, object_fields(state['objects'][oid])) for oid in json.loads(product_field['value']) if oid in state['objects']] if product_field else []
                codes = {item['code'] for item in base} or {'weight', 'material', 'fit', 'feature', 'best'}
                require(all(value['code'] in codes or value['label'] and value['value'] for value in values), f'{key}: a new variant specification needs both label and value; only shared codes can inherit labels or be suppressed')
            existing = owner.get(feature)
            existing_ids = (json.loads(existing['value']) if feature == 'specifications' else [existing['value']]) if existing else []
            refs = []
            for value in values:
                value = json.loads(json.dumps(value))
                if feature == 'parts':
                    for name in PRODUCT_LISTS:
                        for handle in value[name]:
                            require(handle in catalog and catalog[handle].get('status') == 'ACTIVE', f'{key}: linked product {handle!r} is missing or not Active')
                            require(catalog[handle]['id'] != product['id'], f'{key}: a product cannot be its own extra')
                        value[name] = [catalog[handle]['id'] for handle in value[name]]
                matching = sorted([obj for obj in state['objects'].values() if obj['type'] == TYPES[feature] and active(obj) and canonical_fields(feature, object_fields(obj)) == value], key=lambda obj: (obj['id'] not in existing_ids, obj['id']))
                if matching:
                    refs.append(matching[0]['id'])
                else:
                    symbolic = TYPES[feature] + ':siftwell-' + digest([feature, value])[:40]
                    publishable = state['definitions'][feature]['metaobject'].get('capabilities', {}).get('publishable', {}).get('enabled', False)
                    objects[symbolic] = {'type': TYPES[feature], 'handle': symbolic.split(':')[1], 'fields': value, 'publishable': publishable}
                    refs.append(symbolic)
            expected_type = 'list.metaobject_reference' if feature == 'specifications' else 'metaobject_reference'
            require(not existing or existing['type'] == expected_type, f'{feature}: existing assignment has an unexpected type')
            target = json.dumps(refs, separators=(',', ':')) if feature == 'specifications' else refs[0]
            old_value = existing['value'] if existing else None
            same = json.loads(old_value) == refs if feature == 'specifications' and old_value else old_value == target
            if same:
                continue
            previous_ids = (json.loads(old_value) if feature == 'specifications' else [old_value]) if old_value else []
            before_details = [canonical_fields(feature, object_fields(state['objects'][oid])) if oid in state['objects'] else {'unavailable_reference': oid} for oid in previous_ids]
            changes.append({'ownerId': owner['id'], 'product_handle': product['handle'], 'variant': '' if owner is product else owner['title'], 'namespace': state['namespace'], 'key': feature, 'type': expected_type, 'before': old_value, 'before_details': before_details, 'after': refs if feature == 'specifications' else refs[0], 'after_details': desired, 'compareDigest': existing['compareDigest'] if existing else None})
    return {'version': VERSION, 'store': state['store'], 'namespace': state['namespace'], 'tables': tables, 'objects': objects, 'changes': changes, 'baseline': digest(state)}


def refresh(client, tables, namespace):
    handles = {row['product_handle'] for row in tables['assignments']}
    for row in tables['parts']:
        for name in PRODUCT_LISTS:
            handles.update(lines(row[name]))
    state = snapshot(client, handles, namespace)
    plan = build_plan(tables, state)
    # A previous interrupted run may already have created the immutable entry.
    for symbolic, value in plan['objects'].items():
        existing = client.query('query($handle:MetaobjectHandleInput!){metaobjectByHandle(handle:$handle){' + OBJECT_FRAGMENT + '}}', {'handle': {'type': value['type'], 'handle': value['handle']}})['metaobjectByHandle']
        if existing:
            feature = next(f for f in FEATURES if TYPES[f] == existing['type'])
            require(active(existing) and canonical_fields(feature, object_fields(existing)) == value['fields'], 'A planned entry handle is occupied by different or Draft content. Review it in Shopify before retrying.')
            value['existing_id'] = existing['id']
    return state, plan


def preview(plan):
    output = [f'# Catalog changes for {plan["store"]}', '', f'New saved entries: {sum(not obj.get("existing_id") for obj in plan["objects"].values())}', f'Changed assignments: {len(plan["changes"])}', '', 'Blank assignment cells leave Shopify unchanged. Existing shared entries, product copy, prices and stock are not edited.', 'New copies contain the supplied default-language values. Translations on existing entries do not move to new copies.', '']
    for change in plan['changes']:
        output += [f'## {change["product_handle"]}' + (f' / {change["variant"]}' if change['variant'] else ' / shared product details'), f'Feature: {change["key"]}', '', 'Before:', '```json', json.dumps(change['before_details'], ensure_ascii=False, indent=2), '```', 'After:', '```json', json.dumps(change['after_details'], ensure_ascii=False, indent=2), '```', '']
    output += ['A run can span several API requests. If interrupted, keep its receipt and create a fresh plan before retrying. No automatic rollback or deletion is performed.', '']
    return '\n'.join(output)


def apply_plan(client, saved, confirm, receipt_path):
    expected = {key: value for key, value in saved.items() if key != 'plan_id'}
    require(digest(expected) == saved.get('plan_id') == confirm, 'Plan confirmation does not match. Review the saved preview and use its full plan_id.')
    require(saved['store'] == client.store and saved['version'] == VERSION, 'Plan store/version mismatch')
    require(not Path(receipt_path).exists(), 'Receipt already exists. Choose a new receipt path; review the previous run before retrying.')
    current, rebuilt = refresh(client, saved['tables'], saved['namespace'])
    require(rebuilt == expected, 'Catalog facts or assignments changed since preview. Create and review a fresh plan.')
    receipt = {'store': client.store, 'plan_id': confirm, 'status': 'started', 'before': current, 'created': {}, 'assignments': []}
    save(receipt_path, receipt)  # Save the pre-change facts before any mutation.
    ids = {}
    try:
        for symbolic, obj in saved['objects'].items():
            if obj.get('existing_id'):
                ids[symbolic] = obj['existing_id']
                continue
            fields = [{'key': key, 'value': json.dumps(value, ensure_ascii=False) if isinstance(value, list) else value} for key, value in obj['fields'].items()]
            entry = {'type': obj['type'], 'handle': obj['handle'], 'fields': fields}
            if obj['publishable']:
                entry['capabilities'] = {'publishable': {'status': 'ACTIVE'}}
            result = client.query('mutation($metaobject:MetaobjectCreateInput!){metaobjectCreate(metaobject:$metaobject){metaobject{id}userErrors{field message code}}}', {'metaobject': entry}, mutation=True)
            ids[symbolic] = result['metaobjectCreate']['metaobject']['id']
            receipt['created'][symbolic] = ids[symbolic]
            save(receipt_path, receipt)
        updates = []
        for change in saved['changes']:
            after = change['after']
            value = json.dumps([ids.get(ref, ref) for ref in after], separators=(',', ':')) if isinstance(after, list) else ids.get(after, after)
            updates.append({key: change[key] for key in ['ownerId', 'namespace', 'key', 'type', 'compareDigest']} | {'value': value})
        for offset in range(0, len(updates), 25):
            batch = updates[offset:offset + 25]
            client.query('mutation($metafields:[MetafieldsSetInput!]!){metafieldsSet(metafields:$metafields){metafields{id key value compareDigest}userErrors{field message code}}}', {'metafields': batch}, mutation=True)
            receipt['assignments'].extend(batch)
            save(receipt_path, receipt)
        after, verification = refresh(client, saved['tables'], saved['namespace'])
        require(not verification['changes'] and not verification['objects'], 'Readback differs from the requested facts. Keep the receipt and inspect before retrying.')
        receipt.update(status='complete', readback_verified=True)
        save(receipt_path, receipt)
    except Exception as error:
        receipt.update(status='incomplete', error=str(error))
        save(receipt_path, receipt)
        raise
    return receipt


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['template', 'export', 'validate', 'plan', 'apply'])
    parser.add_argument('--store')
    parser.add_argument('--shopify', default='shopify', help='Path to the installed, authenticated official Shopify CLI')
    parser.add_argument('--namespace', default='siftwell')
    parser.add_argument('--handle', action='append', default=[])
    parser.add_argument('--input', type=Path)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--plan', type=Path)
    parser.add_argument('--confirm')
    parser.add_argument('--receipt', type=Path)
    args = parser.parse_args(argv)
    if args.action == 'template':
        require(args.out, '--out directory is required')
        write_tables(args.out, {name: [] for name in HEADERS})
    elif args.action == 'validate':
        require(args.input, '--input directory is required')
        tables = read_tables(args.input)
        validate(tables)
        print('CSV structure, limits, duplicate codes, set references and links passed. Store identity and existing definitions are checked by plan.')
    else:
        require(args.store, '--store is required')
        client = Shopify(args.store, args.shopify)
        if args.action == 'export':
            require(args.handle and args.out, '--handle and a new --out directory are required')
            require(not args.out.exists(), 'Export directory already exists. Choose a new directory to preserve edits and backups.')
            state = snapshot(client, args.handle, args.namespace)
            save(args.out / 'snapshot.json', state)
            tables = export_tables(state)
            write_tables(args.out, tables)
            print(f'Exported {len(tables["assignments"])} product/variant rows. Keep this directory private.')
        elif args.action == 'plan':
            require(args.input and args.out, '--input directory and --out plan.json are required')
            require(not args.out.exists(), 'Plan already exists. Use a new path so an approved preview cannot be replaced.')
            tables = read_tables(args.input)
            validate(tables)
            state, plan = refresh(client, tables, args.namespace)
            plan['plan_id'] = digest(plan)
            save(args.out, plan)
            args.out.with_suffix('.md').write_text(preview(plan))
            print(f'{len(plan["changes"])} changed assignments, {len(plan["objects"])} new or reusable entries. Preview: {args.out.with_suffix(".md")}\nplan_id: {plan["plan_id"]}')
        else:
            require(args.plan and args.confirm and args.receipt, '--plan, --confirm and a new --receipt path are required')
            receipt = apply_plan(client, json.loads(args.plan.read_text()), args.confirm, args.receipt)
            print(f'Completed and readback-verified {len(receipt["assignments"])} assignments. Receipt: {args.receipt}')


if __name__ == '__main__':
    try:
        main()
    except (Invalid, OSError, json.JSONDecodeError, zipfile.BadZipFile, ET.ParseError) as error:
        print('Catalog data: ' + str(error), file=sys.stderr)
        sys.exit(1)
