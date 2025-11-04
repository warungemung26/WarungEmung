// js/cart.js
// Klik tombol Cart di bottom-nav → klik floating asli (#open-cart)
document.querySelector('.bottom-nav a[href="#cart"]').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('open-cart').click();
});

// ✅ Klik tombol Kategori di bottom-nav → klik tombol kategori floating
document.querySelector('.bottom-nav a[href="#cat"]').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('cat-float').click();
});

// ✅ setiap update cart → tampilkan juga jumlah di bottom-nav
function updateCartCountUI(qty) {

  // bottom-nav
  document.querySelector('#nav-cart #cart-count').textContent = qty;
  document.querySelector('#nav-cart #cart-count').style.display = qty > 0 ? 'inline-block' : 'none';
}

document.getElementById('wa-cart').addEventListener('click', function() {
  document.querySelectorAll('.qty-input').forEach(function(input) {
      input.value = 0;
  });
  cart = [];
  updateCartCount();
  renderCartModal();
  const cartModal = document.getElementById('cart-modal');
  cartModal.classList.remove('open');
  cartModal.setAttribute('aria-hidden', 'true');
});


