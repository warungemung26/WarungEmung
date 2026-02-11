/*!
 * ============================================================
 * FILE: feature-virtual-assistant.js
 * PROJECT: Tokopilot / Atos Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
 */


/* =========================================================
   SINGLETON GLOBAL
========================================================= */
window.PELAYAN = window.PELAYAN || {};
const PELAYAN = window.PELAYAN;

/* =========================================================
   USER CACHE (PARSE SEKALI)
========================================================= */
PELAYAN.userCache = {
  nama: 'Sedulur',
  panggilan: ''
};

/* =========================================================
   HELPER
========================================================= */
function getWaktuSekarang(){
  const jam = new Date().getHours();
  if (jam >= 4 && jam < 11) return 'pagi';
  if (jam >= 11 && jam < 17) return 'siang';
  return 'malam';
}

function deteksiPanggilan(nama){
  if (!nama) return 'Kak';

  const lower = nama.toLowerCase();

  // daftar nama laki-laki umum (bisa kamu tambah)
  const laki = ['teja','dewa','yoga','surya','bagas','adhi','agus','budi'];

  if (laki.includes(lower)) return 'Mas';

  // nama perempuan yang cukup pasti
  const perempuan = ['siti','ayu','rina','dewi','fitri','nur'];

  if (perempuan.includes(lower)) return 'Mbak';

  // default aman
  return 'Kak';
}


function loadUserCache(){
  try {
    const raw = localStorage.getItem('userData');
    if (!raw) return;

    const userData = JSON.parse(raw);
    if (!userData.nama) return;

    let nama = userData.nama.trim();

    // ambil kata terakhir
    const parts = nama.split(/\s+/);
    nama = parts[parts.length - 1];

    // max 5 huruf
    if (nama.length > 5) nama = nama.slice(0, 5);

    PELAYAN.userCache.nama =
      nama.charAt(0).toUpperCase() + nama.slice(1).toLowerCase();

    PELAYAN.userCache.panggilan =
      deteksiPanggilan(PELAYAN.userCache.nama);

  } catch (e) {
    console.warn('[Pelayan] gagal load userData');
  }
}

function getSapaanLengkap(){
  const mapSapaan = {
    pagi: 'Sugeng enjing',
    siang: 'Sugeng siang',
    malam: 'Sugeng ndalu'
  };

  const waktu = getWaktuSekarang();
  const sapa = mapSapaan[waktu] || 'Sugeng rawuh';

  return `${sapa}, ${PELAYAN.userCache.panggilan} ${PELAYAN.userCache.nama} 😊`;
}

/* =========================================================
   STATE
========================================================= */
PELAYAN.step = 0;

/* =========================================================
   MAP INTENT → KATEGORI
========================================================= */
PELAYAN.kategoriMap = {
  masak: ['sembako','bumbu','mie','peralatandapur'],
  cemilan: ['snack','roti','minuman','minumansachet','makanan'],
  minum: ['minuman','frozen'],
  keluarga: ['sembako','makanan','minuman','snack','roti','frozen'],
  instan: ['mie','minuman','minumansachet'],
  nyuci: ['rumah','peralatandapur'],
  ngenyangin: ['mie','makanan','roti'],
  anget: ['mie','makanan','minumansachet'],
  dingin: ['minuman','frozen'],
  sakit: ['obat'],
  manis: ['roti','frozen','minuman','minumansachet'],
  nonton: ['snack','minuman','minumansachet','roti','frozen','makanan'],
  rokok: ['rokok']
};

