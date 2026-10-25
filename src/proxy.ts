import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// 不用登入就能進的頁面與 API
const PUBLIC_PATHS = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];
// 已登入就不需要再看的頁面（landing、登入、註冊），直接送進控制台
const GUEST_ONLY_PATHS = ["/", "/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (session && GUEST_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && !isPublic) {
    if (pathname.startsWith("/api/")) {
      return Response.json({ error: "請先登入" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 排除 Next.js 靜態資源與圖示
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
