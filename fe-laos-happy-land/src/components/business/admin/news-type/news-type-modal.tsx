"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useRequest } from "ahooks";
import { newsTypeService } from "@/share/service/news-type.service";
import type { NewsType } from "@/@types/types";
import type { CreateNewsTypeDto } from "@/@types/gentype-axios";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  // Create news type
  const { run: createNewsType, loading: createLoading } = useRequest(
    newsTypeService.createNewsType,
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.createNewsTypeSuccess"));
        onSuccess();
      },
      onError: (error: Error) => {
        message.error(t("admin.createNewsTypeFailed"));
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
        message.success(t("admin.updateNewsTypeSuccess"));
        onSuccess();
      },
      onError: (error: Error) => {
        message.error(t("admin.updateNewsTypeFailed"));
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
      const values = (await form.validateFields()) as { name: string };

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
      title={
        mode === "create" ? t("admin.addNewsType") : t("admin.editNewsType")
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          {t("admin.cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          {mode === "create" ? t("admin.create") : t("admin.update")}
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="name"
          label={t("admin.newsTypeName")}
          rules={[
            { required: true, message: t("admin.pleaseEnterNewsTypeName") },
            { min: 2, message: t("admin.newsTypeNameMinLength") },
            { max: 100, message: t("admin.newsTypeNameMaxLength") },
          ]}
        >
          <Input placeholder={t("admin.enterNewsTypeName")} size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsTypeModal;
