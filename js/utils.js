/*!
 * Warung Emung - Global Utils
 */

window.getSelectedCurrency = function () {
  return localStorage.getItem("selectedCurrency")
    || APP_CONFIG.CURRENCY.DEFAULT;
};

window.openWA = function (text) {
  const wa = APP_CONFIG.WHATSAPP.DEFAULT;
  const url = `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
};

window.getProductImage = function (img) {
  return img || APP_CONFIG.IMAGE.PLACEHOLDER;
};
