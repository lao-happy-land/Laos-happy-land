import NewsDetailPage from "@/components/business/landing/news-detail";

interface NewsDetailPageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPageRoute({
  params,
}: NewsDetailPageRouteProps) {
  const { id } = await params;
  return <NewsDetailPage newsId={id} />;
}
