import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/r/")) {
    return NextResponse.redirect(
      new URL(`https://promotix.io${pathname}`)
    );
  }
}
