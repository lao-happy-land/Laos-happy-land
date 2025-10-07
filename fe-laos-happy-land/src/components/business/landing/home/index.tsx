"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Row, Col, Typography, Space, Card, Tag } from "antd";
import { CheckCircle, Clock, User, Building2, Eye } from "lucide-react";
import { useRequest } from "ahooks";
import SearchBox from "./search-box";
import propertyService from "@/share/service/property.service";
import type { Property } from "@/@types/types";
import PropertyCard from "@/components/business/common/property-card";
import ProjectCard from "@/components/business/common/project-card";
import PropertyCardSkeleton from "@/components/business/common/property-card-skeleton";
import { useUrlLocale } from "@/utils/locale";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useTranslations } from "next-intl";
import { newsService } from "@/share/service/news.service";
import type { News } from "@/@types/types";
import { useCurrencyStore } from "@/share/store/currency.store";

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const locale = useUrlLocale();
  const t = useTranslations();
  const { currency } = useCurrencyStore();
  const {
    data: featuredPropertiesData,
    loading: featuredLoading,
    error: featuredError,
  } = useRequest(
    () =>
      propertyService.getProperties({
        perPage: 4,
        transaction: "sale",
      }),
    {
      refreshDeps: [currency],
      onError: (error) => {
        console.error("Error fetching featured properties:", error);
      },
    },
  );

  // Fetch project properties
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useRequest(
    () =>
      propertyService.getProperties({
        transaction: "project",
        perPage: 3,
      }),
    {
      refreshDeps: [currency],
      onError: (error) => {
        console.error("Error fetching project properties:", error);
      },
    },
  );

  // Extract properties from API response
  const featuredProperties = featuredPropertiesData?.data ?? [];
  const projectProperties = projectData?.data ?? [];

  // Calculate statistics from API data
  const totalProperties = featuredPropertiesData?.meta?.itemCount ?? 0;
  const totalProjects = projectData?.meta?.itemCount ?? 0;
  const totalViews = featuredProperties.reduce(
    (sum, prop) => sum + (prop.viewsCount ?? 0),
    0,
  );

  // Fetch news data from API
  const {
    data: newsData,
    loading: newsLoading,
    error: newsError,
  } = useRequest(
    () =>
      newsService.getAllNews({
        page: 1,
        perPage: 3,
        lang: getLangByLocale(getValidLocale(locale)),
      }),
    {
      refreshDeps: [],
      onError: (error) => {
        console.error("Error fetching news:", error);
      },
    },
  );

  // Extract news items from API response
  const newsItems = newsData?.data ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel and Search */}
      <SearchBox />
      {/* Featured Properties Section */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Title level={2} className="mb-4 text-neutral-900">
              {t("home.featuredProperties")}
            </Title>
            <Paragraph type="secondary" className="text-lg">
              {t("home.featuredPropertiesDescription")}
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {featuredError ? (
              <Col span={24} className="py-8 text-center">
                <Text type="danger">{t("home.propertiesLoadError")}</Text>
              </Col>
            ) : featuredLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <PropertyCardSkeleton />
                </Col>
              ))
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map((property: Property) => (
                <Col xs={24} sm={12} lg={6} key={property.id}>
                  <PropertyCard property={property} />
                </Col>
              ))
            ) : (
              <Col span={24} className="py-8 text-center">
                <Text type="secondary">{t("home.noPropertiesFound")}</Text>
              </Col>
            )}
          </Row>

          <div className="mt-12 text-center">
            <Link href={`/${locale}/properties-for-sale`}>
              <Button
                type="default"
                size="large"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
              >
                {t("home.viewMore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Title level={2} className="mb-4 text-neutral-900">
              {t("home.realEstateProjects")}
            </Title>
            <Paragraph type="secondary" className="text-lg">
              {t("home.realEstateProjectsDescription")}
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {projectError ? (
              <Col span={24} className="py-8 text-center">
                <Text type="danger">{t("home.projectsLoadError")}</Text>
              </Col>
            ) : projectLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Col xs={24} md={8} key={index}>
                  <PropertyCardSkeleton size="large" />
                </Col>
              ))
            ) : projectProperties.length > 0 ? (
              projectProperties.map((project: Property) => (
                <Col xs={24} md={8} key={project.id}>
                  <ProjectCard project={project} />
                </Col>
              ))
            ) : (
              <Col span={24} className="py-8 text-center">
                <Text type="secondary">{t("home.noProjectsFound")}</Text>
              </Col>
            )}
          </Row>

          <div className="mt-12 text-center">
            <Link href={`/${locale}/properties-for-project`}>
              <Button
                type="default"
                size="large"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
              >
                {t("home.viewAllProjects")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="from-primary-500 to-primary-600 bg-gradient-to-r py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {t("home.outstandingStats")}
            </h2>
            <p className="text-primary-100 text-lg">
              {t("home.outstandingStatsDescription")}
            </p>
          </div>

          <div className="container mx-auto grid grid-cols-4 gap-4 px-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalProperties < 1000 ? "1000+" : `${totalProperties}+`}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  {t("home.totalListings")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalProjects < 100 ? "100+" : `${totalProjects}+`}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  {t("home.totalProjects")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalViews < 10000 ? "10000+" : `${totalViews}+`}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  {t("home.totalViews")}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-primary-100 text-sm font-medium">
                  {t("home.brokers")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900">
              {t("home.marketNews")}
            </h2>
            <p className="text-lg text-neutral-900">
              {t("home.marketNewsDescription")}
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {newsError ? (
              <Col span={24} className="py-8 text-center">
                <Text type="danger">{t("home.newsLoadError")}</Text>
              </Col>
            ) : newsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card loading className="h-80" />
                </Col>
              ))
            ) : newsItems.length > 0 ? (
              newsItems.map((news: News, index: number) => {
                // Get image from news details or use random fallback
                const newsImage = news.details?.find(
                  (d) => d.type === "image",
                )?.url;
                const randomImages = [
                  "/images/landingpage/market-news/market-news-1.jpg",
                  "/images/landingpage/market-news/market-news-2.jpg",
                  "/images/landingpage/market-news/market-news-3.jpg",
                ];
                const fallbackImage = randomImages[index % randomImages.length];
                const imageUrl =
                  newsImage ??
                  fallbackImage ??
                  "/images/landingpage/market-news/market-news-1.jpg";

                return (
                  <Col xs={24} md={8} key={news.id}>
                    <Link href={`/${locale}/news/${news.id}`}>
                      <Card
                        hoverable
                        className="h-full overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        styles={{
                          body: { padding: "20px" },
                        }}
                        cover={
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={news.title}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                        }
                      >
                        <div className="mb-3">
                          <Space>
                            <Tag color="primary">
                              {news.newsType?.name ??
                                news.type?.name ??
                                t("home.news")}
                            </Tag>
                            <Text type="secondary" className="text-xs">
                              {new Date(news.createdAt).toLocaleDateString(
                                locale === "vn"
                                  ? "vi-VN"
                                  : locale === "la"
                                    ? "lo-LA"
                                    : "en-US",
                              )}
                            </Text>
                          </Space>
                        </div>
                        <Title
                          level={5}
                          className="hover:text-primary-500 mb-3 line-clamp-2 text-base font-semibold text-neutral-900 transition-colors"
                        >
                          {news.title}
                        </Title>
                      </Card>
                    </Link>
                  </Col>
                );
              })
            ) : (
              <Col span={24} className="py-8 text-center">
                <Text type="secondary">{t("home.noNewsAvailable")}</Text>
              </Col>
            )}
          </Row>

          <div className="mt-12 text-center">
            <Link href={`/${locale}/news`}>
              <Button
                type="default"
                size="large"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
              >
                {t("home.viewAllNews")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Title level={2} className="mb-4 text-neutral-900">
              {t("home.whyChooseUs")}
            </Title>
            <Paragraph type="secondary" className="text-lg">
              {t("home.whyChooseUsDescription")}
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-primary-50 group-hover:bg-primary-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <CheckCircle className="text-primary-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  {t("home.trustworthy")}
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  {t("home.trustworthyDescription")}
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-accent-50 group-hover:bg-accent-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <Clock className="text-accent-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  {t("home.fastConvenient")}
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  {t("home.fastConvenientDescription")}
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-secondary-50 group-hover:bg-secondary-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <User className="text-secondary-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  {t("home.support247")}
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  {t("home.support247Description")}
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-primary-500 to-primary-600 bg-gradient-to-r py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
              {t("home.havePropertyToSell")}
            </h2>
            <p className="text-primary-100 mb-8 text-xl">
              {t("home.postFreeDescription")}
            </p>
            <Space
              size="large"
              className="flex flex-col sm:flex-row sm:justify-center"
            >
              <Link href={`/${locale}/create-property`}>
                <Button
                  type="primary"
                  size="large"
                  className="text-primary-500 rounded-lg bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-neutral-100 hover:shadow-xl"
                >
                  {t("home.postForFree")}
                </Button>
              </Link>
              <Button
                type="default"
                size="large"
                className="hover:text-primary-500 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:shadow-xl"
              >
                {t("home.freeConsultation")}
              </Button>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
