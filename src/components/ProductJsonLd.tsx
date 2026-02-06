import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monocollector.com';

export default async function ProductJsonLd() {
  let aggregateRating = null;
  let reviews: Array<{
    "@type": string;
    reviewRating: { "@type": string; ratingValue: number; bestRating: string; worstRating: string };
    author: { "@type": string; name: string };
    name: string;
    reviewBody: string;
    datePublished: string;
  }> = [];

  try {
    const stats = await prisma.review.aggregate({
      where: { isPublic: true },
      _avg: { rating: true },
      _count: { id: true },
    });

    if (stats._count.id > 0 && stats._avg.rating) {
      aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: Math.round(stats._avg.rating * 10) / 10,
        reviewCount: stats._count.id,
        bestRating: "5",
        worstRating: "1",
      };
    }

    const featuredReviews = await prisma.review.findMany({
      where: { isPublic: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 5,
      select: {
        rating: true,
        title: true,
        content: true,
        userName: true,
        createdAt: true,
      },
    });

    reviews = featuredReviews.map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: r.userName,
      },
      name: r.title,
      reviewBody: r.content,
      datePublished: r.createdAt.toISOString().split('T')[0],
    }));
  } catch {
    // DB未接続やビルド時はフォールバック（aggregateRating/review なし）
  }

  const productData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "モノコレクター",
    description:
      "捨てられない思い出をデジタルで残す完全無料アプリ。子どもの制作物を撮影すると、生成AIがかわいいアイコンに自動変換。",
    image: {
      "@type": "ImageObject",
      url: `${baseUrl}/og-image.png`,
      width: 1200,
      height: 630,
      caption: "モノコレクター - 子どもの作品をデジタル保存",
    },
    brand: {
      "@type": "Brand",
      name: "MonoCollector",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-12-31",
    },
  };

  if (aggregateRating) {
    productData.aggregateRating = aggregateRating;
  }

  if (reviews.length > 0) {
    productData.review = reviews;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productData),
      }}
    />
  );
}
