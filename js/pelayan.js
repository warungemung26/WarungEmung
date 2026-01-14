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
  let nama = 'Sedulur';

  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.nama) {
      nama = userData.nama.trim();
    }
  } catch (e) {
    console.warn('[Pelayan] userData rusak');
  }

  // ambil kata terakhir
  const parts = nama.split(/\s+/);
  nama = parts[parts.length - 1];

  // max 5 huruf
  if (nama.length > 5) {
    nama = nama.slice(0, 5);
  }

  return nama.charAt(0).toUpperCase() + nama.slice(1).toLowerCase();
}


function getWaktuSekarang(){
  const jam = new Date().getHours();
  if (jam >= 4 && jam < 11) return 'pagi';
  if (jam >= 11 && jam < 17) return 'siang';
  return 'malam';
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
  ga_enak_badan: ['obat'],
  manis: ['roti','frozen','minuman','minumansachet'],
  nonton: ['snack','minuman','minumansachet','roti','frozen','makanan'],
  rokok: ['rokok']
};

/* =========================================================
   MENU PELAYAN (URUT OTOMATIS BERDASAR WAKTU)
========================================================= */
PELAYAN.menuList = [
  { id:'darurat', text:'⚡ Darurat, perlu cepet', waktu:['pagi','siang','malam'], prioritas:100 },
  { id:'ga_enak_badan', text:'🤒 Lagi ora enak badan', waktu:['pagi','malam'], prioritas:90 },

  { id:'laper', text:'😋 Laper, pengen makanan sing enak', waktu:['siang','malam'], prioritas:80 },
  { id:'cemilan', text:'☕ Lagi santai, pengen cemilan', waktu:['siang','malam'], prioritas:70 },

  { id:'minum', text:'🥤 Haus, pengen minuman', waktu:['pagi','siang','malam'], prioritas:60 },
  { id:'pengen_dingin', text:'🥵 Sumuk, pengen sing adem', waktu:['siang'], prioritas:50 },
  { id:'pengen_anget', text:'🥶 Atis, pengen sing anget', waktu:['pagi','malam'], prioritas:50 },

  { id:'masak', text:'👨‍🍳 Lagi pengen masak', waktu:['pagi','siang','malam'], prioritas:40 },
  { id:'nyuci', text:'🛁 Nyuci / bersih-bersih rumah', waktu:['pagi','siang'], prioritas:30 },

  { id:'nonton', text:'📺 Cemilan pas nonton TV', waktu:['malam'], prioritas:20 },
  { id:'rokok', text:'🚬 Pengen rokok', waktu:['siang','malam'], prioritas:10 },
  { id:'keluarga', text:'👨‍👩‍👧 Belanja kanggo keluarga', waktu:['pagi','siang'], prioritas:10 }
];


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

  const waktu = getWaktuSekarang();

const menuTampil = PELAYAN.menuList
  .filter(m => m.waktu.includes(waktu))
  .sort((a,b) => b.prioritas - a.prioritas);

pelayanOptions.innerHTML =
  menuTampil.map(m => `
    <button onclick="stepPilih('${m.id}')">
      ${m.text}
    </button>
  `).join('') +
  `<button onclick="stepRequest()">❓ Barang ora ketemu</button>`;}

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
