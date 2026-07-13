"use client";

import { Building, Heart, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProfileSection() {
  return (
    <section id="profil" className="py-16 sm:py-24 bg-white bg-islamic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div
            className="relative animate-fade-in-left"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/profil-pesantren.jpeg"
                alt="Pesantren Ar-Rahmah"
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-islamic-green/30 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-islamic-gold/30 rounded-2xl -z-10" />
            <div className="absolute -bottom-6 left-6 right-6 sm:left-8 sm:right-8">
              <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 flex justify-around">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-islamic-green">15+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Juz Hafalan</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-islamic-gold">24/7</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Pembimbing</p>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-islamic-green">2 Ha</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Luas Area</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-8 lg:mt-0 animate-fade-in-right"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-green-50 rounded-full mb-4">
              <Building className="w-4 h-4 text-islamic-green" />
              <span className="text-sm font-medium text-islamic-green">Profil Pesantren</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
              Pesantren{" "}
              <span className="text-islamic-green">Ar-Rahmah</span>{" "}
              <span className="text-islamic-gold">Dewan Da&apos;wah</span>
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
              Pesantren Ar-Rahmah Dewan Da&apos;wah adalah lembaga pendidikan
              tahfidz Al Quran dan pengkaderan da&apos;i Ilallah sejak usia dini,
              yang didirikan oleh Dewan Da&apos;wah Islamiyah Indonesia, dan para
              santrinya berasal dari berbagai daerah di Indonesia.
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
              Mari bergabung bersama barisan para penghafal Al Qur&apos;an dan
              kader-kader da&apos;i dan da&apos;iyah Ilallah.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#visi-misi">
                <Button className="bg-islamic-green hover:bg-islamic-green-light text-white font-semibold px-6">
                  <Heart className="w-4 h-4 mr-2" />
                  Visi & Misi
                </Button>
              </a>
              <a href="#fasilitas">
                <Button
                  variant="outline"
                  className="border-islamic-green text-islamic-green hover:bg-islamic-green-50 font-semibold px-6"
                >
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Fasilitas
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
