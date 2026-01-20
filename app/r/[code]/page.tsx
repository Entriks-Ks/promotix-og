type Props = { params: { code: string } };

export async function generateMetadata({ params }: Props) {
  const { code } = params;

  // Fetch metadata from Lovable's edge function
  const res = await fetch(
    `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`
  );
  const data = await res.json();

  // Fallback defaults if fields are missing
  const title = data.metadataTitle || "Promotix Recommendation";
  const description = data.metadataDescription || "This recommendation was shared with you via Promotix.";
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
}

export default function Page() {
  return null; // this page only serves OG metadata
}
