// app/r/[code]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { code: string } };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://og.promotix.io";

async function fetchShareData(code: string) {
  const res = await fetch(
    `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch metadata");
  const data = await res.json();
  return {
    title: data.metadataTitle || "Promotix",
    description: data.metadataDescription || "Shared via Promotix",
    image: data.metadataImage || "https://promotix.io/og-default.png",
    destinationUrl: data.destinationUrl || "https://promotix.io",
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { title, description, image } = await fetchShareData(params.code);
    const shareUrl = `${SITE_URL}/r/${params.code}`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: shareUrl,
        type: "website",
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: { canonical: shareUrl },
    };
  } catch {
    return {
      title: "Promotix",
      description: "Shared via Promotix",
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    const { destinationUrl } = await fetchShareData(params.code);
    return (
      <>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(destinationUrl)});`,
          }}
        />
        <noscript>
          <p>
            Redirecting to <a href={destinationUrl}>{destinationUrl}</a>...
          </p>
        </noscript>
      </>
    );
  } catch (error) {
    console.error("Error fetching metadata:", error);
    notFound();
  }
}
