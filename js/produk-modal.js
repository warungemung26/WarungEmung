/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

let pmQty = 1;
let modalProdukAktif = false;
let lockPop = false;

/* =============================
   BUKA MODAL PRODUK
============================= */
function openProdukModal(p) {  
  window.currentModalProduct = p; // dipakai wishlist sinkron

  const bg = document.getElementById("product-modal");

  // ===================== SET DATA PRODUK =====================
  bg.querySelector(".pm-img").src = p.img;
  bg.querySelector(".pm-title").textContent = p.name;

  const hargaFinal = p.price_flash || p.price;
  const currency = localStorage.getItem('selectedCurrency') || 'Rp';

  if (currency === 'PI') {
    bg.querySelector(".pm-price").innerHTML = `
      <img src="images/pi-logo.png" class="pi-logo" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;">
      PI ${(hargaFinal / 3200).toFixed(2)}
    `;
  } else {
    bg.querySelector(".pm-price").textContent = formatPrice(hargaFinal, currency);
  }

  const deskripsi = p.desc || p.label || generateDeskripsi(p.name, p.category);
  bg.querySelector(".pm-desc").textContent = deskripsi;

  // ===================== RESET QTY =====================
  pmQty = 1;
  bg.querySelector(".pm-number").textContent = pmQty;

  // ===================== SYNC STATUS WISHLIST =====================
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const btnWL = bg.querySelector(".pm-wishlist");
  if (wishlist.find(it => it.name === p.name)) btnWL.classList.add("active");
  else btnWL.classList.remove("active");

  // ===================== TAMPILKAN MODAL =====================
  bg.style.display = "flex";
  modalProdukAktif = true;

  // TAMBAH STATE UNTUK BACK HP
  history.pushState({ modal: true }, "");

  // ===================== TOMBOL ADD KE KERANJANG =====================
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

  // ===================== TOMBOL WISHLIST =====================
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

// ===================== TOMBOL SHARE LINK =====================
const btnShare = bg.querySelector('#pm-share');
if (btnShare) {
  btnShare.onclick = () => {
    if (!p || !p.slug) return;

    const hargaFinal = p.price_flash || p.price;
    const currency = localStorage.getItem('selectedCurrency') || 'Rp';
    const hargaText = currency === 'PI'
      ? `PI ${(hargaFinal / 3200).toFixed(2)}`
      : formatPrice(hargaFinal, currency);

    const baseUrl = location.origin + location.pathname;
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const productLink = `${baseUrl}?produk=${slug}`;

    // ===== TEMPLATE WA PREMIUM =====
    const text = 
` *${p.name}*  
 Harga: ${hargaText}  
 Kategori: ${p.category || '-'}  
 Deskripsi: ${p.desc || 'Produk berkualitas untuk kebutuhan harian.'}  

 Cek produk: ${productLink}  
-----------------------
 Dapatkan sekarang di *Warung Emung*!`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };
}
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

/* =============================
   TOMBOL CLOSE, BACK & BACKDROP
============================= */
document.querySelector(".pm-close").onclick = closeProdukModal;
document.querySelector(".pm-back").onclick = closeProdukModal;

document.getElementById("product-modal").addEventListener("click", (e) => {
  if (e.target.id === "product-modal") closeProdukModal();
});

// AGAR ISI MODAL BISA DIKLIK
document.querySelector(".pm-sheet").addEventListener("click", (e) => e.stopPropagation());

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
   GENERATE DESKRIPSI
============================= */
function generateDeskripsi(nama, kategori = "") {
  let lower = nama.toLowerCase();
  let descParts = [];

  const brands = [
    "indomie","potabee","kusuka","good day","ultra milk",
    "aqua","kapal api","torabika","roma","nabati",
    "tango","teh pucuk","teh botol","bango","abc","filma","sasa"
  ];
  const brandFound = brands.find(b => lower.includes(b));
  if (brandFound) descParts.push(`Produk dari brand ${capitalize(brandFound)} yang sudah dikenal kualitasnya.`);

  const rasaMap = {
    "bbq": "Hadir dengan cita rasa BBQ gurih dan smoky.",
    "barbeque": "Rasa barbeque manis gurih yang nikmat.",
    "original": "Rasa original yang ringan dan tidak bikin enek.",
    "pedas": "Rasa pedas mantap yang bikin nagih.",
    "hot": "Sensasi pedas panas yang kuat.",
    "spicy": "Rasa spicy gurih khas.",
    "keju": "Rasa keju creamy yang lezat.",
    "cheese": "Rasa keju gurih creamy.",
    "balado": "Rasa balado pedas manis khas Nusantara."
  };

  for (const key in rasaMap)
    if (lower.includes(key)) { descParts.push(rasaMap[key]); break; }

  const kategoriDesc = {
    makanan: "Hidangan siap santap yang cocok untuk camilan atau teman aktivitas.",
    minuman: "Minuman segar yang cocok diminum kapan saja.",
    snack: "Camilan renyah yang enak untuk menemani waktu santai.",
    mie: "Mi instan favorit banyak orang dengan rasa yang khas.",
    sembako: "Kebutuhan pokok rumah tangga untuk persediaan harian.",
    bumbu: "Bahan bumbu dapur praktis.",
    rumah: "Produk kebutuhan rumah tangga.",
    lainnya: "Produk serbaguna sesuai kebutuhan.",
    minumansachet: "Minuman instan praktis sachet.",
    obat: "Produk kesehatan untuk meredakan keluhan ringan."
  };

  if (kategoriDesc[kategori]) descParts.push(kategoriDesc[kategori]);

  if (kategori === "obat") {
    if (lower.includes("promag")) descParts.push("Meredakan maag atau kembung.");
    else if (lower.includes("tolak angin")) descParts.push("Mengurangi masuk angin.");
    else if (lower.includes("antangin")) descParts.push("Sensasi hangat herbal.");
    else if (lower.includes("neozep")) descParts.push("Meringankan gejala flu.");
  }

  if (lower.includes("kopi") && kategori !== "obat")
    descParts.push("Aroma kopi khas, praktis dibuat kapan saja.");

  if (lower.includes("teh") && kategori !== "obat")
    descParts.push("Teh menyegarkan cocok dingin maupun hangat.");

  if (lower.includes("susu"))
    descParts.push("Sumber energi dan nutrisi.");

  if (lower.includes("keripik") || lower.includes("chips"))
    descParts.push("Renyah dan bikin nagih.");

  const sizeMatch = nama.match(/(\d+\s?(g|ml|kg|L))/i);
  if (sizeMatch)
    descParts.push(`Kemasan ${sizeMatch[0]}, pas untuk kebutuhan harian.`);

  if (descParts.length === 0)
    descParts.push("Produk berkualitas yang cocok digunakan setiap hari.");

  return descParts.join(" ");
}

function capitalize(str) {
  return str.split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");
}