/* =========================================================
   MAP INTENT → KATEGORI + TAG (UTAMA)
========================================================= */
PELAYAN.intentDetail = {

  /* =====================================================
     PAGI & MAKAN
  ===================================================== */
  sarapan: {
    kategori: ['makanan','roti','mie','minumansachet'],
    tags: ['sarapan','pagi','ringan','cereal']
  },
  makan_siang: {
    kategori: ['makanan','mie','roti'],
    tags: ['makan','siang','ngenyangin']
  },
  makan_malam: {
    kategori: ['makanan','mie','roti'],
    tags: ['makan','malam','ngenyangin']
  },

  /* =====================================================
     CEPAT & PRAKTIS
  ===================================================== */
  instan: {
    kategori: ['mie','minumansachet','minuman'],
    tags: ['instan','cepat']
  },
  hemat: {
    kategori: ['sembako','mie','makanan'],
    tags: ['hemat','murah']
  },

  /* =====================================================
     LAPAR & KONDISI
  ===================================================== */
  ngenyangin: {
    kategori: ['makanan','mie','roti'],
    tags: ['ngenyangin','kenyang']
  },
  sakit: {
    kategori: ['obat','minumansachet'],
    tags: ['hangat','ringan']
  },

  /* =====================================================
     MINUMAN MAKANAN
  ===================================================== */
  minum: {
    kategori: ['minuman','minumansachet'],
    tags: ['minum','segar']
  },
  anget: {
    kategori: ['makanan','mie','minumansachet'],
    tags: ['anget','hangat']
  },
  dingin: {
    kategori: ['minuman','frozen'],
    tags: ['dingin','segar']
  },
  ngopi: {
    kategori: ['minumansachet','minuman'],
    tags: ['kopi','ngopi']
  },

  /* =====================================================
     CEMILAN & RASA
  ===================================================== */
  cemilan: {
    kategori: ['snack','roti','makanan'],
    tags: ['cemilan','ringan']
  },
  manis: {
    kategori: ['sembako','snack','roti','minuman','minumansachet','frozen'],
    tags: ['manis','coklat','vanilla']
  },
  gurih: {
    kategori: ['snack','makanan','roti'],
    tags: ['gurih','asin','keju']
  },
  pedas: {
    kategori: ['bumbu','snack','makanan','mie'],
    tags: ['pedas']
  },

  /* =====================================================
     AKTIVITAS
  ===================================================== */
  masak: {
    kategori: ['sembako','bumbu','mie'],
    tags: ['masak']
  },
  nyuci: {
    kategori: ['rumah'],
    tags: ['bersih','nyuci']
  },
  stok: {
    kategori: ['sembako','minuman','rumah'],
    tags: ['stok','rumah']
  },

  /* =====================================================
     MOMEN & SOSIAL
  ===================================================== */
  keluarga: {
    kategori: ['sembako','makanan','minuman','snack','roti','frozen'],
    tags: ['keluarga']
  },
  nonton: {
    kategori: ['snack','minuman','roti','frozen'],
    tags: ['nonton','santai']
  },

  /* =====================================================
     LAINNYA
  ===================================================== */
  rokok: {
    kategori: ['rokok'],
    tags: ['rokok']
  }
};


/* =========================================================
   MENU – Pelayan
========================================================= */
PELAYAN.menuList = [

  /* =====================================================
     PAGI – BARU MULAI AKTIVITAS
  ===================================================== */
  { id:'sarapan', text:'🍳 Sarapan pagi', waktu:['pagi'], prioritas:100 },
  { id:'anget', text:'☕ Pengen sing anget', waktu:['pagi'], prioritas:95 },
  { id:'instan', text:'⚡ Perlu cepet & praktis', waktu:['pagi'], prioritas:90 },
  { id:'masak', text:'👨‍🍳 Masak dhewe', waktu:['pagi'], prioritas:80 },

  /* =====================================================
     SIANG – LAPAR & PRODUKTIF
  ===================================================== */
  { id:'ngenyangin', text:'😋 Laper, pengen sing ngenyangke', waktu:['siang'], prioritas:100 },
  { id:'makan_siang', text:'🍛 Makan siang', waktu:['siang'], prioritas:95 },
  { id:'minum', text:'🥤 Haus, pengen ngombe', waktu:['siang'], prioritas:90 },
  { id:'hemat', text:'💸 Pengen irit / hemat', waktu:['siang'], prioritas:85 },

  /* =====================================================
     SORE – SANTAI & TRANSISI
  ===================================================== */
  { id:'cemilan', text:'🍪 Pengen cemilan', waktu:['siang','malam'], prioritas:90 },
  { id:'manis', text:'🍫 Pengen sing manis', waktu:['siang','malam'], prioritas:85 },
  { id:'dingin', text:'🧊 Pengen sing adem', waktu:['siang'], prioritas:85 },

  /* =====================================================
     MALAM – MAKAN & ISTIRAHAT
  ===================================================== */
  { id:'makan_malam', text:'🍽️ Makan malam', waktu:['malam'], prioritas:100 },
  { id:'keluarga', text:'👨‍👩‍👧 Kebutuhan keluarga', waktu:['malam'], prioritas:95 },
  { id:'nonton', text:'📺 Cemilan pas nonton', waktu:['malam'], prioritas:90 },
  { id:'ngopi', text:'☕ Ngopi / santai', waktu:['malam'], prioritas:85 },

  /* =====================================================
     RASA & SELERA
  ===================================================== */
  { id:'gurih', text:'🧀 Pengen sing gurih', waktu:['siang','malam'], prioritas:80 },
  { id:'pedas', text:'🌶️ Pengen sing pedes', waktu:['siang','malam'], prioritas:78 },

  /* =====================================================
     AKTIVITAS RUMAH
  ===================================================== */
  { id:'nyuci', text:'🧼 Nyuci / resik-resik', waktu:['pagi','siang'], prioritas:70 },
  { id:'stok', text:'📦 Ngecek stok dapur', waktu:['pagi','siang'], prioritas:65 },

  /* =====================================================
     KONDISI KHUSUS
  ===================================================== */
  { id:'sakit', text:'🤒 Lagi ora enak badan', waktu:['pagi','malam'], prioritas:75 },
  { id:'rokok', text:'🚬 Pengen rokok', waktu:['siang','malam'], prioritas:40 }
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
const pelayanCloseX   = document.getElementById('pelayan-close-x');

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

pelayanCloseX?.addEventListener('click', () => {
  pelayanBackdrop.style.display = 'none';
});

/* =========================================================
   STEP 1
========================================================= */
function stepSapaan(){
  PELAYAN.step = 1;

  pelayanTitle.innerHTML = `
  <div class="mbak-neng-header row">
    <img src="images/pelayan.png" alt="Mbak Neng" class="mbak-neng-img">
    <div class="mbak-neng-text">
      <div class="mbak-neng-sapa">${getSapaanLengkap()}</div>
      <div class="mbak-neng-name">Mbak Neng</div>
    </div>
  </div>
`;
  pelayanText.textContent =
    'Badhe tumbas punapa dinten niki? Pilih kegiatan utawa kebutuhan panjenengan:';

  const waktu = getWaktuSekarang();

  const menuTampil = PELAYAN.menuList
    .filter(m => m.waktu.includes(waktu))
    .sort((a,b) => b.prioritas - a.prioritas);

  pelayanOptions.innerHTML =
    menuTampil.map(m => `
      <button onclick="stepPilih('${m.id}')">${m.text}</button>
    `).join('') +
    `<button onclick="stepRequest()">❓ Barang ora ketemu</button>`;
}

/* =========================================================
   STEP 2
========================================================= */
function stepPilih(intent){
  PELAYAN.step = 2;

  pelayanTitle.textContent = 'Inggih 🙏';
  pelayanText.textContent = 'Kulo tampilaken rekomendasi nggih.';

  pelayanOptions.innerHTML = `
    <button onclick="applyPelayanFilter('${intent}')">
      Tampilkan rekomendasi
    </button>
    <button onclick="stepSapaan()">🔙 Kembali</button>
  `;
}


function pelayanGetHeaderOffset(){
  let offset = 0;

  document.querySelectorAll('header, .search-container, .mini-header, .sticky, .fixed')
    .forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.position === 'sticky') {
        offset += el.offsetHeight;
      }
    });

  return offset;
}

