const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../assets/theme.js'), 'utf8');
const helpers = source.slice(source.indexOf('  function quantityRules('), source.indexOf('  function uniqueCartIdentity('));
const context = vm.createContext({ config: {
  quantityInvalid: 'Whole number required', quantityMinimum: 'Minimum [quantity]',
  quantityMaximum: 'Maximum [quantity]', quantityIncrement: 'Multiple [quantity]'
} });
vm.runInContext(helpers, context);
const rules = { min: 6, increment: 3, max: 18 };
for (const value of [6, 9, 12, 18]) assert.equal(context.quantityProblem(value, rules), '');
assert.equal(context.quantityProblem(0, rules, true), '');
assert.equal(context.quantityProblem(0, rules), 'quantityMinimum');
assert.equal(context.quantityProblem(3, rules, true), 'quantityMinimum');
assert.equal(context.quantityProblem(7, rules, true), 'quantityIncrement');
assert.equal(context.quantityProblem(21, rules, true), 'quantityMaximum');
for (const value of [NaN, -1, 6.5]) assert.equal(context.quantityProblem(value, rules, true), 'quantityInvalid');
assert.equal(context.nextCartQuantity(6, -1, rules), 0);
assert.equal(context.nextCartQuantity(0, 1, rules), 6);
assert.equal(context.nextCartQuantity(6, 1, rules), 9);
assert.equal(context.nextCartQuantity(18, 1, rules), 18);
assert.equal(context.nextCartQuantity(7, -1, rules), 6);
assert.equal(context.nextCartQuantity(7, 1, rules), 9);
assert.equal(context.nextCartQuantity(1, -1, {min:1, increment:1, max:Infinity}), 0);
console.log('Quantity rule checks passed: min, max, increment, typed invalid values and zero removal.');
