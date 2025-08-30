"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { Modal, Form, Input, Select, Button, message, Spin } from "antd";
import { Save } from "lucide-react";
import propertyTypeService from "@/share/service/property-type.service";
import type { PropertyType } from "@/@types/types";

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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
            ? "Tạo loại bất động sản thành công!"
            : "Cập nhật loại bất động sản thành công!",
        );
        onSuccess();
      },
      onError: (error: unknown) => {
        console.error("Failed to submit property type:", error);
        message.error(
          mode === "create"
            ? "Không thể tạo loại bất động sản"
            : "Không thể cập nhật loại bất động sản",
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
          ? "Thêm loại bất động sản"
          : "Chỉnh sửa loại bất động sản"
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          icon={<Save className="h-4 w-4" />}
          onClick={handleSubmit}
          className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
        >
          {mode === "create" ? "Tạo" : "Cập nhật"}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên loại bất động sản"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên loại bất động sản!",
              },
              { min: 2, message: "Tên phải có ít nhất 2 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên loại bất động sản..." size="large" />
          </Form.Item>

          <Form.Item
            name="transactionType"
            label="Hình thức giao dịch"
            rules={[
              { required: true, message: "Vui lòng chọn hình thức giao dịch!" },
            ]}
          >
            <Select placeholder="Chọn hình thức giao dịch" size="large">
              <Option value="sale">Bán</Option>
              <Option value="rent">Cho thuê</Option>
              <Option value="project">Dự án</Option>
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
