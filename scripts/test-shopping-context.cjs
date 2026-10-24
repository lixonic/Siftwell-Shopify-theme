// Render shopper-facing contexts; Shopify transport and recommendation relevance need store checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
// Shopify escapes ordinary translations before output; model that to catch double escaping.
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
engine.registerFilter('t', key => escapeHtml(key.split('.').reduce((value, part) => value?.[part], locale) || key));
engine.registerFilter('money_without_trailing_zeros', value => '$' + Number(value) / 100);
engine.registerFilter('placeholder_svg_tag', () => '<svg aria-hidden="true"></svg>');
engine.registerFilter('image_url', () => '/hero-fixture.jpg');
engine.registerFilter('image_tag', value => '<img src="' + value + '" width="1200" height="800" alt="Workshop">');
engine.registerTag('form', {
  parse(token, tokens) {
    this.templates = [];
    this.liquid.parser.parseStream(tokens).on('tag:endform', function () { this.stop(); }).on('template', template => this.templates.push(template)).start();
  },
  *render(context, emitter) {
    emitter.write('<form>');
    yield this.liquid.renderer.renderTemplates(this.templates, context, emitter);
    emitter.write('</form>');
  }
});
const render = (file, data) => {
  // These are Shopify global objects, available inside isolated render snippets.
  engine.options.globals = { settings: data.settings, routes: data.routes };
  return engine.parseAndRenderSync(fs.readFileSync(path.join(root, file), 'utf8')
    .replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, ''), data);
};
const product = { id: 12, title: 'Fixture socket set', url: '/products/fixture-socket-set', price: 8900, available: false, has_only_default_variant: true, selected_or_first_available_variant: { id: 34, available: false, price: 8900 } };
const data = {
  product, settings: { enable_compare: true, enable_finder: true }, section: { id: 'context-check', settings: {} },
  routes: { search_url: '/fr/search', collections_url: '/fr/collections', all_products_collection_url: '/fr/collections/all', product_recommendations_url: '/fr/recommendations/products' }
};
let html = render('snippets/product-card.liquid', data);
assert.ok(html.includes('data-compare-product'), 'Catalog comparison remains available');
assert.ok(!render('snippets/product-card.liquid', { ...data, show_compare: false }).includes('data-compare-product'));
assert.ok(!render('snippets/product-card.liquid', { ...data, settings: { enable_compare: false }, show_compare: true }).includes('data-compare-product'));
const recommend = settings => render('sections/product-recommendations.liquid', {
  ...data, section: { id: 'related-check', settings }, recommendations: { performed: true, products_count: 1, products: [product] }
});
assert.ok(!recommend({ intent: 'related' }).includes('data-compare-product'), 'Existing related sections default to discovery');
html = recommend({ intent: 'related', show_compare: true, heading: '<Other socket sets>' });
assert.ok(html.includes('data-compare-product') && html.includes('&lt;Other socket sets&gt;'));
assert.ok(html.includes('/fr/recommendations/products?'), 'Recommendation requests retain locale routes');
assert.ok(!recommend({ intent: 'complementary', show_compare: true }).includes('data-compare-product'), 'Accessories never inherit comparison');
assert.ok(recommend({ intent: 'complementary' }).includes(locale.products.complementary));
html = render('sections/hero.liquid', data);
assert.ok(html.includes('intro--compact-mobile') && html.includes('Auto parts &amp; accessories'));
assert.ok(!html.includes('&amp;amp;'), 'Translated shopping heading is escaped once');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One heading with responsive text');
assert.ok(html.includes('action="/fr/search"') && html.includes('href="/fr/collections"'));
assert.ok(html.indexOf('hero-search') < html.indexOf('hero-actions--mobile'), 'Mobile keyboard order follows search then help');
html = render('sections/hero.liquid', { ...data, section: { id: 'custom', settings: { mobile_heading: '<Find & compare parts>', image: 'fixture' } } });
assert.ok(html.includes('&lt;Find &amp; compare parts&gt;') && html.includes('<source media="(max-width: 760px)"'));
html = render('sections/hero.liquid', { ...data, section: { id: 'legacy', settings: { compact_mobile: false, image: 'fixture' } } });
assert.ok(!html.includes('intro--compact-mobile') && !html.includes('hero-actions--mobile') && !html.includes('<picture'));
html = render('sections/hero.liquid', { ...data, settings: { enable_finder: false } });
assert.ok(!html.includes('data-open-dialog="ProductFinder"') && html.includes('href="/fr/collections/all"'));
console.log('Shopping context render checks passed: compact/optional mobile intro, localized native routes, escaped headings and context-specific recommendation comparison.');

if (process.env.SIFTWELL_SHOPPING_PREVIEW_DIR) {
  const output = path.resolve(process.env.SIFTWELL_SHOPPING_PREVIEW_DIR);
  fs.mkdirSync(output, { recursive: true });
  const blocks = ['Daily driving', 'Road trips', 'Garage projects'].map((heading, index) => ({ settings: { heading, collection: { url: '/collections/fixture-' + index }, icon: 'compass' } }));
  const page = compact_mobile => {
    const hero = render('sections/hero.liquid', { ...data, section: { id: 'preview', settings: { compact_mobile, image: 'fixture', heading_line_1: 'FOR THE', heading: 'LONG <em>WAY.</em>', text: '<p>Tools and accessories for your car and garage.</p>' } } });
    const paths = render('sections/collection-links.liquid', { ...data, section: { settings: { compact_mobile }, blocks } });
    const cards = [product, { ...product, id: 13, title: 'Fixture tyre inflator' }].map(item => render('snippets/product-card.liquid', { ...data, product: item })).join('');
    return '<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="' + path.join(root, 'assets/theme.css') + '"><style>:root{--paper:#f6f6f2;--ink:#1d2222;--panel:#242b29;--panel-ink:#fff;--panel-muted:#bcc8c0;--muted:#66706d;--accent:#e96836;--accent-ink:#1c2520;--line:#d8dcd5;--radius:2px;--page-width:1500px;--body-font:Arial,sans-serif;--heading-font:Arial,sans-serif;--sans:Arial,sans-serif;--display:Arial,sans-serif;--body-weight:400;--heading-weight:700}.fixture-header{height:72px;padding:18px 24px;border-bottom:1px solid var(--line)}.product-media{aspect-ratio:1/1}.hero-image{background:var(--media,#e3e8e3)}</style><body data-preset="auto"><header class="fixture-header">Siftwell local layout fixture</header><main class="main">' + hero + paths + '<section class="page-width"><h2>All products</h2><div class="product-grid">' + cards + '</div></section></main></body></html>';
  };
  fs.writeFileSync(path.join(output, 'compact.html'), page(true));
  fs.writeFileSync(path.join(output, 'legacy.html'), page(false));
}
