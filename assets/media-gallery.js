(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let modelFeatures, xrFeatures, zoomDialog;
  const registeredModels = new Set();
  function feature(name) {
    return new Promise((resolve, reject) => {
      if (!window.Shopify?.loadFeatures) return reject(new Error('Media library unavailable'));
      const timeout = setTimeout(() => reject(new Error('Media library timed out')), 15000);
      window.Shopify.loadFeatures([{name, version: '1.0', onLoad: error => { clearTimeout(timeout); error ? reject(error) : resolve(); }}]);
    });
  }
  async function registerXR(gallery) {
    const json = gallery.querySelector('[data-product-models]');
    if (!json) return;
    try {
      xrFeatures ||= feature('shopify-xr').catch(error => { xrFeatures = null; throw error; });
      await xrFeatures;
      if (!window.ShopifyXR) await new Promise(resolve => document.addEventListener('shopify_xr_initialized', resolve, {once: true}));
      if (!gallery.isConnected) return;
      const models = JSON.parse(json.textContent).filter(model => !registeredModels.has(String(model.id)));
      if (models.length) { window.ShopifyXR.addModels(models); models.forEach(model => registeredModels.add(String(model.id))); }
      window.ShopifyXR.setupXRElements();
    } catch { /* The interactive model remains usable if device AR is unavailable. */ }
  }
  function createZoom(gallery, link) {
    if (!zoomDialog) {
      zoomDialog = document.createElement('dialog'); zoomDialog.className = 'media-zoom-dialog';
      const close = document.createElement('button'); close.type = 'button'; close.className = 'icon-button dialog-close'; close.dataset.closeDialog = '';
      close.append(document.querySelector('[data-close-dialog] svg').cloneNode(true));
      const toggle = document.createElement('button'); toggle.type = 'button'; toggle.className = 'secondary-button media-zoom-toggle';
      const scroll = document.createElement('div'); scroll.className = 'media-zoom-scroll'; scroll.tabIndex = 0;
      const image = document.createElement('img'); image.decoding = 'async'; scroll.append(image);
      zoomDialog.append(close, toggle, scroll); document.body.append(zoomDialog);
      const changeZoom = () => {
        const enlarged = zoomDialog.classList.toggle('is-zoomed');
        toggle.textContent = enlarged ? zoomDialog.dataset.zoomOut : zoomDialog.dataset.zoomIn;
        toggle.setAttribute('aria-pressed', String(enlarged));
      };
      toggle.addEventListener('click', changeZoom); image.addEventListener('click', changeZoom);
      zoomDialog.addEventListener('click', event => { if (event.target === zoomDialog) close.click(); });
      zoomDialog.addEventListener('close', () => { zoomDialog.querySelector('img').removeAttribute('src'); });
    }
    document.querySelectorAll('siftwell-gallery').forEach(item => item.pause());
    zoomDialog.classList.remove('is-zoomed', 'is-closing');
    zoomDialog.setAttribute('aria-label', gallery.dataset.zoomLabel);
    zoomDialog.querySelector('[data-close-dialog]').setAttribute('aria-label', gallery.dataset.closeLabel);
    zoomDialog.dataset.zoomIn = gallery.dataset.zoomIn; zoomDialog.dataset.zoomOut = gallery.dataset.zoomOut;
    const toggle = zoomDialog.querySelector('.media-zoom-toggle'); toggle.textContent = gallery.dataset.zoomIn; toggle.setAttribute('aria-pressed', 'false');
    const image = zoomDialog.querySelector('img'); image.src = link.href; image.alt = link.querySelector('img')?.alt || '';
    zoomDialog.classList.add('is-entering'); zoomDialog.showModal();
    const scroll = zoomDialog.querySelector('.media-zoom-scroll'); scroll.scrollTop = 0; scroll.scrollLeft = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => zoomDialog.classList.remove('is-entering')));
  }
  class SiftwellGallery extends HTMLElement {
    connectedCallback() {
      this.events?.abort(); this.events = new AbortController();
      this.slides = [...this.querySelectorAll('.media-slide')];
      if (!this.slides.length) return;
      this.index = Math.max(0, this.slides.findIndex(slide => slide.hasAttribute('data-initial')));
      const on = (target, event, handler, options = {}) => target.addEventListener(event, handler, {...options, signal: this.events.signal});
      on(this, 'click', event => {
        const thumbnail = event.target.closest('[data-media-select]');
        if (thumbnail && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); this.select(this.slides.findIndex(slide => slide.dataset.mediaId === thumbnail.dataset.mediaSelect)); return; }
        const step = event.target.closest('[data-media-step]'); if (step) { this.select(this.index + Number(step.dataset.mediaStep)); return; }
        const load = event.target.closest('[data-media-load]'); if (load) { this.load(load); return; }
        const zoom = event.target.closest('[data-media-zoom]'); if (zoom && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); createZoom(this, zoom); }
      });
      on(this, 'keydown', event => {
        const thumb = event.target.closest('[data-media-select]'); if (!thumb) return;
        let next;
        const rtl = getComputedStyle(this).direction === 'rtl';
        if (event.key === 'ArrowRight') next = this.index + (rtl ? -1 : 1);
        if (event.key === 'ArrowLeft') next = this.index + (rtl ? 1 : -1);
        if (event.key === 'Home') next = 0; if (event.key === 'End') next = this.slides.length - 1;
        if (next !== undefined) { event.preventDefault(); this.select(next); this.querySelector(`[data-media-select="${this.slides[this.index].dataset.mediaId}"]`)?.focus({preventScroll: true}); }
      });
      on(this, 'pointerdown', event => {
        this.pointer = null;
        if (event.pointerType === 'mouse' || !event.target.closest('[data-media-zoom]')) return;
        this.pointer = {x: event.clientX, y: event.clientY};
      }, {passive: true});
      on(this, 'pointerup', event => {
        if (!this.pointer) return;
        const dx = event.clientX - this.pointer.x, dy = event.clientY - this.pointer.y; this.pointer = null;
        if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        this.swiped = true; setTimeout(() => { this.swiped = false; }, 400);
        this.select(this.index + (dx < 0 ? 1 : -1) * (getComputedStyle(this).direction === 'rtl' ? -1 : 1));
      }, {passive: true});
      on(this, 'click', event => { if (this.swiped && event.target.closest('[data-media-zoom]')) { event.preventDefault(); event.stopImmediatePropagation(); } }, {capture: true});
      on(this, 'pointercancel', () => { this.pointer = null; });
      on(this, 'error', event => { if (event.target.matches('img,video,model-viewer')) this.error(); }, {capture: true});
      on(this, 'play', event => {
        if (!event.target.matches('video')) return;
        document.querySelectorAll('siftwell-gallery').forEach(gallery => gallery.pause(event.target));
      }, {capture: true});
      on(this, 'shopify_model_viewer_ui_toggle_play', event => {
        document.querySelectorAll('siftwell-gallery').forEach(gallery => gallery.pause(event.target));
      }, {capture: true});
      const modal = this.closest('dialog'); if (modal) on(modal, 'close', () => this.pause());
      on(document, 'visibilitychange', () => { if (document.hidden) this.pause(); });
      this.querySelector('[data-media-controls]')?.removeAttribute('hidden');
      this.dataset.ready = ''; this.select(this.index, false); registerXR(this);
    }
    disconnectedCallback() { this.pause(); this.events?.abort(); }
    error() { const error = this.querySelector('[data-media-error]'); if (error) { error.textContent = this.dataset.errorLabel; error.hidden = false; } }
    pause(except) {
      this.querySelectorAll('video').forEach(video => { if (video !== except) video.pause(); });
      this.querySelectorAll('model-viewer').forEach(viewer => { if (viewer !== except) { viewer.siftwellUI?.pause(); viewer.pause?.(); } });
      this.querySelectorAll('.media-player:has(iframe)').forEach(player => { const wrapper = player.parentElement; player.remove(); wrapper.querySelector('[data-media-load]').hidden = false; });
    }
    select(index, animate = true) {
      index = Math.max(0, Math.min(index, this.slides.length - 1));
      if (this.index !== index) this.pause();
      this.index = index;
      this.slides.forEach((slide, i) => { slide.hidden = i !== index; slide.classList.toggle('is-current', i === index); });
      const current = this.slides[index];
      this.querySelectorAll('[data-media-select]').forEach(link => {
        if (link.dataset.mediaSelect === current.dataset.mediaId) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
      const counter = this.querySelector('[data-media-counter]'); if (counter) counter.textContent = this.dataset.countLabel.replace('[current]', String(index + 1));
      this.querySelectorAll('[data-media-step]').forEach(button => { button.disabled = Number(button.dataset.mediaStep) < 0 ? index === 0 : index === this.slides.length - 1; });
      const xr = this.querySelector('[data-shopify-xr]'); if (xr && current.dataset.mediaType === 'model') { xr.dataset.shopifyModel3dId = current.dataset.mediaId; window.ShopifyXR?.setupXRElements(); }
      const error = this.querySelector('[data-media-error]'); if (error) error.hidden = true;
      if (animate && !reducedMotion.matches) current.animate([{opacity: .4}, {opacity: 1}], {duration: 180, easing: 'cubic-bezier(.22,1,.36,1)'});
      const selectedThumb = this.querySelector('[data-media-select][aria-current="true"]');
      if (selectedThumb) { const strip = selectedThumb.parentElement; strip.scrollTo({left: selectedThumb.offsetLeft - strip.offsetLeft - (strip.clientWidth - selectedThumb.clientWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth'}); }
    }
    async load(button) {
      if (button.disabled) return;
      const slide = button.closest('.media-slide'), wrapper = button.parentElement;
      const type = slide.dataset.mediaType;
      if (type === 'model') {
        button.disabled = true; button.setAttribute('aria-busy', 'true');
        try {
          if (!document.querySelector('[data-model-ui-style]')) {
            const style = document.createElement('link'); style.rel = 'stylesheet'; style.href = 'https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css'; style.dataset.modelUiStyle = ''; document.head.append(style);
          }
          modelFeatures ||= feature('model-viewer-ui').catch(error => { modelFeatures = null; throw error; });
          await modelFeatures;
        } catch { this.error(); button.disabled = false; button.removeAttribute('aria-busy'); return; }
        button.disabled = false; button.removeAttribute('aria-busy');
      }
      if (!this.isConnected || slide.hidden) return;
      document.querySelectorAll('siftwell-gallery').forEach(gallery => gallery.pause());
      const error = this.querySelector('[data-media-error]'); if (error) error.hidden = true;
      let player = wrapper.querySelector('.media-player');
      if (!player) { player = document.createElement('div'); player.className = 'media-player'; player.append(wrapper.querySelector('template').content.cloneNode(true)); wrapper.append(player); }
      button.hidden = true;
      const video = player.querySelector('video'), model = player.querySelector('model-viewer');
      if (video) { video.focus({preventScroll: true}); video.play().catch(() => {}); }
      if (model) { model.siftwellUI ||= new window.Shopify.ModelViewerUI(model); model.siftwellUI.play(); model.focus({preventScroll: true}); registerXR(this); }
      const iframe = player.querySelector('iframe'); if (iframe) iframe.focus({preventScroll: true});
    }
  }
  if (!customElements.get('siftwell-gallery')) customElements.define('siftwell-gallery', SiftwellGallery);
})();
