const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Liquid } = require('liquidjs');
const root = path.join(__dirname, '..');
const engine = new Liquid({ root: path.join(root, 'snippets'), extname: '.liquid' });
require('./liquid-doc.cjs')(engine);
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/en.default.json'), 'utf8'));
engine.registerFilter('t', key => key.split('.').reduce((value, part) => value?.[part], locale) || key);
const field = (value, type = 'single_line_text_field') => ({ type, value });
const profile = (requirements, extra = {}) => ({ entry_name: field('Private entry name'), requirements: field(requirements, 'list.single_line_text_field'), ...extra });
const reference = value => field(value, 'metaobject_reference');
const shared = profile(['12 V supply', 'DC accessory connection'], { exclusions: field(['24 V supply'], 'list.single_line_text_field'), reference_url: field('https://example.com/manual?a=1&b=2', 'url') });
const version24 = profile(['24 V supply'], { application_notes: field('Match the exact connector.\nCheck the installation manual.', 'multi_line_text_field'), exclusions: field(['12 V supply'], 'list.single_line_text_field') });
const variant = { id: 24, title: '24 V', metafields: { siftwell: {} } };
const product = { has_only_default_variant: false, metafields: { siftwell: { compatibility: reference(shared) } }, selected_or_first_available_variant: variant };
const source = fs.readFileSync(path.join(root, 'snippets/product-compatibility.liquid'), 'utf8');
const render = (item = product, settings = {}, extra = {}) => { engine.options.globals = { settings }; return engine.parseAndRenderSync(source, { product: item, ...extra }); };
let html = render();
assert.ok(html.includes('12 V supply') && html.includes('For <strong>24 V</strong>'), 'Explicitly shared product requirements are inherited');
assert.ok(html.includes('a=1&amp;b=2') && html.includes('View manufacturer reference'));
const override = { ...product, selected_or_first_available_variant: { ...variant, metafields: { siftwell: { compatibility: reference(version24) } } } };
html = render(override);
assert.ok(html.includes('24 V supply') && html.includes('12 V supply') && html.includes('<br'));
assert.ok(!html.includes('DC accessory connection') && !html.includes('example.com/manual'), 'A variant replaces the whole profile; shared evidence cannot leak across versions');
assert.ok(html.includes('Vehicle fit has not been checked.') && !html.includes('data-compatibility-unknown'));
for (const value of [profile([]), null]) {
 html = render({ ...product, selected_or_first_available_variant: { ...variant, metafields: { siftwell: { compatibility: reference(value) } } } });
 assert.ok(html.includes('Compatibility not confirmed') && !html.includes('12 V supply') && !html.includes('example.com'), 'Empty or inaccessible variant references cannot inherit product assurances');
}
html = render({ ...product, selected_or_first_available_variant: null });
assert.ok(html.includes('Compatibility not confirmed') && !html.includes('12 V supply') && !html.includes('For <strong>'), 'An invalid option combination shows no other variant’s requirements');
const missing = { ...product, metafields: {}, selected_or_first_available_variant: variant };
assert.equal(render(missing).trim(), '', 'Unconfigured products stay quiet by default');
assert.ok(render(missing, { compatibility_show_empty: true }).includes('Compatibility not confirmed'));
assert.equal(render(product, { enable_compatibility: false }).trim(), '');
html = render({ ...product, metafields: { other: { fit_notes: reference(shared) } } }, { compatibility_namespace: 'other', compatibility_key: 'fit_notes' });
assert.ok(html.includes('DC accessory connection'), 'Mapping can reuse another merchant-owned namespace/key');
for (const url of ['javascript:alert(1)', 'data:text/html,x', '//example.com/manual', 'mailto:a@example.com']) {
 html = render({ ...product, metafields: { siftwell: { compatibility: reference(profile(['<script>alert(1)</script> & use'], { reference_url: field(url, 'url'), reference_label: field('<img onerror=alert(1)>') })) } } });
 assert.ok(html.includes('&lt;script&gt;') && !html.includes('<script>') && !html.includes('compatibility-reference'), 'Plain text is escaped and only HTTP(S) references become links');
}
html = render({ ...product, metafields: { siftwell: { compatibility: reference(profile(Array.from({length: 11}, (_,i) => 'Requirement ' + i))) } } });
assert.equal((html.match(/<li>/g) || []).length, 10);
assert.ok(render(product, {}, { heading_tag: 'h3' }).includes('<h3'));
assert.ok(render(product, {}, { heading_tag: '<script>' }).includes('<h2'));
console.log('Compatibility renders passed: shared profiles, atomic variant replacement, empty/draft/invalid states, optional missing state, mapping, escaped content and safe references.');
