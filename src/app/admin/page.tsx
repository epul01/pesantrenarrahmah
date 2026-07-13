"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  Newspaper,
  ImageIcon,
  Home,
  Plus,
  Pencil,
  Trash2,
  Upload,
  LinkIcon,
  Menu,
  X,
  ChevronRight,
  FileText,
  Calendar,
  TrendingUp,
  Loader2,
  Image as ImageLucide,
  Search,
  AlertCircle,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// ============================================================
// Types
// ============================================================
interface Berita {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string | null;
  kategori: string;
  gambar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Galeri {
  id: string;
  judul: string;
  deskripsi: string | null;
  gambar_url: string;
  created_at: string;
  updated_at: string;
}

interface BeritaInput {
  judul: string;
  ringkasan: string;
  konten?: string | null;
  kategori: string;
  gambar_url?: string | null;
}

interface GaleriInput {
  judul: string;
  deskripsi?: string | null;
  gambar_url: string;
}

type ViewType = "dashboard" | "berita" | "galeri";

// ============================================================
// Helper: format date to Indonesian locale
// ============================================================
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ============================================================
// Main Admin Dashboard Component
// ============================================================
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Data state
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [beritaSearch, setBeritaSearch] = useState("");
  const [galeriSearch, setGaleriSearch] = useState("");

  // Berita form state
  const [beritaDialogOpen, setBeritaDialogOpen] = useState(false);
  const [editingBerita, setEditingBerita] = useState<Berita | null>(null);
  const [beritaForm, setBeritaForm] = useState<BeritaInput>({
    judul: "",
    ringkasan: "",
    konten: "",
    kategori: "Kegiatan",
    gambar_url: "",
  });
  const [beritaImageMode, setBeritaImageMode] = useState<"upload" | "url">(
    "url"
  );
  const [beritaUploading, setBeritaUploading] = useState(false);
  const [beritaSubmitting, setBeritaSubmitting] = useState(false);

  // Galeri form state
  const [galeriDialogOpen, setGaleriDialogOpen] = useState(false);
  const [editingGaleri, setEditingGaleri] = useState<Galeri | null>(null);
  const [galeriForm, setGaleriForm] = useState<GaleriInput>({
    judul: "",
    deskripsi: "",
    gambar_url: "",
  });
  const [galeriImageMode, setGaleriImageMode] = useState<"upload" | "url">(
    "url"
  );
  const [galeriUploading, setGaleriUploading] = useState(false);
  const [galeriSubmitting, setGaleriSubmitting] = useState(false);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "berita" | "galeri";
    id: string;
    judul: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ============================================================
  // Fetch data
  // ============================================================
  const fetchBerita = useCallback(async () => {
    try {
      const res = await fetch("/api/berita");
      const json = await res.json();
      if (json.message && json.message.includes("belum dikonfigurasi")) {
        setSupabaseConfigured(false);
        setBeritaList([]);
        return;
      }
      if (!res.ok) throw new Error("Gagal mengambil data berita");
      setBeritaList(json.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data berita");
    }
  }, []);

  const fetchGaleri = useCallback(async () => {
    try {
      const res = await fetch("/api/galeri");
      const json = await res.json();
      if (json.message && json.message.includes("belum dikonfigurasi")) {
        setSupabaseConfigured(false);
        setGaleriList([]);
        return;
      }
      if (!res.ok) throw new Error("Gagal mengambil data galeri");
      setGaleriList(json.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data galeri");
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBerita(), fetchGaleri()]);
    setLoading(false);
  }, [fetchBerita, fetchGaleri]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================================
  // Logout handler
  // ============================================================
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Redirect ke halaman login
      window.location.href = "/admin/login";
    } catch (e) {
      console.error("Logout error:", e);
      // Fallback: redirect paksa
      window.location.href = "/admin/login";
    } finally {
      setLoggingOut(false);
    }
  };

