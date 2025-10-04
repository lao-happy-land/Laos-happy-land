import { generateMetadata as generateMetadataHelper } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import AboutPageClient from "./about-client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });

  return generateMetadataHelper(
    {
      title: t("title"),
      description: t("description"),
      keywords: t("keywords"),
      url: "/about",
    },
    locale,
  );
}

export default function AboutPage() {
  return <AboutPageClient />;
}
