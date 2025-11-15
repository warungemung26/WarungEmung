# WarungEmung
Praktis, hemat, dekat



# **📌 Fitur & Informasi Versi (Version Info)**

## **🟦 Fitur Utama**

### **1. Popup Pendaftaran Alamat (First-Open Popup)**

Popup otomatis muncul saat halaman dibuka pertama kali.
Fungsinya untuk menuntun pengguna mendaftarkan alamat sebelum mulai berbelanja.

### **2. Filter & Pencarian Cerdas (Smart Search)**

* Pencarian selalu dilakukan pada **semua kategori** (ALL), tidak peduli pengguna sedang berada di kategori apa.
* Setelah tombol *Search* atau *Selesai* ditekan, halaman akan **scroll otomatis ke bagian etalase produk** tempat hasil pencarian berada.

### **3. Navigasi Kategori**

* Saat pengguna memilih kategori, halaman akan **scroll otomatis ke etalase** bagian kategori tersebut.
* Modal kategori akan **menutup otomatis** setelah kategori dipilih.
* Modal juga bisa ditutup melalui tombol **X**, klik area luar modal, atau dengan menekan lagi tombol kategori pada navigasi.

### **4. Tombol Navigasi Utama**

a. **Home**
→ Scroll otomatis kembali ke bagian atas halaman.

b. **Kategori**
→ Membuka modal pemilihan kategori.
→ Modal akan menutup otomatis jika kategori dipilih.

c. **Search**
→ Scroll otomatis ke input pencarian dan fokus ke teks pencarian.

d. **Cek Pesanan (Check Out Preview)**
→ Membuka modal review pesanan.
→ Pengguna diberi pilihan **Lanjutkan** atau **Batalkan**, sehingga tidak langsung diarahkan ke WhatsApp.

e. **Troli (Cart)**
→ Membuka modal keranjang belanja.
→ Modal tertutup ketika:
- Tombol *Kosongkan Keranjang* ditekan
- Tombol *Pesan via WhatsApp* ditekan
- Tombol troli diklik kembali

### **5. Sistem Notifikasi (Toast)**

* Toast modern dengan animasi.
* Memiliki fitur **audio pembaca text** untuk aksesibilitas.

### **6. Efek Suara**

* Efek *ding* diputar setiap kali pengguna menekan **Add Produk**.

### **7. FontAwesome Offline**

* Ikon menggunakan **FontAwesome offline** sehingga tetap tampil tanpa koneksi internet.

### **8. Menu Bantuan / Pusat Informasi**

* Terdapat menu menuju halaman bantuan pelanggan, FAQ, dan informasi lainnya.

### **9. Produk Dimuat dari File JSON Eksternal**

* Data produk diambil dari `produk.json` sehingga mudah diperbarui tanpa mengubah HTML.

### **10. Kontrol Produk**

* Setiap kartu produk memiliki kontrol **Qty + tombol Add**.

---

## **📁 Struktur Folder (Direkomendasikan untuk Repo Ini)**

```
WarungEmung/
│
├── index.html
├── README.md
│
├── assets/
│   ├── img/
│   │   ├── logo/
│   │   └── produk/
│   ├── icon/
│   └── audio/
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── main.js
│   ├── cart.js
│   ├── modal.js
│   ├── search.js
│   ├── kategori.js
│   └── utils.js
│
└── data/
    └── produk.json
```

> Struktur di atas bisa kamu sesuaikan dengan format proyekmu, tapi secara umum ini yang paling bersih dan mudah dipahami.

---

## **⚠️ Catatan Masalah (Bug Diketahui)**

### **Tombol `#open-cart` Masih Muncul di Bawah Hero**

* Tombol ini sebenarnya **tidak dibutuhkan lagi** karena seluruh kontrol troli sudah dipindahkan ke navigasi utama.
* Namun ketika tombol dihapus, beberapa fungsi JS masih memanggil ID `open-cart`, sehingga modal keranjang gagal terbuka.

### **Rencana Perbaikan**

* Audit seluruh file JS untuk menemukan bagian yang masih melakukan:

  ```js
  document.getElementById("open-cart")
  ```
* Ganti pemicu modal cart ke tombol nav troli yang baru.
* Pastikan event listener lama tidak konflik dengan event listener baru.
