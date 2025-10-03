"use client";

import { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useAuthStore } from "@/share/store/auth.store";
import { Button, Tag, Breadcrumb, App } from "antd";
import { Plus, Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import type { Property } from "@/@types/types";
import propertyService from "@/share/service/property.service";
import Image from "next/image";
import { Card, Table, Space, Typography, Dropdown, Spin } from "antd";
import { useTranslations } from "next-intl";
import { numberToString } from "@/share/helper/number-to-string";
import { formatLocation } from "@/share/helper/format-location";
import {
  getCurrencyByLocale,
  type SupportedLocale,
} from "@/share/helper/locale.helper";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const { message, modal } = App.useApp();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const locale = useUrlLocale();
  const t = useTranslations();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/dashboard`);
    }
  }, [isAuthenticated, router, locale]);

  // Fetch dashboard data
  const { loading: propertiesLoading, run: refetchProperties } = useRequest(
    async () => {
      if (!isAuthenticated) return null;
      return propertyService.getPropertiesByUser({
        page: pagination.current,
        perPage: pagination.pageSize,
        currency: getCurrencyByLocale(locale as SupportedLocale),
      });
    },
    {
      refreshDeps: [isAuthenticated, pagination.current, pagination.pageSize],
      onSuccess: (data) => {
        if (data?.data) {
          setProperties(data.data);
          // Update total count from API response
          if (data.meta) {
            setPagination((prev) => ({
              ...prev,
              total: data.meta.itemCount || 0,
            }));
          }
        }
      },
    },
  );

  useEffect(() => {
    if (propertiesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [propertiesLoading]);

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

  const getImageURL = (property: Property): string => {
    // Check if mainImage exists first (works for all transaction types)
    if (property.mainImage && typeof property.mainImage === "string") {
      return property.mainImage;
    }

    // Check additional images
    if (
      property.images &&
      property.images.length > 0 &&
      typeof property.images[0] === "string"
    ) {
      return property.images[0];
    }

    // Fallback to default images based on transaction type
    if (property.transactionType === "project") {
      return "/images/landingpage/project/project-1.jpg";
    }

    return "/images/landingpage/apartment/apart-1.jpg";
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
        return t("common.approved");
      case "pending":
        return t("common.pending");
      case "rejected":
        return t("common.rejected");
      default:
        return status;
    }
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setPagination({
      current: page,
      pageSize,
      total: pagination.total,
    });
  };

  const handleDeleteProperty = (property: Property) => {
    modal.confirm({
      title: t("common.deleteConfirm"),
      content: `${t("common.deleteConfirmMessage")} "${property.title}"?`,
      okText: t("common.delete"),
      cancelText: t("common.cancel"),
      okType: "danger",
      onOk: async () => {
        try {
          await propertyService.deleteProperty(property.id);
          message.success(t("common.deleteSuccess"));
          // Refetch properties after successful deletion
          refetchProperties();
        } catch (error) {
          console.error("Error deleting property:", error);
          message.error(t("common.deleteFailed"));
        }
      },
    });
  };

  const propertyColumns = [
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
        <div className="max-w-48">
          <div className="truncate font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            {formatLocation(record, t("common.notUpdated"))}
          </div>
        </div>
      ),
    },
    {
      title: t("property.price"),
      dataIndex: "price",
      key: "price",
      render: (price: unknown) => (
        <div className="font-semibold text-green-600">
          {numberToString(
            price as number,
            locale as SupportedLocale,
            getCurrencyByLocale(locale as SupportedLocale),
          )}
        </div>
      ),
    },
    {
      title: t("property.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: t("property.views"),
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
      title: t("property.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: t("property.actions"),
      key: "actions",
      render: (_: unknown, record: Property) => (
        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  key: "edit",
                  label: t("common.edit"),
                  icon: <Edit className="h-4 w-4" />,
                  onClick: () =>
                    router.push(`/${locale}/edit-property/${record.id}`),
                },
                {
                  key: "view",
                  label: t("common.view"),
                  icon: <Eye className="h-4 w-4" />,
                  onClick: () =>
                    router.push(`/${locale}/property/${record.id}`),
                },
                {
                  key: "delete",
                  label: t("common.delete"),
                  icon: <Trash2 className="h-4 w-4" />,
                  danger: true,
                  onClick: () => handleDeleteProperty(record),
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
            items={[
              { title: t("navigation.home") },
              { title: t("navigation.dashboard") },
            ]}
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
                {t("navigation.postAd")}
              </Button>
            </Space>
          </div>
        </div>

        {/* Properties Table */}
        <Card title={t("property.latestProperties")} className="mb-6">
          <Table
            columns={propertyColumns}
            dataSource={properties}
            rowKey="id"
            loading={propertiesLoading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              position: ["bottomCenter"],
              onChange: handleTableChange,
              onShowSizeChange: handleTableChange,
            }}
            size="small"
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </div>
  );
}
