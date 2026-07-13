"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
  Share2,
  MessageCircle,
  Copy,
  CheckCheck,
  Facebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { slugify } from "@/lib/slug";

interface BeritaItem {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  gambar: string;
  tanggal: string;
  created_at: string;
}

const fallbackBerita: BeritaItem[] = [
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

export function BeritaDetailPage({ slug }: { slug: string }) {
  const fallback = fallbackBerita.find((item) => slugify(item.judul) === slug);
  const [berita, setBerita] = useState<BeritaItem | null>(fallback || null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Fetch all berita, then find the one whose slugified title matches
        const res = await fetch(`/api/berita`);
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json.data && Array.isArray(json.data)) {
          const match = json.data.find(
            (item: { judul: string }) => slugify(item.judul) === slug
          );
          if (match) {
            setBerita({
              id: match.id,
              judul: match.judul,
              ringkasan: match.ringkasan,
              konten: match.konten || match.ringkasan,
              kategori: match.kategori,
              gambar: match.gambar_url || "/berita/mabit-tahfidz.jpg",
              tanggal: new Date(match.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              created_at: match.created_at,
            });
          }
        }
      } catch {
        // keep fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = berita
    ? `${berita.judul} - Pesantren Ar-Rahmah Dewan Da'wah`
    : "";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  if (!berita) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavbarSimple />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-islamic-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat berita...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarSimple />

      <main className="flex-1 pt-20">
        {/* Hero image */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/7] max-h-[400px] overflow-hidden">
          <img
            src={berita.gambar}
            alt={berita.judul}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-islamic-green text-white text-xs font-semibold rounded-full shadow-md mb-3">
                {berita.kategori}
              </span>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {berita.judul}
              </h1>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Meta info row */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>{berita.tanggal}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Newspaper className="w-4 h-4" />
              <span>{berita.kategori}</span>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Article body */}
          <div className="prose prose-lg max-w-none">
            {berita.konten.split("\n\n").map((paragraph, idx) => (
              <p
                key={idx}
                className="text-foreground/85 leading-relaxed mb-5 text-base sm:text-lg"
              >
                {paragraph.split("\n").map((line, lineIdx) => (
                  <span key={lineIdx}>
                    {line}
                    {lineIdx < paragraph.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Share + back buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/#berita">
              <Button
                variant="outline"
                className="gap-2 text-islamic-green border-islamic-green/30 hover:bg-islamic-green-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Berita
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">
                Bagikan:
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
                aria-label="Bagikan ke WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                aria-label="Bagikan ke Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors"
                aria-label="Bagikan ke Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full bg-islamic-green hover:bg-islamic-green-light text-white flex items-center justify-center transition-colors"
                aria-label="Salin tautan"
              >
                {copied ? (
                  <CheckCheck className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="bg-islamic-green text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-white/50">
          <p>
            &copy; {new Date().getFullYear()} Pesantren Ar-Rahmah Dewan
            Da&apos;wah. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Simple navbar for the detail page
function NavbarSimple() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-islamic-green/20">
              <img
                src="/logo-pesantren.jpeg"
                alt="Logo Pesantren Ar-Rahmah"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base leading-tight text-islamic-green">
                Pesantren Ar-Rahmah
              </span>
              <span className="text-[10px] sm:text-xs leading-tight text-islamic-gold">
                Dewan Da&apos;wah
              </span>
            </div>
          </a>

          <Link href="/#berita">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-islamic-green border-islamic-green/30 hover:bg-islamic-green-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
