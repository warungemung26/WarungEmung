/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */


function getSelectedCurrency() {
  return localStorage.getItem('selectedCurrency') || 'Rp';
}


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

function resetModalUI() {
  if (!modal) return;

  // reset tombol
  if (modalCancel) {
    modalCancel.style.display = '';
  }

  if (modalOk) {
    modalOk.style.display = '';
    modalOk.textContent = 'OK';
    modalOk.onclick = null; // KUNCI
  }

  // reset body
  if (modalWaInputs) modalWaInputs.style.display = 'none';

  // reset state
  currentAction = null;
  isWaFlow = false;
}


  function openModal({title="Konfirmasi", message="", isWA=false, action=null} = {}) {
  if(!modal) return fallbackModal(title, message, isWA, action);

  resetModalUI(); // 🔥 INI KUNCI

  modalTitle.textContent = title;
  modalMessage.innerHTML = message;
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


  function closeModal(){
    if(!modal) return;
    modal.style.display='none';
    modal.setAttribute('aria-hidden','true');
  }

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

  if(modal){
  modal.addEventListener('click', function(e){
    if(e.target === modal){
      currentAction = null;
      isWaFlow = false;
      closeModal();
    }
  });
}


function openInfoModal({ title = "Info", message = "", autoClose = false, delay = 2000 } = {}) {
  const modal = document.getElementById('modal-confirm');
  if (!modal) return;

  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const modalBody = document.getElementById('modal-body');
  const modalWaInputs = document.getElementById('modal-wa-inputs');
  const modalCancel = document.getElementById('modal-cancel');
  const modalOk = document.getElementById('modal-ok');

  // reset TOTAL (INI KUNCI)
  currentAction = null;
  isWaFlow = false;

  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // sembunyikan elemen yang tidak perlu
  if (modalBody) modalBody.style.display = "none";
  if (modalWaInputs) modalWaInputs.style.display = "none";

  // HILANGKAN tombol BATAL
  if (modalCancel) modalCancel.style.display = "none";

  // OK jadi tombol TUTUP MURNI
  if (modalOk) {
    modalOk.textContent = "Tutup";
    modalOk.onclick = function () {
      closeModal();
    };
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  if (autoClose) {
    setTimeout(closeModal, delay);
  }
}

  // ======================================================
  // EVENT DELEGATION CTA-LINK
  // ======================================================
  document.addEventListener('click', function(e){

    // ------------------------------
    // WA CART — PESAN SEMUA VIA WHATSAPP
    // ------------------------------
    const waCartBtn = e.target.closest('#wa-cart');
if(waCartBtn){
  e.preventDefault();

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const alamat = userData.alamat || '';
  const nama = userData.nama || 'Pelanggan';
  const hp = userData.hp || '';

  if(!alamat.trim()){
    openModal({
      title: "Alamat Belum Terisi",
      message: "Harap isi alamat pengiriman terlebih dahulu sebelum memesan.",
      action: ()=>{}
    });
    return;
  }

  if(cart.length === 0){
    openModal({
      title: "Keranjang Kosong",
      message: "Tidak ada item untuk dipesan.",
      action: ()=>{}
    });
    return;
  }

  openModal({
  title: "Konfirmasi Pesenan 🙏",
  message: (() => {
    const currency = getSelectedCurrency();
    const ONGKIR = 2000;
    const subtotal = cart.reduce((s,i)=>s+i.qty*i.price,0);
    const total = subtotal + ONGKIR;

    // === AMBIL DATA ALAMAT ===
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const alamat  = userData.alamat || '-';
    const noRumah = userData.noRumah || '';
    const rtrw    = userData.rtrw || '';

    const alamatLengkap =
      `${alamat}` +
      `${noRumah ? ' No. ' + noRumah : ''}` +
      `${rtrw ? ', RT/RW ' + rtrw : ''}`;

    const listHTML = cart.map(it=>{
      const harga = formatPrice(it.price * it.qty, currency, { html: true });

      return `
        <div style="display:flex;justify-content:space-between;font-size:13px;margin:4px 0">
          <span>${it.qty} x ${it.name}</span>
          <span>${harga}</span>
        </div>
      `;
    }).join("");


    const totalStr = formatPrice(total, currency, { html:true });

    return `
  <div style="font-size:13px;line-height:1.5">
    <p>
      Mangga dipun priksa rumiyin pesenan lan alamat pangiriman panjenengan:
    </p>

    <div style="margin:8px 0;padding:8px;border-radius:8px;background:#f6f6f6">
      ${listHTML}
      <hr style="opacity:.3">

      <div style="display:flex;justify-content:space-between;font-size:12px">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal, currency, { html:true })}</span>
      </div>

      <div style="display:flex;justify-content:space-between;font-size:12px">
        <span>Ongkir</span>
       <span>${formatPrice(ONGKIR, currency, { html:true })}</span>
      </div>

      <hr style="opacity:.3">

      <b style="display:flex;justify-content:space-between">
        <span>Total</span>
        <span>${totalStr}</span>
      </b>
    </div>

    <div style="margin-top:6px;padding:8px;border-radius:8px;background:#f9f9f9;font-size:12px">
      <b>📍 Alamat Pangiriman</b><br>
      ${alamatLengkap || '<i>Alamat belum diisi</i>'}
    </div>

    <p style="margin-top:6px">
      Menawi sampun leres, mangga pencet <b>OK</b> supados pesenan dipun kirim liwat WhatsApp.
    </p>
  </div>
`;

  })(),
  action: function(){
    const orderId = 'EM-' + Date.now().toString().slice(-6);
    const waktu = waktuPesan();
    const currency = getSelectedCurrency();

 // ambil currency saat ini

      const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
      const ONGKIR = 2000;
      const total = subtotal + ONGKIR;

      const lines = cart.map(it => {
  return `- ${it.qty} x ${it.name} - ${formatPrice(it.price * it.qty, currency, { text:true })}`;
}).join("\n");


      const subtotalStr = formatPrice(subtotal, currency, { text:true });
const ongkirStr   = formatPrice(ONGKIR,   currency, { text:true });
const totalStr    = formatPrice(total,    currency, { text:true });


      const message =
`🛍️ *PESANAN BARU - WARUNG EMUNG*
🆔 ID Pesanan: ${orderId}
📅 Waktu: ${waktu}

👤 Nama: ${nama}
📍 Alamat: ${alamat}
📱 HP: ${hp || '-'}

🛒 Detail Pesanan:
${lines}

🧾 *Subtotal:* ${subtotalStr}
🚚 Ongkir: ${ongkirStr}
💰 Total: ${totalStr}

Mohon diproses.`;

      const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT;
const waUrl = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(message);

window.open(waUrl, "_blank");
      
      // TAMPILKAN MODAL TERIMA KASIH
setTimeout(() => {
  openThankYouModal();
}, 300);


      simpanRiwayat({
        id: orderId,
        items: cart.map(it => ({
  id: it.id || null,
  name: it.name,
  qty: it.qty,
  harga: it.price,
  subtotal: it.price * it.qty,

  // === SNAPSHOT IMAGE PRODUK ===
  img: it.img 
    || it.image 
    || it.thumb 
    || it.foto 
    || it.gambar 
    || it.photo 
    || it.imgUrl 
    || it.url 
    || ''
})),

        subtotal,
        ongkir: ONGKIR,
        total,
        waktu,
        date: new Date().toISOString(),
        // tambahan agar konsisten dengan cart-modal.js
        nama: nama,
        alamat: alamat,
        hp: hp
      });

      cart = [];
      updateCartCount();
      renderCartModal();
      cartModal.style.display = 'none';
    }
  });


      return;
    }    

    // ------------------------------
    // CTA LINK BIASA
    // ------------------------------
    const anchor = e.target.closest('.cta-link, .cta-clear-cart, #wa-cart, .riwayat-delete, .riwayat-clear-all, .riwayat-repeat, .riwayat-status, .wa-status, .wa-nav');
if(!anchor) return;
    e.preventDefault();
    const href = anchor.getAttribute('href') || '';



    // 2. KOSONGKAN KERANJANG
    if(anchor.classList.contains("cta-clear-cart")){
      if(cart.length === 0){
        openModal({
          title:"Kosong",
          message:"Keranjang sudah kosong.",
          action:()=>{}
        });
        return;
      }

      openModal({
  title: "Kosongkan Keranjang?",
  message: "Semua item akan dihapus.",
  action: function(){
    cart = [];
    updateCartCount();
    renderCartModal();

    // TUTUP SEMUA: cart-modal + modal konfirmasi + backdrop
    cartModal.style.display = 'none';
    const confirmModal = document.querySelector(".modal-confirm");
    if(confirmModal) confirmModal.style.display = 'none';
    const backdrop = document.getElementById("cart-backdrop");
    if(backdrop) backdrop.style.display = 'none';
  }
});


      return;
    }
    
    function openThankYouModal() {
  openInfoModal({
    title: "Matur Nuwun 🙏",
    message: "Matur nuwun sampun ngubungi Warung Emung.\n\nMangga lanjut kirim pesenan liwat WhatsApp supados saged diproses.",
  });
}


    // ======================================================
// RIWAYAT — HANDLER GLOBAL CTA
// ======================================================

// ===============================
// Hapus satu riwayat
// ===============================
if (anchor.classList.contains("riwayat-delete")) {
  const id = anchor.dataset.id;

  openModal({
    title: "Hapus Riwayat?",
    message: "Yakin ingin menghapus riwayat pesanan ini?",
    action: function () {
      let r = JSON.parse(localStorage.getItem("riwayat") || "[]");
      r = r.filter(x => x.id != id);
      localStorage.setItem("riwayat", JSON.stringify(r));

      const wrap = document.getElementById("riwayat-list");
      if (wrap) {
        wrap.style.transition = "opacity .18s ease, transform .18s ease";
        wrap.style.opacity = "0";
        wrap.style.transform = "translateY(6px) scale(.98)";
        wrap.style.pointerEvents = "none";
      }

      setTimeout(() => {
        if (typeof loadRiwayat === "function") loadRiwayat();
        if (wrap) {
          wrap.style.opacity = "1";
          wrap.style.transform = "translateY(0) scale(1)";
          wrap.style.pointerEvents = "auto";
        }
      }, 140);
    }
  });

  return;
}


// ===============================
// Hapus semua riwayat
// ===============================
if (anchor.classList.contains("riwayat-clear-all")) {
  openModal({
    title: "Hapus Semua Riwayat?",
    message: "Semua riwayat akan terhapus permanen.",
    action: function () {
      localStorage.removeItem("riwayat");

      const wrap = document.getElementById("riwayat-list");
      if (wrap) {
        wrap.style.transition = "opacity .18s ease, transform .18s ease";
        wrap.style.opacity = "0";
        wrap.style.transform = "translateY(6px) scale(.98)";
        wrap.style.pointerEvents = "none";
      }

      setTimeout(() => {
        if (typeof loadRiwayat === "function") loadRiwayat();
        if (wrap) {
          wrap.style.opacity = "1";
          wrap.style.transform = "translateY(0) scale(1)";
          wrap.style.pointerEvents = "auto";
        }
      }, 140);
    }
  });

  return;
}

// Ulangi pesanan dari riwayat
if (anchor.classList.contains("riwayat-repeat")) {
  const id = anchor.dataset.id;
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  const order = r.find(x => x.id == id);

  if (!order || !Array.isArray(order.items)) {
    openInfoModal({
      title: "Gagal",
      message: "Data pesanan tidak valid."
    });
    return;
  }

  openModal({
    title: "Ulangi Pesanan?",
    message: "Semua produk dari pesanan ini akan dimasukkan ke keranjang.",
    action: function () {

      // 1. Reset cart aktif
      cart = [];

      // 2. Masukkan ulang item dengan DATA LENGKAP
      order.items.forEach(it => {

        // cari produk asli (untuk ambil img, slug, dll)
        const produkAsli = (window.products || []).find(p => p.name === it.name);

        cart.push({
          id: it.id || (produkAsli ? produkAsli.id : null),
          name: it.name,
          qty: it.qty,
          price: it.harga,
          img: produkAsli ? produkAsli.img : "images/placeholder.png",
          slug: produkAsli ? produkAsli.slug : null
        });
      });

      // 3. Simpan & update UI
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartModal();

      // 4. FEEDBACK VISUAL 🔥
      showToast("Pesanan berhasil dimasukkan ke keranjang 🛒");
      if (typeof ding !== "undefined") {
        ding.currentTime = 0;
        ding.play().catch(()=>{});
      }

      // 5. Fokus ke keranjang
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
💰 *Total:* ${formatPrice(item.total, getSelectedCurrency(), { text:true })}
📅 *Waktu:* ${item.waktu || '-'}

Mohon informasinya.`;

  openModal({
    title: "Cek Status Pesanan?",
    message: "Ingin menanyakan status pesanan ini via WhatsApp?",
    action: function () {
      const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT;
const wa = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);

window.open(wa, "_blank");
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
            `💰 *Total:* ${formatPrice(total, getSelectedCurrency(), { text:true })}\n` +
            `📅 *Waktu:* ${waktu}\n\n` +
            `Mohon informasinya.`;

          const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT;
const wa = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);

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
💰 *Total:* ${formatPrice(total, getSelectedCurrency(), { text:true })}
📅 *Waktu:* ${waktu}

Mohon informasinya.`;

      const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT;
const wa = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);

window.open(wa, "_blank");
}
});

  return;
}


 // ======================================================
// 3. REQUEST PRODUK VIA WA (FLOW LAMA) � FIX TEMPLATE
// ======================================================
if (href.includes('wa.me')) {
  openModal({
    title: "Request Produk via WhatsApp",
    message: "Masukkan Nama Produk dan Jumlah:",
    isWA: true,
    action: function (produk, jumlah) {

      let waLink = href;

      // ============================
      // 1. Ambil bagian ?text= jika ada
      // ============================
      const textMatch = waLink.match(/[\?&]text=([^&]+)/);

      if (textMatch) {
        // Decode text bawaan
        let decoded = decodeURIComponent(textMatch[1]);

        // Replace placeholder
        // ===== Template WA profesional =====
const pesanPro = 
`Halo Warung Emung ,

Saya ingin melakukan request produk:

 *Nama Produk*: ${produk}
 *Jumlah*: ${jumlah}

Mohon konfirmasi ketersediaannya.
Terima kasih `;

// Replace isi template lama dengan format baru
decoded = pesanPro;


        // Encode ulang
        const encoded = encodeURIComponent(decoded);

        // Masukkan kembali text= yang sudah diganti
        waLink = waLink.replace(textMatch[1], encoded);

      } else {
        // Jika tidak ada template sama sekali  buat format WA baru
        const pesan = 
`Halo Warung Emung, saya ingin request produk:
� Nama Produk: ${produk}
� Jumlah: ${jumlah}

Mohon informasinya.`;

        waLink += `?text=${encodeURIComponent(pesan)}`;
      }

      window.open(waLink, "_blank");
    }
  });
  return;
}

// ======================================================
// RESET DATA LOKAL — HANDLER
// ======================================================
const resetDataBtn = e.target.closest('#reset-data');
if(resetDataBtn){
  e.preventDefault();
  openModal({
    title: "Reset Data Lokal?",
    message: "Semua data lokal akan dihapus permanen. Lanjutkan?",
    action: function(){
      localStorage.clear();
      sessionStorage.clear();
      location.reload();
    }
  });
  return;
}

// ======================================================
// REQUEST PRODUK VIA WA (MODERN)
// ======================================================
if (anchor.dataset.wa === "request") {
  openModal({
    title: "Request Produk via WhatsApp",
    message: "Masukkan Nama Produk dan Jumlah:",
    isWA: true,
    action: function (produk, jumlah) {

      const waNumber = window.APP_CONFIG?.WHATSAPP?.DEFAULT;

      const pesanPro =
`Halo Warung Emung 🙏,

Saya ingin melakukan request produk:

📦 *Nama Produk*: ${produk}
📊 *Jumlah*: ${jumlah}

Mohon konfirmasi ketersediaannya.
Terima kasih 🙏`;

      const wa = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(pesanPro);
      window.open(wa, "_blank");
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
