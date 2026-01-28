// pages/r/[code].tsx
import { GetServerSideProps } from "next";

type Recommendation = {
  title: string;
  description: string;
  imageUrl: string;
};

type Props = {
  recommendation: Recommendation | null;
  code: string;
};

export default function RecommendationPage({ recommendation, code }: Props) {
  if (!recommendation) {
    return (
      <div>
        <h1>Recommendation Not Found</h1>
        <p>Sorry, the code {code} does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{recommendation.title}</title>
        <meta name="description" content={recommendation.description} />
        <meta property="og:title" content={recommendation.title} />
        <meta property="og:description" content={recommendation.description} />
        <meta property="og:image" content={recommendation.imageUrl} />
        <meta property="og:url" content={`https://og.promotix.io/r/${code}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={recommendation.title} />
        <meta name="twitter:description" content={recommendation.description} />
        <meta name="twitter:image" content={recommendation.imageUrl} />
      </head>
      <body>
        <h1>{recommendation.title}</h1>
        <p>{recommendation.description}</p>
        <img src={recommendation.imageUrl} alt={recommendation.title} />
      </body>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  try {
    // Example fetch from your DB or API
    const res = await fetch(`https://api.promotix.io/recommendations/${code}`);
    if (!res.ok) throw new Error("Not found");

    const recommendation = await res.json();

    return {
      props: {
        recommendation,
        code,
      },
    };
  } catch (err) {
    // Return null for recommendation if code not found
    return {
      props: {
        recommendation: null,
        code,
      },
    };
  }
};
