# QR Credentials Sertifikat — LKP PalComTech Palembang

Aplikasi Next.js untuk mengimpor Excel, membuat QR Code unik per peserta, dan menampilkan halaman credentials yang hanya memuat **Nama**, **Program Kursus**, dan **Nilai**. Penerbit: LKP PalComTech Palembang bekerja sama dengan Universitas Muhammadiyah Palembang.

## Arsitektur
- Website: Next.js, di-host di Vercel.
- Database: Supabase PostgreSQL.
- Impor: file Excel `.xlsx` / `.xls`; pilih sheet, baris header, kolom nama, dan kolom nilai akhir.
- Setiap baris peserta mendapatkan UUID acak dan URL `/c/UUID` yang unik.
- Admin dapat memuat daftar QR dan mencetaknya / menyimpannya sebagai PDF.

## A. Buat tabel di Supabase
1. Buka https://supabase.com/ lalu buat project baru.
2. Buka **SQL Editor** di project Supabase.
3. Buka file `schema.sql` dari proyek ini, salin seluruh isinya, tempel ke SQL Editor, lalu klik **Run**.
4. Buka **Project Settings / API Keys** (atau tombol **Connect**) dan salin **Project URL** serta **Secret key**. Gunakan secret key hanya di server. Jangan gunakan publishable key untuk `SUPABASE_SECRET_KEY`.

Tabel `public.credentials` memakai Row Level Security (RLS) dan tidak memiliki policy publik. Aplikasi membaca/menulis tabel dari API server menggunakan secret key.

## B. Jalankan di komputer (opsional, disarankan untuk uji)
Butuh Node.js 20 atau lebih baru.

```bash
npm install
```

Salin `.env.example` menjadi `.env.local`, lalu isi nilai asli:

```env
SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
ADMIN_PASSWORD=buat-password-admin-yang-panjang-dan-unik
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jalankan:

```bash
npm run dev
```

Buka http://localhost:3000/admin. Jangan masukkan secret key ke variabel berawalan `NEXT_PUBLIC_`. Jangan commit `.env.local` ke GitHub.

## C. Unggah ke GitHub
1. Ekstrak ZIP.
2. Buat repository baru di https://github.com/.
3. Unggah isi folder `qr-credentials-vercel` (isi folder, bukan ZIP-nya).
4. Pastikan `.env.local` tidak ikut terunggah. `.gitignore` mengecualikannya.

## D. Deploy di Vercel
1. Buka https://vercel.com/ dan pilih **Add New → Project**.
2. Impor repository GitHub tadi. Framework biasanya terdeteksi sebagai Next.js.
3. Di **Environment Variables**, tambahkan:
   - `SUPABASE_URL` = Project URL dari Supabase.
   - `SUPABASE_SECRET_KEY` = Secret key dari Supabase (server-only).
   - `ADMIN_PASSWORD` = password admin yang panjang, unik, dan tidak dibagikan ke peserta.
   - `NEXT_PUBLIC_SITE_URL` = URL production Vercel, misalnya `https://nama-proyek.vercel.app`.
4. Klik **Deploy**. Jika URL production berubah, perbarui `NEXT_PUBLIC_SITE_URL` lalu redeploy.
5. Dokumentasi resmi: https://vercel.com/docs/deployments/git dan https://vercel.com/docs/environment-variables.

## E. Impor Excel dan cetak QR
1. Buka `https://nama-proyek.vercel.app/admin`.
2. Masukkan `ADMIN_PASSWORD`.
3. Isi **Program kursus** dan **Nama kelas / periode**. Contoh: `AutoCAD 2D & 3D` dan `Kelas Oktober 2026`.
4. Unggah file Excel.
5. Pilih worksheet yang tepat.
6. Pilih baris header, lalu petakan kolom **Nama peserta** dan **Nilai akhir**. Periksa pratinjau sebelum impor.
7. Klik **Impor peserta & buat credentials**. Setiap baris valid disimpan dengan ID unik. Mengimpor file yang sama dua kali akan membuat record/QR baru, jadi jangan impor ulang kecuali memang diperlukan.
8. Klik **Muat daftar QR**, lalu **Cetak / Simpan PDF**.
9. Uji beberapa QR dengan kamera HP. Halaman `/c/UUID` hanya menampilkan Nama, Program Kursus, dan Nilai.

## Catatan keamanan dan operasional
- `SUPABASE_SECRET_KEY` memberikan akses istimewa dan tidak boleh masuk ke browser, repository, screenshot, atau chat. Simpan hanya di environment variables Vercel dan `.env.local` lokal.
- Endpoint publik hanya mengembalikan tiga field yang disetujui. UUID acak membuat URL sulit ditebak, tetapi siapa pun yang memiliki QR/URL dapat melihat informasi tersebut. Pastikan institusi berwenang menyetujui publikasi nilai.
- RLS aktif tanpa policy publik; jangan menambahkan policy SELECT publik. Aplikasi menggunakan secret key di API routes server-side.
- Sistem awal ini tidak menyediakan edit/hapus peserta di panel admin. Untuk koreksi, siapkan fitur admin terautentikasi atau lakukan dengan prosedur database yang aman.
- Impor dibatasi maksimal 2.000 baris per proses. Jika gagal di tengah impor sangat besar, periksa tabel sebelum mencoba ulang agar tidak membuat duplikasi.
- Jangan cetak QR final sebelum domain production benar dan URL sudah diuji.
