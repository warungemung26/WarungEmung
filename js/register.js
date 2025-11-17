// ============================
// reg.js (updated: ensure modal is on top & close buttons work)
// ============================

// Backdrop dan modal (tambahkan registerModal reference)
const registerBackdrop = document.getElementById('register-backdrop');
const registerModal = document.getElementById('register-modal');
const regStep1 = document.getElementById('reg-step1');
const regStep2 = document.getElementById('reg-step2');
const btnRegisterNow = document.getElementById('btn-register-now');
const btnRegisterLater = document.getElementById('btn-register-later');
const btnBackRegister = document.getElementById('btn-back-register');
const btnSaveRegister = document.getElementById('btn-save-register');
const registerHint = document.getElementById('register-hint');

// Tombol nav akun/register
const navRegister = document.getElementById('nav-account');

// =========================
// ACCOUNT modal elements
// =========================
const accountBackdrop = document.getElementById('account-backdrop');
const accountModal = document.getElementById('account-modal');
const navAccount = document.getElementById('nav-account'); // same id used to open account
const accSaveBtn = document.getElementById('acc-save-btn');
const accCloseBtn = document.getElementById('acc-close-btn');

// Safety helper: put modal on top and disable nav interactions while modal open
function bringModalToFront(backdropEl, modalEl) {
  // set high z-index so modal is always above other UI (including nav)
  if (backdropEl) backdropEl.style.zIndex = '10000';
  if (modalEl) modalEl.style.zIndex = '10001';

  // disable nav pointer events so it cannot intercept clicks
  if (navRegister) navRegister.style.pointerEvents = 'none';
  if (navAccount && navAccount !== navRegister) navAccount.style.pointerEvents = 'none';
}

function restoreNavInteraction() {
  if (navRegister) {
    navRegister.style.pointerEvents = 'auto';
    // keep display logic as previous code manages show/hide; do not force-show here
  }
  if (navAccount && navAccount !== navRegister) navAccount.style.pointerEvents = 'auto';
}

// ==== FUNCTIONS OPEN/CLOSE REGISTER ====
function openRegister() {
  if (!registerBackdrop || !registerModal) return;
  registerBackdrop.style.display = 'flex';
  regStep1.style.display = 'block';
  regStep2.style.display = 'none';

  // place on top and disable nav interactions
  bringModalToFront(registerBackdrop, registerModal);
}

function closeRegister() {
  if (!registerBackdrop) return;
  registerBackdrop.style.display = 'none';

  // restore nav interactions
  restoreNavInteraction();
}

// ==== REGISTER STEP CONTROLS ====
// === BUKA POPUP REGISTER ===
function openRegister() {
  if (!registerBackdrop || !registerModal) return;

  registerBackdrop.style.display = 'flex';

  // TAMPILAN AWAL HARUS KECIL
  registerModal.classList.add('popup-small');

  regStep1.style.display = 'block';
  regStep2.style.display = 'none';

  bringModalToFront(registerBackdrop, registerModal);
}

// Step 1 -> klik "Daftar Sekarang" -> masuk form
if (btnRegisterNow) {
  btnRegisterNow.addEventListener('click', () => {
    regStep1.style.display = 'none';
    regStep2.style.display = 'block';
    

    // ubah ke fullscreen
    registerModal.classList.remove('popup-small');

    // ensure modal still on top (in case)
    bringModalToFront(registerBackdrop, registerModal);
  });
}

// Step 1 -> klik "Daftar Nanti" -> tutup modal
if (btnRegisterLater) {
  btnRegisterLater.addEventListener('click', () => {
    closeRegister();
  });
}

// Step 2 -> tombol "Kembali" -> kembali ke step 1
if (btnBackRegister) {
  btnBackRegister.addEventListener('click', () => {
    regStep1.style.display = 'block';
    regStep2.style.display = 'none';

    // kembali ke popup kecil
    registerModal.classList.add('popup-small');

    // keep modal active and on top
    bringModalToFront(registerBackdrop, registerModal);
  });
}

// Step 2 -> tombol "Simpan Data"
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

