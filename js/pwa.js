let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// Saat browser mendeteksi bisa install
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // munculkan tombol
  installBtn.style.display = "flex";
});

// Jika user klik tombol
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  installBtn.style.display = "none";

  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;

  if (result.outcome === "accepted") {
    console.log("User accepted install");
  } else {
    console.log("User dismissed install");
  }

  deferredPrompt = null;
});

// Sembunyikan tombol kalau sudah terinstall
window.addEventListener("appinstalled", () => {
  installBtn.style.display = "none";
  deferredPrompt = null;
});
