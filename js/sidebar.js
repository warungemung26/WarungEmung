/*!
 * Copyright (c) 2025, Atos
 * All rights reserved.
 * Unauthorized copying, modification, or distribution of this file is strictly prohibited.
 */

document.addEventListener("DOMContentLoaded", () => {

  // ================= SIDEBAR =================
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-sidebar");
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const menuBtn = document.getElementById("menu-btn");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.add("show");
      if (sidebarBackdrop) sidebarBackdrop.classList.add("show");
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () => {
      sidebar.classList.remove("show");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("show");
    });
  }

  if (sidebarBackdrop && sidebar) {
    sidebarBackdrop.addEventListener("click", () => {
      sidebar.classList.remove("show");
      sidebarBackdrop.classList.remove("show");
    });
  }

  // ================= THEME & DARK MODE (FIXED) =================
  const darkToggle  = document.getElementById("dark-toggle");
  const themeSelect = document.getElementById("theme-select");

  let darkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
  let theme    = localStorage.getItem("theme") || "default";

  if (darkToggle)  darkToggle.checked  = darkMode;
  if (themeSelect) themeSelect.value   = theme;

  function applyTheme() {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : theme
    );
  }

  // apply saat load
  applyTheme();

  if (darkToggle) {
    darkToggle.addEventListener("change", () => {
      darkMode = darkToggle.checked;
      localStorage.setItem("darkMode", darkMode);
      applyTheme();
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener("change", () => {
      theme = themeSelect.value;
      localStorage.setItem("theme", theme);
      if (!darkMode) applyTheme();
    });
  }

  // ================= TOGGLE SUARA / TOAST =================
  const toastToggle = document.getElementById("toast-toggle");
  let toastEnabled = JSON.parse(localStorage.getItem("toastEnabled") || "true");

  if (toastToggle) toastToggle.checked = toastEnabled;

  if (toastToggle) {
    toastToggle.addEventListener("change", () => {
      toastEnabled = toastToggle.checked;
      localStorage.setItem("toastEnabled", toastEnabled);
    });
  }

  // ================= AUDIO =================
  const audioDing = new Audio("sounds/ding.mp3");
  audioDing.preload = "auto";
  const fallbackSounds = { success: "sounds/pelayan_default.mp3" };

  // ================= SHOW TOAST =================
  const toastEl = document.getElementById("toast");

  window.showToast = function (msg, options = { askFollowUp: false, playDing: false }) {

    if (!toastEl) return;

    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    toastEl.style.bottom = "80px";

    if (toastEnabled && options.playDing) {
      audioDing.play().catch(() => {});
    }

    if (toastEnabled && "speechSynthesis" in window) {
      try { speechSynthesis.cancel(); } catch(e){}
      const utter = new SpeechSynthesisUtterance(msg);
      utter.lang = "id-ID";
      speechSynthesis.speak(utter);
    }

    setTimeout(() => {
      toastEl.style.opacity = "0";
      toastEl.style.bottom = "20px";
    }, 2500);
  };

  // ================= AKUN / PROFIL =================
  const navAccount = document.getElementById("nav-account");
  const sidebarAccountBtn = document.getElementById("nav-accountk");

  if (sidebarAccountBtn && navAccount) {
    sidebarAccountBtn.addEventListener("click", () => navAccount.click());
  }

});
