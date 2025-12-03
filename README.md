## Hak Cipta
� 2025 Atos. All rights reserved.
Kode dalam repository ini tidak boleh disalin, diubah, atau didistribusikan tanpa izin pemilik.


# **WarungEmung — Mini E-Commerce Berbasis HTML + JSON**

Praktis, hemat, dekat dengan pelanggan. Proyek ini prototipe e-commerce ringan untuk **warung/UMKM**, fokus:

* Kemudahan penggunaan
* Navigasi cepat
* Produk berbasis **JSON**
* Tanpa backend — cukup GitHub Pages / hosting statis

---

# **📌 Struktur Fitur & Navigasi (Update)**

## **1. Header & Floating Search**

* Logo + search bar + tombol **X clear** + menu utama dalam **satu baris**, **floating** (tidak scroll).
* **Search cerdas** dengan **autocomplete / teks sugesti**.
* Menu utama:

  * Troli / Cart
  * Profil & Riwayat
  * Toggle Dark Mode
  * Toggle notifikasi suara
  * Kustomisasi tampilan / tema
  * Ganti alamat pengiriman
  * Hapus storage / reset data
  * Tentang WarungEmung

---

## **2. Hero Section**

* Teks scroll pengumuman.
* Tombol **Request Stok Kustom**.
* Tombol WA / Cek Pesanan → memanggil **Modal Konfirmasi Global**.

---

## **3. Kategori Utama**

* Grid 2 baris, scroll horizontal kanan-kiri.
* Panah navigasi auto hide sesuai kebutuhan.
* Pilihan kategori → scroll otomatis ke **etalase kategori**.
* Produk diacak setiap load kategori.

---

## **4. Flash Sale**

* Produk muncul pada **waktu tertentu**.
* Deskripsi singkat & tombol **floating** ke section.
* Tombol auto hide setelah diklik.

---

## **5. Etalase Produk**

* Produk dari `produk.json`.
* **Urutan acak** per load & kategori.
* Setiap kartu produk:

  * Kontrol **Qty**
  * Tombol **Add Produk** → efek *ding* + toast + badge

---

## **6. Footer**

* Informasi kontak / alamat.
* Link bantuan / FAQ.
* Sosial media opsional.

---

# **📌 Modal Konfirmasi Global**

* Satu modal menangani banyak aksi:

| Aksi          | Keterangan                                               |
| ------------- | -------------------------------------------------------- |
| Cek Pesanan   | Menampilkan detail pesanan, ID pesanan, total, list item |
| Hapus Storage | Konfirmasi reset data lokal                              |
| Request Stok  | Mengirimkan request ke WA atau sistem backend (opsional) |
| Ubah Alamat   | Konfirmasi perubahan alamat                              |
| Lainnya       | Dapat dipakai untuk modal konfirmasi umum lainnya        |

* Semua modal ini memiliki tombol **Konfirmasi / Batalkan**.
* Data penting (misal pesanan) tersimpan di **localStorage** dan **riwayat**.

---

# **📌 Profil & Riwayat**

* Tab Profil:

  * Data alamat, foto profil
  * Scroll form alamat
  * Tombol **Simpan Perubahan**
* Tab Riwayat:

  * Menampilkan **riwayat checkout**
  * Setiap transaksi memiliki **ID Pesanan** unik
  * Tombol **Cek Pesanan → WA Template**

    * Template rapi berisi:

      * 🆔 ID Pesanan
      * 📅 Waktu Pemesanan
      * 🛒 Detail item (nama, qty, harga)
      * 💰 Total belanja

---

# **📌 Navigasi Utama**

| Tombol                | Fungsi                                            |
| --------------------- | ------------------------------------------------- |
| Home                  | Scroll ke atas halaman                            |
| Kategori              | Modal kategori (2 baris, scroll horizontal)       |
| Search                | Scroll ke input search + fokus                    |
| Profil                | Modal Profil & Riwayat                            |
| Cek Pesanan / WA Hero | Modal Konfirmasi Global → template WA             |
| Troli / Cart          | Modal daftar item, total, WA, Kosongkan Keranjang |

---

# **📌 Notifikasi & Efek**

* **Toast** → animasi modern + text-to-speech
* **Efek Suara** → *ding* saat Add Produk
* **FontAwesome Offline** → ikon tetap muncul tanpa internet

---

# **📌 Penyimpanan & Riwayat**

* **localStorage**:

  * Alamat pengguna
  * Riwayat checkout
  * Status Dark Mode / Tema
  * Produk di troli
