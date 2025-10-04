import BrokerDetail from "@/components/business/landing/broker-detail";
import { generateBrokerMetadata } from "@/share/helper/metadata.helper";
import { userService } from "@/share/service/user.service";
import type { Metadata } from "next";

interface BrokerDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: BrokerDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    const response = await userService.getUserById(id);
    const broker = response.user;

    if (broker) {
      return generateBrokerMetadata(
        {
          fullName: broker.fullName ?? "Unknown Broker",
          specialties: broker.specialties,
          location: broker.location ?? "",
        },
        locale,
      );
    }
  } catch (error) {
    console.error("Error fetching broker for metadata:", error);
  }

  // Fallback metadata
  return generateBrokerMetadata(
    {
      fullName: "Broker",
    },
    locale,
  );
}

export default async function BrokerDetailPage({
  params,
}: BrokerDetailPageProps) {
  const { id } = await params;
  return <BrokerDetail brokerId={id} />;
}
