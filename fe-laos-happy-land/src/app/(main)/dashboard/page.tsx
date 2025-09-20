"use client";

import { useEffect, useMemo, useState } from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import { Button, Tag, Breadcrumb } from "antd";
import {
  Plus,
  Building2,
  Eye,
  Calendar,
  User,
  TrendingUp,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Activity,
} from "lucide-react";
import propertyService from "@/share/service/property.service";
import type { Property } from "@/@types/types";
import { numberToString } from "@/share/helper/number-to-string";
import { formatCreatedDate } from "@/share/helper/format-date";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
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
        perPage: 6,
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
        refreshProperties();
      },
      onError: (error) => {
        console.error("Error deleting property:", error);
      },
      onFinally: () => {
        setDeletingId(null);
      },
    },
  );

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá tin đăng này?")) {
      setDeletingId(id);
      runDelete(id);
    }
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
    const totalValue = properties.reduce(
      (sum, p) => sum + Number(p.price) || 0,
      0,
    );
    return { total, approved, pending, rejected, totalViews, totalValue };
  }, [properties]);

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Trang chủ
        </Link>
      ),
    },
    {
      title: "Dashboard",
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-neutral-900">
                Dashboard
              </h1>
              <p className="text-lg text-neutral-600">
                Chào mừng trở lại,{" "}
                {user?.fullName && user.fullName !== "User"
                  ? user.fullName
                  : user?.email}
                !
              </p>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<Plus size={16} />}
              onClick={() => router.push("/create-property")}
              className="font-semibold"
            >
              Đăng tin mới
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Tổng tin đăng
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-primary-100 rounded-lg p-3">
                <Building2 size={24} className="text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp size={16} className="text-accent-500 mr-1" />
              <span className="text-accent-600 font-medium">+12%</span>
              <span className="ml-1 text-neutral-500">so với tháng trước</span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Lượt xem</p>
                <p className="text-3xl font-bold text-neutral-900">
                  {stats.totalViews}
                </p>
              </div>
              <div className="bg-accent-100 rounded-lg p-3">
                <Eye size={24} className="text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity size={16} className="text-accent-500 mr-1" />
              <span className="text-accent-600 font-medium">+8%</span>
              <span className="ml-1 text-neutral-500">tuần này</span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Tin đang hiển thị
                </p>
                <p className="text-accent-600 text-3xl font-bold">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-accent-100 rounded-lg p-3">
                <CheckCircle size={24} className="text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-neutral-500">Tỷ lệ duyệt: </span>
              <span className="text-accent-600 ml-1 font-medium">
                {stats.total > 0
                  ? Math.round((stats.approved / stats.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">
                  Tổng giá trị
                </p>
                <p className="text-2xl font-bold text-neutral-900">
                  {numberToString(stats.totalValue)}
                </p>
              </div>
              <div className="bg-primary-100 rounded-lg p-3">
                <DollarSign size={24} className="text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <BarChart3 size={16} className="text-primary-500 mr-1" />
              <span className="text-primary-600 font-medium">Tổng tài sản</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Properties */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 rounded-lg p-2">
                    <Building2 size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      Tin đăng gần đây
                    </h2>
                    <p className="text-sm text-neutral-500">
                      {properties.length} tin đăng • Cập nhật mới nhất
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="small"
                    onClick={() => refreshProperties()}
                    className="hover:text-primary-600 text-neutral-600"
                  >
                    Làm mới
                  </Button>
                  <Link href="/properties-for-sale">
                    <Button
                      type="primary"
                      size="small"
                      icon={<ArrowRight size={14} />}
                    >
                      Xem tất cả
                    </Button>
                  </Link>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="border-primary-500 mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-neutral-600">Đang tải...</p>
                  </div>
                </div>
              ) : properties.length === 0 ? (
                <div className="py-12 text-center">
                  <Building2
                    size={48}
                    className="mx-auto mb-4 text-neutral-400"
                  />
                  <h3 className="mb-2 text-lg font-medium text-neutral-900">
                    Chưa có tin đăng nào
                  </h3>
                  <p className="mb-4 text-neutral-600">
                    Hãy bắt đầu bằng cách đăng tin bất động sản đầu tiên của bạn
                  </p>
                  <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => router.push("/create-property")}
                    className="font-semibold"
                  >
                    Đăng tin mới
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {properties.map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Property Image */}
                      <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-neutral-100">
                        {item.images && item.images.length > 0 ? (
                          <Image
                            src={item.images[0] ?? ""}
                            alt={item.title}
                            width={300}
                            height={192}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Building2 size={48} className="text-neutral-400" />
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          <Tag
                            color={
                              item.status === "approved"
                                ? "green"
                                : item.status === "pending"
                                  ? "orange"
                                  : "red"
                            }
                            className="text-xs font-medium"
                          >
                            {item.status === "approved"
                              ? "Đang hiển thị"
                              : item.status === "pending"
                                ? "Chờ duyệt"
                                : "Từ chối"}
                          </Tag>
                        </div>

                        {/* Views Count */}
                        <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            <span>{item.viewsCount || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="space-y-3">
                        <h3 className="group-hover:text-primary-600 line-clamp-2 text-lg font-semibold text-neutral-900 transition-colors">
                          {item.title}
                        </h3>

                        {item.location && (
                          <div className="flex items-center gap-2 text-sm text-neutral-500">
                            <MapPin size={14} />
                            <span className="line-clamp-1">
                              {typeof item.location === "string"
                                ? item.location
                                : (item.location?.address ?? "Chưa cập nhật")}
                            </span>
                          </div>
                        )}

                        <div className="text-primary-600 text-2xl font-bold">
                          {item.price
                            ? numberToString(Number(item.price))
                            : "Liên hệ"}
                        </div>

                        <div className="flex items-center justify-between text-sm text-neutral-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{formatCreatedDate(item.createdAt)}</span>
                          </div>
                          <div className="rounded-full bg-neutral-100 px-2 py-1 text-xs">
                            Bất động sản
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleEdit(item.id)}
                          className="flex-1 font-medium"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDelete(item.id)}
                          loading={deletingId === item.id}
                          className="font-medium"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                <Button
                  type="primary"
                  block
                  icon={<Plus size={16} />}
                  onClick={() => router.push("/create-property")}
                  className="font-semibold"
                >
                  Đăng tin mới
                </Button>
                <Button
                  block
                  icon={<Building2 size={16} />}
                  onClick={() => router.push("/properties-for-sale")}
                  className="font-semibold"
                >
                  Xem tin đăng
                </Button>
                <Button
                  block
                  icon={<User size={16} />}
                  onClick={() => router.push("/profile")}
                  className="font-semibold"
                >
                  Cập nhật thông tin
                </Button>
              </div>
            </div>

            {/* Status Overview */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Trạng thái tin đăng
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-accent-500" />
                    <span className="text-sm text-neutral-600">
                      Đang hiển thị
                    </span>
                  </div>
                  <Tag color="green">{stats.approved}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    <span className="text-sm text-neutral-600">Chờ duyệt</span>
                  </div>
                  <Tag color="orange">{stats.pending}</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-sm text-neutral-600">Từ chối</span>
                  </div>
                  <Tag color="red">{stats.rejected}</Tag>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Hiệu suất
              </h3>
              <div className="space-y-4">
                <div className="bg-accent-50 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <TrendingUp size={16} className="text-accent-600" />
                    <span className="text-accent-700 text-sm font-medium">
                      Tăng trưởng tháng này
                    </span>
                  </div>
                  <p className="text-accent-600 text-2xl font-bold">+12%</p>
                  <p className="text-accent-600 text-xs">So với tháng trước</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Eye size={16} className="text-primary-600" />
                    <span className="text-primary-700 text-sm font-medium">
                      Lượt xem trung bình
                    </span>
                  </div>
                  <p className="text-primary-600 text-2xl font-bold">
                    {stats.total > 0
                      ? Math.round(stats.totalViews / stats.total)
                      : 0}
                  </p>
                  <p className="text-primary-600 text-xs">Mỗi tin đăng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
