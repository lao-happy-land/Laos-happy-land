"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useRequest } from "ahooks";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Space,
  Divider,
  Descriptions,
  Image,
  Carousel,
  Empty,
  App,
  Tooltip,
} from "antd";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  Heart,
  Share2,
  ArrowLeft,
  Calendar,
  Star,
  Clock,
  Shield,
  Building,
  Car,
  Wifi,
  Snowflake,
  Tv,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import propertyService from "@/share/service/property.service";
import { numberToString } from "@/share/helper/number-to-string";
import type { CarouselRef } from "antd/es/carousel";
import LoadingScreen from "@/components/common/loading-screen";

const { Title, Text, Paragraph } = Typography;

export default function PropertyDetailsPage() {
  const { message } = App.useApp();
  const params = useParams();
  const propertyId = params.id as string;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const carouselRef = useRef<CarouselRef>(null);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
  };

  const {
    data: property,
    loading,
    error,
  } = useRequest(
    async () => {
      if (!propertyId) return null;
      return await propertyService.getPropertyById(propertyId);
    },
    {
      refreshDeps: [propertyId],
      onError: (error) => {
        console.error("Error fetching property:", error);
        message.error("Không thể tải thông tin bất động sản");
      },
    },
  );

  const handleContactOwner = () => {
    if (property?.owner?.phone) {
      window.open(`tel:${property.owner.phone}`, "_self");
    }
  };

  const handleEmailOwner = () => {
    if (property?.owner?.email) {
      window.open(`mailto:${property.owner.email}`, "_self");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      void navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      void navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép link vào clipboard!");
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(
      isFavorite ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        variant="primary"
        message="Đang tải thông tin bất động sản..."
        size="lg"
        showProgress
        duration={2}
      />
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Empty
          description="Không tìm thấy thông tin bất động sản"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link href="/properties">
            <Button type="primary" icon={<ArrowLeft />} size="large">
              Quay lại danh sách
            </Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const allImages = [property.mainImage, ...(property.images ?? [])].filter(
    (img): img is string => Boolean(img),
  );

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "rent":
        return "blue";
      case "sale":
        return "green";
      case "project":
        return "orange";
      default:
        return "default";
    }
  };

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "rent":
        return "Cho thuê";
      case "sale":
        return "Bán";
      case "project":
        return "Dự án";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl px-4 py-6 pt-20 lg:py-8">
        {/* Main Content */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              className="mb-6 overflow-hidden shadow-lg lg:mb-8"
              styles={{ body: { padding: 0 } }}
            >
              <div className="relative">
                <Carousel
                  ref={carouselRef}
                  autoplay
                  dots={{
                    className: "custom-dots",
                  }}
                  className="property-gallery"
                  beforeChange={(_from, to) => setCurrentImageIndex(to)}
                >
                  {allImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="h-64 w-full object-cover sm:h-80 md:h-96 lg:h-[500px]"
                        preview={{
                          mask: "Xem ảnh",
                          maskClassName: "rounded-lg",
                        }}
                      />
                    </div>
                  ))}
                </Carousel>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <Tooltip title="Thêm vào yêu thích">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={
                        <Heart
                          size={16}
                          className={isFavorite ? "fill-current" : ""}
                        />
                      }
                      onClick={handleFavorite}
                      className={`shadow-lg transition-all duration-200 ${
                        isFavorite
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    />
                  </Tooltip>
                  <Tooltip title="Chia sẻ">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<Share2 size={16} />}
                      onClick={handleShare}
                      className="bg-white shadow-lg transition-all duration-200 hover:bg-gray-50"
                    />
                  </Tooltip>
                </div>
              </div>

              {/* Image Thumbnails */}
              {allImages.length > 1 && (
                <div className="border-t border-gray-100 bg-white p-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {allImages.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className={`rounded-lg object-cover ${
                          index === currentImageIndex
                            ? "border-2 border-blue-500"
                            : "border-2 border-gray-200 hover:border-blue-500"
                        }`}
                        preview={false}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Property Information */}
            <Card style={{ marginTop: 10 }}>
              <div className="mb-6">
                {/* Header Section */}
                <div className="mb-6">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <Title
                        level={1}
                        className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl"
                      >
                        {property.title}
                      </Title>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                          <MapPin size={16} className="text-blue-600" />
                          <Text className="text-sm font-medium text-blue-700">
                            {property.location}
                          </Text>
                        </div>
                        {property.status === "approved" && (
                          <Tag
                            color="green"
                            className="flex items-center gap-1 text-sm font-medium text-green-700"
                          >
                            <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                              <Shield size={14} />
                              Đã xác minh
                            </span>
                          </Tag>
                        )}
                        <Tag
                          color={getTransactionTypeColor(
                            property.transactionType,
                          )}
                          className="text-sm font-medium"
                        >
                          {getTransactionTypeText(property.transactionType)}
                        </Tag>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
                          {numberToString(Number(property.price))} LAK
                        </div>
                        <Text className="text-sm text-gray-600">
                          {property.transactionType === "rent"
                            ? "Giá thuê/tháng"
                            : "Giá bán"}
                        </Text>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>
                          Đăng{" "}
                          {new Date(property.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Features Grid */}
                <div className="mb-8">
                  <Title level={3} className="mb-4 text-xl font-semibold">
                    Thông tin cơ bản
                  </Title>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {property.details?.bedrooms && (
                      <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                          <Bed size={24} className="text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {property.details.bedrooms}
                        </div>
                        <Text className="text-xs text-gray-600">Phòng ngủ</Text>
                      </div>
                    )}
                    {property.details?.bathrooms && (
                      <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                          <Bath size={24} className="text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {property.details.bathrooms}
                        </div>
                        <Text className="text-xs text-gray-600">Phòng tắm</Text>
                      </div>
                    )}
                    {property.details?.area && (
                      <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200">
                          <Square size={24} className="text-green-600" />
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {property.details.area}m²
                        </div>
                        <Text className="text-xs text-gray-600">Diện tích</Text>
                      </div>
                    )}
                    <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
                      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200">
                        <Building size={24} className="text-orange-600" />
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {property.type?.name ?? "N/A"}
                      </div>
                      <Text className="text-xs text-gray-600">Loại BDS</Text>
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                <div className="mb-8">
                  <Title level={3} className="mb-4 text-xl font-semibold">
                    Tiện ích
                  </Title>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {[
                      { icon: Wifi, label: "WiFi", color: "blue" },
                      { icon: Tv, label: "TV", color: "purple" },
                      { icon: Snowflake, label: "Điều hòa", color: "cyan" },
                      { icon: Car, label: "Bãi đỗ xe", color: "orange" },
                      { icon: Utensils, label: "Nhà bếp", color: "pink" },
                      { icon: Shield, label: "An ninh", color: "green" },
                    ].map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100"
                      >
                        <amenity.icon
                          size={20}
                          className={`text-${amenity.color}-600`}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {amenity.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Divider />

              {/* Description */}
              <div className="mb-8">
                <Title level={3} className="mb-4 text-xl font-semibold">
                  Mô tả chi tiết
                </Title>
                <div className="rounded-lg bg-gray-50 p-6">
                  <Paragraph className="mb-0 leading-relaxed text-gray-700">
                    {property.description || "Chưa có mô tả chi tiết."}
                  </Paragraph>
                </div>
              </div>

              <Divider />

              {/* Property Details */}
              <div>
                <Title level={3} className="mb-4 text-xl font-semibold">
                  Thông tin chi tiết
                </Title>
                <Descriptions
                  column={{ xs: 1, sm: 2 }}
                  bordered
                  size="small"
                  className="overflow-hidden rounded-lg"
                >
                  <Descriptions.Item label="Loại bất động sản">
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-blue-600" />
                      {property.type?.name}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng pháp lý">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className="text-green-600" />
                      {property.legalStatus}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày đăng">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      {new Date(property.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-600" />
                      {new Date(property.updatedAt).toLocaleDateString("vi-VN")}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
          </Col>

          {/* Right Column - Contact and Owner Info */}
          <Col xs={24} lg={8} style={{ padding: 0 }}>
            {/* Contact Card */}
            <Card>
              <Title level={4} className="mb-6 text-xl font-semibold">
                Liên hệ chủ sở hữu
              </Title>

              {property.owner && (
                <div className="mb-6">
                  <div className="mb-6 flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                      <Text className="text-xl font-bold text-white">
                        {property.owner.fullName?.charAt(0) || "U"}
                      </Text>
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-bold text-gray-900">
                        {property.owner.fullName}
                      </div>
                      <Text className="text-sm text-gray-600">
                        Chủ sở hữu bất động sản
                      </Text>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                        <span>4.8 (120 đánh giá)</span>
                      </div>
                    </div>
                  </div>

                  <Space direction="vertical" className="w-full" size="middle">
                    {property.owner.phone && (
                      <Button
                        type="primary"
                        icon={<Phone size={16} />}
                        onClick={handleContactOwner}
                        className="h-12 w-full text-base font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                        size="large"
                      >
                        Gọi điện: {property.owner.phone}
                      </Button>
                    )}

                    {property.owner.email && (
                      <Button
                        icon={<Mail size={16} />}
                        onClick={handleEmailOwner}
                        className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                        size="large"
                      >
                        Gửi email
                      </Button>
                    )}
                  </Space>
                </div>
              )}

              <Divider />

              {/* Quick Actions */}
              <div>
                <Title level={5} className="mb-4 text-lg font-semibold">
                  Hành động nhanh
                </Title>
                <Space direction="vertical" className="w-full" size="middle">
                  <Button
                    type="primary"
                    ghost
                    icon={
                      <Heart
                        size={16}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    }
                    onClick={handleFavorite}
                    className={`h-12 w-full text-base font-medium transition-all duration-200 ${
                      isFavorite
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : ""
                    }`}
                  >
                    {isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
                  </Button>
                  <Button
                    icon={<Share2 size={16} />}
                    onClick={handleShare}
                    className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    Chia sẻ
                  </Button>
                </Space>
              </div>
            </Card>

            {/* Similar Properties */}
            <Card style={{ marginTop: 10 }}>
              <Title level={4} className="mb-4 text-xl font-semibold">
                Bất động sản tương tự
              </Title>
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Building size={24} className="text-blue-600" />
                </div>
                <Text className="text-gray-600">
                  Tính năng đang được phát triển
                </Text>
                <Text className="text-sm text-gray-500">Sẽ có sớm!</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
