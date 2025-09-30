"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
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
    searchParams.get("transaction") ?? "all",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sync URL params with component state
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlTransaction = searchParams.get("transaction") ?? "all";
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
        transaction:
          filterTransaction === "all"
            ? undefined
            : (filterTransaction as "rent" | "sale" | "project" | undefined),
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
        message.error(t("admin.cannotLoadPropertyTypes"));
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
        message.success(t("admin.propertyTypeDeletedSuccessfully"));
        refreshPropertyTypes();
      },
      onError: (error) => {
        console.error("Failed to delete property type:", error);
        message.error(t("admin.cannotDeletePropertyType"));
      },
    },
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchInputValue) params.set("search", searchInputValue);
    if (filterTransaction !== "all")
      params.set("transaction", filterTransaction);
    params.set("page", "1");
    params.set("pageSize", pageSize.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSearchTerm("");
    setFilterTransaction("all");
    setCurrentPage(1);
    router.push(pathname);
  };

  const handlePageChange = (page: number, size: number) => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (filterTransaction !== "all")
      params.set("transaction", filterTransaction);
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
      title: t("admin.confirmDelete"),
      content: t("admin.confirmDeletePropertyType", {
        name: propertyType.name,
      }),
      okText: t("common.delete"),
      okType: "danger",
      cancelText: t("common.cancel"),
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
        return t("property.forSale");
      case "rent":
        return t("property.forRent");
      case "project":
        return t("navigation.projects");
      default:
        return transactionType;
    }
  };

  const handleTransactionTypeChange = (value: string) => {
    setFilterTransaction(value === "all" ? "all" : value);
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (value !== "all") params.set("transaction", value);
    params.set("page", "1");
    params.set("pageSize", pageSize.toString());
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const columns = [
    {
      title: t("admin.propertyTypeName"),
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: t("admin.transactionType"),
      dataIndex: "transactionType",
      key: "transactionType",
      render: (transactionType: string) => (
        <Tag color={getTransactionTypeColor(transactionType)}>
          {getTransactionTypeText(transactionType)}
        </Tag>
      ),
    },
    {
      title: t("property.createdAt"),
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
          return t("common.invalidDate");
        }
      },
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (_: unknown, record: PropertyType) => (
        <Space size="small">
          <Tooltip title={t("common.edit")}>
            <Button
              type="text"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title={t("common.delete")}>
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
              {t("admin.managePropertyTypes")}
            </Title>
            <Text className="text-lg text-gray-600">
              {t("admin.managePropertyTypesDescription")}
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
              {t("admin.addPropertyType")}
            </Button>
          </Col>
        </Row>
      </div>

      <Card>
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} md={8}>
            <AntInput
              placeholder={t("admin.searchPropertyTypes")}
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
              placeholder={t("admin.filterByTransactionType")}
              value={filterTransaction || undefined}
              onChange={(value) => {
                handleTransactionTypeChange(value);
              }}
              allowClear
              onClear={() => {
                handleTransactionTypeChange("all");
              }}
              style={{ width: "100%" }}
            >
              <Option value="all">{t("common.all")}</Option>
              <Option value="sale">{t("property.forSale")}</Option>
              <Option value="rent">{t("property.forRent")}</Option>
              <Option value="project">{t("navigation.projects")}</Option>
            </Select>
          </Col>
          <Col xs={24} md={8}>
            <Space>
              <Button type="primary" onClick={handleSearch}>
                {t("common.search")}
              </Button>
              <Button onClick={handleClearSearch}>
                {t("admin.clearFilters")}
              </Button>
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
              t("admin.propertyTypesPagination", {
                start: range[0],
                end: range[1],
                total,
              }),
            onChange: handlePageChange,
          }}
          locale={{
            emptyText: (
              <Empty
                description={t("admin.noPropertyTypes")}
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
