import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, validateSessionToken } from "@/app/api/auth/login/route";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Hanya protect /admin (bukan /admin/login)
  // Izinkan /admin/login agar bisa akses halaman login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Cek session cookie
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = validateSessionToken(token);

  if (!isAuthenticated) {
    // Redirect ke halaman login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware untuk /admin (kecuali /admin/login)
  matcher: ["/admin/:path*"],
};
