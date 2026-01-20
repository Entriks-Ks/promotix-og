// app/r/[code]/page.tsx (Next.js App Router)

import { redirect } from "next/navigation";

type Props = { params: { code: string } };

// 1️⃣ Dynamic metadata for social previews
export async function generateMetadata({ params }: Props) {
  const { code } = params;

  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" } // ensures fresh metadata every request
    );

    if (!res.ok) throw new Error("Failed to fetch metadata");

    const data = await res.json();

    const title = data.metadataTitle || "Promotix Recommendation";
    const description =
      data.metadataDescription ||
      "This recommendation was shared with you via Promotix.";
    const image = data.metadataImage || "https://promotix.io/og-default.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    // fallback metadata if API fails
    return {
      title: "Promotix Recommendation",
      description: "This recommendation was shared with you via Promotix.",
      openGraph: {
        title: "Promotix Recommendation",
        description: "This recommendation was shared with you via Promotix.",
        images: ["https://promotix.io/og-default.png"],
      },
    };
  }
}

// 2️⃣ Page that redirects users to the actual destination
export default async function Page({ params }: Props) {
  const { code } = params;

  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" } // ensure fresh redirect URL
    );

    if (!res.ok) throw new Error("Failed to fetch redirect URL");

    const data = await res.json();
    const destinationUrl = data.destinationUrl || "https://promotix.io";

    // Server-side redirect
    return redirect(destinationUrl);
  } catch (error) {
    // fallback redirect if API fails
    return redirect("https://promotix.io");
  }
}
