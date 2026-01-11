/*!
 * Warung Emung - Global App Config
 * © 2025 Atos
 * Single source of truth
 */

window.APP_CONFIG = {
  /* =========================
     IDENTITAS TOKO
  ========================= */
  STORE: {
    NAME: "Warung Emung",
    TAGLINE: "Praktis, Hemat, Dekat"
  },

  /* =========================
     WHATSAPP
     (DINAMIS VIA JSON)
  ========================= */
  WHATSAPP: {
    DEFAULT: null // diisi otomatis dari data/whatsapp.json
  },

  /* =========================
     CURRENCY
  ========================= */
  CURRENCY: {
    DEFAULT: "Rp",
    SUPPORTED: ["Rp", "$", "PI"],
    RATE: {
      USD: 15000,
      PI: 3200
    }
  },

  /* =========================
     IMAGE & PLACEHOLDER
  ========================= */
  IMAGE: {
    PLACEHOLDER: "images/placeholder.png",
    ERROR: "images/placeholder-error.png"
  },

  /* =========================
     UI BEHAVIOR
  ========================= */
  UI: {
    TOAST_DURATION: 2200,
    THANKYOU_AUTOCLOSE: 2500
  }
};

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