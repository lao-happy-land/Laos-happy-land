"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import { useRequest } from "ahooks";
import { newsTypeService } from "@/share/service/news-type.service";
import type { NewsType } from "@/@types/types";
import type { CreateNewsTypeDto } from "@/@types/gentype-axios";

interface NewsTypeModalProps {
  visible: boolean;
  mode: "create" | "edit";
  newsType: NewsType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NewsTypeModal: React.FC<NewsTypeModalProps> = ({
  visible,
  mode,
  newsType,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // Create news type
  const { run: createNewsType, loading: createLoading } = useRequest(
    newsTypeService.createNewsType,
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo loại tin tức thành công!");
        onSuccess();
      },
      onError: (error: any) => {
        message.error("Tạo loại tin tức thất bại!");
        console.error("Create error:", error);
      },
    },
  );

  // Update news type
  const { run: updateNewsType, loading: updateLoading } = useRequest(
    newsTypeService.updateNewsType,
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật loại tin tức thành công!");
        onSuccess();
      },
      onError: (error: any) => {
        message.error("Cập nhật loại tin tức thất bại!");
        console.error("Update error:", error);
      },
    },
  );

  useEffect(() => {
    if (visible) {
      if (mode === "edit" && newsType) {
        form.setFieldsValue({
          name: newsType.name,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, mode, newsType, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (mode === "create") {
        const data: CreateNewsTypeDto = {
          name: values.name.trim(),
        };
        createNewsType(data);
      } else if (mode === "edit" && newsType) {
        const data: CreateNewsTypeDto = {
          name: values.name.trim(),
        };
        updateNewsType(newsType.id, data);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const isLoading = createLoading || updateLoading;

  return (
    <Modal
      title={mode === "create" ? "Thêm loại tin tức" : "Sửa loại tin tức"}
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
      width={600}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label="Tên loại tin tức"
          rules={[
            { required: true, message: "Vui lòng nhập tên loại tin tức!" },
            { min: 2, message: "Tên loại tin tức phải có ít nhất 2 ký tự!" },
            { max: 100, message: "Tên loại tin tức không được quá 100 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên loại tin tức..." size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsTypeModal;
