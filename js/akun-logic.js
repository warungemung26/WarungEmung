/* ===== ACCOUNT MODAL LOGIC ===== */

const accBackdrop = document.getElementById("account-backdrop");
const navAccount = document.getElementById("nav-account");

const accNama = document.getElementById("acc-nama");
const accAlamat = document.getElementById("acc-alamat");
const accRT = document.getElementById("acc-rt");
const accHP = document.getElementById("acc-hp");

const accSave = document.getElementById("acc-save-btn");
const accClose = document.getElementById("acc-close-btn");

function loadAccountData() {
  try {
    const data = JSON.parse(localStorage.getItem("alamatUser"));
    if (!data) return;

    accNama.value = data.nama || "";
    accAlamat.value = data.alamat || "";
    accRT.value = data.rt || "";
    accHP.value = data.hp || "";

  } catch (e) {}
}

function saveAccountData() {
  const updated = {
    nama: accNama.value.trim(),
    alamat: accAlamat.value.trim(),
    rt: accRT.value.trim(),
    hp: accHP.value.trim()
  };

  if (!updated.nama || !updated.alamat || !updated.rt) {
    alert("Nama, Alamat, dan RT/RW wajib diisi");
    return;
  }

  localStorage.setItem("alamatUser", JSON.stringify(updated));
  alert("Data akun diperbarui");
  hideAccountModal();
}

function showAccountModal() {
  loadAccountData();
  accBackdrop.style.display = "flex";
}

function hideAccountModal() {
  accBackdrop.style.display = "none";
}

/* buka modal ketika klik nav */
navAccount.addEventListener("click", () => {
  showAccountModal();
});

/* tombol action */
accSave.addEventListener("click", saveAccountData);
accClose.addEventListener("click", hideAccountModal);

/* tutup jika klik luar modal */
accBackdrop.addEventListener("click", (e) => {
  if (e.target === accBackdrop) hideAccountModal();
});

// Variabel modal
const accountBackdrop = document.getElementById('account-backdrop');
const accountModal = document.getElementById('account-modal');
const accSaveBtn = document.getElementById('acc-save-btn');
const accCloseBtn = document.getElementById('acc-close-btn');

// Tab switch
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Hapus active dari semua tombol
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Hapus active dari semua konten
    tabContents.forEach(c => c.classList.remove("active"));

    // Tambahkan active ke konten target
    const target = btn.getAttribute("data-tab");
    const targetContent = document.getElementById(target);
    if(targetContent) targetContent.classList.add("active");

    // Load riwayat jika tab Riwayat
    if(target === "tab-riwayat") loadRiwayat();
  });
});

// Fungsi load riwayat
function loadRiwayat() {
  const wrap = document.getElementById("riwayat-list");
  const r = JSON.parse(localStorage.getItem("riwayat") || "[]");

  if(r.length === 0){
    wrap.innerHTML = "<p style='opacity:0.6'>Belum ada riwayat belanja.</p>";
    return;
  }

  wrap.innerHTML = r.map(order => `
    <div class="riwayat-item">
      <strong>ID Pesanan: ${order.id}</strong><br>
      <ul>
        ${order.items.map(it => `<li>${it.qty} x ${it.name} - Rp ${it.subtotal}</li>`).join("")}
      </ul>
      <strong>Total: Rp ${order.total}</strong><br>
      Waktu: ${order.waktu || order.date || '-'}
    </div>
  `).join("");
}
