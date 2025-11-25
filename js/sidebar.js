document.addEventListener("DOMContentLoaded", () => {

  // ================= SIDEBAR =================
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");

  // Tombol buka sidebar (misal menu-btn)
  const menuBtn = document.getElementById("menu-btn");
  if(menuBtn){
    menuBtn.addEventListener("click", () => sidebar.classList.add("show"));
  }

  // Close sidebar
  if(closeBtn) closeBtn.addEventListener("click", () => sidebar.classList.remove("show"));
  if(sidebarBackdrop) sidebarBackdrop.addEventListener("click", () => sidebar.classList.remove("show"));

  // ================= MODE GELAP =================
  const darkToggle = document.getElementById("dark-toggle");
  let darkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
  if(darkToggle) darkToggle.checked = darkMode;
  document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "default");

  if(darkToggle){
    darkToggle.addEventListener("change", () => {
      darkMode = darkToggle.checked;
      localStorage.setItem("darkMode", darkMode);
      document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "default");
    });
  }

  // ================= TEMA WARNA =================
  const themeSelect = document.getElementById("theme-select");
  let theme = localStorage.getItem("theme") || "default";
  if(themeSelect) themeSelect.value = theme;
  document.documentElement.setAttribute("data-theme", theme);

  if(themeSelect){
    themeSelect.addEventListener("change", () => {
      theme = themeSelect.value;
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    });
  }

  // ================= TOGGLE SUARA / TOAST =================
  const toastToggle = document.getElementById("toast-toggle");
  let toastEnabled = JSON.parse(localStorage.getItem("toastEnabled") || "true");
  if(toastToggle) toastToggle.checked = toastEnabled;

  if(toastToggle){
    toastToggle.addEventListener("change", () => {
      toastEnabled = toastToggle.checked;
      localStorage.setItem("toastEnabled", toastEnabled);
    });
  }

  // ================= AUDIO =================
  const audioDing = new Audio('sounds/ding.mp3');
  audioDing.preload = 'auto';
  const fallbackSounds = { success: 'sounds/pelayan_default.mp3' };

  // ================= SHOW TOAST =================
  const toastEl = document.getElementById("toast"); // pastikan ada <div id="toast"></div>
  const originalShowToast = window.showToast || function(){};

  window.showToast = function(msg, options = {askFollowUp:false, playDing:false}){
    if(!toastEnabled){
      if(toastEl){
        toastEl.textContent = msg;
        toastEl.style.opacity = '1';
        toastEl.style.bottom = '80px';
        setTimeout(()=>{
          toastEl.style.opacity='0';
          toastEl.style.bottom='20px';
        }, 2500);
      }
      return;
    }

    // Jalankan showToast asli (TTS + ding)
    const {askFollowUp, playDing} = options;
    if(toastEl){
      toastEl.textContent = msg;
      toastEl.style.opacity = '1';
      toastEl.style.bottom = '80px';
    }

    if(playDing) audioDing.play().catch(()=>{});

    if('speechSynthesis' in window){
      try { speechSynthesis.cancel(); } catch(e){}
      let voices = speechSynthesis.getVoices();
      if(!voices.length){
        speechSynthesis.getVoices();
        setTimeout(()=>voices = speechSynthesis.getVoices(),100);
      }
      const voice = voices.find(v=>v.lang==='id-ID'||v.lang.startsWith('id')) || voices.find(v=>v.lang.startsWith('en')) || null;
      const utter1 = new SpeechSynthesisUtterance(msg);
      utter1.lang = 'id-ID';
      utter1.rate = 1.0; utter1.pitch = 1.0; utter1.volume = 1.0;
      if(voice) utter1.voice = voice;
      speechSynthesis.speak(utter1);

      if(askFollowUp){
        const utter2 = new SpeechSynthesisUtterance('Mau tambah yang lain?');
        utter2.lang = 'id-ID';
        utter2.rate = 1.05; utter2.pitch = 1.25; utter2.volume = 1.0;
        if(voice) utter2.voice = voice;
        setTimeout(()=>speechSynthesis.speak(utter2),400);
      }
    } else {
      const a = new Audio(fallbackSounds.success);
      a.play().catch(()=>{});
    }

    if(toastEl){
      setTimeout(()=>{
        toastEl.style.opacity='0';
        toastEl.style.bottom='20px';
      }, 2500);
    }
  }

  // ================= AKUN / PROFIL =================
  const navAccount = document.getElementById("nav-account");
  const sidebarAccountBtn = document.getElementById("nav-accountk");
  if(sidebarAccountBtn && navAccount){
    sidebarAccountBtn.addEventListener("click", () => navAccount.click());
  }

  // ================= RESET DATA =================
  const resetDataBtn = document.getElementById("reset-data");
  if(resetDataBtn){
    resetDataBtn.addEventListener("click", () => {
      if(!confirm("Yakin ingin reset semua data lokal?")) return;
      localStorage.clear();
      location.reload();
    });
  }

});
