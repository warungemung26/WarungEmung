let pmQty = 1;

function openProdukModal(p) {
  const bg = document.getElementById("product-modal");

  bg.querySelector(".pm-img").src = p.img;
  bg.querySelector(".pm-title").textContent = p.name;
  bg.querySelector(".pm-price").textContent = formatRupiah(p.price);

  pmQty = 1;
  bg.querySelector(".pm-number").textContent = pmQty;

  bg.style.display = "flex";

  // tombol tambah keranjang
  bg.querySelector(".pm-add").onclick = () => {
    const existing = cart.find(it => it.name === p.name);
    if (existing) existing.qty += pmQty;
    else cart.push({ name: p.name, qty: pmQty, price: p.price });

    updateCartCount();
    showToast(`Ditambahkan: ${p.name} x ${pmQty}`);
    bg.style.display = "none";
  };
}

/* tombol minus */
document.querySelector(".pm-minus").onclick = () => {
  if (pmQty > 1) pmQty--;
  document.querySelector(".pm-number").textContent = pmQty;
};

/* tombol plus */
document.querySelector(".pm-plus").onclick = () => {
  pmQty++;
  document.querySelector(".pm-number").textContent = pmQty;
};

/* close modal */
document.querySelector(".pm-close").onclick = () => {
  document.getElementById("product-modal").style.display = "none";
};

/* klik backdrop menutup modal */
document.getElementById("product-modal").onclick = (e) => {
  if (e.target.id === "product-modal") {
    e.target.style.display = "none";
  }
};
