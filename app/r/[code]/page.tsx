// app/r/[code]/page.tsx
import { notFound } from "next/navigation";

type Props = { params: { code: string } };

export default async function Page({ params }: Props) {
  const { code } = params;

  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" } // always get fresh data
    );

    if (!res.ok) throw new Error("Failed to fetch metadata");

    const data = await res.json();

    const title = data.metadataTitle || "Promotix";
    const description = data.metadataDescription || "Shared via Promotix";
    const image = data.metadataImage || "https://promotix.io/og-default.png";
    const destinationUrl = data.destinationUrl || "https://promotix.io";

    return (
      <html lang="en">
        <head>
          {/* Page metadata */}
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={image} />

          {/* Automatic redirect */}
          <meta httpEquiv="refresh" content={`0; url=${destinationUrl}`} />
        </head>
        <body>
          <p>
            Redirecting to <a href={destinationUrl}>{destinationUrl}</a>...
          </p>
        </body>
      </html>
    );
  } catch (error) {
    console.error("Error fetching metadata:", error);
    notFound();
  }
}
