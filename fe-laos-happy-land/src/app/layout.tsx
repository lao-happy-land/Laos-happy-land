import "@/share/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Laos Happy Land - Khám phá vẻ đẹp Lào",
  description: "Trải nghiệm những chuyến du lịch tuyệt vời tại Lào với Laos Happy Land. Khám phá văn hóa, thiên nhiên và ẩm thực độc đáo của đất nước triệu voi.",
  keywords: "du lịch Lào, tour Lào, văn hóa Lào, thiên nhiên Lào, Laos travel, Vientiane, Luang Prabang",
  authors: [{ name: "Laos Happy Land Team" }],
  creator: "Laos Happy Land",
  publisher: "Laos Happy Land",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://laoshappyland.com",
    siteName: "Laos Happy Land",
    title: "Laos Happy Land - Khám phá vẻ đẹp Lào",
    description: "Trải nghiệm những chuyến du lịch tuyệt vời tại Lào với Laos Happy Land.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Laos Happy Land",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laos Happy Land - Khám phá vẻ đẹp Lào",
    description: "Trải nghiệm những chuyến du lịch tuyệt vời tại Lào với Laos Happy Land.",
    images: ["/images/twitter-image.jpg"],
    creator: "@laoshappyland",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${geist.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
