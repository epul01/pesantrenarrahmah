"use client";

import { Home as HomeIcon, Building, Utensils, Library, GraduationCap, Coffee, TreeDeciduous, LandPlot, Dumbbell, Tent, TreePine } from "lucide-react";

const facilities = [
  { icon: HomeIcon, label: "Asrama" },
  { icon: Building, label: "Masjid & Musholla" },
  { icon: Utensils, label: "Dapur" },
  { icon: Library, label: "Perpustakaan" },
  { icon: GraduationCap, label: "Ruang Belajar" },
  { icon: Coffee, label: "Ruang Makan" },
  { icon: Building, label: "Aula" },
  { icon: TreeDeciduous, label: "Halaman Luas & Sejuk" },
  { icon: LandPlot, label: "Kebun 2 Hektar" },
  { icon: Dumbbell, label: "Lapangan Olahraga" },
  { icon: Tent, label: "Gazebo-gazebo" },
];

export function FasilitasSection() {
  return (
    <section id="fasilitas" className="py-16 sm:py-24 bg-islamic-green relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="text-center mb-12 sm:mb-16 animate-fade-in-up"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
            <TreePine className="w-4 h-4 text-islamic-gold-lighter" />
            <span className="text-sm font-medium text-islamic-gold-lighter">Fasilitas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Fasilitas <span className="text-islamic-gold-lighter">Pesantren</span>
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Lingkungan belajar yang nyaman dan lengkap untuk mendukung proses pendidikan santri.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {facilities.map((facility, i) => (
            <div
              key={i}
              className="animate-fade-in-scale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="group bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 text-center hover:bg-white/20 hover:border-islamic-gold/30 transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-islamic-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <facility.icon className="w-6 h-6 sm:w-7 sm:h-7 text-islamic-gold-lighter" />
                </div>
                <p className="text-white font-medium text-sm sm:text-base">{facility.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
