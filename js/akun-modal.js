document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // ELEMENTS MODAL AKUN
  // ============================
  const accountBackdrop = document.getElementById("account-backdrop");
  const accountModal = document.getElementById("account-modal");
  const navAccount = document.getElementById("nav-account");
  const accSaveBtn = document.getElementById("acc-save-btn");
  const accCloseBtn = document.getElementById("acc-close-btn");

  // ============================
  // ACCOUNT MODAL FUNCTIONS
  // ============================
  function openAccount() {
    if (!accountBackdrop || !accountModal) return;
    accountBackdrop.style.display = 'flex';
    const data = JSON.parse(localStorage.getItem('userData') || '{}');
    document.getElementById('acc-nama').value = data.nama || '';
    document.getElementById('acc-alamat').value = data.alamat || '';
    const accNoEl = document.getElementById('acc-no');
    if (accNoEl) accNoEl.value = data.noRumah || '';
    document.getElementById('acc-rt').value = data.rtrw || '';
    document.getElementById('acc-hp').value = data.hp || '';
    if (typeof bringModalToFront === "function") bringModalToFront(accountBackdrop, accountModal);
  }

  function closeAccount() {
    if (!accountBackdrop) return;
    accountBackdrop.style.display = 'none';
    if (typeof restoreNavInteraction === "function") restoreNavInteraction();
  }

  if (navAccount) {
    navAccount.addEventListener('click', (e) => {
      e.preventDefault();
      openAccount();
    });
  }

  if (accSaveBtn) {
    accSaveBtn.addEventListener('click', () => {
      const data = {
        nama: document.getElementById('acc-nama').value.trim(),
        alamat: document.getElementById('acc-alamat').value.trim(),
        noRumah: (document.getElementById('acc-no') && document.getElementById('acc-no').value.trim()) || '',
        rtrw: document.getElementById('acc-rt').value.trim(),
        hp: document.getElementById('acc-hp').value.trim()
      };
      if (!data.nama) {
        alert('Nama tidak boleh kosong!');
        return;
      }
      localStorage.setItem('userData', JSON.stringify(data));
      alert('Perubahan tersimpan!');
      closeAccount();
    });
  }

  if (accCloseBtn) accCloseBtn.addEventListener('click', closeAccount);

  if (accountBackdrop) {
    accountBackdrop.addEventListener('click', (e) => {
      if (e.target === accountBackdrop) closeAccount();
    });
  }

  // ============================
  // FOTO PROFIL
  // ============================
  const ppInput = document.getElementById("pp-input");
  const btnUbahPP = document.getElementById("btn-ubah-pp");
  const ppPreview = document.getElementById("pp-preview");

  if (btnUbahPP && ppInput) {
    btnUbahPP.addEventListener("click", () => ppInput.click());

    ppInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (img.width - size) / 2,
          (img.height - size) / 2,
          size,
          size,
          0,
          0,
          size,
          size
        );
        const croppedData = canvas.toDataURL("image/jpeg", 0.9);
        if (ppPreview) ppPreview.src = croppedData;
        localStorage.setItem("userPP", croppedData);
      };
    });

    const savedPP = localStorage.getItem("userPP");
    if (savedPP && ppPreview) ppPreview.src = savedPP;
  }

  // ============================
  // TAB SWITCH
  // ============================
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      tabContents.forEach(c => c.classList.remove("active"));
      const target = btn.getAttribute("data-tab");
      const targetContent = document.getElementById(target);

      if (targetContent) targetContent.classList.add("active");

      if (target === "tab-riwayat") loadRiwayat();
    });
  });

  // ============================
  // LOAD RIWAYAT & BUTTONS
  // ============================
  window.loadRiwayat = function() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");
  if (!wrap) return;

  if (r.length === 0) {
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }

  // Tombol hapus semua riwayat
  wrap.innerHTML = `
    <button 
      type="button"
      class="cta-link riwayat-clear-all"
      style="margin-bottom:10px;border:1px solid #d00;padding:6px;border-radius:6px;background:#ffe5e5">
      Hapus Semua Riwayat
    </button>
  `;

// Loop tiap order
wrap.innerHTML += r.map(order => `
  <div class="riwayat-item" style="margin-bottom:12px;padding:10px;border:1px solid #ddd;border-radius:6px">

    <table>
      <tr><td><i class="fa-solid fa-receipt"></i></td><td><strong>ID Pesanan: ${order.id}</strong></td></tr>
      <tr><td><i class="fa-solid fa-user"></i></td><td><strong>${order.nama || '-'}</strong></td></tr>
      <tr><td><i class="fa-solid fa-location-dot"></i></td><td><strong>${order.alamat || '-'}</strong></td></tr>
      <tr><td><i class="fa-solid fa-phone"></i></td><td><strong>${order.hp || '-'}</strong></td></tr>
    </table>

    <br>

    <table>
      <tr><td><i class="fa-solid fa-cart-shopping"></i></td><td><strong>Detail Pesanan:</strong></td></tr>
    </table>

    <!-- Bagian yang error & tidak memakai icon -->
    <ul style="margin:4px 0 8px 22px;padding:0;">
      ${order.items.map(it => {
        const harga = it.price || it.harga || 0;
        return `
          <li>
            ${it.qty} × ${it.name} — Rp ${formatRupiah(harga)}
          </li>
        `;
      }).join("")}
    </ul>

    <table>
      <tr>
        <td><i class="fa-solid fa-calculator"></i></td>
        <td><strong>Subtotal: Rp ${
          formatRupiah(
            order.items.reduce((t, it) => t + (it.price || it.harga || 0) * (it.qty || 1), 0)
          )
        }</strong></td>
      </tr>
      <tr><td><i class="fa-solid fa-truck"></i></td><td><strong>Ongkir: Rp ${formatRupiah(order.ongkir || 0)}</strong></td></tr>
      <tr><td><i class="fa-solid fa-wallet"></i></td><td><strong>Total: Rp ${formatRupiah(order.total)}</strong></td></tr>
      <tr><td><i class="fa-solid fa-calendar-day"></i></td><td><strong>${order.waktu || order.date || '-'}</strong></td></tr>
    </table>


      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button 
          type="button"
          class="cta-link riwayat-status"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #4caf50;border-radius:4px;background:#eaffea;">
          Cek Status
        </button>
        <button 
          type="button"
          class="cta-link riwayat-repeat"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #2196f3;border-radius:4px;background:#e7f3ff;">
          Ulangi
        </button>
        <button 
          type="button"
          class="cta-link riwayat-delete"
          data-id="${order.id}"
          style="padding:6px 10px;border:1px solid #aaa;border-radius:4px;background:#f7f7f7;">
          Hapus
        </button>
      </div>
    </div>
  `).join("");


};


  // Load riwayat saat pertama kali
  loadRiwayat();

});

// =========================
// Tombol Profil Sidebar
// =========================
const sidebarAccountBtn = document.getElementById("nav-accountk");
const navAccountBtn = document.getElementById("nav-account"); // tombol utama nav

if (sidebarAccountBtn && navAccountBtn) {
  sidebarAccountBtn.addEventListener("click", (e) => {
    e.preventDefault();
    navAccountBtn.click(); // panggil klik tombol nav utama
  });
}
