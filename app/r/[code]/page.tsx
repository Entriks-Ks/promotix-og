// app/r/[code]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: { code: string } };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://og.promotix.io";

async function fetchShareData(code: string) {
  const fallback = {
    title: "Promotix",
    description: "Shared via Promotix",
    image: "https://promotix.io/og-default.png",
    destinationUrl: "https://promotix.io",
  };

  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" }
    );
    if (!res.ok) return fallback;
    const data = await res.json();
    return {
      title: data.metadataTitle || fallback.title,
      description: data.metadataDescription || fallback.description,
      image: data.metadataImage || fallback.image,
      destinationUrl: data.destinationUrl || fallback.destinationUrl,
    };
  } catch (e) {
    return fallback;
  }
}

// Generate dynamic metadata for each share link
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchShareData(params.code);

  const shareUrl = `${SITE_URL}/r/${params.code}`;
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: shareUrl,
      type: "website",
      images: [{ url: data.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [data.image],
    },
    alternates: { canonical: shareUrl },
  };
}

// Page that performs client-side redirect after rendering
export default async function Page({ params }: Props) {
  const data = await fetchShareData(params.code);

  // If destination URL is missing, show 404
  if (!data.destinationUrl) return notFound();

  return (
    <>
      <head>
        {/* Fallback for crawlers */}
        <meta httpEquiv="refresh" content={`0; url=${data.destinationUrl}`} />
      </head>
      <body>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>
          Redirecting to{" "}
          <a href={data.destinationUrl}>{data.destinationUrl}</a>...
        </p>

        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace(${JSON.stringify(
              data.destinationUrl
            )});`,
          }}
        />
        <noscript>
          <p>
            Redirecting to <a href={data.destinationUrl}>{data.destinationUrl}</a>
            ...
          </p>
        </noscript>
      </body>
    </>
  );
}
