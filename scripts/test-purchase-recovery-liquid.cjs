const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {Liquid} = require('liquidjs');
const root = path.join(__dirname, '..');
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json')));
const engine = new Liquid({root:path.join(root, 'snippets'), extname:'.liquid'});
require('./liquid-doc.cjs')(engine);
engine.registerFilter('t', key => key.split('.').reduce((value, part) => value?.[part], locale) || key);
for (const filter of ['money', 'money_without_trailing_zeros', 'money_with_currency']) engine.registerFilter(filter, price => '$' + price / 100);
engine.registerFilter('placeholder_svg_tag', () => '<svg></svg>');
const routes = {search_url:'/fr/search', all_products_collection_url:'/fr/collections/all', cart_url:'/fr/cart', cart_change_url:'/fr/cart/change'};
const render = (file, data) => {
  engine.options.globals = {routes};
  return engine.parseAndRenderSync(fs.readFileSync(path.join(root, file), 'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, ''), data);
};
const variant = {id:22, title:'24 V <kit>', available:true, price:12000, quantity_rule:{min:1, increment:1}, selling_plan_allocations:[]};
const product = {id:9, title:'Inflator <test>', url:'/fr/products/inflator', has_only_default_variant:false, selected_or_first_available_variant:variant};
let html = render('snippets/mobile-purchase-bar.liquid', {product, variant, form_id:'ProductForm-test'});
assert.ok(html.includes('form="ProductForm-test" name="add"') && html.includes('data-mobile-purchase-bar'));
assert.ok(!html.includes('<form'), 'Reuses the existing form, no second purchase payload');
assert.ok(html.includes('Inflator &lt;test&gt;') && html.includes('24 V &lt;kit&gt;') && html.includes('$120'));
assert.ok(html.includes('hidden>'), 'No-JS clients do not see a detached action');
for (const unavailable of [null, {...variant, available:false}, {...variant, requires_selling_plan:true}]) {
  html = render('snippets/mobile-purchase-bar.liquid', {product, variant:unavailable, form_id:'f'});
  assert.match(html, /name="add"\s+disabled/);
}
const subscription = {...variant, requires_selling_plan:true, selling_plan_allocations:[{price:9000, selling_plan:{id:88}}]};
html = render('snippets/mobile-purchase-bar.liquid', {product, variant:subscription, form_id:'f'});
assert.ok(html.includes('$90') && !/name="add"\s+disabled/.test(html));

html = render('sections/cart-variant.liquid', {product});
assert.ok(html.includes('data-product-id="9"') && html.includes('data-variant-id="22"') && html.includes('data-plan-ids="[]"'));
assert.ok(html.includes('data-save-cart-variant disabled') && !html.includes('<form'));
const item = {key:'key', product, variant, properties:[], quantity:1, original_price:12000, final_price:12000};
const cartMarkup = extra => render('snippets/cart-content.liquid', {cart:{items:[{...item,...extra}], item_count:1, total_price:12000}, section:{id:'cart'}});
assert.ok(cartMarkup({}).includes('data-edit-cart-item'), 'Ordinary variants can be edited');
for (const extra of [{product:{...product,'gift_card?':true}}, {product:{...product,has_only_default_variant:true}}, {item_components:[{}]}, {parent_relationship:{parent:'key'}}]) assert.ok(!cartMarkup(extra).includes('data-edit-cart-item'));
assert.ok(render('snippets/cart-content.liquid', {cart:{'empty?':true}, section:{id:'cart'}}).includes('data-cart-undo'), 'Undo remains available after removing the final item');

const search = {terms:'DC <plug> & "24"', types:['product'], filters:[]};
html = render('snippets/search-recovery.liquid', {search, section:{id:'search'}});
assert.ok(html.includes('DC &lt;plug&gt; &amp; &#34;24&#34;'));
assert.ok(html.includes('href="#Search-search"') && html.includes('/fr/collections/all'));
assert.ok(!html.includes('Search without filters'));
for (const filters of [[{active_values:[{value:'x'}]}], [{type:'price_range', min_value:{value:0}, max_value:{value:null}}]]) {
  html = render('snippets/search-recovery.liquid', {search:{...search, filters}, section:{id:'search'}});
  assert.ok(html.includes('Search without filters'));
  const url = new URL(/class="primary-button" href="([^"]+)"/.exec(html)[1].replaceAll('&amp;', '&'), 'https://example.test');
  assert.equal(url.pathname, '/fr/search'); assert.equal(url.searchParams.get('q'), search.terms); assert.equal(url.searchParams.get('type'), 'product');
  assert.ok(!html.includes('filter.v.'), 'Clears restrictions without discarding the query');
}
html = render('sections/search-suggestions.liquid', {predictive_search:{performed:true, resources:{queries:[{url:'/fr/search?q=socket',text:'<socket>'}],collections:[{url:'/fr/collections/tools',title:'Tools & more'}],products:[]}}});
assert.ok(html.includes('&lt;socket&gt;') && html.includes('Tools &amp; more') && html.includes('href="/fr/collections/tools"'));
assert.ok(!html.includes('Products to explore'));
assert.ok(!render('sections/search-suggestions.liquid', {predictive_search:{performed:true,resources:{queries:[],collections:[],products:[]}}}).includes('<a'));
console.log('Purchase/recovery Liquid checks passed: native form reuse, stock/plan states, safe cart eligibility, empty-cart undo, localized query preservation and escaped suggestions.');
