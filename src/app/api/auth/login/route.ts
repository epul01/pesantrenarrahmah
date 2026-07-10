import { NextRequest, NextResponse } from "next/server";

// Default credentials (bisa di-override via environment variables)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "arrahmah2024";

// Nama cookie untuk session admin
export const ADMIN_COOKIE_NAME = "admin_session";

// Token sederhana (untuk demo) — kombinasi username + secret timestamp
function createSessionToken(): string {
  const secret = process.env.ADMIN_SECRET || "arrahmah-secret-key-2024";
  const ts = Date.now();
  // Encode base64 dari "admin:timestamp:secret" — cukup untuk proteksi sederhana
  return Buffer.from(`${ADMIN_USERNAME}:${ts}:${secret}`).toString("base64");
}

// Validasi token session
export function validateSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username, tsStr, secret] = decoded.split(":");
    const secretExpected = process.env.ADMIN_SECRET || "arrahmah-secret-key-2024";
    if (username !== ADMIN_USERNAME || secret !== secretExpected) return false;
    const ts = parseInt(tsStr, 10);
    if (isNaN(ts)) return false;
    // Session valid selama 7 hari (604800000 ms)
    const age = Date.now() - ts;
    if (age > 7 * 24 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Validasi credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 }
      );
    }

    // Buat session token
    const token = createSessionToken();

    // Set httpOnly cookie (secure di production)
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      redirect: "/admin",
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari (detik)
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
