import BrokerDetail from "@/components/business/landing/broker-detail";

interface BrokerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrokerDetailPage({
  params,
}: BrokerDetailPageProps) {
  const { id } = await params;
  return <BrokerDetail brokerId={id} />;
}
