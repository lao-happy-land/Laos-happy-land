import "@/share/styles/globals.css";

import { type Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import AntdConfigProvider from "@/share/config/antd.config";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import { Suspense } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import AuthProvider from "@/components/common/auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import TokenHandler from "@/components/common/token-handler";

export const metadata: Metadata = {
  title: "Laohappyland.com - Happy platform for Lao property",
  description:
    "Website property for Laos - Find houses, apartments, and real estate projects in Laos",
  keywords:
    "bất động sản Lào, nhà đất Lào, căn hộ Lào, dự án Lào, đầu tư Lào, Laos real estate. Laohappyland.com, Laohappyland, Laohappyland.com",
  authors: [{ name: "Laohappyland.com Team" }],
  creator: "Laohappyland.com",
  publisher: "Laohappyland.com",
  robots: "index, follow",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "la_LA",
    url: "https://laohappyland.com",
    siteName: "Laohappyland.com",
    title: "Laohappyland.com - Happy platform for Lao property",
    description:
      "Website property for Laos - Find houses, apartments, and real estate projects in Laos",
    images: [
      {
        url: "/images/landingpage/hero-slider/hero-banner-1.jpg",
        width: 1200,
        height: 630,
        alt: "Laohappyland.com",
      },
    ],
  },
  icons: [{ rel: "icon", url: "/logo.ico" }],
  manifest: "/manifest.json",
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  weight: ["400", "500", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();
  const t = await getTranslations("common");
  const locale = await getLocale();

  const localeCode =
    locale === "la" ? "la_LA" : locale === "en" ? "en_US" : "vi_VN";

  return (
    <html lang={localeCode} className={`${beVietnamPro.variable}`}>
      <body className="antialiased">
        <AntdRegistry>
          <AntdConfigProvider>
            <App>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <AuthProvider>
                  <Suspense
                    fallback={
                      <LoadingScreen
                        variant="primary"
                        message={t("loading")}
                        size="lg"
                        showProgress
                        duration={3}
                      />
                    }
                  >
                    <TokenHandler />
                    {children}
                  </Suspense>
                </AuthProvider>
              </NextIntlClientProvider>
            </App>
          </AntdConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
