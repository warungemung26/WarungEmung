/*!
 * ============================================================
 * FILE: core-utils.js
 * PROJECT: Tokopilot / Atos Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */

/* ===============================
   PRICE NORMALIZER (BASE IDR)
================================ */
window.normalizePrice = function (val) {
  const num = parseFloat(val);
  if (isNaN(num)) return 0;
  return num;
};


/* ======================================
   ONLINE CURRENCY RATE (SAFE CACHE)
====================================== */
window.loadOnlineRates = function () {
  if (!window.APP_CONFIG || !APP_CONFIG.CURRENCY) return;

  const CACHE_KEY = "currencyRatesCache";
  const TTL = 1000 * 60 * 60 * 6; // 6 jam

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    if (cached.time && Date.now() - cached.time < TTL && cached.data) {
      APP_CONFIG.CURRENCY.RATE = Object.assign({}, APP_CONFIG.CURRENCY.RATE, cached.data);
      console.log(" Currency rate from cache:", cached.data);
      return;
    }
  } catch (e) {}

  const API = "https://open.er-api.com/v6/latest/IDR";

  fetch(API)
    .then(r => r.json())
    .then(res => {
      if (!res || !res.rates) return;

      const map = {};

      Object.keys(APP_CONFIG.CURRENCY.RATE).forEach(cur => {
        if (res.rates[cur]) {
          map[cur] = Number((1 / res.rates[cur]).toFixed(4));
        }
      });

      APP_CONFIG.CURRENCY.RATE = Object.assign({}, APP_CONFIG.CURRENCY.RATE, map);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        time: Date.now(),
        data: map
      }));

      console.log(" Currency rate updated:", map);

      if (typeof updatePrices === "function") updatePrices(getSelectedCurrency());
      if (typeof updateFlashDisplay === "function") updateFlashDisplay();
    })
    .catch(err => console.warn("Rate online gagal, pakai lokal", err));
};


/* ======================================
   CURRENCY SELECTOR
====================================== */
window.getSelectedCurrency = function () {
  return localStorage.getItem("selectedCurrency")
    || (window.APP_CONFIG && APP_CONFIG.CURRENCY && APP_CONFIG.CURRENCY.DEFAULT)
    || "IDR";
};


/* ======================================
   FORMAT PRICE BY CURRENCY
====================================== */
window.formatPriceByCurrency = function (priceIdr, currency, opts = {}) {
  const cfg = APP_CONFIG.CURRENCY;
  let cur = (currency || cfg.DEFAULT || "IDR").toUpperCase();

  if (cur === "$") cur = "USD";
  if (cur === "RP") cur = "IDR";

  const o = Object.assign({
    html: false,
    decimals: cur === "IDR" ? 0 : 2
  }, opts);

  if (cur === "IDR") {
    const text = "Rp " + Number(priceIdr).toLocaleString("id-ID");
    return o.html ? text : { text, icon: null };
  }

  const rate = cfg.RATE[cur];

  if (!rate) {
    console.warn("Rate tidak ditemukan:", cur, cfg.RATE);
    const text = "Rp " + Number(priceIdr).toLocaleString("id-ID");
    return o.html ? text : { text, icon: null };
  }

  const converted = priceIdr / rate;
  const num = Number(converted).toFixed(o.decimals);

  if (cur === "PI") {
    const html = `<img src="images/pi-logo.png" class="pi-logo"> PI ${num}`;
    return o.html ? html : { text: `PI ${num}`, icon: "images/pi-logo.png" };
  }

  const text = `${cur} ${num}`;
  return o.html ? text : { text, icon: null };
};


/* ======================================
   BACKWARD COMPATIBLE FORMATTER
====================================== */
window.formatPrice = function (priceIdr, currency, opts) {
  return formatPriceByCurrency(
    priceIdr,
    currency || getSelectedCurrency(),
    Object.assign({ html: true }, opts || {})
  );
};


// =====================================
// ONGKIR HELPER (CURRENCY READY)
// =====================================
window.getOngkir = function (currency) {
  const cfg = window.APP_CONFIG?.SHIPPING;
  if (!cfg || !cfg.ENABLED) return 0;

  const base = Number(cfg.FLAT_RATE) || 0;

  if (!currency || currency === "IDR" || currency === "Rp") {
    return base;
  }

  const rate = APP_CONFIG.CURRENCY.RATE[currency];
  if (!rate) return base;

  return base / rate;
};


/* ======================================
   WHATSAPP
====================================== */
window.openWA = function (text) {
  const wa = APP_CONFIG?.WHATSAPP?.DEFAULT;
  if (!wa) {
    alert("Nomor WhatsApp belum siap");
    return;
  }

  const url = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};


/* ======================================
   IMAGE FALLBACK
====================================== */
window.getProductImage = function (img) {
  return img || APP_CONFIG.IMAGE.PLACEHOLDER;
};


/* ======================================
   BOOTSTRAP
====================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.loadOnlineRates) loadOnlineRates();
});
