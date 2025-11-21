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
    if(targetContent) targetContent.classList.add("active");
    if(target === "tab-riwayat") loadRiwayat();
  });
});

function loadRiwayat() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  if(r.length === 0){
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }
  wrap.innerHTML = r.map(order => `
    <div class="riwayat-item">
      <strong>ID Pesanan: ${order.id}</strong><br>
      <ul>
        ${order.items.map(it => `<li>${it.qty} x ${it.name} - Rp ${it.subtotal}</li>`).join("")}
      </ul>
      <strong>Total: Rp ${order.total}</strong><br>
      Waktu: ${order.waktu || order.date || '-'}
    </div>
  `).join("");
}