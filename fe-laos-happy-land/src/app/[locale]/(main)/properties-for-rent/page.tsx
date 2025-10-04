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
      title: `${t("title")} - ${locale === "la" ? "ເຊົ່າ" : locale === "vn" ? "Thuê" : "For Rent"}`,
      description: `${t("description")} - ${locale === "la" ? "ເຊົ່າບ້ານ, ເຊົ່າອາພາດເມັນ, ເຊົ່າໂຄງການ" : locale === "vn" ? "Thuê nhà, thuê căn hộ, thuê dự án" : "Rent houses, rent apartments, rent projects"}`,
      keywords: `${t("keywords")}, ${locale === "la" ? "ເຊົ່າ" : locale === "vn" ? "thuê" : "rent"}`,
      url: "/properties-for-rent",
    },
    locale,
  );
}

export default function PropertiesForRentPage() {
  return <Properties transaction="rent" />;
}
