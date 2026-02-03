/*!
 * ============================================================
 * FILE: cta-whatsapp.js
 * PROJECT: Tokopilot / Warung Emung Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 *
 */


(function () {
  // pastikan config ada
  if (!window.APP_CONFIG || !APP_CONFIG.WHATSAPP) {
    console.warn("APP_CONFIG.WHATSAPP belum tersedia");
    return;
  }

  /**
   * Buka WhatsApp dengan text
   * @param {string} text
   */
  window.openWA = function (text) {
    if (!text) return;

    const number = APP_CONFIG.WHATSAPP.DEFAULT;
    const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(text);

    window.open(url, "_blank");
  };
})();
