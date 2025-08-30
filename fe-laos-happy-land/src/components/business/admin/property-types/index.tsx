"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  Button,
  Select,
  Card,
  Input as AntInput,
  Empty,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Tooltip,
  App,
} from "antd";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import propertyTypeService from "@/share/service/property-type.service";
import PropertyTypeModal from "./property-type-modal";
import type { PropertyType } from "@/@types/types";

const { Title, Text } = Typography;
const { Option } = Select;

export default function PropertyTypes() {
  const { message, modal } = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedPropertyType, setSelectedPropertyType] =
    useState<PropertyType | null>(null);
  const [openModal, setOpenModal] = useState<"create" | "update">("create");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const [filterTransaction, setFilterTransaction] = useState(
    searchParams.get("transaction") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sync URL params with component state
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlTransaction = searchParams.get("transaction") ?? "";
    const urlPage = parseInt(searchParams.get("page") ?? "1");
    const urlPageSize = parseInt(searchParams.get("pageSize") ?? "10");

    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setSearchInputValue(urlSearch);
    }
    if (urlTransaction !== filterTransaction)
      setFilterTransaction(urlTransaction);
    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlPageSize !== pageSize) setPageSize(urlPageSize);
  }, [searchParams, searchTerm, filterTransaction, currentPage, pageSize]);

  const {
    data: propertyTypesData = {
      data: [],
      meta: { itemCount: 0, pageCount: 0 },
    },
    loading: propertyTypesLoading,
    refresh: refreshPropertyTypes,
  } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        search: searchTerm || undefined,
        transaction: filterTransaction as
          | "rent"
          | "sale"
          | "project"
          | undefined,
        page: currentPage,
        perPage: pageSize,
      });
      return response as unknown as {
        data: PropertyType[];
        meta: {
          itemCount: number;
          pageCount: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
        };
      };
    },
    {
      refreshDeps: [searchTerm, filterTransaction, currentPage, pageSize],
      onSuccess: (data) => {
        setTotal(data.meta.itemCount);
      },
      onError: (error) => {
        console.error("Failed to fetch property types:", error);
        message.error("Không thể tải danh sách loại bất động sản");
      },
    },
  );

  const { loading: deleteLoading, run: deletePropertyType } = useRequest(
    async (id: string) => {
      await propertyTypeService.deletePropertyType(id);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Xóa loại bất động sản thành công!");
        refreshPropertyTypes();
      },
      onError: (error) => {
        console.error("Failed to delete property type:", error);
        message.error("Không thể xóa loại bất động sản");
      },
    },
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchInputValue) params.set("search", searchInputValue);
    if (filterTransaction) params.set("transaction", filterTransaction);
    params.set("page", "1");
    params.set("pageSize", pageSize.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSearchTerm("");
    setFilterTransaction("");
    setCurrentPage(1);
    router.push(pathname);
  };

  const handlePageChange = (page: number, size: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filterTransaction) params.set("transaction", filterTransaction);
    params.set("page", page.toString());
    params.set("pageSize", size.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreate = () => {
    setSelectedPropertyType(null);
    setOpenModal("create");
    setIsModalVisible(true);
  };

  const handleEdit = (propertyType: PropertyType) => {
    setSelectedPropertyType(propertyType);
    setOpenModal("update");
    setIsModalVisible(true);
  };

  const handleDelete = (propertyType: PropertyType) => {
    modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa loại bất động sản "${propertyType.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deletePropertyType(propertyType.id);
      },
    });
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    refreshPropertyTypes();
  };

  const getTransactionTypeColor = (transactionType: string) => {
    switch (transactionType) {
      case "sale":
        return "green";
      case "rent":
        return "blue";
      case "project":
        return "purple";
      default:
        return "default";
    }
  };

  const getTransactionTypeText = (transactionType: string) => {
    switch (transactionType) {
      case "sale":
        return "Bán";
      case "rent":
        return "Cho thuê";
      case "project":
        return "Dự án";
      default:
        return transactionType;
    }
  };

  const columns = [
    {
      title: "Tên loại bất động sản",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Hình thức giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (transactionType: string) => (
        <Tag color={getTransactionTypeColor(transactionType)}>
          {getTransactionTypeText(transactionType)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
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
      render: (_: unknown, record: PropertyType) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(record)}
              loading={deleteLoading}
              className="text-red-500 hover:text-red-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="mb-2 text-gray-900">
              Quản lý loại bất động sản
            </Title>
            <Text className="text-lg text-gray-600">
              Quản lý tất cả loại bất động sản trên hệ thống
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="h-4 w-4" />}
              onClick={handleCreate}
              className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
            >
              Thêm loại bất động sản
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={8}>
            <AntInput
              placeholder="Tìm kiếm loại bất động sản..."
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              allowClear
              onClear={handleClearSearch}
            />
          </Col>
          <Col xs={24} md={8}>
            <Select
              placeholder="Lọc theo hình thức giao dịch"
              value={filterTransaction || undefined}
              onChange={(value) => setFilterTransaction(value)}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="sale">Bán</Option>
              <Option value="rent">Cho thuê</Option>
              <Option value="project">Dự án</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button onClick={handleClearSearch}>Xóa bộ lọc</Button>
            </Space>
          </Col>
        </Row>

        <Table
          dataSource={propertyTypesData.data}
          columns={columns}
          rowKey="id"
          loading={propertyTypesLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} loại bất động sản`,
            onChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description="Không có loại bất động sản nào"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      <PropertyTypeModal
        visible={isModalVisible}
        mode={openModal}
        propertyType={selectedPropertyType}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
