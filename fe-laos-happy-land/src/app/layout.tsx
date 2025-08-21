import "@/share/styles/globals.css";

import { type Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import AntdConfigProvider from "@/share/config/antd.config";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Laos Happy Land - Bất động sản Lào",
  description:
    "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
  keywords:
    "bất động sản Lào, nhà đất Lào, căn hộ Lào, dự án Lào, đầu tư Lào, Laos real estate",
  authors: [{ name: "Laos Happy Land Team" }],
  creator: "Laos Happy Land",
  publisher: "Laos Happy Land",
  robots: "index, follow",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://laoshappyland.com",
    siteName: "Laos Happy Land",
    title: "Laos Happy Land - Bất động sản Lào",
    description:
      "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
    images: [
      {
        url: "/images/landingpage/hero-slider/hero-banner-1.jpg",
        width: 1200,
        height: 630,
        alt: "Laos Happy Land",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Laos Happy Land - Bất động sản Lào",
    description:
      "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
    images: ["/images/landingpage/hero-slider/hero-banner-1.jpg"],
    creator: "@laoshappyland",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/manifest.json",
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable}`}>
      <body className="antialiased">
        <Suspense
          fallback={<div className="min-h-screen bg-white">Loading...</div>}
        >
          <AntdRegistry>
            <AntdConfigProvider>{children}</AntdConfigProvider>
          </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
