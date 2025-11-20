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
    showToast('Keranjang masih kosong ');
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
  if (cart.length === 0) {
    showToast('Keranjang kosong');
    return;
  }

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

  const lines = cart.map(it =>
    `- ${it.qty} x ${it.name} - Rp ${formatRupiah(it.price * it.qty)}`
  );

  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const message =
`PESANAN BARU - WARUNG EMUNG
ID Pesanan: ${orderId}

Nama: ${nama}
Alamat: ${fullAlamat}
HP: ${hp || '-'}

Detail Pesanan:
${lines.join('\n')}

Total: Rp ${formatRupiah(total)}

Mohon diproses.`;

  // ==== SIMPAN RIWAYAT DENGAN DETAIL 100% ====
  simpanRiwayat({
    id: orderId,
    items: cart.map(it => ({
      id: it.id || null,
      name: it.name,
      qty: it.qty,
      harga: it.price,
      subtotal: it.price * it.qty
    })),
    total: total,
    date: new Date().toISOString()
  });
  // ==========================================

  // Buka WA
  window.open(
    'https://wa.me/6285322882512?text=' + encodeURIComponent(message),
    '_blank'
  );

  // Tutup modal dan reset keranjang
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