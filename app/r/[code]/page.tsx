// app/r/[code]/page.tsx
import type { Metadata } from "next";

type Props = { params: { code: string } };

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = "https://og.promotix.io";

type ShareData = {
  title: string;
  description: string;
  image: string;
  destinationUrl: string;
  code: string;
};

// Fetch from Supabase (returns exactly what you pasted)
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
    // fallback in case of error
    return {
      title: "Promotix",
      description: "Shared via Promotix",
      image: "https://promotix.io/og-default.png",
      destinationUrl: "https://promotix.io",
      code,
    };
  }
}

// SERVER-SIDE OG metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await fetchShareData(params.code);
  const shareUrl = `${SITE_URL}/r/${data.code}`;

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
    alternates: {
      canonical: shareUrl,
    },
  };
}

// PAGE HTML — WhatsApp-safe
export default async function Page({ params }: Props) {
  const data = await fetchShareData(params.code);

  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="refresh"
          content={`0; url=${data.destinationUrl}`}
        />
      </head>
      <body>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>
          Redirecting to{" "}
          <a href={data.destinationUrl}>{data.destinationUrl}</a>
        </p>
      </body>
    </html>
  );
}
