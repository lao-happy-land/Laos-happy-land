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
} from "antd";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useRequest } from "ahooks";
import { newsTypeService } from "@/share/service/news-type.service";
import type { NewsType } from "@/@types/types";
import NewsTypeModal from "./news-type-modal";

const { Title } = Typography;

const NewsTypeAdmin: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedNewsType, setSelectedNewsType] = useState<NewsType | null>(
    null,
  );

  // Fetch news types
  const {
    data: newsTypesData,
    loading,
    refresh,
  } = useRequest(
    () => newsTypeService.getAllNewsTypes({ page: 1, perPage: 100 }),
    {
      refreshDeps: [],
    },
  );

  // Delete news type
  const { run: deleteNewsType, loading: deleteLoading } = useRequest(
    newsTypeService.deleteNewsType,
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.deleteNewsTypeSuccess"));
        refresh();
      },
      onError: (error: unknown) => {
        message.error("Xóa loại tin tức thất bại!");
        console.error("Delete error:", error);
      },
    },
  );

  const handleCreate = () => {
    setModalMode("create");
    setSelectedNewsType(null);
    setModalVisible(true);
  };

  const handleEdit = (newsType: NewsType) => {
    setModalMode("edit");
    setSelectedNewsType(newsType);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteNewsType(id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedNewsType(null);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  // Filter news types based on search query
  const filteredNewsTypes = newsTypesData?.data?.filter((newsType) =>
    newsType.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const columns = [
    {
      title: t("admin.newsTypeName"),
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
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
      render: (_: unknown, record: NewsType) => (
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
            title={t("admin.deleteNewsType")}
            description={t("admin.deleteNewsTypeConfirm")}
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
              {t("admin.manageNewsTypes")}
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleCreate}
              size="large"
            >
              {t("admin.addNewsType")}
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col span={8}>
            <Input
              placeholder={t("admin.searchNewsTypes")}
              prefix={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredNewsTypes}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredNewsTypes?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.newsTypes")}`,
          }}
        />
      </Card>

      <NewsTypeModal
        visible={modalVisible}
        mode={modalMode}
        newsType={selectedNewsType}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default NewsTypeAdmin;
