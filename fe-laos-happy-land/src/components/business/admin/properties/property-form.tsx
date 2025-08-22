"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  message,
  Spin,
} from "antd";
import { Plus, Save, ArrowLeft } from "lucide-react";
import type { UploadFile, UploadProps } from "antd";
import { useRequest } from "ahooks";
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
} from "@/@types/gentype-axios";
import type { PropertyType, Property } from "@/@types/types";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import { useAuthStore } from "@/share/store/auth.store";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PropertyFormProps {
  propertyId?: string;
  mode: "create" | "edit";
}

const PropertyForm = ({ propertyId, mode }: PropertyFormProps) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [mainImageList, setMainImageList] = useState<UploadFile[]>([]);
  const [imagesList, setImagesList] = useState<UploadFile[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const { loading: propertyTypesLoading } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes();
      return response;
    },
    {
      onSuccess: (response) => {
        setPropertyTypes(response.data ?? []);
      },
      onError: (error) => {
        console.error("Failed to fetch property types:", error);
        message.error("Không thể tải danh sách loại bất động sản");
      },
    },
  );

  const { loading: propertyLoading } = useRequest(
    async () => {
      if (mode === "edit" && propertyId) {
        return await propertyService.getPropertyById(propertyId);
      }
      return null;
    },
    {
      ready: mode === "edit" && !!propertyId,
      manual: false,
      refreshDeps: [propertyId, mode],
      onSuccess: (property) => {
        if (property) {
          setCurrentProperty(property);

          if (property.mainImage) {
            setMainImageList([
              {
                uid: "-1",
                name: "main-image",
                status: "done",
                url: property.mainImage,
              },
            ]);
          }

          if (property.images?.length) {
            const imageFiles = property.images.map((url, index) => ({
              uid: `-${index + 2}`,
              name: `image-${index + 1}`,
              status: "done" as const,
              url,
            }));
            setImagesList(imageFiles);
          }
        }
      },
      onError: (error) => {
        console.error("Failed to fetch property:", error);
        message.error("Không thể tải thông tin bất động sản");
      },
    },
  );

  useEffect(() => {
    if (currentProperty) {
      form.setFieldsValue({
        typeId: currentProperty.type?.id,
        title: currentProperty.title,
        description: currentProperty.description ?? undefined,
        price: currentProperty.price
          ? parseFloat(currentProperty.price)
          : undefined,
        area: currentProperty.details?.area ?? undefined,
        bedrooms: currentProperty.details?.bedrooms ?? undefined,
        bathrooms: currentProperty.details?.bathrooms ?? undefined,
        isVerified: currentProperty.isVerified ?? false,
        legalStatus: currentProperty.legalStatus ?? undefined,
        location: currentProperty.location ?? undefined,
        transactionType: currentProperty.transactionType,
      });
    }
  }, [currentProperty, form]);

  const { loading: submitting, run: submitForm } = useRequest(
    async (values: {
      typeId: string;
      title: string;
      description?: string;
      price?: number;
      area?: number;
      bedrooms?: number;
      bathrooms?: number;
      isVerified?: boolean;
      legalStatus?: string;
      location?: string;
      transactionType: "rent" | "sale";
    }) => {
      const formData: CreatePropertyDto | UpdatePropertyDto = {
        typeId: values.typeId,
        title: values.title,
        description: values.description,
        price: values.price,
        details: {
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
        },
        isVerified: values.isVerified,
        legalStatus: values.legalStatus,
        location: values.location,
        transactionType: values.transactionType,
      };

      if (mainImageList.length > 0 && mainImageList[0]?.originFileObj) {
        (formData as CreatePropertyDto).mainImage =
          mainImageList[0].originFileObj;
      }

      const imageFiles = imagesList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);
      if (imageFiles.length > 0) {
        (formData as CreatePropertyDto).images = imageFiles;
      }

      if (mode === "create") {
        const createData = formData as CreatePropertyDto;
        createData.user_id = useAuthStore.getState().user?.id ?? "";
        return await propertyService.createProperty(createData);
      } else {
        return await propertyService.updateProperty(propertyId!, formData);
      }
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(
          mode === "create"
            ? "Tạo tin đăng thành công!"
            : "Cập nhật tin đăng thành công!",
        );
        router.push("/admin/properties");
      },
      onError: (error) => {
        console.error("Failed to submit form:", error);
        message.error(
          mode === "create"
            ? "Không thể tạo tin đăng"
            : "Không thể cập nhật tin đăng",
        );
      },
    },
  );

  const handleSubmit = (values: {
    typeId: string;
    title: string;
    description?: string;
    price?: number;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    isVerified?: boolean;
    legalStatus?: string;
    location?: string;
    transactionType: "rent" | "sale";
  }) => {
    submitForm(values);
  };

  const handleMainImageChange: UploadProps["onChange"] = ({ fileList }) => {
    setMainImageList(fileList.slice(-1)); // Keep only the last file
  };

  const handleImagesChange: UploadProps["onChange"] = ({ fileList }) => {
    setImagesList(fileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể tải lên file hình ảnh!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
    }
    return false;
  };

  if (propertyTypesLoading || propertyLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="mb-2 text-gray-900">
              {mode === "create" ? "Thêm tin đăng mới" : "Chỉnh sửa tin đăng"}
            </Title>
            <Text className="text-lg text-gray-600">
              {mode === "create"
                ? "Tạo tin đăng bất động sản mới"
                : "Cập nhật thông tin tin đăng"}
            </Text>
          </Col>
          <Col>
            <Button
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push("/admin/properties")}
              size="large"
            >
              Quay lại
            </Button>
          </Col>
        </Row>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Card title="Thông tin cơ bản" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="typeId"
                    label="Loại bất động sản"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn loại bất động sản",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn loại bất động sản">
                      {propertyTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="transactionType"
                    label="Hình thức giao dịch"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn hình thức giao dịch",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn hình thức giao dịch">
                      <Option value="sale">Bán</Option>
                      <Option value="rent">Cho thuê</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="title"
                label="Tiêu đề tin đăng"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề tin đăng" />
              </Form.Item>

              <Form.Item name="description" label="Mô tả chi tiết">
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về bất động sản"
                />
              </Form.Item>

              <Form.Item name="location" label="Địa chỉ">
                <Input placeholder="Nhập địa chỉ bất động sản" />
              </Form.Item>
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Chi tiết bất động sản" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="price" label="Giá (LAK)">
                    <InputNumber
                      placeholder="Nhập giá"
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="area" label="Diện tích (m²)">
                    <InputNumber
                      placeholder="Nhập diện tích"
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="legalStatus" label="Tình trạng pháp lý">
                    <Input placeholder="Ví dụ: Sổ hồng đầy đủ" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item name="bedrooms" label="Số phòng ngủ">
                    <InputNumber
                      placeholder="Số phòng ngủ"
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="bathrooms" label="Số phòng tắm">
                    <InputNumber
                      placeholder="Số phòng tắm"
                      style={{ width: "100%" }}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="isVerified"
                    label="Trạng thái xác minh"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Hình ảnh" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Ảnh chính">
                    <Upload
                      listType="picture-card"
                      fileList={mainImageList}
                      onChange={handleMainImageChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                    >
                      {mainImageList.length < 1 && (
                        <div>
                          <Plus className="h-4 w-4" />
                          <div className="mt-2">Tải lên</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Ảnh phụ">
                    <Upload
                      listType="picture-card"
                      fileList={imagesList}
                      onChange={handleImagesChange}
                      beforeUpload={beforeUpload}
                      multiple
                    >
                      <div>
                        <Plus className="h-4 w-4" />
                        <div className="mt-2">Tải lên</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div className="flex justify-end gap-4">
          <Button onClick={() => router.push("/admin/properties")} size="large">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            icon={<Save className="h-4 w-4" />}
            size="large"
            className="border-blue-600 bg-blue-600 hover:border-blue-700 hover:bg-blue-700"
          >
            {mode === "create" ? "Tạo tin đăng" : "Cập nhật"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PropertyForm;
