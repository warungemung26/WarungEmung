/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

let WA_CONFIG = null;

fetch('data/config.json')
  .then(res => res.json())
  .then(cfg => {
    WA_CONFIG = cfg.whatsapp;
    initWhatsAppLinks();
  })
  .catch(err => console.error('❌ Gagal load config WA', err));

function initWhatsAppLinks() {
  if (!WA_CONFIG) return;

  document.querySelectorAll('.wa-link').forEach(el => {
    const type = el.dataset.wa || 'default';
    let text = WA_CONFIG.defaultMessage;

    if (type === 'request') text = WA_CONFIG.requestMessage;
else if (type === 'order') text = WA_CONFIG.orderMessage;
else if (type === 'cart') text = WA_CONFIG.orderMessage;
else if (type === 'cek') text = WA_CONFIG.cekMessage;

    

    const url =
      `https://wa.me/${WA_CONFIG.number}?text=${encodeURIComponent(text)}`;

    el.setAttribute('href', url);

    // untuk button
    if (el.tagName === 'BUTTON') {
      el.onclick = () => window.open(url, '_blank');
    }
  });
}
