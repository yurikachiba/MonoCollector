import type { Metadata, Viewport } from "next";
import "./globals.css";

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
  title: "モノコレクター | 家にあるモノを楽しく管理",
  description: "カメラで撮影するだけで家にあるモノを自動分類。片付け習慣化、料理の材料把握に。LINEで家族と共有もできる、コレクター欲をくすぐる整理整頓アプリ。",
  keywords: [
    "モノコレクター",
    "家庭収納",
    "整理整頓",
    "片付け",
    "在庫管理",
    "食材管理",
    "コレクション",
    "写真管理",
    "家事アプリ",
    "LINE共有",
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
    title: "モノコレクター | 家にあるモノを楽しく管理",
    description: "カメラで撮影するだけで家にあるモノを自動分類。片付け習慣化、料理の材料把握に。LINEで家族と共有もできる、コレクター欲をくすぐる整理整頓アプリ。",
    siteName: "モノコレクター",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "モノコレクター - 家にあるモノを楽しく管理",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "モノコレクター | 家にあるモノを楽しく管理",
    description: "カメラで撮影するだけで家にあるモノを自動分類。片付け習慣化、料理の材料把握に。",
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
              "description": "カメラで撮影するだけで家にあるモノを自動分類。片付け習慣化、料理の材料把握に。",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "JPY"
              },
              "featureList": [
                "カメラで撮影・自動分類",
                "カテゴリ別整理",
                "LINE共有機能",
                "在庫管理",
                "食材管理"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
