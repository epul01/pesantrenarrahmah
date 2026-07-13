import type { Metadata } from "next";
import { headers } from "next/headers";
import { BeritaDetailPage } from "./berita-detail-client";
import { slugify } from "@/lib/slug";
import { supabaseAdmin, isSupabaseConfigured, isSupabaseReachable } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
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
      "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu.",
    kategori: "Kegiatan",
    gambar_url: "/berita/mabit-tahfidz.jpg",
    created_at: "2026-02-15T00:00:00Z",
  },
  {
    id: "2",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan:
      "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027.",
    konten: "Bismillahirrahmanirrahim.",
    kategori: "Pendaftaran",
    gambar_url: "/berita/pendaftaran-santri.jpg",
    created_at: "2026-01-28T00:00:00Z",
  },
  {
    id: "3",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan:
      "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi.",
    konten: "Alhamdulillahi rabbil 'alamin.",
    kategori: "Prestasi",
    gambar_url: "/berita/prestasi-mhq.jpg",
    created_at: "2026-01-10T00:00:00Z",
  },
];

type BeritaData = (typeof fallbackBerita)[number];

/**
 * Resolve a berita by its slug.
 * Checks fallback data first, then queries Supabase (fetching all berita and
 * matching by slugify(judul) since there is no dedicated slug column).
 */
async function getBeritaBySlug(slug: string): Promise<BeritaData | null> {
  // 1. Check fallback data
  const fallbackMatch = fallbackBerita.find((item) => slugify(item.judul) === slug);
  if (fallbackMatch) return fallbackMatch;

  // 2. Try Supabase
  if (!isSupabaseConfigured()) return null;
  const reachable = await isSupabaseReachable();
  if (!reachable) return null;

  try {
    const { data, error } = await supabaseAdmin.client
      .from("berita")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return null;

    const match = data.find((item: BeritaData) => slugify(item.judul) === slug);
    return match || null;
  } catch {
    return null;
  }
}

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
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

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

  const beritaUrl = resolveAbsoluteUrl(`/berita/${slugify(berita.judul)}`, host, protocol);
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

// Allow dynamic params (for berita created via admin that aren't pre-rendered)
export const dynamicParams = true;

// Generate static params for fallback berita (using slugs)
export async function generateStaticParams() {
  return fallbackBerita.map((item) => ({
    slug: slugify(item.judul),
  }));
}

export default async function BeritaDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  return <BeritaDetailPage slug={slug} />;
}
