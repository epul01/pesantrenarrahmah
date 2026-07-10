import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured, isSupabaseReachable } from "@/lib/supabase";

// SQL schema for creating the berita and galeri tables
const SQL_SCHEMA = `
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

-- Enable Row Level Security
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since this is a simple admin panel)
CREATE POLICY "Allow all operations on berita" ON berita FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on galeri" ON galeri FOR ALL USING (true) WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_berita_updated_at ON berita;
CREATE TRIGGER update_berita_updated_at
  BEFORE UPDATE ON berita
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_galeri_updated_at ON galeri;
CREATE TRIGGER update_galeri_updated_at
  BEFORE UPDATE ON galeri
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
`;

// GET /api/setup - Check if tables exist and get SQL schema
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      message: "Supabase belum dikonfigurasi. Silakan atur kredensial Supabase di file .env.local",
      schema: SQL_SCHEMA,
    });
  }

  try {
    // Fast pre-check: if Supabase is unreachable, return not-ready immediately
    const reachable = await isSupabaseReachable();
    if (!reachable) {
      return NextResponse.json({
        configured: true,
        tables: { berita: false, galeri: false },
        ready: false,
        schema: SQL_SCHEMA,
        message: "Supabase tidak dapat dijangkau. Pastikan project Supabase aktif.",
      });
    }

    // Check if berita table exists
    const { error: beritaError } = await supabaseAdmin.client
      .from("berita")
      .select("id")
      .limit(1);

    const beritaExists = !beritaError || !isTableNotFoundError(beritaError);

    // Check if galeri table exists
    const { error: galeriError } = await supabaseAdmin.client
      .from("galeri")
      .select("id")
      .limit(1);

    const galeriExists = !galeriError || !isTableNotFoundError(galeriError);

    return NextResponse.json({
      configured: true,
      tables: {
        berita: beritaExists,
        galeri: galeriExists,
      },
      ready: beritaExists && galeriExists,
      schema: SQL_SCHEMA,
    });
  } catch (err) {
    console.error("Setup check error:", err);
    return NextResponse.json({
      configured: true,
      tables: { berita: false, galeri: false },
      ready: false,
      schema: SQL_SCHEMA,
      error: "Gagal memeriksa tabel",
    });
  }
}

