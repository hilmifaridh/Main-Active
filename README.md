# Base Project Website — ASP.NET Core

Fondasi website client yang menggabungkan API ASP.NET Core dengan frontend responsif berbasis HTML, CSS, dan JavaScript. Konten dan identitas setiap client bisa diganti lewat konfigurasi tanpa mengubah kode tampilan.

## Menjalankan project

Persyaratan: .NET 10 SDK.

```powershell
dotnet run
```

Buka alamat HTTP yang ditampilkan di terminal untuk melihat website.

## Mengadaptasi untuk client baru

Edit bagian `Site` di `appsettings.json` untuk mengganti:

- Nama brand, inisial logo, eyebrow, headline, dan deskripsi.
- Alamat email, nomor telepon, dan lokasi.
- Warna utama dan aksen (format hex enam digit, contoh `#183A37`).
- Daftar layanan, karya, dan statistik.

Website mengambil pengaturan dari `GET /api/site-config`. Endpoint `GET /api/health` menyediakan pemeriksaan status sederhana. Struktur halaman dan styling ada di `wwwroot`; pengaturan yang sama digunakan untuk semua client, sementara kontennya tinggal disesuaikan.

Nilai pada `appsettings.json` adalah konten contoh; ganti dengan informasi client sebelum deployment. Untuk deployment, simpan nilai yang sensitif di environment variables atau secret manager, bukan di file konfigurasi yang masuk source control.
