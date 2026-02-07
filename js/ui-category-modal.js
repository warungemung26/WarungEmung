/*!
 * ============================================================
 * FILE: ui-category-modal.js
 * PROJECT: Tokopilot / Warung Emung Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */

// ================= CATEGORY LOADING =================
(function(){
  if (document.getElementById('cat-loading')) return;

  const loader = document.createElement('div');
  loader.id = 'cat-loading';
  loader.innerHTML = `
    <div class="cat-loader-box">
      <div class="cat-spinner"></div>
      <div class="cat-loader-text">Memuat kategori...</div>
    </div>
  `;
  document.body.appendChild(loader);

  window.showCatLoading = function(){
    loader.classList.add('show');
  };

  window.hideCatLoading = function(){
    loader.classList.remove('show');
  };
})();

// ================= SLIDE MENU CATEGORY

function slideCat(direction) {
  const container = document.getElementById("cat-scroll");
  const amount = 150; // jarak geser

  container.scrollBy({
    left: direction * amount,
    behavior: "smooth"
  });
}

const catScroll = document.getElementById("cat-scroll");
const leftArrow  = document.querySelector(".cat-arrow.left");
const rightArrow = document.querySelector(".cat-arrow.right");

// Cek posisi scroll
function updateCatArrows() {
  const maxScroll = catScroll.scrollWidth - catScroll.clientWidth;

  // Sembunyikan panah kiri jika posisi sudah di paling kiri
  if (catScroll.scrollLeft <= 5) {
    leftArrow.style.opacity = "0";
    leftArrow.style.pointerEvents = "none";
  } else {
    leftArrow.style.opacity = "1";
    leftArrow.style.pointerEvents = "auto";
  }

  // Sembunyikan panah kanan jika posisi sudah di paling kanan
  if (catScroll.scrollLeft >= maxScroll - 5) {
    rightArrow.style.opacity = "0";
    rightArrow.style.pointerEvents = "none";
  } else {
    rightArrow.style.opacity = "1";
    rightArrow.style.pointerEvents = "auto";
  }
}

// Jalankan saat scroll
catScroll.addEventListener("scroll", updateCatArrows);

// Jalankan sekali setelah load
window.addEventListener("load", updateCatArrows);

// Tombol klik geser
function slideCat(dir) {
  const step = 150; // jarak geser
  catScroll.scrollBy({ left: dir * step, behavior: "smooth" });
  setTimeout(updateCatArrows, 300);
}


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

    // 1. Tutup modal dulu
    closeCatModal();
    showCatLoading();

    // 2. Paksa browser render penutupan modal
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // 3. Baru jalankan proses berat
        setTimeout(() => {
          setCategory(cat);

          // 4. Sembunyikan loading
          setTimeout(() => {
            hideCatLoading();
          }, 200);

        }, 10);

      });
    });
  });
});

// ================= INIT =================
closeCatModal();
updateCartCount();
render(products);

// === AUTO SCROLL KE PRODUK LIST (PAKAI HELPER GLOBAL) ===
function scrollToProdukList() {
  if (typeof safeScrollTo !== 'function') return;
  safeScrollTo('#produk-list');
}

// Setelah kategori di modal diklik
catOptions.querySelectorAll('.cat').forEach(el => {
  el.addEventListener('click', () => {
    // tunggu render/filter selesai
    setTimeout(scrollToProdukList, 200);
  });
});

// Setelah kategori grid utama diklik
document.querySelectorAll('.kategori-grid .cat').forEach(el => {
  el.addEventListener('click', () => {
    showCatLoading();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          hideCatLoading();
          scrollToProdukList();
        }, 200);
      });
    });
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
