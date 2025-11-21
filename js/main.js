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

// =====================
// FORMAT WAKTU INDONESIA
// =====================
function formatWaktu(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}


// Variabel modal
const accountBackdrop = document.getElementById('account-backdrop');
const accountModal = document.getElementById('account-modal');
const accSaveBtn = document.getElementById('acc-save-btn');
const accCloseBtn = document.getElementById('acc-close-btn');

// Tab switch
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Hapus active dari semua tombol
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Hapus active dari semua konten
    tabContents.forEach(c => c.classList.remove("active"));

    // Tambahkan active ke konten target
    const target = btn.getAttribute("data-tab");
    const targetContent = document.getElementById(target);
    if(targetContent) targetContent.classList.add("active");

    // Load riwayat jika tab Riwayat
    if(target === "tab-riwayat") loadRiwayat();
  });
});

// ===============================
// LOAD RIWAYAT + FORMAT TANGGAL
// ===============================
function loadRiwayat() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");

  if(r.length === 0){
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }

  wrap.innerHTML = r.map(order => `
    <div class="riwayat-item">
      <strong>ID Pesanan: ${order.id}</strong><br>
      <ul>
        ${order.items.map(it => `<li>${it.qty} x ${it.name} - Rp ${it.subtotal}</li>`).join("")}
      </ul>
      <strong>Total: Rp ${order.total}</strong><br>
      Waktu: ${formatWaktu(order.waktu || order.date)}
    </div>
  `).join("");
}


// ================= HAPUS FLOATING LAMA =================
const oldFloat = document.querySelector('.floating-cart');
if (oldFloat) oldFloat.remove();
