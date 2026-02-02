import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monocollector.com';

export const metadata: Metadata = {
  title: 'ログイン | モノコレクター',
  description: 'モノコレクターにログインして、あなただけのコレクションを始めましょう。Googleアカウントで簡単ログイン、またはゲストとしてすぐに始められます。無料でご利用いただけます。',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'ログイン | モノコレクター',
    description: 'モノコレクターにログインして、あなただけのコレクションを始めましょう。Googleアカウントで簡単ログイン。',
    url: '/login',
    type: 'website',
  },
  twitter: {
    title: 'ログイン | モノコレクター',
    description: 'モノコレクターにログインして、あなただけのコレクションを始めましょう。',
  },
  robots: {
    index: true,
    follow: true,
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
      "name": "ログイン",
      "item": `${baseUrl}/login`
    }
  ]
};

export default function LoginLayout({
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
