# 🚨 PANDUAN FIX: "Couldn't find any pages or app directory"

## Kenapa Error Ini Terjadi?

Vercel menjalankan `next build` di **root folder repo GitHub** Anda, tapi tidak menemukan folder `src/app/`. Ini berarti file `src/` Anda **tidak berada di root repo** — kemungkinan tertumpuk di dalam subfolder.

---

## 🔍 CEK STRUKTUR REPO ANDA SEKARANG

1. Buka **github.com/epul01/pesantrenarrahmah**
2. Lihat halaman utama repo Anda

### ✅ STRUKTUR YANG BENAR (Root):
```
epul01/pesantrenarrahmah/
├── src/                    ← folder ini ada di root
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── admin/
│   ├── components/
│   └── lib/
├── public/
├── package.json            ← file ini di root
├── next.config.ts
└── ...
```

### ❌ STRUKTUR YANG SALAH (Nested):
```
epul01/pesantrenarrahmah/
└── pesantren-arrahmah-website/     ← ada subfolder tambahan!
    ├── src/                        ← src tersembunyi di dalam
    │   └── app/
    ├── package.json
    └── ...
```

**Cek:** Apakah di halaman utama repo Anda ada folder `src` langsung? Atau ada folder lain dulu (seperti `pesantren-arrahmah-website`)?

---

## 🛠️ SOLUSI A — Paling Cepat (Set Root Directory di Vercel)

Jika file Anda tertumpuk di subfolder, **tidak perlu upload ulang**. Coba cara ini:

1. Buka **github.com/epul01/pesantrenarrahmah**
2. Catat **nama subfolder** tempat file `src/` berada
   (misal: `pesantren-arrahmah-website` atau folder lain)
3. Buka **vercel.com** → login → klik project **pesantrenarrahmah**
4. Klik tab **Settings** (atas)
5. Di menu kiri, klik **General**
6. Scroll ke bawah, cari **Root Directory** → klik **Edit**
7. Isi dengan nama subfolder yang Anda catat tadi, contoh:
   ```
   pesantren-arrahmah-website
   ```
8. Klik **Save**
9. Klik tab **Deployments** → klik **⋮** di deployment terbaru → **Redeploy**

---

## 🛠️ SOLUSI B — Upload Ulang dengan Benar (Paling Bersih)

### Langkah 1: Download ZIP Terbaru
1. Klik tombol **download hijau** di pojok kanan bawah Preview Panel
2. Pilih **"Source Code Website (ZIP)"**
3. **Extract** ZIP → muncul folder `pesantren-arrahmah-website/`

### Langkah 2: MASUK ke Dalam Folder Hasil Extract
1. **Klik 2x folder `pesantren-arrahmah-website`** untuk MASUK ke dalamnya
2. Di dalam folder ini Anda lihat:
   ```
   src/    public/    package.json    next.config.ts    ...
   ```
3. **Select SEMUA file di dalam folder ini** (Ctrl+A atau Cmd+A)
   - ⚠️ **PENTING:** Anda memilih ISI folder, BUKAN foldernya!

### Langkah 3: Delete Repo Lama di GitHub
1. Buka **github.com/epul01/pesantrenarrahmah**
2. Klik **Settings** (tab atas, bukan Settings di Vercel)
3. Scroll ke PALING bawah → **Danger Zone**
4. Klik **Delete this repository**
5. Ketik nama repo untuk konfirmasi → **Delete**

### Langkah 4: Buat Repo Baru + Upload
1. Buka **github.com/new**
2. Repository name: `pesantrenarrahmah`
3. Pilih **Public**
4. **Jangan centang** "Add a README" atau lainnya
5. Klik **Create repository**
6. Di halaman baru, klik **"uploading an existing file"** (link teks)
7. **Drag & drop** SEMUA file yang sudah Anda select di Langkah 2
8. Tunggu sampai semua ter-upload (progress bar hijau)
9. Isi commit message: `Initial upload website`
10. Klik **Commit changes**

### Langkah 5: Verifikasi Struktur
Setelah upload, halaman utama repo harus menampilkan:
```
📁 src/
📁 public/
📄 package.json
📄 next.config.ts
📄 tsconfig.json
... (file lainnya)
```

**Jika masih ada folder pembungkus** (misal `pesantren-arrahmah-website/`), berarti Anda salah upload — ulangi Langkah 2-4.

### Langkah 6: Re-deploy di Vercel
1. Buka **vercel.com** → project Anda
2. Tab **Deployments** → klik **⋮** → **Redeploy**
3. Tunggu 2-3 menit, build harus sukses!

---

## 📸 CEK VISUAL SETELAH UPLOAD

Setelah upload, halaman utama repo GitHub Anda harus terlihat seperti ini:

```
epul01 / pesantrenarrahmah

  📁 src/              ← ada di root ( BENAR)
  📁 public/           ← ada di root ( BENAR)
  📄 .gitignore
  📄 Caddyfile
  📄 bun.lock
  📄 components.json
  📄 eslint.config.mjs
  📄 next-env.d.ts
  📄 next.config.ts
  📄 package.json
  📄 postcss.config.mjs
  📄 supabase-schema.sql
  📄 tailwind.config.ts
  📄 tsconfig.json
  📄 vercel.json
  📄 VERCEL_DEPLOY.md
  📄 VERCEL_ENV.md
```

**Jika yang Anda lihat hanya 1 folder** (misal `pesantren-arrahmah-website/`), itu SALAH — file Anda tertumpuk. Gunakan Solusi A atau upload ulang.

---

## ❓ MASIH BINGUNG?

**Cara paling mudah cek struktur repo Anda:**

1. Buka repo GitHub Anda
2. Lihat **URL** browser — harus: `github.com/epul01/pesantrenarrahmah`
3. Klik folder `src` → harus muncul folder `app`, `components`, `lib`
4. Klik folder `app` → harus muncul file `page.tsx`, `layout.tsx`

Jika klik folder `src` tapi isinya bukan `app/components/lib`, berarti struktur salah.

---

## ✅ TANDA BUILD AKAN SUKSES

Sebelum redeploy, pastikan di repo GitHub Anda:
- [ ] Folder `src/` ada di root repo
- [ ] Folder `src/app/` berisi `page.tsx` dan `layout.tsx`
- [ ] File `package.json` ada di root repo
- [ ] **TIDAK ADA** folder pembungkus seperti `pesantren-arrahmah-website/`

Jika semua checklist di atas sudah benar, build di Vercel pasti sukses!
