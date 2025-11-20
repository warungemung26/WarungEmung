# **WarungEmung — Mini E-Commerce Sederhana Berbasis HTML + JSON**

Proyek ini adalah prototipe e-commerce ringan untuk warung/UMKM dengan fokus pada **kemudahan penggunaan, navigasi cepat, dan pengelolaan produk berbasis file JSON**.
Seluruh fitur berjalan **tanpa backend**, cukup dijalankan melalui GitHub Pages atau hosting statis lain.

---

# **📌 Fitur & Informasi Versi**

## **🟦 1. Popup Pendaftaran Alamat (Pertama Kali Dibuka)**

* Popup otomatis muncul saat kunjungan pertama untuk meminta pengguna memasukkan alamat sebelum berbelanja.
* Pilihan: **Daftar Sekarang** atau **Nanti**.
* Data tersimpan di **localStorage**, dapat diubah di menu profil kapan saja.

---

## **🟦 2. Filter & Pencarian Cerdas (Smart Search)**

* Pencarian dilakukan pada **semua kategori (ALL)**.
* Setelah menekan **Search** atau **Selesai**, halaman akan **scroll otomatis ke etalase produk**.
* Pencarian tetap berfungsi meski pengguna berada di kategori manapun.

---

## **🟦 3. Navigasi Kategori**

* Memilih kategori otomatis **scroll ke etalase kategori**.
* Modal kategori tertutup otomatis setelah pilihan.
* Modal dapat ditutup dengan:

  * Klik tombol **X**
  * Klik area luar modal
  * Klik tombol **Kategori** di navbar kembali

---

## **🟦 4. Tombol Navigasi Utama**

### **a. Home**

* Scroll otomatis ke bagian paling atas halaman.

### **b. Kategori**

* Membuka modal pemilihan kategori.
* Modal menutup otomatis setelah kategori dipilih atau dengan cara lain (X / klik luar / klik tombol kembali).

### **c. Search**

* Scroll otomatis ke input pencarian.
* Input langsung fokus untuk mengetik.

### **d. Profil**

* Terdapat dua tab: **Profil** & **Riwayat**.
* Bisa menambahkan foto profil.
* Form alamat dapat discroll.
* Tombol statis **Tutup** & **Simpan Perubahan** selalu tersedia di bawah.

### **e. Cek Pesanan (Order Check)**

* Membuka modal review pesanan.
* Pilihan: **Lanjutkan** atau **Batalkan**.
* Tidak otomatis diarahkan ke WhatsApp.

### **f. Troli (Cart)**

* Modal troli terbuka hanya jika ada item.
* Badge angka muncul di icon troli saat produk ditambahkan.
* Menampilkan daftar item, harga per item, dan total belanja.
* Tombol:

  * **Pesan via WhatsApp** (mengambil alamat & estimasi belanja otomatis)
  * **Kosongkan Keranjang**
* Modal tertutup saat:

  * Tombol **Kosongkan Keranjang** ditekan
  * Tombol **Pesan via WhatsApp** digunakan
  * Tombol troli ditekan kembali

---

## **🟦 5. Notifikasi Toast**

* Animasi modern.
* Mendukung **text-to-speech sederhana** untuk aksesibilitas.

---

## **🟦 6. Efek Suara**

* Efek *ding* saat menekan **Add Produk**.

---

## **🟦 7. FontAwesome Offline**

* Semua ikon menggunakan pustaka FontAwesome offline.

---

## **🟦 8. Menu Bantuan / Pusat Informasi**

* Menu menuju halaman bantuan pelanggan, FAQ, informasi toko, atau halaman lain sesuai kebutuhan.

---

## **🟦 9. Produk Dimuat dari File JSON Eksternal**

* Semua data produk berada di `produk.json`.
* Memudahkan update produk tanpa menyentuh file HTML.

---

## **🟦 10. Kontrol Produk di Setiap Kartu**

* Kontrol **Qty** tersedia.
* Tombol **Add Produk** menambah item ke keranjang dengan toast & badge notifikasi.

---

# **📁 Struktur Folder Rekomendasi**

```
WarungEmung/
│
├── index.html
├── README.md
├── manifest.json
│
├── assets/
│   ├── img/
│   │   ├── logo/
│   │   └── produk/
│   ├── icon/
│   └── audio/
│
├── css/
│   ├── ui.css
│   ├── popup-reg.css
│   ├── qty-addcart.css
│   ├── modal-cart.css
│   ├── modal-cat.css
│   ├── modal-akun.css
│   ├── nama-alamat.css
│   ├── toast.css
│   ├── text-scroll.css
│   └── search.css
│
├── js/
│   ├── data-loader.js
│   ├── main.js
│   ├── search.js
│   ├── modal-cat.js
│   ├── toast-audio.js
│   ├── modal-cart.js
│   ├── register.js
│   ├── modal-akun-logic.js
│   ├── modal-akun.js
│   └── pwa.js
│
├── fontawesome/
│   └── (file ikon offline)
└── data/
    └── produk.json
```

---

# **⚠️ Bug & Masalah Diketahui**

## **Tombol #open-cart**

* Tombol ini seharusnya **tidak dibutuhkan**, fungsi troli sudah di navbar.
* Namun beberapa fungsi JS masih memanggil ID lama.

### **Gejala Bug**

* Menekan **Kosongkan Keranjang**:

  * ✔️ Item di JS / localStorage kosong
  * ❌ UI tidak ikut reset, modal tidak menutup
* Menutup modal dengan tombol navbar cart → muncul **toast** “keranjang masih kosong”
* Setelah menambahkan item baru → bug muncul lagi saat Kosongkan Keranjang berikutnya

### **Penyebab Diduga**

1. Event listener masih mengikat tombol `#open-cart`.
2. Fungsi `renderCart()` atau `updateCartUI()` tidak dipanggil saat reset.
3. Modal tidak menerima trigger close karena event terhubung ke ID lama.

### **Dampak**

* Modal bisa **stuck open** ketika keranjang kosong.
* Navigasi tombol cart memunculkan toast alih-alih menutup modal.

### **Rencana Perbaikan**

* Ganti semua pemanggilan `document.getElementById("open-cart")` ke tombol navbar cart terbaru.
* Buat fungsi tunggal untuk membuka modal cart:

```js
function showCartModal() { ... }
```

* Pastikan fungsi dipanggil setelah **Kosongkan Keranjang**:

```js
renderCartItems();
updateCartUI();
closeCartModal();
```

* Audit event listener ganda agar tidak terjadi duplikasi.

---

# **📌 Rencana Pengembangan (Opsional)**

* Halaman bantuan lebih lengkap
* Mode offline (PWA)
* Mode gelap / terang
* Validasi alamat lebih baik
* Optimasi gambar produk