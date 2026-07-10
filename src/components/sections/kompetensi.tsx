"use client";

import { BookMarked, ScrollText, BookOpen, Mic, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const competencies = [
  {
    icon: BookMarked,
    title: "Hafal Al-Qur'an",
    desc: "Hafal Al-Qur'an minimal 15 juz dengan bacaan yang benar sesuai kaidah tajwid.",
  },
  {
    icon: ScrollText,
    title: "Bahasa Arab",
    desc: "Penguasaan dasar bahasa Arab.",
  },
  {
    icon: BookOpen,
    title: "Hafal Hadits",
    desc: "Hafal Hadits Arba'in dan hadits-hadits sahih lainnya dalam masalah aqidah, fikih dan akhlak.",
  },
  {
    icon: Mic,
    title: "Kemampuan Ceramah",
    desc: "Memiliki kemampuan berceramah dengan baik.",
  },
];

export function KompetensiSection() {
  return (
    <section id="kompetensi" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-islamic-gold-50 rounded-full mb-4">
            <GraduationCap className="w-4 h-4 text-islamic-gold" />
            <span className="text-sm font-medium text-islamic-gold">Kompetensi Lulusan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Capaian <span className="text-islamic-gold">Kompetensi</span> Lulusan
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Setiap santri yang lulus dari Pesantren Ar-Rahmah akan memiliki
            kompetensi yang memadai untuk menjadi da&apos;i dan penghafal Al Qur&apos;an.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {competencies.map((comp, i) => (
            <div
              key={i}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-b from-white to-islamic-green-50/50 hover:-translate-y-1">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-islamic-green to-islamic-green-light flex items-center justify-center shadow-lg shadow-islamic-green/20 group-hover:scale-110 transition-transform duration-300">
                    <comp.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{comp.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{comp.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
