import Head from "next/head";
import type { GetServerSideProps } from "next";

type Props = {
  exists: boolean;
  title: string;
  description: string;
  image: string;
  shareUrl: string;
  redirectUrl: string;
};

type Config = {
  SITE_URL: string;
  SUPABASE_PROJECT_ID: string;
};

const getConfigByHost = (host: string | undefined): Config => {
  const cleanHost = host?.toLowerCase() || "";

  if (cleanHost.includes("crmaipro.de")) {
    return {
      SITE_URL: "https://crmaipro.de",
      SUPABASE_PROJECT_ID: "tmvrcilrkpfcudovevyi",
    };
  }

  // default = production
  return {
    SITE_URL: "https://promotix.io",
    SUPABASE_PROJECT_ID: "xnivbvpdkkfxgwmboqsv",
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const code = context.params?.code as string | undefined;
  const host = context.req.headers.host;

  const { SITE_URL, SUPABASE_PROJECT_ID } = getConfigByHost(host);

  if (!code) {
    return {
      props: {
        exists: false,
        title: "Promotix",
        description: "Shared via Promotix",
        image: "${SITE_URL}/og-default.png",
        shareUrl: `${SITE_URL}/r/unknown`,
        redirectUrl: SITE_URL,
      },
    };
  }

  const fallback = {
    title: "Promotix",
    description: "Shared via Promotix",
    image: "${SITE_URL}/og-default.png",
  };

  try {
    const res = await fetch(
      `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/get-link-metadata?code=${encodeURIComponent(
        code
      )}`,
      {
        cache: "no-store",
        headers: { accept: "application/json" },
      }
    );

    if (!res.ok) throw new Error("bad response");

    const data = await res.json();

    const title = data.metadataTitle || fallback.title;
    const description = data.metadataDescription || fallback.description;
    const image = data.metadataImage || fallback.image;

    const shareUrl = `${SITE_URL}/r/${code}`;
    const redirectUrl = data.destinationUrl || SITE_URL;

    return {
      props: {
        exists: true,
        title,
        description,
        image,
        shareUrl,
        redirectUrl,
      },
    };
  } catch {
    return {
      props: {
        exists: false,
        title: fallback.title,
        description: fallback.description,
        image: fallback.image,
        shareUrl: `${SITE_URL}/r/${code}`,
        redirectUrl: SITE_URL,
      },
    };
  }
};

export default function RecommendationPage(props: Props) {
  const { title, description, image, shareUrl, redirectUrl } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Canonical */}
        <link rel="canonical" href={shareUrl} />

        {/* Redirect */}
        <meta httpEquiv="refresh" content={`0; url=${redirectUrl}`} />
      </Head>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(redirectUrl)});`,
        }}
      />

      <noscript>
        <p>
          Redirecting to <a href={redirectUrl}>{redirectUrl}</a>...
        </p>
      </noscript>
    </>
  );
}