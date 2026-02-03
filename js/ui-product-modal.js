/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */


let pmQty = 1;
let modalProdukAktif = false;
let lockPop = false;
let PRODUCT_DATA = {};  // JSON seluruh produk

/* =============================
   DATA PRODUK (GLOBAL)
============================= */

PRODUCT_DATA = {
  products: [
    {
      name: "Indomie Goreng",
      category: "mie",
      price: 3500,
      price_flash: 3000,
      img: "images/indomie-goreng.jpg",
      brand: "indomie",
      rasa: "original",
      desc_short: "Mi instan goreng legendaris favorit keluarga.",
      desc_long: "Indomie Goreng adalah mi instan dengan rasa gurih khas perpaduan kecap manis, minyak bawang, dan bumbu pilihan. Cocok disantap kapan saja, praktis dan mengenyangkan."
    },
    {
      name: "Aqua 600ml",
      category: "minuman",
      price: 4000,
      img: "images/aqua-600ml.jpg",
      brand: "aqua",
      desc_short: "Air mineral murni kemasan 600ml.",
      desc_long: "AQUA 600ml berasal dari sumber pegunungan terpilih, diproses secara higienis untuk menjaga kemurnian dan kesegarannya. Cocok untuk menemani aktivitas harian."
    },
    {
      name: "Kopi Kapal Api Sachet",
      category: "minuman",
      price: 2000,
      img: "images/kapal-api.jpg",
      brand: "kapal api",
      rasa: "kopi",
      desc_short: "Kopi hitam sachet dengan aroma khas.",
      desc_long: "Kopi Kapal Api sachet menghadirkan cita rasa kopi hitam kuat dengan aroma khas. Praktis diseduh kapan saja untuk menemani pagi atau lembur."
    }
  ],

  brands: [
    "indomie","mie sedaap","supermi","sarimi","mie abc","burung dara","wow",
    "chitato","qtela","taro","cheetos","chiki","pilus garuda","potabee","kusuka",
    "roma","nabati","tango","silverqueen","oreo","aice","aqua","le minerale",
    "ades","vit","cleo","club","coca cola","floridina","nipis madu","teh pucuk",
    "teh botol","teh sosro","sari wangi","golda","max tea","ultra milk",
    "bear brand","frisian flag","dancow","good day","kapal api","torabika",
    "indocafe","abc","bango","sasa","royco","masako","saori","desaku",
    "filma","tropical","bimoli","sunco","blue band","gulaku","refina","kara",
    "sajiku","nutrisari","energen","kuku bima","pop ice","amh","adem sari",
    "oralit","promag","tolak angin","antangin","neozep","panadol","bodrex",
    "paramek","decolgen","woods","obh","komix","gelusil","lifebuoy","lux",
    "sunsilk","pepsodent","soklin","rinso","molto","daia","sunlight","baygon",
    "kingkong","gudang garam","djarum","sampoerna","marlboro","la lights",
    "sari roti","roti o","maries"
  ],

  rasaMap: {
    bbq: "Hadir dengan cita rasa BBQ gurih dan smoky.",
    barbeque: "Rasa barbeque manis gurih yang nikmat.",
    original: "Rasa original yang ringan dan tidak bikin enek.",
    pedas: "Rasa pedas mantap yang bikin nagih.",
    hot: "Sensasi pedas panas yang kuat.",
    spicy: "Rasa spicy gurih khas.",
    keju: "Rasa keju creamy yang lezat.",
    cheese: "Rasa keju gurih creamy.",
    balado: "Rasa balado pedas manis khas Nusantara.",
    "ayam bawang": "Perpaduan rasa ayam dan bawang yang gurih.",
    "ayam panggang": "Rasa ayam panggang gurih beraroma rempah.",
    "ayam geprek": "Rasa ayam geprek pedas gurih kekinian.",
    "sapi panggang": "Cita rasa daging sapi panggang yang lezat.",
    "jagung bakar": "Rasa jagung bakar manis gurih.",
    asin: "Rasa asin gurih yang sederhana dan nikmat.",
    manis: "Rasa manis ringan yang disukai semua kalangan.",
    cokelat: "Rasa coklat manis dan creamy.",
    coklat: "Rasa coklat manis dan creamy.",
    chocolate: "Cita rasa coklat kaya dan lembut.",
    stroberi: "Rasa stroberi manis segar.",
    vanila: "Rasa vanila lembut dan harum.",
    madu: "Rasa madu manis alami.",
    lemon: "Rasa lemon segar sedikit asam.",
    jeruk: "Rasa jeruk segar menyegarkan.",
    anggur: "Rasa anggur manis segar.",
    kopi: "Rasa kopi khas yang kuat dan aromatik.",
    mocha: "Perpaduan rasa kopi dan coklat.",
    latte: "Rasa kopi susu yang lembut.",
    "green tea": "Rasa teh hijau yang ringan dan segar"
  },

  kategoriDesc: {
    makanan: "Hidangan siap santap yang cocok untuk camilan atau teman aktivitas.",
    minuman: "Minuman segar yang cocok dinikmati kapan saja.",
    snack: "Camilan renyah yang enak untuk menemani waktu santai.",
    mie: "Mi instan favorit dengan rasa khas dan praktis disajikan.",
    roti: "Roti lembut dengan tekstur empuk, cocok untuk sarapan atau camilan.",
    frozen: "Produk beku praktis yang mudah disimpan dan diolah.",
    rokok: "Produk tembakau dengan kualitas terjaga untuk kebutuhan dewasa.",
    peralatansekolah: "Perlengkapan sekolah yang menunjang aktivitas belajar.",
    peralatandapur: "Peralatan dapur fungsional untuk kebutuhan memasak harian.",
    mainan: "Mainan menarik untuk hiburan dan aktivitas anak.",
    baju: "Pakaian nyaman untuk penggunaan sehari-hari.",
    sandal: "Sandal ringan dan nyaman untuk berbagai aktivitas.",
    gas: "Produk kebutuhan energi rumah tangga yang aman dan praktis.",
    sembako: "Kebutuhan pokok rumah tangga untuk persediaan harian.",
    bumbu: "Bahan bumbu dapur praktis untuk berbagai masakan.",
    rumah: "Produk kebutuhan rumah tangga sehari-hari.",
    minumansachet: "Minuman instan sachet yang praktis disajikan.",
    obat: "Produk kesehatan untuk membantu meredakan keluhan ringan.",
    lainnya: "Produk serbaguna yang dapat digunakan sesuai kebutuhan."
  }
};

  /* =============================
   AUTO OPEN MODAL UNTUK FLASH DARI SLUG
   (TAMBAHAN – TIDAK GANTI KODE LAIN)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("produk");
  if (!slug) return;

  // generate slug flash (harus konsisten dengan renderFlash)
  const makeFlashSlug = name =>
    "flash-" + name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  fetch("data/flash.json")
    .then(r => r.json())
    .then(list => {
      if (!Array.isArray(list)) return;

      const flashProd = list.find(p => {
        const s = p.slug || makeFlashSlug(p.name);
        return s === slug;
      });

      if (flashProd) {
  // tunggu modal & DOM siap
  setTimeout(() => {
    if (document.getElementById("product-modal")) {
      openProdukModal(flashProd);
    }
  }, 300);
}
    });
});


/* =============================
   BUKA MODAL PRODUK
============================= */
function openProdukModal(p) {  
  window.currentModalProduct = p;

  if (window.setShareProduct) window.setShareProduct(p);

  const bg = document.getElementById("product-modal");

  const hargaFinal = p.price_flash || p.price;

// ✅ centralized currency
const currency = getSelectedCurrency();
const pObj = formatPriceByCurrency(hargaFinal, currency);

const hargaText = pObj.icon
  ? `<img src="${pObj.icon}" class="pi-logo"> ${pObj.text}`
  : pObj.text;


  bg.querySelector(".pm-img").src = p.img;
  bg.querySelector(".pm-title").textContent = p.name;

bg.querySelector(".pm-price").innerHTML = hargaText;


  // ambil deskripsi dari JSON dulu, fallback ke generateDeskripsi
  bg.querySelector(".pm-desc").textContent = getProductDescription(p);

  pmQty = 1;
  bg.querySelector(".pm-number").textContent = pmQty;

  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const btnWL = bg.querySelector(".pm-wishlist");
  if (wishlist.find(it => it.name === p.name)) btnWL.classList.add("active");
  else btnWL.classList.remove("active");

  bg.style.display = "flex";
  modalProdukAktif = true;
  history.pushState({ modal: true }, "");

  bg.querySelector(".pm-add").onclick = () => {
    const existing = cart.find(it => it.name === p.name);
    if (existing) existing.qty += pmQty;
    else cart.push({ 
      name: p.name, 
      qty: pmQty, 
      price: hargaFinal,
      img: p.img
    });

    updateCartCount();
    showToast(`Ditambahkan: ${p.name} x ${pmQty}`);
    closeProdukModal();
  };

  btnWL.onclick = () => {
    let wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const exist = wl.some(it => it.name === p.name);
    if (!exist) {
      wl.push({
        name: p.name,
        img: p.img,
        price: hargaFinal,
        category: p.category || ""
      });
      localStorage.setItem("wishlist", JSON.stringify(wl));
      btnWL.classList.add("active");
      showToast("Ditambahkan ke Wishlist");
    } else {
      wl = wl.filter(it => it.name !== p.name);
      localStorage.setItem("wishlist", JSON.stringify(wl));
      btnWL.classList.remove("active");
      showToast("Dihapus dari Wishlist");
    }
  };
}

