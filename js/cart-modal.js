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
function renderCartModal() {
  cartItemsEl.innerHTML = '';
  let subtotal = 0;
  const ONGKIR = 2000;

  cart.forEach(it => {
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div>${it.name} x ${it.qty}</div>
      <div>${formatRupiah(it.price * it.qty)}</div>
    `;
    cartItemsEl.appendChild(row);

    subtotal += it.price * it.qty;
  });

  const total = subtotal + ONGKIR;

  // UPDATE TOTAL
  cartTotalEl.innerHTML = `
    Subtotal: <strong>${formatRupiah(subtotal)}</strong><br>
    Ongkir: <strong>${formatRupiah(ONGKIR)}</strong><br>
    <strong>Total: ${formatRupiah(total)}</strong>
  `;
}


// ================= NAVBAR CART BUTTON =================
navCartBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showToast('Keranjang masih kosong 😅');
    return;
  }

  renderCartModal();

  const visible = cartModal.style.display === 'block';
  cartModal.style.display = visible ? 'none' : 'block';
});


// ================= CLEAR CART =================
clearCartBtn.addEventListener('click', () => {
  if (!confirm('Kosongkan keranjang?')) return;

  cart = [];
  updateCartCount();
  renderCartModal();

  cartModal.style.display = 'none';
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
  const lines = cart.map(it =>
    `- ${it.qty} x ${it.name} - Rp ${formatRupiah(it.price * it.qty)}`
  );

  // HITUNG TOTAL
  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const ONGKIR = 2000;
  const total = subtotal + ONGKIR;

  // FORMAT WA
  const message = `
🛍️ *PESANAN BARU - WARUNG EMUNG*
🆔 *ID Pesanan:* ${orderId}
📅 *Waktu:* ${waktu}

👤 *Nama:* ${nama}
📍 *Alamat:* ${fullAlamat}
📱 *HP:* ${hp || '-'}

🛒 *Detail Pesanan:*
${lines.join('\n')}

🧾 *Subtotal:* Rp ${formatRupiah(subtotal)}
🚚 *Ongkir:* Rp ${formatRupiah(ONGKIR)}
💰 *Total:* Rp ${formatRupiah(total)}

Mohon diproses.`;


  // SIMPAN RIWAYAT
  simpanRiwayat({
    id: orderId,
    items: cart.map(it => ({
      id: it.id || null,
      name: it.name,
      qty: it.qty,
      harga: it.price,
      subtotal: it.price * it.qty
    })),
    subtotal: subtotal,
    ongkir: ONGKIR,
    total: total,
    waktu: waktu,
    date: new Date().toISOString(),
    nama: nama,
    alamat: fullAlamat,
    hp: hp
  });

  // KIRIM WA
  window.open(
    'https://wa.me/6285322882512?text=' + encodeURIComponent(message),
    '_blank'
  );

  // RESET CART
  cartModal.style.display = 'none';
  cart = [];
  updateCartCount();
  renderCartModal();
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
