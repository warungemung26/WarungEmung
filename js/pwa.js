// PWA tambahan: tampilkan prompt install
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('✅ PWA siap diinstal');
});
