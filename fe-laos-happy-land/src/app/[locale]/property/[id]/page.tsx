import PropertyDetails from "@/components/business/property-details";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyPageProps) {
  const { id } = await params;
  return <PropertyDetails propertyId={id} />;
}
