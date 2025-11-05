// pwa.js
// 1) Service Worker registration (di root, registrasikan ./sw.js)
// 2) beforeinstallprompt handling untuk tombol "Pasang di Layar Utama"

(function () {
  // register service worker saat halaman ter-load
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('Service Worker ter-registrasi:', reg.scope);
        })
        .catch(err => {
          console.error('Gagal registrasi Service Worker:', err);
        });
    });
  } else {
    console.warn('Service Worker tidak didukung di browser ini.');
  }

  // Instal prompt handling
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    // cegah prompt otomatis
    e.preventDefault();
    deferredPrompt = e;

    // tampilkan tombol install setelah halaman benar-benar load
    window.addEventListener('load', () => {
      if (installBtn) installBtn.style.display = 'block';
    });
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';
      if (!deferredPrompt) return;

      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        console.log('Hasil pilihan install:', choiceResult.outcome);
        // reset handler
        deferredPrompt = null;
      } catch (err) {
        console.error('Error saat memanggil prompt install:', err);
      }
    });
  }

  // optional: event ketika app terpasang
  window.addEventListener('appinstalled', (evt) => {
    console.log('Aplikasi terpasang (appinstalled):', evt);
    if (installBtn) installBtn.style.display = 'none';
  });

})();
