type Props = {
  params: {
    code: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const title = "Promotix Recommendation";
  const description = "This recommendation was shared with you via Promotix.";
  const image = "https://promotix.io/og-default.png";

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
  return null;
}