// Klik di luar modal untuk tutup (register)
if (registerBackdrop) {
  registerBackdrop.addEventListener('click', (e) => {
    if (e.target === registerBackdrop) closeRegister();
  });
}


// ==== AUTO OPEN REGISTER HANYA SEKALI ====
function checkRegisterStatus() {
  const userData = localStorage.getItem('userData');
  if (!userData) {
    openRegister(); // tampilkan modal jika belum daftar
  } else {
    // pastikan modal tertutup dan nav interaksi normal
    closeRegister();
  }
}

// Jalankan langsung saat load
window.addEventListener('load', checkRegisterStatus);

// ============================
// ACCOUNT MODAL
// ============================

// Fungsi buka modal akun
function openAccount() {
  if (!accountBackdrop || !accountModal) return;
  accountBackdrop.style.display = 'flex';

  // ambil data dari localStorage
  const data = JSON.parse(localStorage.getItem('userData') || '{}');
  document.getElementById('acc-nama').value = data.nama || '';
  document.getElementById('acc-alamat').value = data.alamat || '';
  // ensure we read/write nomor rumah field if exists in DOM
  const accNoEl = document.getElementById('acc-no');
  if (accNoEl) accNoEl.value = data.noRumah || '';
  document.getElementById('acc-rt').value = data.rtrw || '';
  document.getElementById('acc-hp').value = data.hp || '';

  // bring account modal to front and disable nav interactions
  bringModalToFront(accountBackdrop, accountModal);
}

// Fungsi tutup modal akun
function closeAccount() {
  if (!accountBackdrop) return;
  accountBackdrop.style.display = 'none';
  // restore nav interaction
  restoreNavInteraction();
}

// Event buka modal akun dari nav (if navAccount exists)
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
      // read nomor rumah field if present in account modal (id acc-no)
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
if (accCloseBtn) {
  accCloseBtn.addEventListener('click', closeAccount);
}

// Klik di luar modal akun untuk tutup
if (accountBackdrop) {
  accountBackdrop.addEventListener('click', (e) => {
    if (e.target === accountBackdrop) closeAccount();
  });
}

// === TAB SWITCH & LOAD RIWAYAT AMAN ===
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // hapus status aktif di semua tombol
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // sembunyikan semua tab
    tabContents.forEach(c => c.classList.remove("active"));

    // tampilkan tab yang diklik
    const target = btn.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');

    // ✅ load riwayat hanya jika tab Riwayat diklik
    if (target === "tab-riwayat") loadRiwayat();
  });
});



// === FOTO PROFIL ===
const ppInput = document.getElementById("pp-input");
const btnUbahPP = document.getElementById("btn-ubah-pp");
const ppPreview = document.getElementById("pp-preview");

btnUbahPP.addEventListener("click", () => {
  ppInput.click();
});

// Auto crop (center square)
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

// Load PP ketika buka
const savedPP = localStorage.getItem("userPP");
if (savedPP) ppPreview.src = savedPP;


// === RIWAYAT ===

// Simpan riwayat (panggil saat checkout)
function simpanRiwayat(data) {
  let r = JSON.parse(localStorage.getItem("riwayat")) || [];
  r.push({
    ...data,
    waktu: new Date().toLocaleString()
  });
  localStorage.setItem("riwayat", JSON.stringify(r));
}

// Load riwayat saat tab dibuka
function loadRiwayat() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat")) || [];

  if (r.length === 0) {
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }

  wrap.innerHTML = r.map(item => `
    <div class="riwayat-item">
      <strong>${item.namaProduk || "Pesanan"}</strong><br>
      Total: Rp ${item.total || 0}<br>
      Waktu: ${item.waktu}
    </div>
  `).join("");
}


// TAB SWITCH & LOAD RIWAYAT
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // hapus status aktif di semua tombol
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // sembunyikan semua tab
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // tampilkan tab yang benar
    const target = btn.getAttribute('data-tab');
    document.getElementById(target).classList.add('active');

    // ✅ load riwayat hanya jika tab Riwayat
    if (target === "tab-riwayat") loadRiwayat();
  });
});
