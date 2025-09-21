"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useRequest } from "ahooks";
import { newsService } from "@/share/service/news.service";
import { newsTypeService } from "@/share/service/news-type.service";
import type { Content, News } from "@/@types/types";
import type { CreateNewsDto } from "@/@types/gentype-axios";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";

const { Option } = Select;

interface NewsModalProps {
  visible: boolean;
  mode: "create" | "edit";
  news: News | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({
  visible,
  mode,
  news,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // Fetch news types
  const { data: newsTypesData } = useRequest(
    () => newsTypeService.getAllNewsTypes({ page: 1, perPage: 100 }),
    {
      refreshDeps: [],
    },
  );

  // Create news
  const { run: createNews, loading: createLoading } = useRequest(
    newsService.createNews,
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo tin tức thành công!");
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error("Tạo tin tức thất bại!");
        console.error("Create error:", error);
      },
    },
  );

  // Update news
  const { run: updateNews, loading: updateLoading } = useRequest(
    newsService.updateNews,
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật tin tức thành công!");
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error("Cập nhật tin tức thất bại!");
        console.error("Update error:", error);
      },
    },
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && news) {
        const newsTypeId = (news as unknown as { type?: { id: string } }).type
          ?.id;
        form.setFieldsValue({
          title: news.title,
          newsTypeId: newsTypeId,
          details: news.details ?? [],
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, news, form, newsTypesData]);

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as {
        title: string;
        newsTypeId: string;
        details: Content;
      };

      if (mode === "create") {
        const data: CreateNewsDto = {
          title: values.title.trim(),
          newsTypeId: values.newsTypeId,
          details: values.details || [],
        };
        createNews(data);
      } else if (mode === "edit" && news) {
        const data: CreateNewsDto = {
          title: values.title.trim(),
          newsTypeId: values.newsTypeId,
          details: values.details ?? [],
        };
        updateNews(news.id, data);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Modal
      title={mode === "create" ? "Thêm tin tức" : "Sửa tin tức"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          {mode === "create" ? "Tạo" : "Cập nhật"}
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label="Tiêu đề tin tức"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề tin tức!" },
            { min: 5, message: "Tiêu đề phải có ít nhất 5 ký tự!" },
            { max: 200, message: "Tiêu đề không được quá 200 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề tin tức..." size="large" />
        </Form.Item>

        <Form.Item
          name="newsTypeId"
          label="Loại tin tức"
          rules={[{ required: true, message: "Vui lòng chọn loại tin tức!" }]}
        >
          <Select
            placeholder="Chọn loại tin tức..."
            size="large"
            key={
              (news as unknown as { type?: { id: string } })?.type?.id ??
              "empty"
            }
            value={form.getFieldValue("newsTypeId") as string}
          >
            {newsTypesData?.data?.map((newsType) => (
              <Option key={newsType.id} value={newsType.id}>
                {newsType.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <ProjectContentBuilder form={form} name="details" />
      </Form>
    </Modal>
  );
};

export default NewsModal;
