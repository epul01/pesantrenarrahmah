"use client";

import { useState, useEffect } from "react";
import { Download, FileArchive, FileText, X, Github, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function DownloadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white p-6 pb-8">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Download className="w-6 h-6" />
            Download Website
          </DialogTitle>
          <DialogDescription className="text-white/80 mt-1">
            Unduh source code lengkap website Pesantren Ar-Rahmah untuk di-deploy ke Vercel
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* File ZIP utama */}
          <div className="border-2 border-islamic-green/20 rounded-xl p-5 bg-islamic-green-50/50 hover:border-islamic-green/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-islamic-green/10 flex items-center justify-center flex-shrink-0">
                <FileArchive className="w-6 h-6 text-islamic-green" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-islamic-green flex items-center gap-2 flex-wrap">
                  Source Code Website (ZIP)
                  <span className="text-xs font-normal bg-islamic-green/10 text-islamic-green px-2 py-0.5 rounded-full">
                    2.9 MB
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Berisi seluruh source code: komponen, halaman, API routes, gambar, konfigurasi, dan dokumentasi deploy.
                </p>
                <a href="/pesantren-arrahmah-website.zip" download>
                  <Button className="mt-3 bg-islamic-green hover:bg-islamic-green-dark text-white w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Tutorial PDF */}
          <div className="border-2 border-islamic-gold/20 rounded-xl p-5 bg-amber-50/50 hover:border-islamic-gold/40 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-islamic-gold/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-islamic-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-islamic-gold flex items-center gap-2 flex-wrap">
                  Tutorial Deploy ke Vercel (PDF)
                  <span className="text-xs font-normal bg-islamic-gold/10 text-islamic-gold px-2 py-0.5 rounded-full">
                    426 KB
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Panduan langkah demi langkah (10 halaman) untuk men-deploy website ke Vercel + setup Supabase.
                </p>
                <a href="/Tutorial-Deploy-Vercel.pdf" download>
                  <Button variant="outline" className="mt-3 border-islamic-gold text-islamic-gold hover:bg-islamic-gold/10 w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Langkah selanjutnya */}
          <div className="rounded-xl bg-muted/40 p-5">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-islamic-green" />
              Langkah Setelah Download
            </h4>
            <ol className="space-y-2.5 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-islamic-green text-white text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Extract</strong> file ZIP di komputer Anda
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-islamic-green text-white text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Upload ke GitHub</strong> — buat repository baru, lalu upload semua file
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-islamic-green text-white text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Import ke Vercel</strong> — buka vercel.com, login dengan GitHub, import repository
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-islamic-green text-white text-xs font-bold flex items-center justify-center">4</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Set Environment Variables</strong> — ikuti panduan di PDF tutorial
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-islamic-green text-white text-xs font-bold flex items-center justify-center">5</span>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Klik Deploy</strong> — website online dalam 2 menit!
                </span>
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-islamic-green flex-shrink-0 mt-0.5" />
              Semua kredensial Supabase & SQL schema sudah ada di dalam PDF tutorial
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DownloadButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 bg-islamic-green hover:bg-islamic-green-dark text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Download website"
      >
        <Download className="w-5 h-5 group-hover:animate-bounce" />
        <span className="font-semibold text-sm hidden sm:inline">Download</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-gold rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-gold rounded-full" />
      </button>
      <DownloadModal open={open} onOpenChange={setOpen} />
    </>
  );
}
