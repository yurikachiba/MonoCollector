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
  title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。無料の思い出整理アプリ",
  description: "【完全無料】子どもの制作物・作品を撮影するだけでAIがかわいいアイコンに自動変換。捨てる前に記録して思い出をデジタル保存。断捨離・引っ越し整理にも最適。機種変更してもデータは永久保存。",
  keywords: [
    "モノコレクター",
    "思い出整理アプリ",
    "子供の作品 保存",
    "制作物 デジタル化",
    "断捨離 思い出",
    "写真 アイコン変換",
    "AI 画像変換",
    "ライフログ アプリ",
    "思い出 デジタル保存",
    "子育て 記録",
    "捨てられない 解決",
    "終活 整理",
    "ミニマリスト 思い出",
    "PWA アプリ",
    "無料 コレクション",
    "生成AI アイコン",
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
    title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。無料アプリ",
    description: "【完全無料】子どもの制作物・作品を撮影→AIがかわいいアイコンに自動変換。捨てる前に記録して思い出をデジタル保存。断捨離・引っ越し整理に最適。",
    siteName: "モノコレクター",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "モノコレクター - 子どもの作品をAIでアイコン化。捨てられない思い出をデジタル保存。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "モノコレクター | 捨てられない思い出を、ちゃんと残す。",
    description: "【完全無料】子どもの制作物を撮影→AIがアイコンに自動変換。断捨離・引っ越し整理に最適。",
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

// AIO対策・SEO対策用の構造化データ（2026年最新版）
const structuredData = {
  // WebApplication スキーマ
  webApplication: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${baseUrl}/#webapp`,
    "name": "モノコレクター",
    "alternateName": ["MonoCollector", "モノコレ", "思い出整理アプリ"],
    "description": "【完全無料】捨てられない思い出をちゃんと残す。子どもの制作物・作品を撮影するだけで、生成AIがかわいいアイコンに自動変換。断捨離・引っ越し整理・終活にも最適。",
    "url": baseUrl,
    "applicationCategory": "LifestyleApplication",
    "applicationSubCategory": "思い出整理・デジタルアーカイブ",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript, modern browser (Chrome, Safari, Firefox, Edge)",
    "softwareVersion": "2.1.0",
    "datePublished": "2024-01-01",
    "dateModified": "2026-02-01",
    "inLanguage": "ja",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31"
    },
    "featureList": [
      "子どもの制作物・作品を写真で保存",
      "捨てる前に記録するという新しい選択",
      "生成AIでかわいいアイコンに自動変換",
      "AIがカテゴリを自動判定・分類",
      "カテゴリ別コレクション管理",
      "実績・バッジシステムでゲーム感覚",
      "データは永久保存・機種変更も安心",
      "PWA対応でオフラインでも利用可能",
      "Googleアカウントで簡単ログイン",
      "タグ・思い出メモ機能",
      "断捨離・引っ越し整理に最適",
      "終活の思い出整理にも対応"
    ],
    "screenshot": `${baseUrl}/og-image.png`,
    "author": {
      "@type": "Organization",
      "name": "MonoCollector"
    }
  },

  // Organization スキーマ
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "モノコレクター",
    "alternateName": ["MonoCollector", "モノコレ"],
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/icon.svg`,
      "width": 512,
      "height": 512,
      "caption": "モノコレクター ロゴ"
    },
    "description": "思い出整理アプリ「モノコレクター」の開発・運営",
    "foundingDate": "2024",
    "slogan": "捨てられない思い出を、ちゃんと残す。",
    "sameAs": [],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Japanese"
    }
  },

  // WebSite スキーマ（サイト検索対応）
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "モノコレクター",
    "alternateName": ["MonoCollector", "モノコレ", "思い出整理アプリ"],
    "url": baseUrl,
    "description": "【完全無料】捨てられない思い出をちゃんと残す。子どもの制作物・作品を撮影するだけで、生成AIがかわいいアイコンに自動変換。断捨離・引っ越し整理・終活に最適な思い出整理アプリ。",
    "inLanguage": "ja",
    "datePublished": "2024-01-01",
    "dateModified": "2026-02-01",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  },

  // FAQ スキーマ（AIO対策に重要）- 2026年最新版
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "モノコレクターとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターは、捨てられない思い出をデジタルで残すための完全無料アプリです。子どもの制作物や思い出のモノを写真に撮ると、生成AIがかわいいアイコンに自動変換。かさばる制作物も「捨てる前に記録する」という新しい選択ができます。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターは無料で使えますか？課金はありますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターは完全無料で、課金要素は一切ありません。アカウント登録なしでゲストとして利用することも、Googleアカウントでログインしてデータを永久保存することもできます。保存数の制限もなく、全ての機能を無料でお使いいただけます。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターの使い方を教えてください",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "使い方は簡単3ステップです。①大切なモノをスマホで撮影（既存の写真も選択可能）②生成AIが自動で画像を認識し、かわいいアイコンに変換③カテゴリを選んで保存すれば、あなたのコレクションに追加完了。AIがカテゴリも自動判定するので、手間なく整理できます。"
        }
      },
      {
        "@type": "Question",
        "name": "オフラインでも使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターはPWA（Progressive Web App）に対応しているため、一度アクセスすればオフラインでも閲覧機能を利用できます。スマートフォンのホーム画面に追加すれば、ネイティブアプリのように使えます。新規登録や同期にはインターネット接続が必要です。"
        }
      },
      {
        "@type": "Question",
        "name": "データは安全に保存されますか？プライバシーは守られますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、Googleアカウントでログインした場合、データはクラウドに暗号化されて安全に保存されます。お客様の写真やコレクションは第三者に共有されることはありません。プライバシーを最優先に設計されており、詳細はプライバシーポリシーをご確認ください。"
        }
      },
      {
        "@type": "Question",
        "name": "生成AIアイコン変換とは何ですか？どんな技術ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "生成AIアイコン変換は、撮影した写真を最新の生成AI（人工知能）が分析し、シンプルでかわいいアイコンに自動変換する機能です。2026年最新のAI技術により、どんな写真でも統一感のあるレトロで懐かしい雰囲気のアイコンに仕上がります。あなたのコレクションが美しいギャラリーになります。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターはどんな人に向いていますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターは、子どもの制作物を残したい保護者の方、断捨離や引っ越しで思い出整理をしたい方、終活で大切なモノを記録したい方、ミニマリストを目指しているけれど思い出は残したい方などに最適です。「捨てるのが辛い」「罪悪感がある」という気持ちを軽くしてくれるアプリです。"
        }
      },
      {
        "@type": "Question",
        "name": "子どもの制作物・作品を保存するのに向いていますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターは子どもの制作物・作品の保存に最適です。折り紙、工作、初めてのお絵かき、粘土細工など、かさばる作品を写真で記録し、生成AIがかわいいアイコンに変換。全部は取っておけないけれど、忘れたくない思い出をデジタルで永久保存できます。子どもの成長記録として、多くの保護者の方にご利用いただいています。"
        }
      },
      {
        "@type": "Question",
        "name": "断捨離や引っ越しの整理に使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターは断捨離・引っ越し・大掃除の際の思い出整理に最適です。「捨てる前に記録する」ことで、モノへの執着を手放しつつ思い出はしっかり残せます。「捨てるのが辛い」「罪悪感がある」という気持ちを軽くしてくれるアプリとして、ミニマリストや整理収納に関心のある方にも多くご利用いただいています。"
        }
      },
      {
        "@type": "Question",
        "name": "終活の思い出整理にも使えますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、モノコレクターは終活・生前整理の思い出整理にも最適です。長年大切にしてきた品々、写真、手紙などをデジタルで記録し、家族に残すことができます。実物は処分しても、思い出としてコレクションに永久保存。「捨てる」ではなく「記録して残す」という選択ができます。"
        }
      },
      {
        "@type": "Question",
        "name": "機種変更してもデータは引き継げますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、Googleアカウントでログインしていれば、機種変更しても全てのデータを引き継げます。iPhone→Android、Android→iPhoneなど、異なるOS間でも問題ありません。新しいスマートフォンでログインするだけで、これまでのコレクションがすべて復元されます。"
        }
      },
      {
        "@type": "Question",
        "name": "家族でコレクションを共有できますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "現在、コレクションは個人アカウントに紐づいていますが、同じアカウントでログインすれば複数のデバイスからアクセスできます。スマホ・タブレット・PCなど、どのデバイスからでも閲覧可能です。家族共有機能は今後のアップデートで対応予定です。"
        }
      },
      {
        "@type": "Question",
        "name": "保存できるモノの数に制限はありますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "いいえ、保存数に制限はありません。何個でも無制限にコレクションに追加できます。子どもの成長記録、旅行の思い出、趣味のコレクション、日常の大切なモノなど、あなたの暮らしをすべてコレクションにできます。容量制限を気にせずご利用ください。"
        }
      },
      {
        "@type": "Question",
        "name": "モノコレクターと他の写真アプリの違いは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "一般的な写真アプリと異なり、モノコレクターは「モノの記録」に特化しています。①生成AIがかわいいアイコンに自動変換②カテゴリを自動判定して整理③バッジ・実績システムで楽しく続けられる④「捨てる前に記録する」という思い出整理の新しい選択肢を提供。単なる写真保存ではなく、思い出を「コレクション」として大切に残せます。"
        }
      },
      {
        "@type": "Question",
        "name": "アプリのダウンロードは必要ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "アプリストアからのダウンロードは不要です。モノコレクターはWebアプリ（PWA）なので、ブラウザからアクセスするだけですぐに使えます。「ホーム画面に追加」すれば、アプリのように起動でき、オフラインでも利用可能。iPhone・Android・PC、どのデバイスでも同じURLからアクセスできます。"
        }
      },
      {
        "@type": "Question",
        "name": "バッジ・実績システムとは何ですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "モノコレクターには、コレクションを増やすと獲得できるバッジ・実績システムがあります。「初めてのコレクション」「10個達成」「カテゴリコンプリート」など、様々なバッジを集める楽しみがあります。ゲーム感覚で思い出を記録でき、モチベーション維持に役立ちます。"
        }
      },
      {
        "@type": "Question",
        "name": "レビューを投稿することはできますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "はい、どなたでもレビューを投稿できます。トップページの「みんなの声」セクションから「レビューを書く」ボタンをクリックして、あなたの感想を共有してください。投稿されたレビューは他のユーザーの参考になり、アプリの改善にも活用させていただきます。"
        }
      }
    ]
  },

  // HowTo スキーマ（使い方の説明）- 2026年最新版
  howTo: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "モノコレクターの使い方 - 思い出を3ステップでデジタル保存",
    "description": "モノコレクターで子どもの制作物や大切なモノを思い出として記録する方法を説明します。完全無料で、アプリのダウンロード不要。",
    "totalTime": "PT1M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "JPY",
      "value": "0"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "スマートフォンまたはPC"
      },
      {
        "@type": "HowToTool",
        "name": "インターネット接続"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "大切なモノを撮影",
        "text": "思い出にしたいモノをスマートフォンのカメラで撮影します。既存の写真ライブラリから選択することもできます。子どもの制作物、旅行のお土産、思い出の品など、どんなモノでもOK。",
        "image": `${baseUrl}/og-image.png`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "生成AIが自動でアイコン変換",
        "text": "撮影した写真を最新の生成AIが自動で認識し、レトロでかわいいアイコンに変換します。カテゴリも自動で判定されるので、面倒な設定は不要です。",
        "image": `${baseUrl}/og-image.png`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "コレクションに保存して完了",
        "text": "名前とカテゴリを確認して保存ボタンを押すだけ。あなたのコレクションに永久保存されます。Googleアカウントでログインすれば、機種変更しても安心。",
        "image": `${baseUrl}/og-image.png`
      }
    ]
  },

  // SoftwareApplication スキーマ（アプリストア向け）- 2026年最新版
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "モノコレクター",
    "alternateName": ["MonoCollector", "モノコレ", "思い出整理アプリ"],
    "description": "【完全無料】捨てられない思い出をデジタルで残す。子どもの制作物を撮影→生成AIがかわいいアイコンに自動変換。断捨離・引っ越し整理・終活に最適。",
    "applicationCategory": "LifestyleApplication",
    "applicationSubCategory": "思い出整理・デジタルアーカイブ",
    "operatingSystem": "Web, iOS, Android, Windows, macOS",
    "softwareVersion": "2.1.0",
    "datePublished": "2024-01-01",
    "dateModified": "2026-02-01",
    "inLanguage": "ja",
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock"
    },
    "author": {
      "@type": "Organization",
      "name": "MonoCollector"
    },
    "featureList": [
      "生成AIによるアイコン自動変換",
      "カテゴリ自動判定",
      "バッジ・実績システム",
      "クラウド永久保存",
      "PWA対応・オフライン利用可",
      "無制限保存"
    ]
  },

  // ItemList スキーマ（機能一覧）- AIO対策 2026年最新版
  itemList: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "モノコレクターの主な機能と特徴",
    "description": "モノコレクターで利用できる機能の一覧です。すべて完全無料でご利用いただけます。",
    "numberOfItems": 8,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "生成AI自動アイコン変換",
        "description": "撮影した写真を最新の生成AIが自動で分析し、レトロでかわいいアイコンに変換。統一感のある美しいコレクションが作れます"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AIカテゴリ自動分類",
        "description": "AIがモノの種類を自動判定し、適切なカテゴリを提案。手間なく整理でき、後から探すのも簡単です"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "実績・バッジシステム",
        "description": "コレクションを増やすとバッジを獲得。ゲーム感覚で楽しみながら思い出を記録できます"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "クラウド同期・永久保存",
        "description": "Googleアカウントでログインすれば、データはクラウドに暗号化して永久保存。機種変更しても安心です"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "PWA対応・オフライン利用",
        "description": "ホーム画面に追加してネイティブアプリのように使用可能。一度読み込めばオフラインでも閲覧できます"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "タグ・思い出メモ機能",
        "description": "AIがタグを自動提案。思い出やエピソードをメモとして残せ、後から検索も可能です"
      },
      {
        "@type": "ListItem",
        "position": 7,
        "name": "無制限保存",
        "description": "保存数に制限なし。子どもの成長記録、旅行の思い出、趣味のコレクションなど、何個でも保存できます"
      },
      {
        "@type": "ListItem",
        "position": 8,
        "name": "マルチデバイス対応",
        "description": "iPhone、Android、PC、タブレットなど、どのデバイスからでも同じアカウントでアクセス可能です"
      }
    ]
  },

  // Product スキーマ（AIO対策強化）- 2026年新規追加
  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "モノコレクター",
    "description": "捨てられない思い出をデジタルで残す完全無料アプリ。子どもの制作物を撮影すると、生成AIがかわいいアイコンに自動変換。",
    "brand": {
      "@type": "Brand",
      "name": "MonoCollector"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31"
    }
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
        {/* ItemList 構造化データ（AIO対策） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.itemList)
          }}
        />
        {/* Product 構造化データ（AIO対策強化） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.product)
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
