// app/r/[code]/page.tsx
import { Metadata } from "next";
import { redirect } from "next/navigation";

const SITE_URL = "https://og.promotix.io"; // your site base

interface ShareData {
  metadataTitle: string;
  metadataDescription: string;
  metadataImage: string;
  destinationUrl: string;
}

async function fetchShareData(code: string): Promise<ShareData> {
  const res = await fetch(
    `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`
  );
  if (!res.ok) throw new Error("Failed to fetch share data");
  return res.json();
}

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  params: { code: string };
}): Promise<Metadata> {
  const data = await fetchShareData(params.code);
  const shareUrl = `${SITE_URL}/r/${params.code}`;

  return {
    title: data.metadataTitle,
    description: data.metadataDescription,
    alternates: {
      canonical: shareUrl,
    },
    openGraph: {
      title: data.metadataTitle,
      description: data.metadataDescription,
      url: shareUrl,
      images: [{ url: data.metadataImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.metadataTitle,
      description: data.metadataDescription,
      images: [data.metadataImage],
    },
  };
}

// Page component that redirects the user
export default async function SharePage({
  params,
}: {
  params: { code: string };
}) {
  const data = await fetchShareData(params.code);

  // Server-side redirect to destination
  redirect(data.destinationUrl);
}
