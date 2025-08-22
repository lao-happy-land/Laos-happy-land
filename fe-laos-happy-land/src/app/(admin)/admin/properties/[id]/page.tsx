import PropertyForm from "@/components/business/admin/properties/property-form";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;
  return <PropertyForm mode="edit" propertyId={id} />;
}
