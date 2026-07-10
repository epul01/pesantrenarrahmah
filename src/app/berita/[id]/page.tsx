import type { Metadata } from "next";
import { headers } from "next/headers";
import { BeritaDetailPage } from "./berita-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Fallback berita data for server-side metadata generation
const fallbackBerita: {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  gambar_url: string;
  created_at: string;
}[] = [
  {
    id: "1",
    judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
    ringkasan:
      "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing.",
    konten:
      "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu. Kegiatan yang berlangsung sejak Maghrib hingga Subuh ini diikuti oleh seluruh santri dengan penuh semangat dan kekhusyukan.\n\nDalam kesempatan ini, Ustadz Ahmad Fauzi, selaku pimpinan pesantren, menyampaikan tausiyah tentang pentingnya menjaga hafalan Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Beliau juga menekankan bahwa menjadi penghafal Al-Qur'an bukan hanya kebanggaan, tetapi juga amanah yang harus dijaga.\n\nAcara dilanjutkan dengan halaqah tahfidz bersama, di mana setiap santri mendapat kesempatan untuk memperdengarkan hafalan mereka di hadapan para ustadz pembimbing. Suasana yang khidmat dan penuh keberkahan terasa menyelimuti seluruh rangkaian acara.\n\nKegiatan ditutup dengan doa bersama dan sarapan pagi. Semoga kegiatan semacam ini dapat terus dilaksanakan secara rutin untuk meningkatkan kualitas hafalan dan ketakwaan para santri.",
    kategori: "Kegiatan",
    gambar_url: "/berita/mabit-tahfidz.jpg",
    created_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "2",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan:
      "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama.",
    konten:
      "Bismillahirrahmanirrahim. Dengan rahmat Allah SWT, Pesantren Ar-Rahmah Dewan Da'wah Islamiyah Indonesia dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang ditawarkan meliputi:\n• Tahfidz Al-Qur'an (target hafalan minimal 15 juz)\n• Pembelajaran Bahasa Arab\n• Kajian Hadits Arba'in\n• Pelatihan Ceramah dan Da'wah\n• Pendidikan Akhlak dan Aqidah\n\nFasilitas yang tersedia:\n• Asrama yang nyaman dan bersih\n• Masjid dan musholla\n• Ruang belajar yang representatif\n• Perpustakaan lengkap\n• Kebun seluas 2 hektar\n\nPendaftaran dibuka mulai 1 Januari 2026. Hubungi kami di 085703465155 untuk informasi lebih lanjut.",
    kategori: "Pendaftaran",
    gambar_url: "/berita/pendaftaran-santri.jpg",
    created_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "3",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan:
      "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi.",
    konten:
      "Alhamdulillahi rabbil 'alamin. Segala puji bagi Allah SWT yang telah memberikan karunia-Nya kepada santri-santri Pesantren Ar-Rahmah.\n\nPada Musabaqah Hifdzil Qur'an (MHQ) tingkat Kabupaten Sukabumi yang diselenggarakan pada tanggal 8-10 Januari 2026, tiga santri kami berhasil meraih prestasi yang membanggakan:\n\n1. Siti Aisyah - Juara 1 Kategori Hafalan 10 Juz\n2. Ahmad Rizki - Juara 2 Kategori Hafalan 15 Juz\n3. Fatimah Az-Zahra - Juara 3 Kategori Hafalan 5 Juz\n\nPrestasi ini merupakan buah dari kerja keras para santri dalam menghafal Al-Qur'an setiap hari, serta bimbingan intensif dari para ustadz dan ustadzah pembimbing. Kami juga mengucapkan terima kasih kepada seluruh keluarga besar Pesantren Ar-Rahmah yang selalu mendukung dan mendoakan.",
    kategori: "Prestasi",
    gambar_url: "/berita/prestasi-mhq.jpg",
    created_at: "2026-01-10T00:00:00Z",
  },
];

/**
 * Resolve a relative path to an absolute URL using request headers.
 */
function resolveAbsoluteUrl(
  path: string,
  host: string,
  protocol: string
): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `${protocol}://${host}${path.startsWith("/") ? path : `/${path}`}`;
}

// Server-side: generate metadata with Open Graph tags for social sharing
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const berita = fallbackBerita.find((item) => item.id === id);

  if (!berita) {
    return {
      title: "Berita Tidak Ditemukan - Pesantren Ar-Rahmah",
      description: "Halaman berita yang Anda cari tidak ditemukan.",
    };
  }

  // Build absolute URLs from request headers
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "https";

  const beritaUrl = resolveAbsoluteUrl(`/berita/${berita.id}`, host, protocol);
  const imageUrl = resolveAbsoluteUrl(berita.gambar_url, host, protocol);

  return {
    title: `${berita.judul} - Pesantren Ar-Rahmah Dewan Da'wah`,
    description: berita.ringkasan,
    keywords: ["Pesantren", "Ar-Rahmah", "Dewan Da'wah", "Berita", berita.kategori],
    authors: [{ name: "Pesantren Ar-Rahmah Dewan Da'wah" }],
    alternates: {
      canonical: beritaUrl,
    },
    openGraph: {
      title: berita.judul,
      description: berita.ringkasan,
      url: beritaUrl,
      type: "article",
      locale: "id_ID",
      publishedTime: berita.created_at,
      authors: ["Pesantren Ar-Rahmah Dewan Da'wah"],
      section: berita.kategori,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: berita.judul,
        },
      ],
      siteName: "Pesantren Ar-Rahmah Dewan Da'wah",
    },
    twitter: {
      card: "summary_large_image",
      title: berita.judul,
      description: berita.ringkasan,
      images: [imageUrl],
    },
  };
}

// Allow dynamic params (for berita created via admin with UUID IDs)
export const dynamicParams = true;

// Generate static params for fallback berita
export async function generateStaticParams() {
  return fallbackBerita.map((item) => ({
    id: item.id,
  }));
}

export default async function BeritaDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <BeritaDetailPage id={id} />;
}
