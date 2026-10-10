# Main Active — Landing Page & CMS

Website brand apparel olahraga Main Active dengan katalog produk interaktif dan CMS admin.

## Menjalankan aplikasi

Persyaratan: .NET 10 SDK.

```powershell
$env:Admin__Username = "admin"
$env:Admin__Password = "ganti-dengan-password-kuat"
dotnet run
```

Buka URL yang muncul di terminal untuk landing page. CMS tersedia di `/admin.html`. Ganti password contoh dengan rahasia yang kuat; jangan simpan kredensial produksi di file konfigurasi atau source control. Login memakai cookie HttpOnly dengan masa sesi terbatas. Batasi aplikasi produksi ke HTTPS.

## CMS dan penyimpanan

Dashboard `/admin.html` dapat mengubah semua teks landing page, termasuk empat running text terpisah, navigasi, bagian hero, katalog, cerita, ajakan, footer, dan label aksesibilitas. Ticker berjalan terus ke kiri dengan lebar rangkaian yang menyesuaikan viewport agar loop tidak menyisakan ruang kosong. Admin juga dapat menambah, mengganti, dan menghapus hingga 12 banner slide; setiap banner memiliki URL gambar, teks alternatif, serta URL tujuan opsional. Konten lama tanpa banner mendapat satu slide awal menggunakan gambar hero, yang dapat diganti atau dihapus admin. Banner tampil di antara ticker dan katalog dengan navigasi slide dan autoplay yang berhenti saat diarahkan atau difokuskan. CMS juga mengelola foto hero, URL logo, tautan Instagram/toko, serta produk, harga, foto, URL halaman produk, kategori, status, badge, dan deskripsi. Jarak antar-item running text diatur konsisten oleh desain, bukan digabung ke dalam teks yang diinput. Logo brand dipakai pada landing page, sidebar CMS, dan halaman login. Tautan gambar dan tombol beli pada setiap kartu katalog membuka URL produk masing-masing. Perubahan diterbitkan langsung ke landing page.

Konten awal ditampilkan dari data contoh di aplikasi. Setelah perubahan pertama disimpan, konten persisten tersimpan pada `App_Data/site-content.json` di folder aplikasi. Pastikan folder tersebut dapat ditulis oleh proses aplikasi dan ikutkan dalam strategi backup deployment. Penyimpanan file ini sesuai untuk satu instance aplikasi; gunakan database bersama jika aplikasi dijalankan dalam beberapa instance.

API publik: `GET /api/content`. Endpoint admin: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/content`, dan `PUT /api/admin/content`. OpenAPI tersedia pada `/openapi/v1.json` saat Development.
