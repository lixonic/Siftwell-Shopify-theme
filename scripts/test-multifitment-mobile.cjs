const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');

const root = path.join(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
require('./liquid-doc.cjs')(engine);

const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
engine.registerFilter('t', key => escapeHtml(key.split('.').reduce((value, part) => value?.[part], locale) || key));
engine.registerFilter('handleize', value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
engine.registerFilter('metafield_text', field => field.display || field.value);
engine.registerFilter('money_without_trailing_zeros', value => '$' + Number(value) / 100);
engine.registerFilter('placeholder_svg_tag', () => '<svg aria-hidden="true"></svg>');
engine.registerFilter('payment_terms', () => '');
engine.registerFilter('structured_data', () => '{}');
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
const list = value => field(value, 'list.single_line_text_field');
const ref = value => field(value, 'metaobject_reference');
const row = (code, label, value) => ({ code: field(code), label: field(label), value: field(value, 'multi_line_text_field') });
const rows = items => field(items, 'list.metaobject_reference');
const linked = items => field(items, 'list.product_reference');

const clampKit = { id: 901, title: 'Vehicle-specific door-jamb clamp kit', url: '/products/door-jamb-clamp-kit' };
const lockCores = { id: 902, title: '4-pack keyed lock cylinders', url: '/products/keyed-lock-cylinders' };

const raisedVariant = {
  id: 301,
  title: 'Raised rails / 118 cm / Matte black',
  available: true,
  price: 22900,
  url: '/products/aerobar-crossbar-kit?variant=301',
  quantity_rule: { min: 1, increment: 1 },
  metafields: { siftwell: {} }
};

const bareRoofVariant = {
  id: 302,
  title: 'Bare roof / 127 cm / Matte black',
  available: true,
  price: 26900,
  url: '/products/aerobar-crossbar-kit?variant=302',
  quantity_rule: { min: 1, increment: 1 },
  metafields: {
    siftwell: {
      specifications: rows([
        row('dimensions', 'Dimensions', '1270 × 80 × 30 mm (bar span 127 cm)'),
        row('weight', 'Weight', '5.4 kg'),
        row('install', 'Installation', '25 min clamp-on; included 5 Nm torque key, no drilling')
      ]),
      compatibility: ref({
        requirements: list(['Smooth bare roof with rubber door-frame weatherstrip', 'Vehicle-specific clamp pad set for roof contour']),
        exclusions: list(['Vehicles with raised side rails', 'Glass panoramic roofs without factory mount zones']),
        application_notes: field('Install front bar 180 mm behind windshield header. Re-torque clamps after 50 km.', 'multi_line_text_field'),
        reference_url: field('https://example.com/fit-guide/aerobar-bare-roof', 'url'),
        reference_label: field('Bare-roof fitment chart')
      }),
      parts: ref({
        included_items: list(['2 × 127 cm anodized aluminum crossbars', '4 × bare-roof foot towers', '1 × 5 Nm torque key']),
        required_extras: list(['Vehicle-specific door-jamb clamp kit (sold separately)']),
        optional_extras: list(['Keyed lock cylinders (set of 4)']),
        required_products: linked([clampKit]),
        optional_products: linked([lockCores])
      })
    }
  }
};

const unconfirmedVariant = {
  id: 303,
  title: 'Flush rails / 127 cm / Silver',
  available: true,
  price: 25900,
  url: '/products/aerobar-crossbar-kit?variant=303',
  quantity_rule: { min: 1, increment: 1 },
  metafields: { siftwell: { compatibility: ref({}) } }
};

const longDescription = '<p>' + 'Detailed aerodynamic testing notes and long-form touring story. '.repeat(24) + '</p>';

const optionsWithValues = selectedMount => [
  {
    name: 'Roof mount',
    position: 1,
    values: [
      { id: 'm-raised', toString: () => 'Raised rails', available: true, selected: selectedMount === 'raised', variant: raisedVariant },
      { id: 'm-bare', toString: () => 'Bare roof', available: true, selected: selectedMount === 'bare', variant: bareRoofVariant },
      { id: 'm-flush', toString: () => 'Flush rails', available: true, selected: selectedMount === 'flush', variant: unconfirmedVariant }
    ]
  },
  {
    name: 'Bar length',
    position: 2,
    values: [
      { id: 'l-118', toString: () => '118 cm', available: true, selected: selectedMount === 'raised', variant: raisedVariant },
      { id: 'l-127', toString: () => '127 cm', available: true, selected: selectedMount !== 'raised', variant: bareRoofVariant }
    ]
  }
];

const productTemplate = JSON.parse(fs.readFileSync(path.join(root, 'templates/product.json'), 'utf8'));
const mainSectionConfig = productTemplate.sections.main;
const defaultBlocks = mainSectionConfig.block_order.map(id => ({ id, ...mainSectionConfig.blocks[id] }));

const multiFitmentProduct = (variant = raisedVariant, mount = 'raised') => ({
  id: 300,
  title: 'AeroBar Roof Rack Crossbar Kit',
  url: '/products/aerobar-crossbar-kit',
  description: longDescription,
  media: [],
  has_only_default_variant: false,
  options_with_values: optionsWithValues(mount),
  selected_or_first_available_variant: variant,
  metafields: {
    siftwell: {
      specifications: rows([
        row('dimensions', 'Dimensions', '1180 × 80 × 30 mm (bar span 118 cm)'),
        row('material', 'Material', '6063-T6 anodized aluminum & stainless steel clamps'),
        row('load', 'Dynamic load rating', '75 kg (verify vehicle roof limit)'),
        row('weight', 'Weight', '4.6 kg'),
        row('install', 'Installation', '15 min bolt-on; 5 Nm torque key included, no drilling')
      ]),
      compatibility: ref({
        requirements: list(['Factory raised side rails with ≥ 18 mm roof clearance', 'Outer rail span between 920 mm and 1120 mm']),
        exclusions: list(['Flush integrated rails', 'Bare roofs without side rails']),
        application_notes: field('Tighten clamp bolts evenly to 5 Nm with the supplied key.', 'multi_line_text_field'),
        reference_url: field('https://example.com/fit-guide/aerobar-raised', 'url'),
        reference_label: field('Raised-rail clearance guide')
      }),
      parts: ref({
        included_items: list(['2 × 118 cm anodized aluminum crossbars', '4 × raised-rail clamp feet', '1 × 5 Nm torque key']),
        optional_extras: list(['Keyed lock cylinders (set of 4)']),
        optional_products: linked([lockCores])
      })
    }
  }
});

const renderFile = (file, item, blocks = defaultBlocks, settings = {}) => {
  engine.options.globals = {
    settings: { page_width: 1440, enable_compare: true, ...settings },
    routes: { all_products_collection_url: '/collections/all', cart_url: '/cart', search_url: '/search' },
    cart: { taxes_included: false, item_count: 0 },
    shop: {}
  };
  const source = fs.readFileSync(path.join(root, file), 'utf8').replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '');
  return engine.parseAndRenderSync(source, {
    product: item,
    section: { id: 'main', settings: { show_mobile_purchase_bar: true }, blocks }
  });
};

// 1. Default product template block order surfaces compatibility right after options and structured facts ahead of long description.
const order = mainSectionConfig.block_order;
assert.equal(order.indexOf('compatibility'), order.indexOf('options') + 1, 'Compatibility sits immediately after variant options');
assert.ok(order.indexOf('compatibility') < order.indexOf('buy'), 'Compatibility appears before buy buttons');
assert.ok(order.indexOf('specifications') < order.indexOf('description'), 'Specifications appear ahead of long description');
assert.ok(order.indexOf('parts') < order.indexOf('description'), 'Box contents appear ahead of long description');

// 2. Render actual product page for multi-fitment variants and verify atomic switching and placement.
const raisedHtml = renderFile('sections/main-product.liquid', multiFitmentProduct(raisedVariant, 'raised'));
assert.ok(raisedHtml.includes('Factory raised side rails') && raisedHtml.includes('1180 × 80 × 30 mm') && raisedHtml.includes('6063-T6 anodized aluminum'));
assert.ok(raisedHtml.indexOf('variant-picker') < raisedHtml.indexOf('data-product-compatibility'));
assert.ok(raisedHtml.indexOf('data-product-compatibility') < raisedHtml.indexOf('product-block--buy_buttons'));
assert.ok(raisedHtml.indexOf('data-product-specifications') < raisedHtml.indexOf('product-description-panel'));
assert.ok(raisedHtml.indexOf('data-product-parts') < raisedHtml.indexOf('product-description-panel'));

const bareHtml = renderFile('sections/main-product.liquid', multiFitmentProduct(bareRoofVariant, 'bare'));
assert.ok(bareHtml.includes('Smooth bare roof') && bareHtml.includes('1270 × 80 × 30 mm') && bareHtml.includes('6063-T6 anodized aluminum'));
assert.ok(bareHtml.includes('Vehicle-specific door-jamb clamp kit') && bareHtml.includes('data-parts-required'));
assert.ok(!bareHtml.includes('Factory raised side rails') && !bareHtml.includes('1180 × 80 × 30 mm') && !bareHtml.includes('4 × raised-rail clamp feet'), 'Switching fitment options never leaks another variant’s fitment, dimensions, or box contents');

const unconfirmedHtml = renderFile('sections/main-product.liquid', multiFitmentProduct(unconfirmedVariant, 'flush'));
assert.ok(unconfirmedHtml.includes('data-compatibility-unknown') && !unconfirmedHtml.includes('Factory raised side rails'), 'Unconfirmed fitment shows explicit unknown state without shared fallback');

// 3. Unconfigured products emit zero empty compatibility, specification, or description wrappers.
const plainProduct = {
  id: 399, title: 'Shop towel pack', url: '/products/towels', description: '', media: [],
  has_only_default_variant: true, options_with_values: [],
  selected_or_first_available_variant: { id: 3991, title: 'Default Title', available: true, price: 1400, quantity_rule: { min: 1, increment: 1 }, metafields: {} },
  metafields: {}
};
const plainHtml = renderFile('sections/main-product.liquid', plainProduct);
assert.ok(!plainHtml.includes('product-block--compatibility') && !plainHtml.includes('product-block--specifications') && !plainHtml.includes('product-block--description') && !plainHtml.includes('product-block--parts'), 'Empty blocks leave no wrapper gaps on unconfigured products');

// 4. Quick view places options, compatibility, and specifications ahead of lengthy descriptions and omits empty wrappers.
const quickHtml = renderFile('sections/quick-view.liquid', multiFitmentProduct(bareRoofVariant, 'bare'));
assert.ok(quickHtml.indexOf('variant-picker') < quickHtml.indexOf('data-product-compatibility'));
assert.ok(quickHtml.indexOf('data-product-compatibility') < quickHtml.indexOf('data-product-specifications'));
assert.ok(quickHtml.indexOf('data-product-specifications') < quickHtml.indexOf('quick-description'), 'Quick view puts structured fitment and specs ahead of long descriptions');
const plainQuick = renderFile('sections/quick-view.liquid', plainProduct);
assert.ok(!plainQuick.includes('quick-compatibility') && !plainQuick.includes('quick-specifications') && !plainQuick.includes('quick-description'));

// 5. Mobile comparison and mobile navigation drawer markup and stylesheet protections.
const comparisonHtml = renderFile('snippets/comparison.liquid', multiFitmentProduct());
assert.ok(comparisonHtml.includes('class="comparison-scroll" tabindex="0"'), 'Comparison scroll container is keyboard focusable');
const themeCss = fs.readFileSync(path.join(root, 'assets/theme.css'), 'utf8');
const commerceCss = fs.readFileSync(path.join(root, 'assets/commerce.css'), 'utf8');
assert.ok(themeCss.includes('border-collapse:separate;border-spacing:0'), 'Sticky comparison column uses border-collapse: separate for cross-browser borders');
assert.ok(themeCss.includes('.compare-table :is(thead th:first-child,tbody th[scope=row])') && themeCss.includes('position:sticky;inset-inline-start:0'), 'Comparison row labels remain sticky while horizontally scrolling on phones');
assert.ok(themeCss.includes('scroll-padding-inline-start:96px'), 'Horizontal snap offsets clear the sticky comparison label column');
assert.ok(themeCss.includes('.compare-table :is(thead th:not(:first-child),tbody td)'), 'Product column headers are sized independently of the narrow row-label column');
assert.ok(themeCss.includes('width:min(320px,90vw)') && themeCss.includes('env(safe-area-inset-bottom)'), 'Mobile navigation drawer and compare controls respect narrow viewports and safe areas');
assert.ok(themeCss.includes('.catalog-row-title,.decision-card h3,.product-title{overflow-wrap:anywhere;text-wrap:pretty}'), 'Long product titles and unbroken SKUs wrap cleanly without ellipsis');
assert.ok(themeCss.includes('@supports(grid-template-rows:subgrid)') && themeCss.includes('.catalog-row .decision-meta{grid-row:4') && themeCss.includes('.decision-actions{grid-row:5'), 'Desktop catalog and decision cards use explicit subgrid row tracks so missing facts stay blank and baselines align');
assert.ok(commerceCss.includes('body.has-purchase-bar .mobile-compare:not([hidden])'), 'Mobile comparison trigger clears the mobile purchase bar');

console.log('Multi-fitment and mobile layout checks passed: inline fitment placement, atomic variant switching, quick-view hierarchy, empty-block omission, sticky comparison labels and mobile drawer bounds.');
