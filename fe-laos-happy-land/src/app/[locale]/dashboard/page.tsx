"use client";

import { useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useAuthStore } from "@/share/store/auth.store";
import { Button, Tag, Breadcrumb } from "antd";
import {
  Plus,
  Building2,
  FileText,
  Eye,
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye as EyeIcon,
} from "lucide-react";
import type { Property } from "@/@types/types";
import propertyService from "@/share/service/property.service";
import { newsService } from "@/share/service/news.service";
import Image from "next/image";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  Typography,
  Tooltip,
  Dropdown,
  Empty,
  Spin,
} from "antd";

const { Title, Text } = Typography;

interface DashboardStats {
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  totalNews: number;
  propertiesThisMonth: number;
  viewsThisMonth: number;
  revenue: number;
  revenueGrowth: number;
  viewsGrowth: number;
  propertiesGrowth: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const locale = useUrlLocale();

  const [properties, setProperties] = useState<Property[]>([]);
  const [news, setNews] = useState<
    Array<{
      id: string;
      title: string;
      imageURL?: string;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/dashboard`);
    }
  }, [isAuthenticated, router, locale]);

  // Fetch dashboard data
  const { data: propertiesData, loading: propertiesLoading } = useRequest(
    async () => {
      if (!isAuthenticated) return null;
      return propertyService.getProperties({ page: 1, perPage: 10 });
    },
    {
      refreshDeps: [isAuthenticated],
      onSuccess: (data) => {
        if (data?.data) {
          setProperties(data.data);
        }
      },
    },
  );

  const { data: newsData, loading: newsLoading } = useRequest(
    async () => {
      if (!isAuthenticated) return null;
      return newsService.getAllNews({ page: 1, perPage: 5 });
    },
    {
      refreshDeps: [isAuthenticated],
      onSuccess: (data) => {
        if (data?.data) {
          setNews(data.data);
        }
      },
    },
  );

  // Calculate dashboard stats
  const stats: DashboardStats = useMemo(() => {
    const totalProperties = propertiesData?.data?.length ?? 0;
    const totalViews = properties.reduce(
      (sum, prop) => sum + (prop.viewsCount || 0),
      0,
    );
    const totalFavorites = properties.reduce((_sum, _prop) => 0, 0); // Assuming no favorites field
    const totalNews = newsData?.data?.length ?? 0;

    const propertiesThisMonth = properties.filter((prop) => {
      const propDate = new Date(prop.createdAt);
      const now = new Date();
      return (
        propDate.getMonth() === now.getMonth() &&
        propDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const viewsThisMonth = Math.floor(totalViews * 0.3); // Mock calculation
    const revenue = totalProperties * 1000000; // Mock revenue calculation
    const revenueGrowth = 12.5;
    const viewsGrowth = 8.2;
    const propertiesGrowth = 15.3;

    return {
      totalProperties,
      totalViews,
      totalFavorites,
      totalNews,
      propertiesThisMonth,
      viewsThisMonth,
      revenue,
      revenueGrowth,
      viewsGrowth,
      propertiesGrowth,
    };
  }, [propertiesData, properties, newsData]);

  useEffect(() => {
    if (propertiesLoading || newsLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [propertiesLoading, newsLoading]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const formatPrice = (price: unknown) => {
    if (!price) return "Liên hệ";
    if (typeof price === "object" && price && "LAK" in price) {
      const lakPrice = (price as { LAK: number }).LAK;
      return `${(lakPrice / 1000000).toFixed(1)}M LAK`;
    }
    return "Liên hệ";
  };

  const getImageURL = (property: Property) => {
    if (property.mainImage) {
      return property.mainImage;
    }
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return "/images/placeholder-property.jpg";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "pending":
        return "Chờ duyệt";
      case "rejected":
        return "Từ chối";
      default:
        return status;
    }
  };

  const propertyColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "mainImage",
      key: "image",
      width: 80,
      render: (_: unknown, record: Property) => (
        <div className="relative h-12 w-16 overflow-hidden rounded">
          <Image
            src={getImageURL(record) ?? "/images/placeholder-property.jpg"}
            alt={record.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Property) => (
        <div className="max-w-48">
          <div className="truncate font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {record.location?.address}
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: unknown) => (
        <div className="font-semibold text-green-600">{formatPrice(price)}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "viewsCount",
      key: "views",
      render: (views: number) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-500" />
          <span>{views || 0}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: Property) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<EyeIcon className="h-4 w-4" />}
              onClick={() => router.push(`/${locale}/property/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<Edit className="h-4 w-4" />}
              onClick={() =>
                router.push(`/${locale}/edit-property/${record.id}`)
              }
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: "delete",
                  label: "Xóa",
                  icon: <Trash2 className="h-4 w-4" />,
                  danger: true,
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreHorizontal className="h-4 w-4" />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb
            items={[{ title: "Trang chủ" }, { title: "Dashboard" }]}
            className="mb-4"
          />
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} className="mb-2">
                Dashboard
              </Title>
              <Text className="text-gray-600">
                Chào mừng trở lại, {user?.fullName ?? "User"}!
              </Text>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={() => router.push(`/${locale}/create-property`)}
              >
                Đăng tin mới
              </Button>
            </Space>
          </div>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng bất động sản"
                value={stats.totalProperties}
                prefix={<Building2 className="h-4 w-4 text-blue-500" />}
                suffix={
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">+{stats.propertiesGrowth}%</span>
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng lượt xem"
                value={stats.totalViews}
                prefix={<Eye className="h-4 w-4 text-green-500" />}
                suffix={
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">+{stats.viewsGrowth}%</span>
                  </div>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tin tức"
                value={stats.totalNews}
                prefix={<FileText className="h-4 w-4 text-purple-500" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu (LAK)"
                value={stats.revenue}
                prefix={<DollarSign className="h-4 w-4 text-orange-500" />}
                suffix={
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-3 w-3" />
                    <span className="text-xs">+{stats.revenueGrowth}%</span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Charts and Tables */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Bất động sản gần đây" className="mb-6">
              <Table
                columns={propertyColumns}
                dataSource={properties}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 800 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Tin tức gần đây" className="mb-6">
              <div className="space-y-4">
                {news.length > 0 ? (
                  news.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded">
                        <Image
                          src={item.imageURL ?? "/images/placeholder-news.jpg"}
                          alt={item.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="line-clamp-2 text-sm font-medium">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty description="Chưa có tin tức" />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
