import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mono-collector.vercel.app';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | モノコレクター',
  description: 'モノコレクターのプライバシーポリシーです。収集する情報、利用目的、データの保護方法などについて説明しています。お客様のプライバシーを尊重し、個人情報の保護に努めています。',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'プライバシーポリシー | モノコレクター',
    description: 'モノコレクターのプライバシーポリシーです。収集する情報、利用目的、データの保護方法などについて説明しています。',
    url: '/privacy',
    type: 'website',
  },
  twitter: {
    title: 'プライバシーポリシー | モノコレクター',
    description: 'モノコレクターのプライバシーポリシーです。収集する情報、利用目的、データの保護方法などについて説明しています。',
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
      "name": "プライバシーポリシー",
      "item": `${baseUrl}/privacy`
    }
  ]
};

export default function PrivacyLayout({
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
