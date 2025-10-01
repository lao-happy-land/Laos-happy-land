"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRequest } from "ahooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  Button,
  Input,
  Tag,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Empty,
  Tooltip,
  Select,
  Slider,
  Form,
  App,
} from "antd";
import {
  Plus,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import type { Property, User, PropertyType } from "@/@types/types";
import { numberToString } from "@/share/helper/number-to-string";
import { useTranslations } from "next-intl";
import { useUrlLocale } from "@/utils/locale";
import {
  getCurrencyByLocale,
  getPropertyParamsByLocale,
  getValidLocale,
  type SupportedLocale,
} from "@/share/helper/locale.helper";

const { Title, Text } = Typography;
const { Option } = Select;

const AdminProperties = () => {
  const { modal, message } = App.useApp();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [form] = Form.useForm();

  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000000,
  ]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rejectionReason, setRejectionReason] = useState("");
  const [total, setTotal] = useState(0);

  const locale = useUrlLocale();

  // Fetch property types
  const { loading: propertyTypesLoading, run: fetchPropertyTypes } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: selectedTransactionType as "rent" | "sale" | "project",
      });
      return response.data ?? [];
    },
    {
      manual: true,
      onSuccess: (data) => {
        setPropertyTypes(data);
      },
      onError: (error) => {
        console.error("Failed to fetch property types:", error);
        message.error(t("admin.cannotLoadPropertyTypes"));
      },
    },
  );

  useEffect(() => {
    if (selectedTransactionType !== "all") {
      fetchPropertyTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransactionType]);

  // Update URL parameters
  const updateSearchParams = useCallback(
    (params: Record<string, string | string[] | number>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newSearchParams.set(key, value.join(","));
          } else {
            newSearchParams.delete(key);
          }
        } else {
          const shouldRemove =
            value === "" ||
            value === "0" ||
            value === 0 ||
            value === "100000000000" ||
            value === 100000000000 ||
            value === "false" ||
            value === "all" ||
            !value ||
            (typeof value === "string" && value.trim() === "");

          if (shouldRemove) {
            newSearchParams.delete(key);
          } else {
            newSearchParams.set(key, value.toString());
          }
        }
      });

      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  // Fetch properties with filters
  const { loading, run: fetchProperties } = useRequest(
    async () => {
      const params: {
        keyword?: string;
        type?: string[];
        minPrice?: number;
        maxPrice?: number;
        location?: string;
        transaction?: "rent" | "sale" | "project";
        status?: "pending" | "approved" | "rejected";
        currency?: string;
        page?: number;
        perPage?: number;
      } = {
        page: currentPage,
        perPage: pageSize,
        ...getPropertyParamsByLocale(getValidLocale(locale)),
      };

      if (searchTerm.trim()) {
        params.keyword = searchTerm;
      }

      if (selectedPropertyTypes.length > 0) {
        params.type = selectedPropertyTypes;
      }

      if (selectedStatus !== "all") {
        params.status = selectedStatus as "pending" | "approved" | "rejected";
      }

      if (selectedTransactionType !== "all") {
        params.transaction = selectedTransactionType as
          | "rent"
          | "sale"
          | "project";
      }

      if (selectedLocation !== "all") {
        params.location = selectedLocation;
      }

      if (priceRange[0] > 0) {
        params.minPrice = priceRange[0];
      }

      if (priceRange[1] < 100000000000) {
        params.maxPrice = priceRange[1];
      }

      return await propertyService.getProperties(params);
    },
    {
      onSuccess: (data) => {
        setProperties(data.data || []);
        setTotal(data.meta.itemCount ?? 0);
      },
      onError: (error) => {
        console.error("Failed to fetch properties:", error);
        message.error(t("admin.cannotLoadProperties"));
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
        message.success(t("admin.propertyDeletedSuccessfully"));
        fetchProperties();
      },
      onError: (error) => {
        console.error("Failed to delete property:", error);
        message.error(t("admin.cannotDeleteProperty"));
      },
    },
  );

  // Filter handlers
  const handleSearch = () => {
    const params: Record<string, string | string[] | number> = {};

    if (searchTerm) params.keyword = searchTerm;
    if (selectedPropertyTypes.length > 0) params.type = selectedPropertyTypes;
    if (selectedStatus !== "all") params.status = selectedStatus;
    if (selectedTransactionType !== "all")
      params.transaction = selectedTransactionType;
    if (selectedLocation !== "all") params.location = selectedLocation;
    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 100000000000) params.maxPrice = priceRange[1];

    updateSearchParams(params);
    message.success(t("admin.searching"));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedPropertyTypes([]);
    setSelectedStatus("all");
    setSelectedTransactionType("all");
    setSelectedLocation("all");
    setPriceRange([0, 100000000000]);
    form.resetFields();
    router.push(pathname);
  };

  const handlePropertyTypeChange = (types: string[]) => {
    setSelectedPropertyTypes(types);
    updateSearchParams({ type: types });
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    updateSearchParams({ status: status === "all" ? "" : status });
  };

  const handleTransactionTypeChange = (type: string) => {
    setSelectedTransactionType(type);
    updateSearchParams({ transaction: type === "all" ? "" : type });
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    updateSearchParams({ location: location === "all" ? "" : location });
  };

  const handlePriceRangeChange = (range: number | number[]) => {
    if (Array.isArray(range) && range.length === 2) {
      const [min, max] = range as [number, number];
      setPriceRange([min, max]);
      const params: Record<string, string | string[] | number> = {};

      if (min > 0) {
        params.minPrice = min;
      } else {
        params.minPrice = "";
      }

      if (max < 100000000000) {
        params.maxPrice = max;
      } else {
        params.maxPrice = "";
      }

      updateSearchParams(params);
    }
  };

  // Load URL parameters on mount
  useEffect(() => {
    const urlSearchTerm = searchParams.get("keyword") ?? "";
    const urlPropertyTypes =
      searchParams.get("type")?.split(",").filter(Boolean) ?? [];
    const urlStatus = searchParams.get("status") ?? "all";
    const urlTransactionType = searchParams.get("transaction") ?? "all";
    const urlLocation = searchParams.get("location") ?? "all";
    const urlMinPrice = parseInt(searchParams.get("minPrice") ?? "0");
    const urlMaxPrice = parseInt(
      searchParams.get("maxPrice") ?? "100000000000",
    );
    const urlPage = parseInt(searchParams.get("page") ?? "1");
    const urlPageSize = parseInt(searchParams.get("perPage") ?? "10");

    setSearchTerm(urlSearchTerm);
    setSelectedPropertyTypes(urlPropertyTypes);
    setSelectedStatus(urlStatus);
    setSelectedTransactionType(urlTransactionType);
    setSelectedLocation(urlLocation);
    setPriceRange([urlMinPrice, urlMaxPrice]);
    setCurrentPage(urlPage);
    setPageSize(urlPageSize);
  }, [searchParams]);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [
    searchTerm,
    selectedPropertyTypes,
    selectedStatus,
    selectedTransactionType,
    selectedLocation,
    priceRange,
    currentPage,
    pageSize,
    fetchProperties,
  ]);

  const handleApprove = (property: Property) => {
    modal.confirm({
      title: t("admin.confirmApprove"),
      content: t("admin.confirmApproveContent", {
        title: property.title,
      }),
      okText: t("admin.approve"),
      okType: "primary",
      cancelText: t("admin.cancel"),
      onOk() {
        propertyService
          .approveProperty(property.id)
          .then(() => {
            message.success(t("admin.propertyApprovedSuccessfully"));
            fetchProperties(); // Refresh the list
          })
          .catch((error) => {
            console.error("Error approving property:", error);
            message.error(t("admin.cannotApproveProperty"));
          });
      },
    });
  };

  const handleReject = (property: Property) => {
    modal.confirm({
      title: t("admin.confirmReject"),
      content: (
        <div>
          <p className="mb-4">
            {t("admin.confirmRejectContent", {
              title: property.title,
            })}
          </p>
          <Input.TextArea
            placeholder={t("admin.enterRejectionReason")}
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mt-2"
          />
        </div>
      ),
      okText: t("admin.confirmReject"),
      okType: "danger",
      cancelText: t("admin.cancel"),
      onOk() {
        const reason = rejectionReason.trim() || t("admin.adminRejected");

        propertyService
          .rejectProperty(property.id, { reason })
          .then(() => {
            message.success(t("admin.propertyRejectedSuccessfully"));
            setRejectionReason(""); // Reset reason
            fetchProperties(); // Refresh the list
          })
          .catch((error) => {
            console.error("Error rejecting property:", error);
            message.error(t("admin.cannotRejectProperty"));
          });
      },
    });
  };

  const handleDelete = (property: Property) => {
    modal.confirm({
      title: t("admin.confirmDelete"),
      icon: <AlertTriangle className="text-red-500" />,
      content: t("admin.confirmDeleteContent", {
        title: property.title,
      }),
      okText: t("admin.delete"),
      okType: "danger",
      cancelText: t("admin.cancel"),
      onOk() {
        deleteProperty(property.id);
      },
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedPropertyTypes.length > 0) count++;
    if (selectedStatus !== "all") count++;
    if (selectedTransactionType !== "all") count++;
    if (selectedLocation !== "all") count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000000000) count++;
    return count;
  };

  // Get filter display text
  const getFilterDisplayText = () => {
    const filters = [];

    if (searchTerm) {
      filters.push(`"${searchTerm}"`);
    }

    if (selectedPropertyTypes.length > 0) {
      const typeNames = selectedPropertyTypes
        .map((typeId) => {
          const propertyType = propertyTypes.find((pt) => pt.id === typeId);
          return propertyType?.name ?? typeId;
        })
        .filter(Boolean);

      if (typeNames.length > 0) {
        filters.push(typeNames.join(", "));
      }
    }

    if (selectedStatus !== "all") {
      const statusMap = {
        pending: t("admin.pending"),
        approved: t("admin.approved"),
        rejected: t("admin.rejected"),
      };
      filters.push(
        statusMap[selectedStatus as keyof typeof statusMap] || selectedStatus,
      );
    }

    if (selectedTransactionType !== "all") {
      const transactionMap = {
        sale: t("admin.sale"),
        rent: t("admin.forRent"),
        project: t("admin.projects"),
      };
      filters.push(
        transactionMap[
          selectedTransactionType as keyof typeof transactionMap
        ] || selectedTransactionType,
      );
    }

    if (selectedLocation !== "all") {
      filters.push(selectedLocation);
    }

    if (priceRange[0] > 0 || priceRange[1] < 100000000000) {
      filters.push(
        `${numberToString(priceRange[0])} - ${numberToString(priceRange[1])} LAK`,
      );
    }

    return filters.length > 0 ? filters.join(" • ") : "";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <Row justify="space-between" align="middle" className="mb-4">
          <Col>
            <Title level={2} className="mb-2 text-gray-900">
              {t("admin.manageProperties")}
            </Title>
            <Text className="text-lg text-gray-600">
              {t("admin.manageAllProperties")}
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
                {t("admin.addProperty")}
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Filter Controls */}
      <Card>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space size="small" wrap>
              <Button
                type={showFilters ? "primary" : "default"}
                icon={<Filter className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "border-blue-600 bg-blue-600" : ""}
              >
                {t("admin.filter")}
                {getActiveFilterCount() > 0 && (
                  <Tag color="red" className="ml-1">
                    {getActiveFilterCount()}
                  </Tag>
                )}
              </Button>

              {getActiveFilterCount() > 0 && (
                <Button
                  type="text"
                  icon={<X className="h-4 w-4" />}
                  onClick={handleClearFilters}
                  className="text-gray-500 hover:text-red-500"
                >
                  {t("admin.clearFilters")}
                </Button>
              )}

              {getFilterDisplayText() && (
                <Text type="secondary" className="text-sm">
                  {getFilterDisplayText()}
                </Text>
              )}
            </Space>
          </Col>
          <Col xs={24} md={8}>
            <Input
              placeholder={t("admin.searchProperties")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-gray-400" />}
              size="large"
              allowClear
              onPressEnter={handleSearch}
            />
          </Col>
        </Row>

        {/* Collapsible Filter Panel */}
        {showFilters && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <Form form={form} layout="vertical">
              <div
                className={`grid grid-cols-1 gap-6 md:grid-cols-${selectedTransactionType === "all" ? "4" : "5"}`}
              >
                <Form.Item label={t("admin.transactionType")}>
                  <Select
                    placeholder={t("admin.selectTransactionType")}
                    value={selectedTransactionType}
                    onChange={handleTransactionTypeChange}
                    allowClear
                    loading={propertyTypesLoading}
                  >
                    <Option value="all">{t("common.all")}</Option>
                    <Option value="sale">{t("admin.sale")}</Option>
                    <Option value="rent">{t("admin.forRent")}</Option>
                    <Option value="project">{t("admin.projects")}</Option>
                  </Select>
                </Form.Item>

                {selectedTransactionType !== "all" && (
                  <Form.Item label={t("admin.propertyType")}>
                    <Select
                      mode="multiple"
                      placeholder={t("admin.selectPropertyType")}
                      value={selectedPropertyTypes}
                      onChange={handlePropertyTypeChange}
                      loading={propertyTypesLoading}
                      allowClear
                      maxTagCount="responsive"
                    >
                      {propertyTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}

                <Form.Item label={t("admin.status")}>
                  <Select
                    placeholder={t("admin.selectStatus")}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    allowClear
                    loading={propertyTypesLoading}
                  >
                    <Option value="all">{t("common.all")}</Option>
                    <Option value="pending">{t("admin.pending")}</Option>
                    <Option value="approved">{t("admin.approved")}</Option>
                    <Option value="rejected">{t("admin.rejected")}</Option>
                  </Select>
                </Form.Item>
                <Form.Item label={t("admin.priceRange")}>
                  <div className="space-y-2">
                    <Slider
                      range
                      min={0}
                      max={100000000000}
                      step={100000000}
                      value={priceRange}
                      onChange={handlePriceRangeChange}
                    />
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>{numberToString(priceRange[0])} LAK</span>
                      <span>-</span>
                      <span>{numberToString(priceRange[1])} LAK</span>
                    </div>
                  </div>
                </Form.Item>

                <Form.Item label={t("admin.location")}>
                  <Select
                    placeholder={t("admin.selectLocation")}
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    allowClear
                  >
                    <Option value="all">{t("common.all")}</Option>
                    <Option value="vientiane">Vientiane</Option>
                    <Option value="luang-prabang">Luang Prabang</Option>
                    <Option value="pakse">Pakse</Option>
                    <Option value="savannakhet">Savannakhet</Option>
                    <Option value="thakhek">Thakhek</Option>
                    <Option value="xam-nua">Xam Nua</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="flex justify-end gap-2">
                <Button onClick={handleClearFilters}>
                  {t("admin.clearFilters")}
                </Button>
                <Button type="primary" onClick={handleSearch}>
                  {t("admin.applyFilters")}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          dataSource={properties}
          loading={loading}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            total: total,
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.properties")}`,
          }}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: (
              <Empty
                description={t("admin.noProperties")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          columns={[
            {
              title: t("admin.property"),
              dataIndex: "title",
              key: "title",
              fixed: "left",
              width: 340,
              render: (title: string, property: Property) => (
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium text-gray-900">
                      {title}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      📍 {property.location?.address ?? t("admin.noAddress")}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              title: t("admin.owner"),
              dataIndex: "owner",
              key: "owner",
              width: 160,
              render: (owner: User | string) => (
                <Tag color="blue">
                  {typeof owner === "string"
                    ? owner
                    : (owner?.fullName ?? t("admin.unknown"))}
                </Tag>
              ),
            },
            {
              title: t("admin.propertyType"),
              dataIndex: "type",
              key: "type",
              width: 180,
              render: (
                type: { id: string; name: string } | null | undefined,
              ) => <Tag color="blue">{type?.name ?? t("admin.unknown")}</Tag>,
            },
            {
              title: t("property.price"),
              dataIndex: "price",
              key: "price",
              width: 150,
              render: (price: string) =>
                price
                  ? `${numberToString(Number(price), locale, getCurrencyByLocale(locale as SupportedLocale))}`
                  : t("admin.negotiable"),
            },
            {
              title: t("property.status"),
              dataIndex: "status",
              key: "status",
              width: 80,
              render: (status: "pending" | "approved" | "rejected") => (
                <Tag
                  color={
                    status === "approved"
                      ? "green"
                      : status === "pending"
                        ? "orange"
                        : "red"
                  }
                >
                  {status === "approved"
                    ? t("admin.approved")
                    : status === "pending"
                      ? t("admin.pending")
                      : t("admin.rejected")}
                </Tag>
              ),
            },
            {
              title: t("property.views"),
              dataIndex: "viewsCount",
              key: "viewsCount",
              width: 80,
              render: (count: number) => count || 0,
            },
            {
              title: t("property.createdAt"),
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
                  return t("common.invalidDate");
                }
              },
            },
            {
              title: t("admin.actions"),
              key: "actions",
              width: 200,
              render: (_: unknown, property: Property) => (
                <Space size="small">
                  <Tooltip title={t("admin.viewEditProperty")}>
                    <Link href={`/${locale}/admin/properties/${property.id}`}>
                      <button
                        type="button"
                        className="rounded-md bg-blue-50 p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </Link>
                  </Tooltip>

                  <Tooltip title={t("admin.deleteProperty")}>
                    <button
                      type="button"
                      className="rounded-md bg-red-50 p-2 text-red-500 hover:bg-red-100 hover:text-red-700"
                      onClick={() => handleDelete(property)}
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  {property.status === "pending" && (
                    <>
                      <Tooltip title={t("admin.approveProperty")}>
                        <button
                          type="button"
                          className="rounded-md bg-blue-50 p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700"
                          onClick={() => handleApprove(property)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip title={t("admin.rejectProperty")}>
                        <button
                          type="button"
                          className="rounded-md bg-red-50 p-2 text-red-500 hover:bg-red-100 hover:text-red-700"
                          onClick={() => handleReject(property)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </>
                  )}
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
