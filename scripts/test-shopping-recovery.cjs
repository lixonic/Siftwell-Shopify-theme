const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../assets/theme.js'), 'utf8');
const slice = (start, end) => source.slice(source.indexOf(start), source.indexOf(end));

// Run the actual control logic against a small surface model; this does not
// establish browser layout, native constraint validation or Shopify integration.
function purchaseBar() {
  let update, cleanups = 0;
  const style = new Map(), classes = new Set();
  const original = {disabled:false, bottom:10, getBoundingClientRect() {return {bottom:this.bottom};}};
  const root = {busy:false, hasAttribute() {return this.busy;}};
  const form = {busy:false, closest:() => root, hasAttribute() {return this.busy;}};
  const button = {disabled:false};
  const bar = {dataset:{formId:'f'}, hidden:true, getBoundingClientRect:() => ({height:130})};
  const mobile = {matches:true, addEventListener(){}, removeEventListener(){}};
  let dialog = false;
  class Observer {constructor(callback) {update = callback;} observe() {} disconnect() {cleanups++;}}
  const context = vm.createContext({
    purchaseCleanup:undefined,
    $:(selector, node) => selector === '[data-mobile-purchase-bar]' ? bar : selector === 'dialog[open]' ? dialog : node === form ? original : node === bar ? button : null,
    $$:() => [], matchMedia:() => mobile,
    IntersectionObserver:Observer, MutationObserver:Observer, ResizeObserver:Observer,
    window:{IntersectionObserver:Observer, ResizeObserver:Observer, innerHeight:800, visualViewport:{height:800, addEventListener(){}, removeEventListener(){}}, addEventListener(){}, removeEventListener(){}},
    document:{getElementById:() => form, body:{style:{setProperty:(k,v) => style.set(k,v),removeProperty:k => style.delete(k)},classList:{toggle:(k,v) => v ? classes.add(k) : classes.delete(k),remove:k => classes.delete(k)}}}
  });
  vm.runInContext(slice('  function initPurchaseBar(', '  function reviewPurchase('), context);
  context.initPurchaseBar(); assert.equal(bar.hidden, true, 'Original buy button visible');
  original.bottom = -1; update(); assert.equal(bar.hidden, false); assert.equal(style.get('--purchase-bar-height'), '130px');
  form.busy = true; update(); assert.equal(button.disabled, true);
  form.busy = false; original.disabled = true; update(); assert.equal(button.disabled, true, 'Sold-out button stays disabled');
  original.disabled = false; root.busy = true; update(); assert.equal(button.disabled, true, 'Variant request blocks submission');
  root.busy = false; update(); assert.equal(button.disabled, false);
  dialog = true; update(); assert.equal(bar.hidden, true, 'Does not compete with dialogs');
  dialog = false; context.window.visualViewport.height = 400; update(); assert.equal(bar.hidden, true, 'Collapses while soft keyboard is open');
  context.window.visualViewport.height = 800; mobile.matches = false; update(); assert.equal(bar.hidden, true);
  mobile.matches = true; context.initPurchaseBar(); assert.equal(cleanups, 3, 'Section changes disconnect previous observers');
  context.purchaseCleanup(); assert.equal(bar.hidden, true); assert.equal(classes.size, 0); assert.equal(style.size, 0);
}
function cartEditor() {
  const message = {}, button = {};
  const config = {cartChanged:'changed',unavailable:'unavailable',soldOut:'sold out',cartEditPlan:'plan',cartEditQuantity:'quantity',cartChooseDifferent:'choose'};
  const context = vm.createContext({config,cartEditors:new WeakMap(),$:(selector) => selector.includes('message') ? message : button});
  vm.runInContext(slice('  function quantityRules(', '  function uniqueCartIdentity(') + slice('  function updateCartEditor(', '  async function openCartEditor('), context);
  const root = {dataset:{productId:'9',variantId:'22',available:'true',planIds:'null',quantityMin:'1',quantityIncrement:'1'}};
  const state = {item:{product_id:9,variant_id:11,quantity:2},plan:''};
  const check = (expected) => {context.updateCartEditor(root,state);assert.equal(message.textContent,expected);assert.equal(button.disabled,Boolean(expected));};
  check('');
  root.dataset.variantId = '11';check('choose');root.dataset.variantId = '';check('unavailable');root.dataset.variantId = '22';
  root.dataset.available = 'false';check('sold out');root.dataset.available = 'true';
  root.dataset.productId = '10';check('changed');root.dataset.productId = '9';
  state.plan = '88';check('plan');root.dataset.planIds = '[88]';check('');
  state.plan = '';root.dataset.requiresPlan = 'true';check('plan');root.dataset.requiresPlan = 'false';
  root.dataset.quantityMin = '3';check('quantity');root.dataset.quantityMin = '1';root.dataset.quantityMax = '1';check('quantity');root.dataset.quantityMax = '';
  root.dataset.quantityIncrement = '3';check('quantity');root.dataset.quantityIncrement = '1';check('');
}
async function undo() {
  const engineContext = vm.createContext({window:{}});
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/cart-transactions.js'), 'utf8'),engineContext);
  const engine = engineContext.window.SiftwellCart;
  const item = {variant_id:22,quantity:2,properties:{Engraving:'A&B',_private:'kept'},selling_plan_allocation:{selling_plan:{id:88}}};
  async function scenario({before=0,after=2,addFails=false,readFails=false} = {}) {
    let adds = 0,reads = 0,refreshes = 0,payload;
    const errorNode = {hidden:true}, announcements = [];
    const cart = n => ({items:n ? [{...item,quantity:n}] : []});
    const context = vm.createContext({
      cartUndo:{item,title:'Item',remaining:0},cartTransactionBusy:false,window:{SiftwellCart:engine},config:{cartChanged:'changed',cartReview:'review',cartRestored:'restored'},
      $:() => null,$$:() => [errorNode],renderCartUndo(){},announce:s => announcements.push(s),refreshCart:async () => {refreshes++;},
      readCart:async () => {reads++;if(readFails && reads > 1) throw Error('network');return cart(reads === 1 ? before : after);},
      cartAPI:{add:async p => {adds++;payload=p;if(addFails) throw Error('lost');}}
    });
    vm.runInContext(slice('  async function undoCartRemoval(', '  function updateCartEditor('),context);
    await context.undoCartRemoval();
    assert.equal(context.cartTransactionBusy,false);assert.equal(refreshes,1);
    return {context,adds,payload,errorNode,announcements,invoke:async () => {await context.undoCartRemoval();return adds;}};
  }
  let result = await scenario();assert.equal(result.adds,1);assert.equal(result.payload.selling_plan,'88');assert.deepEqual({...result.payload.properties},item.properties);assert.equal(result.announcements.at(-1),'restored');assert.equal(await result.invoke(),1);
  result = await scenario({addFails:true});assert.equal(result.announcements.at(-1),'restored','A lost response followed by the expected cart must not be retried');assert.equal(await result.invoke(),1);
  result = await scenario({before:1});assert.equal(result.adds,0);assert.equal(result.errorNode.textContent,'changed');
  for (const options of [{after:1},{after:0,addFails:true},{readFails:true}]) {
    result = await scenario(options);assert.equal(result.errorNode.hidden,false);assert.equal(result.errorNode.textContent,'review');assert.equal(await result.invoke(),1,'Uncertain restoration is consumed so retry cannot duplicate it');
  }
}
(async () => {
  purchaseBar();cartEditor();await undo();
  console.log('Shopping recovery checks passed: purchase visibility/busy state/cleanup, variant plan and quantity guards, undo restoration and no duplicate retry.');
})().catch(error => {console.error(error);process.exitCode=1;});
