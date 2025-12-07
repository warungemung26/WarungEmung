/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

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