* **ID Pesanan** unik dicatat setiap checkout
* Riwayat digunakan untuk template WA agar pelanggan bisa menyalin / mengirim pesanan lama

---

# **📌 Struktur Folder (Update)**

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
│   ├── ui.css
│   ├── flash.css
│   ├── popup-reg.css
│   ├── cart-modal.css
│   ├── cat-modal.css
│   ├── akun-modal.css
│   ├── qty-addcart.css
│   ├── nama-alamat.css
│   ├── search.css
│   ├── toast.css
│   ├── text-scrol.css
│   └── theme.css
│
├── js/
│   ├── sidebar.js
│   ├── search.js
│   ├── search-autocomplete.js
│   ├── cta-links.js
│   ├── cat-modal.js
│   ├── cart-modal.js
│   ├── akun-modal.js
│   ├── toast-audio.js
│   ├── register.js
│   ├── global-modal.js    <-- menangani semua konfirmasi
│   └── pwa.js
│
├── icons/
│   ├──
│
├── fondawesome/
│   ├──
└── data/
    ├── flash.json
    └── produk.json
```

---

# **Alur Modal Konfirmasi Global & Riwayat**

```
[Aksi Pengguna]
      |
      v
[Modal Konfirmasi Global]
      |
      +--> Cek Pesanan --> Simpan ke Riwayat --> Tombol WA Template
      +--> Hapus Storage --> Reset Data
      +--> Request Stok --> Kirim WA
      +--> Ubah Alamat --> Update localStorage
      +--> Aksi Lain --> Konfirmasi/Batal
```

---

# **Diagram Alur & Navigasi WarungEmung**

```
+---------------------------------------------------+
|                   Header (Floating)             |
|  Logo  | Search [X Clear] | Menu [≡]            |
|  (selalu di atas, tidak scroll)                 |
+---------------------------------------------------+
          |               |                  |
          |               |                  |
          v               v                  v
   Search Autocomplete   Menu Modal        Troli / Cart Modal
   - Text suggest        - Profil & Riwayat
   - Scroll ke etalase   - Dark Mode toggle
                         - Sound toggle
                         - Tema kustom
                         - Ganti alamat
                         - Hapus storage
                         - Tentang
                         
                         
+---------------------------------------------------+
|                  Hero Section                    |
|  - Teks scroll pengumuman                        |
|  - Tombol Request Stok Kustom                    |
|  - Tombol WA / Cek Pesanan                       |
+---------------------------------------------------+
          |
          v
+---------------------------------------------------+
|                  Kategori Grid                   |
|  - 2 baris, scroll horizontal                    |
|  - Panah kanan/kiri (auto hide jika tidak perlu) |
+---------------------------------------------------+
          |
          v
+---------------------------------------------------+
|                 Flash Sale Section               |
|  - Produk muncul pada waktu tertentu            |
|  - Deskripsi singkat                             |
|  - Tombol floating ke section (pojok kanan bawah)|
|  - Tombol auto hide setelah diklik               |
+---------------------------------------------------+
          |
          v
+---------------------------------------------------+
|                  Etalase Produk                  |
|  - Produk dari produk.json                        |
|  - Urutan acak per load & per kategori           |
|  - Setiap kartu: Qty + Add Produk                |
|  - Add Produk: efek ding + toast + badge         |
+---------------------------------------------------+
          |
          v
+---------------------------------------------------+
|                       Footer                      |
|  - Kontak / alamat                               |
|  - Link bantuan / FAQ                             |
|  - Sosial media (opsional)                        |
+---------------------------------------------------+

```

# **Interaksi Modal & Navigasi Utama**

```
[Home Button] -----------------------> Scroll ke atas
[Kategori Button] ------------------> Modal Kategori (grid 2 baris)
[Search Button] --------------------> Scroll ke input search + fokus
[Profil Button] --------------------> Modal Profil & Riwayat
[Cek Pesanan / WA Hero Button] -----> Modal tunggal Cek Pesanan / Request Stok
[Troli Button] ---------------------> Modal Cart (list produk, total, WA, Kosongkan)
```

# **Notasi Tambahan**

* **Floating search**: tetap di atas saat scroll.
* **Modal**: menutup otomatis jika klik luar, X, atau tombol kembali.
* **Panah kategori & tombol flash sale**: muncul/hilang otomatis sesuai scroll atau klik.
* **Toast**: muncul saat Add Produk atau aksi penting lainnya.
* **Efek suara**: *ding* saat Add Produk.

