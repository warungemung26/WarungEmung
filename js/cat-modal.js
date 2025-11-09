// ================= CATEGORY MODAL =================
function closeCatModal() {
  catBackdrop.style.display = 'none';
  catModal.classList.remove('open');
  catModal.setAttribute('aria-hidden', 'true');
}
function openCatModal() {
  catBackdrop.style.display = 'flex';
  requestAnimationFrame(() => {
    catModal.classList.add('open');
    catModal.setAttribute('aria-hidden', 'false');
  });
}

// buka modal kategori dari tombol nav bawah
navCatBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openCatModal();
});

closeCatBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeCatModal();
});
catBackdrop.addEventListener('click', (e) => {
  if (e.target === catBackdrop) closeCatModal();
});

catOptions.querySelectorAll('.cat').forEach(el => {
  el.addEventListener('click', () => {
    const cat = el.getAttribute('data-cat');
    setCategory(cat);
    closeCatModal();
  });
});

// ================= INIT =================
closeCatModal();
updateCartCount();
render(products);

// === AUTO SCROLL KE PRODUK LIST ===
function scrollToProdukList() {
  const produkList = document.getElementById('produk-list');
  if (produkList) {
    produkList.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Tambahkan efek scroll setelah kategori di modal diklik
catOptions.querySelectorAll('.cat').forEach(el => {
  el.addEventListener('click', () => {
    setTimeout(scrollToProdukList, 200); // delay sedikit biar render selesai
  });
});

// Tambahkan juga ke kategori grid utama
document.querySelectorAll('.kategori-grid .cat').forEach(el => {
  el.addEventListener('click', () => {
    setTimeout(scrollToProdukList, 200);
  });
});

// === AUTO CLOSE MODAL JUGA SAAT KATEGORI DIKLIK ===
document.querySelectorAll('.kategori-grid .cat').forEach(el => {
  el.addEventListener('click', () => {
    // kalau modal lagi terbuka, tutup juga
    if (catModal.classList.contains('open') || catBackdrop.style.display === 'flex') {
      closeCatModal();
    }
  });
});

catOptions.querySelectorAll('.cat').forEach(el => {
  el.addEventListener('click', () => {
    // pastikan modal tertutup sesudah klik kategori di modal
    closeCatModal();
  });
});
