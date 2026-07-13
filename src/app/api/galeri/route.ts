import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured, isSupabaseReachable, type GaleriInput } from "@/lib/supabase";

const fallbackGaleri = [
  { id: "1", judul: "Halaqah Tahfidz Al-Qur'an", deskripsi: "Santri-santri Pesantren Ar-Rahmah sedang menghafal Al-Qur'an bersama ustadz pembimbing", gambar_url: "/gallery/tahfidz-quran.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "2", judul: "Ruang Belajar", deskripsi: "Suasana belajar yang nyaman dan kondusif di ruang belajar pesantren", gambar_url: "/gallery/ruang-belajar.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "3", judul: "Masjid Pesantren", deskripsi: "Masjid sebagai pusat kegiatan ibadah dan pembelajaran di Pesantren Ar-Rahmah", gambar_url: "/gallery/masjid.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "4", judul: "Kegiatan Olahraga", deskripsi: "Santri menjaga kesehatan tubuh dengan kegiatan olahraga rutin", gambar_url: "/gallery/olahraga.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "5", judul: "Kebun Pesantren", deskripsi: "Kebun seluas 2 hektar yang asri dan sejuk di lingkungan pesantren", gambar_url: "/gallery/kebun.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "6", judul: "Asrama Santri", deskripsi: "Asrama yang nyaman dan bersih untuk santri Pesantren Ar-Rahmah", gambar_url: "/gallery/asrama.png", created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
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

// GET /api/galeri - Get all galeri
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      data: fallbackGaleri,
      fallback: true,
      message: "Supabase belum dikonfigurasi. Menampilkan data contoh.",
    });
  }

  // Fast pre-check: if Supabase is unreachable, return fallback immediately (avoids 4-7s timeout)
  const reachable = await isSupabaseReachable();
  if (!reachable) {
    return NextResponse.json({
      data: fallbackGaleri,
      fallback: true,
      message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
    });
  }

  try {
    const { data, error } = await supabaseAdmin.client
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (isTableNotFoundError(error)) {
        return NextResponse.json({
          data: fallbackGaleri,
          fallback: true,
          message: "Tabel galeri belum tersedia. Menampilkan data contoh.",
        });
      }

      // Network error (e.g. Supabase project paused/unreachable) — fall back gracefully
      if (isNetworkError(error)) {
        return NextResponse.json({
          data: fallbackGaleri,
          fallback: true,
          message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
        });
      }

      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Gagal mengambil data galeri", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    // Network error in catch — fall back gracefully
    return NextResponse.json({
      data: fallbackGaleri,
      fallback: true,
      message: "Supabase tidak dapat dijangkau. Menampilkan data contoh.",
    });
  }
}

// POST /api/galeri - Create new galeri
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi. Silakan atur kredensial Supabase di file .env.local" },
      { status: 503 }
    );
  }

  try {
    const body: GaleriInput = await request.json();

    if (!body.judul || !body.gambar_url) {
      return NextResponse.json(
        { error: "Judul dan gambar wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin.client
      .from("galeri")
      .insert({
        judul: body.judul,
        deskripsi: body.deskripsi || null,
        gambar_url: body.gambar_url,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Gagal menambah galeri", details: error.message },
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
