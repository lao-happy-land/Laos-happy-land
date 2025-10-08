import BankRequestForm from "@/components/business/bank-request";
import type { Metadata } from "next";
import { generateMetadata as genMetadata } from "@/share/helper/metadata.helper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return genMetadata(
    {
      title: "Bank Consultant Application - Laohappyland",
      description:
        "Apply to become a verified bank consultant. Help clients with their financing needs.",
      keywords:
        "bank consultant, apply, bank request, Laos, real estate financing",
      url: "/bank-request",
    },
    locale,
  );
}

export default function BankRequestPage() {
  return <BankRequestForm />;
}
