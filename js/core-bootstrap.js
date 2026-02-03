/*!
 * ============================================================
 * FILE: core-bootstrap.js
 * PROJECT: Tokopilot / Atos Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
*/

// ================= SCRIPT PRODUK & KERANJANG =================

// --- ELEMENTS ---
const listEl = document.getElementById('produk-list');
const searchEl = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const waCartBtn = document.getElementById('wa-cart');
const clearCartBtn = document.getElementById('clear-cart');
const catBackdrop = document.getElementById('cat-modal-backdrop');
const catModal = document.getElementById('cat-modal');
const closeCatBtn = document.getElementById('close-cat');
const catOptions = document.getElementById('cat-options');
const toastEl = document.getElementById('toast');
const navCartBtn = document.getElementById('nav-cart');
const navCatBtn = document.getElementById('nav-cat');
const cartBadge = document.getElementById('cart-badge');
const closeCartBtn = document.getElementById('close-cart');
const cartBackdrop = document.getElementById('cart-backdrop');


let currentCategory = '';
let cart = [];


// ================= SUARA =================
const ding = new Audio('sounds/ding.mp3'); // pastikan file ada di folder sounds/

// ================= HELPERS =================
function formatRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function showToast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.style.display = 'block';
  setTimeout(() => (toastEl.style.display = 'none'), 2000);
}

function updateCartCount() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  cartBadge.textContent = totalQty;
  cartBadge.style.display = totalQty > 0 ? 'flex' : 'none';
  cartCountEl.textContent = totalQty;
  cartCountEl.style.display = totalQty > 0 ? 'flex' : 'none';
}

const logo = document.getElementById('logoMini');

  logo.addEventListener('click', () => {
    // Tutup semua modal yang terbuka
    const openModals = document.querySelectorAll('.modal'); // ganti sesuai class modal
    openModals.forEach(modal => {
      // Jika modal punya fungsi close internal, panggil dulu
      if(typeof modal.close === 'function'){
        modal.close(); // misal modal punya method close()
      } else {
        // Kalau tidak, sembunyikan secara manual
        modal.style.display = 'none';
      }
    });

// Scroll ke HOME (aman untuk header fixed/sticky)
const homeSection = document.getElementById('home');
if (homeSection && typeof safeScrollTo === 'function') {
  safeScrollTo(homeSection, 0);
}
});

/**
 * Scroll aman ke elemen (anti ketutup header/search/sticky)
 * @param {HTMLElement|string} target
 * @param {number} extra jarak tambahan (opsional)
 */
function safeScrollTo(target, extra = 12){
  const el = typeof target === 'string'
    ? document.querySelector(target)
    : target;

  if(!el) return;

  let offset = 0;

  document.querySelectorAll('header, .search-container, .sticky, .fixed')
    .forEach(e => {
      const s = getComputedStyle(e);
      if(s.position === 'fixed' || s.position === 'sticky'){
        offset += e.offsetHeight;
      }
    });

  const y =
    el.getBoundingClientRect().top +
    window.pageYOffset -
    offset -
    extra;

  window.scrollTo({
    top: Math.max(0, y),
    behavior: 'smooth'
  });
}

