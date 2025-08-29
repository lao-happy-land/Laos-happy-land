import AdminLayout from "@/components/layout/admin-layout";
import { App } from "antd";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <App>
      <AdminLayout>{children}</AdminLayout>
    </App>
  );
}
