// app/r/[code]/page.tsx
import type { Metadata } from "next";

type Props = { params: { code: string } };

export const dynamic = "force-dynamic"; // important to prevent caching at build-time
export const revalidate = 0;

const SITE_URL = "https://og.promotix.io";

type ShareData = {
  title: string;
  description: string;
  image: string;
  destinationUrl: string;
  code: string;
};

async function fetchShareData(code: string): Promise<ShareData> {
  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return {
      title: data.metadataTitle,
      description: data.metadataDescription,
      image: data.metadataImage,
      destinationUrl: data.destinationUrl,
      code: data.code,
    };
  } catch {
    return {
      title: "Promotix",
      description: "Shared via Promotix",
      image: "https://promotix.io/og-default.png",
      destinationUrl: "https://promotix.io",
      code,
    };
  }
}

// Server-side metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params.code) return { title: "Promotix", description: "Shared via Promotix" };

  const data = await fetchShareData(params.code);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${SITE_URL}/r/${data.code}`,
      type: "website",
      images: [{ url: data.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
      images: [data.image],
    },
    alternates: {
      canonical: `${SITE_URL}/r/${data.code}`,
    },
  };
}

// Page content with redirect
export default async function Page({ params }: Props) {
  const data = await fetchShareData(params.code);

  return (
    <html lang="en">
      <head>
        {/* Force immediate redirect in browser */}
        <meta httpEquiv="refresh" content={`0; url=${data.destinationUrl}`} />
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
      </head>
      <body>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>
          Redirecting to <a href={data.destinationUrl}>{data.destinationUrl}</a>
        </p>
      </body>
    </html>
  );
}
