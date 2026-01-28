import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Do NOT redirect on og.promotix.io — this host serves OG previews
  if (pathname.startsWith("/r/") && hostname !== "og.promotix.io") {
    return NextResponse.redirect(new URL(`https://promotix.io${pathname}`));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/r/:path*"],
};
