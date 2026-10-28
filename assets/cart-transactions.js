/* Siftwell cart replacement. Shopify remains the source of quantities and prices. */
(() => {
  'use strict';
  const properties = item => Object.entries(item.properties || {}).sort(([a], [b]) => a.localeCompare(b));
  const plan = item => String(item.selling_plan_allocation?.selling_plan?.id || item.selling_plan || '');
  const identity = item => JSON.stringify([String(item.variant_id || item.id), plan(item), properties(item)]);
  const matches = (cart, item) => cart.items.filter(line => identity(line) === identity(item));
  const quantity = (cart, item) => matches(cart, item).reduce((total, line) => total + line.quantity, 0);
  const eligible = item => !item.gift_card && !item.requires_components && !item.item_components?.length && !item.parent_relationship;
  const payload = (item, variant = item.variant_id || item.id) => {
    const result = { id: variant, quantity: item.quantity, properties: { ...(item.properties || {}) } };
    if (plan(item)) result.selling_plan = plan(item);
    return result;
  };
  function totals(cart, omitted = []) {
    const result = new Map();
    for (const item of cart.items) {
      const key = identity(item);
      if (!omitted.includes(key)) result.set(key, (result.get(key) || 0) + item.quantity);
    }
    return JSON.stringify([...result].sort(([a], [b]) => a.localeCompare(b)));
  }
  function failure(code, cause) {
    const error = new Error(code); error.code = code; error.cause = cause; return error;
  }
  async function replace(api, original, variantId) {
    const before = await api.read();
    const source = before.items.find(item => item.key === original.key);
    if (!source || identity(source) !== identity(original) || source.quantity !== original.quantity || !eligible(source) || matches(before, source).length !== 1) throw failure('changed');
    if (String(variantId) === String(source.variant_id || source.id)) return before;
    const target = payload(source, variantId), oldTargetQuantity = quantity(before, target);
    if (matches(before, target).length > 1 || matches(before, target).some(item => !eligible(item))) throw failure('changed');
    const expected = oldTargetQuantity + source.quantity;
    const unchangedOthers = cart => totals(cart, [identity(source), identity(target)]) === totals(before, [identity(source), identity(target)]);
    const completed = cart => quantity(cart, source) === 0 && quantity(cart, target) === expected && unchangedOthers(cart);

    // On partial adds or a failed removal, restore only an unambiguous target
    // while the original and every unrelated item are still unchanged.
    const recover = async (cart, cause) => {
      if (completed(cart)) return cart; // A timed-out removal may have succeeded.
      const originalLines = matches(cart, source), targets = matches(cart, target);
      if (originalLines.length === 1 && originalLines[0].quantity === source.quantity && unchangedOthers(cart)) {
        const amount = quantity(cart, target);
        if (amount === oldTargetQuantity) throw failure('rejected', cause);
        if (targets.length === 1 && eligible(targets[0]) && amount > oldTargetQuantity && amount <= expected) {
          try {
            await api.change(targets[0].key, oldTargetQuantity);
            const restored = await api.read();
            if (totals(restored) === totals(before)) throw failure('rejected', cause);
          } catch (error) { if (error.code === 'rejected') throw error; }
        }
      }
      throw failure('review', cause);
    };

    let addError;
    try { await api.add(target); } catch (error) { addError = error; }
    let added;
    try { added = await api.read(); } catch (error) { throw failure('review', error); }
    const sources = matches(added, source);
    if (quantity(added, target) !== expected || sources.length !== 1 || sources[0].quantity !== source.quantity || !unchangedOthers(added)) return recover(added, addError);
    let removeError;
    try { await api.change(sources[0].key, 0); } catch (error) { removeError = error; }
    let finalCart;
    try { finalCart = await api.read(); } catch (error) { throw failure('review', error); }
    if (completed(finalCart)) return finalCart;
    return recover(finalCart, removeError);
  }
  window.SiftwellCart = Object.freeze({ identity, matches, quantity, eligible, payload, replace });
})();
