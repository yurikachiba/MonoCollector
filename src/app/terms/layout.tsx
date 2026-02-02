import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monocollector.com';

export const metadata: Metadata = {
  title: '利用規約 | モノコレクター',
  description: 'モノコレクターの利用規約です。本サービスをご利用いただく前に、必ずお読みください。サービスの利用条件、禁止事項、免責事項などを定めています。',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: '利用規約 | モノコレクター',
    description: 'モノコレクターの利用規約です。本サービスをご利用いただく前に、必ずお読みください。',
    url: '/terms',
    type: 'website',
  },
  twitter: {
    title: '利用規約 | モノコレクター',
    description: 'モノコレクターの利用規約です。本サービスをご利用いただく前に、必ずお読みください。',
  },
};

// BreadcrumbList 構造化データ
const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "ホーム",
      "item": baseUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "利用規約",
      "item": `${baseUrl}/terms`
    }
  ]
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />
      {children}
    </>
  );
}
