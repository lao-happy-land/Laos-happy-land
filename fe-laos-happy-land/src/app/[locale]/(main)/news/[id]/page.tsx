import NewsDetailPage from "@/components/business/landing/news-detail";
import { generateNewsMetadata } from "@/share/helper/metadata.helper";
import { getTranslations } from "next-intl/server";
import { newsService } from "@/share/service/news.service";
import type { Metadata } from "next";
import type { NewsDetail } from "@/@types/types";

interface NewsDetailPageRouteProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageRouteProps): Promise<Metadata> {
  const { id, locale } = await params;

  try {
    const news = await newsService.getNewsById(id);

    if (news) {
      return generateNewsMetadata(
        {
          title: news.title,
          description: news.description,
          type: news.type?.name,
          images: news.details
            ?.filter((d: NewsDetail) => d.type === "image")
            .map((d: NewsDetail) => d.value ?? ""),
        },
        locale,
      );
    }
  } catch (error) {
    console.error("Error fetching news for metadata:", error);
  }

  // Fallback metadata
  const t = await getTranslations({ locale, namespace: "metadata.news" });
  return generateNewsMetadata(
    {
      title: t("title"),
      description: t("description"),
    },
    locale,
  );
}

export default async function NewsDetailPageRoute({
  params,
}: NewsDetailPageRouteProps) {
  const { id } = await params;
  return <NewsDetailPage newsId={id} />;
}
