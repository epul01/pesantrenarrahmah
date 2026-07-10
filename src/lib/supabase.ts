import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Check if Supabase env vars are configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && !url.includes("your-project-id");
}

// Cached connectivity check — avoids 4-7s timeout on every request when Supabase is unreachable
let _connectivityCache: { reachable: boolean; checkedAt: number } | null = null;
const CONNECTIVITY_CACHE_MS = 30000; // re-check every 30s

async function isSupabaseReachable(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  // Return cached result if fresh
  if (_connectivityCache) {
    const age = Date.now() - _connectivityCache.checkedAt;
    if (age < CONNECTIVITY_CACHE_MS) {
      return _connectivityCache.reachable;
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Quick DNS + TCP check with short timeout (2s max)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${url}/rest/v1/`, {
      method: "HEAD",
      signal: controller.signal,
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
    });
    clearTimeout(timeout);
    // Any HTTP response (even 404) means the server is reachable
    const reachable = res.status > 0;
    _connectivityCache = { reachable, checkedAt: Date.now() };
    return reachable;
  } catch {
    // DNS failure, connection refused, timeout, etc.
    _connectivityCache = { reachable: false, checkedAt: Date.now() };
    return false;
  }
}

// Lazy-initialized Supabase clients to avoid module-level crash when env vars are missing
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!_supabase) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase belum dikonfigurasi. Silakan atur kredensial Supabase di file .env.local");
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { fetch: (...args) => fetch(...args) },
    });
  }
  return _supabase;
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!isSupabaseConfigured()) {
      throw new Error("Supabase belum dikonfigurasi. Silakan atur kredensial Supabase di file .env.local");
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

// Export getters instead of direct clients
export const supabase = {
  get client() {
    return getSupabaseClient();
  },
};

export const supabaseAdmin = {
  get client() {
    return getSupabaseAdminClient();
  },
};

// Export the check functions for use in API routes
export { isSupabaseConfigured, isSupabaseReachable };

// Types for our database tables
export interface Berita {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string | null;
  kategori: string;
  gambar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Galeri {
  id: string;
  judul: string;
  deskripsi: string | null;
  gambar_url: string;
  created_at: string;
  updated_at: string;
}

export interface BeritaInput {
  judul: string;
  ringkasan: string;
  konten?: string | null;
  kategori: string;
  gambar_url?: string | null;
}

export interface GaleriInput {
  judul: string;
  deskripsi?: string | null;
  gambar_url: string;
}
