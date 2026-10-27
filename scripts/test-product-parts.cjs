const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
require('./liquid-doc.cjs')(engine);
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
engine.registerFilter('t', key => escapeHtml(key.split('.').reduce((value, part) => value?.[part], locale) || key));
engine.registerFilter('money_without_trailing_zeros', value => '$' + Number(value) / 100);
engine.registerFilter('placeholder_svg_tag', () => '<svg aria-hidden="true"></svg>');
engine.registerFilter('payment_terms', () => '');
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
const field = (value, type = 'list.single_line_text_field') => ({ type, value });
const reference = value => field(value, 'metaobject_reference');
const linked = value => field(value, 'list.product_reference');
const adapter = { id: 71, title: 'Adapter & lead', url: '/fr/products/adapter' };
const caseProduct = { id: 72, title: 'Carry case', url: '/fr/products/case' };
const shared = {
  entry_name: field('Private setup name', 'single_line_text_field'),
  included_items: field(['Inflator × 1', 'Hose × 1', '  ']),
  required_extras: field(['Suitable 12 V supply (not included)']),
  optional_extras: field(['Work gloves']),
  required_products: linked([adapter]), optional_products: linked([caseProduct])
};
const version24 = { included_items: field(['24 V inflator × 1']), optional_extras: field(['24 V storage sleeve']) };
const variant = { id: 12, title: '12 V', available: false, price: 9900, quantity_rule: { min: 1, increment: 1 }, metafields: { siftwell: {} } };
const product = { id: 10, title: 'Workshop inflator', url: '/products/inflator', description: '', media: [], has_only_default_variant: false, metafields: { siftwell: { parts: reference(shared) } }, selected_or_first_available_variant: variant };
const renderFile = (file, item = product, settings = {}, extra = {}) => {
  engine.options.globals = { settings, routes: { all_products_collection_url: '/fr/collections/all' } };
  const source = fs.readFileSync(path.join(root, file), 'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
  return engine.parseAndRenderSync(source, { product: item, section: { id: 'main', blocks: [{ type: 'title' }, { type: 'parts' }] }, ...extra });
};
const render = (item = product, settings = {}, extra = {}) => renderFile('snippets/product-parts.liquid', item, settings, extra);
const withSet = set => ({ ...product, metafields: { siftwell: { parts: reference(set) } } });
const withVariantSet = set => ({ ...product, selected_or_first_available_variant: { ...variant, id: 24, title: '24 V', metafields: { siftwell: { parts: reference(set) } } } });
let html = render();
assert.ok(html.includes('Inflator × 1') && html.includes('Suitable 12 V supply') && html.includes('Work gloves'));
assert.ok(html.includes('data-parts-included') && html.includes('data-parts-required') && html.includes('data-parts-optional'));
assert.ok(html.includes('For <strong>12 V</strong>') && html.includes('data-parts-variant="12"'));
assert.ok(html.includes('href="/fr/products/adapter"') && html.includes('Adapter &amp; lead'), 'Native product URLs retain their locale and titles are escaped');
assert.ok(html.includes('Included parts &amp; extras') && !html.includes('&amp;amp;'), 'Shopify translations are escaped only once');
assert.ok(!html.includes('Private setup name') && !html.includes('<li></li>'));
assert.equal((html.match(/<li[ >]/g) || []).length, 6);
html = render(withVariantSet(version24));
assert.ok(html.includes('24 V inflator') && html.includes('24 V storage sleeve'));
assert.ok(!html.includes('Hose') && !html.includes('12 V') && !html.includes('/adapter') && !html.includes('data-parts-required'), 'Variant details replace the complete shared set');
for (const value of [{ entry_name: field('Pending', 'single_line_text_field') }, null, {}]) {
  assert.equal(render(withVariantSet(value)).trim(), '', 'Empty or inaccessible variant references hide the block without shared fallback');
}
const missing = { ...product, metafields: {} };
assert.equal(render(missing).trim(), '');
assert.ok(render({ ...missing, selected_or_first_available_variant: withVariantSet(version24).selected_or_first_available_variant }).includes('24 V inflator'), 'Variant-only data works without product data');
assert.equal(render({ ...product, selected_or_first_available_variant: null }).trim(), '', 'An invalid option combination shows no previous version’s contents');
assert.equal(render(product, { enable_parts: false }).trim(), '');
assert.equal(render(null).trim(), '');
assert.equal(render({ ...product, selected_or_first_available_variant: { ...variant, metafields: { siftwell: { parts: field('Incorrect field', 'single_line_text_field') } } } }).trim(), '', 'A malformed variant assignment cannot restore shared contents');
html = render({ ...product, metafields: { custom: { box: reference(shared) } } }, { parts_namespace: 'custom', parts_key: 'box' });
assert.ok(html.includes('Inflator × 1'), 'Existing suitable fields can be mapped');
html = render(withSet({ included_items: field(['<img src=x onerror=alert(1)> & hose']) }));
assert.ok(html.includes('&lt;img') && !html.includes('<img') && html.includes('&amp; hose'));
assert.ok(!html.includes('data-parts-required') && !html.includes('data-parts-optional') && !html.includes('parts-note'), 'Each group is independent; absent extras do not imply none are needed');
html = render({ ...withSet(shared), selected_or_first_available_variant: { ...variant, title: '<24 & 12>' } });
assert.ok(html.includes('&lt;24 &amp; 12&gt;'));
for (const set of [
  { included_items: field([' ']), required_products: linked([null, {}, { id: 99, title: 'Unpublished product' }, product]) },
  { included_items: field('Wrong type', 'single_line_text_field'), required_extras: field(['Wrong type'], 'list.url'), optional_products: field([adapter], 'list.metaobject_reference') }
]) assert.equal(render(withSet(set)).trim(), '', 'Blank, inaccessible, self-referencing and incorrectly typed entries stay hidden');
html = render(withSet({ required_products: linked([adapter, adapter]), optional_products: linked([adapter, caseProduct, caseProduct, product]) }));
assert.equal((html.match(/href="\/fr\/products\/adapter"/g) || []).length, 1);
assert.equal((html.match(/href="\/fr\/products\/case"/g) || []).length, 1);
assert.ok(!html.includes('href="/products/inflator"'), 'Duplicate links and the inspected product are omitted; required wins over optional');
html = render(withSet({ included_items: field(Array.from({ length: 11 }, (_, i) => 'Item ' + i)), optional_products: linked(Array.from({ length: 11 }, (_, i) => ({ id: 100 + i, title: 'Extra ' + i, url: '/products/extra-' + i }))) }));
assert.equal((html.match(/<li[ >]/g) || []).length, 20, 'Each text and product list is limited to its first ten entries');
assert.ok(!html.includes('Item 10') && !html.includes('Extra 10'));
assert.ok(render(product, {}, { heading_tag: 'h3' }).includes('<h4 class="parts-label">'));
assert.ok(render(product, {}, { heading_tag: '<script>' }).includes('<h2 class="parts-heading">'));
assert.ok(!render({ ...product, has_only_default_variant: true }).includes('parts-context'));
html = renderFile('sections/main-product.liquid');
assert.ok(html.includes('product-block--parts') && html.includes('data-product-parts'), 'The real product section includes the configurable block');
for (const item of [missing, withVariantSet(null)]) {
  html = renderFile('sections/main-product.liquid', item);
  assert.ok(!html.includes('product-block--parts') && !html.includes('data-product-parts'), 'An empty product block leaves no wrapper or spacing');
  assert.ok(!renderFile('sections/quick-view.liquid', item).includes('quick-parts'), 'An empty quick-view block leaves no wrapper');
}
html = renderFile('sections/quick-view.liquid');
assert.ok(html.includes('quick-parts') && html.includes('<h3 class="parts-heading">') && html.includes('<h4 class="parts-label">'), 'Quick view uses the same data with the correct heading levels');
assert.ok(!renderFile('sections/main-product.liquid', product, { enable_parts: false }).includes('product-block--parts'));
assert.ok(!renderFile('sections/quick-view.liquid', product, { enable_parts: false }).includes('quick-parts'));
console.log('Included-parts renders passed: shared/variant sets, empty/invalid states, independent groups, native links, duplicates, escaping, limits and real product/quick-view integration.');

// Optional private browser fixtures exercise the existing variant navigation using actual section output.
if (process.env.SIFTWELL_PARTS_PREVIEW_DIR) {
  const dir = path.resolve(process.env.SIFTWELL_PARTS_PREVIEW_DIR);
  fs.mkdirSync(dir, { recursive: true });
  const variants = { 12: product, 24: withVariantSet(version24), 48: withVariantSet(null), 99: { ...product, selected_or_first_available_variant: null } };
  for (const [id, item] of Object.entries(variants)) {
    const navigation = '<fieldset data-product-option><legend>Version (local fixture)</legend><div class="option-values">' + Object.keys(variants).map(value => '<a class="option-value" data-option-value-id="' + value + '" href="/products/inflator?variant=' + value + '"' + (value === id ? ' aria-current="true"' : '') + '>' + value + ' V</a>').join('') + '</div></fieldset>';
    for (const [context, file] of [['main', 'sections/main-product.liquid'], ['quick', 'sections/quick-view.liquid']]) {
      const content = renderFile(file, item).replace(/(<div class="(?:product-info|detail-copy product-info)">)/, '$1' + navigation);
      fs.writeFileSync(path.join(dir, context + '-' + id + '.html'), content);
    }
  }
}
