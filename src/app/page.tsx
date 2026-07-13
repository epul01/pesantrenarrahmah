"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { HeroSection } from "@/components/sections/hero";
import { ProfileSection } from "@/components/sections/profile";
import { VisiMisiSection } from "@/components/sections/visi-misi";
import { BeritaSection } from "@/components/sections/berita";
import { KompetensiSection } from "@/components/sections/kompetensi";
import { FasilitasSection } from "@/components/sections/fasilitas";
import { GaleriSection } from "@/components/sections/galeri";
import { KontakSection, Footer } from "@/components/sections/kontak";
import { PendaftaranModal } from "@/components/sections/pendaftaran-modal";
import { ScrollToTop } from "@/components/sections/scroll-to-top";

export default function Home() {
  const [pendaftaranOpen, setPendaftaranOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleOpenPendaftaran = () => {
    setResetKey((prev) => prev + 1);
    setPendaftaranOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenPendaftaran={handleOpenPendaftaran} />
      <main className="flex-1">
        <HeroSection onOpenPendaftaran={handleOpenPendaftaran} />
        <ProfileSection />
        <VisiMisiSection />
        <BeritaSection />
        <KompetensiSection />
        <FasilitasSection />
        <GaleriSection />
        <KontakSection onOpenPendaftaran={handleOpenPendaftaran} />
      </main>
      <Footer />
      <PendaftaranModal
        open={pendaftaranOpen}
        onOpenChange={setPendaftaranOpen}
        resetKey={resetKey}
      />
      <ScrollToTop />
    </div>
  );
}
