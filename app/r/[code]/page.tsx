import { redirect } from "next/navigation";

type Props = { params: { code: string } };

export async function generateMetadata({ params }: Props) {
  const { code } = params;

  const res = await fetch(
    `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`
  );
  const data = await res.json();

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

export default async function Page({ params }: Props) {
  const { code } = params;

  // Fetch the redirect URL from Lovable edge function
  const res = await fetch(
    `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`
  );
  const data = await res.json();

  const destinationUrl = data.destinationUrl || "https://promotix.io";

  // Perform server-side redirect after metadata is generated
  return redirect(destinationUrl);
}
