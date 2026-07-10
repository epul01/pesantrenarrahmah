"use client";

import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "./navbar";

export function KontakSection({ onOpenPendaftaran }: { onOpenPendaftaran: () => void }) {
  return (
    <section id="kontak" className="py-16 sm:py-24 bg-white bg-islamic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-green-50 rounded-full mb-4">
            <Phone className="w-4 h-4 text-islamic-green" />
            <span className="text-sm font-medium text-islamic-green">Hubungi Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Segera <span className="text-islamic-green">Bergabung!</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami dan mendaftarkan putra-putri Anda
            menjadi bagian dari keluarga besar Pesantren Ar-Rahmah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div
            className="space-y-6 animate-fade-in-left"
          >
            <Card className="border-2 border-islamic-green/10 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-islamic-green mb-6">Informasi Kontak</h3>
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-islamic-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Alamat</p>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Pesantren Ar-Rahmah Dewan Da&apos;wah Putra<br />
                      Kp. Lemburkaung, Kec. Sukaraja<br />
                      Kab. Sukabumi, Jawa Barat 43192
                    </p>
                  </div>
                </div>
                <Separator className="my-5" />
                <div className="flex gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-islamic-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-islamic-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Call Center</p>
                    <a href="tel:085703465155" className="text-islamic-green hover:text-islamic-green-light transition-colors text-sm sm:text-base block">
                      085703465155
                    </a>
                    <a href="tel:085284860706" className="text-islamic-green hover:text-islamic-green-light transition-colors text-sm sm:text-base block">
                      085284860706
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <a href="https://wa.me/6285703465155" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-islamic-green hover:bg-islamic-green-light text-white font-bold text-lg py-6 shadow-lg shadow-islamic-green/20">
                <Phone className="w-5 h-5 mr-2" />
                Hubungi via WhatsApp
              </Button>
            </a>
          </div>

          <div
            className="animate-fade-in-right"
          >
            <Card className="h-full border-2 border-islamic-gold/10 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-islamic-green to-islamic-green-light p-8 sm:p-10 text-white flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 flex items-center justify-center mb-6 ring-2 ring-islamic-gold-lighter/30 overflow-hidden">
                  <img src="/logo-pesantren.jpeg" alt="Logo Pesantren Ar-Rahmah" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-center mb-4">Daftar Sekarang!</h3>
                <p className="text-white/80 text-center mb-8 max-w-sm leading-relaxed">
                  Wujudkan impian putra-putri Anda menjadi penghafal Al Qur&apos;an dan kader da&apos;i Ilallah.
                </p>
                <Button className="bg-islamic-gold hover:bg-islamic-gold-light text-white font-bold text-lg px-10 py-6 shadow-lg" onClick={onOpenPendaftaran}>
                  Daftar Sekarang
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-islamic-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden ring-2 ring-islamic-gold-lighter/30">
                <img src="/logo-pesantren.jpeg" alt="Logo Pesantren Ar-Rahmah" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-lg">Ar-Rahmah</p>
                <p className="text-islamic-gold-lighter text-xs">Dewan Da&apos;wah</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Melahirkan Da&apos;i Sejak Dini, Cinta Ilmu, Cinta Da&apos;wah, dan Berakhlakul Karimah.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-islamic-gold-lighter mb-4">Navigasi</h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="block text-white/60 hover:text-white text-sm transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-islamic-gold-lighter mb-4">Kontak</h4>
            <div className="space-y-3 text-sm text-white/60">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Kp. Lemburkaung, Kec. Sukaraja, Kab. Sukabumi, Jawa Barat 43192
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                085703465155 / 085284860706
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <a href="/admin" className="text-xs text-white/30 hover:text-white/60 transition-colors inline-flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Panel
              </a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-white/10" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Pesantren Ar-Rahmah Dewan Da&apos;wah. All rights reserved.</p>
          <p className="text-islamic-gold/50 italic">رَبِّ زِدْنِي عِلْمًا</p>
        </div>
      </div>
    </footer>
  );
}
