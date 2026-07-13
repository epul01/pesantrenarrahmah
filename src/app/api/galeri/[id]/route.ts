import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured, type GaleriInput } from "@/lib/supabase";

// GET /api/galeri/[id] - Get single galeri
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin.client
      .from("galeri")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT /api/galeri/[id] - Update galeri
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body: GaleriInput = await request.json();

    const { data, error } = await supabaseAdmin.client
      .from("galeri")
      .update({
        judul: body.judul,
        deskripsi: body.deskripsi || null,
        gambar_url: body.gambar_url,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Gagal mengupdate galeri", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE /api/galeri/[id] - Delete galeri
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const { error } = await supabaseAdmin.client
      .from("galeri")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: "Gagal menghapus galeri", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
