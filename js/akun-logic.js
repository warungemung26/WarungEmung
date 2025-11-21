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


