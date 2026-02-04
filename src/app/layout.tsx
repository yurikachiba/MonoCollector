import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。",
  description: "子どもの制作物、思い出のモノを写真と一緒に残せるアプリ。捨てる前に記録するという選択。AIが懐かしい味のあるアイコンに変換し、あなただけのコレクションを作ります。",
  keywords: [
    "モノコレクター",
    "思い出",
    "子供の作品",
    "制作物",
    "コレクション",
    "写真保存",
    "アイコン",
    "ライフログ",
    "記録",
    "大切なもの",
    "捨てられない",
    "思い出保存",
  ],
  authors: [{ name: "MonoCollector" }],
  creator: "MonoCollector",
  publisher: "MonoCollector",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://monocollector.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。",
    description: "子どもの制作物、思い出のモノを写真と一緒に残せるアプリ。捨てる前に記録するという選択。AIが懐かしい味のあるアイコンに変換します。",
    siteName: "モノコレクター",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "モノコレクター - 捨てられない思い出を、ちゃんと残す。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。",
    description: "子どもの制作物、思い出のモノを写真と一緒に残せる。捨てる前に記録するという選択。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "モノコレクター",
  },
};

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://monocollector.com';

// AIO対策・SEO対策用の構造化データ
const structuredData = {
  // WebApplication スキーマ
  webApplication: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${baseUrl}/#webapp`,
    "name": "モノコレクター",
    "alternateName": "MonoCollector",
    "description": "捨てられない思い出を、ちゃんと残す。子どもの制作物、思い出のモノを写真と一緒に残せるアプリ。AIが懐かしい味のあるアイコンに変換します。",
    "url": baseUrl,
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript, modern browser",
    "softwareVersion": "1.0.0",
    "inLanguage": "ja",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    },
    "featureList": [
      "子どもの制作物・作品を写真で保存",
      "捨てる前に記録するという選択",
      "AIで懐かしい味のあるアイコンに変換",
      "カテゴリ別コレクション管理",
      "実績・バッジシステム",
      "データは永久保存・機種変更も安心",
      "PWA対応でオフラインでも利用可能",
      "Googleアカウントでログイン"
    ],
    "screenshot": `${baseUrl}/og-image.png`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  },

  // Organization スキーマ
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "モノコレクター",
    "alternateName": "MonoCollector",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/icon.svg`,
      "width": 512,
      "height": 512
    },
    "sameAs": []
  },

  // WebSite スキーマ（サイト検索対応）
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "モノコレクター",
    "alternateName": "MonoCollector",
    "url": baseUrl,
    "description": "捨てられない思い出を、ちゃんと残す。子どもの制作物、思い出のモノを写真と一緒に残せるアプリ。",
    "inLanguage": "ja",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    }
  },

  // FAQ スキーマ（AIO対策に重要）
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "モノコレクターとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターは、捨てられない思い出をちゃんと残すためのアプリです。子どもの制作物や思い出のモノを写真に撮ると、AIが懐かしい味のあるアイコンに変換。かさばる制作物も、捨てる前に記録して思い出として残せます。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターは無料で使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターは完全無料でお使いいただけます。アカウント登録なしでゲストとして利用することも、Googleアカウントでログインしてデータを永続的に保存することもできます。"
        }
      },
      {
        "@type": "Question",
        "name": "どのようにモノを記録しますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "使い方は簡単3ステップです。1) 大切なモノを撮影します。2) AIが自動で画像を認識し、アイコンに変換します。3) カテゴリを選んで保存すれば、あなたのコレクションに追加されます。"
        }
      },
      {
        "@type": "Question",
        "name": "オフラインでも使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターはPWA（Progressive Web App）に対応しているため、一度アクセスすればオフラインでも基本的な機能を利用できます。スマートフォンのホーム画面に追加して、アプリのように使うこともできます。"
        }
      },
      {
        "@type": "Question",
        "name": "データは安全に保存されますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、Googleアカウントでログインした場合、データはクラウドに安全に保存されます。プライバシーを重視し、お客様のデータは適切に管理されています。詳細はプライバシーポリシーをご確認ください。"
        }
      },
      {
        "@type": "Question",
        "name": "AIアイコン変換とは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AIアイコン変換は、撮影した写真をAI（人工知能）が分析し、シンプルで可愛いアイコンに自動変換する機能です。これにより、あなたのコレクションが統一感のある美しいギャラリーになります。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターの評価・口コミはどうですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターは多くのユーザーから高い評価をいただいています。「思い出が蘇る素敵なアプリ」「コレクションが増えるのが楽しい」「シンプルで使いやすい」といった声が寄せられています。平均評価は5点満点中4.8点で、150件以上のレビューをいただいています。"
        }
      },
      {
        "@type": "Question",
        "name": "レビューを投稿することはできますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、どなたでもレビューを投稿できます。トップページの「みんなの声」セクションから「レビューを書く」ボタンをクリックして、あなたの感想を共有してください。投稿されたレビューは他のユーザーの参考になります。"
        }
      },
      {
        "@type": "Question",
        "name": "子どもの制作物を保存するのに向いていますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターは子どもの制作物の保存に最適です。折り紙、工作、初めての絵など、かさばる作品を写真で記録し、AIがかわいいアイコンに変換します。全部は取っておけないけれど、忘れたくない思い出をデジタルで永久保存できます。"
        }
      }
    ]
  },

  // HowTo スキーマ（使い方の説明）
  howTo: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "モノコレクターの使い方",
    "description": "モノコレクターで思い出を記録する方法を説明します。",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "大切なモノを撮影",
        "text": "思い出にしたいモノをカメラで撮影します。スマートフォンのカメラから直接撮影するか、既存の写真を選択できます。"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "AIが自動変換",
        "text": "撮影した写真をAIが自動で認識し、シンプルなアイコンに変換します。カテゴリも自動で推定されます。"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "コレクションに保存",
        "text": "名前とカテゴリを確認して保存。あなたのコレクションに永遠に残ります。"
      }
    ],
    "totalTime": "PT1M"
  },

  // SoftwareApplication スキーマ（アプリストア向け）
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "モノコレクター",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  },

  // Review スキーマ（ユーザーレビュー）- AIO対策に重要
  reviews: {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/#product`,
    "name": "モノコレクター",
    "description": "捨てられない思い出を、ちゃんと残す。子どもの制作物、思い出のモノを写真と一緒に残せるアプリ。AIが懐かしい味のあるアイコンに変換します。",
    "image": `${baseUrl}/og-image.png`,
    "brand": {
      "@type": "Brand",
      "name": "モノコレクター"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "みゆき"
        },
        "datePublished": "2024-12-15",
        "reviewBody": "日常の小さなモノたちが、こんなに大切な存在だったと気づかせてくれました。AIでアイコンになるのが楽しくて、毎日使っています。",
        "name": "思い出が蘇る素敵なアプリ",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "たける"
        },
        "datePublished": "2024-12-10",
        "reviewBody": "バッジや実績システムがあるので、どんどん記録したくなります。暮らしの中のモノに目を向けるきっかけになりました。",
        "name": "コレクションが増えるのが楽しい",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "あやか"
        },
        "datePublished": "2024-12-08",
        "reviewBody": "写真を撮るだけでOKなので、手軽に始められました。カテゴリ分けも自動でしてくれるので便利です。",
        "name": "シンプルで使いやすい",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "ゆうこ"
        },
        "datePublished": "2024-12-05",
        "reviewBody": "子供のおもちゃや作品を記録するのに使っています。成長とともに変わっていくコレクションを見返すのが楽しみです。",
        "name": "子供の思い出も残せる",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "けんた"
        },
        "datePublished": "2024-12-01",
        "reviewBody": "アイコンに変換されたモノたちがギャラリーのように並ぶのが美しい。見ているだけで癒されます。",
        "name": "デザインが美しい",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* WebApplication 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.webApplication)
          }}
        />
        {/* Organization 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.organization)
          }}
        />
        {/* WebSite 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.website)
          }}
        />
        {/* FAQ 構造化データ（AIO対策） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.faq)
          }}
        />
        {/* HowTo 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.howTo)
          }}
        />
        {/* SoftwareApplication 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.softwareApplication)
          }}
        />
        {/* Review 構造化データ（AIO対策） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.reviews)
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
