import AdminLayout from "@/components/layout/admin-layout";

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
