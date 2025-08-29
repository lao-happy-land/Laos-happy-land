import MainLayout from "@/components/layout/main-layout";

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
