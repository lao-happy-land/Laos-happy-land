"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { Modal, Form, Input, Upload, Button, Typography, App, Tag } from "antd";
import { Upload as UploadIcon, Plus, MapPin } from "lucide-react";
import type { UploadFile } from "antd";
import locationInfoService from "@/share/service/location-info.service";
import type { LocationInfo } from "@/share/service/location-info.service";
import type { CreateLocationInfoDto } from "@/@types/gentype-axios";

const { Text } = Typography;

interface LocationInfoModalProps {
  visible: boolean;
  mode: "create" | "edit";
  locationInfo?: LocationInfo | null;
  onClose: () => void;
  onSuccess: () => void;
}

const LocationInfoModal = ({
  visible,
  mode,
  locationInfo,
  onClose,
  onSuccess,
}: LocationInfoModalProps) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [strictInput, setStrictInput] = useState("");
  const [strictList, setStrictList] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<{ name?: string }>({});

  // Create location info
  const { loading: creating, run: createLocationInfo } = useRequest(
    async (data: CreateLocationInfoDto) => {
      return await locationInfoService.createLocationInfo(data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo khu vực thành công!");
        onSuccess();
      },
      onError: (error) => {
        console.error("Error creating location info:", error);
        message.error("Không thể tạo khu vực!");
      },
    },
  );

  // Update location info
  const { loading: updating, run: updateLocationInfo } = useRequest(
    async (id: string, data: CreateLocationInfoDto) => {
      return await locationInfoService.updateLocationInfo(id, data);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật khu vực thành công!");
        onSuccess();
      },
      onError: (error) => {
        console.error("Error updating location info:", error);
        message.error("Không thể cập nhật khu vực!");
      },
    },
  );

  // Handle form submit
  const handleSubmit = async () => {
    try {
      // Get current form values first
      const currentValues = form.getFieldsValue() as { name?: string };

      // Check if name field is empty before validation
      if (!currentValues.name || currentValues.name.trim().length === 0) {
        message.error("Vui lòng nhập tên khu vực!");
        form.setFields([
          { name: "name", errors: ["Vui lòng nhập tên khu vực!"] },
        ]);
        return;
      }

      // Validate all form fields
      const values = (await form.validateFields()) as { name: string };

      // Double-check validation: ensure name is not empty or just whitespace
      if (!values.name || values.name.trim().length === 0) {
        message.error("Vui lòng nhập tên khu vực!");
        return;
      }

      // Ensure minimum length
      if (values.name.trim().length < 2) {
        message.error("Tên khu vực phải có ít nhất 2 ký tự!");
        return;
      }

      if (mode === "create") {
        createLocationInfo({
          name: values.name.trim(),
          strict: strictList.length > 0 ? strictList : undefined,
          image:
            fileList.length > 0 && fileList[0]?.originFileObj
              ? fileList[0].originFileObj
              : undefined,
        } as unknown as CreateLocationInfoDto);
      } else if (locationInfo) {
        updateLocationInfo(locationInfo.id, {
          name: values.name.trim(),
          strict: strictList.length > 0 ? strictList : undefined,
          image:
            fileList.length > 0 && fileList[0]?.originFileObj
              ? fileList[0].originFileObj
              : undefined,
        } as unknown as CreateLocationInfoDto);
      }
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Vui lòng kiểm tra lại thông tin đã nhập!");
    }
  };

  // Handle file upload
  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  // Handle strict input
  const handleStrictAdd = () => {
    if (strictInput.trim() && !strictList.includes(strictInput.trim())) {
      setStrictList([...strictList, strictInput.trim()]);
      setStrictInput("");
    }
  };

  const handleStrictRemove = (index: number) => {
    setStrictList(strictList.filter((_, i) => i !== index));
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (mode === "edit" && locationInfo) {
        const initialValues = {
          name: locationInfo.name,
        };
        form.setFieldsValue(initialValues);
        setFormValues(initialValues);

        // Set strict list with debugging
        const existingStrict = locationInfo.strict ?? [];
        setStrictList(existingStrict);

        if (locationInfo.imageURL) {
          setFileList([
            {
              uid: "1",
              name: "image.jpg",
              status: "done",
              url: locationInfo.imageURL,
            },
          ]);
        }
      } else {
        form.resetFields();
        setFormValues({});
        setFileList([]);
        setStrictList([]);
        setStrictInput("");
      }
    }
  }, [visible, mode, locationInfo, form]);

  const isLoading = creating || updating;

  // Check if form is valid for submit button
  const isFormValid =
    formValues.name &&
    formValues.name.trim().length >= 2 &&
    formValues.name.trim().length <= 100;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>
            {mode === "create" ? "Thêm khu vực mới" : "Chỉnh sửa khu vực"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={!isFormValid || isLoading}
        >
          {mode === "create" ? "Tạo khu vực" : "Cập nhật"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-4"
        onValuesChange={(changedValues, allValues) => {
          setFormValues(allValues as { name?: string });
        }}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<Text className="font-medium">Tên khu vực</Text>}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên khu vực!",
            },
            {
              min: 2,
              message: "Tên khu vực phải có ít nhất 2 ký tự!",
            },
            {
              max: 100,
              message: "Tên khu vực không được vượt quá 100 ký tự!",
            },
            {
              validator: (_, value: string) => {
                if (!value || value.trim().length === 0) {
                  return Promise.reject(
                    new Error("Tên khu vực không được để trống!"),
                  );
                }
                if (value.trim().length < 2) {
                  return Promise.reject(
                    new Error("Tên khu vực phải có ít nhất 2 ký tự!"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Nhập tên khu vực..."
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label={<Text className="font-medium">Ảnh đại diện</Text>}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            maxCount={1}
            accept="image/*"
            className="w-full"
          >
            {fileList.length >= 1 ? null : (
              <div className="text-center">
                <UploadIcon className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-600">Tải lên ảnh</div>
              </div>
            )}
          </Upload>
          <Text className="mt-2 block text-xs text-gray-500">
            Hỗ trợ định dạng: JPG, PNG, GIF. Kích thước tối đa: 5MB
          </Text>
        </Form.Item>

        {/* Strict Areas */}
        <Form.Item label={<Text className="font-medium">Các khu vực con</Text>}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tên khu vực con..."
                value={strictInput}
                onChange={(e) => setStrictInput(e.target.value)}
                onPressEnter={handleStrictAdd}
                size="large"
                className="rounded-lg"
              />
              <Button
                type="primary"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleStrictAdd}
                disabled={!strictInput.trim()}
              >
                Thêm
              </Button>
            </div>

            {strictList.length > 0 && (
              <div className="space-y-2">
                <Text className="text-sm text-gray-600">
                  Các khu vực con ({strictList.length}):
                </Text>
                <div className="flex flex-wrap gap-2">
                  {strictList.map((item, index) => (
                    <Tag
                      key={index}
                      closable
                      onClose={() => handleStrictRemove(index)}
                      color="blue"
                      className="text-sm"
                    >
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Text className="mt-2 block text-xs text-gray-500">
            Thêm các khu vực con thuộc về khu vực này (ví dụ: quận, huyện,
            phường)
          </Text>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LocationInfoModal;
