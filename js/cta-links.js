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

  // Fallback jika modal tidak ada (pakai prompt/confirm)
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

  // Tombol Cancel
  if(modalCancel) modalCancel.addEventListener('click', closeModal);

  // Tombol OK
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

  // Tutup modal klik di luar konten
  if(modal){
    modal.addEventListener('click', function(e){
      if(e.target === modal) closeModal();
    });
  }

  // Event delegation untuk semua .cta-link
  document.addEventListener('click', function(e){
    const anchor = e.target.closest('.cta-link');
    if(!anchor) return;
    e.preventDefault();

    const href = anchor.getAttribute('href') || '';

    // WA flow
    if(href.includes('wa.me')){
      openModal({
        title: "Request Produk via WhatsApp",
        message: "Masukkan Nama Produk dan Jumlah:",
        isWA: true,
        action: function(produk, jumlah){
          let waLink = href;

          // 1. Ganti placeholder jika ada
          if(waLink.includes("[NAMA PRODUK]") || waLink.includes("[JUMLAH]")){
            waLink = waLink.replace(/\[NAMA PRODUK\]/g, encodeURIComponent(produk))
                           .replace(/\[JUMLAH\]/g, encodeURIComponent(jumlah));
          } else {
            // 2. Tambahkan otomatis di akhir text param
            const extraText = encodeURIComponent(` Produk: ${produk} Jumlah: ${jumlah}`);
            if(waLink.includes('?text=')){
              waLink += extraText;
            } else {
              waLink += '?text=' + extraText;
            }
          }

          window.open(waLink, '_blank');
        }
      });
      return;
    }

    // Anchor in-page navigation
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

    // External link
    openModal({
      title: "Buka Link",
      message: "Apakah Anda ingin membuka link ini di tab baru?",
      isWA: false,
      action: function(){
        window.open(href,'_blank');
      }
    });

  }); // end delegation
})();