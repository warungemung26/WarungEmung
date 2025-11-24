// ============================
// reg.js (penuh, semua fitur tetap ada)
// ============================

// ============================
// REGISTER MODAL ELEMENTS
// ============================
const registerBackdrop = document.getElementById('register-backdrop');
const registerModal = document.getElementById('register-modal');
const regStep1 = document.getElementById('reg-step1');
const regStep2 = document.getElementById('reg-step2');
const btnRegisterNow = document.getElementById('btn-register-now');
const btnRegisterLater = document.getElementById('btn-register-later');
const btnBackRegister = document.getElementById('btn-back-register');
const btnSaveRegister = document.getElementById('btn-save-register');
const registerHint = document.getElementById('register-hint');
const navRegister = document.getElementById('nav-account');

// ============================
// ACCOUNT MODAL ELEMENTS
// ============================
const accountBackdrop = document.getElementById('account-backdrop');
const accountModal = document.getElementById('account-modal');
const navAccount = document.getElementById('nav-account');
const accSaveBtn = document.getElementById('acc-save-btn');
const accCloseBtn = document.getElementById('acc-close-btn');

// ============================
// HELPER FUNCTIONS
// ============================
function bringModalToFront(backdropEl, modalEl) {
  if (backdropEl) backdropEl.style.zIndex = '10000';
  if (modalEl) modalEl.style.zIndex = '10001';
  if (navRegister) navRegister.style.pointerEvents = 'none';
  if (navAccount && navAccount !== navRegister) navAccount.style.pointerEvents = 'none';
}

function restoreNavInteraction() {
  if (navRegister) navRegister.style.pointerEvents = 'auto';
  if (navAccount && navAccount !== navRegister) navAccount.style.pointerEvents = 'auto';
}

// ============================
// REGISTER MODAL FUNCTIONS
// ============================
function openRegister() {
  if (!registerBackdrop || !registerModal) return;
  registerBackdrop.style.display = 'flex';
  registerModal.classList.add('popup-small');
  regStep1.style.display = 'block';
  regStep2.style.display = 'none';
  bringModalToFront(registerBackdrop, registerModal);
}

function closeRegister() {
  if (!registerBackdrop) return;
  registerBackdrop.style.display = 'none';
  restoreNavInteraction();
}

// ============================
// REGISTER STEP CONTROLS
// ============================
if (btnRegisterNow) {
  btnRegisterNow.addEventListener('click', () => {
    regStep1.style.display = 'none';
    regStep2.style.display = 'block';
    registerModal.classList.remove('popup-small');
    bringModalToFront(registerBackdrop, registerModal);
  });
}

if (btnRegisterLater) {
  btnRegisterLater.addEventListener('click', closeRegister);
}

if (btnBackRegister) {
  btnBackRegister.addEventListener('click', () => {
    regStep1.style.display = 'block';
    regStep2.style.display = 'none';
    registerModal.classList.add('popup-small');
    bringModalToFront(registerBackdrop, registerModal);
  });
}

if (btnSaveRegister) {
  btnSaveRegister.addEventListener('click', () => {
    const nama = document.getElementById('reg-nama').value.trim();
    if (!nama) {
      registerHint.textContent = 'Nama tidak boleh kosong!';
      return;
    }
    const data = {
      nama,
      alamat: document.getElementById('reg-alamat').value,
      noRumah: document.getElementById('reg-no').value,
      rtrw: document.getElementById('reg-rtrw').value,
      hp: document.getElementById('reg-hp').value
    };
    localStorage.setItem('userData', JSON.stringify(data));
    registerHint.textContent = 'Data tersimpan!';
    closeRegister();
  });
}

// Klik di luar modal register untuk tutup
if (registerBackdrop) {
  registerBackdrop.addEventListener('click', (e) => {
    if (e.target === registerBackdrop) closeRegister();
  });
}

// ============================
// AUTO OPEN REGISTER HANYA SEKALI
// ============================
function checkRegisterStatus() {
  const userData = localStorage.getItem('userData');
  if (!userData) openRegister();
  else closeRegister();
}

window.addEventListener('load', checkRegisterStatus);

// ============================
// ACCOUNT MODAL FUNCTIONS
// ============================
function openAccount() {
  if (!accountBackdrop || !accountModal) return;
  accountBackdrop.style.display = 'flex';
  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  document.getElementById('acc-nama').value = data.nama || '';
  document.getElementById('acc-alamat').value = data.alamat || '';
  const accNoEl = document.getElementById('acc-no');
  if (accNoEl) accNoEl.value = data.noRumah || '';
  document.getElementById('acc-rt').value = data.rtrw || '';
  document.getElementById('acc-hp').value = data.hp || '';
  bringModalToFront(accountBackdrop, accountModal);
}

function closeAccount() {
  if (!accountBackdrop) return;
  accountBackdrop.style.display = 'none';
  restoreNavInteraction();
}

// Event buka modal akun dari nav
if (navAccount) {
  navAccount.addEventListener('click', (e) => {
    e.preventDefault();
    openAccount();
  });
}

// Tombol simpan perubahan akun
if (accSaveBtn) {
  accSaveBtn.addEventListener('click', () => {
    const data = {
      nama: document.getElementById('acc-nama').value.trim(),
      alamat: document.getElementById('acc-alamat').value.trim(),
      noRumah: (document.getElementById('acc-no') && document.getElementById('acc-no').value.trim()) || '',
      rtrw: document.getElementById('acc-rt').value.trim(),
      hp: document.getElementById('acc-hp').value.trim()
    };
    if (!data.nama) {
      alert('Nama tidak boleh kosong!');
      return;
    }
    localStorage.setItem('userData', JSON.stringify(data));
    alert('Perubahan tersimpan!');
    closeAccount();
  });
}

