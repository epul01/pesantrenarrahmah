"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageIcon, X as XIcon } from "lucide-react";

interface GaleriItem {
  id: string;
  src: string;
  alt: string;
  judul: string;
  deskripsi: string;
}

const fallbackGaleri: GaleriItem[] = [
  { id: "1", src: "/gallery/tahfidz-quran.png", alt: "Kegiatan Tahfidz Al-Qur'an", judul: "Halaqah Tahfidz Al-Qur'an", deskripsi: "Santri menghafal Al-Qur'an dengan khusyuk di musholla pesantren." },
  { id: "2", src: "/gallery/ruang-belajar.png", alt: "Ruang Belajar Santri", judul: "Kegiatan Belajar Mengajar", deskripsi: "Ruang belajar yang nyaman untuk mendukung proses pendidikan santri." },
  { id: "3", src: "/gallery/masjid.png", alt: "Masjid Pesantren", judul: "Masjid Pesantren", deskripsi: "Masjid yang luas dan indah sebagai pusat kegiatan ibadah santri." },
  { id: "4", src: "/gallery/olahraga.png", alt: "Lapangan Olahraga", judul: "Kegiatan Olahraga", deskripsi: "Lapangan olahraga yang luas untuk menjaga kesehatan dan kebugaran santri." },
  { id: "5", src: "/gallery/kebun.png", alt: "Kebun Pesantren", judul: "Kebun Pesantren", deskripsi: "Kebun seluas 2 hektar yang dimanfaatkan untuk kegiatan pertanian santri." },
  { id: "6", src: "/gallery/asrama.png", alt: "Asrama Pesantren", judul: "Asrama Pesantren", deskripsi: "Asrama yang bersih dan nyaman sebagai tempat tinggal santri sehari-hari." },
];

export function GaleriSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [galeri, setGaleri] = useState<GaleriItem[]>([]);

  const fetchGaleri = useCallback(async () => {
    try {
      const res = await fetch("/api/galeri");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const mapped = json.data.map((item: { id: string; judul: string; deskripsi: string | null; gambar_url: string }) => ({
          id: item.id,
          src: item.gambar_url,
          alt: item.judul,
          judul: item.judul,
          deskripsi: item.deskripsi || "",
        }));
        setGaleri(mapped);
      } else {
        setGaleri(fallbackGaleri);
      }
    } catch {
      setGaleri(fallbackGaleri);
    }
  }, []);

  useEffect(() => {
    fetchGaleri();
  }, [fetchGaleri]);

  // Handle lightbox open/close with CSS transitions
  useEffect(() => {
    if (lightboxOpen) {
      // Small delay to allow the DOM to render before triggering the transition
      requestAnimationFrame(() => {
        setLightboxVisible(true);
      });
    } else {
      setLightboxVisible(false);
    }
  }, [lightboxOpen]);

  const displayGaleri = galeri.length > 0 ? galeri : fallbackGaleri;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    // Wait for the transition to finish before unmounting
    setTimeout(() => setLightboxOpen(false), 250);
  };

  const prevImage = () => setLightboxIndex((prev) => (prev === 0 ? displayGaleri.length - 1 : prev - 1));
  const nextImage = () => setLightboxIndex((prev) => (prev === displayGaleri.length - 1 ? 0 : prev + 1));

  return (
    <section id="galeri" className="py-16 sm:py-24 bg-gradient-to-b from-white to-islamic-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-gold-50 rounded-full mb-4">
            <ImageIcon className="w-4 h-4 text-islamic-gold" />
            <span className="text-sm font-medium text-islamic-gold">Galeri Pesantren</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Galeri <span className="text-islamic-gold">Kegiatan</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Dokumentasi kegiatan dan suasana Pesantren Ar-Rahmah Dewan Da&apos;wah.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {displayGaleri.map((item, i) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 animate-fade-in-scale"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={() => openLightbox(i)}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-islamic-green/80 via-islamic-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-5">
                <h4 className="text-white font-bold text-sm sm:text-base leading-tight">{item.judul}</h4>
                <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox - replaces AnimatePresence with CSS transitions */}
      {lightboxOpen && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-250 ${lightboxVisible ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundColor: "rgba(0,0,0,0.9)", transitionDuration: "250ms" }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Tutup galeri"
          >
            <XIcon className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-3 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Foto sebelumnya"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-3 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Foto selanjutnya"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            key={lightboxIndex}
            className="relative max-w-5xl w-full mx-4 sm:mx-8 animate-fade-in-scale"
            style={{ animationDuration: "250ms" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayGaleri[lightboxIndex].src}
              alt={displayGaleri[lightboxIndex].alt}
              className="w-full rounded-xl shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl">
              <h4 className="text-white font-bold text-base sm:text-lg">{displayGaleri[lightboxIndex].judul}</h4>
              <p className="text-white/80 text-sm mt-1">{displayGaleri[lightboxIndex].deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
