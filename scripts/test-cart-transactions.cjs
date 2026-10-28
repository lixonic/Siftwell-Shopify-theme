const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const sandbox = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/cart-transactions.js'), 'utf8'), sandbox);
const engine = sandbox.window.SiftwellCart;
const clone = value => JSON.parse(JSON.stringify(value));
const line = (id, quantity, extra = {}) => ({key:`${id}:original`, id, variant_id:id, product_id:9, quantity, properties:{Engraving:'A < B', _private:'keep'}, ...extra});
const original = line(1, 2, {selling_plan_allocation:{selling_plan:{id:99}}});
const target = line(2, 3, {selling_plan_allocation:{selling_plan:{id:99}}});
const unrelated = line(3, 1);
function mock(items, options = {}) {
  let cart = {items:clone(items)}, revision = 0, reads = 0;
  const calls = [];
  function rekey() { cart.items.forEach(item => { item.key = `${item.id}:r${++revision}`; }); }
  const api = {
    async read() {
      reads++;
      if (options.failReadAt === reads) throw new Error('offline');
      return clone(cart);
    },
    async add(item) {
      calls.push(['add', clone(item)]);
      if (options.rejectAdd) throw new Error('sold out');
      const count = options.partial ? 1 : item.quantity;
      const existing = engine.matches(cart, item)[0];
      if (existing) existing.quantity += count;
      else cart.items.push(line(item.id, count, {properties:item.properties, selling_plan_allocation:item.selling_plan ? {selling_plan:{id:item.selling_plan}} : undefined}));
      if (options.concurrent) cart.items.find(item => item.id === 3).quantity++;
      if (options.splitSource) {
        const source = cart.items.find(item => item.id === 1); source.quantity--;
        cart.items.push({...clone(source), quantity:1, key:'split'});
      }
      rekey();
      if (options.partial || options.lostAddResponse) throw new Error('lost add response');
    },
    async change(key, quantity) {
      calls.push(['change', key, quantity]);
      const item = cart.items.find(item => item.key === key); assert.ok(item, 'Always use a fresh line key');
      if ((options.rejectRemove && item.id === 1) || (options.rejectRollback && item.id === 2)) throw new Error('change rejected');
      item.quantity = quantity; cart.items = cart.items.filter(item => item.quantity); rekey();
      if (options.lostRemoveResponse && item.id === 1) throw new Error('lost remove response');
    }
  };
  return {api, calls, cart:() => clone(cart)};
}
async function run() {
  let test = mock([original, target, unrelated]);
  const result = await engine.replace(test.api, original, 2);
  assert.equal(engine.quantity(result, original), 0);
  assert.equal(engine.quantity(result, target), 5);
  assert.equal(engine.quantity(result, unrelated), 1);
  assert.deepEqual(test.calls[0][1].properties, original.properties);
  assert.equal(test.calls[0][1].selling_plan, '99');
  assert.equal(test.calls[1][2], 0);
  assert.match(test.calls[1][1], /^1:r/, 'Follow discount-induced key changes');

  for (const options of [{rejectAdd:true}, {partial:true}, {rejectRemove:true}]) {
    test = mock([original, target, unrelated], options);
    await assert.rejects(engine.replace(test.api, original, 2), {code:'rejected'});
    assert.equal(engine.quantity(test.cart(), original), 2);
    assert.equal(engine.quantity(test.cart(), target), 3);
    assert.equal(engine.quantity(test.cart(), unrelated), 1);
  }
  for (const options of [{lostAddResponse:true}, {lostRemoveResponse:true}]) {
    test = mock([original, unrelated], options);
    const final = await engine.replace(test.api, original, 2);
    assert.equal(engine.quantity(final, original), 0);
    assert.equal(engine.quantity(final, target), 2);
    assert.equal(test.calls.filter(call => call[0] === 'add').length, 1, 'Never repeat an uncertain add');
  }
  test = mock([original], {partial:true});
  await assert.rejects(engine.replace(test.api, original, 2), {code:'rejected'});
  assert.equal(test.cart().items.length, 1, 'Rollback removes a newly introduced partial target');
  for (const options of [{concurrent:true}, {splitSource:true}, {rejectRemove:true, rejectRollback:true}, {failReadAt:2}]) {
    test = mock([original, unrelated], options);
    await assert.rejects(engine.replace(test.api, original, 2), {code:'review'});
    assert.equal(engine.quantity(test.cart(), original), 2, 'Do not discard the original when a safe replacement cannot be verified');
  }
  test = mock([{...original, quantity:3}]);
  await assert.rejects(engine.replace(test.api, original, 2), {code:'changed'});
  assert.equal(test.calls.length, 0);
  test = mock([original, {...original, key:'discount-sibling'}]);
  await assert.rejects(engine.replace(test.api, original, 2), {code:'changed'});
  assert.equal(test.calls.length, 0, 'Ambiguous discount splits never mutate');
  for (const extra of [{gift_card:true}, {requires_components:true}, {item_components:[{}]}, {parent_relationship:{parent_key:'x'}}]) {
    const unsupported = {...original, ...extra}; test = mock([unsupported]);
    await assert.rejects(engine.replace(test.api, unsupported, 2), {code:'changed'});
    assert.equal(test.calls.length, 0);
  }
  test = mock([original]); await engine.replace(test.api, original, 1); assert.equal(test.calls.length, 0);
  assert.equal(engine.identity(line(4, 1, {properties:{b:'2', a:'1'}})), engine.identity(line(4, 1, {properties:{a:'1', b:'2'}})));
  assert.notEqual(engine.identity(original), engine.identity({...original, properties:{}}));
  assert.notEqual(engine.identity(original), engine.identity({...original, selling_plan_allocation:null}));
  console.log('Cart replacement checks passed: plans/properties, merging, discount keys, stock rejection, partial adds, lost responses, rollback, concurrent changes and unsupported lines.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
