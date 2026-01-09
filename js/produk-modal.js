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
   LOAD PRODUCTS JSON
============================= */
fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    PRODUCT_DATA = data || {};
  })
  .catch(err => console.warn("Produk JSON gagal dimuat:", err));

/* =============================
   BUKA MODAL PRODUK
============================= */
function openProdukModal(p) {  
  window.currentModalProduct = p;

  if (window.setShareProduct) window.setShareProduct(p);

  const bg = document.getElementById("product-modal");

  const hargaFinal = p.price_flash || p.price;
  const currency = localStorage.getItem("selectedCurrency") || "Rp";
  const hargaText = currency === "PI"
    ? `PI ${(hargaFinal / 3200).toFixed(2)}`
    : formatPrice(hargaFinal, currency);

  bg.querySelector(".pm-img").src = p.img;
  bg.querySelector(".pm-title").textContent = p.name;

  if (currency === "PI") {
    bg.querySelector(".pm-price").innerHTML = `
      <img src="images/pi-logo.png" class="pi-logo"
           style="width:16px;height:16px;vertical-align:middle;margin-right:4px;">
      ${hargaText}
    `;
  } else {
    bg.querySelector(".pm-price").textContent = hargaText;
  }

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

  if (PRODUCT_DATA.products) {
    const prod = PRODUCT_DATA.products.find(pr => pr.name.toLowerCase() === key);
    if (prod) return prod.desc_long || prod.desc_short;
  }

  if (p.desc) return p.desc;
  if (p.label) return p.label;
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