// POST /api/setup - Create tables using Supabase SQL
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "create-tables") {
      // Try to create tables by inserting and checking
      // Since we can't run DDL via the client API, we'll check and provide instructions
      const { error: beritaError } = await supabaseAdmin.client
        .from("berita")
        .select("id")
        .limit(1);

      const { error: galeriError } = await supabaseAdmin.client
        .from("galeri")
        .select("id")
        .limit(1);

      const beritaExists = !beritaError || !isTableNotFoundError(beritaError);
      const galeriExists = !galeriError || !isTableNotFoundError(galeriError);

      if (beritaExists && galeriExists) {
        return NextResponse.json({
          success: true,
          message: "Semua tabel sudah tersedia",
          tables: { berita: true, galeri: true },
        });
      }

      // Tables don't exist, provide SQL schema to run
      return NextResponse.json({
        success: false,
        message: "Tabel belum ada di Supabase. Silakan jalankan SQL schema berikut melalui SQL Editor di dashboard Supabase.",
        schema: SQL_SCHEMA,
        instructions: [
          "Buka dashboard Supabase di https://supabase.com",
          "Pilih project Anda",
          "Buka SQL Editor dari menu sebelah kiri",
          "Salin dan tempel SQL schema di bawah",
          "Klik Run untuk menjalankan",
        ],
        tables: { berita: beritaExists, galeri: galeriExists },
      });
    }

    if (action === "seed-data") {
      // Seed with sample data
      const sampleBerita = [
        {
          judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
          ringkasan: "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing.",
          konten: "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu. Kegiatan yang berlangsung sejak Maghrib hingga Subuh ini diikuti oleh seluruh santri dengan penuh semangat dan kekhusyukan.\n\nDalam kesempatan ini, Ustadz Ahmad Fauzi, selaku pimpinan pesantren, menyampaikan tausiyah tentang pentingnya menjaga hafalan Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Beliau juga menekankan bahwa menjadi penghafal Al-Qur'an bukan hanya kebanggaan, tetapi juga amanah yang harus dijaga.\n\nAcara dilanjutkan dengan halaqah tahfidz bersama, di mana setiap santri mendapat kesempatan untuk memperdengarkan hafalan mereka di hadapan para ustadz pembimbing.",
          kategori: "Kegiatan",
          gambar_url: "/berita/mabit-tahfidz.jpg",
        },
        {
          judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
          ringkasan: "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim.",
          konten: "Bismillahirrahmanirrahim. Dengan rahmat Allah SWT, Pesantren Ar-Rahmah Dewan Da'wah Islamiyah Indonesia dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang ditawarkan meliputi:\n• Tahfidz Al-Qur'an (target hafalan minimal 15 juz)\n• Pembelajaran Bahasa Arab\n• Kajian Hadits Arba'in\n• Pelatihan Ceramah dan Da'wah\n• Pendidikan Akhlak dan Aqidah",
          kategori: "Pendaftaran",
          gambar_url: "/berita/pendaftaran-santri.jpg",
        },
        {
          judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
          ringkasan: "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi.",
          konten: "Alhamdulillahi rabbil 'alamin. Segala puji bagi Allah SWT yang telah memberikan karunia-Nya kepada santri-santri Pesantren Ar-Rahmah.\n\nPada Musabaqah Hifdzil Qur'an (MHQ) tingkat Kabupaten Sukabumi yang diselenggarakan pada tanggal 8-10 Januari 2026, tiga santri kami berhasil meraih prestasi yang membanggakan:\n\n1. Siti Aisyah - Juara 1 Kategori Hafalan 10 Juz\n2. Ahmad Rizki - Juara 2 Kategori Hafalan 15 Juz\n3. Fatimah Az-Zahra - Juara 3 Kategori Hafalan 5 Juz",
          kategori: "Prestasi",
          gambar_url: "/berita/prestasi-mhq.jpg",
        },
      ];

      const sampleGaleri = [
        { judul: "Halaqah Tahfidz Al-Qur'an", deskripsi: "Santri-santri Pesantren Ar-Rahmah sedang menghafal Al-Qur'an bersama ustadz pembimbing", gambar_url: "/gallery/tahfidz-quran.png" },
        { judul: "Ruang Belajar", deskripsi: "Suasana belajar yang nyaman dan kondusif di ruang belajar pesantren", gambar_url: "/gallery/ruang-belajar.png" },
        { judul: "Masjid Pesantren", deskripsi: "Masjid sebagai pusat kegiatan ibadah dan pembelajaran di Pesantren Ar-Rahmah", gambar_url: "/gallery/masjid.png" },
        { judul: "Kegiatan Olahraga", deskripsi: "Santri menjaga kesehatan tubuh dengan kegiatan olahraga rutin", gambar_url: "/gallery/olahraga.png" },
        { judul: "Kebun Pesantren", deskripsi: "Kebun seluas 2 hektar yang asri dan sejuk di lingkungan pesantren", gambar_url: "/gallery/kebun.png" },
        { judul: "Asrama Santri", deskripsi: "Asrama yang nyaman dan bersih untuk santri Pesantren Ar-Rahmah", gambar_url: "/gallery/asrama.png" },
      ];

      const beritaResults = [];
      const galeriResults = [];

      for (const berita of sampleBerita) {
        const { data, error } = await supabaseAdmin.client
          .from("berita")
          .insert(berita)
          .select()
          .single();
        if (error) {
          beritaResults.push({ error: error.message });
        } else {
          beritaResults.push({ success: true, id: data.id });
        }
      }

      for (const galeri of sampleGaleri) {
        const { data, error } = await supabaseAdmin.client
          .from("galeri")
          .insert(galeri)
          .select()
          .single();
        if (error) {
          galeriResults.push({ error: error.message });
        } else {
          galeriResults.push({ success: true, id: data.id });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Data contoh berhasil ditambahkan",
        berita: beritaResults,
        galeri: galeriResults,
      });
    }

    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (err) {
    console.error("Setup error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

function isTableNotFoundError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    (error.message?.includes("Could not find the table") ?? false) ||
    ((error.message?.includes("relation") ?? false) && (error.message?.includes("does not exist") ?? false))
  );
}
