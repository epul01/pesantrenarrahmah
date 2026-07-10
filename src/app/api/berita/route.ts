import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured, isSupabaseReachable, type BeritaInput } from "@/lib/supabase";

const fallbackBerita = [
  {
    id: "1",
    judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
    ringkasan: "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing. Kegiatan ini bertujuan untuk meningkatkan semangat hafalan Al-Qur'an dan mempererat ukhuwah islamiyah antar santri.",
    konten: null,
    kategori: "Kegiatan",
    gambar_url: "/berita/mabit-tahfidz.jpg",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "2",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan: "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama.",
    konten: null,
    kategori: "Pendaftaran",
    gambar_url: "/berita/pendaftaran-santri.jpg",
    created_at: "2026-01-28T00:00:00Z",
    updated_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "3",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan: "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi.",
    konten: null,
    kategori: "Prestasi",
    gambar_url: "/berita/prestasi-mhq.jpg",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
  },
];

function isTableNotFoundError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    (error.message?.includes("Could not find the table") ?? false)
  );
}

function isNetworkError(error: { code?: string; message?: string; details?: string }): boolean {
  const msg = (error.message || "") + " " + (error.details || "");
  return (
    msg.includes("fetch failed") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("network")
  );
}

// GET /api/berita - Get all berita
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      data: fallbackBerita,
      fallback: true,
      message: "Supabase belum dikonfigurasi. Menampilkan data contoh.",
    });
  }

  // Fast pre-check: if Supabase is unreachable, return fallback immediately (avoids 4-7s timeout)
  const reachable = await isSupabaseReachable();
  if (!reachable) {
    return NextResponse.json({
      data: fallbackBerita,
      fallback: true,
      message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
    });
  }

  try {
    const { data, error } = await supabaseAdmin.client
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        return NextResponse.json({
          data: fallbackBerita,
          fallback: true,
          message: "Tabel berita belum tersedia. Menampilkan data contoh.",
        });
      }

      // Network error (e.g. Supabase project paused/unreachable) — fall back gracefully
      if (isNetworkError(error)) {
        return NextResponse.json({
          data: fallbackBerita,
          fallback: true,
          message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
        });
      }

      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data berita", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    // Network error in catch — fall back gracefully
    return NextResponse.json({
      data: fallbackBerita,
      fallback: true,
      message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
    });
  }
}

// POST /api/berita - Create new berita
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Silakan atur kredensial Supabase di file .env.local" },
      { status: 503 }
    );
  }

  try {
    const body: BeritaInput = await request.json();

    if (!body.judul || !body.ringkasan || !body.kategori) {
      return NextResponse.json(
        { error: "Judul, ringkasan, dan kategori wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.client
      .from("berita")
      .insert({
        judul: body.judul,
        ringkasan: body.ringkasan,
        konten: body.konten || null,
        kategori: body.kategori,
        gambar_url: body.gambar_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Gagal menambah berita", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