/* =============================
   TUTUP MODAL PRODUK
============================= */
function closeProdukModal() {
  const modal = document.getElementById("product-modal");
  modal.style.display = "none";
  modalProdukAktif = false;

  lockPop = true;
  history.replaceState(null, "", location.pathname);
  setTimeout(() => lockPop = false, 50);
}

document.querySelector(".pm-close").onclick = closeProdukModal;
document.querySelector(".pm-back").onclick = closeProdukModal;
document.getElementById("product-modal").addEventListener("click", e => {
  if (e.target.id === "product-modal") closeProdukModal();
});
document.querySelector(".pm-sheet").addEventListener("click", e => e.stopPropagation());

/* =============================
   QTY BUTTON
============================= */
document.querySelector(".pm-plus").onclick = () => {
  pmQty++;
  document.querySelector(".pm-number").textContent = pmQty;
};
document.querySelector(".pm-minus").onclick = () => {
  if (pmQty > 1) pmQty--;
  document.querySelector(".pm-number").textContent = pmQty;
};

/* =============================
   BACK BUTTON HP
============================= */
window.addEventListener("popstate", () => {
  if (modalProdukAktif && !lockPop) closeProdukModal();
});

/* =============================
   AMBIL DESKRIPSI PRODUK
============================= */
function getProductDescription(p) {
  const key = p.name.toLowerCase();

  // JIKA DATA BELUM SIAP
  if (!PRODUCT_DATA || Object.keys(PRODUCT_DATA).length === 0) {
    return generateDeskripsi(p.name, p.category);
  }

  // PRIORITAS: products.json (deskripsi khusus)
  if (Array.isArray(PRODUCT_DATA.products)) {
    const prod = PRODUCT_DATA.products.find(
      pr => pr.name && pr.name.toLowerCase() === key
    );
    if (prod) return prod.desc_long || prod.desc_short;
  }

  // fallback dari produk langsung
  if (p.desc) return p.desc;
  if (p.label) return p.label;

  // terakhir generate
  return generateDeskripsi(p.name, p.category);
}


