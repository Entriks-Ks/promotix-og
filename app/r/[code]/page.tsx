// app/r/[code]/page.tsx (Next.js 15+)
import { redirect } from "next/navigation";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props) {
  const { code } = await params; // 👈 await params
  
  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    
    return {
      title: data.metadataTitle || "Promotix",
      description: data.metadataDescription || "Shared via Promotix",
      openGraph: {
        title: data.metadataTitle || "Promotix",
        description: data.metadataDescription || "Shared via Promotix",
        images: [data.metadataImage || "https://promotix.io/og-default.png"],
      },
    };
  } catch {
    return { title: "Promotix", description: "Shared via Promotix" };
  }
}

export default async function Page({ params }: Props) {
  const { code } = await params; // 👈 await params
  
  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${code}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed");
    const data = await res.json();
    redirect(data.destinationUrl || "https://promotix.io");
  } catch {
    redirect("https://promotix.io");
  }
}
