import MainLayout from "@/components/layout/main-layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laos Happy Land - Bất động sản Lào",
  description:
    "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
  keywords:
    "bất động sản Lào, nhà đất Lào, căn hộ Lào, dự án Lào, đầu tư Lào, Laos real estate. Laohappyland.com, Laohappyland, Laohappyland.com",
  authors: [{ name: "Laos Happy Land Team" }],
  creator: "Laos Happy Land",
  publisher: "Laos Happy Land",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://laoshappyland.com",
    siteName: "Laos Happy Land",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laos Happy Land - Bất động sản Lào",
    description:
      "Website bất động sản Lào - Tìm nhà đất, căn hộ, dự án bất động sản tại Lào",
    images: ["/images/landingpage/hero-slider/hero-banner-1.jpg"],
    creator: "@laoshappyland",
  },
  icons: [{ rel: "icon", url: "/logo.ico" }],
  manifest: "/manifest.json",
};

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