/* =========================================================
   FILTER PRODUK
========================================================= */
function applyPelayanFilter(intent){
  let hasil = [];

  // PRIORITAS 1: intentDetail (kategori + tags)
  const detail = PELAYAN.intentDetail[intent];
  if (detail) {
    hasil = products.filter(p => {
      const cocokKategori =
        !detail.kategori || detail.kategori.includes(p.category);

      const cocokTag =
        !detail.tags ||
        detail.tags.some(tag => p.tags?.includes(tag));

      return cocokKategori && cocokTag;
    });
  }

  // PRIORITAS 2: fallback ke kategoriMap lama
  if (hasil.length === 0) {
    const kategoriList = PELAYAN.kategoriMap[intent];
    if (Array.isArray(kategoriList)) {
      hasil = products.filter(p =>
        kategoriList.includes(p.category)
      );
    }
  }

  // render
  if (typeof render === 'function') {
    render(hasil);
  }

  // animasi
  setTimeout(() => {
    const items = document.querySelectorAll(
      '#produk-list .produk-item, #produk-list .product-card'
    );

    items.forEach((el, i) => {
      el.classList.remove('pelayan-animate');
      void el.offsetHeight;
      el.classList.add('pelayan-animate');
      el.style.animationDelay = (i * 30) + 'ms';
    });
  }, 30);

  // tutup modal
  pelayanBackdrop.style.display = 'none';

  // scroll
  setTimeout(() => {
    const el = document.querySelector('#produk-list');
    if (!el) return;

    let offset = 0;
    document.querySelectorAll('header, .search-container')
      .forEach(e => {
        const s = getComputedStyle(e);
        if (s.position === 'fixed' || s.position === 'sticky') {
          offset += e.offsetHeight;
        }
      });

    const y =
      el.getBoundingClientRect().top +
      window.pageYOffset -
      offset -
      8;

    window.scrollTo({
      top: Math.max(0, y),
      behavior: 'smooth'
    });
  }, 60);
}

/* =========================================================
   REQUEST
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
  hiddenBtn ? hiddenBtn.click() : alert('Fitur request belum siap 🙏');
  pelayanBackdrop.style.display = 'none';
}

/* =========================================================
   INIT
========================================================= */
loadUserCache();
