"use client";

import { useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import {
  Card,
  Button,
  Row,
  Col,
  Statistic,
  List,
  Avatar,
  Tag,
  App,
} from "antd";
import { Plus, Building2, Eye, Calendar, User } from "lucide-react";
import propertyService from "@/share/service/property.service";
import type { Property } from "@/@types/types";
import { numberToString } from "@/share/helper/number-to-string";
import { formatCreatedDate } from "@/share/helper/format-date";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const { modal, message } = App.useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, router]);

  const { run: loadProperties, refresh: refreshProperties } = useRequest(
    async () => {
      const res = await propertyService.getPropertiesByUser({
        page: 1,
        perPage: 5,
      });
      return res.data || [];
    },
    {
      manual: true,
      onBefore: () => setLoading(true),
      onSuccess: (data) => setProperties(data),
      onFinally: () => setLoading(false),
    },
  );

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleEdit = (id: string) => {
    router.push(`/edit-property/${id}`);
  };

  const { run: runDelete } = useRequest(
    async (id: string) => {
      await propertyService.deleteProperty(id);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Xoá tin đăng thành công!");
        refreshProperties();
      },
      onError: (error) => {
        console.error("Error deleting property:", error);
        message.error("Xoá tin đăng thất bại");
      },
      onFinally: () => {
        setDeletingId(null);
      },
    },
  );

  const handleDelete = (id: string) => {
    modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá tin đăng này?",
      okText: "Xoá",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: () => {
        setDeletingId(id);
        runDelete(id);
      },
    });
  };

  const stats = useMemo(() => {
    const total = properties.length;
    const approved = properties.filter((p) => p.status === "approved").length;
    const pending = properties.filter((p) => p.status === "pending").length;
    const rejected = properties.filter((p) => p.status === "rejected").length;
    const totalViews = properties.reduce(
      (sum, p) => sum + (Number(p.viewsCount) || 0),
      0,
    );
    return { total, approved, pending, rejected, totalViews };
  }, [properties]);

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
          <Col xs={24} sm={12} lg={12}>
            <Card>
              <Statistic
                title="Tổng tin đăng"
                value={stats.total}
                prefix={<Building2 className="h-4 w-4" />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={12}>
            <Card>
              <Statistic
                title="Lượt xem"
                value={stats.totalViews}
                prefix={<Eye className="h-4 w-4" />}
                valueStyle={{ color: "#1890ff" }}
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
        >
          <List
            itemLayout="horizontal"
            dataSource={properties}
            loading={loading}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    type="link"
                    size="small"
                    onClick={() => handleEdit(item.id)}
                  >
                    Chỉnh sửa
                  </Button>,
                  <Button
                    key="delete"
                    type="link"
                    danger
                    size="small"
                    loading={deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                  >
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
                        color={
                          item.status === "approved"
                            ? "green"
                            : item.status === "pending"
                              ? "orange"
                              : "red"
                        }
                      >
                        {item.status === "approved"
                          ? "Đang hiển thị"
                          : item.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-red-600">
                        {numberToString(Number(item.price))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {item.viewsCount} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatCreatedDate(item.createdAt)}
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
                  <Tag color="green">{stats.approved}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tin chờ duyệt</span>
                  <Tag color="orange">{stats.pending}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tin đã từ chối</span>
                  <Tag color="red">{stats.rejected}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tổng lượt xem tháng này</span>
                  <Tag color="blue">{stats.totalViews}</Tag>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
