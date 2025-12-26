import ResetPassword from "@/components/business/auth/reset-password";
import { generateMetadata as generateMetadataHelper } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.resetPassword",
  });

  return generateMetadataHelper(
    {
      title: t("title"),
      description: t("description"),
      keywords: t("keywords"),
      url: "/reset-password",
    },
    locale,
  );
}

export default async function ResetPasswordPage() {
  return <ResetPassword />;
}
