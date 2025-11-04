/* ===== Register via WhatsApp modal logic (B) ===== */
const registerBackdrop = document.getElementById('register-backdrop');
const btnRegisterWA = document.getElementById('btn-register-wa');
const btnRegistered = document.getElementById('btn-registered');
const registerHint = document.getElementById('register-hint');

/* WA number dan pesan otomatis (formal) */
const WA_NUMBER = '6285322882512'; // ganti kalau perlu
const WA_MESSAGE = encodeURIComponent(
  'Halo Warung Emung, saya ingin mendaftar sebagai pelanggan RT untuk belanja. Nama: Alamat / RT-RW:'
);

function isRegisteredThisSession(){
  try{
    return sessionStorage.getItem('warung_registered') === '1';
  }catch(e){
    return false;
  }
}
function setRegisteredThisSession(){
  try{ sessionStorage.setItem('warung_registered','1'); }catch(e){}
}
function showRegisterModal(){
  registerBackdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function hideRegisterModal(){
  registerBackdrop.style.display = 'none';
  document.body.style.overflow = '';
}
if(!isRegisteredThisSession()){ showRegisterModal(); }

btnRegisterWA.addEventListener('click', (e)=>{
  e.preventDefault();
  const url = 'https://wa.me/' + WA_NUMBER + '?text=' + WA_MESSAGE;
  window.open(url, '_blank');
  registerHint.textContent = 'Setelah mengirim pesan, kembali ke halaman ini lalu tekan "Saya sudah daftar".';
});

btnRegistered.addEventListener('click', (e)=>{
  e.preventDefault();
  setRegisteredThisSession();
  hideRegisterModal();
});

registerHint.addEventListener('click', (e)=>{
  e.preventDefault();
  alert('Klik "Daftar via WhatsApp" lalu kirim data: Nama dan Alamat/RT-RW. Setelah itu klik "Saya sudah daftar".');
});
