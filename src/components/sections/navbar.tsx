"use client";

import { useState, useEffect } from "react";
import { Star, ChevronUp, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#profil", label: "Profil" },
  { href: "#visi-misi", label: "Visi & Misi" },
  { href: "#berita", label: "Berita" },
  { href: "#kompetensi", label: "Kompetensi" },
  { href: "#fasilitas", label: "Fasilitas" },
  { href: "#galeri", label: "Galeri" },
  { href: "#kontak", label: "Kontak" },
];

export { navLinks };

export function Navbar({ onOpenPendaftaran }: { onOpenPendaftaran: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#beranda" className="flex items-center gap-2 sm:gap-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center ${
                !scrolled ? "ring-2 ring-white/30" : "ring-2 ring-islamic-green/20"
              }`}
            >
              <img
                src="/logo-pesantren.jpeg"
                alt="Logo Pesantren Ar-Rahmah"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-sm sm:text-base leading-tight ${
                  scrolled ? "text-islamic-green" : "text-white"
                }`}
              >
                Ar-Rahmah
              </span>
              <span
                className={`text-[10px] sm:text-xs leading-tight ${
                  scrolled ? "text-islamic-gold" : "text-islamic-gold-lighter"
                }`}
              >
                Dewan Da&apos;wah
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? "text-foreground/70 hover:text-islamic-green hover:bg-islamic-green-50"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </a>
            ))}
            <Button
              size="sm"
              onClick={onOpenPendaftaran}
              className="ml-2 bg-islamic-gold hover:bg-islamic-gold-light text-white font-semibold"
            >
              Daftar Sekarang
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className={`w-6 h-6 ${scrolled ? "text-islamic-green" : "text-white"}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? "text-islamic-green" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu - using CSS transition instead of framer-motion */}
      <div
        className={`md:hidden bg-white border-t shadow-lg overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-foreground/70 hover:text-islamic-green hover:bg-islamic-green-50 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            className="w-full mt-2 bg-islamic-gold hover:bg-islamic-gold-light text-white font-semibold"
            onClick={() => {
              setMobileOpen(false);
              onOpenPendaftaran();
            }}
          >
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </nav>
  );
}
