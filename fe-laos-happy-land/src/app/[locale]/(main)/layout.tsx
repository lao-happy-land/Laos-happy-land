import MainLayout from "@/components/layout/main-layout";

export default function MainPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
