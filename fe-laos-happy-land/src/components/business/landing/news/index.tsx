"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import {
  Button,
  Tag,
  Breadcrumb,
  Input,
  Select,
  Spin,
  Empty,
  Pagination,
} from "antd";
import {
  Calendar,
  Eye,
  ArrowRight,
  Search as SearchIcon,
  Filter,
} from "lucide-react";
import { useRequest } from "ahooks";
import { newsService } from "@/share/service/news.service";
import { newsTypeService } from "@/share/service/news-type.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import type { News, NewsType } from "@/@types/types";
import { useTranslations } from "next-intl";

const { Search } = Input;
const { Option } = Select;

const NewsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useUrlLocale();
  const t = useTranslations();

  const [filters, setFilters] = useState({
    newsTypeId: searchParams.get("newsTypeId") ?? "all",
    search: searchParams.get("search") ?? "",
    sortBy: searchParams.get("sortBy") ?? "newest",
    page: parseInt(searchParams.get("page") ?? "1"),
  });

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams();
      if (newFilters.newsTypeId !== "all")
        params.set("newsTypeId", newFilters.newsTypeId);
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.page > 1) params.set("page", newFilters.page.toString());

      const queryString = params.toString();
      const newURL = queryString ? `?${queryString}` : "";
      router.push(`/${locale}/news${newURL}`, { scroll: false });
    },
    [router, locale],
  );

  // Fetch news data from API with pagination
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
    refresh: refreshNews,
  } = useRequest(
    () =>
      newsService.getAllNews({
        page: filters.page,
        perPage: 12, // 12 items per page
        search: filters.search,
        newsTypeId:
          filters.newsTypeId !== "all" ? filters.newsTypeId : undefined,
        lang: getLangByLocale(getValidLocale(locale)),
      }),
    {
      refreshDeps: [filters.newsTypeId, filters.search, filters.page],
    },
  );

  // Fetch news types for category filter
  const { data: newsTypesData } = useRequest(() =>
    newsTypeService.getAllNewsTypes({
      lang: getLangByLocale(getValidLocale(locale)),
    }),
  );

  // Process news data
  const processedNews = newsData?.data ?? [];
  const totalItems = newsData?.total ?? 0;
  const currentPage = filters.page;
  const totalPages = Math.ceil(totalItems / 12);
  const featuredNews = processedNews[0];
  const regularNews = processedNews.slice(1);

  // Filter handlers
  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filtering
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const newFilters = { ...filters, search: "", page: 1 };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  // Search value state for input display
  const [searchValue, setSearchValue] = useState(filters.search);

  // Update search value when filters change from URL
  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  // Create categories from API data
  const categories = [
    { value: "all", label: t("news.all") },
    ...(newsTypesData?.data ?? []).map((type: NewsType) => ({
      value: type.id,
      label: type.name,
    })),
  ];

  const getImageURL = (news: News) => {
    const content = news.details;
    if (content) {
      const image = content.find((item) => item.type === "image");
      if (image) {
        return (
          image.url ??
          image.value ??
          "/images/landingpage/project/project-1.jpg"
        );
      }
    }
    return "/images/landingpage/project/project-1.jpg";
  };

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          {t("news.home")}
        </Link>
      ),
    },
    {
      title: t("news.title"),
    },
  ];

  // Error state
  if (newsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
            {t("news.errorOccurred")}
          </h2>
          <p className="mb-4 text-neutral-600">{t("news.cannotLoadData")}</p>
          <Button type="primary" onClick={refreshNews}>
            {t("news.tryAgain")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        {/* Breadcrumb */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h1 className="mb-4 text-5xl font-bold text-neutral-900">
              {t("news.realEstateNews")}
            </h1>
            <p className="text-xl text-neutral-600">
              {t("news.latestMarketInfo")}
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="sticky top-[80px] z-50 border-b border-neutral-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <Search
                  placeholder={t("news.searchNews")}
                  allowClear
                  size="large"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                  enterButton={t("news.search")}
                  loading={newsLoading}
                  prefix={<SearchIcon size={16} />}
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-4">
                <Select
                  value={filters.newsTypeId}
                  onChange={(value) => handleFilterChange("newsTypeId", value)}
                  size="large"
                  className="w-40"
                  suffixIcon={<Filter size={16} />}
                >
                  {categories.map((cat) => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {newsLoading ? (
            <div className="flex min-h-[50vh] items-center justify-center bg-neutral-50">
              <Spin size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Featured News */}
                {featuredNews && (
                  <div className="mb-12">
                    <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
                      {t("news.featuredNews")}
                    </h2>
                    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
                      <div className="relative h-96 overflow-hidden">
                        <Image
                          src={getImageURL(featuredNews)}
                          alt={featuredNews.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 75vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <Tag color="red" className="px-3 py-1 text-sm">
                            {featuredNews.type?.name ?? t("news.title")}
                          </Tag>
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="mb-4 text-2xl leading-tight font-bold text-neutral-900">
                          {featuredNews.title}
                        </h3>
                        <p className="mb-6 text-lg leading-relaxed text-neutral-600">
                          {featuredNews.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>
                                {new Date(
                                  featuredNews.createdAt,
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye size={16} />
                              <span>
                                {featuredNews.viewCount ?? 0}{" "}
                                {t("news.readCount")}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="primary"
                            size="large"
                            icon={<ArrowRight size={16} />}
                            className="font-semibold"
                            onClick={() =>
                              router.push(`/${locale}/news/${featuredNews.id}`)
                            }
                          >
                            {t("news.readMore")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular News Grid */}
                <div className="mb-6">
                  <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
                    {t("news.latestNews")}
                  </h2>
                </div>

                {processedNews.length === 0 ? (
                  <Empty description={t("news.noNewsYet")} className="py-12" />
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {regularNews.map((news: News) => (
                      <div
                        key={news.id}
                        className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={getImageURL(news)}
                            alt={news.title}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <Tag color="blue" className="px-2 py-1 text-xs">
                              {news.type?.name ?? t("news.title")}
                            </Tag>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-tight font-semibold text-neutral-900 transition-colors">
                            {news.title}
                          </h3>
                          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                            {news.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>
                                  {new Date(news.createdAt).toLocaleDateString(
                                    "vi-VN",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye size={12} />
                                <span>{news.viewCount ?? 0}</span>
                              </div>
                            </div>
                            <Button
                              type="link"
                              size="small"
                              icon={<ArrowRight size={12} />}
                              className="text-primary-500 hover:text-primary-600 p-0 font-semibold"
                              onClick={() =>
                                router.push(`/${locale}/news/${news.id}`)
                              }
                            >
                              {t("news.readMore")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      current={currentPage}
                      total={totalItems}
                      pageSize={12}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} ${t("news.paginationText")} ${total} ${t("news.title")}`
                      }
                      onChange={handlePageChange}
                      className="news-pagination"
                    />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Recent News */}
                <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                    {t("news.recentNews")}
                  </h3>
                  <div className="space-y-4">
                    {processedNews.slice(0, 5).map((news: News) => (
                      <div key={news.id} className="group cursor-pointer">
                        <div className="flex gap-3">
                          <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                            <Image
                              src={getImageURL(news)}
                              alt={news.title}
                              width={64}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="group-hover:text-primary-500 line-clamp-2 text-sm leading-tight font-medium text-neutral-900 transition-colors">
                              {news.title}
                            </h4>
                            <p className="mt-1 text-xs text-neutral-500">
                              {new Date(news.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;