  // ============================================================
  // Image upload handler
  // ============================================================
  const handleImageUpload = async (
    file: File,
    folder: string
  ): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal mengupload gambar");
    }

    const data = await res.json();
    return data.url;
  };

  // ============================================================
  // Berita CRUD
  // ============================================================
  const openBeritaDialog = (berita?: Berita) => {
    if (berita) {
      setEditingBerita(berita);
      setBeritaForm({
        judul: berita.judul,
        ringkasan: berita.ringkasan,
        konten: berita.konten || "",
        kategori: berita.kategori,
        gambar_url: berita.gambar_url || "",
      });
      setBeritaImageMode(berita.gambar_url ? "url" : "url");
    } else {
      setEditingBerita(null);
      setBeritaForm({
        judul: "",
        ringkasan: "",
        konten: "",
        kategori: "Kegiatan",
        gambar_url: "",
      });
      setBeritaImageMode("url");
    }
    setBeritaDialogOpen(true);
  };

  const handleBeritaImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBeritaUploading(true);
    try {
      const url = await handleImageUpload(file, "berita");
      if (url) {
        setBeritaForm((prev) => ({ ...prev, gambar_url: url }));
        toast.success("Gambar berhasil diupload");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengupload";
      toast.error(message);
    } finally {
      setBeritaUploading(false);
    }
  };

  const submitBerita = async () => {
    if (!beritaForm.judul.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    if (!beritaForm.ringkasan.trim()) {
      toast.error("Ringkasan wajib diisi");
      return;
    }
    if (!beritaForm.kategori) {
      toast.error("Kategori wajib dipilih");
      return;
    }

    setBeritaSubmitting(true);
    try {
      const payload: BeritaInput = {
        judul: beritaForm.judul,
        ringkasan: beritaForm.ringkasan,
        konten: beritaForm.konten || null,
        kategori: beritaForm.kategori,
        gambar_url: beritaForm.gambar_url || null,
      };

      let res: Response;
      if (editingBerita) {
        res = await fetch(`/api/berita/${editingBerita.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/berita", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan berita");
      }

      toast.success(
        editingBerita
          ? "Berita berhasil diperbarui"
          : "Berita berhasil ditambahkan"
      );
      setBeritaDialogOpen(false);
      fetchBerita();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan berita";
      toast.error(message);
    } finally {
      setBeritaSubmitting(false);
    }
  };

  // ============================================================
  // Galeri CRUD
  // ============================================================
  const openGaleriDialog = (galeri?: Galeri) => {
    if (galeri) {
      setEditingGaleri(galeri);
      setGaleriForm({
        judul: galeri.judul,
        deskripsi: galeri.deskripsi || "",
        gambar_url: galeri.gambar_url,
      });
      setGaleriImageMode("url");
    } else {
      setEditingGaleri(null);
      setGaleriForm({
        judul: "",
        deskripsi: "",
        gambar_url: "",
      });
      setGaleriImageMode("url");
    }
    setGaleriDialogOpen(true);
  };

  const handleGaleriImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGaleriUploading(true);
    try {
      const url = await handleImageUpload(file, "galeri");
      if (url) {
        setGaleriForm((prev) => ({ ...prev, gambar_url: url }));
        toast.success("Gambar berhasil diupload");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengupload";
      toast.error(message);
    } finally {
      setGaleriUploading(false);
    }
  };

  const submitGaleri = async () => {
    if (!galeriForm.judul.trim()) {
      toast.error("Judul wajib diisi");
      return;
    }
    if (!galeriForm.gambar_url.trim()) {
      toast.error("Gambar wajib diisi");
      return;
    }

    setGaleriSubmitting(true);
    try {
      const payload: GaleriInput = {
        judul: galeriForm.judul,
        deskripsi: galeriForm.deskripsi || null,
        gambar_url: galeriForm.gambar_url,
      };

      let res: Response;
      if (editingGaleri) {
        res = await fetch(`/api/galeri/${editingGaleri.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/galeri", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan galeri");
      }

      toast.success(
        editingGaleri
          ? "Galeri berhasil diperbarui"
          : "Galeri berhasil ditambahkan"
      );
      setGaleriDialogOpen(false);
      fetchGaleri();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan galeri";
      toast.error(message);
    } finally {
      setGaleriSubmitting(false);
    }
  };

  // ============================================================
  // Delete handler
  // ============================================================
  const openDeleteDialog = (
    type: "berita" | "galeri",
    id: string,
    judul: string
  ) => {
    setDeleteTarget({ type, id, judul });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/${deleteTarget.type}/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.error || `Gagal menghapus ${deleteTarget.type}`
        );
      }

      toast.success(
        deleteTarget.type === "berita"
          ? "Berita berhasil dihapus"
          : "Galeri berhasil dihapus"
      );
      setDeleteDialogOpen(false);
      setDeleteTarget(null);

      if (deleteTarget.type === "berita") {
        fetchBerita();
      } else {
        fetchGaleri();
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // Computed data
  // ============================================================
  const kategoriBerita = Array.from(
    new Set(beritaList.map((b) => b.kategori))
  );

  const filteredBerita = beritaList.filter(
    (b) =>
      b.judul.toLowerCase().includes(beritaSearch.toLowerCase()) ||
      b.kategori.toLowerCase().includes(beritaSearch.toLowerCase())
  );

  const filteredGaleri = galeriList.filter(
    (g) =>
      g.judul.toLowerCase().includes(galeriSearch.toLowerCase()) ||
      (g.deskripsi || "").toLowerCase().includes(galeriSearch.toLowerCase())
  );

  const recentItems = [
    ...beritaList.slice(0, 3).map((b) => ({
      type: "berita" as const,
      judul: b.judul,
      date: b.created_at,
      kategori: b.kategori,
    })),
    ...galeriList.slice(0, 3).map((g) => ({
      type: "galeri" as const,
      judul: g.judul,
      date: g.created_at,
      kategori: "Galeri",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ============================================================
  // Sidebar navigation items
  // ============================================================
  const navItems = [
    {
      key: "dashboard" as ViewType,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      key: "berita" as ViewType,
      label: "Berita Pesantren",
      icon: Newspaper,
    },
    {
      key: "galeri" as ViewType,
      label: "Galeri Pesantren",
      icon: ImageIcon,
    },
  ];

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ======================================================== */}
      {/* Mobile Overlay */}
      {/* ======================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================================================== */}
      {/* Left Sidebar */}
      {/* ======================================================== */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1B5E20] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-islamic-gold flex items-center justify-center">
              <span className="text-[#1B5E20] font-bold text-sm">AR</span>
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">
                Ar-Rahmah
              </p>
              <p className="text-[10px] text-white/60 leading-tight">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveView(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}

          <Separator className="my-3 bg-white/10" />

          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span>Kembali ke Website</span>
          </a>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-[10px] text-white/40 text-center">
            Pesantren Ar-Rahmah &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* Main Content Area */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ====================================================== */}
        {/* Top Admin Bar */}
        {/* ====================================================== */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-gray-800 hidden sm:block">
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "berita" && "Manajemen Berita"}
                {activeView === "galeri" && "Manajemen Galeri"}
              </h1>
              <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
              <span className="text-xs text-gray-500 hidden sm:block">
                Pesantren Ar-Rahmah Dewan Da&apos;wah
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-xs text-[#1B5E20] hover:text-[#2E7D32] font-medium flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kembali ke Website</span>
            </a>
            <div className="h-4 w-px bg-gray-300" />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-medium flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-md disabled:opacity-60"
              title="Keluar dari admin panel"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{loggingOut ? "Keluar..." : "Logout"}</span>
            </button>
          </div>
        </header>

        {/* ====================================================== */}
        {/* Page Content */}
        {/* ====================================================== */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#1B5E20] mx-auto mb-3" />
                <p className="text-sm text-gray-500">Memuat data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* ========== DASHBOARD VIEW ========== */}
              {activeView === "dashboard" && (
                <div className="space-y-6">
                  {/* Supabase Setup Banner */}
                  {!supabaseConfigured && (
                    <Card className="border-2 border-amber-400 bg-amber-50">
                      <CardContent className="p-5">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-amber-800 mb-1">
                              Supabase Belum Dikonfigurasi
                            </h3>
                            <p className="text-sm text-amber-700 mb-3">
                              Untuk menggunakan admin panel, Anda perlu mengatur kredensial Supabase terlebih dahulu.
                            </p>
                            <div className="bg-white rounded-lg p-4 text-sm space-y-2 border border-amber-200">
                              <p className="font-semibold text-gray-800">Langkah-langkah:</p>
                              <ol className="list-decimal list-inside space-y-1 text-gray-600">
                                <li>Buat project baru di <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#1B5E20] underline">supabase.com</a></li>
                                <li>Salin Project URL dan anon key dari Settings → API</li>
                                <li>Salin service_role key dari Settings → API</li>
                                <li>Edit file <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">.env.local</code> dan isi kredensial</li>
                                <li>Jalankan SQL schema di <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">supabase-schema.sql</code> melalui SQL Editor Supabase</li>
                                <li>Restart dev server</li>
                              </ol>
                              <div className="mt-3 p-3 bg-gray-50 rounded border text-xs font-mono">
                                <p className="text-gray-500 mb-1">File .env.local:</p>
                                <p>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</p>
                                <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</p>
                                <p>SUPABASE_SERVICE_ROLE_KEY=eyJ...</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Selamat Datang di Admin Panel
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Kelola konten website Pesantren Ar-Rahmah Dewan
                      Da&apos;wah
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-[#1B5E20]">
                      <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                          <Newspaper className="w-4 h-4 text-[#1B5E20]" />
                          Total Berita
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#1B5E20]">
                          {beritaList.length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          artikel berita
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-[#C9A84C]">
                      <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#C9A84C]" />
                          Total Galeri
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#C9A84C]">
                          {galeriList.length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          item galeri
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-[#4CAF50]">
                      <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#4CAF50]" />
                          Kategori Berita
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[#4CAF50]">
                          {kategoriBerita.length}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {kategoriBerita.map((k) => (
                            <Badge
                              key={k}
                              variant="secondary"
                              className="text-[10px]"
                            >
                              {k}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                      <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                          Total Konten
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-600">
                          {beritaList.length + galeriList.length}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          total item konten
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Kategori Breakdown & Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kategori Breakdown */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Kategori Berita
                        </CardTitle>
                        <CardDescription>
                          Distribusi berita berdasarkan kategori
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {kategoriBerita.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            Belum ada berita
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {kategoriBerita.map((k) => {
                              const count = beritaList.filter(
                                (b) => b.kategori === k
                              ).length;
                              const percentage =
                                beritaList.length > 0
                                  ? Math.round(
                                      (count / beritaList.length) * 100
                                    )
                                  : 0;
                              return (
                                <div key={k}>
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">
                                      {k}
                                    </span>
                                    <span className="text-gray-500">
                                      {count} ({percentage}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-[#1B5E20] h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Aktivitas Terbaru
                        </CardTitle>
                        <CardDescription>
                          Item konten terbaru yang ditambahkan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentItems.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            Belum ada aktivitas
                          </p>
                        ) : (
                          <div className="space-y-3 max-h-64 overflow-y-auto">
                            {recentItems.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                              >
                                <div
                                  className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                                    item.type === "berita"
                                      ? "bg-[#E8F5E9] text-[#1B5E20]"
                                      : "bg-[#FFF8E1] text-[#C9A84C]"
                                  }`}
                                >
                                  {item.type === "berita" ? (
                                    <Newspaper className="w-4 h-4" />
                                  ) : (
                                    <ImageIcon className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate">
                                    {item.judul}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1 py-0"
                                    >
                                      {item.kategori}
                                    </Badge>
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDateShort(item.date)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Aksi Cepat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => {
                            setActiveView("berita");
                            setTimeout(() => openBeritaDialog(), 100);
                          }}
                          className="bg-[#1B5E20] hover:bg-[#2E7D32]"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Berita
                        </Button>
                        <Button
                          onClick={() => {
                            setActiveView("galeri");
                            setTimeout(() => openGaleriDialog(), 100);
                          }}
                          className="bg-[#C9A84C] hover:bg-[#D4B96A] text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Galeri
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== BERITA VIEW ========== */}
              {activeView === "berita" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Manajemen Berita
                      </h2>
                      <p className="text-sm text-gray-500">
                        Kelola berita dan artikel pesantren
                      </p>
                    </div>
                    <Button
                      onClick={() => openBeritaDialog()}
                      className="bg-[#1B5E20] hover:bg-[#2E7D32] self-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Berita
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Cari berita..."
                      value={beritaSearch}
                      onChange={(e) => setBeritaSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Berita Table */}
                  <Card>
                    <CardContent className="p-0">
                      {filteredBerita.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                          <Newspaper className="w-12 h-12 mb-3" />
                          <p className="text-sm font-medium">
                            {beritaSearch
                              ? "Tidak ada berita yang cocok"
                              : "Belum ada berita"}
                          </p>
                          <p className="text-xs mt-1">
                            Klik &quot;Tambah Berita&quot; untuk menambah berita
                            baru
                          </p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Gambar</TableHead>
                              <TableHead>Judul</TableHead>
                              <TableHead className="w-32 hidden md:table-cell">
                                Kategori
                              </TableHead>
                              <TableHead className="w-36 hidden sm:table-cell">
                                Tanggal
                              </TableHead>
                              <TableHead className="w-24 text-right">
                                Aksi
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredBerita.map((berita) => (
                              <TableRow key={berita.id}>
                                <TableCell>
                                  {berita.gambar_url ? (
                                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                                      <img
                                        src={berita.gambar_url}
                                        alt={berita.judul}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                      <ImageLucide className="w-4 h-4 text-gray-400" />
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-xs">
                                    <p className="font-medium text-sm text-gray-800 truncate">
                                      {berita.judul}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {berita.ringkasan}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <Badge
                                    variant={
                                      berita.kategori === "Kegiatan"
                                        ? "default"
                                        : berita.kategori === "Pendaftaran"
                                          ? "secondary"
                                          : "outline"
                                    }
                                    className={
                                      berita.kategori === "Kegiatan"
                                        ? "bg-[#1B5E20] hover:bg-[#2E7D32]"
                                        : berita.kategori === "Pendaftaran"
                                          ? "bg-[#C9A84C] hover:bg-[#D4B96A] text-white"
                                          : ""
                                    }
                                  >
                                    {berita.kategori}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <span className="text-xs text-gray-500">
                                    {formatDateShort(berita.created_at)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openBeritaDialog(berita)}
                                      className="h-8 w-8 p-0 text-gray-500 hover:text-[#1B5E20]"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        openDeleteDialog(
                                          "berita",
                                          berita.id,
                                          berita.judul
                                        )
                                      }
                                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* ========== GALERI VIEW ========== */}
              {activeView === "galeri" && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        Manajemen Galeri
                      </h2>
                      <p className="text-sm text-gray-500">
                        Kelola galeri foto pesantren
                      </p>
                    </div>
                    <Button
                      onClick={() => openGaleriDialog()}
                      className="bg-[#1B5E20] hover:bg-[#2E7D32] self-start"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Galeri
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Cari galeri..."
                      value={galeriSearch}
                      onChange={(e) => setGaleriSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Galeri Grid / Table */}
                  {filteredGaleri.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-3" />
                        <p className="text-sm font-medium">
                          {galeriSearch
                            ? "Tidak ada galeri yang cocok"
                            : "Belum ada galeri"}
                        </p>
                        <p className="text-xs mt-1">
                          Klik &quot;Tambah Galeri&quot; untuk menambah galeri
                          baru
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {/* Grid view for larger screens */}
                      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredGaleri.map((galeri) => (
                          <Card
                            key={galeri.id}
                            className="overflow-hidden group"
                          >
                            <div className="aspect-video relative bg-gray-100">
                              <img
                                src={galeri.gambar_url}
                                alt={galeri.judul}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => openGaleriDialog(galeri)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    openDeleteDialog(
                                      "galeri",
                                      galeri.id,
                                      galeri.judul
                                    )
                                  }
                                  className="h-8 w-8 p-0 hover:bg-red-100"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-3">
                              <p className="font-medium text-sm text-gray-800 truncate">
                                {galeri.judul}
                              </p>
                              {galeri.deskripsi && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {galeri.deskripsi}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400 mt-1">
                                {formatDate(galeri.created_at)}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Table view for mobile */}
                      <Card className="md:hidden">
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-16">Foto</TableHead>
                                <TableHead>Judul</TableHead>
                                <TableHead className="w-24 text-right">
                                  Aksi
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredGaleri.map((galeri) => (
                                <TableRow key={galeri.id}>
                                  <TableCell>
                                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                                      <img
                                        src={galeri.gambar_url}
                                        alt={galeri.judul}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <p className="font-medium text-sm text-gray-800 truncate max-w-[150px]">
                                      {galeri.judul}
                                    </p>
                                    {galeri.deskripsi && (
                                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                        {galeri.deskripsi}
                                      </p>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          openGaleriDialog(galeri)
                                        }
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-[#1B5E20]"
                                      >
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          openDeleteDialog(
                                            "galeri",
                                            galeri.id,
                                            galeri.judul
                                          )
                                        }
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* Berita Form Dialog */}
      {/* ======================================================== */}
      <Dialog open={beritaDialogOpen} onOpenChange={setBeritaDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBerita ? "Edit Berita" : "Tambah Berita Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingBerita
                ? "Perbarui informasi berita di bawah ini."
                : "Isi informasi berita baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="berita-judul">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="berita-judul"
                placeholder="Masukkan judul berita"
                value={beritaForm.judul}
                onChange={(e) =>
                  setBeritaForm((prev) => ({
                    ...prev,
                    judul: e.target.value,
                  }))
                }
              />
            </div>

            {/* Ringkasan */}
            <div className="space-y-2">
              <Label htmlFor="berita-ringkasan">
                Ringkasan <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="berita-ringkasan"
                placeholder="Masukkan ringkasan berita"
                value={beritaForm.ringkasan}
                onChange={(e) =>
                  setBeritaForm((prev) => ({
                    ...prev,
                    ringkasan: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            {/* Konten */}
            <div className="space-y-2">
              <Label htmlFor="berita-konten">Konten Lengkap</Label>
              <Textarea
                id="berita-konten"
                placeholder="Masukkan konten berita secara lengkap"
                value={beritaForm.konten || ""}
                onChange={(e) =>
                  setBeritaForm((prev) => ({
                    ...prev,
                    konten: e.target.value,
                  }))
                }
                rows={6}
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label>
                Kategori <span className="text-red-500">*</span>
              </Label>
              <Select
                value={beritaForm.kategori}
                onValueChange={(value) =>
                  setBeritaForm((prev) => ({ ...prev, kategori: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                  <SelectItem value="Pendaftaran">Pendaftaran</SelectItem>
                  <SelectItem value="Prestasi">Prestasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gambar */}
            <div className="space-y-2">
              <Label>Gambar</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={beritaImageMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBeritaImageMode("url")}
                  className={
                    beritaImageMode === "url"
                      ? "bg-[#1B5E20] hover:bg-[#2E7D32]"
                      : ""
                  }
                >
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={
                    beritaImageMode === "upload" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setBeritaImageMode("upload")}
                  className={
                    beritaImageMode === "upload"
                      ? "bg-[#1B5E20] hover:bg-[#2E7D32]"
                      : ""
                  }
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload
                </Button>
              </div>

              {beritaImageMode === "url" ? (
                <Input
                  placeholder="Masukkan URL gambar"
                  value={beritaForm.gambar_url || ""}
                  onChange={(e) =>
                    setBeritaForm((prev) => ({
                      ...prev,
                      gambar_url: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleBeritaImageFileChange}
                    disabled={beritaUploading}
                  />
                  {beritaUploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengupload...
                    </div>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {beritaForm.gambar_url && (
                <div className="mt-2">
                  <div className="w-full max-w-xs aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={beritaForm.gambar_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBeritaDialogOpen(false)}
              disabled={beritaSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={submitBerita}
              disabled={beritaSubmitting}
              className="bg-[#1B5E20] hover:bg-[#2E7D32]"
            >
              {beritaSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : editingBerita ? (
                "Perbarui"
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* Galeri Form Dialog */}
      {/* ======================================================== */}
      <Dialog open={galeriDialogOpen} onOpenChange={setGaleriDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGaleri ? "Edit Galeri" : "Tambah Galeri Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingGaleri
                ? "Perbarui informasi galeri di bawah ini."
                : "Isi informasi galeri baru di bawah ini."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="galeri-judul">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input
                id="galeri-judul"
                placeholder="Masukkan judul galeri"
                value={galeriForm.judul}
                onChange={(e) =>
                  setGaleriForm((prev) => ({
                    ...prev,
                    judul: e.target.value,
                  }))
                }
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="galeri-deskripsi">Deskripsi</Label>
              <Textarea
                id="galeri-deskripsi"
                placeholder="Masukkan deskripsi galeri"
                value={galeriForm.deskripsi || ""}
                onChange={(e) =>
                  setGaleriForm((prev) => ({
                    ...prev,
                    deskripsi: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            {/* Gambar */}
            <div className="space-y-2">
              <Label>
                Gambar <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={galeriImageMode === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGaleriImageMode("url")}
                  className={
                    galeriImageMode === "url"
                      ? "bg-[#1B5E20] hover:bg-[#2E7D32]"
                      : ""
                  }
                >
                  <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                  URL
                </Button>
                <Button
                  type="button"
                  variant={
                    galeriImageMode === "upload" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setGaleriImageMode("upload")}
                  className={
                    galeriImageMode === "upload"
                      ? "bg-[#1B5E20] hover:bg-[#2E7D32]"
                      : ""
                  }
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload
                </Button>
              </div>

              {galeriImageMode === "url" ? (
                <Input
                  placeholder="Masukkan URL gambar"
                  value={galeriForm.gambar_url}
                  onChange={(e) =>
                    setGaleriForm((prev) => ({
                      ...prev,
                      gambar_url: e.target.value,
                    }))
                  }
                />
              ) : (
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleGaleriImageFileChange}
                    disabled={galeriUploading}
                  />
                  {galeriUploading && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengupload...
                    </div>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {galeriForm.gambar_url && (
                <div className="mt-2">
                  <div className="w-full max-w-xs aspect-video rounded-lg overflow-hidden bg-gray-100 border">
                    <img
                      src={galeriForm.gambar_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGaleriDialogOpen(false)}
              disabled={galeriSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={submitGaleri}
              disabled={galeriSubmitting}
              className="bg-[#1B5E20] hover:bg-[#2E7D32]"
            >
              {galeriSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : editingGaleri ? (
                "Perbarui"
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* Delete Confirmation Dialog */}
      {/* ======================================================== */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus{" "}
              <strong>&quot;{deleteTarget?.judul}&quot;</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
