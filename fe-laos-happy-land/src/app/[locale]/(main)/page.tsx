import LandingPage from "@/components/business/landing/home";
import { generateMetadata as generateMetadataHelper } from "@/share/helper/metadata.helper";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return generateMetadataHelper(
    {
      title: t("title"),
      description: t("description"),
      keywords: t("keywords"),
      url: "",
    },
    locale,
  );
}

export default function HomePage() {
  return <LandingPage />;
}
