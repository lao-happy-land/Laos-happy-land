"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Tag, Breadcrumb, Spin, Empty } from "antd";
import { Calendar, Eye, Share2 } from "lucide-react";
import { useUrlLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";
import { useRequest } from "ahooks";
import { newsService } from "@/share/service/news.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";

interface NewsDetailProps {
  newsId: string;
}

const NewsDetailPage = ({ newsId }: NewsDetailProps) => {
  const locale = useUrlLocale();
  const t = useTranslations();

  // Fetch news detail
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
  } = useRequest(
    async () => {
      const response = await newsService.getNewsById(
        newsId,
        getLangByLocale(getValidLocale(locale)),
      );
      return response;
    },
    {
      refreshDeps: [newsId],
      onError: (error) => {
        console.error("Error fetching news detail:", error);
      },
    },
  );

  // Fetch related news
  const { data: relatedNewsData } = useRequest(
    async () => {
      const response = await newsService.getAllNews({
        page: 1,
        perPage: 4,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return (
        response.data?.filter((news) => news.id !== newsId).slice(0, 3) ?? []
      );
    },
    {
      refreshDeps: [newsId],
    },
  );

  // Loading state
  if (newsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (newsError || !newsData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Empty
          description={t("news.newsNotFound")}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href={`/${locale}/news`}>
            <Button type="primary">{t("news.backToNews")}</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const relatedNews = relatedNewsData ?? [];

  const breadcrumbItems = [
    {
      title: (
        <Link
          href={`/${locale}`}
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Trang chủ
        </Link>
      ),
    },
    {
      title: (
        <Link
          href={`/${locale}/news`}
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Tin tức
        </Link>
      ),
    },
    {
      title: newsData.title,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Main Content */}
          <div>
            <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
              {/* Article Header */}
              <div className="p-8">
                <div className="mb-6">
                  {newsData.type && (
                    <Tag color="red" className="mb-4 px-3 py-1 text-sm">
                      {newsData.type.name}
                    </Tag>
                  )}
                  <h1 className="mb-6 text-4xl leading-tight font-bold text-neutral-900">
                    {newsData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {new Date(newsData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span>
                        {newsData.viewCount ?? newsData.viewsCount ?? 0}{" "}
                        {t("news.views")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Article Description */}
                {newsData.description && (
                  <div className="mb-8 rounded-lg bg-blue-50 p-6">
                    <p className="text-lg leading-relaxed text-gray-700">
                      {newsData.description}
                    </p>
                  </div>
                )}

                {/* Article Content */}
                {newsData.details && newsData.details.length > 0 && (
                  <div className="prose prose-lg mb-8 max-w-none">
                    {newsData.details.map((block, index) => {
                      if (block.type === "heading") {
                        const level = block.level ?? 2;
                        if (level === 1) {
                          return (
                            <h1
                              key={index}
                              className="font-semibold text-neutral-900"
                            >
                              {block.value}
                            </h1>
                          );
                        }
                        if (level === 3) {
                          return (
                            <h3
                              key={index}
                              className="font-semibold text-neutral-900"
                            >
                              {block.value}
                            </h3>
                          );
                        }
                        return (
                          <h2
                            key={index}
                            className="font-semibold text-neutral-900"
                          >
                            {block.value}
                          </h2>
                        );
                      }
                      if (block.type === "paragraph") {
                        return (
                          <p
                            key={index}
                            className="leading-relaxed text-neutral-700"
                          >
                            {block.value}
                          </p>
                        );
                      }
                      if (block.type === "image") {
                        const imageUrl =
                          block.url ?? block.value ?? "/images/placeholder.jpg";
                        return (
                          <div key={index} className="my-8">
                            <div className="relative h-96 w-full overflow-hidden rounded-xl">
                              <Image
                                src={imageUrl}
                                alt="News image"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 75vw"
                              />
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {/* Share Buttons */}
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-neutral-700">
                        {t("news.share")}:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="text"
                          icon={<Share2 size={18} />}
                          className="text-neutral-500 hover:bg-neutral-50 hover:text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related News */}
            {relatedNews.length > 0 && (
              <div>
                <h3 className="mb-6 text-2xl font-semibold text-neutral-900">
                  {t("news.relatedNews")}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {relatedNews.map((news, index) => {
                    // Get image from news details or use random fallback
                    const newsImage = news.details?.find(
                      (d) => d.type === "image",
                    )?.url;
                    const randomImages = [
                      "/images/landingpage/market-news/market-news-1.jpg",
                      "/images/landingpage/market-news/market-news-2.jpg",
                      "/images/landingpage/market-news/market-news-3.jpg",
                    ];
                    const fallbackImage =
                      randomImages[index % randomImages.length];
                    const imageUrl =
                      newsImage ??
                      fallbackImage ??
                      "/images/landingpage/market-news/market-news-1.jpg";

                    return (
                      <Link
                        key={news.id}
                        href={`/${locale}/news/${news.id}`}
                        className="block overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={news.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          {news.type && (
                            <div className="absolute top-3 left-3">
                              <Tag color="blue" className="px-2 py-1 text-xs">
                                {news.type.name}
                              </Tag>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-tight font-semibold text-neutral-900 transition-colors">
                            {news.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-neutral-500">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>
                                {new Date(news.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>
                                {news.viewCount ?? news.viewsCount ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
