"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useRequest } from "ahooks";
import { newsService } from "@/share/service/news.service";
import { newsTypeService } from "@/share/service/news-type.service";
import type { Content, News } from "@/@types/types";
import type { CreateNewsDto } from "@/@types/gentype-axios";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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
        message.success(t("admin.createNewsSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.createNewsFailed"));
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
        message.success(t("admin.updateNewsSuccess"));
        onSuccess();
      },
      onError: (error: unknown) => {
        message.error(t("admin.updateNewsFailed"));
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
      title={mode === "create" ? t("admin.addNews") : t("admin.editNews")}
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
      width={800}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          name="title"
          label={t("admin.newsTitle")}
          rules={[
            { required: true, message: t("admin.pleaseEnterNewsTitle") },
            { min: 5, message: t("admin.newsTitleMinLength") },
            { max: 200, message: t("admin.newsTitleMaxLength") },
          ]}
        >
          <Input placeholder={t("admin.enterNewsTitle")} size="large" />
        </Form.Item>

        <Form.Item
          name="newsTypeId"
          label={t("admin.newsType")}
          rules={[{ required: true, message: t("admin.pleaseSelectNewsType") }]}
        >
          <Select
            placeholder={t("admin.selectNewsType")}
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

        <Form.Item
          name="details"
          rules={[
            {
              validator: (_, value) => {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                  return Promise.reject(
                    new Error(t("property.pleaseAddAtLeast1Content")),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <ProjectContentBuilder form={form} name="details" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewsModal;
