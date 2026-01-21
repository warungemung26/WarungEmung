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

  // HINT
  if(cart.length){
    cartItemsEl.innerHTML = `
      <div style="font-size:11px;opacity:.6;text-align:center;margin:4px 0">
        Atur jumlah pesanan di sini sebelum kirim 
      </div>
    `;
  }

  cart.forEach((it, index) => {
    const row = document.createElement('div');
    row.className = 'item';

    let priceStr;
    if (currency === 'PI') {
      priceStr = `<img src="images/pi-logo.png" class="pi-logo"> PI ${(it.price / 3200 * it.qty).toFixed(2)}`;
    } else {
      priceStr = formatPrice(it.price * it.qty, currency);
    }

    row.innerHTML = `
  <div class="cart-left">
    <img src="${it.img || 'images/placeholder.png'}"
      onerror="this.src='images/placeholder.png'"
      alt="${it.name}"
      class="cart-img">

    <div class="cart-info">
      <div class="cart-name">${it.name}</div>

      <div class="cart-qty-control">
        <button type="button" class="cart-minus" data-index="${index}">-</button>
<span>${it.qty}</span>
<button type="button" class="cart-plus" data-index="${index}">+</button>
      </div>
    </div>
  </div>

  <div class="cart-price">${priceStr}</div>
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

  const miniTotal = document.getElementById("cart-mini-total");

if(miniTotal){
  miniTotal.innerHTML = `
    <div class="row">
      <span>Subtotal</span>
      <span>${subtotalStr}</span>
    </div>
    <div class="row">
      <span>Ongkir</span>
      <span>${ongkirStr}</span>
    </div>
    <div class="row total">
      <span>Total</span>
      <span>${totalStr}</span>
    </div>
  `;
}

  
  renderCartMiniPanel();
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


function renderCartMiniPanel(){
  const box = document.getElementById("cart-mini-address");
  if(!box) return;

  const data = JSON.parse(localStorage.getItem("userData") || "{}");

  if(!data.alamat){
    box.innerHTML = `<i>Alamat belum diisi</i>`;
    return;
  }

  box.innerHTML = `
    <strong>${data.alamat || ''} ${data.noRumah || ''}
  `;
}

document.addEventListener("click", e=>{
  if(e.target.closest("#cart-btn-address")){
    closeCartModal();

    setTimeout(()=>{
      if(typeof window.openAccount === "function"){
        window.openAccount();
      }else{
        showToast("Menu akun belum siap");
      }
    },150);
  }
});

// Catatan
document.addEventListener("click", function(e){
  if(e.target.closest("#cart-btn-note")){
    const old = localStorage.getItem("cartNote") || "";
    const note = prompt("Catatan untuk pesanan:", old);

    if(note !== null){
      localStorage.setItem("cartNote", note);
      showToast("Catatan disimpan ");
    }
  }
});

document.addEventListener("click", function (e) {

  const btn = e.target;

  if (!btn.classList.contains("cart-plus") &&
      !btn.classList.contains("cart-minus")) return;

  e.preventDefault();

  const index = btn.dataset.index;
  if (index === undefined) return;

  if (!cart[index]) return;

  if (btn.classList.contains("cart-plus")) {
    cart[index].qty++;
  }

  if (btn.classList.contains("cart-minus")) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
  }

  renderCartModal();
  updateCartCount();
});
