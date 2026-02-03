/*!
 * ============================================================
 * FILE: splash.js
 * PROJECT: Tokopilot / Atos Frontend System
 * AUTHOR: Atos
 * COPYRIGHT (c) 2025 - All Rights Reserved
 * ============================================================
*/


(function(){
  const splash = document.getElementById("splash-screen");
  const bar = document.getElementById("splash-bar-fill");
  const percent = document.getElementById("splash-percent");

  if (!splash) return;

  // ==== DETEKSI NAVIGASI ====
  const navEntry = performance.getEntriesByType("navigation")[0];
  const navType = navEntry ? navEntry.type : "navigate";

  const legacyReload =
    performance.navigation &&
    performance.navigation.type === performance.navigation.TYPE_RELOAD;

  const alreadyShown = sessionStorage.getItem("splashShown");

  // ==== KONDISI SKIP ====
if (!splash) return;

if (sessionStorage.getItem("WE_SPLASH_DONE")) {
  splash.remove();
  return;
}

sessionStorage.setItem("WE_SPLASH_DONE", "1");


  let p = 0;

  const fakeLoading = setInterval(() => {
    p += Math.random() * 12;
    if (p >= 100) {
      p = 100;
      clearInterval(fakeLoading);
    }
    bar.style.width = p + "%";
    percent.textContent = Math.floor(p) + "%";
  }, 120);

  window.addEventListener("load", () => {
    const finish = setInterval(() => {
      if (p < 90) return;

      p = 100;
      bar.style.width = "100%";
      percent.textContent = "100%";

      clearInterval(finish);

      setTimeout(() => {
        splash.classList.add("hide");
        setTimeout(() => splash.remove(), 500);
      }, 300);
    }, 100);
  });
})();




window.addEventListener("pageshow", e => {
  if (e.persisted) {
    const splash = document.getElementById("splash-screen");
    if (splash) splash.remove();
  }
});
