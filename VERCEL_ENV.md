# Environment Variables untuk Vercel

Salin daftar berikut ke **Vercel Dashboard → Settings → Environment Variables**:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tirratzcweksmlcofhbv.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnJhdHpjd2Vrc21sY29maGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMzMzMjEsImV4cCI6MjA5NDkwOTMyMX0.DbgeUndsYWA2FhnZ-x_yAGenjsAlzXaN1ArnAt4MpMo` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpcnJhdHpjd2Vrc21sY29maGJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTMzMzMyMSwiZXhwIjoyMDk0OTA5MzIxfQ.cftWQQX1_zHJhp22M8ogwE_qCZXcEHY7o4SGKQnOQQY` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://NAMA_PROJECT_ANDA.vercel.app` | Production |

> **Catatan:** Ganti `NEXT_PUBLIC_SITE_URL` dengan URL domain Vercel Anda setelah deploy pertama (untuk OG tags social media yang benar).

## Cara Import ke Vercel (Cepat)

1. Salin 3 baris di bawah ke file `.env.local` di komputer Anda (untuk referensi).
2. Saat import project di Vercel, bagian **Environment Variables** akan kosong — masukkan satu per satu menggunakan tabel di atas.
3. Setelah deploy pertama, update `NEXT_PUBLIC_SITE_URL` dengan URL Vercel yang didapat.

## Penting: Supabase Project Harus Aktif

Pastikan project Supabase Anda **tidak paused**. Cek di https://supabase.com/dashboard — jika ada tulisan "Paused", klik **Restore project**.
