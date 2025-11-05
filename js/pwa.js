let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'block';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  document.getElementById('installBtn').style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt = null;
});
