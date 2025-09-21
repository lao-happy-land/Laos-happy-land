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

const { Title } = Typography;
const { Option } = Select;

const NewsAdmin: React.FC = () => {
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
        message.success("Xóa tin tức thành công!");
        refresh();
      },
      onError: (error: unknown) => {
        message.error("Xóa tin tức thất bại!");
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
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      ),
    },
    {
      title: "Loại tin tức",
      dataIndex: "type",
      key: "type",
      render: (type: NewsType) => (
        <Tag color="blue">{type?.name || "Không xác định"}</Tag>
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
      render: (_: unknown, record: News) => (
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
            title="Xóa tin tức"
            description="Bạn có chắc chắn muốn xóa tin tức này?"
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
              Quản lý tin tức
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={handleCreate}
              size="large"
            >
              Thêm tin tức
            </Button>
          </Col>
        </Row>

        <Row gutter={16} className="mb-4">
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm tin tức..."
              prefix={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="large"
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="Lọc theo loại tin tức"
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
              `${range[0]}-${range[1]} của ${total} tin tức`,
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
