document.addEventListener("click", function(e){

  const btn = e.target.closest("[data-wa]");
  if(!btn) return;

  // STOP semua handler link lain
  e.preventDefault();
  e.stopImmediatePropagation();

  const type = btn.dataset.wa;

  // ======================
  // REQUEST PRODUK
  // ======================
  if(type === "request"){
    openModal({
      title: "Request Produk",
      isWA: true,
      action: (produk, jumlah)=>{
        openWA("request", { produk, jumlah });
      }
    });
    return;
  }

  // ======================
  // CEK PESANAN
  // ======================
  if(type === "cek"){
    const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
    const last = r[r.length - 1];

    if(!last){
      openModal({
        title: "Riwayat Kosong",
        message: "Belum ada pesanan yang tersimpan.",
        action: ()=>{}
      });
      return;
    }

    openModal({
      title: "Cek Status Pesanan?",
      message: `Cek pesanan ID ${last.id}?`,
      action: ()=>{
        openWA("cek", {
          id: last.id,
          nama: last.nama,
          alamat: last.alamat,
          hp: last.hp,
          produk: last.produk,
          total: last.total,
          waktu: last.waktu
        });
      }
    });
  }

}, true); //  capture phase
