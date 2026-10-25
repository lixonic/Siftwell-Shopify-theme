// Shopify review fields are represented by explicit test fixtures, not customer reviews.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
const fixtureDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'siftwell-review-slot-'));
fs.writeFileSync(path.join(fixtureDirectory, 'qa-review-app.liquid'), '<div data-review-app-fixture>Review app test block</div>');
const engine = new Liquid({ root: [path.join(root, 'snippets'), fixtureDirectory], extname: '.liquid' });
require('./liquid-doc.cjs')(engine);
engine.registerFilter('t', (key, ...pairs) => {
  const args = Object.fromEntries(pairs.filter(Array.isArray));
  let value = key.split('.').reduce((item, part) => item?.[part], locale);
  if (value && typeof value === 'object') value = value[args.count === 1 ? 'one' : 'other'];
  return typeof value === 'string' ? value.replace(/{{\s*(\w+)\s*}}/g, (_, name) => String(args[name] ?? '')) : key;
});
engine.registerFilter('money_without_trailing_zeros', value => `$${Number(value) / 100}`);
engine.registerFilter('money', value => `$${Number(value) / 100}`);
engine.registerFilter('placeholder_svg_tag', () => '<svg aria-hidden="true"></svg>');
engine.registerFilter('payment_terms', () => '');
engine.registerFilter('payment_button', () => '');
engine.registerFilter('default_errors', () => '');
const render = (file, data) => engine.parseAndRenderSync(fs.readFileSync(path.join(root, file), 'utf8')
  .replace(/{%\s*schema\s*%}[\s\S]*?{%\s*endschema\s*%}/g, '')
  .replace(/{%\s*form\s+[^%]*%}/g, '<form data-test-product-form>')
  .replace(/{%\s*endform\s*%}/g, '</form>'), data);
// Includes use the original source. Shopify form transport and actual app-block
// initialization are not exercised by these source render checks.
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
const fields = (rating = 4.25, count = 23, max = 5, min = 1) => ({ reviews: {
  rating: { type: 'rating', value: { rating, scale_min: min, scale_max: max } },
  rating_count: { type: 'number_integer', value: count }
} });
const variant = { id: 1, available: false, price: 1900, quantity_rule: { min: 1, increment: 1 }, selling_plan_allocations: [] };
const product = { id: 1, title: 'Review test product', url: '/products/qa-only', price: 1900, available: false, has_only_default_variant: true,
  selected_or_first_available_variant: variant, media: [], options_with_values: [], metafields: fields() };
const section = { id: 'qa-only', settings: {}, blocks: [{ type: 'title' }, { type: 'rating' }, { type: 'price' }] };
const data = (metafields = fields(), show = true) => ({ product: { ...product, metafields }, section,
  settings: { show_product_ratings: show }, cart: {}, request: { design_mode: false }, routes: { all_products_collection_url: '/collections/all' } });
