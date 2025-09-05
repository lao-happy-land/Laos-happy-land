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
import {
  Plus,
  Save,
  ArrowLeft,
  Wifi,
  Tv,
  Snowflake,
  Car,
  Utensils,
  Shield,
} from "lucide-react";
import type { UploadFile, UploadProps } from "antd";
import { useRequest } from "ahooks";
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
} from "@/@types/gentype-axios";
import type { PropertyType, Property } from "@/@types/types";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";
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
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "rent" | "sale" | "project"
  >("sale");
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const { loading: propertyTypesLoading, run: fetchPropertyTypes } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: selectedTransactionType,
      });
      return response;
    },
    {
      manual: true,
      onSuccess: (response) => {
        setPropertyTypes(response.data ?? []);
      },
      onError: (error) => {
        console.error("Failed to fetch property types:", error);
        message.error("Không thể tải danh sách loại bất động sản");
      },
    },
  );

  useEffect(() => {
    fetchPropertyTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransactionType]);

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
      setSelectedTransactionType(currentProperty.transactionType);
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
        wifi: currentProperty.details?.wifi ?? false,
        tv: currentProperty.details?.tv ?? false,
        airConditioner: currentProperty.details?.airConditioner ?? false,
        parking: currentProperty.details?.parking ?? false,
        kitchen: currentProperty.details?.kitchen ?? false,
        security: currentProperty.details?.security ?? false,
        content: currentProperty.details?.content ?? undefined,
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
      wifi: boolean;
      tv: boolean;
      airConditioner: boolean;
      parking: boolean;
      kitchen?: boolean;
      security?: boolean;
      content?: (
        | { type: "heading"; text: string; level?: 1 | 2 | 3 }
        | { type: "paragraph"; text: string }
        | { type: "image"; url: string; caption?: string }
      )[];
      legalStatus?: string;
      location?: string;
      transactionType: "rent" | "sale" | "project";
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
          wifi: values.wifi ?? false,
          tv: values.tv ?? false,
          airConditioner: values.airConditioner ?? false,
          parking: values.parking ?? false,
          kitchen: values.kitchen ?? false,
          security: values.security ?? false,
          content:
            values.transactionType === "project"
              ? (values.content ?? [])
              : undefined,
        },
        legalStatus: values.legalStatus,
        location: values.location,
        transactionType: values.transactionType,
      };

      // Handle main image
      if (mainImageList.length > 0 && mainImageList[0]?.originFileObj) {
        (formData as CreatePropertyDto).mainImage =
          mainImageList[0].originFileObj;
      }

      // Handle additional images
      const imageFiles = imagesList
        .filter((file) => file.originFileObj)
        .map((file) => file.originFileObj as File);
      if (imageFiles.length > 0) {
        (formData as CreatePropertyDto).images = imageFiles;
      }

      if (mode === "create") {
        const createData = formData as CreatePropertyDto;
        const userId = useAuthStore.getState().user?.id;

        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }

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
    wifi: boolean;
    tv: boolean;
    airConditioner: boolean;
    parking: boolean;
    kitchen: boolean;
    security: boolean;
    legalStatus?: string;
    location?: string;
    transactionType: "rent" | "sale" | "project";
  }) => {
    if (selectedTransactionType !== "project") {
      if (mainImageList.length < 1) {
        message.error("Vui lòng tải lên ảnh chính");
        return;
      }
      if (imagesList.length < 3) {
        message.error("Vui lòng tải lên ít nhất 3 ảnh phụ");
        return;
      }
    }
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

  const handleTransactionTypeChange = (value: "rent" | "sale" | "project") => {
    setSelectedTransactionType(value);
    // Clear the selected property type when transaction type changes
    form.setFieldsValue({ typeId: undefined });
  };

  if (propertyLoading) {
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
        scrollToFirstError
        initialValues={{ transactionType: "sale" }}
        className="space-y-6"
      >
        <Row gutter={24}>
          <Col span={24}>
            <Card title="Thông tin cơ bản" className="mb-6">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="transactionType"
                    label="Hình thức"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn hình thức",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn hình thức"
                      onChange={handleTransactionTypeChange}
                    >
                      <Option value="sale">Bán</Option>
                      <Option value="rent">Cho thuê</Option>
                      <Option value="project">Dự án</Option>
                    </Select>
                  </Form.Item>
                </Col>
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
                    <Select
                      placeholder="Chọn loại bất động sản"
                      loading={propertyTypesLoading}
                    >
                      {propertyTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
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

              <Form.Item name="location" label="Địa chỉ">
                <Input placeholder="Nhập địa chỉ bất động sản" />
              </Form.Item>

              <Form.Item name="description" label="Mô tả chi tiết">
                <TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về bất động sản"
                />
              </Form.Item>
              {selectedTransactionType === "project" && (
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={24}>
                    <Card type="inner" title="Nội dung dự án">
                      <ProjectContentBuilder
                        form={form}
                        name="content"
                        textFieldName="value"
                      />
                    </Card>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>

          <Col span={24} style={{ marginTop: 16 }}>
            <Card title="Chi tiết bất động sản" className="mb-6">
              <div
                className={`grid grid-cols-1 gap-4 ${selectedTransactionType === "project" ? "md:grid-cols-3" : "md:grid-cols-6"}`}
              >
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

                <Form.Item name="area" label="Diện tích (m²)">
                  <InputNumber
                    placeholder="Nhập diện tích"
                    style={{ width: "100%" }}
                    min={0}
                  />
                </Form.Item>

                <Form.Item name="legalStatus" label="Tình trạng pháp lý">
                  <Input placeholder="Ví dụ: Sổ hồng đầy đủ" />
                </Form.Item>

                {selectedTransactionType !== "project" && (
                  <>
                    <Form.Item name="bedrooms" label="Số phòng ngủ">
                      <InputNumber
                        placeholder="Số phòng ngủ"
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>

                    <Form.Item name="bathrooms" label="Số phòng tắm">
                      <InputNumber
                        placeholder="Số phòng tắm"
                        style={{ width: "100%" }}
                        min={0}
                      />
                    </Form.Item>
                  </>
                )}
              </div>

              {selectedTransactionType !== "project" && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Card type="inner" title="Tiện ích">
                      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
                        <Form.Item
                          name="wifi"
                          label={
                            <p className="flex items-center gap-1 font-medium text-green-600">
                              <Wifi className="h-4 w-4" /> WiFi
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="tv"
                          label={
                            <p className="flex items-center gap-1 font-medium text-red-600">
                              <Tv className="h-4 w-4" /> TV
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="airConditioner"
                          label={
                            <p className="flex items-center gap-1 font-medium text-blue-600">
                              <Snowflake className="h-4 w-4" /> Điều hòa
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="parking"
                          label={
                            <p className="flex items-center gap-1 font-medium text-orange-600">
                              <Car className="h-4 w-4" /> Bãi đỗ xe
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="kitchen"
                          label={
                            <p className="flex items-center gap-1 font-medium text-pink-600">
                              <Utensils className="h-4 w-4" /> Nhà bếp
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          name="security"
                          label={
                            <p className="flex items-center gap-1 font-medium text-green-600">
                              <Shield className="h-4 w-4" /> An ninh
                            </p>
                          }
                          valuePropName="checked"
                        >
                          <Switch />
                        </Form.Item>
                      </div>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>

          {selectedTransactionType !== "project" && (
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
          )}
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
