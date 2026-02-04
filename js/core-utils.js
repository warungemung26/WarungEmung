/*!
 * ============================================================
 * FILE: core-utils.js
 * PROJECT: Tokopilot / Warung Emung Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */

/*!
 * Warung Emung - Global Utils
 */


/* ===============================
   PRICE NORMALIZER (BASE RP)
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

  const fiatAPI = "https://open.er-api.com/v6/latest/IDR";
  const piAPI   = "https://www.okx.com/api/v5/market/ticker?instId=PI-USDT";

  Promise.allSettled([
    fetch(fiatAPI).then(r => r.json()),
    fetch(piAPI).then(r => r.json())
  ]).then(results => {
    const fiat = results[0].status === "fulfilled" ? results[0].value : null;
    const pi   = results[1].status === "fulfilled" ? results[1].value : null;

    const map = {};

    // ===== FIAT =====
    if (fiat && fiat.rates) {
      Object.keys(APP_CONFIG.CURRENCY.RATE).forEach(cur => {
        if (fiat.rates[cur]) {
          map[cur] = 1 / fiat.rates[cur];
        }
      });
    }

    // ===== PI =====
    if (pi && pi.data && pi.data[0] && pi.data[0].last) {
      const piUSDT = parseFloat(pi.data[0].last);
      const usdRate = map.USD || APP_CONFIG.CURRENCY.RATE.USD;

      if (!isNaN(piUSDT) && usdRate) {
        map.PI = usdRate / piUSDT;
        console.log(" PI live rate:", map.PI);
      }
    } else {
      console.warn(" PI rate offline, pakai lokal");
    }

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
    || "Rp";
};


/* ======================================
   FORMAT PRICE BY CURRENCY
====================================== */
window.formatPriceByCurrency = function (priceRp, currency, opts = {}) {
  const cfg = APP_CONFIG.CURRENCY;
  let cur = currency || cfg.DEFAULT;

  cur = String(cur).toUpperCase();
  if (cur === "$") cur = "USD";
  if (cur === "RP") cur = "Rp";

  const o = Object.assign({
    html: false,
    decimals: cur === "Rp" ? 0 : 2
  }, opts);

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
  return o.html ? htmlSafe(o.html, text) : { text, icon: null };
};

function htmlSafe(isHtml, text){
  return isHtml ? text : text;
}


/* ======================================
   BACKWARD COMPATIBLE FORMATTER
====================================== */
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


/* ======================================
   BOOTSTRAP
====================================== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.loadOnlineRates) loadOnlineRates();
});
