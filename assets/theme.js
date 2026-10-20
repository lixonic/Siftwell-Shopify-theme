(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = JSON.parse($('#ThemeConfig')?.textContent || '{}');
  const selections = new Map();
  let toastTimer, cartQueue = Promise.resolve(), variantRequest, quickRequest, pageRequest, catalogRequest;
  const popupCache = new Map(), dialogClosures = new WeakMap(), dialogReturnFocus = new WeakMap();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const predictiveStates = new WeakMap();
  function hideStatus() {
    const node = $('#ThemeStatus'); if (!node) return;
    clearTimeout(toastTimer);
    if (typeof node.hidePopover === 'function' && node.matches(':popover-open')) node.hidePopover();
    node.hidden = true;
  }
  function announce(message, cart = false) {
    const node = $('#ThemeStatus'); if (!node) return;
    hideStatus();
    // A popover in the active modal stays visible and interactive above its backdrop.
    ($('dialog[open]:not(.is-closing)') || document.body).append(node);
    $('[data-status-message]', node).textContent = message;
    $('[data-status-cart]', node).hidden = !cart;
    node.classList.toggle('cart-notification', cart); node.hidden = false;
    if (typeof node.showPopover === 'function') node.showPopover();
    else node.removeAttribute('popover');
    toastTimer = setTimeout(hideStatus, 6000);
  }
  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return false;
    if (dialog.open) {
      clearTimeout(dialogClosures.get(dialog)); dialogClosures.delete(dialog); dialog.classList.remove('is-closing');
      return true;
    }
    hideStatus();
    $$('siftwell-gallery').forEach(gallery => gallery.pause?.());
    if (id === 'ProductComparison') renderComparison();
    $$('dialog[open]').forEach(open => closeDialog(open));
    dialog.classList.add('is-entering');
    dialog.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => dialog.classList.remove('is-entering')));
    return true;
  }
  function closeDialog(dialog) {
    if (!dialog?.open || dialogClosures.has(dialog)) return;
    if (dialog.contains($('#ThemeStatus'))) hideStatus();
    const finish = () => {
      clearTimeout(dialogClosures.get(dialog)); dialogClosures.delete(dialog);
      dialog.close(); dialog.classList.remove('is-closing', 'is-entering');
    };
    if (reducedMotion.matches) { finish(); return; }
    dialog.classList.remove('is-entering'); dialog.classList.add('is-closing');
    // Keep the native modal and focus trap active until its exit has finished.
    dialogClosures.set(dialog, setTimeout(finish, 260));
  }
  function popupSection(urlString, section) {
    const url = new URL(urlString, location.origin); url.searchParams.set('section_id', section);
    const key = url.href, cached = popupCache.get(key);
    if (cached && Date.now() - cached.time < 60000) return cached.promise;
    const promise = fetch(url).then(response => {
      if (!response.ok) throw new Error(config.error);
      return response.text();
    }).catch(error => { popupCache.delete(key); throw error; });
    popupCache.set(key, {time: Date.now(), promise});
    if (popupCache.size > 8) popupCache.delete(popupCache.keys().next().value);
    return promise;
  }
  function makeElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function closeIcon() {
    return $('[data-close-dialog] .icon')?.cloneNode(true) || makeElement('span', '', '×');
  }
  function renderComparison() {
    $$('[data-compare-product]').forEach(button => button.setAttribute('aria-pressed', String(selections.has(button.dataset.compareProduct))));
    $$('[data-comparison-count]').forEach(node => { node.textContent = selections.size; });
    $$('[data-comparison-open]').forEach(button => { button.disabled = selections.size < 2; });
    $$('[data-comparison-rail]').forEach(rail => { rail.hidden = selections.size === 0; });
    $$('[data-comparison-workspace]').forEach(workspace => {
      workspace.classList.toggle('workspace--full', selections.size === 0 || !$('[data-comparison-rail]', workspace));
    });
    const bar = $('.comparison-bar');
    if (bar) { bar.hidden = selections.size === 0; bar.disabled = selections.size < 2; }
    for (const list of $$('[data-shortlist-items]')) {
      list.replaceChildren();
      if (!selections.size) list.append(makeElement('p', 'shortlist-empty', config.compareEmpty));
      for (const [id, product] of selections) {
        const item = makeElement('div', 'shortlist-item');
        if (product.image) { const img = makeElement('img'); img.src = product.image; img.alt = ''; img.width = 44; img.height = 44; item.append(img); }
        const text = makeElement('div', '', product.title);
        text.append(makeElement('span', '', product.price));
        const remove = makeElement('button');
        remove.type = 'button'; remove.dataset.removeComparison = id;
        remove.setAttribute('aria-label', config.remove + ' ' + product.title); remove.append(closeIcon());
        item.append(text, remove); list.append(item);
      }
    }
    const head = $('[data-comparison-head]'), rows = $('[data-comparison-rows]');
    if (!head || !rows) return;
    head.replaceChildren(); rows.replaceChildren();
    const titleRow = makeElement('tr');
    const corner = makeElement('th', '', config.compareLabels.picks); corner.scope = 'col'; titleRow.append(corner);
    for (const [id, product] of selections) {
      const th = makeElement('th'); th.scope = 'col';
      const link = makeElement('a', 'compare-product-link'); link.href = product.url;
      if (product.image) { const img = makeElement('img'); img.src = product.image; img.alt = ''; img.width = 160; img.height = 160; link.append(img); }
      link.append(makeElement('h3', '', product.title));
      const remove = makeElement('button', 'text-link', config.remove); remove.type = 'button'; remove.dataset.removeComparison = id; remove.setAttribute('aria-label', config.remove + ' ' + product.title);
      th.append(link, remove); titleRow.append(th);
    }
    head.append(titleRow);
    const labels = {price: config.compareLabels.price};
    const specKeys = new Set([...selections.values()].flatMap(p => Object.keys(p.specs || {})));
    if (specKeys.size) for (const key of ['weight', 'material', 'fit', 'feature', 'best']) {
      const specification = [...selections.values()].find(p => p.specs?.[key])?.specs[key];
      if (specification) labels['spec:' + key] = specification.label;
    }
    else { labels.vendor = config.compareLabels.vendor; labels.type = config.compareLabels.type; }
    for (const [key, label] of Object.entries(labels)) {
      const values = [...selections.values()].map(p => key.startsWith('spec:') ? p.specs?.[key.slice(5)]?.value || '—' : p[key] || '—');
      if (values.every(v => v === '—')) continue;
      const row = makeElement('tr'), th = makeElement('th', '', label); th.scope = 'row'; row.append(th);
      values.forEach(value => row.append(makeElement('td', '', value))); rows.append(row);
    }
    if (selections.size) {
      const row = makeElement('tr'), title = makeElement('th', '', config.compareLabels.next); title.scope = 'row'; row.append(title);
      for (const product of selections.values()) {
        const td = makeElement('td');
        if (product.variant) {
          const form = makeElement('form'); form.method = 'post'; form.action = config.cartAdd.replace(/\.js$/, ''); form.dataset.productForm = '';
          const id = makeElement('input'); id.type = 'hidden'; id.name = 'id'; id.value = product.variant;
          const button = makeElement('button', 'primary-button', config.compareLabels.add); button.type = 'submit'; button.name = 'add';
          const error = makeElement('p'); error.dataset.formError = ''; error.hidden = true; error.setAttribute('role', 'alert');
          form.append(id, button, error); td.append(form);
        } else {
          const link = makeElement('a', 'primary-button', config.compareLabels.options); link.href = product.url; link.dataset.quickViewUrl = product.url; td.append(link);
        }
        row.append(td);
      }
      rows.append(row);
    }
  }
  async function loadComparisonSpecs(product) {
    try {
      const html = new DOMParser().parseFromString(await popupSection(product.url, 'quick-view'), 'text/html');
      const specs = {};
      $$('[data-product-specifications] [data-specification]', html).forEach(row => {
        const label = $('dt', row)?.textContent.trim();
        const value = $('dd', row)?.textContent.trim();
        if (label && value) specs[row.dataset.specification] = {label, value};
      });
      product.specs = specs;
      if ([...selections.values()].includes(product)) renderComparison();
    } catch { /* Missing metafields never block comparison. */ }
  }
  async function showPagePopup(link) {
    pageRequest?.abort(); const request = pageRequest = new AbortController();
    link.setAttribute('aria-busy', 'true');
    try {
      const html = new DOMParser().parseFromString(await popupSection(link.href, 'quick-page'), 'text/html');
      if (request.signal.aborted || !link.isConnected) return;
      const root = $('[data-page-content]', html); if (!root) throw new Error(config.error);
      $('[data-page-popup-content]').replaceChildren(root);
      openDialog('PagePopup');
    } catch { if (!request.signal.aborted) location.assign(link.href); }
    finally { link.removeAttribute('aria-busy'); }
  }
  async function showQuickView(urlString, trigger) {
    const dialog = $('#ProductQuickView'), content = $('[data-quick-view-content]');
    if (!dialog || !content) { location.assign(urlString); return; }
    quickRequest?.abort(); const request = quickRequest = new AbortController();
    trigger?.setAttribute('aria-busy', 'true');
    try {
      const html = new DOMParser().parseFromString(await popupSection(urlString, 'quick-view'), 'text/html');
      if (request.signal.aborted || (trigger && !trigger.isConnected)) return;
      const root = $('[data-quick-view-root]', html); if (!root) throw new Error(config.error);
      content.replaceChildren(root); content.scrollTop = 0;
      initRecipients(root); renderComparison();
      openDialog('ProductQuickView'); window.Shopify?.PaymentButton?.init?.();
    } catch { if (!request.signal.aborted) location.assign(urlString); }
    finally { trigger?.removeAttribute('aria-busy'); }
  }
  function warmQuickView(event) {
    const link = event.target.closest('[data-quick-view-url]');
    if (!link || link.contains(event.relatedTarget) || navigator.connection?.saveData) return;
    if (event.type === 'pointerover' && !matchMedia('(hover: hover)').matches) return;
    popupSection(link.href, 'quick-view').catch(() => {});
  }
  document.addEventListener('pointerover', warmQuickView, {passive: true});
  document.addEventListener('focusin', warmQuickView);
  document.addEventListener('cancel', event => {
    if (event.target.matches('dialog')) { event.preventDefault(); closeDialog(event.target); }
  }, true);
  async function loadCatalog(urlString, updateHistory = true, scroll = false) {
    const current = $('[data-catalog-content]');
    if (!current) { location.assign(urlString); return; }
    catalogRequest?.abort(); catalogRequest = new AbortController();
    current.setAttribute('aria-busy', 'true');
    try {
      const url = new URL(urlString, location.origin);
      const response = await fetch(url, {signal: catalogRequest.signal});
      if (!response.ok) throw new Error(config.error);
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const fresh = $('[data-catalog-content]', html);
      if (!fresh) { location.assign(url); return; }
      // The homepage keeps its hero while its embedded catalog is refreshed.
      // Keep that catalog's heading level and its card hierarchy in context.
      const oldHeading = $('.collection-header h1, .collection-header h2', current);
      const freshHeading = $('.collection-header h1, .collection-header h2', fresh);
      if (oldHeading && freshHeading && oldHeading.tagName !== freshHeading.tagName) {
        const replaceHeading = (node, tag) => {
          const replacement = document.createElement(tag);
          [...node.attributes].forEach(attribute => replacement.setAttribute(attribute.name, attribute.value));
          replacement.append(...node.childNodes); node.replaceWith(replacement);
        };
        replaceHeading(freshHeading, oldHeading.tagName);
        $$('.product-title, .catalog-empty-title', fresh).forEach(node => replaceHeading(node, oldHeading.tagName === 'H1' ? 'h2' : 'h3'));
      }
      // Restore only focus that is still in the replaced results. Shoppers may
      // have moved to another control while the request was in flight.
      const focused = document.activeElement, restoreFocus = current.contains(focused);
      let nextFocus;
      if (restoreFocus) {
        if (focused.id) nextFocus = $(`[id="${CSS.escape(focused.id)}"]`, fresh);
        if (!nextFocus && focused.name && focused.closest('[data-catalog-filters]')) nextFocus = $$('[data-catalog-filters] input, [data-catalog-filters] select, [data-catalog-filters] button', fresh).find(node =>
          node.name === focused.name && (!focused.matches('[type=checkbox], [type=radio]') || node.value === focused.value));
        if (!nextFocus && focused.matches('[data-activity-collection]')) nextFocus = $('[data-activity-collection]', fresh);
        const disclosure = focused.closest('.filter-disclosure');
        if (disclosure) nextFocus?.closest('.filter-disclosure')?.setAttribute('open', '');
      }
      current.replaceWith(fresh); renderComparison();
      if (restoreFocus) {
        nextFocus ||= $('.collection-header h1, .collection-header h2', fresh);
        if (nextFocus) { if (!nextFocus.matches('input, select, button, a')) nextFocus.tabIndex = -1; nextFocus.focus({preventScroll: true}); }
      }
      const status = $('[data-catalog-status]', fresh.closest('[data-comparison-workspace]'));
      if (status) status.textContent = $('.result-count', fresh)?.textContent || '';
      const pageType = html.body.dataset.pageType;
      if (pageType) {
        document.body.dataset.pageType = pageType;
        $$('[data-sidebar-search]').forEach(link => { link.hidden = pageType === 'index'; });
      }
      if (scroll) fresh.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      if (updateHistory) history.pushState({catalog: true}, '', url);
      $$('[data-catalog-link].nav-item').forEach(link => {
        const active = new URL(link.href).pathname === url.pathname;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
      });
    } catch (error) { if (error.name !== 'AbortError') location.assign(urlString); }
    finally { current.removeAttribute('aria-busy'); }
  }
  function catalogFormURL(form) {
    const url = new URL(form.action, location.origin);
    const params = new URLSearchParams(new FormData(form));
    for (const [key, value] of params) if (value) url.searchParams.append(key, value);
    return url;
  }
  function closePredictive(root) {
    const input = $('input[type=search]', root), results = $('[data-predictive-results]', root);
    const state = predictiveStates.get(input); clearTimeout(state?.timer); state?.controller?.abort(); predictiveStates.delete(input);
    if (results) results.hidden = true;
    if (input) { input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
  }
  async function predictiveSearch(root) {
    const input = $('input[type=search]', root), results = $('[data-predictive-results]', root);
    const previous = predictiveStates.get(input); previous?.controller?.abort();
    const query = input.value.trim();
    if (query.length < 2) { closePredictive(root); return; }
    const controller = new AbortController(); predictiveStates.set(input, {controller});
    const url = new URL(config.predictiveSearch, location.origin);
    url.searchParams.set('q', query); url.searchParams.set('resources[type]', 'product');
    url.searchParams.set('resources[limit]', '5'); url.searchParams.set('section_id', 'predictive-search');
    try {
      const response = await fetch(url, {signal: controller.signal});
      if (!response.ok) throw new Error(config.error);
      const html = new DOMParser().parseFromString(await response.text(), 'text/html'), content = $('[data-predictive-content]', html), list = $('[role=listbox]', content || html);
      if (controller.signal.aborted || input.value.trim() !== query || !root.contains(document.activeElement)) return;
      if (!content || !list) { closePredictive(root); return; }
      input.removeAttribute('aria-activedescendant');
      list.id = results.id + '-list'; results.replaceChildren(content); results.hidden = false;
      input.setAttribute('aria-controls', list.id); input.setAttribute('aria-expanded', 'true');
    } catch (error) { if (error.name !== 'AbortError') closePredictive(root); }
  }

  async function requestJSON(url, body) {
    const response = await fetch(url, { method: 'POST', headers: body instanceof FormData ? { Accept: 'application/json' } : { Accept: 'application/json', 'Content-Type': 'application/json' }, body: body instanceof FormData ? body : JSON.stringify(body) });
    let data;
    try { data = await response.json(); } catch { throw new Error(config.error); }
    if (!response.ok) throw new Error(typeof data.description === 'string' ? data.description : typeof data.message === 'string' ? data.message : config.error);
    return data;
  }
  function cartSections() { return [...new Set($$('[data-cart-section]').map(el => el.dataset.cartSection))]; }
  function quantityRules(input) {
    return {
      min: Number(input.dataset.quantityMin || input.min) || 1,
      increment: Number(input.dataset.quantityIncrement || input.step) || 1,
      max: input.max === '' ? Infinity : Number(input.max)
    };
  }
  function quantityProblem(value, rules, allowRemoval = false) {
    if (!Number.isInteger(value) || value < 0) return 'quantityInvalid';
    if (value === 0 && allowRemoval) return '';
    if (value < rules.min) return 'quantityMinimum';
    if (value > rules.max) return 'quantityMaximum';
    if (value % rules.increment !== 0) return 'quantityIncrement';
    return '';
  }
  function validateQuantity(input) {
    const rules = quantityRules(input), value = input.value === '' ? NaN : Number(input.value);
    const problem = quantityProblem(value, rules, input.hasAttribute('data-cart-key'));
    const quantity = problem === 'quantityMinimum' ? rules.min : problem === 'quantityMaximum' ? rules.max : rules.increment;
    input.setCustomValidity(problem ? (config[problem] || config.error).replace('[quantity]', quantity) : '');
    return !problem;
  }
  function nextCartQuantity(value, direction, rules) {
    const next = (direction > 0 ? Math.floor(value / rules.increment) + 1 : Math.ceil(value / rules.increment) - 1) * rules.increment;
    if (direction < 0 && next < rules.min) return 0;
    return Math.min(rules.max, Math.max(rules.min, next));
  }
  function uniqueCartIdentity(input) {
    const identity = input?.dataset.cartIdentity;
    const keys = new Set($$('[data-cart-key]').filter(node => node.dataset.cartIdentity === identity).map(node => node.dataset.cartKey));
    return identity && keys.size === 1 ? identity : undefined;
  }
  function currentCartInput(key, identity) {
    const inputs = $$('[data-cart-key]'), exact = inputs.find(input => input.dataset.cartKey === key);
    if (exact) return exact;
    const matches = identity ? inputs.filter(input => input.dataset.cartIdentity === identity) : [];
    // Discounts can split identical merchandise into separate lines. Never guess between them.
    return new Set(matches.map(input => input.dataset.cartKey)).size === 1 ? matches[0] : undefined;
  }
  function applyCart(data, focusKey) {
    const focusIdentity = focusKey && uniqueCartIdentity(currentCartInput(focusKey));
    const sections = data.sections || {};
    let count;
    for (const root of $$('[data-cart-section]')) {
      const html = sections[root.dataset.cartSection];
      if (!html) { location.assign(config.cart); return false; }
      const fresh = new DOMParser().parseFromString(html, 'text/html');
      const content = $('[data-cart-content]', fresh), current = $('[data-cart-content]', root);
      if (!content || !current) { location.assign(config.cart); return false; }
      count = content.dataset.cartCountValue;
      current.replaceWith(content);
    }
    if (count !== undefined) $$('[data-cart-count]').forEach(node => { node.textContent = count; if (node.classList.contains('cart-count')) node.hidden = Number(count) === 0; });
    if (focusKey) {
      const activeRoot = $('#CartDrawer')?.open ? $('#CartDrawer') : $('.cart-page');
      const current = currentCartInput(focusKey, focusIdentity);
      const next = activeRoot && current && $(`[data-cart-key="${CSS.escape(current.dataset.cartKey)}"]`, activeRoot);
      if (next) next.focus({ preventScroll: true });
      else if (activeRoot) {
        // Split discounts and removed lines have no safe input target. Keep focus in the cart.
        const heading = $('h1, #CartDrawerTitle', activeRoot);
        if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      }
    }
    window.Shopify?.PaymentButton?.init?.();
    return true;
  }
  function queueCart(task) {
    cartQueue = cartQueue.catch(() => {}).then(task).catch(error => announce(error.message || config.error));
    return cartQueue;
  }
  async function refreshCart(focusKey) {
    // Request fresh sections without changing quantities or other cart data.
    const data = await requestJSON(config.cartUpdate, { sections: cartSections(), sections_url: location.pathname });
    return applyCart(data, focusKey);
  }
  async function changeCart(key, quantity, note, identity) {
    // Earlier queued edits can change a line's key when discounts are recalculated.
    const current = currentCartInput(key, identity);
    if (!current) return; // A prior edit removed the line or made its identity ambiguous.
    key = current.dataset.cartKey;
    const roots = $$('[data-cart-section]');
    $$('[data-cart-error]').forEach(node => { node.hidden = true; node.textContent = ''; });
    roots.forEach(root => root.setAttribute('aria-busy', 'true'));
    try {
      let data = await requestJSON(config.cartChange, { id: key, quantity, sections: cartSections(), sections_url: location.pathname });
      const savedNote = $('textarea[name="note"]')?.defaultValue;
      if (note !== undefined && note !== savedNote) data = await requestJSON(config.cartUpdate, { note, sections: cartSections(), sections_url: location.pathname });
      applyCart(data, key); announce(config.updated);
    } catch (error) {
      // Shopify can adjust a cart even when a request fails; render its current state.
      try { await refreshCart(key); } catch { $$('[data-cart-key]').forEach(input => { input.value = input.defaultValue; }); }
      $$('[data-cart-error]').forEach(node => { node.textContent = error.message || config.error; node.hidden = false; });
      throw error;
    } finally { roots.forEach(root => root.removeAttribute('aria-busy')); }
  }
  async function changeVariant(link, plan) {
    const root = link.closest('[data-product-root]');
    if (!root) return;
    variantRequest?.abort(); variantRequest = new AbortController();
    const focusValue = link.dataset.optionValueId;
    const url = new URL(link.dataset.productUrl || root.dataset.productUrl, location.origin);
    const selected = $$('[data-product-option]', root).map(field => (field.contains(link) ? link : $('[aria-current="true"]', field))?.dataset.optionValueId).filter(Boolean);
    if (selected.length) url.searchParams.set('option_values', selected.join(','));
    const planSelect = $('select[name="selling_plan"]', root);
    const planId = plan ?? planSelect?.value;
    if (planId) url.searchParams.set('selling_plan', planId);
    url.searchParams.set('section_id', root.dataset.sectionId);
    const quantity = $('input[name="quantity"]', root)?.value;
    root.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(url, { signal: variantRequest.signal });
      if (!response.ok) throw new Error(config.error);
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const fresh = $('[data-product-root]', html);
      if (!fresh) throw new Error(config.error);
      // Keep file inputs in the live document; cross-document adoption clears their selected files.
      document.adoptNode(fresh);
      // Keep the shopper's property controls through section replacement.
      const propertyFields = $$('[name^="properties["]', root);
      for (const field of $$('[name^="properties["]', fresh)) {
        const index = propertyFields.findIndex(previous => previous.name === field.name && previous.tagName === field.tagName && previous.type === field.type && (!['checkbox', 'radio'].includes(field.type) || previous.value === field.value));
        if (index !== -1) field.replaceWith(propertyFields.splice(index, 1)[0]);
      }
      const recipientFields = $('.recipient-fields', fresh);
      if (recipientFields) recipientFields.open = Boolean($('.recipient-fields', root)?.open);
      root.replaceWith(fresh);
      const quantityInput = $('input[name="quantity"]', fresh);
      if (quantity && quantityInput) { const min = Number(quantityInput.min) || 1, max = Number(quantityInput.max) || Infinity, step = Number(quantityInput.step) || 1; quantityInput.value = Math.min(max, min + Math.max(0, Math.floor((Number(quantity) - min) / step)) * step); }
      initRecipients(fresh); window.Shopify?.PaymentButton?.init?.();
      const selectedPlan = $('select[name="selling_plan"]', fresh)?.value;
      if (selectedPlan) url.searchParams.set('selling_plan', selectedPlan); else url.searchParams.delete('selling_plan');
      url.searchParams.delete('section_id'); if (!fresh.hasAttribute('data-quick-view-root')) history.replaceState(null, '', url);
      if (focusValue) $(`[data-option-value-id="${CSS.escape(focusValue)}"]`, fresh)?.focus({ preventScroll: true });
      else $('select[name="selling_plan"]', fresh)?.focus({ preventScroll: true });
    } catch (error) { if (error.name !== 'AbortError') { announce(config.error); location.assign(url.pathname + url.search.replace(/([?&])section_id=[^&]*/, '$1')); } }
    finally { root.removeAttribute('aria-busy'); }
  }
  function initRecipients(root = document) {
    $$('[data-recipient-toggle]', root).forEach(toggle => {
      const fields = toggle.closest('.recipient-fields');
      $$('input:not([data-recipient-toggle]), textarea', fields).forEach(input => { input.disabled = !toggle.checked; });
      $('[data-recipient-email]', fields).required = toggle.checked;
      $('[data-recipient-offset]', fields).value = new Date().getTimezoneOffset();
      const date = $('input[type="date"]', fields);
      if (date) {
        const today = new Date(), lastDay = new Date(today);
        lastDay.setDate(lastDay.getDate() + 90);
        const localDate = value => [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
        date.min = localDate(today); date.max = localDate(lastDay);
      }
    });
  }
  function initRecommendations(root = document) {
    const targets = $$('[data-recommendations]', root).filter(node => !node.dataset.loaded);
    if (!targets.length) return;
    const load = async node => {
      node.dataset.loaded = 'true';
      try { const response = await fetch(node.dataset.url); if (!response.ok) return; const html = new DOMParser().parseFromString(await response.text(), 'text/html'); const content = $('[data-recommendations]', html); if (content) { node.innerHTML = content.innerHTML; renderComparison(); } } catch { /* Recommendations do not interrupt shopping. */ }
    };
    if (!('IntersectionObserver' in window)) { targets.forEach(load); return; }
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { observer.unobserve(entry.target); load(entry.target); } }); }, { rootMargin: '300px' });
    targets.forEach(node => observer.observe(node));
  }
  document.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const removeComparison = event.target.closest('[data-remove-comparison]');
    if (removeComparison) {
      const id = removeComparison.dataset.removeComparison;
      const fromRail = removeComparison.closest('[data-comparison-rail]');
      const dialog = removeComparison.closest('#ProductComparison');
      const ids = [...selections.keys()], index = ids.indexOf(id), nextId = ids[index + 1] || ids[index - 1];
      selections.delete(id); renderComparison();
      if (fromRail) $$('[data-compare-product]').find(button => button.dataset.compareProduct === id)?.focus({preventScroll: true});
      if (selections.size < 2) {
        if (dialog) dialogReturnFocus.set(dialog, $$('[data-compare-product]').find(button => button.dataset.compareProduct === id));
        closeDialog($('#ProductComparison'));
      } else if (dialog) $(`[data-remove-comparison="${CSS.escape(nextId)}"]`, dialog)?.focus();
      return;
    }
    const pageLink = event.target.closest('[data-page-popup]');
    if (pageLink && typeof $('#PagePopup')?.showModal === 'function') {event.preventDefault(); showPagePopup(pageLink); return;}
    const quick = event.target.closest('[data-quick-view-url]');
    if (quick && typeof $('#ProductQuickView')?.showModal === 'function') { event.preventDefault(); showQuickView(quick.href, quick); return; }
    const catalogLink = event.target.closest('[data-catalog-link], [data-catalog-content] .pagination a');
    if (catalogLink && $('[data-catalog-content]')) { event.preventDefault(); closeDialog($('#NavigationDrawer')); loadCatalog(catalogLink.href, true, !catalogLink.closest('[data-catalog-content]')); return; }
    const focusSearch = event.target.closest('[data-focus-search]');
    if (focusSearch && document.body.dataset.pageType === 'index' && $('.hero-search input[type=search]')) { event.preventDefault(); $('.hero-search input[type=search]').focus(); return; }
    const opener = event.target.closest('[data-open-dialog]');
    if (opener && openDialog(opener.dataset.openDialog)) { event.preventDefault(); return; }
    if (event.target.closest('[data-dismiss-status]')) { hideStatus(); return; }
    const productStep = event.target.closest('[data-product-quantity-step]');
    if (productStep) { const input = $('input', productStep.closest('.product-quantity')); if (Number(productStep.dataset.productQuantityStep) > 0) input.stepUp(); else input.stepDown(); input.dispatchEvent(new Event('change', {bubbles:true})); return; }
    const closer = event.target.closest('[data-close-dialog]');
    if (closer) { closeDialog(closer.closest('dialog')); return; }
    const choice = event.target.closest('[data-finder-choice]');
    if (choice && $('[data-catalog-content]')) {
      event.preventDefault(); closeDialog($('#ProductFinder')); loadCatalog(choice.href, true, true); return;
    }
    const compare = event.target.closest('[data-compare-product]');
    if (compare) {
      const id = compare.dataset.compareProduct;
      if (selections.has(id)) selections.delete(id);
      else if (selections.size < 3) { const product = { ...compare.dataset }; selections.set(id, product); loadComparisonSpecs(product); }
      else return announce(config.compareLimit);
      renderComparison(); return;
    }
    const option = event.target.closest('[data-option-value-id]');
    if (option) { event.preventDefault(); changeVariant(option); return; }
    const stepper = event.target.closest('[data-quantity-step]');
    if (stepper) {
      event.preventDefault();
      const input = $('[data-cart-key]', stepper.closest('.cart-quantity'));
      const identity = uniqueCartIdentity(input);
      const amount = nextCartQuantity(Number(input.value), Math.sign(Number(stepper.dataset.quantityStep)), quantityRules(input));
      const note = $('textarea[name="note"]', stepper.closest('form'))?.value;
      input.value = amount;
      queueCart(() => changeCart(input.dataset.cartKey, amount, note, identity)); return;
    }
    const remove = event.target.closest('[data-remove-cart-key]');
    if (remove) { event.preventDefault(); const form = remove.closest('form'), identity = uniqueCartIdentity($('[data-cart-key]', remove.closest('.cart-row'))); queueCart(() => changeCart(remove.dataset.removeCartKey, 0, $('textarea[name="note"]', form)?.value, identity)); return; }
    if (event.target.matches('dialog')) { const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(event.target); }
  });
  document.addEventListener('submit', event => {
    const form = event.target;
    if (form.matches('[data-cart-form]')) {
      const invalid = $$('[data-cart-key]', form).find(input => !validateQuantity(input));
      if (invalid) { event.preventDefault(); invalid.reportValidity(); return; }
    }
    if (form.matches('[data-catalog-filters]')) { event.preventDefault(); loadCatalog(catalogFormURL(form)); return; }
    if (form.matches('[data-search-form]')) { const root = form.closest('[data-predictive-search]'); if (root) closePredictive(root); }
    if (form.matches('[data-product-form]') && event.submitter?.name === 'add') {
      event.preventDefault(); const button = event.submitter, body = new FormData(form);
      body.append('sections', cartSections().join(',')); body.append('sections_url', location.pathname);
      const errorNode = $('[data-form-error]', form); if (errorNode) { errorNode.textContent = ''; errorNode.hidden = true; }
      button.disabled = true; form.setAttribute('aria-busy', 'true');
      queueCart(async () => {
        try { const data = await requestJSON(config.cartAdd, body); if (applyCart(data)) { if (config.openCartOnAdd) openDialog('CartDrawer'); announce(config.added, true); } }
        catch (error) {
          try { await refreshCart(); } catch { /* Keep the form usable when the network is unavailable. */ }
          if (errorNode) { errorNode.textContent = error.message; errorNode.hidden = false; } throw error;
        }
        finally { button.disabled = false; form.removeAttribute('aria-busy'); }
      });
    }
  });
  document.addEventListener('change', event => {
    const input = event.target;
    if (input.matches('[data-catalog-filters] input, [data-catalog-filters] select')) {
      const form = input.closest('form'), url = catalogFormURL(form);
      if (input.matches('[data-activity-collection]')) { const selected = new URL(input.value, location.origin); selected.search = url.search; loadCatalog(selected); }
      else loadCatalog(url);
      return;
    }
    if (input.matches('[data-cart-key]')) {
      if (!validateQuantity(input)) { input.reportValidity(); return; }
      const key = input.dataset.cartKey, identity = uniqueCartIdentity(input), quantity = Number(input.value), note = $('textarea[name="note"]', input.closest('form'))?.value;
      queueCart(() => changeCart(key, quantity, note, identity));
    }
    if (input.matches('[data-recipient-toggle]')) initRecipients(input.closest('form'));
    if (input.matches('[data-product-root] select[name="selling_plan"]')) changeVariant(input, input.value);
  });
  document.addEventListener('shopify:section:load', event => { initRecipients(event.target); initRecommendations(event.target); renderComparison(); });
  document.addEventListener('shopify:section:unload', event => { $$('dialog[open]', event.target).forEach(dialog => dialog.close()); });
  document.addEventListener('shopify:block:select', event => { const dialog = event.target.closest('dialog'); if (dialog && !dialog.open) dialog.showModal(); });
  matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeDialog($('#NavigationDrawer')); });

  document.addEventListener('input', event => {
    if (event.target.matches('[data-cart-key]')) event.target.setCustomValidity('');
    const root = event.target.closest('[data-predictive-search]');
    if (!root || !event.target.matches('input[type=search]') || event.isComposing) return;
    closePredictive(root);
    predictiveStates.set(event.target, {timer: setTimeout(() => predictiveSearch(root), 200)});
  });
  document.addEventListener('invalid', event => {
    const recipient = event.target.closest('.recipient-fields');
    if (recipient) recipient.open = true;
  }, true);
  // Browsers restore checkbox values after deferred scripts when returning through history.
  window.addEventListener('pageshow', () => initRecipients());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { quickRequest?.abort(); pageRequest?.abort(); }
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input,textarea,select,[contenteditable=true]')) {
      const input = $('.hero-search input[type=search]'); if (input) { event.preventDefault(); input.focus(); } return;
    }
    const root = event.target.closest('[data-predictive-search]');
    if (!root) return;
    const input = $('input[type=search]', root), results = $('[data-predictive-results]', root);
    if (event.key === 'Escape') { closePredictive(root); return; }
    if (!results || results.hidden) return;
    const options = $$('[role=option]', results), active = options.findIndex(node => node.getAttribute('aria-selected') === 'true');
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!options.length) return;
      event.preventDefault(); const next = active < 0 ? (event.key === 'ArrowDown' ? 0 : options.length - 1) : (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
      options.forEach((node,index) => node.setAttribute('aria-selected',String(index === next)));
      if (options[next]) { input.setAttribute('aria-activedescendant',options[next].id); options[next].scrollIntoView({block:'nearest'}); }
    } else if (event.key === 'Enter' && active >= 0) { event.preventDefault(); location.assign(options[active].href); }
  });
  document.addEventListener('focusin', event => { const root = event.target.closest('[data-predictive-search]'); if (root && event.target.matches('input[type=search]') && event.target.value.trim().length >= 2 && $('[data-predictive-results]', root)?.hidden) predictiveSearch(root); });
  $('#ThemeStatus')?.addEventListener('focusin', () => clearTimeout(toastTimer));
  $('#ThemeStatus')?.addEventListener('focusout', event => { if (!event.currentTarget.contains(event.relatedTarget)) toastTimer = setTimeout(hideStatus, 3000); });
  document.addEventListener('focusout', event => {
    const root = event.target.closest('[data-predictive-search]');
    if (root && !root.contains(event.relatedTarget)) closePredictive(root);
  });
  document.addEventListener('close', event => {
    const target = dialogReturnFocus.get(event.target); dialogReturnFocus.delete(event.target);
    if (target?.isConnected && !target.disabled) target.focus();
    if (event.target.id === 'ProductQuickView') { quickRequest?.abort(); variantRequest?.abort(); $$('video',event.target).forEach(video => video.pause()); }
  }, true);
  addEventListener('popstate', () => { if ($('[data-catalog-content]')) loadCatalog(location.href, false); });

  initRecipients(); initRecommendations(); renderComparison();
})();
