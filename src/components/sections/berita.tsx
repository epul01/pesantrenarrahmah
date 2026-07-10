"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BeritaItem {
  id: string;
  tanggal: string;
  kategori: string;
  judul: string;
  ringkasan: string;
  konten: string;
  gambar: string;
}

const fallbackBerita: BeritaItem[] = [
  {
    id: "1",
    tanggal: "15 Februari 2026",
    kategori: "Kegiatan",
    judul: "Pesantren Ar-Rahmah Gelar Mabit dan Halaqah Tahfidz Akbar",
    ringkasan:
      "Pesantren Ar-Rahmah mengadakan kegiatan Mabit (Malam Bina Iman dan Takwa) dan Halaqah Tahfidz Akbar yang dihadiri oleh seluruh santri dan ustadz pembimbing. Kegiatan ini bertujuan untuk meningkatkan semangat hafalan Al-Qur'an dan mempererat ukhuwah islamiyah antar santri.",
    konten:
      "Alhamdulillah, Pesantren Ar-Rahmah Dewan Da'wah telah sukses menyelenggarakan kegiatan Mabit dan Halaqah Tahfidz Akbar pada akhir pekan lalu. Kegiatan yang berlangsung sejak Maghrib hingga Subuh ini diikuti oleh seluruh santri dengan penuh semangat dan kekhusyukan.\n\nDalam kesempatan ini, Ustadz Ahmad Fauzi, selaku pimpinan pesantren, menyampaikan tausiyah tentang pentingnya menjaga hafalan Al-Qur'an dan mengamalkannya dalam kehidupan sehari-hari. Beliau juga menekankan bahwa menjadi penghafal Al-Qur'an bukan hanya kebanggaan, tetapi juga amanah yang harus dijaga.\n\nAcara dilanjutkan dengan halaqah tahfidz bersama, di mana setiap santri mendapat kesempatan untuk memperdengarkan hafalan mereka di hadapan para ustadz pembimbing. Suasana yang khidmat dan penuh keberkahan terasa menyelimuti seluruh rangkaian acara.\n\nKegiatan ditutup dengan doa bersama dan sarapan pagi. Semoga kegiatan semacam ini dapat terus dilaksanakan secara rutin untuk meningkatkan kualitas hafalan dan ketakwaan para santri.",
    gambar: "/berita/mabit-tahfidz.jpg",
  },
  {
    id: "2",
    tanggal: "28 Januari 2026",
    kategori: "Pendaftaran",
    judul: "Pendaftaran Santri Baru Tahun Ajaran 2026/2027 Resmi Dibuka",
    ringkasan:
      "Pesantren Ar-Rahmah Dewan Da'wah secara resmi membuka pendaftaran santri baru untuk tahun ajaran 2026/2027. Tersedia beasiswa hingga 70% bagi santri yatim dan potongan 50% bagi 10 pendaftar pertama. Segera daftarkan putra-putri Anda!",
    konten:
      "Bismillahirrahmanirrahim. Dengan rahmat Allah SWT, Pesantren Ar-Rahmah Dewan Da'wah Islamiyah Indonesia dengan bangga mengumumkan pembukaan pendaftaran santri baru untuk tahun ajaran 2026/2027.\n\nProgram yang ditawarkan meliputi:\n• Tahfidz Al-Qur'an (target hafalan minimal 15 juz)\n• Pembelajaran Bahasa Arab\n• Kajian Hadits Arba'in\n• Pelatihan Ceramah dan Da'wah\n• Pendidikan Akhlak dan Aqidah\n\nFasilitas yang tersedia:\n• Asrama yang nyaman dan bersih\n• Masjid dan musholla\n• Ruang belajar yang representatif\n• Perpustakaan lengkap\n• Kebun seluas 2 hektar\n\nPendaftaran dibuka mulai 1 Januari 2026. Hubungi kami di 085703465155 untuk informasi lebih lanjut.",
    gambar: "/berita/pendaftaran-santri.jpg",
  },
  {
    id: "3",
    tanggal: "10 Januari 2026",
    kategori: "Prestasi",
    judul: "Santri Ar-Rahmah Raih Juara Musabaqah Hifdzil Qur'an Tingkat Kabupaten",
    ringkasan:
      "Alhamdulillah, tiga santri Pesantren Ar-Rahmah berhasil meraih prestasi membanggakan pada Musabaqah Hifdzil Qur'an tingkat Kabupaten Sukabumi. Prestasi ini menjadi bukti keseriusan santri dalam menghafal Al-Qur'an dan dedikasi para ustadz pembimbing.",
    konten:
      "Alhamdulillahi rabbil 'alamin. Segala puji bagi Allah SWT yang telah memberikan karunia-Nya kepada santri-santri Pesantren Ar-Rahmah.\n\nPada Musabaqah Hifdzil Qur'an (MHQ) tingkat Kabupaten Sukabumi yang diselenggarakan pada tanggal 8-10 Januari 2026, tiga santri kami berhasil meraih prestasi yang membanggakan:\n\n1. Siti Aisyah - Juara 1 Kategori Hafalan 10 Juz\n2. Ahmad Rizki - Juara 2 Kategori Hafalan 15 Juz\n3. Fatimah Az-Zahra - Juara 3 Kategori Hafalan 5 Juz\n\nPrestasi ini merupakan buah dari kerja keras para santri dalam menghafal Al-Qur'an setiap hari, serta bimbingan intensif dari para ustadz dan ustadzah pembimbing. Kami juga mengucapkan terima kasih kepada seluruh keluarga besar Pesantren Ar-Rahmah yang selalu mendukung dan mendoakan.",
    gambar: "/berita/prestasi-mhq.jpg",
  },
];

export function BeritaSection() {
  const [berita, setBerita] = useState<BeritaItem[]>(fallbackBerita);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/berita");
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json.data && json.data.length > 0) {
          const mapped = json.data.map(
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
            })
          );
          setBerita(mapped);
        }
      } catch {
        // keep fallback
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayBerita = berita;

  return (
    <section id="berita" className="py-16 sm:py-24 bg-white bg-islamic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-green-50 rounded-full mb-4">
            <Newspaper className="w-4 h-4 text-islamic-green" />
            <span className="text-sm font-medium text-islamic-green">
              Berita Pesantren
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Berita <span className="text-islamic-green">Terkini</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Informasi dan kabar terbaru seputar kegiatan Pesantren Ar-Rahmah.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {displayBerita.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Link href={`/berita/${item.id}`} className="block group">
                <Card className="h-full group-hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-islamic-green text-white text-xs font-semibold rounded-full shadow-md">
                      {item.kategori}
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      {item.tanggal}
                    </span>
                  </div>

                  <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                    <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-islamic-green transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                      {item.ringkasan}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-islamic-green group-hover:text-islamic-green-light transition-colors inline-flex items-center gap-1 group-hover:gap-2">
                        Baca selengkapnya
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
