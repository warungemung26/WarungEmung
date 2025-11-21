// ============================
// REGISTER MODAL REVISED SAFE VERSION
// ============================

// ELEMENTS
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

// =============================
// BRING MODAL TO FRONT
// =============================
function bringModalToFront(backdropEl, modalEl) {
  backdropEl.style.zIndex = '10000';
  modalEl.style.zIndex = '10001';
  if (navRegister) navRegister.style.pointerEvents = 'none';
}

function restoreNavInteraction() {
  if (navRegister) navRegister.style.pointerEvents = 'auto';
}

// =============================
// OPEN / CLOSE REGISTER
// =============================
function openRegister() {
  if (!registerBackdrop || !registerModal) return;

  registerBackdrop.style.display = 'flex';
  registerModal.classList.add('popup-small');

  regStep1.style.display = 'block';
  regStep2.style.display = 'none';

  bringModalToFront(registerBackdrop, registerModal);
}

function closeRegister() {
  registerBackdrop.style.display = 'none';
  restoreNavInteraction();
}

// =============================
// BUTTON HANDLERS
// =============================
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

// =============================
// SAVE USER REGISTRATION
// =============================
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
      hp: document.getElementById('reg-hp').value,
      waktuDaftar: new Date().toISOString().replace('T', ' ').replace('Z', '')
    };

    localStorage.setItem('userData', JSON.stringify(data));

    registerHint.textContent = 'Data tersimpan!';
    closeRegister();
  });
}

// =============================
// CLOSE WHEN CLICK BACKDROP
// =============================
if (registerBackdrop) {
  registerBackdrop.addEventListener('click', (e) => {
    if (e.target === registerBackdrop) closeRegister();
  });
}

// ===============================
// AUTO LOAD DATA KE AKUN MODAL
// ===============================
function loadDataToAccountModal() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (!data) return;

  const accNama = document.getElementById("acc-nama");
  const accAlamat = document.getElementById("acc-alamat");
  const accNo = document.getElementById("acc-no");
  const accRt = document.getElementById("acc-rt");
  const accHp = document.getElementById("acc-hp");

  if (accNama) accNama.value = data.nama || "";
  if (accAlamat) accAlamat.value = data.alamat || "";
  if (accNo) accNo.value = data.noRumah || "";
  if (accRt) accRt.value = data.rtrw || "";
  if (accHp) accHp.value = data.hp || "";
}

window.addEventListener("load", loadDataToAccountModal);
