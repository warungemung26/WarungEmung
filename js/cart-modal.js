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
    showToast('Keranjang masih kosong 😅');
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

// ================= PESAN VIA WA =================
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
  const waktu = waktuPesan(); // ← ICON WAKTU PAKAI INI

  const lines = cart.map(it =>
    `- ${it.qty} x ${it.name} - Rp ${formatRupiah(it.price * it.qty)}`
  );

  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  // ================= TEMPLATE WA BARU DENGAN IKON =================
  const message =
`🛍️ *PESANAN BARU - WARUNG EMUNG*
🆔 *ID Pesanan:* ${orderId}
📅 *Waktu:* ${waktu}

👤 *Nama:* ${nama}
📍 *Alamat:* ${fullAlamat}
📱 *HP:* ${hp || '-'}

🛒 *Detail Pesanan:*
${lines.join('\n')}

💰 *Total:* Rp ${formatRupiah(total)}

Mohon diproses.`;
  // ===============================================================

  // ==== SIMPAN RIWAYAT LENGKAP ====
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
    waktu: waktu,
    date: new Date().toISOString()
  });
  // ==================================

  // Buka WA
  window.open(
    'https://wa.me/6285322882512?text=' + encodeURIComponent(message),
    '_blank'
  );

  // Reset keranjang
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
