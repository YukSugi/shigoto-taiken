import { NextRequest, NextResponse } from "next/server";

function getExpectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return Buffer.from(pw).toString("base64");
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login と /api/admin/login は認証不要
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const expected = getExpectedToken();

  // ADMIN_PASSWORD 未設定の場合はアクセス拒否
  if (!expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD が設定されていません" },
        { status: 503 }
      );
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const token = req.cookies.get("admin_token")?.value;

  if (token !== expected) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
