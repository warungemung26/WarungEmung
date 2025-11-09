// ================= SCRIPT PRODUK & KERANJANG =================

// --- ELEMENTS ---
const listEl = document.getElementById('produk-list');
const searchEl = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');
const openCartBtn = document.getElementById('open-cart');
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

// ================= RENDER PRODUK =================
function render(data) {
  listEl.innerHTML = '';
  if (!data || data.length === 0) {
    listEl.innerHTML = '<div style="padding:12px;background:#fff;border:1px dashed #eee;border-radius:8px">Tidak ada produk</div>';
    return;
  }

  data.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = p.img || 'images/placeholder.png';
    img.alt = p.name;
    card.appendChild(img);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = p.name;
    card.appendChild(title);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatRupiah(p.price);
    card.appendChild(price);

    // === Kontrol Qty + Tombol Add ===
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'controls-wrapper';

    const controls = document.createElement('div');
    controls.className = 'qty-controls';

    const minus = document.createElement('button');
    minus.type = 'button';
    minus.textContent = '-';
    minus.className = 'btn-minus';

    let q = 1;
    const qty = document.createElement('span');
    qty.textContent = q;
    qty.className = 'qty-number';

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.className = 'btn-plus';

    minus.addEventListener('click', (e) => {
      e.stopPropagation();
      if (q > 1) { q--; qty.textContent = q; }
    });
    plus.addEventListener('click', (e) => {
      e.stopPropagation();
      q++; qty.textContent = q;
    });

    controls.appendChild(minus);
    controls.appendChild(qty);
    controls.appendChild(plus);

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'add-btn';
    add.innerHTML = '<i class="fa fa-cart-plus"></i>';

    add.addEventListener('click', (e) => {
      e.stopPropagation();
      const existing = cart.find(it => it.name === p.name);
      if (existing) { existing.qty += q; }
      else { cart.push({ name: p.name, qty: q, price: p.price }); }
      updateCartCount();
      showToast(`Ditambahkan: ${p.name} x ${q}`);
      ding.currentTime = 0;
      ding.play().catch(()=>{}); // supaya tidak error di browser tanpa izin suara
      q = 1; qty.textContent = '1';
    });

    controlsWrapper.appendChild(controls);
    controlsWrapper.appendChild(add);
    card.appendChild(controlsWrapper);

    listEl.appendChild(card);
  });
}

// ================= CART MODAL =================
function renderCartModal() {
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach(it => {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `<div>${it.name} x ${it.qty}</div><div>${formatRupiah(it.price * it.qty)}</div>`;
    cartItemsEl.appendChild(row);
    total += it.price * it.qty;
  });
  cartTotalEl.textContent = 'Total: ' + formatRupiah(total);
}

// Klik icon keranjang di bottom nav
navCartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (cart.length === 0) {
    showToast('Keranjang masih kosong 🛒');
    return;
  }
  renderCartModal();
  const visible = cartModal.style.display === 'block';
  cartModal.style.display = visible ? 'none' : 'block';
});

// Kosongkan keranjang
clearCartBtn.addEventListener('click', () => {
  if (!confirm('Kosongkan keranjang?')) return;
  cart = [];
  updateCartCount();
  renderCartModal();
  cartModal.style.display = 'none';
});

// Pesan via WA
waCartBtn.addEventListener('click', () => {
  if (cart.length === 0) { showToast('Keranjang kosong 🛒'); return; }
  const lines = cart.map(it => `${it.qty} x ${it.name} = ${formatRupiah(it.price * it.qty)}`);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
  lines.push('\nTotal: ' + formatRupiah(total));
  const message = `Halo Warung Emung, saya pesan:\n` + lines.join('\n');
  window.open('https://wa.me/6285322882512?text=' + encodeURIComponent(message), '_blank');
  cartModal.style.display = 'none';
});



// ================= HAPUS FLOATING LAMA =================
const oldFloat = document.querySelector('.floating-cart');
if (oldFloat) oldFloat.remove();