try {
  let html = render('snippets/product-rating.liquid', data());
  assert.ok(html.includes('Rated 4.3 out of 5') && html.includes('4.3/5') && html.includes('23 reviews'));
  assert.ok(html.includes('width:85%'), 'Stars retain the actual fractional average');
  assert.ok(/class="product-rating__stars" aria-hidden="true"/.test(html));
  assert.ok(/class="sr-only">Rated 4.3 out of 5<\/span><span dir="ltr" aria-hidden="true">4.3\/5/.test(html));
  assert.ok(!html.includes('<a') && !html.includes('tabindex'), 'No link to a review widget that might not exist');
  html = render('snippets/product-rating.liquid', data(fields(1, 1)));
  assert.ok(html.includes('1 review</span>') && html.includes('width:20%'));
  html = render('snippets/product-rating.liquid', data(fields(5, 1200)));
  assert.ok(html.includes('1200 reviews') && html.includes('width:100%'));
  html = render('snippets/product-rating.liquid', data(fields(8.5, 2, 10)));
  assert.ok(html.includes('8.5/10') && html.includes('Rated 8.5 out of 10'));
  assert.ok(!html.includes('product-rating__stars'), 'Do not misrepresent another scale as five stars');
  const missingCount = fields(); delete missingCount.reviews.rating_count;
  const missingRating = fields(); delete missingRating.reviews.rating;
  const wrongRatingType = fields(); wrongRatingType.reviews.rating.type = 'single_line_text_field';
  const wrongCountType = fields(); wrongCountType.reviews.rating_count.type = 'single_line_text_field';
  for (const empty of [{}, missingCount, missingRating, wrongRatingType, wrongCountType,
    fields(4, 0), fields(4, -1), fields(4, 1.5), fields(null, 2), fields('', 2),
    fields(6, 2), fields(-1, 2), fields(0, 2), fields(0, 2, 5, 0), fields('invalid', 2, 5, 0), fields(4, 2, 0), fields(4, 2, 5, 5)]) {
    assert.equal(render('snippets/product-rating.liquid', data(empty)).trim(), '', JSON.stringify(empty));
  }
  html = render('sections/main-product.liquid', data());
  assert.ok(html.indexOf('</h1>') < html.indexOf('product-rating'));
  assert.ok(html.includes('23 reviews') && html.includes('product-block--rating'));
  html = render('sections/main-product.liquid', data({}));
  assert.ok(!html.includes('product-rating') && !html.includes('product-block--rating'), 'No empty rating block or gap');
  for (const file of ['snippets/product-card.liquid', 'sections/quick-view.liquid']) {
    assert.ok(render(file, data()).includes('23 reviews'), file);
    assert.ok(!render(file, data(fields(), false)).includes('product-rating'), `${file}: disabled`);
    assert.ok(!render(file, data({})).includes('product-rating'), `${file}: no data`);
  }
  const appSlot = extra => render('sections/product-reviews.liquid', { ...data(), ...extra });
  assert.equal(appSlot({ section: { settings: {}, blocks: [] } }).trim(), '');
  html = appSlot({ section: { settings: { show_heading: true }, blocks: [] }, request: { design_mode: true } });
  assert.ok(html.includes('Customer reviews') && html.includes('Add a review app block'));
  html = appSlot({ section: { settings: { show_heading: true, heading: '<Custom reviews>' }, blocks: ['qa-review-app'] } });
  assert.ok(html.includes('&lt;Custom reviews&gt;') && html.includes('data-review-app-fixture'));
  html = appSlot({ section: { settings: { show_heading: false }, blocks: ['qa-review-app'] } });
  assert.ok(!html.includes('<h2>') && html.includes('data-review-app-fixture'));
  console.log('Rating render checks passed: empty/invalid data, fractional scales, plural labels, accessibility, optional surfaces and app slot (fixture only).');
  if (process.env.SIFTWELL_REVIEW_PREVIEW_DIR) {
    const output = path.resolve(process.env.SIFTWELL_REVIEW_PREVIEW_DIR);
    fs.mkdirSync(output, { recursive: true });
    const fixtures = [['Fractional average', fields()], ['One review', fields(1, 1)], ['Full average', fields(5, 1200)],
      ['Other rating scale', fields(8.5, 2, 10)], ['No review data', {}], ['Zero count', fields(4, 0)]];
    const narrowCard = `<section class="qa-sample"><h2>Narrow product-card fixture</h2><div style="width:136px;max-width:100%">${render('snippets/product-card.liquid', data(fields(4.25, 1200)))}</div></section>`;
    const samples = fixtures.map(([name, values]) => `<section class="qa-sample"><h2>${name}</h2>${render('snippets/product-rating.liquid', data(values))}</section>`).join('');
    fs.writeFileSync(path.join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Siftwell ratings — local QA fixtures</title><link rel="stylesheet" href="../../assets/theme.css"><style>:root{--paper:#f6f6f2;--ink:#1d2222;--muted:#66706d;--accent:#e96836;--line:#d8dcd5;--radius:4px;--body-font:Arial,sans-serif;--heading-font:Arial,sans-serif;--body-weight:400;--heading-weight:700}body{padding:32px;max-width:1000px;margin:auto}.qa-banner{border:2px solid currentColor;padding:16px;margin-bottom:32px}.qa-sample{padding:24px 0;border-top:1px solid var(--line)}h1{font-size:36px}h2{font-size:22px;margin-bottom:16px}</style><body><p class="qa-banner"><strong>Synthetic rating data — local test only.</strong> These are rendering fixtures, not customer reviews.</p><h1>Siftwell rating summaries</h1>${samples}${narrowCard}</body></html>`);
  }
} finally {
  fs.rmSync(fixtureDirectory, { recursive: true, force: true });
}
