"use client";

import { useEffect } from "react";
import { useRequest } from "ahooks";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { Save } from "lucide-react";
import propertyTypeService from "@/share/service/property-type.service";
import type { PropertyType } from "@/@types/types";
import { useTranslations } from "next-intl";

const { Option } = Select;

interface PropertyTypeModalProps {
  visible: boolean;
  mode: "create" | "update";
  propertyType: PropertyType | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PropertyTypeModal({
  visible,
  mode,
  propertyType,
  onCancel,
  onSuccess,
}: PropertyTypeModalProps) {
  const t = useTranslations();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && propertyType && mode === "update") {
      form.setFieldsValue({
        name: propertyType.name,
        transactionType: propertyType.transactionType,
      });
    } else if (visible && mode === "create") {
      form.resetFields();
    }
  }, [visible, propertyType, mode, form]);

  const { loading: submitting, run: submitForm } = useRequest(
    async (values: {
      name: string;
      transactionType: "rent" | "sale" | "project";
    }) => {
      if (mode === "create") {
        return await propertyTypeService.createPropertyType(values);
      } else {
        if (!propertyType) throw new Error("Property type not found");
        return await propertyTypeService.updatePropertyType(
          propertyType.id,
          values,
        );
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(
          mode === "create"
            ? t("admin.createPropertyTypeSuccess")
            : t("admin.updatePropertyTypeSuccess"),
        );
        onSuccess();
      },
      onError: (error: unknown) => {
        console.error("Failed to submit property type:", error);
        message.error(
          mode === "create"
            ? t("admin.createPropertyTypeFailed")
            : t("admin.updatePropertyTypeFailed"),
        );
      },
    },
  );

  const handleSubmit = async () => {
    try {
      const values = (await form.validateFields()) as {
        name: string;
        transactionType: "rent" | "sale" | "project";
      };
      submitForm(values);
    } catch (error: unknown) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        mode === "create"
          ? t("admin.addPropertyType")
          : t("admin.editPropertyType")
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t("admin.cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          icon={<Save className="h-4 w-4" />}
          onClick={handleSubmit}
          className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
        >
          {mode === "create" ? t("admin.create") : t("admin.update")}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Spin spinning={submitting}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label={t("property.propertyTypeName")}
            rules={[
              {
                required: true,
                message: t("property.pleaseEnterPropertyTypeName"),
              },
              { min: 2, message: t("property.propertyTypeNameMinLength") },
            ]}
          >
            <Input
              placeholder={t("property.enterPropertyTypeName")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="transactionType"
            label={t("property.transactionType")}
            rules={[
              {
                required: true,
                message: t("property.pleaseSelectTransactionType"),
              },
            ]}
          >
            <Select
              placeholder={t("property.selectTransactionType")}
              size="large"
            >
              <Option value="sale">{t("property.sale")}</Option>
              <Option value="rent">{t("property.rent")}</Option>
              <Option value="project">{t("property.project")}</Option>
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
