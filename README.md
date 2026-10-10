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

## Deployment dengan Docker

Persyaratan: Docker Engine atau platform server yang mendukung container Docker. Dari root proyek, bangun image:

```powershell
Copy-Item .env.example .env
```

Edit `.env` untuk mengatur nama pengguna dan password admin. Ganti nilai contoh dengan kredensial unik dan kuat; jangan commit atau membagikan file `.env`. File tersebut sudah dikecualikan dari Git dan Docker build context. Di server, gunakan secret manager atau panel secrets platform jika tersedia.

```powershell
docker compose up -d --build
```

Compose membangun dan menjalankan aplikasi pada port `8080`, lalu memasang volume persisten `main-active-data` ke `/app/App_Data`. Untuk menghentikan container tanpa menghapus konten CMS, jalankan `docker compose down` (jangan tambahkan `-v`). Untuk produksi, arahkan domain dan HTTPS melalui reverse proxy atau fitur TLS dari platform hosting.

Volume Docker `main-active-data` menyimpan `App_Data/site-content.json` agar data CMS tetap ada saat container diganti atau image diperbarui. Backup volume secara berkala dan pindahkan atau pulihkan file tersebut saat migrasi server. Volume tetap berada di disk server yang sama; volume bukan pengganti backup dan tidak membagikan data antar-host.

### Railway

Pasang volume service pada path persis `/app/App_Data`. Image berjalan dengan UID non-root demi keamanan; Railway mendokumentasikan bahwa volume dapat menimbulkan masalah izin pada image non-root. Jika penyimpanan CMS gagal dengan `UnauthorizedAccessException` atau `Permission denied`, tambahkan variable service `RAILWAY_RUN_UID=0` di Railway lalu redeploy. Ini adalah workaround khusus Railway untuk menjalankan container dengan UID yang dapat menulis ke volume. Gunakan hanya bila diperlukan dan tinjau implikasi keamanan untuk deployment Anda.

## CMS dan penyimpanan

Dashboard `/admin.html` dapat mengubah semua teks landing page, termasuk empat running text terpisah, navigasi, bagian hero, katalog, cerita, ajakan, footer, dan label aksesibilitas. Ticker berjalan terus ke kiri dengan lebar rangkaian yang menyesuaikan viewport agar loop tidak menyisakan ruang kosong. Admin juga dapat menambah, mengganti, dan menghapus hingga 12 banner slide; setiap banner memiliki URL gambar, teks alternatif, serta URL tujuan opsional. Konten lama tanpa banner mendapat satu slide awal menggunakan gambar hero, yang dapat diganti atau dihapus admin. Banner tampil di antara ticker dan katalog dengan navigasi slide dan autoplay yang berhenti saat diarahkan atau difokuskan. CMS juga mengelola foto hero, URL logo, tautan Instagram/toko, serta produk, harga, foto, URL halaman produk, kategori, status, badge, dan deskripsi. Jarak antar-item running text diatur konsisten oleh desain, bukan digabung ke dalam teks yang diinput. Logo brand yang diatur melalui CMS dipakai pada landing page, tab browser, sidebar CMS, dan halaman login. Tautan gambar dan tombol beli pada setiap kartu katalog membuka URL produk masing-masing. Perubahan diterbitkan langsung ke landing page.

Konten awal ditampilkan dari data contoh di aplikasi. Setelah perubahan pertama disimpan, konten persisten tersimpan pada `App_Data/site-content.json` di folder aplikasi. Pastikan folder tersebut dapat ditulis oleh proses aplikasi dan ikutkan dalam strategi backup deployment. Penyimpanan file ini sesuai untuk satu instance aplikasi; gunakan database bersama jika aplikasi dijalankan dalam beberapa instance.

API publik: `GET /api/content`. Endpoint admin: `POST /api/admin/login`, `POST /api/admin/logout`, `GET /api/admin/content`, dan `PUT /api/admin/content`. OpenAPI tersedia pada `/openapi/v1.json` saat Development.
