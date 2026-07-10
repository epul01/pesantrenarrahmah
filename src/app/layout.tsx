import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pesantren Ar-Rahmah Dewan Da'wah - Melahirkan Da'i Sejak Dini",
  description:
    "Pesantren Ar-Rahmah Dewan Da'wah adalah lembaga pendidikan tahfidz Al Quran dan pengkaderan da'i Ilallah sejak usia dini. Cinta Ilmu, Cinta Da'wah, dan Berakhlakul Karimah.",
  keywords: [
    "Pesantren",
    "Ar-Rahmah",
    "Dewan Da'wah",
    "Tahfidz",
    "Al Quran",
    "Pondok Pesantren",
    "Sukabumi",
  ],
  authors: [{ name: "Pesantren Ar-Rahmah Dewan Da'wah" }],
  icons: {
    icon: "/logo-pesantren.jpeg",
  },
  openGraph: {
    title: "Pesantren Ar-Rahmah Dewan Da'wah",
    description:
      "Melahirkan Da'i Sejak Dini, Cinta Ilmu, Cinta Da'wah, dan Berakhlakul Karimah",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
