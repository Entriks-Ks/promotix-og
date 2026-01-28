import Head from "next/head";
import type { GetServerSideProps } from "next";

type Props = {
  exists: boolean;
  title?: string;
  description?: string;
  image?: string;
  shareUrl?: string;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://og.promotix.io";

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const code = context.params?.code as string | undefined;

  if (!code) {
    return { props: { exists: false } };
  }

  const fallback = {
    title: "Promotix",
    description: "Shared via Promotix",
    image: "https://promotix.io/og-default.png",
  };

  try {
    const res = await fetch(
      `https://xnivbvpdkkfxgwmboqsv.supabase.co/functions/v1/get-link-metadata?code=${encodeURIComponent(
        code
      )}`,
      { cache: "no-store", headers: { accept: "application/json" } }
    );

    if (!res.ok) {
      return { props: { exists: false } };
    }

    const data = await res.json();

    const title = data.metadataTitle || fallback.title;
    const description = data.metadataDescription || fallback.description;
    const image = data.metadataImage || fallback.image;
    const shareUrl = `${SITE_URL}/r/${code}`;

    return {
      props: {
        exists: true,
        title,
        description,
        image,
        shareUrl,
      },
    };
  } catch {
    return { props: { exists: false } };
  }
};

export default function RecommendationPage(props: Props) {
  if (!props.exists) {
    return (
      <>
        <Head>
          <title>Recommendation not found</title>
          <meta name="robots" content="noindex" />
        </Head>
        <main style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
          <h1>Recommendation not found</h1>
          <p>The requested recommendation code does not exist.</p>
        </main>
      </>
    );
  }

  const { title, description, image, shareUrl } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph for Facebook/WhatsApp/LinkedIn */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Canonical */}
        <link rel="canonical" href={shareUrl} />
      </Head>
      <main style={{ maxWidth: 680, margin: "40px auto", padding: 16 }}>
        <h1>{title}</h1>
        <p>{description}</p>
        {image && (
          <img
            src={image}
            alt={title ?? "Recommendation image"}
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        )}
      </main>
    </>
  );
}
