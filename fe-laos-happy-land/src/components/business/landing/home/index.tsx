"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Statistic,
  Avatar,
} from "antd";
import {
  MapPin,
  Heart,
  Home,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
  Bed,
  Bath,
} from "lucide-react";
import SearchBox from "./search-box";

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const featuredProperties = [
    {
      id: 1,
      title: "Căn hộ cao cấp tại trung tâm Vientiane",
      location: "Vientiane",
      price: "2.5 tỷ LAK",
      area: "85 m²",
      bedrooms: 2,
      bathrooms: 2,
      image: "/images/landingpage/apartment/apart-1.jpg",
      type: "Căn hộ",
      featured: true,
    },
    {
      id: 2,
      title: "Nhà phố 3 tầng gần Mekong",
      location: "Luang Prabang",
      price: "1.8 tỷ LAK",
      area: "120 m²",
      bedrooms: 3,
      bathrooms: 3,
      image: "/images/landingpage/apartment/apart-2.jpg",
      type: "Nhà phố",
      featured: false,
    },
    {
      id: 3,
      title: "Đất thổ cư mặt tiền đường lớn",
      location: "Pakse",
      price: "800 triệu LAK",
      area: "200 m²",
      bedrooms: 0,
      bathrooms: 0,
      image: "/images/landingpage/apartment/apart-3.jpg",
      type: "Đất",
      featured: true,
    },
    {
      id: 4,
      title: "Villa sang trọng view sông",
      location: "Vientiane",
      price: "5.2 tỷ LAK",
      area: "300 m²",
      bedrooms: 4,
      bathrooms: 4,
      image: "/images/landingpage/apartment/apart-2.jpg",
      type: "Villa",
      featured: true,
    },
  ];

  const projectData = [
    {
      image: "/images/landingpage/project/project-1.jpg",
      title: "Dự án Vinhomes Smart City Lào",
      description: "Khu đô thị thông minh tại Vientiane",
      price: "Từ 1.2 tỷ LAK",
      status: "🏗️ Đang xây dựng",
      handover: "📅 Bàn giao Q4/2025",
    },
    {
      image: "/images/landingpage/project/project-2.jpg",
      title: "Dự án Eco Green Saigon",
      description: "Căn hộ cao cấp tại Quận 7",
      price: "Từ 2.5 tỷ VND",
      status: "✅ Đã hoàn thành",
      handover: "📅 Bàn giao Q1/2024",
    },
    {
      image: "/images/landingpage/project/project-3.jpg",
      title: "Dự án The Matrix One",
      description: "Vị trí vàng tại Mỹ Đình",
      price: "Từ 3.1 tỷ VND",
      status: "🏗️ Đang xây dựng",
      handover: "📅 Bàn giao Q2/2026",
    },
  ];

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
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Title level={2}>Bất động sản dành cho bạn</Title>
            <Paragraph type="secondary">
              Khám phá những căn hộ, nhà đất chất lượng tại các khu vực nổi bật
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {featuredProperties.map((property) => (
              <Col xs={24} sm={12} lg={6} key={property.id}>
                <Card
                  hoverable
                  className="group rounded bg-white shadow transition-shadow hover:shadow-md"
                  cover={
                    <div className="relative">
                      <Image
                        src={property.image}
                        alt={property.title}
                        width={400}
                        height={160}
                        className="h-40 w-full rounded-t object-cover"
                      />
                      {property.featured && (
                        <div className="absolute top-2 left-2">
                          <Tag color="red">Nổi bật</Tag>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button
                          type="text"
                          icon={<Heart className="h-4 w-4" />}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white"
                        />
                      </div>
                    </div>
                  }
                >
                  <Title
                    level={5}
                    className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-red-500"
                  >
                    {property.title}
                  </Title>

                  <div className="mb-2 text-sm font-bold text-red-500">
                    {property.price}
                  </div>

                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <Space size="small">
                      <MapPin className="h-3 w-3" />
                      <Text type="secondary" className="text-xs">
                        {property.location}
                      </Text>
                    </Space>
                    <Space size="small">
                      <Home className="h-3 w-3" />
                      <Text type="secondary" className="text-xs">
                        {property.area}
                      </Text>
                    </Space>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <Space size="small">
                      {property.bedrooms > 0 && (
                        <Space size="small">
                          <Bed className="h-3 w-3" />
                          <Text type="secondary" className="text-xs">
                            {property.bedrooms} PN
                          </Text>
                        </Space>
                      )}
                      {property.bathrooms > 0 && (
                        <Space size="small">
                          <Bath className="h-3 w-3" />
                          <Text type="secondary" className="text-xs">
                            {property.bathrooms} WC
                          </Text>
                        </Space>
                      )}
                    </Space>
                    <Tag color="orange">{property.type}</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-6 text-center">
            <Button
              type="default"
              size="large"
              className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            >
              Xem thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Title level={2}>Dự án bất động sản</Title>
            <Paragraph type="secondary">
              Khám phá các dự án đang mở bán
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {projectData.map((project, index) => (
              <Col xs={24} md={8} key={index}>
                <Card
                  hoverable
                  className="rounded bg-white shadow transition-shadow hover:shadow-md"
                  cover={
                    <div className="relative h-48 w-full overflow-hidden rounded-t">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  }
                >
                  <Title level={4} className="mb-2">
                    {project.title}
                  </Title>
                  <Paragraph type="secondary" className="mb-2">
                    {project.description}
                  </Paragraph>
                  <div className="mb-2 font-bold text-red-500">
                    {project.price}
                  </div>
                  <Row justify="space-between">
                    <Col>
                      <Text type="secondary" className="text-xs">
                        {project.status}
                      </Text>
                    </Col>
                    <Col>
                      <Text type="secondary" className="text-xs">
                        {project.handover}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-6 text-center">
            <Button
              type="default"
              size="large"
              className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            >
              Xem tất cả dự án
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-orange-500 py-8 text-white">
        <div className="container mx-auto px-4">
          <Row gutter={16} justify="center">
            <Col xs={12} md={6}>
              <Statistic
                title="Tin đăng"
                value={100000}
                suffix="+"
                valueStyle={{ color: "white", fontSize: "24px" }}
                className="text-center"
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title="Môi giới"
                value={5000}
                suffix="+"
                valueStyle={{ color: "white", fontSize: "24px" }}
                className="text-center"
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title="Khách hàng"
                value={10000}
                suffix="+"
                valueStyle={{ color: "white", fontSize: "24px" }}
                className="text-center"
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title="Dự án"
                value={500}
                suffix="+"
                valueStyle={{ color: "white", fontSize: "24px" }}
                className="text-center"
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Title level={2}>Tin tức thị trường</Title>
            <Paragraph type="secondary">
              Cập nhật thông tin mới nhất về bất động sản
            </Paragraph>
          </div>

          <Row gutter={[16, 16]}>
            {newsItems.map((news) => (
              <Col xs={24} md={8} key={news.id}>
                <Card
                  hoverable
                  className="h-full"
                  styles={{
                    body: { padding: "16px" },
                  }}
                  cover={
                    <div className="relative h-32 w-full overflow-hidden rounded-t">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  }
                >
                  <div className="mb-2">
                    <Space>
                      <Tag color="orange">{news.category}</Tag>
                      <Text type="secondary" className="text-xs">
                        {news.date}
                      </Text>
                    </Space>
                  </div>
                  <Title
                    level={5}
                    className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-500"
                  >
                    {news.title}
                  </Title>
                  <Paragraph
                    type="secondary"
                    className="mb-3 line-clamp-2 text-xs"
                  >
                    {news.excerpt}
                  </Paragraph>
                  <Link href={`/news/${news.id}`}>
                    <Button
                      type="link"
                      size="small"
                      icon={<ArrowRight className="h-3 w-3" />}
                      className="flex h-auto items-center gap-1 p-0 text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Đọc thêm
                    </Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-6 text-center">
            <Button
              type="default"
              size="large"
              className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            >
              Xem tất cả tin tức
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <Title level={2}>Tại sao chọn Laos Happy Land?</Title>
            <Paragraph type="secondary">
              Chúng tôi cam kết mang đến dịch vụ tốt nhất
            </Paragraph>
          </div>

          <Row gutter={24}>
            <Col xs={24} md={8}>
              <div className="p-4 text-center">
                <Avatar
                  size={48}
                  icon={<CheckCircle className="h-6 w-6" />}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
                  style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                />
                <Title level={4}>Tin cậy & Minh bạch</Title>
                <Paragraph type="secondary">
                  Thông tin chính xác, pháp lý rõ ràng
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="p-4 text-center">
                <Avatar
                  size={48}
                  icon={<Clock className="h-6 w-6" />}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
                  style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                />
                <Title level={4}>Nhanh chóng</Title>
                <Paragraph type="secondary">
                  Tìm kiếm và đăng tin dễ dàng
                </Paragraph>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="p-4 text-center">
                <Avatar
                  size={48}
                  icon={<User className="h-6 w-6" />}
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
                  style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}
                />
                <Title level={4}>Hỗ trợ 24/7</Title>
                <Paragraph type="secondary">
                  Đội ngũ tư vấn chuyên nghiệp
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <Title level={2} className="mb-3 text-white md:text-3xl">
            Bạn đang có bất động sản cần bán/cho thuê?
          </Title>
          <Paragraph className="mb-6 text-lg text-red-100">
            Đăng tin miễn phí - Tiếp cận hàng triệu khách hàng tiềm năng
          </Paragraph>
          <Space size="middle">
            <Button
              type="primary"
              size="large"
              className="rounded bg-white px-6 py-3 font-medium text-red-500 transition-colors hover:bg-gray-100"
            >
              Đăng tin miễn phí
            </Button>
            <Button
              type="default"
              size="large"
              className="rounded border-2 border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-red-500"
            >
              Tư vấn miễn phí
            </Button>
          </Space>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
