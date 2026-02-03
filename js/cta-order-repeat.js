/*!
 * ============================================================
 * FILE: cta-order-repeat.js
 * PROJECT: Tokopilot / Warung Emung Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */


(function () {

  /**
   * ulangi pesanan dari riwayat
   * @param {Object} order
   */
  window.ulangiPesanan = function (order) {
    if (!order || !order.items || !order.items.length) {
      console.warn("Data riwayat kosong");
      return;
    }

    order.items.forEach(item => {

      // cari di cart apakah sudah ada
      const existing = cart.find(c => c.name === item.name);

      if (existing) {
        existing.qty += item.qty;
      } else {
        cart.push({
          name: item.name,
          qty: item.qty,
          price: item.price,
          img: item.img || "images/placeholder.png" 
        });
      }
    });

    updateCartCount();
    renderCart();

    showToast("Pesanan berhasil diulangi 🛒");
    ding.currentTime = 0;
    ding.play().catch(()=>{});
  };

})();
