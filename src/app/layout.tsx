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
  title: "モノコレクター | モノを、思い出に。",
  description: "あなたの暮らしは、コレクションになる。日常のモノを写真に撮るだけで、大切な思い出として記録。AIがアイコンに変換し、あなただけのコレクションを作ります。",
  keywords: [
    "モノコレクター",
    "思い出",
    "コレクション",
    "暮らし",
    "持ち物管理",
    "写真管理",
    "アイコン",
    "ライフログ",
    "記録",
    "大切なもの",
  ],
  authors: [{ name: "MonoCollector" }],
  creator: "MonoCollector",
  publisher: "MonoCollector",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mono-collector.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    title: "モノコレクター | モノを、思い出に。",
    description: "あなたの暮らしは、コレクションになる。日常のモノを写真に撮るだけで、大切な思い出として記録。AIがアイコンに変換し、あなただけのコレクションを作ります。",
    siteName: "モノコレクター",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "モノコレクター - モノを、思い出に。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "モノコレクター | モノを、思い出に。",
    description: "あなたの暮らしは、コレクションになる。日常のモノを写真に撮るだけで、大切な思い出として記録。",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "モノコレクター",
              "description": "あなたの暮らしは、コレクションになる。モノを、思い出に。",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "featureList": [
                "写真を撮って思い出を記録",
                "AIでアイコンに変換",
                "カテゴリ別コレクション",
                "実績・バッジシステム",
                "大切なものを永遠に保存"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
