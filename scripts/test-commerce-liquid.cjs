// Development-only render checks. Run npm ci, then npm test.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
engine.registerFilter('t', (key, argument) => `${key}${argument ? ` ${argument[1]}` : ''}`);
engine.registerFilter('money_without_trailing_zeros', value => `$${Number(value) / 100}`);
engine.registerFilter('money', value => `$${Number(value) / 100}`);
engine.registerFilter('money_with_currency', value => `$${Number(value) / 100} TEST`);
engine.registerFilter('payment_button', () => '<payment-button>');
engine.registerFilter('payment_terms', () => '');
engine.registerFilter('default_errors', () => 'Recipient validation error');
engine.registerFilter('placeholder_svg_tag', () => '<svg></svg>');
const preprocess = source => source
  .replace(/{%\s*form\s+[^%]*%}/g, '<form data-test-product-form>')
  .replace(/{%\s*endform\s*%}/g, '</form>')
  .replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
// Shopify's form/schema tags and platform output filters are stubbed; all commerce
// branching, arithmetic, selection, escaping and render includes use the real sources.
engine.registerTag('form', {
  parse(token, tokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(tokens);
    stream.on('tag:endform', () => stream.stop()).on('template', template => this.templates.push(template)).start();
  },
  *render(context, emitter) {
    emitter.write('<form data-test-product-form>');
    yield this.liquid.renderer.renderTemplates(this.templates, context, emitter);
    emitter.write('</form>');
  }
});
const render = (file, data) => engine.parseAndRenderSync(preprocess(fs.readFileSync(path.join(root, file), 'utf8')), data);
const monthly = { selling_plan_group_id: 'group-a', selling_plan: { id: 11, name: 'Monthly <plan>' }, price: 1600, compare_at_price: 2000, unit_price: 800 };
const quarterly = { selling_plan_group_id: 'group-a', selling_plan: { id: 12, name: 'Quarterly' }, price: 1400, compare_at_price: 2000, unit_price: 700 };
const baseVariant = { id: 1, available: true, price: 2000, unit_price: 1000, unit_price_measurement: { reference_value: 1, reference_unit: 'l' }, requires_selling_plan: false, quantity_rule: { min: 1, increment: 1, max: null }, selling_plan_allocations: [monthly, quarterly], selected_selling_plan_allocation: null };
const baseProduct = { id: 9, title: 'Test product', url: '/products/test', available: true, has_only_default_variant: true, selling_plan_groups: [{ id: 'group-a', name: 'Delivery', selling_plans: [monthly.selling_plan, quarterly.selling_plan] }, { id: 'group-b', name: 'Other variant only', selling_plans: [{ id: 99, name: 'Ineligible' }] }] };
const dataFor = (variant = baseVariant, extra = {}) => ({ product: { ...baseProduct, selected_or_first_available_variant: variant }, variant, form_id: 'TestProductForm', has_quantity_input: true, form: {}, block: { settings: { show_dynamic_checkout: true, show_recipient: true } }, section: { id: 'test' }, cart: {}, routes: { all_products_collection_url: '/collections/all', cart_url: '/cart', cart_change_url: '/cart/change' }, ...extra });
const optionTags = html => html.match(/<option\b[^>]*>/g) || [];
const selectedValues = html => optionTags(html).filter(tag => /\sselected(?:\s|>)/.test(tag)).map(tag => /value="([^"]*)"/.exec(tag)[1]);
let html = render('snippets/buy-buttons.liquid', dataFor());
assert.deepEqual(selectedValues(html), ['']);
assert.ok(!html.includes('Ineligible') && !html.includes('Other variant only'));
assert.ok(html.includes('Monthly &lt;plan&gt; — $16'));
html = render('snippets/buy-buttons.liquid', dataFor({ ...baseVariant, selected_selling_plan_allocation: quarterly }));
assert.deepEqual(selectedValues(html), ['12']);
const requiredVariant = { ...baseVariant, requires_selling_plan: true };
html = render('snippets/buy-buttons.liquid', dataFor(requiredVariant));
assert.deepEqual(selectedValues(html), ['11']);
assert.ok(/<select[^>]+required/.test(html) && !html.includes('value=""'));
html = render('snippets/buy-buttons.liquid', dataFor({ ...requiredVariant, selling_plan_allocations: [] }));
assert.ok(/<button[^>]+name="add"[^>]+disabled/.test(html));
assert.ok(!html.includes('<payment-button>'));
html = render('snippets/buy-buttons.liquid', dataFor({ ...baseVariant, selling_plan_allocations: [] }));
assert.ok(!html.includes('name="selling_plan"'));
html = render('snippets/price.liquid', { target: monthly, unit: baseVariant });
assert.ok(html.includes('$16') && html.includes('$8 /') && !html.includes('$10 /'));
html = render('snippets/price.liquid', { target: { ...monthly, unit_price: 0 }, unit: baseVariant });
assert.ok(html.includes('$0 /'));
for (const file of ['sections/main-product.liquid', 'sections/quick-view.liquid']) {
  html = render(file, dataFor(requiredVariant, { section: { id: 'test', blocks: [{ type: 'price' }, { type: 'buy_buttons', settings: {} }] } }));
  assert.ok(html.includes('$16'), `${file} must show the required default allocation price`);
  assert.deepEqual(selectedValues(html), ['11']);
}
const itemFor = (quantity, rule = { min: 1, increment: 1, max: null }) => ({ key: 'test:key', quantity, product: baseProduct, variant: { ...baseVariant, quantity_rule: rule }, properties: [['Text', '<value>']], original_price: 2000, final_price: 2000 });
const buttonValue = (html, direction) => Number(new RegExp(`<button[^>]+value="(\\d+)"[^>]+data-quantity-step="${direction}"`).exec(html)[1]);
for (const [quantity, down, up] of [[5, 0, 10], [10, 5, 15], [12, 10, 15], [20, 15, 20]]) {
  html = render('snippets/cart-quantity.liquid', { item: itemFor(quantity, { min: 5, increment: 5, max: 20 }), item_index: 1, section_id: 'test' });
  assert.equal(buttonValue(html, '-1'), down);
  assert.equal(buttonValue(html, '1'), up);
  assert.ok(html.includes('min="0" step="1"') && html.includes('data-quantity-min="5"') && html.includes('data-quantity-increment="5"') && html.includes('max="20"'));
  assert.equal(/data-quantity-step="1"\s+disabled/.test(html), quantity === 20);
  assert.ok(html.includes('form="CartChange-test-1" name="quantity"'));
}
html = render('snippets/cart-quantity.liquid', { item: itemFor(1), item_index: 1, section_id: 'test' });
assert.equal(buttonValue(html, '-1'), 0);
assert.equal(buttonValue(html, '1'), 2);
const cartItem = itemFor(5, { min: 5, increment: 5, max: 20 });
html = render('snippets/cart-content.liquid', dataFor(baseVariant, { cart: { items: [cartItem], item_count: 5, total_price: 10000 }, cart_page: true }));
assert.ok(html.includes('<form id="CartChange-test-1" action="/cart/change" method="post"><input type="hidden" name="id" value="test:key"></form>'));
assert.ok(html.indexOf('</form>') < html.indexOf('id="CartForm-test"'));
html = render('snippets/cart-content.liquid', dataFor(baseVariant, { cart: { items: [{ ...cartItem, line_level_discount_allocations: [{ amount: 0, discount_application: { title: 'Zero allocation' } }, { amount: 1900, discount_application: { title: 'BOGO <free>' } }] }], item_count: 1, total_price: 0 }, cart_page: true }));
assert.ok(!html.includes('Zero allocation'));
assert.ok(html.includes('BOGO &lt;free&gt; (−$19)'));

