// Render the actual shared resolvers; Shopify's native schema is a fixture.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
require('./liquid-doc.cjs')(engine);
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
engine.registerFilter('t', key => key.split('.').reduce((value, part) => value?.[part], locale) || key);
engine.registerFilter('handleize', value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
engine.registerFilter('metafield_text', field => field.display || field.value);
engine.registerFilter('structured_data', product => product.nativeSchema);
engine.registerTag('form', {
  parse(_token, tokens) {
    this.templates = [];
    this.liquid.parser.parseStream(tokens).on('tag:endform', function () { this.stop(); }).on('template', template => this.templates.push(template)).start();
  },
  *render(context, emitter) {
    emitter.write('<form>');
    yield this.liquid.renderer.renderTemplates(this.templates, context, emitter);
    emitter.write('</form>');
  }
});
const field = (value, type = 'single_line_text_field') => ({ type, value });
const row = (code, label, value) => ({ code: field(code), label: field(label), value: field(value, 'multi_line_text_field') });
const rows = value => field(value, 'list.metaobject_reference');
const reference = value => field(value, 'metaobject_reference');
const profile = extra => ({ entry_name: field('Private name'), ...extra });
const variant12 = { id: 12, title: '12 V', metafields: { siftwell: {} } };
const variant24 = { id: 24, title: '24 V', metafields: { siftwell: {
  specifications: rows([row('voltage', '', '24 V'), row('connector', '', ''), row('output', '', '300 W'), row('cable', 'Cable length', '2 m')]),
  compatibility: reference(profile({}))
} } };
const native = { '@context': 'http://schema.org/', '@type': 'ProductGroup', '@id': '/fr/products/inflator#product', name: 'Inflator', hasVariant: [12, 24].map(id => ({
  '@type': 'Product', '@id': `/fr/products/inflator?variant=${id}#variant`, name: `Inflator ${id} V`, sku: `SKU-${id}`,
  offers: { '@type': 'Offer', price: id === 12 ? '79.00' : '99.00', priceCurrency: 'EUR', availability: 'http://schema.org/OutOfStock', url: `https://example.com/fr/products/inflator?variant=${id}` }
})) };
const product = { id: 1, url: '/fr/products/inflator', title: 'Inflator', has_only_default_variant: false, nativeSchema: JSON.stringify(native), metafields: { siftwell: {
  specifications: rows([row('voltage', 'Input voltage', '12 V'), row('connector', 'Connector', 'DC plug'), row('output', 'Rated output', '150 W')]),
  compatibility: reference(profile({ requirements: field(['12 V supply', 'DC connection'], 'list.single_line_text_field'), exclusions: field(['24 V supply'], 'list.single_line_text_field'), application_notes: field('Read the manual.\nNo vehicle fit verified.', 'multi_line_text_field'), reference_url: field('https://example.com/manual?a=1&b=2', 'url') }))
} }, selected_or_first_available_variant: variant12 };
const source = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
function render(item = product, settings = {}, extra = {}, file = 'snippets/product-facts-jsonld.liquid') {
  engine.options.globals = { settings };
  return engine.parseAndRenderSync(source(file), { product: item, include_specifications: true, include_compatibility: true, ...extra });
}
function parse(html) {
  const match = /<script type="application\/ld\+json" data-product-facts-jsonld>([\s\S]*?)<\/script>/.exec(html);
  return match ? JSON.parse(match[1]) : null;
}
const values = (data, id) => data.additionalProperty.filter(property => property.propertyID === id).map(property => property.value);
const specs = data => data.additionalProperty.filter(property => property.propertyID.startsWith('siftwell.specification.')).map(({ name, value }) => [name, value]);
let data = parse(render());
assert.equal(data['@id'], native.hasVariant[0]['@id']);
assert.deepEqual(specs(data), [['Input voltage', '12 V'], ['Connector', 'DC plug'], ['Rated output', '150 W']]);
assert.deepEqual(values(data, 'siftwell.compatibility.requirement'), ['12 V supply', 'DC connection']);
assert.deepEqual(values(data, 'siftwell.compatibility.exclusion'), ['24 V supply']);
assert.equal(values(data, 'siftwell.compatibility.reference')[0], 'https://example.com/manual?a=1&b=2');
assert.ok(values(data, 'siftwell.compatibility.notice')[0].includes('Vehicle fit has not been checked'));
assert.ok(!('offers' in data) && !('hasVariant' in data) && !('name' in data), 'The extension does not create a competing product or offer');
const item24 = { ...product, selected_or_first_available_variant: variant24 };
data = parse(render(item24));
assert.equal(data['@id'], native.hasVariant[1]['@id']);
assert.deepEqual(specs(data), [['Input voltage', '24 V'], ['Rated output', '300 W'], ['Cable length', '2 m']]);
assert.deepEqual(values(data, 'siftwell.compatibility.status'), ['Compatibility not confirmed']);
assert.equal(values(data, 'siftwell.compatibility.requirement').length, 0);
assert.equal(values(data, 'siftwell.compatibility.reference').length, 0);
assert.ok(!JSON.stringify(data).includes('12 V') && !JSON.stringify(data).includes('DC plug'));

for (const override of [null, field('Wrong type'), reference(null)]) {
  const item = { ...item24, selected_or_first_available_variant: { ...variant24, metafields: { siftwell: { compatibility: override } } } };
  const output = parse(render(item));
  const assigned = override !== null;
  assert.equal(values(output, 'siftwell.compatibility.status').length, assigned ? 1 : 0, 'Inaccessible or mistyped assigned references stay unknown; no assignment inherits');
}
const missing = { ...product, metafields: {}, selected_or_first_available_variant: variant12 };
assert.equal(parse(render(missing)), null);
assert.equal(parse(render({ ...product, selected_or_first_available_variant: null })), null);
assert.deepEqual(values(parse(render(missing, { compatibility_show_empty: true })), 'siftwell.compatibility.status'), ['Compatibility not confirmed']);
assert.equal(parse(render(product, {}, { include_specifications: false, include_compatibility: false })), null);
assert.equal(parse(render(product, { enable_compatibility: false }, { include_specifications: false })), null);
assert.equal(parse(render({ ...product, nativeSchema: JSON.stringify({ '@id': '/changed-native-id' }) })), null, 'Unknown native identities never produce a detached Product');

const singleSchema = { '@context': 'http://schema.org/', '@type': 'Product', '@id': product.url + '#product', name: 'Inflator', offers: native.hasVariant[0].offers };
assert.equal(parse(render({ ...product, has_only_default_variant: true, nativeSchema: JSON.stringify(singleSchema) }))['@id'], singleSchema['@id']);
assert.equal(parse(render({ ...product, nativeSchema: JSON.stringify(native).replaceAll('/', '\\/') }))['@id'], native.hasVariant[0]['@id'], 'Escaped native identifiers still match');
const mapped = { ...product, metafields: { custom: { rows: product.metafields.siftwell.specifications, requirements: product.metafields.siftwell.compatibility } } };
assert.deepEqual(specs(parse(render(mapped, { spec_namespace: 'custom', spec_rows_key: 'rows', compatibility_namespace: 'custom', compatibility_key: 'requirements' }))), specs(parse(render(product))));
const legacy = { ...missing, metafields: { siftwell: { weight: { type: 'weight', value: 1, display: '1 kg' }, material: field('Steel') } } };
assert.ok(specs(parse(render(legacy))).some(([name, value]) => value === '1 kg'));
assert.ok(specs(parse(render(legacy))).some(([name, value]) => value === 'Steel'));

const hostile = '</script><script>alert("x")</script> & <b>use</b>\n, backslash \\ \u2028';
const escaped = { ...missing, metafields: { siftwell: { specifications: rows([row('safety', 'Use <care> & "tools"', hostile)]) } } };
const html = render(escaped);
assert.equal((html.match(/<script/g) || []).length, 1, 'Merchant text cannot terminate the JSON-LD script');
assert.deepEqual(specs(parse(html)), [['Use <care> & "tools"', hostile.trim()]]);
for (const url of ['javascript:alert(1)', '//example.com/manual', 'data:text/html,x']) {
  const item = { ...missing, metafields: { siftwell: { compatibility: reference(profile({ reference_url: field(url, 'url') })) } } };
  assert.equal(values(parse(render(item)), 'siftwell.compatibility.reference').length, 0);
}
const bounded = { ...missing, metafields: { siftwell: {
  specifications: rows(Array.from({ length: 21 }, (_, i) => row('code-' + i, 'Label ' + i, 'Value ' + i))),
  compatibility: reference(profile({ requirements: field(Array.from({ length: 11 }, (_, i) => 'Requirement ' + i), 'list.single_line_text_field') }))
} } };
assert.equal(specs(parse(render(bounded))).length, 20);
assert.equal(values(parse(render(bounded)), 'siftwell.compatibility.requirement').length, 10);
const duplicate = { ...missing, metafields: { siftwell: { specifications: rows([row('code', 'First', 'One'), row('code', 'Second', 'Two')]) } } };
assert.deepEqual(specs(parse(render(duplicate))), [['First', 'One']]);

// Preserve the complete platform JSON-LD, not just price fields we happen to know.
const metadata = render(product, {}, { request: { page_type: 'product' }, shop: {}, cart: {} }, 'snippets/meta-tags.liquid');
assert.deepEqual(JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(metadata)[1]), native);
const section = { id: 'main', blocks: [{ type: 'specifications' }, { type: 'compatibility' }] };
let page = render(item24, {}, { section }, 'sections/main-product.liquid');
assert.deepEqual(parse(page), parse(render(item24)), 'The actual product root contains the selected-variant extension for initial and section-rendered responses');
page = render(item24, {}, { section: { ...section, blocks: [] } }, 'sections/main-product.liquid');
assert.equal(parse(page), null, 'Removed blocks do not expose hidden facts in structured data');
page = render(item24, {}, { section: { ...section, blocks: [{ type: 'specifications' }] } }, 'sections/main-product.liquid');
assert.equal(values(parse(page), 'siftwell.compatibility.status').length, 0);
assert.equal(render(item24, {}, {}, 'sections/quick-view.liquid').includes('data-product-facts-jsonld'), false, 'A quick view does not add another product graph to a different page');
const originalNotice = locale.products.compatibility.unknown_help;
locale.products.compatibility.unknown_help = 'Ask for "fit" & don\'t assume <anything>.';
engine.registerFilter('t', key => String(key.split('.').reduce((value, part) => value?.[part], locale) || key).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch]));
data = parse(render(item24));
assert.equal(data.additionalProperty.find(p => p.propertyID === 'siftwell.compatibility.status').name, 'Compatibility & requirements');
assert.deepEqual(values(data, 'siftwell.compatibility.notice'), [locale.products.compatibility.unknown_help], 'HTML-escaped translations become plain JSON text');
locale.products.compatibility.unknown_help = originalNotice;
console.log('Product fact JSON-LD passed: native identity/commerce preservation, selected variants, suppression, unknown states, mappings, disabled blocks, limits, script safety and actual product-section output.');
