import NewsPage from "@/components/business/landing/news";
import { generateMetadata as generateMetadataHelper } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.news" });

  return generateMetadataHelper(
    {
      title: t("title"),
      description: t("description"),
      keywords: t("keywords"),
      url: "/news",
    },
    locale,
  );
}

export default function NewsPageRoute() {
  return <NewsPage />;
}
