"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useTranslations } from "next-intl";
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Empty,
  Tooltip,
  App,
  Tag,
} from "antd";
import { Search, Trash2, Edit, TrendingUp } from "lucide-react";
import exchangeRateService, {
  type ExchangeRate,
} from "@/share/service/exchange-rate.service";
import ExchangeRateModal from "./exchange-rate-modal";

const { Title, Text } = Typography;

const AdminExchangeRates = () => {
  const t = useTranslations();
  const { modal, message } = App.useApp();

  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExchangeRate, setSelectedExchangeRate] =
    useState<ExchangeRate | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch exchange rates
  const { loading: loadingExchangeRates, run: fetchExchangeRates } = useRequest(
    async () => {
      const response = await exchangeRateService.getAllExchangeRates({
        page: currentPage,
        perPage: pageSize,
      });
      return response;
    },
    {
      onSuccess: (data) => {
        setExchangeRates(data.data);
        setTotal(data.meta.totalItems);
      },
      onError: (error) => {
        console.error("Error fetching exchange rates:", error);
        message.error(t("admin.cannotLoadExchangeRates"));
      },
    },
  );

  // Delete exchange rate
  const { run: deleteExchangeRate } = useRequest(
    async (id: string) => {
      await exchangeRateService.deleteExchangeRate(id);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.exchangeRateDeletedSuccessfully"));
        fetchExchangeRates();
      },
      onError: () => {
        message.error(t("admin.cannotDeleteExchangeRate"));
      },
    },
  );

  // Initial fetch
  useEffect(() => {
    fetchExchangeRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize]);

  // Filter exchange rates based on search query
  const filteredExchangeRates = exchangeRates.filter((rate) =>
    rate.currency.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEdit = (exchangeRate: ExchangeRate) => {
    setSelectedExchangeRate(exchangeRate);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleDelete = (exchangeRate: ExchangeRate) => {
    modal.confirm({
      title: t("admin.deleteExchangeRate"),
      content: `${t("admin.confirmDeleteExchangeRate")} ${exchangeRate.currency}?`,
      okText: t("admin.delete"),
      okType: "danger",
      cancelText: t("admin.cancel"),
      onOk: () => {
        deleteExchangeRate(exchangeRate.id);
      },
    });
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    setSelectedExchangeRate(null);
    fetchExchangeRates();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedExchangeRate(null);
  };

  const columns = [
    {
      title: t("admin.currency"),
      dataIndex: "currency",
      key: "currency",
      width: 150,
      render: (currency: string) => (
        <Tag color="blue" className="text-base font-semibold">
          {currency}
        </Tag>
      ),
    },
    {
      title: t("admin.exchangeRate"),
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <Text className="font-mono text-base font-semibold text-green-700">
            {rate.toLocaleString("en-US", {
              minimumFractionDigits: 6,
              maximumFractionDigits: 6,
            })}
          </Text>
        </div>
      ),
    },
    {
      title: t("admin.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (date: string) => (
        <Text className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: t("admin.lastUpdated"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 200,
      render: (date: string) => (
        <Text className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString()}
        </Text>
      ),
    },
    {
      title: t("admin.actions"),
      key: "actions",
      fixed: "right" as const,
      width: 100,
      render: (_: unknown, record: ExchangeRate) => (
        <Space size="small">
          <Tooltip title={t("admin.edit")}>
            <Button
              type="text"
              size="small"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t("admin.delete")}>
            <Button
              type="text"
              size="small"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Title level={2} className="mb-2 text-gray-900">
              {t("admin.exchangeRates")}
            </Title>
            <Text className="text-lg text-gray-600">
              {t("admin.manageExchangeRates")}
            </Text>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder={t("admin.searchByCurrency")}
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="large"
          allowClear
        />
      </Card>

      {/* Exchange Rates Table */}
      <Card style={{ marginTop: "1rem" }}>
        <Table
          columns={columns}
          dataSource={filteredExchangeRates}
          rowKey="id"
          loading={loadingExchangeRates}
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
              `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.exchangeRates")}`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <Empty
                description={t("admin.noExchangeRatesFound")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        visible={isModalVisible}
        mode={modalMode}
        exchangeRate={selectedExchangeRate}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminExchangeRates;
