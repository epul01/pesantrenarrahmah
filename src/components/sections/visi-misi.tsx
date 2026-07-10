"use client";

import { Star, Award, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const missions = [
  "Mewujudkan santri hafidzul qur'an yang memiliki komitmen mengamalkan dan menda'wahkan Al Qur'an",
  "Mewujudkan pribadi muslim yang beraqidah dan beramal sesuai Al Qur'an dan As Sunnah dengan pemahaman Ashshalafus shalih",
  "Mencetak santri menjadi muslimah solehah dan da'iyah Ilallah yang Tafaquh Fiddin di masa yang akan datang",
  "Menanamkan pada diri santri agar memiliki akhlaqul karimah dalam bermuamalah dan berhidmah di masyarakat",
];

export function VisiMisiSection() {
  return (
    <section id="visi-misi" className="py-16 sm:py-24 bg-gradient-to-b from-islamic-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-green-50 rounded-full mb-4">
            <Star className="w-4 h-4 text-islamic-green" />
            <span className="text-sm font-medium text-islamic-green">Visi & Misi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Arah dan Tujuan <span className="text-islamic-green">Pesantren</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div
            className="animate-fade-in-up"
          >
            <Card className="h-full border-2 border-islamic-green/10 hover:border-islamic-green/20 transition-colors shadow-lg overflow-hidden">
              <div className="bg-islamic-green p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">VISI</h3>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8">
                <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed font-medium italic border-l-4 border-islamic-gold pl-6">
                  &quot;Upaya melahirkan da&apos;i sejak dini, yang cinta ilmu,
                  cinta da&apos;wah, berakhlaqul karimah dan beraqidah sahihah&quot;
                </blockquote>
              </CardContent>
            </Card>
          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Card className="h-full border-2 border-islamic-gold/10 hover:border-islamic-gold/20 transition-colors shadow-lg overflow-hidden">
              <div className="bg-islamic-gold p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">MISI</h3>
                </div>
              </div>
              <CardContent className="p-6 sm:p-8">
                <ol className="space-y-5">
                  {missions.map((mission, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-islamic-gold/10 text-islamic-gold font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed pt-1">{mission}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
