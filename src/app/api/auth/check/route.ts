import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, validateSessionToken } from "../login/route";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = validateSessionToken(token);

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
