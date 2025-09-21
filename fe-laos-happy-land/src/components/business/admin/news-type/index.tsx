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
        message.success("Xóa loại tin tức thành công!");
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
      title: "Tên loại tin tức",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: NewsType) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa loại tin tức"
            description="Bạn có chắc chắn muốn xóa loại tin tức này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="primary"
              danger
              icon={<Trash2 size={14} />}
              size="small"
              loading={deleteLoading}
            >
              Xóa
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
              Quản lý loại tin tức
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleCreate}
              size="large"
            >
              Thêm loại tin tức
            </Button>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm loại tin tức..."
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
              `${range[0]}-${range[1]} của ${total} loại tin tức`,
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
