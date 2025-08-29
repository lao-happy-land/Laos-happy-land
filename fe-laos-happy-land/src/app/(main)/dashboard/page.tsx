"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import { Card, Button, Row, Col, Statistic, List, Avatar, Tag } from "antd";
import {
  Plus,
  Building2,
  Eye,
  Heart,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, router]);

  const mockProperties = [
    {
      id: 1,
      title: "Căn hộ cao cấp Quận 1",
      price: "2.5 tỷ",
      status: "active",
      views: 156,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Nhà riêng Quận 7",
      price: "4.2 tỷ",
      status: "pending",
      views: 89,
      createdAt: "2024-01-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Chào mừng trở lại, {user?.fullName ?? user?.email}!
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/create-property")}
            >
              Đăng tin mới
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Tổng tin đăng"
                value={12}
                prefix={<Building2 className="h-4 w-4" />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Lượt xem"
                value={2847}
                prefix={<Eye className="h-4 w-4" />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Lượt thích"
                value={156}
                prefix={<Heart className="h-4 w-4" />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Doanh thu"
                value={12500000}
                prefix={<DollarSign className="h-4 w-4" />}
                valueStyle={{ color: "#722ed1" }}
                formatter={(value) =>
                  `${(Number(value) / 1000000).toFixed(1)}M`
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Properties */}
        <Card
          title={
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Tin đăng gần đây
            </div>
          }
          extra={
            <Button type="link" onClick={() => router.push("/create-property")}>
              Xem tất cả
            </Button>
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={mockProperties}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="edit" type="link" size="small">
                    Chỉnh sửa
                  </Button>,
                  <Button key="delete" type="link" danger size="small">
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar icon={<Building2 />} className="bg-blue-500" />
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <span>{item.title}</span>
                      <Tag
                        color={item.status === "active" ? "green" : "orange"}
                      >
                        {item.status === "active"
                          ? "Đang hiển thị"
                          : "Chờ duyệt"}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-red-600">
                        {item.price}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.views} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Quick Actions */}
        <Row gutter={[16, 16]} className="mt-8">
          <Col xs={24} md={12}>
            <Card title="Thao tác nhanh" className="h-full">
              <div className="space-y-3">
                <Button
                  type="primary"
                  block
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => router.push("/create-property")}
                >
                  Đăng tin mới
                </Button>
                <Button
                  block
                  icon={<Building2 className="h-4 w-4" />}
                  onClick={() => router.push("/properties-for-sale")}
                >
                  Xem tin đăng
                </Button>
                <Button
                  block
                  icon={<User className="h-4 w-4" />}
                  onClick={() => router.push("/profile")}
                >
                  Cập nhật thông tin
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Thống kê" className="h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tin đang hiển thị</span>
                  <Tag color="green">8</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tin chờ duyệt</span>
                  <Tag color="orange">3</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tin đã từ chối</span>
                  <Tag color="red">1</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tổng lượt xem tháng này</span>
                  <Tag color="blue">1,247</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
