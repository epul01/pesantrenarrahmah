// Shared berita fallback data used by both API routes and pages
export interface BeritaItem {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  gambar: string;
  tanggal: string;
  created_at: string;
}

export const fallbackBerita: BeritaItem[] = [
  {
    id: "1",
    judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
    ringkasan:
      "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing. Kegiatan ini bertujuan untuk meningkatkan semangat hafalan Al-Qur'an dan mempererat ukhuwah islamiyah antar santri.",
    konten:
      "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu. Kegiatan yang berlangsung sejak Maghrib hingga Subuh ini diikuti oleh seluruh santri dengan penuh semangat dan kekhusyukan.\n\nDalam kesempatan ini, Ustadz Ahmad Fauzi, selaku pimpinan pesantren, menyampaikan tausiyah tentang pentingnya menjaga hafalan Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Beliau juga menekankan bahwa menjadi penghafal Al-Qur'an bukan hanya kebanggaan, tetapi juga amanah yang harus dijaga.\n\nAcara dilanjutkan dengan halaqah tahfidz bersama, di mana setiap santri mendapat kesempatan untuk memperdengarkan hafalan mereka di hadapan para ustadz pembimbing. Suasana yang khidmat dan penuh keberkahan terasa menyelimuti seluruh rangkaian acara.\n\nKegiatan ditutup dengan doa bersama dan sarapan pagi. Semoga kegiatan semacam ini dapat terus dilaksanakan secara rutin untuk meningkatkan kualitas hafalan dan ketakwaan para santri.",
    kategori: "Kegiatan",
    gambar: "/berita/mabit-tahfidz.jpg",
    tanggal: "15 Februari 2026",
    created_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "2",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan:
      "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama. Segera daftarkan putra-putri Anda!",
    konten:
      "Bismillahirrahmanirrahim. Dengan rahmat Allah SWT, Pesantren Ar-Rahmah Dewan Da'wah Islamiyah Indonesia dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang ditawarkan meliputi:\n• Tahfidz Al-Qur'an (target hafalan minimal 15 juz)\n• Pembelajaran Bahasa Arab\n• Kajian Hadits Arba'in\n• Pelatihan Ceramah dan Da'wah\n• Pendidikan Akhlak dan Aqidah\n\nFasilitas yang tersedia:\n• Asrama yang nyaman dan bersih\n• Masjid dan musholla\n• Ruang belajar yang representatif\n• Perpustakaan lengkap\n• Kebun seluas 2 hektar\n\nPendaftaran dibuka mulai 1 Januari 2026. Hubungi kami di 085703465155 untuk informasi lebih lanjut.",
    kategori: "Pendaftaran",
    gambar: "/berita/pendaftaran-santri.jpg",
    tanggal: "28 Januari 2026",
    created_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "3",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan:
      "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi. Prestasi ini menjadi bukti keseriusan santri dalam menghafal Al-Qur'an dan dedikasi para ustadz pembimbing.",
    konten:
      "Alhamdulillahi rabbil 'alamin. Segala puji bagi Allah SWT yang telah memberikan karunia-Nya kepada santri-santri Pesantren Ar-Rahmah.\n\nPada Musabaqah Hifdzil Qur'an (MHQ) tingkat Kabupaten Sukabumi yang diselenggarakan pada tanggal 8-10 Januari 2026, tiga santri kami berhasil meraih prestasi yang membanggakan:\n\n1. Siti Aisyah - Juara 1 Kategori Hafalan 10 Juz\n2. Ahmad Rizki - Juara 2 Kategori Hafalan 15 Juz\n3. Fatimah Az-Zahra - Juara 3 Kategori Hafalan 5 Juz\n\nPrestasi ini merupakan buah dari kerja keras para santri dalam menghafal Al-Qur'an setiap hari, serta bimbingan intensif dari para ustadz dan ustadzah pembimbing. Kami juga mengucapkan terima kasih kepada seluruh keluarga besar Pesantren Ar-Rahmah yang selalu mendukung dan mendoakan.",
    kategori: "Prestasi",
    gambar: "/berita/prestasi-mhq.jpg",
    tanggal: "10 Januari 2026",
    created_at: "2026-01-10T00:00:00Z",
  },
];

export function getBeritaById(id: string): BeritaItem | undefined {
  return fallbackBerita.find((item) => item.id === id);
}

export async function fetchBeritaFromAPI(): Promise<BeritaItem[]> {
  try {
    const res = await fetch("/api/berita");
    if (!res.ok) return fallbackBerita;
    const json = await res.json();
    if (json.data && json.data.length > 0) {
      return json.data.map(
        (item: {
          id: string;
          judul: string;
          ringkasan: string;
          konten: string | null;
          kategori: string;
          gambar_url: string | null;
          created_at: string;
        }) => ({
          id: item.id,
          judul: item.judul,
          ringkasan: item.ringkasan,
          konten: item.konten || item.ringkasan,
          kategori: item.kategori,
          gambar: item.gambar_url || "/berita/mabit-tahfidz.jpg",
          tanggal: new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          created_at: item.created_at,
        })
      );
    }
    return fallbackBerita;
  } catch {
    return fallbackBerita;
  }
}

export async function fetchBeritaDetailFromAPI(
  id: string
): Promise<BeritaItem | null> {
  try {
    const res = await fetch(`/api/berita/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.data) {
      return {
        id: json.data.id,
        judul: json.data.judul,
        ringkasan: json.data.ringkasan,
        konten: json.data.konten || json.data.ringkasan,
        kategori: json.data.kategori,
        gambar: json.data.gambar_url || "/berita/mabit-tahfidz.jpg",
        tanggal: new Date(json.data.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        created_at: json.data.created_at,
      };
    }
    return null;
  } catch {
    return null;
  }
}
