/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */
 
// Pastikan flashplus ada supaya tombol flash+ bisa pakai
let flashplus = []; // array atau object sesuai kebutuhan

// ================= SIMPAN QTY FLASH PER PRODUK ===================
const flashQty = {}; // simpan qty tiap produk flash

function flashMinus(id) {
  const qtyEl = document.getElementById(`qty-${id}`);
  let q = flashQty[id] || parseInt(qtyEl.textContent) || 1;
  if (q > 1) q--;
  flashQty[id] = q;
  qtyEl.textContent = q;
}

function flashPlus(id) {
  const qtyEl = document.getElementById(`qty-${id}`);
  let q = flashQty[id] || parseInt(qtyEl.textContent) || 1;
  q++;
  flashQty[id] = q;
  qtyEl.textContent = q;
}

// ================= FLASH SALE ===================

// container
const flashBox = document.getElementById("flash-list");
if (!flashBox) {
  console.warn("⚠️ flash-list tidak ditemukan di HTML");
}

// ================= RENDER FLASH SALE ===================
function renderFlash(list) {
  if (!flashBox) return;

  const currency = getSelectedCurrency();
  flashBox.innerHTML = "";

  list.forEach(p => {
    const item = document.createElement("div");
    item.className = "flash-card";

    const priceNew = (currency === 'PI')
      ? `<img src="images/pi-logo.png" class="pi-logo" style="width:14px;height:14px;vertical-align:middle;margin-right:3px;"> PI ${(p.price_flash / 3200).toFixed(2)}`
      : formatPrice(p.price_flash, currency);

    const priceOld = (currency === 'PI')
      ? `<img src="images/pi-logo.png" class="pi-logo" style="width:14px;height:14px;vertical-align:middle;margin-right:3px;"> PI ${(p.price_normal / 3200).toFixed(2)}`
      : formatPrice(p.price_normal, currency);

    item.innerHTML = `
      <img src="${p.img}" class="flash-img">

      <div class="flash-info">
        <div class="flash-title">${p.name}</div>
        <div class="flash-label">${p.label || ''}</div>

        <div class="flash-price">
          <span class="flash-new">${priceNew}</span>
          <span class="flash-old">${priceOld}</span>
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

    // klik untuk buka modal produk
    item.addEventListener("click", () => openProdukModal(p));
    flashBox.appendChild(item);

    // mulai countdown
    startCountdown(p);
  });

  // cek tombol floating
  cekFlashButton(list.length);
}

// ================= ADD TO CART FLASH ===================
function addFlash(id) {
  fetch("data/flash.json")
    .then(r => r.json())
    .then(list => {
      const p = list.find(x => x.id === id);
      const qty = flashQty[id] || 1;

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
      flashQty[id] = 1;
      const qtyEl = document.getElementById("qty-" + id);
      if (qtyEl) qtyEl.innerText = "1";
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
    flashData = data.filter(p => new Date(p.flash_until) > now);
    renderFlash(flashData);
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

function cekFlashButton(jumlahFlash) {
  if (jumlahFlash > 0) {
    flashBtn.classList.add("show");
    flashBtn.style.pointerEvents = "auto";
  } else {
    flashBtn.classList.remove("show");
    flashBtn.style.pointerEvents = "none";
  }
}

flashBtn.addEventListener("click", () => {
  flashSection.scrollIntoView({ behavior: "smooth" });
});

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

// ============================
// LISTENER PILIH MATA UANG
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const currencySelect = document.getElementById("currency-select");
  if (!currencySelect) return;

  currencySelect.addEventListener("change", () => {
    const val = currencySelect.value;
    localStorage.setItem("selectedCurrency", val);

    if (typeof updateFlashDisplay === "function") updateFlashDisplay();
    if (typeof loadRiwayat === "function") loadRiwayat();
    if (typeof loadWishlist === "function") loadWishlist();
  });
});

// ============================
// FUNGSIONALITAS RE-RENDER FLASH
// ============================
function updateFlashDisplay() {
  if (!window.flashData || !flashData.length) return;
  renderFlash(flashData);
}
