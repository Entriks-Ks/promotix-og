// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // For /r/:code links, we want **humans** to be forwarded to the
// // main app (where the Supabase edge function tracks clicks),
// // but keep **bots/scrapers** on this OG host so they can read
// // the Open Graph tags.
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   if (!pathname.startsWith("/r/")) {
//     return NextResponse.next();
//   }

//   const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

//   // Very small heuristic list of common social/preview bots.
//   const botSignatures = [
//     "facebookexternalhit",
//     "twitterbot",
//     "linkedinbot",
//     "slackbot",
//     "whatsapp",
//     "discordbot",
//     "telegrambot",
//     "googlebot",
//     "bingbot",
//   ];

//   const isBot = botSignatures.some((sig) => userAgent.includes(sig));

//   // Bots: stay on this host to render OG metadata.
//   if (isBot) {
//     return NextResponse.next();
//   }

//   // Humans: forward to main app where tracking/edge logic runs.
//   return NextResponse.redirect(new URL(`https://promotix.io${pathname}`));
// }

// export const config = {
//   matcher: ["/r/:path*"],
// };



// The above code is the original middleware implementation. Below is the updated version that dynamically detects the current domain instead of hardcoding "promotix.io".


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/r/")) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";

  const botSignatures = [
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "whatsapp",
    "discordbot",
    "telegrambot",
    "googlebot",
    "bingbot",
  ];

  const isBot = botSignatures.some((sig) => userAgent.includes(sig));

  // IMPORTANT: detect current domain dynamically
  const host = request.headers.get("host");

  const protocol = request.nextUrl.protocol;

  const currentBaseUrl = host
    ? `${protocol}//${host}`
    : "https://promotix.io";

  // Bots stay on same domain for OG scraping
  if (isBot) {
    return NextResponse.next();
  }

  // Humans redirected to SAME domain (not hardcoded anymore)
  return NextResponse.redirect(new URL(`${currentBaseUrl}${pathname}`));
}

export const config = {
  matcher: ["/r/:path*"],
};