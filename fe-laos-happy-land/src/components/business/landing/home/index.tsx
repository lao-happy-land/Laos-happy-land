"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Row, Col, Typography, Space, Card, Tag } from "antd";
import {
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  Building2,
  Eye,
} from "lucide-react";
import { useRequest } from "ahooks";
import SearchBox from "./search-box";
import propertyService from "@/share/service/property.service";
import type { Property } from "@/@types/types";
import PropertyCard from "@/components/business/common/property-card";
import ProjectCard from "@/components/business/common/project-card";
import PropertyCardSkeleton from "@/components/business/common/property-card-skeleton";

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const { data: featuredPropertiesData, loading: featuredLoading } = useRequest(
    () =>
      propertyService.getProperties({
        perPage: 4,
        transaction: "sale",
      }),
    {
      refreshDeps: [],
    },
  );

  // Fetch project properties
  const { data: projectData, loading: projectLoading } = useRequest(
    () =>
      propertyService.getProperties({
        transaction: "project",
        perPage: 3,
      }),
    {
      refreshDeps: [],
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

  const newsItems = [
    {
      id: 1,
      image: "/images/landingpage/market-news/market-news-1.jpg",
      title: "Thị trường bất động sản Lào tăng trưởng mạnh trong Q3/2025",
      excerpt:
        "Theo báo cáo mới nhất, thị trường BDS Lào đạt mức tăng trưởng 15% so với cùng kỳ năm trước...",
      date: "8 tháng 8, 2025",
      category: "Thị trường",
    },
    {
      id: 2,
      image: "/images/landingpage/market-news/market-news-2.jpg",
      title: "Xu hướng đầu tư BDS tại khu vực Mekong",
      excerpt:
        "Các chuyên gia dự báo khu vực ven sông Mekong sẽ là điểm nóng trong thời gian tới...",
      date: "5 tháng 8, 2025",
      category: "Đầu tư",
    },
    {
      id: 3,
      image: "/images/landingpage/market-news/market-news-3.jpg",
      title: "Chính sách mới về sở hữu BDS cho người nước ngoài",
      excerpt:
        "Chính phủ Lào công bố những điều chỉnh quan trọng trong quy định sở hữu bất động sản...",
      date: "2 tháng 8, 2025",
      category: "Pháp lý",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel and Search */}
      <SearchBox />
      {/* Featured Properties Section */}
      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Title level={2} className="mb-4 text-neutral-900">
              Bất động sản dành cho bạn
            </Title>
            <Paragraph type="secondary" className="text-lg">
              Khám phá những căn hộ, nhà đất chất lượng tại các khu vực nổi bật
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {featuredLoading ? (
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
                <Text type="secondary">
                  Không có bất động sản nào được tìm thấy
                </Text>
              </Col>
            )}
          </Row>

          <div className="mt-12 text-center">
            <Link href="/properties-for-sale">
              <Button
                type="default"
                size="large"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
              >
                Xem thêm
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
              Dự án bất động sản
            </Title>
            <Paragraph type="secondary" className="text-lg">
              Khám phá các dự án đang mở bán với tiềm năng đầu tư cao
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {projectLoading ? (
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
                <Text type="secondary">Không có dự án nào được tìm thấy</Text>
              </Col>
            )}
          </Row>

          <div className="mt-12 text-center">
            <Link href="/properties-for-project">
              <Button
                type="default"
                size="large"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
              >
                Xem tất cả dự án
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
              Thống kê nổi bật
            </h2>
            <p className="text-primary-100 text-lg">
              Những con số ấn tượng về nền tảng của chúng tôi
            </p>
          </div>

          <div className="container mx-auto grid grid-cols-4 gap-4 px-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalProperties}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  Tổng tin đăng
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalProjects}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  Tổng dự án
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white">
                  {totalViews}
                </div>
                <div className="text-primary-100 text-sm font-medium">
                  Tổng lượt xem
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
                  Môi giới
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
              Tin tức thị trường
            </h2>
            <p className="text-lg text-neutral-900">
              Cập nhật thông tin mới nhất về bất động sản và xu hướng đầu tư
            </p>
          </div>

          <Row gutter={[16, 16]}>
            {newsItems.map((news) => (
              <Col xs={24} md={8} key={news.id}>
                <Card
                  hoverable
                  className="h-full overflow-hidden rounded-xl border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  styles={{
                    body: { padding: "20px" },
                  }}
                  cover={
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={news.image}
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
                      <Tag color="primary">{news.category}</Tag>
                      <Text type="secondary" className="text-xs">
                        {news.date}
                      </Text>
                    </Space>
                  </div>
                  <Title
                    level={5}
                    className="hover:text-primary-500 mb-3 line-clamp-2 text-base font-semibold text-neutral-900 transition-colors"
                  >
                    {news.title}
                  </Title>
                  <Paragraph
                    type="secondary"
                    className="mb-4 line-clamp-2 text-sm leading-relaxed"
                  >
                    {news.excerpt}
                  </Paragraph>
                  <Link href={`/news/${news.id}`}>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowRight className="h-4 w-4" />}
                      className="text-primary-500 hover:text-primary-600 flex h-auto items-center gap-2 p-0 text-sm font-semibold"
                    >
                      Đọc thêm
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-12 text-center">
            <Button
              type="default"
              size="large"
              className="border-primary-500 text-primary-500 hover:bg-primary-500 rounded-lg border-2 px-8 py-3 font-semibold transition-all duration-300 hover:text-white hover:shadow-lg"
            >
              Xem tất cả tin tức
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <Title level={2} className="mb-4 text-neutral-900">
              Tại sao chọn Laos Happy Land?
            </Title>
            <Paragraph type="secondary" className="text-lg">
              Chúng tôi cam kết mang đến dịch vụ tốt nhất cho khách hàng
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-primary-50 group-hover:bg-primary-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <CheckCircle className="text-primary-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  Tin cậy & Minh bạch
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  Thông tin chính xác, pháp lý rõ ràng, đảm bảo quyền lợi khách
                  hàng
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-accent-50 group-hover:bg-accent-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <Clock className="text-accent-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  Nhanh chóng & Tiện lợi
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  Tìm kiếm và đăng tin dễ dàng, giao diện thân thiện với người
                  dùng
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="group p-6 text-center transition-all duration-300 hover:scale-105">
                <div className="bg-secondary-50 group-hover:bg-secondary-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  <User className="text-secondary-500 h-10 w-10" />
                </div>
                <Title level={4} className="mb-3 text-neutral-900">
                  Hỗ trợ 24/7
                </Title>
                <Paragraph
                  type="secondary"
                  className="text-base leading-relaxed"
                >
                  Đội ngũ tư vấn chuyên nghiệp, luôn sẵn sàng hỗ trợ khách hàng
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
              Bạn đang có bất động sản cần bán/cho thuê?
            </h2>
            <p className="text-primary-100 mb-8 text-xl">
              Đăng tin miễn phí - Tiếp cận hàng triệu khách hàng tiềm năng
            </p>
            <Space
              size="large"
              className="flex flex-col sm:flex-row sm:justify-center"
            >
              <Link href="/create-property">
                <Button
                  type="primary"
                  size="large"
                  className="text-primary-500 rounded-lg bg-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:bg-neutral-100 hover:shadow-xl"
                >
                  Đăng tin miễn phí
                </Button>
              </Link>
              <Button
                type="default"
                size="large"
                className="hover:text-primary-500 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:shadow-xl"
              >
                Tư vấn miễn phí
              </Button>
            </Space>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