/* =============================
   GENERATE DESKRIPSI DEFAULT
============================= */
function generateDeskripsi(nama, kategori = "") {
  let lower = nama.toLowerCase();
  let descParts = [];

  // pakai JSON kalau ada
  const brands = PRODUCT_DATA.brands || [];
  const rasaMap = PRODUCT_DATA.rasaMap || {};
  const kategoriDesc = PRODUCT_DATA.kategoriDesc || {};

  // =============================
  // KATEGORI YANG BOLEH PUNYA RASA
  // =============================
  const kategoriPakaiRasa = [
  "makanan",
  "minuman",
  "snack",
  "mie",
  "minumansachet",
  "roti"
];


  // =============================
  // BRAND
  // =============================
  const brandFound = brands.find(b => lower.includes(b));
  if (brandFound) {
    descParts.push(`Produk dari brand ${capitalize(brandFound)} yang sudah dikenal kualitasnya.`);
  }

  // =============================
  // RASA (HANYA UNTUK KATEGORI TERTENTU)
  // =============================
  if (kategoriPakaiRasa.includes(kategori)) {
    for (const key in rasaMap) {
      if (lower.includes(key)) {
        descParts.push(rasaMap[key]);
        break;
      }
    }
  }

  // =============================
  // DESKRIPSI KATEGORI
  // =============================
  if (kategoriDesc[kategori]) {
    descParts.push(kategoriDesc[kategori]);
  }

  // =============================
  // KHUSUS OBAT
  // =============================
  if (kategori === "obat") {
    if (lower.includes("promag")) descParts.push("Meredakan maag atau kembung.");
    else if (lower.includes("tolak angin")) descParts.push("Mengurangi masuk angin.");
    else if (lower.includes("antangin")) descParts.push("Sensasi hangat herbal.");
    else if (lower.includes("neozep")) descParts.push("Meringankan gejala flu.");
  }

  // =============================
  // KATA KUNCI UMUM (AMAN)
  // =============================
  if (lower.includes("kopi") && kategori !== "obat")
    descParts.push("Aroma kopi khas, praktis dibuat kapan saja.");

  if (lower.includes("teh") && kategori !== "obat")
    descParts.push("Teh menyegarkan cocok dingin maupun hangat.");

  if (lower.includes("susu"))
    descParts.push("Sumber energi dan nutrisi.");

  if (lower.includes("keripik") || lower.includes("chips"))
    descParts.push("Renyah dan bikin nagih.");

  // =============================
  // UKURAN KEMASAN
  // =============================
  const sizeMatch = nama.match(/(\d+\s?(g|ml|kg|L))/i);
  if (sizeMatch) {
    descParts.push(`Kemasan ${sizeMatch[0]}, pas untuk kebutuhan harian.`);
  }

  // =============================
  // FALLBACK
  // =============================
  if (descParts.length === 0) {
    descParts.push("Produk berkualitas yang cocok digunakan setiap hari.");
  }

  return descParts.join(" ");
}

/* =============================
   UTIL
============================= */
function capitalize(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
