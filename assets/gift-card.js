document.querySelector('[data-print-gift-card]')?.addEventListener('click', () => window.print());
const giftCardQR = document.querySelector('[data-gift-card-qr]');
if (giftCardQR?.dataset.identifier && typeof QRCode === 'function') {
  new QRCode(giftCardQR, { text: giftCardQR.dataset.identifier, width: 160, height: 160 });
  giftCardQR.removeAttribute('title');
  giftCardQR.querySelectorAll('img, canvas').forEach(node => node.setAttribute('aria-hidden', 'true'));
}
