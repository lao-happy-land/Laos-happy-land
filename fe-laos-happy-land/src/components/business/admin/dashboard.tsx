"use client";

import { useRequest } from "ahooks";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUrlLocale } from "@/utils/locale";
import { Spin, Card, Row, Col, Table, Button, Space, Tag, App } from "antd";
import {
  Building2,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
} from "lucide-react";
import dashboardService, {
  type RecentActivity,
} from "@/share/service/dashboard.service";
import propertyService from "@/share/service/property.service";
import type { Property } from "@/@types/types";
import Image from "next/image";
import { numberToString } from "@/share/helper/number-to-string";
import { useCurrencyStore } from "@/share/store/currency.store";
import { formatLocation } from "@/share/helper/format-location";

const AdminDashboard = () => {
  const t = useTranslations();
  const locale = useUrlLocale();
  const { message, modal } = App.useApp();
  const { currency } = useCurrencyStore();

  const { data: dashboardData, loading } = useRequest(async () => {
    return await dashboardService.getDashboard();
  });

  const {
    data: pendingPropertiesData,
    loading: loadingPendingProperties,
    run: refetchPendingProperties,
  } = useRequest(
    async () => {
      return await propertyService.getProperties({
        status: "pending",
        page: 1,
        perPage: 10,
      });
    },
    {
      refreshDeps: [currency],
    },
  );

  const handleApproveProperty = (property: Property) => {
    modal.confirm({
      title: t("admin.approveProperty"),
      content: `${t("admin.confirmApproveProperty")} "${property.title}"?`,
      okText: t("admin.approve"),
      cancelText: t("admin.cancel"),
      onOk: async () => {
        try {
          await propertyService.approveProperty(property.id);
          message.success(t("admin.propertyApprovedSuccessfully"));
          refetchPendingProperties();
        } catch (error) {
          console.error("Error approving property:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const handleRejectProperty = (property: Property) => {
    modal.confirm({
      title: t("admin.rejectProperty"),
      content: `${t("admin.confirmRejectProperty")} "${property.title}"?`,
      okText: t("admin.reject"),
      okType: "danger",
      cancelText: t("admin.cancel"),
      onOk: async () => {
        try {
          await propertyService.rejectProperty(property.id, {
            reason: "Rejected by admin",
          });
          message.success(t("admin.propertyRejectedSuccessfully"));
          refetchPendingProperties();
        } catch (error) {
          console.error("Error rejecting property:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const getImageURL = (property: Property): string => {
    if (property.mainImage && typeof property.mainImage === "string") {
      return property.mainImage;
    }
    if (
      property.images &&
      property.images.length > 0 &&
      typeof property.images[0] === "string"
    ) {
      return property.images[0];
    }
    if (property.transactionType === "project") {
      return "/images/landingpage/project/project-1.jpg";
    }
    return "/images/landingpage/apartment/apart-1.jpg";
  };

  const getActivityIcon = (type: string) => {
    if (type === "property")
      return <Building2 className="h-5 w-5 text-blue-600" />;
    if (type === "user") return <Users className="h-5 w-5 text-green-600" />;
    if (type === "news")
      return <FileText className="h-5 w-5 text-purple-600" />;
    return <Eye className="h-5 w-5 text-gray-600" />;
  };

  const getActivityColor = (type: string) => {
    if (type === "property") return "from-blue-100 to-blue-200";
    if (type === "user") return "from-green-100 to-green-200";
    if (type === "news") return "from-purple-100 to-purple-200";
    return "from-gray-100 to-gray-200";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} ${t("admin.secondsAgo")}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${t("admin.minutesAgo")}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${t("admin.hoursAgo")}`;
    const days = Math.floor(hours / 24);
    return `${days} ${t("admin.daysAgo")}`;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const stats = dashboardData ?? {
    totalProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    approvedPropertiesThisMonth: 0,
    propertyGrowthRate: 0,
    userGrowthRate: 0,
    recentActivities: [],
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {t("admin.welcomeBack")}
        </h1>
        <p className="text-lg text-gray-600">{t("admin.systemOverview")}</p>
      </div>

      {/* Recent Activities - 2 Cards */}
      <Row gutter={[16, 16]}>
        {/* Recent Activity Card 1 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold">
                  {t("admin.recentActivity")}
                </span>
              </div>
            }
            className="h-full"
          >
            <div className="space-y-3">
              {stats.recentActivities.length > 0 ? (
                stats.recentActivities
                  .slice(0, 3)
                  .map((activity: RecentActivity, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getActivityColor(activity.type)}`}
                      >
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatTimeAgo(activity.createdAt)}</span>
                          <span>•</span>
                          <span>{activity.createdBy}</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  {t("admin.noRecentActivity")}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Recent Activity Card 2 */}
        <Col xs={24} md={12}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold">
                  {t("admin.systemStats")}
                </span>
              </div>
            }
            className="h-full"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">
                      {t("admin.totalProperties")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalProperties}
                    </p>
                  </div>
                </div>
                {stats.propertyGrowthRate !== 0 && (
                  <div
                    className={`flex items-center gap-1 ${stats.propertyGrowthRate > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.propertyGrowthRate > 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {stats.propertyGrowthRate > 0 ? "+" : ""}
                      {stats.propertyGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{t("admin.users")}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
                {stats.userGrowthRate !== 0 && (
                  <div
                    className={`flex items-center gap-1 ${stats.userGrowthRate > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {stats.userGrowthRate > 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {stats.userGrowthRate > 0 ? "+" : ""}
                      {stats.userGrowthRate.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">
                      {t("admin.approvedThisMonth")}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.approvedPropertiesThisMonth}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Pending Properties Table */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <span className="text-lg font-semibold">
              {t("admin.pendingApproval")}
            </span>
            <Tag color="yellow">{stats.pendingProperties}</Tag>
          </div>
        }
        extra={
          <Link
            href={`/${locale}/admin/properties`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t("admin.viewAll")} →
          </Link>
        }
      >
        <Table
          columns={[
            {
              title: t("property.image"),
              dataIndex: "mainImage",
              key: "image",
              width: 80,
              render: (_: unknown, record: Property) => (
                <div className="relative h-12 w-16 overflow-hidden rounded">
                  <Image
                    src={getImageURL(record)}
                    alt={record.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ),
            },
            {
              title: t("property.title"),
              dataIndex: "title",
              key: "title",
              render: (text: string, record: Property) => (
                <div className="max-w-xs">
                  <div className="truncate font-medium">{text}</div>
                  <div className="text-xs text-gray-500">
                    {formatLocation(record, t("admin.noAddress"))}
                  </div>
                </div>
              ),
            },
            {
              title: t("admin.type"),
              dataIndex: "type",
              key: "type",
              render: (type: { name: string } | null) => (
                <Tag color="blue">{type?.name ?? t("admin.unknown")}</Tag>
              ),
            },
            {
              title: t("property.price"),
              dataIndex: "price",
              key: "price",
              render: (price: unknown) => (
                <div className="font-semibold text-green-600">
                  {numberToString(price as number, locale, currency)}
                </div>
              ),
            },
            {
              title: t("admin.owner"),
              dataIndex: "owner",
              key: "owner",
              render: (owner: Property["owner"]) => (
                <div>
                  <div className="text-sm font-medium">
                    {owner?.fullName ?? t("admin.unknown")}
                  </div>
                  <div className="text-xs text-gray-500">{owner?.email}</div>
                </div>
              ),
            },
            {
              title: t("property.createdAt"),
              dataIndex: "createdAt",
              key: "createdAt",
              width: 120,
              render: (date: string) => (
                <div className="text-sm text-gray-600">
                  {new Date(date).toLocaleDateString()}
                </div>
              ),
            },
            {
              title: t("admin.actions"),
              key: "actions",
              width: 200,
              render: (_: unknown, record: Property) => (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    onClick={() =>
                      window.open(`/${locale}/property/${record.id}`, "_blank")
                    }
                  >
                    {t("admin.view")}
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleApproveProperty(record)}
                    icon={<CheckCircle className="h-3 w-3" />}
                  >
                    {t("admin.approve")}
                  </Button>
                  <Button
                    danger
                    size="small"
                    onClick={() => handleRejectProperty(record)}
                    icon={<XCircle className="h-3 w-3" />}
                  >
                    {t("admin.reject")}
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={pendingPropertiesData?.data ?? []}
          rowKey="id"
          loading={loadingPendingProperties}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => `${total} ${t("admin.properties")}`,
          }}
          size="small"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
