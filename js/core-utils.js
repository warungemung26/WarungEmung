/*!
 * ============================================================
 * FILE: core-utils.js
 * PROJECT: Tokopilot / Atos Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */


/*!
 * Warung Emung - Global Utils
 */

window.getSelectedCurrency = function () {
  return localStorage.getItem("selectedCurrency")
    || (window.APP_CONFIG && APP_CONFIG.CURRENCY && APP_CONFIG.CURRENCY.DEFAULT)
    || "Rp";
};

window.formatPriceByCurrency = function (priceRp, currency, opts = {}) {
  const cfg = APP_CONFIG.CURRENCY;
  let cur = currency || cfg.DEFAULT;

  // ===== NORMALIZE FIRST =====
  cur = String(cur).toUpperCase();
  if (cur === "$") cur = "USD";
  if (cur === "RP") cur = "Rp";

  // ===== OPTIONS AFTER NORMALIZE =====
  const o = Object.assign({
    html: false,
    decimals: cur === "Rp" ? 0 : 2
  }, opts);

  // ===== RUPIAH =====
  if (cur === "Rp") {
    const text = "Rp " + Number(priceRp).toLocaleString("id-ID");
    return o.html ? text : { text, icon: null };
  }

  const rate = cfg.RATE[cur];

  if (!rate) {
    console.warn("Rate tidak ditemukan:", cur, cfg.RATE);
    const text = "Rp " + Number(priceRp).toLocaleString("id-ID");
    return o.html ? text : { text, icon: null };
  }

  const converted = priceRp / rate;
  const num = Number(converted).toFixed(o.decimals);

  if (cur === "PI") {
    const html = `<img src="images/pi-logo.png" class="pi-logo"> PI ${num}`;
    return o.html ? html : { text: `PI ${num}`, icon: "images/pi-logo.png" };
  }

  const text = `${cur} ${num}`;
  return o.html ? text : { text, icon: null };
};

// ===== BACKWARD COMPATIBLE FORMATTER =====
window.formatPrice = function (priceRp, currency, opts) {
  return formatPriceByCurrency(
    priceRp,
    currency || getSelectedCurrency(),
    Object.assign({ html: true }, opts || {})
  );
};


/* ======================================
   WHATSAPP
====================================== */
window.openWA = function (text) {
  const wa = APP_CONFIG.WHATSAPP.DEFAULT;
  const url = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

/* ======================================
   IMAGE FALLBACK
====================================== */
window.getProductImage = function (img) {
  return img || APP_CONFIG.IMAGE.PLACEHOLDER;
};
