"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRequest } from "ahooks";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  message,
  Modal,
  Card,
  Typography,
  Row,
  Col,
  Empty,
  Tooltip,
} from "antd";
import {
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";
import propertyService from "@/share/service/property.service";
import type { Property, User } from "@/@types/types";
import { numberToString } from "@/share/helper/number-to-string";

const { Title, Text } = Typography;

const AdminProperties = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);

  // Fetch properties
  const { loading, run: fetchProperties } = useRequest(
    async () => {
      const params: {
        keyword?: string;
        type?: string;
        minPrice?: number;
        maxPrice?: number;
        minArea?: number;
        maxArea?: number;
        bedrooms?: number;
        bathrooms?: number;
        location?: string;
        transaction?: "rent" | "sale";
        isVerified?: boolean;
      } = {};
      if (searchTerm.trim()) {
        params.keyword = searchTerm;
      }
      return await propertyService.getProperties(params);
    },
    {
      onSuccess: (data) => {
        setProperties(data.data || []);
      },
      onError: (error) => {
        console.error("Failed to fetch properties:", error);
        message.error("Không thể tải danh sách tin đăng");
      },
    },
  );

  // Delete property
  const { loading: deleting, run: deleteProperty } = useRequest(
    async (id: string) => {
      await propertyService.deleteProperty(id);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Xóa tin đăng thành công!");
        fetchProperties();
      },
      onError: (error) => {
        console.error("Failed to delete property:", error);
        message.error("Không thể xóa tin đăng");
      },
    },
  );

  const memoizedFetchProperties = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    memoizedFetchProperties();
  }, [searchTerm, memoizedFetchProperties]);

  const handleDelete = (property: Property) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <AlertTriangle className="text-red-500" />,
      content: `Bạn có chắc chắn muốn xóa tin đăng "${property.title}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteProperty(property.id);
      },
    });
  };

  const filteredProperties = properties.filter((property) => {
    const propertyStatus = property.isVerified ? "approved" : "pending";
    const matchesFilter = filter === "all" || propertyStatus === filter;
    const ownerName =
      typeof property.owner === "string"
        ? property.owner
        : (property.owner?.fullName ?? "");
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (status: string) => {
    if (status === "all") return properties.length;
    return properties.filter((p) => {
      const propertyStatus = p.isVerified ? "approved" : "pending";
      return propertyStatus === status;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={2} className="mb-2 text-gray-900">
              Quản lý tin đăng
            </Title>
            <Text className="text-lg text-gray-600">
              Quản lý tất cả tin đăng bất động sản trên hệ thống
            </Text>
          </Col>
          <Col>
            <Link href="/admin/properties/create">
              <Button
                type="primary"
                size="large"
                icon={<Plus className="h-4 w-4" />}
                className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
              >
                Thêm tin đăng
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space size="small" wrap>
              {[
                { key: "all", label: "Tất cả", count: getFilterCount("all") },
                {
                  key: "pending",
                  label: "Chờ duyệt",
                  count: getFilterCount("pending"),
                },
                {
                  key: "approved",
                  label: "Đã duyệt",
                  count: getFilterCount("approved"),
                },
                {
                  key: "rejected",
                  label: "Từ chối",
                  count: getFilterCount("rejected"),
                },
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  type={filter === filterOption.key ? "primary" : "default"}
                  onClick={() => setFilter(filterOption.key)}
                  className={
                    filter === filterOption.key
                      ? "border-blue-600 bg-blue-600"
                      : ""
                  }
                >
                  {filterOption.label} ({filterOption.count})
                </Button>
              ))}
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm tin đăng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              size="large"
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          dataSource={filteredProperties}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredProperties.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} tin đăng`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                description="Không có tin đăng nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          columns={[
            {
              title: "Tin đăng",
              dataIndex: "title",
              key: "title",
              fixed: "left",
              width: 400,
              render: (title: string, property: Property) => (
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium text-gray-900">
                      {title}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      📍 {property.location ?? "Chưa có địa chỉ"}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: "Người đăng",
              dataIndex: "owner",
              key: "owner",
              width: 120,
              render: (owner: User | string) => (
                <Tag color="blue">
                  {typeof owner === "string"
                    ? owner
                    : (owner?.fullName ?? "Không xác định")}
                </Tag>
              ),
            },
            {
              title: "Loại",
              dataIndex: "type",
              key: "type",
              width: 120,
              render: (
                type: { id: string; name: string } | null | undefined,
              ) => <Tag color="blue">{type?.name ?? "Không xác định"}</Tag>,
            },
            {
              title: "Giá",
              dataIndex: "price",
              key: "price",
              width: 150,
              render: (price: string) =>
                price ? `${numberToString(Number(price))} LAK` : "Thỏa thuận",
            },
            {
              title: "Trạng thái",
              dataIndex: "isVerified",
              key: "status",
              width: 120,
              render: (isVerified: boolean) => (
                <Tag color={isVerified ? "green" : "orange"}>
                  {isVerified ? "Đã duyệt" : "Chờ duyệt"}
                </Tag>
              ),
            },
            {
              title: "Lượt xem",
              dataIndex: "viewsCount",
              key: "viewsCount",
              width: 200,
              render: (count: number) => count || 0,
            },
            {
              title: "Ngày đăng",
              dataIndex: "createdAt",
              key: "createdAt",
              width: 120,
              render: (date: string) => {
                try {
                  return new Date(date).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  });
                } catch {
                  return "Invalid date";
                }
              },
            },
            {
              title: "Thao tác",
              key: "actions",
              width: 200,
              render: (_: unknown, property: Property) => (
                <Space size="small">
                  <Tooltip title="Xem/Sửa tin đăng">
                    <Link href={`/admin/properties/${property.id}`}>
                      <button
                        type="button"
                        className="rounded-md bg-blue-50 p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                  </Tooltip>
                  {!property.isVerified && (
                    <Tooltip title="Duyệt tin đăng">
                      <button
                        type="button"
                        className="rounded-md bg-blue-50 p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip title="Xóa tin đăng">
                    <button
                      type="button"
                      className="rounded-md bg-red-50 p-2 text-red-500 hover:bg-red-100 hover:text-red-700"
                      onClick={() => handleDelete(property)}
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AdminProperties;
