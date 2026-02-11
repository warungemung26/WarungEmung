/*!
 * ============================================================
 * FILE: core-config.js
 * PROJECT: Tokopilot / Warung Emung Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */

/* =========================
   SAFE INIT
========================= */
window.APP_CONFIG = window.APP_CONFIG || {};

/* =========================
   MAIN CONFIG OBJECT
========================= */
Object.assign(window.APP_CONFIG, {

  /* =========================
     IDENTITAS TOKO
  ========================= */
  STORE: {
    NAME: "Warung Emung",
    TAGLINE: "Praktis, Hemat, Dekat"
  },

  /* =========================
     SHIPPING (TERPUSAT)
  ========================= */
  SHIPPING: {
    ENABLED: true,
    TYPE: "flat",          // flat | api | dynamic
    FLAT_RATE: 3000,
    CURRENCY: "Rp",

    // future ready
    API_URL: "",
    LAST_SYNC: null
  },

  /* =========================
     WHATSAPP
  ========================= */
  WHATSAPP: {
    DEFAULT: null
  },

  /* =========================
     CURRENCY
  ========================= */
  CURRENCY: {
  DEFAULT: "Rp",
  SUPPORTED: ["Rp", "$", "EUR", "QAR", "JPY", "SGD", "MYR", "PI", "BTC", "ETH"],
  RATE: {
    USD: 17000,
    EUR: 19500,
    QAR: 4700,
    JPY: 115,
    SGD: 12500,
    MYR: 3600,
    PI: 3200,
    BTC: 1100000000,
    ETH: 55000000
  }
},


  /* =========================
     IMAGE
  ========================= */
  IMAGE: {
    PLACEHOLDER: "images/placeholder.png",
    ERROR: "images/placeholder-error.png"
  },

  /* =========================
     UI
  ========================= */
  UI: {
    TOAST_DURATION: 2200,
    THANKYOU_AUTOCLOSE: 2500
  }
});

/* =========================
   LOAD WA NUMBER FROM JSON
========================= */
fetch("data/whatsapp.json")
  .then(res => res.json())
  .then(data => {
    if (data && data.default) {
      APP_CONFIG.WHATSAPP.DEFAULT = data.default;
      console.log("WA number loaded:", data.default);
    }
  })
  .catch(() => {
    console.warn("whatsapp.json tidak ditemukan / gagal dimuat");
  });
