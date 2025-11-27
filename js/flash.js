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

        <div class="flash-control-row">
          <div class="qty-controls">
            <button class="btn-minus" onclick="flashMinus('${p.id}')">−</button>
            <span id="qty-${p.id}" class="qty-number">1</span>
            <button class="btn-plus" onclick="flashPlus('${p.id}')">+</button>
          </div>

          <button class="add-btn" onclick="addFlash('${p.id}')">
            <i class="fa fa-cart-plus"></i>
          </button>
        </div>
      </div>
    `;

    flashBox.appendChild(item);
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
    console.log("FLASH SALE:", data);
    renderFlash(data);
  })
  .catch(err => console.error("Flash error:", err));



/* ============================================
   TOMBOL FLASH MELAYANG PRO (AUTO HIDE)
============================================ */
const flashBtn = document.getElementById("flash-btn");
const flashSection = document.getElementById("flash-section");

// munculkan kalau ada flash (dipanggil dari renderFlash)
function cekFlashButton(jumlahFlash) {
  if (jumlahFlash > 0) flashBtn.classList.add("show");
  else flashBtn.classList.remove("show");
}

// smooth scroll ke flash
flashBtn.addEventListener("click", () => {
  flashSection.scrollIntoView({ behavior: "smooth" });
});

// hide otomatis kalau sudah sampai di area flash
window.addEventListener("scroll", () => {
  const rect = flashSection.getBoundingClientRect();

  // Jika flash-section sudah di layar → sembunyikan tombol
  if (rect.top <= 120 && rect.bottom >= 120) {
    flashBtn.classList.remove("show");
  } else {
    flashBtn.classList.add("show");
  }
});
