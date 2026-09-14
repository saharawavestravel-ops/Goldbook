import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { applySecurityHeaders } from "@/lib/security-headers";

const publicPaths = ["/login"];
const publicApiPrefixes = ["/api/auth", "/api/locale"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  if (publicApiPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    const response = NextResponse.next();
    applySecurityHeaders(response.headers);
    return response;
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!token && !isPublic) {
    if (isApi) {
      const response = NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "Not signed in" } },
        { status: 401 },
      );
      applySecurityHeaders(response.headers);
      return response;
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    applySecurityHeaders(response.headers);
    return response;
  }

  if (token && pathname === "/login") {
    const deskUrl = request.nextUrl.clone();
    deskUrl.pathname = "/";
    deskUrl.search = "";
    const response = NextResponse.redirect(deskUrl);
    applySecurityHeaders(response.headers);
    return response;
  }

  const response = NextResponse.next();
  applySecurityHeaders(response.headers);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
