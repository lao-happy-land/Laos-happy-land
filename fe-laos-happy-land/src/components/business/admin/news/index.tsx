"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
  Select,
  Tag,
} from "antd";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useRequest } from "ahooks";
import { newsService } from "@/share/service/news.service";
import { newsTypeService } from "@/share/service/news-type.service";
import type { News, NewsType } from "@/@types/types";
import NewsModal from "./news-modal";
import { useTranslations } from "next-intl";

const { Title } = Typography;
const { Option } = Select;

const NewsAdmin: React.FC = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewsType, setSelectedNewsType] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Fetch news
  const {
    data: newsData,
    loading,
    refresh,
  } = useRequest(() => newsService.getAllNews({ page: 1, perPage: 100 }), {
    refreshDeps: [],
  });

  // Fetch news types for filter
  const { data: newsTypesData } = useRequest(
    () => newsTypeService.getAllNewsTypes({ page: 1, perPage: 100 }),
    {
      refreshDeps: [],
    },
  );

  // Delete news
  const { run: deleteNews, loading: deleteLoading } = useRequest(
    newsService.deleteNews,
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.deleteNewsSuccess"));
        refresh();
      },
      onError: (error: unknown) => {
        message.error(t("admin.deleteNewsFailed"));
        console.error("Delete error:", error);
      },
    },
  );

  const handleCreate = () => {
    setModalMode("create");
    setSelectedNews(null);
    setModalVisible(true);
  };

  const handleEdit = (news: News) => {
    setModalMode("edit");
    setSelectedNews(news);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedNews(null);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  // Filter news based on search query and news type
  const filteredNews = newsData?.data?.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      !selectedNewsType || news.newsTypeId === selectedNewsType;
    return matchesSearch && matchesType;
  });

  const columns = [
    {
      title: t("admin.title"),
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: t("admin.newsType"),
      dataIndex: "type",
      key: "type",
      render: (type: NewsType) => (
        <Tag color="blue">{type?.name || t("admin.unknown")}</Tag>
      ),
    },
    {
      title: t("admin.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (_: unknown, record: News) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            {t("admin.edit")}
          </Button>
          <Popconfirm
            title={t("admin.deleteNews")}
            description={t("admin.deleteNewsConfirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("admin.delete")}
            cancelText={t("admin.cancel")}
          >
            <Button
              type="primary"
              danger
              icon={<Trash2 size={14} />}
              size="small"
              loading={deleteLoading}
            >
              {t("admin.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Row justify="space-between" align="middle" className="mb-6">
          <Col>
            <Title level={2} className="!mb-0">
              {t("admin.manageNews")}
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleCreate}
              size="large"
            >
              {t("admin.addNews")}
            </Button>
          </Col>
        </Row>

        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Input
              placeholder={t("admin.searchNews")}
              prefix={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder={t("admin.filterNewsByType")}
              value={selectedNewsType}
              onChange={setSelectedNewsType}
              allowClear
              size="large"
              style={{ width: "100%" }}
            >
              {newsTypesData?.data?.map((newsType) => (
                <Option key={newsType.id} value={newsType.id}>
                  {newsType.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredNews}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredNews?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.news")}`,
          }}
        />
      </Card>

      <NewsModal
        visible={modalVisible}
        mode={modalMode}
        news={selectedNews}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default NewsAdmin;
