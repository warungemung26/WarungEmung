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
     (tanpa +, tanpa spasi)
  ========================= */
  WHATSAPP: {
    DEFAULT: "6285322882512", // ganti nomor utama
    // ADMIN: "6289xxxxxxx" // opsional kalau nanti multi admin
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
