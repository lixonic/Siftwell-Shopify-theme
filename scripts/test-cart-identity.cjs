const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/theme.js'), 'utf8');
const helpers = source.slice(source.indexOf('  function uniqueCartIdentity('), source.indexOf('  function applyCart('));
assert.ok(helpers.includes('function currentCartInput('));
let inputs = [];
const context = vm.createContext({ $$: () => inputs });
vm.runInContext(helpers, context);
const line = (key, identity) => ({ dataset: { cartKey: key, cartIdentity: identity } });

// Cart-page and drawer copies represent one line, even after its discount key changes.
const original = line('before', 'variant:plan:properties');
inputs = [original, line('before', original.dataset.cartIdentity)];
const identity = context.uniqueCartIdentity(original);
assert.equal(identity, original.dataset.cartIdentity);
const updated = line('after', identity);
inputs = [updated, line('after', identity)];
assert.equal(context.currentCartInput('before', identity), updated);

// Same merchandise can be split into independently discounted lines.
const sibling = line('sibling', identity);
inputs = [updated, sibling, line('after', identity), line('sibling', identity)];
assert.equal(context.uniqueCartIdentity(updated), undefined);
assert.equal(context.currentCartInput('before', identity), undefined);
assert.equal(context.currentCartInput('after', identity), updated);

// An ambiguous line at queue time must not gain fallback permission when a sibling vanishes.
const ambiguousIdentity = context.uniqueCartIdentity(sibling);
inputs = [updated];
assert.equal(context.currentCartInput('sibling', ambiguousIdentity), undefined);

// Removed lines and lines with different properties must never become another edit target.
inputs = [line('other', 'variant:plan:different-properties')];
assert.equal(context.currentCartInput('before', identity), undefined);
inputs = [];
assert.equal(context.currentCartInput('before', identity), undefined);
console.log('Cart identity checks passed: discount key changes, duplicate surfaces, split discounts, removal and distinct properties.');
