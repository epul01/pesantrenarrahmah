import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured, isSupabaseReachable, type BeritaInput } from "@/lib/supabase";

const fallbackBeritaDetail = [
  {
    id: "1",
    judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
    ringkasan: "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing. Kegiatan ini bertujuan untuk meningkatkan semangat hafalan Al-Qur'an dan mempererat ukhuwah islamiyah antar santri.",
    konten: "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu. Kegiatan yang berlangsung sejak Maghrib hingga Subuh ini diikuti oleh seluruh santri dengan penuh semangat dan kekhusyukan.\n\nDalam kesempatan ini, Ustadz Ahmad Fauzi, selaku pimpinan pesantren, menyampaikan tausiyah tentang pentingnya menjaga hafalan Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Beliau juga menekankan bahwa menjadi penghafal Al-Qur'an bukan hanya kebanggaan, tetapi juga amanah yang harus dijaga.\n\nAcara dilanjutkan dengan halaqah tahfidz bersama, di mana setiap santri mendapat kesempatan untuk memperdengarkan hafalan mereka di hadapan para ustadz pembimbing. Suasana yang khidmat dan penuh keberkahan terasa menyelimuti seluruh rangkaian acara.\n\nKegiatan ditutup dengan doa bersama dan sarapan pagi. Semoga kegiatan semacam ini dapat terus dilaksanakan secara rutin untuk meningkatkan kualitas hafalan dan ketakwaan para santri.",
    kategori: "Kegiatan",
    gambar_url: "/berita/mabit-tahfidz.jpg",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "2",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan: "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama.",
    konten: "Bismillahirrahmanirrahim. Dengan rahmat Allah SWT, Pesantren Ar-Rahmah Dewan Da'wah Islamiyah Indonesia dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang ditawarkan meliputi:\n• Tahfidz Al-Qur'an (target hafalan minimal 15 juz)\n• Pembelajaran Bahasa Arab\n• Kajian Hadits Arba'in\n• Pelatihan Ceramah dan Da'wah\n• Pendidikan Akhlak dan Aqidah\n\nFasilitas yang tersedia:\n• Asrama yang nyaman dan bersih\n• Masjid dan musholla\n• Ruang belajar yang representatif\n• Perpustakaan lengkap\n• Kebun seluas 2 hektar\n\nPendaftaran dibuka mulai 1 Januari 2026. Hubungi kami di 085703465155 untuk informasi lebih lanjut.",
    kategori: "Pendaftaran",
    gambar_url: "/berita/pendaftaran-santri.jpg",
    created_at: "2026-01-28T00:00:00Z",
    updated_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "3",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan: "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi.",
    konten: "Alhamdulillahi rabbil 'alamin. Segala puji bagi Allah SWT yang telah memberikan karunia-Nya kepada santri-santri Pesantren Ar-Rahmah.\n\nPada Musabaqah Hifdzil Qur'an (MHQ) tingkat Kabupaten Sukabumi yang diselenggarakan pada tanggal 8-10 Januari 2026, tiga santri kami berhasil meraih prestasi yang membanggakan:\n\n1. Siti Aisyah - Juara 1 Kategori Hafalan 10 Juz\n2. Ahmad Rizki - Juara 2 Kategori Hafalan 15 Juz\n3. Fatimah Az-Zahra - Juara 3 Kategori Hafalan 5 Juz\n\nPrestasi ini merupakan buah dari kerja keras para santri dalam menghafal Al-Qur'an setiap hari, serta bimbingan intensif dari para ustadz dan ustadzah pembimbing. Kami juga mengucapkan terima kasih kepada seluruh keluarga besar Pesantren Ar-Rahmah yang selalu mendukung dan mendoakan.",
    kategori: "Prestasi",
    gambar_url: "/berita/prestasi-mhq.jpg",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
  },
];

// GET /api/berita/[id] - Get single berita
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    const fallback = fallbackBeritaDetail.find((item) => item.id === id);
    if (!fallback) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: fallback });
  }

  // Fast pre-check: if Supabase is unreachable, return fallback immediately
  const reachable = await isSupabaseReachable();
  if (!reachable) {
    const fallback = fallbackBeritaDetail.find((item) => item.id === id);
    if (!fallback) {
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: fallback });
  }

  try {
    const { data, error } = await supabaseAdmin.client
      .from("berita")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // If not found in DB, try fallback
      const fallback = fallbackBeritaDetail.find((item) => item.id === id);
      if (fallback) {
        return NextResponse.json({ data: fallback });
      }
      return NextResponse.json(
        { error: "Berita tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    // Try fallback
    const fallback = fallbackBeritaDetail.find((item) => item.id === id);
    if (fallback) {
      return NextResponse.json({ data: fallback });
    }
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT /api/berita/[id] - Update berita
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body: BeritaInput = await request.json();

    const { data, error } = await supabaseAdmin.client
      .from("berita")
      .update({
        judul: body.judul,
        ringkasan: body.ringkasan,
        konten: body.konten || null,
        kategori: body.kategori,
        gambar_url: body.gambar_url || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal mengupdate berita", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE /api/berita/[id] - Delete berita
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const { error } = await supabaseAdmin.client
      .from("berita")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Gagal menghapus berita", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
