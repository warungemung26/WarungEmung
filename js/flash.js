/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

// ================= FLASH SALE ===================

// container
const flashBox = document.getElementById("flash-list");
if (!flashBox) {
  console.warn("⚠️ flash-list tidak ditemukan di HTML");
}

// ================= RENDER ===================
function renderFlash(list) {
  if (!flashBox) return;

  flashBox.innerHTML = "";

  list.forEach(p => {
    const item = document.createElement("div");
    item.className = "flash-card";

    item.innerHTML = `
      <img src="${p.img}" class="flash-img">

      <div class="flash-info">
        <div class="flash-title">${p.name}</div>
        <div class="flash-label">${p.label}</div>

        <div class="flash-price">
          <span class="flash-new">Rp ${p.price_flash.toLocaleString()}</span>
          <span class="flash-old">Rp ${p.price_normal.toLocaleString()}</span>
        </div>

        <div class="flash-stock">Stok: ${p.stock}</div>

        <div class="flash-countdown" id="countdown-${p.id}"></div>

        <div class="flash-control-row">
          <div class="qty-controls">
            <button class="btn-minus" onclick="event.stopPropagation(); flashMinus('${p.id}')">−</button>
            <span id="qty-${p.id}" class="qty-number">1</span>
            <button class="btn-plus" onclick="event.stopPropagation(); flashPlus('${p.id}')">+</button>
          </div>

          <button class="add-btn" onclick="event.stopPropagation(); addFlash('${p.id}')">
            <i class="fa fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;

    // === Klik flash card untuk buka modal detail ===
    item.addEventListener("click", () => openProdukModal(p));

    flashBox.appendChild(item);

    // mulai countdown
    startCountdown(p);
  });

  // ❗ WAJIB: Bikin tombol floating muncul
  cekFlashButton(list.length);
}


// ================= QTY ===================
function flashPlus(id) {
  let el = document.getElementById("qty-" + id);
  el.innerText = Number(el.innerText) + 1;
}

function flashMinus(id) {
  let el = document.getElementById("qty-" + id);
  let now = Number(el.innerText);
  if (now > 1) el.innerText = now - 1;
}


// =============== ADD TO CART ===============
function addFlash(id) {
  fetch("data/flash.json")
    .then(r => r.json())
    .then(list => {
      const p = list.find(x => x.id === id);
      const qtyEl = document.getElementById("qty-" + id);
      const qty = Number(qtyEl.innerText);

      if (!p) return;

      const existing = cart.find(i => i.name === p.name);
      if (existing) existing.qty += qty;
      else cart.push({
        name: p.name,
        qty: qty,
        price: p.price_flash
      });

      updateCartCount();
      showToast(`${p.name} x${qty} ditambahkan`);
      ding.currentTime = 0;
      ding.play().catch(()=>{});

      // reset ke 1
      qtyEl.innerText = "1";
    });
}


// ================= FETCH JSON ===================
fetch("data/flash.json")
  .then(res => {
    if (!res.ok) throw new Error("Gagal memuat flash.json");
    return res.json();
  })
  .then(data => {
    console.log("FLASH SALE (raw):", data);

    // ===== FILTER FLASH SALE YANG BELUM KADALUARSA =====
    const now = new Date();
    const activeFlash = data.filter(p => new Date(p.flash_until) > now);

    console.log("FLASH SALE AKTIF:", activeFlash);

    renderFlash(activeFlash);
  })
  .catch(err => console.error("Flash error:", err));


// ================= COUNTDOWN ===================
function startCountdown(p) {
  const countdownEl = document.getElementById(`countdown-${p.id}`);
  if (!countdownEl) return;

  function update() {
    const now = new Date();
    const end = new Date(p.flash_until);
    const diff = end - now;

    if (diff <= 0) {
      countdownEl.textContent = "Flash sale berakhir";
      // otomatis hapus card
      const card = countdownEl.closest(".flash-card");
      if (card) card.remove();
      cekFlashButton(document.querySelectorAll(".flash-card").length);
      return clearInterval(timer);
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownEl.textContent = `Sisa: ${hours}h ${minutes}m ${seconds}s`;
  }

  update(); // panggil langsung
  const timer = setInterval(update, 1000);
}


// ============================================
// TOMBOL FLASH MELAYANG PRO (AUTO HIDE)
// ============================================
const flashBtn = document.getElementById("flash-btn");
const flashSection = document.getElementById("flash-section");

// munculkan kalau ada flash (dipanggil dari renderFlash)
function cekFlashButton(jumlahFlash) {
  if (jumlahFlash > 0) {
    flashBtn.classList.add("show");
    flashBtn.style.pointerEvents = "auto";
  } else {
    flashBtn.classList.remove("show");
    flashBtn.style.pointerEvents = "none";
  }
}

// smooth scroll ke flash
flashBtn.addEventListener("click", () => {
  flashSection.scrollIntoView({ behavior: "smooth" });
});

// hide otomatis kalau sudah sampai di area flash
window.addEventListener("scroll", () => {
  if (!flashSection) return;
  const rect = flashSection.getBoundingClientRect();

  const jumlahFlashAktif = document.querySelectorAll(".flash-card").length;

  if (rect.top <= 120 && rect.bottom >= 120) {
    flashBtn.classList.remove("show");
  } else {
    if (jumlahFlashAktif > 0) flashBtn.classList.add("show");
    else flashBtn.classList.remove("show");
  }
});