for (const variant of [requiredVariant, { ...baseVariant, quantity_rule: { min: 5, increment: 5, max: 20 } }, { ...baseVariant, quantity_rule: { min: 1, increment: 1, max: 10 } }]) {
  html = render('snippets/product-card.liquid', dataFor(variant));
  assert.ok(!html.includes('data-test-product-form') && html.includes('<a class="quick-add"'));
}
html = render('snippets/product-card.liquid', dataFor());
assert.ok(html.includes('data-test-product-form'));
html = render('snippets/buy-buttons.liquid', dataFor({ ...baseVariant, quantity_rule: { min: 5, increment: 5, max: 20 } }, { has_quantity_input: false }));
assert.ok(html.includes('name="quantity" value="5"'));
const giftData = dataFor(baseVariant, { product: { ...baseProduct, 'gift_card?': true }, form: { email: 'invalid', name: '<Recipient>', message: '<Message>', send_on: '2026-12-01', errors: ['email'] } });
html = render('snippets/buy-buttons.liquid', giftData);
assert.ok(/<details class="recipient-fields"\s+open/.test(html));
assert.ok(/data-recipient-toggle\s+checked/.test(html));
assert.ok(html.includes('value="2026-12-01"') && html.includes('value="&lt;Recipient&gt;"') && html.includes('&lt;Message&gt;'));
assert.ok(html.includes('maxlength="255"') && html.includes('maxlength="200"') && html.includes('aria-invalid="true"'));
assert.ok(!html.includes('<payment-button>'));
html = render('snippets/buy-buttons.liquid', { ...giftData, block: undefined, quick_view: true, form: {} });
assert.ok(html.includes('data-recipient-toggle'));
// A missing combination must remain selected on a native navigation, including
// every other option; falling back to product.url silently selects the first variant.
const pickerProduct = { url: '/fr/products/test', has_only_default_variant: false, options_with_values: [
  { name: 'Fit', position: 1, values: [{ id: 200, selected: true, available: true, variant: { url: '/fr/products/test?variant=299&selling_plan=11' } }] },
  { name: 'Finish', position: 2, values: [{ id: 314, selected: true, available: true, variant: { url: '/fr/products/test?variant=299' } }, { id: 315, selected: false, available: false }] },
  { name: 'Size', position: 3, values: [{ id: 901, selected: true, available: true, variant: { url: '/fr/products/test?variant=299' } }] }
] };
html = render('snippets/variant-picker.liquid', { product: pickerProduct });
assert.ok(html.includes('href="/fr/products/test?option_values=200%2C315%2C901" data-option-value-id="315"'));
assert.ok(html.includes('href="/fr/products/test?variant=299&amp;selling_plan=11"'));
pickerProduct.options_with_values[1].values[1].product_url = '/fr/products/child';
html = render('snippets/variant-picker.liquid', { product: pickerProduct });
assert.ok(html.includes('href="/fr/products/child?option_values=200%2C315%2C901"'));
html = render('snippets/buy-buttons.liquid', dataFor(null));
assert.ok(/<button[^>]+name="add"[^>]+disabled/.test(html) && html.includes('products.unavailable'));
assert.ok(/name="id"[^>]+disabled/.test(html) && !html.includes('<payment-button>'));
console.log('Liquid commerce renders passed: eligible plans/defaults, allocation prices, native quantities, quick-add guards, and recipient state. Shopify form transport and storefront behavior still require live tests.');
