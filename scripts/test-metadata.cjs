// Shopify output filters are stubbed; Liquid branching and escaping use the source.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const engine = new Liquid();
engine.registerFilter('t', (key, pair) => key === 'general.page' ? `Page ${pair[1]}` : key);
engine.registerFilter('image_url', image => image.url);
engine.registerFilter('structured_data', product => JSON.stringify({ '@type': 'Product', name: product.title }));
const source = fs.readFileSync(path.join(__dirname, '../snippets/meta-tags.liquid'), 'utf8');
const base = {
  shop: { name: 'Workshop & Co', description: 'Tools for <b>daily use</b>', currency: 'EUR' },
  page_title: 'Sockets <strong> & spanners', current_page: 1,
  canonical_url: 'https://example.com/products/sockets?a=1&b=2',
  request: { page_type: 'product', origin: 'https://example.com' },
  product: { title: 'Sockets', price: 1999 }, cart: { currency: { iso_code: 'CAD' } },
  page_image: { url: '//cdn.example.com/tool.jpg', alt: 'Tool "detail"', width: 1200, height: 800 }
};
const render = extra => engine.parseAndRenderSync(source, { ...base, ...extra }).replace(/&#34;/g, '&quot;');
let html = render();
assert.ok(html.includes('<title>Sockets &lt;strong&gt; &amp; spanners — Workshop &amp; Co</title>'));
assert.ok(html.includes('rel="canonical" href="https://example.com/products/sockets?a=1&amp;b=2"'));
assert.ok(html.includes('content="Tools for daily use" name="description"'));
assert.ok(html.includes('content="product" property="og:type"'));
assert.ok(html.includes('content="19.99" property="og:price:amount"'));
assert.ok(html.includes('content="CAD" property="og:price:currency"'));
assert.ok(html.includes('content="https://cdn.example.com/tool.jpg" property="og:image:secure_url"'));
assert.ok(html.includes('content="Tool &quot;detail&quot;" name="twitter:image:alt"'));
assert.deepEqual(JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/.exec(html)[1]), { '@type': 'Product', name: 'Sockets' });

html = render({ page_title: 'Workshop & Co catalog', current_page: 3, page_image: null, request: { page_type: 'collection', origin: 'https://example.com' } });
assert.ok(html.includes('<title>Workshop &amp; Co catalog — Page 3</title>'));
assert.ok(html.includes('content="summary" name="twitter:card"'));
assert.ok(!html.includes('property="og:image"') && !html.includes('application/ld+json') && !html.includes('og:price:'));

html = render({ page_title: '', page_description: '  ', canonical_url: null, cart: {}, page_image: { ...base.page_image, url: 'https://cdn.example.com/secure.jpg', alt: '' } });
assert.ok(html.includes('<title>Workshop &amp; Co</title>'));
assert.ok(html.includes('content="EUR" property="og:price:currency"'));
assert.ok(html.includes('content="Workshop &amp; Co" name="description"'));
assert.ok(html.includes('content="Workshop &amp; Co" property="og:image:alt"'));
assert.ok(!html.includes('https:https:'));

html = render({ request: { page_type: 'password', origin: 'https://example.com' } });
assert.ok(html.includes('content="https://example.com" property="og:url"'));
assert.ok(html.includes('content="website" property="og:type"'));
assert.ok(!html.includes('application/ld+json'));
html = render({ request: { page_type: 'article', origin: 'https://example.com' } });
assert.ok(html.includes('content="article" property="og:type"'));
console.log('Metadata escaping, social cards, pagination, canonical URLs and product data passed.');

// Font objects and generated CSS come from Shopify; check that each configured
// role still registers its regular/bold/italic faces and supplies the design tokens.
const fontEngine = new Liquid();
const registered = [];
fontEngine.registerFilter('font_modify', (font, key, value) => ({ ...font, [key]: value }));
fontEngine.registerFilter('font_face', font => { registered.push(font); return ''; });
fontEngine.registerFilter('color_modify', color => color);
const fontSource = fs.readFileSync(path.join(__dirname, '../snippets/theme-tokens.liquid'), 'utf8')
  .replace(/{%\s*(?:end)?style\s*%}/g, '');
const settings = Object.fromEntries(['body', 'heading', 'mono'].map(role => [
  `type_${role}_font`, { family: role, fallback_families: 'sans-serif', weight: 400, style: 'normal' }
]));
const css = fontEngine.parseAndRenderSync(fontSource, { settings });
for (const role of ['body', 'heading', 'mono']) {
  const faces = registered.filter(font => font.family === role);
  assert.equal(faces.length, 4);
  assert.ok(faces.some(font => font.weight === 'bold' && font.style === 'italic'));
  assert.ok(css.includes(`${role}, sans-serif`));
}
console.log('Body, heading and caption font faces and design tokens passed.');
