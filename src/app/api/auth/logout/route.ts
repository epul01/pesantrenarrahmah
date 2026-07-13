import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "../login/route";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil",
    redirect: "/admin/login",
  });

  // Hapus cookie session
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // hapus segera
  });

  return response;
}
