import Properties from "@/components/business/landing/properties";
import { generateMetadata as generateMetadataHelper } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.properties" });

  return generateMetadataHelper(
    {
      title: `${t("title")} - ${locale === "la" ? "ຂາຍ" : locale === "vn" ? "Bán" : "For Sale"}`,
      description: `${t("description")} - ${locale === "la" ? "ຊື້ບ້ານ, ຊື້ອາພາດເມັນ, ຊື້ໂຄງການ" : locale === "vn" ? "Mua nhà, mua căn hộ, mua dự án" : "Buy houses, buy apartments, buy projects"}`,
      keywords: `${t("keywords")}, ${locale === "la" ? "ຊື້" : locale === "vn" ? "mua" : "buy"}`,
      url: "/properties-for-sale",
    },
    locale,
  );
}

export default function PropertiesForSalePage() {
  return <Properties transaction="sale" />;
}
