/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

/* =========================================================
   SINGLETON GLOBAL (ANTI DOUBLE DECLARE)
========================================================= */
window.PELAYAN = window.PELAYAN || {};
const PELAYAN = window.PELAYAN;

/* =========================================================
   HELPER: NAMA SAPAAN (LOAD DARI STORAGE, DIPENDEKIN)
========================================================= */
function getNamaSapaan(){
  const raw = localStorage.getItem('nama');
  if (!raw) return 'Sedulur';

  const parts = raw.trim().split(/\s+/);
  let nama = parts[parts.length - 1]; // ambil kata terakhir

  if (nama.length > 5) nama = nama.slice(0, 5);

  return nama.charAt(0).toUpperCase() + nama.slice(1).toLowerCase();
}

/* =========================================================
   STATE
========================================================= */
PELAYAN.step = 0;

/* =========================================================
   MAP INTENT → KATEGORI (ORI SESUAI LIST KAMU)
========================================================= */
PELAYAN.kategoriMap = {
  masak: ['sembako','bumbu','mie','peralatandapur'],
  cemilan: ['snack','roti','minuman','minumansachet','makanan'],
  minum: ['minuman','frozen'],
  keluarga: ['sembako','makanan','minuman','snack','roti','frozen'],
  darurat: ['mie','minuman','minumansachet'],
  nyuci: ['rumah','peralatandapur'],
  laper: ['mie','makanan','roti'],
  pengen_anget: ['mie','makanan','minumansachet'],
  pengen_dingin: ['minuman','frozen'],
  manis: ['roti','frozen','minuman','minumansachet'],
  nonton: ['snack','minuman','minumansachet','roti','frozen','makanan'],
  rokok: ['rokok']
};

/* =========================================================
   ELEMENT UI
========================================================= */
const pelayanBtn      = document.getElementById('pelayan-btn');
const pelayanBackdrop = document.getElementById('pelayan-backdrop');
const pelayanTitle    = document.getElementById('pelayan-title');
const pelayanText     = document.getElementById('pelayan-text');
const pelayanOptions  = document.getElementById('pelayan-options');
const pelayanClose    = document.getElementById('pelayan-close');

/* =========================================================
   OPEN / CLOSE MODAL
========================================================= */
pelayanBtn?.addEventListener('click', () => {
  pelayanBackdrop.style.display = 'flex';
  stepSapaan();
});

pelayanClose?.addEventListener('click', () => {
  pelayanBackdrop.style.display = 'none';
});

/* =========================================================
   STEP 1: SAPAAN & PILIH KEGIATAN / KEBUTUHAN
========================================================= */
function stepSapaan(){
  PELAYAN.step = 1;

  pelayanTitle.textContent =
    `Sugeng rawuh, ${getNamaSapaan()} 😊`;

  pelayanText.textContent =
    'Badhe tumbas punapa dinten niki? Pilih kegiatan utawa kebutuhan panjenengan:';

  pelayanOptions.innerHTML = `
    <button onclick="stepPilih('masak')">👨‍🍳 Pengen masak</button>
    <button onclick="stepPilih('nyuci')">🛁 Nyuci / Bersih-bersih</button>
    <button onclick="stepPilih('cemilan')">☕ Lagi nyantai pengen Cemilan</button>
    <button onclick="stepPilih('laper')">😋 Laper, pengen makanan sing enak</button>
    <button onclick="stepPilih('pengen_dingin')">☀️ Sumub pengen sing adem</button>
     <button onclick="stepPilih('pengen_anget')">☃️ Atis pengen sing anget</button>
    <button onclick="stepPilih('minum')">🥤 Haus, pengen minuman</button>
    <button onclick="stepPilih('manis')">🍬 Pengen yang manis-manis</button>
    <button onclick="stepPilih('nonton')">📺 Cemilan pas nonton TV</button>
    <button onclick="stepPilih('rokok')">🚬 Pengen rokok</button>
    <button onclick="stepPilih('keluarga')">👨‍👩‍👧 Belanja kanggo keluarga</button>
    <button onclick="stepPilih('darurat')">⚡ Darurat / perlu cepet</button>
    <button onclick="stepRequest()">❓ Ora ketemu barang</button>
  `;
}

/* =========================================================
   STEP 2: PILIH & TAMPILKAN REKOMENDASI
========================================================= */
function stepPilih(intent){
  PELAYAN.step = 2;

  pelayanTitle.textContent = 'Inggih 🙏';
  pelayanText.textContent =
    'Kulo tampilaken rekomendasi nggih.';

  pelayanOptions.innerHTML = `
    <button onclick="applyPelayanFilter('${intent}')">
      Tampilkan rekomendasi
    </button>
    <button onclick="stepSapaan()">🔙 Kembali</button>
  `;
}

/* ================= MULTI FILTER SESUAI KATEGORI ================= */
function applyPelayanFilter(tipe){
  const kategoriList = PELAYAN.kategoriMap[tipe];
  if (!Array.isArray(kategoriList)) return;

  // FILTER LANGSUNG DARI PRODUCTS (ORI)
  const hasil = products.filter(p =>
    kategoriList.includes(p.category)
  );

  if (typeof render === 'function') {
    render(hasil);
  } else {
    console.warn('[Pelayan] fungsi render tidak tersedia');
  }

  pelayanBackdrop.style.display = 'none';

  if (typeof safeScrollTo === 'function') {
    safeScrollTo('#produk-list');
  }
}

/* =========================================================
   STEP REQUEST (ORIGINAL)
========================================================= */
function stepRequest(){
  pelayanTitle.textContent = 'Nyuwun pangapunten 🙇';
  pelayanText.textContent =
    'Menawi dereng wonten, panjenengan saged request barang.';

  pelayanOptions.innerHTML = `
    <button onclick="openRequestPelayan()">📦 Request Produk</button>
    <button onclick="stepSapaan()">🔙 Kembali</button>
  `;
}

function openRequestPelayan(){
  const hiddenBtn = document.getElementById('wa-request-hidden');

  if (hiddenBtn) {
    hiddenBtn.click(); // 🔥 trigger ctalinks.js
  } else {
    alert('Fitur request belum siap 🙏');
  }

  pelayanBackdrop.style.display = 'none';
}


/* =========================================================
   DEBUG (OPTIONAL)
========================================================= */
PELAYAN.debug = function(){
  console.log('[PELAYAN]', {
    step: PELAYAN.step,
    nama: getNamaSapaan(),
    kategoriMap: PELAYAN.kategoriMap
  });
};

const pelayanCloseX = document.getElementById('pelayan-close-x');

pelayanCloseX?.addEventListener('click', () => {
  pelayanBackdrop.style.display = 'none';
});
