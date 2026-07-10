# 🚀 Panduan Deploy ke Vercel — Pesantren Ar-Rahmah

Website Pesantren Ar-Rahmah siap di-deploy ke Vercel. Ikuti langkah-langkah berikut.

---

## 📋 Prasyarat

1. **Akun GitHub** — untuk menyimpan kode
2. **Akun Vercel** — daftar gratis di [vercel.com](https://vercel.com) (bisa login dengan GitHub)
3. **Project Supabase aktif** — cek di [supabase.com/dashboard](https://supabase.com/dashboard)
   - Jika status "Paused", klik **Restore project**
   - Pastikan tabel `berita` dan `galeri` sudah dibuat (lihat SQL di bawah)

---

## Langkah 1: Push Kode ke GitHub

### Opsi A: Download & Upload Manual (Termudah)

1. Download semua file project (kecuali `node_modules`, `.next`, `db/`)
2. Buat repository baru di GitHub:
   - Buka [github.com/new](https://github.com/new)
   - Nama: `pesantren-arrahmah`
   - Pilih **Public** atau **Private**
   - **Jangan** centang "Add a README file"
   - Klik **Create repository**
3. Upload semua file melalui web interface GitHub (drag & drop)
   - Atau gunakan GitHub Desktop / `git` CLI

### Opsi B: Git CLI

```bash
# Di komputer Anda, di folder project
git init
git add .
git commit -m "Pesantren Ar-Rahmah - Ready for Vercel"
git branch -M main
git remote add origin https://github.com/USERNAME_ANDA/pesantren-arrahmah.git
git push -u origin main
```

---

## Langkah 2: Import ke Vercel

1. Buka [vercel.com/new](https://vercel.com/new)
2. Pilih repository `pesantren-arrahmah` dari daftar
3. **Konfigurasi Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `bun run build` (atau biarkan default `next build`)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `bun install` (atau `npm install`)
4. **Jangan klik Deploy dulu!** — buka **Environment Variables** dulu

---

## Langkah 3: Set Environment Variables

Di halaman import Vercel, klik **Environment Variables** dan tambahkan satu per satu:

| Name | Value | Environments |
|------|-------|:---:|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tirratzcweksmlcofhbv.supabase.co` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnJhdHpjd2Vrc21sY29maGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMzMjEsImV4cCI6MjA5NDkwOTMyMX0.DbgeUndsYWA2FhnZ-x_yAGenjsAlzXaN1ArnAt4MpMo` | ✅ Production, ✅ Preview, ✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnJhdHpjd2Vrc21sY29maGJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMzMzMyMSwiZXhwIjoyMDk0OTA5MzIxfQ.cftWQQX1_zHJhp22M8ogwE_qCZXcEHY7o4SGKQnOQQY` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SITE_URL` | `https://pesantren-arrahmah.vercel.app` | ✅ Production |

> **Catatan:** `NEXT_PUBLIC_SITE_URL` diisi setelah deploy pertama (ganti dengan URL Vercel yang didapat).

---

## Langkah 4: Deploy!

1. Klik **Deploy**
2. Tunggu 2-3 menit (Vercel akan build & deploy)
3. Setelah selesai, Anda dapat URL seperti:
   ```
   https://pesantren-arrahmah.vercel.app
   ```
4. **Update `NEXT_PUBLIC_SITE_URL`** dengan URL tersebut (untuk OG tags social media):
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Edit `NEXT_PUBLIC_SITE_URL` → ganti value → Save
   - Redeploy: Deployments → klik titik tiga → Redeploy

---

## Langkah 5: Setup Supabase (Jika Belum)

Jika data berita/galeri belum ada di Supabase:

1. Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/tirratzcweksmlcofhbv/sql)
2. Salin & jalankan SQL berikut:

```sql
-- Create berita table
CREATE TABLE IF NOT EXISTS berita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  ringkasan TEXT NOT NULL,
  konten TEXT,
  kategori TEXT NOT NULL DEFAULT 'Kegiatan',
  gambar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create galeri table
CREATE TABLE IF NOT EXISTS galeri (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  gambar_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all on berita" ON berita FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on galeri" ON galeri FOR ALL USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_berita_updated_at BEFORE UPDATE ON berita
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_galeri_updated_at BEFORE UPDATE ON galeri
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

3. Buat Storage Bucket untuk upload foto:
   - Supabase Dashboard → Storage → New bucket
   - Name: `uploads`
   - Public: ✅ ON
   - Create bucket

---

## Langkah 6: Custom Domain (Opsional)

1. Vercel Dashboard → Project → Settings → Domains
2. Masukkan domain Anda (mis. `pesantrenarrahmah.com`)
3. Ikuti instruksi DNS (A record / CNAME)
4. Update `NEXT_PUBLIC_SITE_URL` ke domain custom

---

## 🔧 Troubleshooting

### Halaman blank / Error 500
- Cek Vercel Dashboard → Deployments → klik deployment → **Logs**
- Pastikan semua 4 env vars Supabase sudah diset dengan benar
- Pastikan Supabase project **tidak paused**

### Foto tidak muncul setelah upload di Admin
- Pastikan Storage bucket `uploads` sudah dibuat dan **Public: ON**
- Cek di Supabase Dashboard → Storage → uploads

### Berita/Galeri tidak tampil
- Pastikan tabel `berita` dan `galeri` sudah dibuat (SQL di atas)
- Cek API: buka `https://DOMAIN-ANDA.vercel.app/api/berita`
- Jika return `fallback: true`, berarti Supabase tidak terjangkau

### Deploy berikutnya otomatis
- Setiap `git push` ke branch `main` akan auto-deploy
- Pull request akan membuat Preview Deployment

---

## 📁 Struktur Project

```
pesantren-arrahmah/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── admin/                # Admin dashboard
│   │   ├── berita/[id]/          # Berita detail page
│   │   └── api/                  # API routes (berita, galeri, upload)
│   ├── components/sections/      # Section components
│   └── lib/supabase.ts           # Supabase client
├── public/                       # Static images
├── next.config.ts
├── vercel.json
└── package.json
```

---

## ✅ Checklist Sebelum Deploy

- [ ] Kode sudah di-push ke GitHub
- [ ] Supabase project **aktif** (tidak paused)
- [ ] Tabel `berita` dan `galeri` sudah dibuat di Supabase
- [ ] Storage bucket `uploads` sudah dibuat (Public: ON)
- [ ] 4 Environment Variables diset di Vercel
- [ ] Deploy berhasil tanpa error
- [ ] Website bisa diakses
- [ ] Admin dashboard (`/admin`) berfungsi
- [ ] Upload foto berfungsi
- [ ] `NEXT_PUBLIC_SITE_URL` diupdate dengan URL Vercel
