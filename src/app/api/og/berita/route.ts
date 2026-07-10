import { NextRequest, NextResponse } from "next/server";
import { fallbackBerita } from "@/lib/berita-data";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/og/berita?id=xxx
 *
 * Returns a simple HTML redirect to the actual berita image.
 * This endpoint is used as og:image to ensure WhatsApp can
 * always resolve a valid absolute image URL.
 *
 * WhatsApp crawlers follow redirects for og:image, so we redirect
 * to the actual image URL (Supabase storage or local static file).
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing id parameter", { status: 400 });
  }

  let imageUrl: string | null = null;

  // Try Supabase first
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseAdmin.client
        .from("berita")
        .select("gambar_url")
        .eq("id", id)
        .single();

      if (!error && data?.gambar_url) {
        imageUrl = data.gambar_url;
      }
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback to local data
  if (!imageUrl) {
    const fallback = fallbackBerita.find((item) => item.id === id);
    if (fallback) {
      imageUrl = fallback.gambar;
    }
  }

  if (!imageUrl) {
    // Return a default placeholder image
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    imageUrl = `${protocol}://${host}/logo-pesantren.jpeg`;
  }

  // If the image URL is relative, make it absolute
  if (imageUrl && !imageUrl.startsWith("http")) {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    imageUrl = `${protocol}://${host}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
  }

  // Redirect to the actual image URL
  // WhatsApp and other social media crawlers follow redirects for og:image
  return NextResponse.redirect(imageUrl);
}
