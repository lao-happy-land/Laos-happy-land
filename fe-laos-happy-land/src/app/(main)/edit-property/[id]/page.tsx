import EditProperty from "@/components/business/user/edit-property";

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { id } = await params;
  return <EditProperty propertyId={id} />;
}
