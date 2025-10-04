import PropertyDetails from "@/components/business/property-details";
import { generatePropertyMetadata } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import propertyService from "@/share/service/property.service";
import type { Metadata } from "next";

interface PropertyPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    const property = await propertyService.getPropertyById(id);

    if (property) {
      return generatePropertyMetadata(
        {
          title: property.title,
          description: property.description,
          location: property.location?.address ?? "",
          price:
            typeof property.price === "string"
              ? parseInt(property.price)
              : undefined,
          images: property.images ?? [],
        },
        locale,
      );
    }
  } catch (error) {
    console.error("Error fetching property for metadata:", error);
  }

  // Fallback metadata
  const t = await getTranslations({ locale, namespace: "metadata.properties" });
  return generatePropertyMetadata(
    {
      title: t("title"),
      description: t("description"),
    },
    locale,
  );
}

export default async function PropertyDetailsPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  return <PropertyDetails propertyId={id} />;
}