// Tombol tutup modal akun
if (accCloseBtn) accCloseBtn.addEventListener('click', closeAccount);

// Klik di luar modal akun untuk tutup
if (accountBackdrop) {
  accountBackdrop.addEventListener('click', (e) => {
    if (e.target === accountBackdrop) closeAccount();
  });
}

// ============================
// FOTO PROFIL
// ============================
const ppInput = document.getElementById("pp-input");
const btnUbahPP = document.getElementById("btn-ubah-pp");
const ppPreview = document.getElementById("pp-preview");

btnUbahPP.addEventListener("click", () => {
  ppInput.click();
});

ppInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    const size = Math.min(img.width, img.height);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      (img.width - size) / 2,
      (img.height - size) / 2,
      size,
      size,
      0,
      0,
      size,
      size
    );
    const croppedData = canvas.toDataURL("image/jpeg", 0.9);
    ppPreview.src = croppedData;
    localStorage.setItem("userPP", croppedData);
  };
});

const savedPP = localStorage.getItem("userPP");
if (savedPP) ppPreview.src = savedPP;

// ============================
// TAB SWITCH & RIWAYAT
// ============================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    tabContents.forEach(c => c.classList.remove("active"));
    const target = btn.getAttribute("data-tab");
    const targetContent = document.getElementById(target);

    if (targetContent) {
      targetContent.classList.add("active");
    }

    if (target === "tab-riwayat") loadRiwayat();
  });
});


// ============================
// FUNGSI TAMBAHAN RIWAYAT
// ============================

// Hapus satu riwayat
function hapusRiwayat(id) {
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  const baru = r.filter(o => o.id !== id);
  localStorage.setItem("riwayat", JSON.stringify(baru));
  loadRiwayat();
}

// Hapus semua riwayat
function hapusSemuaRiwayat() {
  if (!confirm("Yakin ingin menghapus semua riwayat?")) return;
  localStorage.removeItem("riwayat");
  loadRiwayat();
}

// WA — batalkan pesanan
function waBatalkan(order) {
  const text =
`Halo Warung Emung, saya ingin membatalkan pesanan berikut:

🆔 ID: ${order.id}
👤 Nama: ${order.nama}
📍 Alamat: ${order.alamat}
📱 HP: ${order.hp}

Mohon dibatalkan.`;

  const url = "https://wa.me/6285322882512?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

// WA — cek status pesanan
function waCekStatus(order) {
  const list = order.items.map(it => `${it.qty} x ${it.name}`).join(", ");

  const text =
`Halo Warung Emung, saya ingin menanyakan status pesanan:

🆔 ID: ${order.id}
👤 Nama: ${order.nama}
📍 Alamat: ${order.alamat}
📱 HP: ${order.hp}
🛒 Produk: ${list}
💰 Total: Rp ${formatRupiah(order.total)}

Mohon informasinya.`;

  const url = "https://wa.me/6285322882512?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}


// ============================
// LOAD RIWAYAT
// ============================
function loadRiwayat() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");

  if (!wrap) return;

  if (r.length === 0) {
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }

  // Tombol hapus semua
  wrap.innerHTML = `
    <button class="cta-link riwayat-clear-all"
      style="margin-bottom:10px;border:1px solid #d00;padding:6px;border-radius:6px;background:#ffe5e5">
      Hapus Semua Riwayat
    </button>
  `;

  wrap.innerHTML += r.map(order => `
    <div class="riwayat-item"
      style="margin-bottom:12px;padding:10px;border:1px solid #ddd;border-radius:6px">

      <table>
        <tr><td>🆔</td><td><strong>ID Pesanan: ${order.id}</strong></td></tr>
        <tr><td>👤</td><td><strong>${order.nama || '-'}</strong></td></tr>
        <tr><td>📍</td><td><strong>${order.alamat || '-'}</strong></td></tr>
        <tr><td>📱</td><td><strong>${order.hp || '-'}</strong></td></tr>
      </table>

      <br>

      <table>
        <tr><td>🛒</td><td><strong>Detail Pesanan:</strong></td></tr>
      </table>

      <ul style="margin:4px 0 8px 22px;padding:0;">
        ${order.items.map(it => `
          <li>${it.qty} x ${it.name} — Rp ${formatRupiah(it.subtotal)}</li>
        `).join("")}
      </ul>

      <table>
        <tr><td>🚚</td><td><strong>Ongkir: Rp ${formatRupiah(order.ongkir || 0)}</strong></td></tr>
        <tr><td>💰</td><td><strong>Total: Rp ${formatRupiah(order.total)}</strong></td></tr>
        <tr><td>📅</td><td><strong>${order.waktu || order.date || '-'}</strong></td></tr>
      </table>

      <!-- Tombol fitur -->
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">

        <!-- Cek status -->
        <button class="cta-link riwayat-status"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #4caf50;border-radius:4px;background:#eaffea;">
          Cek Status
        </button>

        <!-- Ulangi pesanan -->
        <button class="cta-link riwayat-repeat"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #2196f3;border-radius:4px;background:#e7f3ff;">
          Ulangi
        </button>

        <!-- Hapus satu riwayat -->
        <button class="cta-link riwayat-delete"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #aaa;border-radius:4px;background:#f7f7f7;">
          Hapus
        </button>

      </div>

    </div>
  `).join("");
}
