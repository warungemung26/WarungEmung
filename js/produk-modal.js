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
  const bg = document.getElementById("product-modal");

  // SET DATA PRODUK
  bg.querySelector(".pm-img").src = p.img;
  bg.querySelector(".pm-title").textContent = p.name;

  const hargaFinal = p.price_flash || p.price;
  bg.querySelector(".pm-price").textContent = formatRupiah(hargaFinal);

  const deskripsi = p.desc || p.label || generateDeskripsi(p.name, p.category);
  bg.querySelector(".pm-desc").textContent = deskripsi;

  // RESET QTY
  pmQty = 1;
  bg.querySelector(".pm-number").textContent = pmQty;

  // TAMPILKAN MODAL
  bg.style.display = "flex";
  modalProdukAktif = true;

  // TAMBAH STATE UNTUK BACK HP
  history.pushState({ modal: true }, "");

  // === TOMBOL ADD HIDUP ===
  bg.querySelector(".pm-add").onclick = () => {
    const existing = cart.find(it => it.name === p.name);
    if (existing) existing.qty += pmQty;
    else cart.push({ name: p.name, qty: pmQty, price: hargaFinal });

    updateCartCount();
    showToast(`Ditambahkan: ${p.name} x ${pmQty}`);
    closeProdukModal();
  };

  // === TOMBOL WISHLIST ===
  bg.querySelector(".pm-wishlist").onclick = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!wishlist.find(item => item.name === p.name)) {
      wishlist.push({
        name: p.name,
        img: p.img,
        price: p.price_flash || p.price,
        category: p.category || ""
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      showToast("Disimpan ke Wishlist");
    } else {
      showToast("Sudah ada di Wishlist");
    }
  };
}

document.querySelector('.pm-wishlist').addEventListener('click', function () {
  this.classList.toggle('active');
});

document.addEventListener("click", function(e){
  if (e.target.closest(".pm-wishlist")) {
    const btn = e.target.closest(".pm-wishlist");

    // Ambil data produk aktif
    const p = window.currentModalProduct;
    if (!p) return;

    toggleWishlist(p);
  }
});

/* =============================
   TUTUP MODAL PRODUK
============================= */
function closeProdukModal() {
  const modal = document.getElementById("product-modal");
  modal.style.display = "none";
  modalProdukAktif = false;

  lockPop = true;
  history.replaceState(null, "");
  setTimeout(() => lockPop = false, 50);
}

/* =============================
   TOMBOL CLOSE, BACK, & BACKDROP
============================= */
document.querySelector(".pm-close").onclick = closeProdukModal;
document.querySelector(".pm-back").onclick = closeProdukModal;

document.getElementById("product-modal").addEventListener("click", (e) => {
  if (e.target.id === "product-modal") closeProdukModal();
});

// AGAR ISI MODAL BISA DIKLIK (qty / add)
document.querySelector(".pm-sheet").addEventListener("click", (e) => e.stopPropagation());

/* =============================
   QTY BUTTON HIDUP
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
window.addEventListener("popstate", (e) => {
  // Jika modal aktif, back HP akan tutup modal dulu
  if (modalProdukAktif && !lockPop) {
    closeProdukModal();
  }
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
    bumbu: "Bahan bumbu dapur praktis untuk memasak lebih mudah.",
    rumah: "Produk kebutuhan rumah tangga untuk membantu pekerjaan sehari-hari.",
    lainnya: "Produk serbaguna yang bisa digunakan sesuai kebutuhan.",
    minumansachet: "Minuman instan praktis dalam bentuk sachet.",
    obat: "Produk kesehatan dalam bentuk sachet untuk meredakan keluhan ringan."
  };

  if (kategoriDesc[kategori]) descParts.push(kategoriDesc[kategori]);

  if (kategori === "obat") {
    if (lower.includes("promag")) descParts.push("Meredakan maag atau kembung.");
    else if (lower.includes("tolak angin")) descParts.push("Mengurangi masuk angin.");
    else if (lower.includes("antangin")) descParts.push("Sensasi hangat herbal.");
    else if (lower.includes("neozep")) descParts.push("Meringankan gejala flu.");
  }

  if (lower.includes("kopi") && kategori !== "obat") descParts.push("Aroma kopi khas, praktis dibuat kapan saja.");
  if (lower.includes("teh") && kategori !== "obat") descParts.push("Teh menyegarkan cocok dingin maupun hangat.");
  if (lower.includes("susu")) descParts.push("Sumber energi dan nutrisi.");
  if (lower.includes("keripik") || lower.includes("chips")) descParts.push("Renyah dan bikin nagih.");

  const sizeMatch = nama.match(/(\d+\s?(g|ml|kg|L))/i);
  if (sizeMatch) descParts.push(`Kemasan ${sizeMatch[0]}, pas untuk kebutuhan harian.`);

  if (descParts.length === 0)
    descParts.push("Produk berkualitas yang cocok digunakan setiap hari.");

  return descParts.join(" ");
}

function capitalize(str) {
  return str.split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");
}
