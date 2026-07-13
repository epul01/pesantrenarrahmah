"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onOpenPendaftaran }: { onOpenPendaftaran: () => void }) {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src="/hero-background.jpg"
          alt="Pesantren Ar-Rahmah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-islamic-green/85 via-islamic-green/70 to-islamic-green/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-islamic-green/60 via-transparent to-transparent" />
      </div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center animate-[heroFadeIn_0.8s_ease-out_both]">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-[heroSlideUp_0.6s_ease-out_0.4s_both]">
          Pesantren{" "}
          <span className="text-gradient-gold">Ar-Rahmah</span>
        </h1>

        <p className="text-lg sm:text-xl text-islamic-gold-lighter font-semibold mb-6 sm:mb-8 animate-[heroSlideUp_0.6s_ease-out_0.5s_both]">
          Dewan Da&apos;wah Islamiyah Indonesia
        </p>

        <div className="mb-8 sm:mb-10 animate-[heroSlideUp_0.6s_ease-out_0.7s_both]">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[
              "Melahirkan Da'i Sejak Dini",
              "Cinta Ilmu",
              "Cinta Da'wah",
              "Berakhlakul Karimah",
            ].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium"
              >
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-islamic-gold-lighter fill-islamic-gold-lighter" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-[heroSlideUp_0.6s_ease-out_0.9s_both]">
          <Button
            size="lg"
            onClick={onOpenPendaftaran}
            className="bg-islamic-gold hover:bg-islamic-gold-light text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-lg shadow-islamic-gold/30 hover:shadow-xl hover:shadow-islamic-gold/40 transition-all duration-300"
          >
            Daftar Sekarang
          </Button>
          <a href="#profil">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white font-medium text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6"
            >
              Kenali Kami
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[heroFadeIn_1s_ease-out_1.5s_both]">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center animate-[scrollBounce_2s_ease-in-out_infinite]">
          <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-[scrollDot_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
