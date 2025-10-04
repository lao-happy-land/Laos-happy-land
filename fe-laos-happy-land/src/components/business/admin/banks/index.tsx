"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  Button,
  Card,
  message,
  Input as AntInput,
  Spin,
  Empty,
  Row,
  Col,
  Typography,
  Pagination,
  Space,
  Popconfirm,
  Tag,
} from "antd";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import bankService from "@/share/service/bank.service";
import type { Bank } from "@/share/service/bank.service";
import BankModal from "./bank-modal";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";

const { Title, Text } = Typography;

export default function Banks() {
  const t = useTranslations();
  const locale = useUrlLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isVisible, setIsModalVisible] = useState(false);

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sync URL params with component state
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlPage = parseInt(searchParams.get("page") ?? "1");
    const urlPageSize = parseInt(searchParams.get("pageSize") ?? "10");

    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setSearchInputValue(urlSearch);
    }
    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlPageSize !== pageSize) setPageSize(urlPageSize);
  }, [searchParams, searchTerm, currentPage, pageSize]);

  const {
    data: banksData = { data: [], meta: { itemCount: 0, pageCount: 0 } },
    loading: banksLoading,
    refresh: refreshBanks,
  } = useRequest(
    async () => {
      const response = await bankService.getBanks({
        search: searchTerm || undefined,
        page: currentPage,
        perPage: pageSize,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response;
    },
    {
      refreshDeps: [searchTerm, currentPage, pageSize],
      onSuccess: (data) => {
        setTotal(data.meta.itemCount ?? 0);
      },
      onError: (error) => {
        console.error("Error loading banks:", error);
        message.error(t("admin.cannotLoadBanks"));
      },
    },
  );

  const banks = banksData.data || [];

  const { runAsync: deleteBank, loading: deletingBank } = useRequest(
    async (bankId: string) => {
      await bankService.deleteBank(bankId);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.bankDeletedSuccessfully"));
        refreshBanks();
      },
      onError: (error) => {
        console.error("Error deleting bank:", error);
        message.error(t("admin.cannotDeleteBank"));
      },
    },
  );

  const handleDeleteBank = async (bankId: string) => {
    await deleteBank(bankId);
  };

  const updateURLParams = (params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === 0) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSearch = () => {
    setSearchTerm(searchInputValue);
    updateURLParams({ search: searchInputValue, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    updateURLParams({ page, pageSize: size });
  };

  const handleEditBank = (bank: Bank) => {
    setSelectedBank(bank);
    setIsModalVisible(true);
  };

  const handleOpenModal = () => {
    setSelectedBank(null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: t("admin.bankName"),
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Text strong className="text-gray-900">
          {name}
        </Text>
      ),
    },
    {
      title: t("admin.termRates"),
      dataIndex: "termRates",
      key: "termRates",
      render: (termRates: Array<{ term: string; interestRate: number }>) => (
        <Space wrap>
          {termRates?.map((rate, index) => (
            <Tag key={index} color="blue">
              {rate.term}: {rate.interestRate}%
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t("admin.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        try {
          return new Date(date).toLocaleDateString("vi-VN");
        } catch {
          return t("common.invalidDate");
        }
      },
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (bank: Bank) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEditBank(bank)}
            title={t("admin.edit")}
          />
          <Popconfirm
            title={t("admin.deleteBank")}
            description={t("admin.deleteBankConfirm").replace(
              "{name}",
              bank.name,
            )}
            onConfirm={() => handleDeleteBank(bank.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              loading={deletingBank}
              title={t("admin.delete")}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (banksLoading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {t("admin.manageBanks")}
            </Title>
            <Text type="secondary">{t("admin.manageBanksDescription")}</Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleOpenModal}
              size="large"
            >
              {t("admin.addBank")}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Search */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <AntInput
              placeholder={t("admin.searchBanks")}
              value={searchInputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Search size={16} />}
              onClick={handleSearch}
            >
              {t("common.search")}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Banks Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={banks}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                description={
                  searchTerm
                    ? t("admin.noBanksFound")
                    : t("admin.startByAddingFirstBank")
                }
              />
            ),
          }}
        />
        <Pagination
          style={{ marginTop: "20px" }}
          align="center"
          total={total}
          onChange={handlePaginationChange}
          current={currentPage}
          pageSize={pageSize}
        />
      </Card>

      <BankModal
        visible={isVisible}
        onClose={() => setIsModalVisible(false)}
        bank={selectedBank}
        mode={selectedBank ? "edit" : "create"}
        onSuccess={() => {
          setIsModalVisible(false);
          refreshBanks();
        }}
      />
    </div>
  );
}
