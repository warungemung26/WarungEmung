/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

/* js/cart-modal.js
   Menangani Cart Modal (Pesan sekarang, Kosongkan, template WA, save riwayat)
*/

// ================= FORMAT WAKTU =================
function waktuPesan() {
  const d = new Date();
  const tgl = d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const jam = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${tgl}, ${jam}`;
}


// ================= CART MODAL =================
function getSelectedCurrency() {
  return localStorage.getItem('selectedCurrency') || 'Rp';
}


function renderCartModal() {
  const currency = getSelectedCurrency(); // ambil currency saat ini
  cartItemsEl.innerHTML = '';
  let subtotal = 0;
  const ONGKIR = 2000;

  cart.forEach(it => {
    const row = document.createElement('div');
    row.className = 'item';

    let priceStr;
    if (currency === 'PI') {
      priceStr = `<img src="images/pi-logo.png" class="pi-logo"> PI ${(it.price / 3200 * it.qty).toFixed(2)}`;
    } else {
      priceStr = formatPrice(it.price * it.qty, currency);
    }

    row.innerHTML = `
      <div>${it.name} x ${it.qty}</div>
      <div>${priceStr}</div>
    `;
    cartItemsEl.appendChild(row);

    subtotal += it.price * it.qty;
  });

  let subtotalStr, ongkirStr, totalStr;
  const total = subtotal + ONGKIR;

  if (currency === 'PI') {
    subtotalStr = `<img src="images/pi-logo.png" class="pi-logo"> PI ${(subtotal / 3200).toFixed(2)}`;
    ongkirStr = `<img src="images/pi-logo.png" class="pi-logo"> PI ${(ONGKIR / 3200).toFixed(2)}`;
    totalStr = `<img src="images/pi-logo.png" class="pi-logo"> PI ${(total / 3200).toFixed(2)}`;
  } else {
    subtotalStr = formatPrice(subtotal, currency);
    ongkirStr = formatPrice(ONGKIR, currency);
    totalStr = formatPrice(total, currency);
  }

  cartTotalEl.innerHTML = `
    Subtotal: <strong>${subtotalStr}</strong><br>
    Ongkir: <strong>${ongkirStr}</strong><br>
    <strong>Total: ${totalStr}</strong>
  `;
}


// ================= CLOSE CART MODAL =================
function closeCartModal() {
  cartModal.style.display = "none";
  cartBackdrop.style.display = "none";
}

// Klik tombol X
closeCartBtn.addEventListener("click", closeCartModal);

// Klik di backdrop
cartBackdrop.addEventListener("click", closeCartModal);


// ================= NAVBAR CART BUTTON =================
navCartBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Keranjang masih kosong ');
    return;
  }

  renderCartModal();

  // buka modal dan backdrop
  cartModal.style.display = "block";
  cartBackdrop.style.display = "block";
});


// ================= PESAN VIA WA =================
waCartBtn.addEventListener('click', () => {

  if (cart.length === 0) {
    showToast('Keranjang kosong');
    return;
  }

  // Ambil data user
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const nama = userData.nama || 'Pelanggan';
  const alamat = userData.alamat || '';
  const noRumah = userData.noRumah || '';
  const rtrw = userData.rtrw || '';
  const hp = userData.hp || '';

  const fullAlamat =
    `${alamat}${noRumah ? ' No. ' + noRumah : ''}` +
    `${rtrw ? ', RT/RW ' + rtrw : ''}`;

  const orderId = 'EM-' + Date.now().toString().slice(-6);
  const waktu = waktuPesan();

  // Item list untuk WA
  const lines = cart.map(it => {
  if (currency === 'PI') {
    return `- ${it.qty} x ${it.name} - PI ${(it.price / 3200 * it.qty).toFixed(2)}`;
  } else {
    return `- ${it.qty} x ${it.name} - ${formatPrice(it.price * it.qty, currency)}`;
  }
});


  // HITUNG TOTAL
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const ONGKIR = 2000;
  const total = subtotal + ONGKIR;



});


// ================= SIMPAN RIWAYAT =================
function simpanRiwayat(order) {
  const riwayat = JSON.parse(localStorage.getItem('riwayat') || '[]');
  riwayat.push(order);
  localStorage.setItem('riwayat', JSON.stringify(riwayat));
}


// ================= SIDEBAR CART BUTTON =================
const sidebarCartBtn = document.getElementById("open-cart");

if (sidebarCartBtn) {
  sidebarCartBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("Keranjang masih kosong 😅");
      return;
    }

    renderCartModal();

    const visible = cartModal.style.display === "block";
    cartModal.style.display = visible ? "none" : "block";
  });
}

