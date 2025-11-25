/* js/cta-links.js
   Menangani tombol CTA (WA, anchor, link eksternal) dengan modal konfirmasi
*/

(function(){
  // Ambil elemen modal
  const modal = document.getElementById('modal-confirm');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalWaInputs = document.getElementById('modal-wa-inputs');
  const modalProduk = document.getElementById('modal-produk');
  const modalJumlah = document.getElementById('modal-jumlah');
  const modalOk = document.getElementById('modal-ok');
  const modalCancel = document.getElementById('modal-cancel');

  let currentAction = null;
  let isWaFlow = false;

  // Buka modal
  function openModal({title="Konfirmasi", message="", isWA=false, action=null} = {}) {
    if(!modal) return fallbackModal(title, message, isWA, action);

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalWaInputs.style.display = isWA ? 'block' : 'none';

    if(isWA){
      modalProduk.value = "";
      modalJumlah.value = "";
    }

    currentAction = action;
    isWaFlow = !!isWA;

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden','false');
  }

  // Tutup modal
  function closeModal(){
    if(!modal) return;
    modal.style.display='none';
    modal.setAttribute('aria-hidden','true');
  }

  // Fallback jika modal tidak ada
  function fallbackModal(title, message, isWA, action){
    if(isWA){
      const produk = prompt("Nama Produk:", "");
      if(!produk) return;
      const jumlah = prompt("Jumlah:", "1");
      if(!jumlah) return;
      action(produk, jumlah);
    } else {
      if(confirm(message || title) && typeof action === 'function') action();
    }
  }

  if(modalCancel) modalCancel.addEventListener('click', closeModal);

  if(modalOk) modalOk.addEventListener('click', function(){
    if(typeof currentAction !== 'function'){ closeModal(); return; }

    if(isWaFlow){
      const produk = modalProduk.value.trim();
      const jumlah = modalJumlah.value.trim();
      if(!produk || !jumlah){
        alert("Harap isi Nama Produk dan Jumlah.");
        return;
      }
      currentAction(produk, jumlah);
    } else {
      currentAction();
    }

    closeModal();
  });

  // Tutup modal klik backdrop
  if(modal){
    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
  }

  // ======================================================
  // EVENT DELEGATION CTA-LINK
  // ======================================================
  document.addEventListener('click', function(e){
    const anchor = e.target.closest('.cta-link');
    if(!anchor) return;
    e.preventDefault();

    const href = anchor.getAttribute('href') || '';
    
    // ======================================================
// RIWAYAT — HANDLER GLOBAL CTA
// ======================================================

// Hapus satu riwayat
if (anchor.classList.contains("riwayat-delete")) {
  const id = anchor.dataset.id;

  openModal({
    title: "Hapus Riwayat?",
    message: "Yakin ingin menghapus riwayat pesanan ini?",
    action: function () {
      let r = JSON.parse(localStorage.getItem("riwayat") || "[]");
      r = r.filter(x => x.id != id);
      localStorage.setItem("riwayat", JSON.stringify(r));
      location.reload();
    }
  });

  return;
}

// Hapus semua riwayat
if (anchor.classList.contains("riwayat-clear-all")) {
  openModal({
    title: "Hapus Semua Riwayat?",
    message: "Semua riwayat akan terhapus permanen.",
    action: function () {
      localStorage.removeItem("riwayat");
      location.reload();
    }
  });

  return;
}

// Ulangi pesanan dari riwayat
if (anchor.classList.contains("riwayat-repeat")) {
  const id = anchor.dataset.id;
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  const item = r.find(x => x.id == id);

  if (!item) {
    openModal({
      title: "Tidak Ditemukan",
      message: "Data pesanan tidak tersedia.",
      action: function(){}
    });
    return;
  }

  openModal({
    title: "Ulangi Pesanan?",
    message: "Semua produk dari pesanan ini akan dimasukkan ke keranjang.",
    action: function () {
      localStorage.setItem("cart", JSON.stringify(item.items));
      location.href = "#keranjang";
    }
  });

  return;
}

// Cek Status dari Riwayat
if (anchor.classList.contains("riwayat-status")) {
  const id = anchor.dataset.id;

  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  const item = r.find(x => x.id == id);

  if (!item) {
    openModal({
      title: "Tidak Ditemukan",
      message: "Data riwayat tidak tersedia.",
      action: function(){}
    });
    return;
  }

  const list = item.items.map(it => `${it.qty} x ${it.name}`).join(", ");
  const text = 
`Halo Warung Emung, ingin menanyakan status pesanan saya.

🆔 *ID:* ${item.id}
🛒 *Produk:* ${list}
💰 *Total:* Rp ${item.total}
📅 *Waktu:* ${item.waktu || '-'}

Mohon informasinya.`;

  openModal({
    title: "Cek Status Pesanan?",
    message: "Ingin menanyakan status pesanan ini via WhatsApp?",
    action: function () {
      const wa = "https://wa.me/6285322882512?text=" + encodeURIComponent(text);
      window.open(wa, '_blank');
    }
  });

  return;
}


    // ======================================================
    // 1. WA STATUS — CEK PESANAN TERAKHIR
    // ======================================================
    if(anchor.classList.contains("wa-status")){
      const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
      const last = r[r.length - 1];

      if(!last){
        openModal({
          title: "Riwayat Kosong",
          message: "Anda belum memiliki pesanan yang tersimpan.",
          isWA: false,
          action: function(){}
        });
        return;
      }

      const list = last.items.map(it => `${it.qty} x ${it.name}`).join(", ");
      const total = last.total;
      const waktu = last.waktu || last.date || "-";
      const id = last.id || "Tanpa ID";

      openModal({
        title: "Cek Status Pesanan?",
        message: "Ingin menanyakan status pesanan terakhir Anda?",
        isWA: false,
        action: function(){
          const text =
            `Halo Warung Emung, saya ingin menanyakan status pesanan saya.\n\n` +
            `🆔 *ID:* ${id}\n` +
            `🛒 *Produk:* ${list}\n` +
            `💰 *Total:* Rp ${total}\n` +
            `📅 *Waktu:* ${waktu}\n\n` +
            `Mohon informasinya.`;

          const wa = "https://wa.me/6285322882512?text=" + encodeURIComponent(text);
          window.open(wa, "_blank");
        }
      });

      return;
    }

// ======================================================
// 2. WA NAVBAR — CEK ORDER TERAKHIR (MEMAKAI RIWAYAT)
// ======================================================
if(anchor.classList.contains("wa-nav")){

  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  const last = r[r.length - 1];

  if(!last){
    openModal({
      title: "Riwayat Kosong",
      message: "Anda belum memiliki pesanan yang tersimpan.",
      isWA: false,
      action: function(){}
    });
    return;
  }

  // ========== FIX: fallback data jika riwayat lama belum lengkap ==========
  const id = last.id || "Tanpa ID";
  const waktu = last.waktu || "-";
  const nama = last.nama || localStorage.getItem("reg_nama") || "Pelanggan";
  const alamat = last.alamat || localStorage.getItem("reg_alamat") || "-";
  const hp = last.hp || localStorage.getItem("reg_hp") || "-";

  const list = last.items.map(it => `${it.qty} x ${it.name}`).join(", ");
  const total = last.total || 0;

  openModal({
    title: "Cek Status Pesanan?",
    message: "Ingin menanyakan status pesanan terakhir Anda?",
    isWA: false,
    action: function(){

      const text =
`Halo Warung Emung, saya ingin menanyakan status pesanan terbaru saya.

🆔 *ID Pesanan:* ${id}
👤 *Nama:* ${nama}
📍 *Alamat:* ${alamat}
📱 *HP:* ${hp}
🛒 *Produk:* ${list}
💰 *Total:* Rp ${total}
📅 *Waktu:* ${waktu}

Mohon informasinya.`;

      const wa = "https://wa.me/6285322882512?text=" + encodeURIComponent(text);
      window.open(wa, "_blank");
    }
  });

  return;
}


    // ======================================================
    // 3. REQUEST PRODUK VIA WA (FLOW LAMA)
    // ======================================================
    if(href.includes('wa.me')){
      openModal({
        title: "Request Produk via WhatsApp",
        message: "Masukkan Nama Produk dan Jumlah:",
        isWA: true,
        action: function(produk, jumlah){
          let waLink = href;

          if(waLink.includes("[NAMA PRODUK]") || waLink.includes("[JUMLAH]")){
            waLink = waLink.replace(/\[NAMA PRODUK\]/g, encodeURIComponent(produk))
                           .replace(/\[JUMLAH\]/g, encodeURIComponent(jumlah));
          } else {
            const extra = encodeURIComponent(` Produk: ${produk} Jumlah: ${jumlah}`);
            if(waLink.includes('?text=')) waLink += extra;
            else waLink += '?text=' + extra;
          }

          window.open(waLink, '_blank');
        }
      });
      return;
    }

    // ======================================================
    // 4. ANCHOR IN-PAGE
    // ======================================================
    if(href.startsWith('#')){
      openModal({
        title: "Navigasi",
        message: "Apakah Anda ingin pergi ke section ini?",
        isWA: false,
        action: function(){
          const section = document.querySelector(href);
          if(section) section.scrollIntoView({behavior:'smooth'});
        }
      });
      return;
    }

    // ======================================================
    // 5. LINK EKSTERNAL
    // ======================================================
    openModal({
      title: "Buka Link",
      message: "Apakah Anda ingin membuka link ini di tab baru?",
      isWA: false,
      action: function(){
        window.open(href,'_blank');
      }
    });

  }); // END delegation
})();

document.addEventListener("DOMContentLoaded", () => {
  const alamatBtn = document.getElementById("edit-alamat");
  if(alamatBtn){
    alamatBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      e.stopPropagation();

      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const currentAlamat = userData.alamat || "";

      if(typeof openModalDynamic === 'function'){
        openModalDynamic({
          title: "Ubah Alamat Pengiriman",
          bodyHTML: `<input type="text" id="input-alamat" placeholder="Masukkan alamat baru" value="${currentAlamat}" style="width:100%;padding:8px;">`,
          action: (body) => {
            const input = body.querySelector("#input-alamat");
            if(input && input.value.trim() !== ""){
              userData.alamat = input.value.trim();
              localStorage.setItem("userData", JSON.stringify(userData));
              window.showToast("Alamat berhasil diperbarui!");
            } else {
              window.showToast("Alamat tidak boleh kosong!");
            }
          }
        });
      } else {
        const newAlamat = prompt("Alamat Baru:", currentAlamat);
        if(newAlamat !== null && newAlamat.trim() !== ""){
          userData.alamat = newAlamat.trim();
          localStorage.setItem("userData", JSON.stringify(userData));
          window.showToast("Alamat berhasil diperbarui!");
        }
      }
    });
  }
});
