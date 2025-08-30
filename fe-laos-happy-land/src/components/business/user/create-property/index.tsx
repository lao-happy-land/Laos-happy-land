"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import {
  Card,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  Divider,
  Typography,
  App,
} from "antd";
import {
  Building2,
  MapPin,
  DollarSign,
  Home,
  Bath,
  Bed,
  Save,
  Upload as UploadIcon,
  Plus,
  Camera,
  X,
} from "lucide-react";
import type { CreatePropertyDto } from "@/@types/gentype-axios";
import type { PropertyType } from "@/@types/types";
import { useRequest } from "ahooks";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import Image from "next/image";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function CreateProperty() {
  const { message } = App.useApp();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "rent" | "sale" | "project"
  >("sale");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Load property types
  const { loading: loadingTypes, run: fetchPropertyTypes } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: selectedTransactionType,
      });
      return response.data;
    },
    {
      manual: true,
      onSuccess: (data) => {
        setPropertyTypes(data);
      },
      onError: () => {
        message.error("Không thể tải danh sách loại bất động sản");
      },
    },
  );

  useEffect(() => {
    fetchPropertyTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransactionType]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/create-property");
    }
  }, [isAuthenticated, router]);

  const { loading: submitting, run: submitForm } = useRequest(
    async (values: {
      typeId: string;
      title: string;
      description?: string;
      price?: number;
      area?: number;
      bedrooms?: number;
      bathrooms?: number;
      legalStatus?: string;
      location?: string;
      transactionType: "rent" | "sale" | "project";
    }) => {
      if (!mainImageFile) {
        throw new Error("Vui lòng tải lên ảnh chính");
      }

      const userId = user?.id;
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const formData: CreatePropertyDto = {
        typeId: values.typeId,
        title: values.title,
        description: values.description,
        price: values.price,
        legalStatus: values.legalStatus,
        location: values.location,
        transactionType: values.transactionType,
        details: {
          area: values.area,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
        },
        mainImage: mainImageFile,
        images: imageFiles,
      };

      return await propertyService.createProperty(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo tin đăng thành công!");
        router.push("/");
      },
      onError: (error) => {
        console.error("Failed to submit form:", error);
        message.error("Không thể tạo tin đăng");
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
    legalStatus?: string;
    location?: string;
    transactionType: "rent" | "sale" | "project";
  }) => {
    if (!mainImageFile) {
      message.error("Vui lòng tải lên ảnh chính");
      return;
    }
    submitForm(values);
  };

  const handleMainImageUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể tải lên file hình ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    setMainImageFile(file);
    return false; // Prevent default upload
  };

  const handleImagesUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể tải lên file hình ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    if (imageFiles.length >= 9) {
      message.error("Chỉ có thể tải lên tối đa 9 ảnh phụ!");
      return false;
    }
    setImageFiles([...imageFiles, file]);
    return false; // Prevent default upload
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
  };

  const handleTransactionTypeChange = (value: "rent" | "sale" | "project") => {
    setSelectedTransactionType(value);
    // Clear the selected property type when transaction type changes
    form.setFieldsValue({ typeId: undefined });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <Title
            level={1}
            className="!mb-2 !text-3xl !font-bold !text-gray-900"
          >
            Đăng tin bất động sản
          </Title>
          <Text className="text-lg text-gray-600">
            Chia sẻ thông tin bất động sản của bạn với cộng đồng
          </Text>
        </div>

        <Card className="border-0 shadow-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-8"
            initialValues={{
              transactionType: "sale",
            }}
          >
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <Title
                  level={3}
                  className="!mb-0 !text-xl !font-semibold !text-gray-900"
                >
                  Thông tin cơ bản
                </Title>
              </div>

              <Form.Item
                name="title"
                label={<Text className="font-medium">Tiêu đề tin đăng</Text>}
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              >
                <Input
                  placeholder="Nhập tiêu đề tin đăng..."
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Form.Item
                  name="transactionType"
                  label={<Text className="font-medium">Loại giao dịch</Text>}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn loại giao dịch!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại giao dịch"
                    size="large"
                    className="rounded-lg"
                    onChange={handleTransactionTypeChange}
                    loading={loadingTypes}
                  >
                    <Option value="sale">Bán</Option>
                    <Option value="rent">Cho thuê</Option>
                    <Option value="project">Dự án</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="typeId"
                  label={<Text className="font-medium">Loại bất động sản</Text>}
                  rules={[
                    { required: true, message: "Vui lòng chọn loại BĐS!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại bất động sản"
                    size="large"
                    className="rounded-lg"
                    loading={loadingTypes}
                  >
                    {propertyTypes.map((type) => (
                      <Option key={type.id} value={type.id}>
                        {type.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <MapPin className="h-6 w-6 text-green-600" />
                <Title
                  level={3}
                  className="!mb-0 !text-xl !font-semibold !text-gray-900"
                >
                  Vị trí
                </Title>
              </div>

              <Form.Item
                name="location"
                label={<Text className="font-medium">Địa chỉ chi tiết</Text>}
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input
                  placeholder="Nhập địa chỉ chi tiết..."
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* Price and Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <DollarSign className="h-6 w-6 text-yellow-600" />
                <Title
                  level={3}
                  className="!mb-0 !text-xl !font-semibold !text-gray-900"
                >
                  Giá và thông tin chi tiết
                </Title>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <Form.Item
                  name="price"
                  label={<Text className="font-medium">Giá (VNĐ)</Text>}
                  rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
                >
                  <InputNumber
                    placeholder="Nhập giá..."
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) => {
                      const parsed = value?.replace(/[^\d]/g, "");
                      return parsed ? Number(parsed) : 0;
                    }}
                    min={0}
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="area"
                  label={
                    <span className="flex items-center gap-1 font-medium">
                      <Home className="h-4 w-4" />
                      Diện tích (m²)
                    </span>
                  }
                  rules={[
                    { required: true, message: "Vui lòng nhập diện tích!" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="bedrooms"
                  label={
                    <span className="flex items-center gap-1 font-medium">
                      <Bed className="h-4 w-4" />
                      Phòng ngủ
                    </span>
                  }
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  name="bathrooms"
                  label={
                    <span className="flex items-center gap-1 font-medium">
                      <Bath className="h-4 w-4" />
                      Phòng tắm
                    </span>
                  }
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </div>

              <Form.Item
                name="legalStatus"
                label={<Text className="font-medium">Tình trạng pháp lý</Text>}
              >
                <Select
                  placeholder="Chọn tình trạng pháp lý"
                  size="large"
                  className="rounded-lg"
                  allowClear
                >
                  <Option value="Sổ hồng đầy đủ">Sổ hồng đầy đủ</Option>
                  <Option value="Sổ hồng riêng">Sổ hồng riêng</Option>
                  <Option value="Sổ đỏ">Sổ đỏ</Option>
                  <Option value="Đang hoàn thiện">Đang hoàn thiện</Option>
                  <Option value="Chưa có sổ">Chưa có sổ</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="description"
                label={<Text className="font-medium">Mô tả chi tiết</Text>}
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Mô tả chi tiết về bất động sản, tiện ích xung quanh, hướng nhà, view..."
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <Camera className="h-6 w-6 text-purple-600" />
                <Title
                  level={3}
                  className="!mb-0 !text-xl !font-semibold !text-gray-900"
                >
                  Hình ảnh
                </Title>
              </div>

              {/* Main Image */}
              <div className="space-y-4">
                <Text className="font-medium">Ảnh chính *</Text>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-blue-400">
                  {mainImageFile ? (
                    <div className="relative h-64 w-full">
                      <Image
                        src={URL.createObjectURL(mainImageFile)}
                        alt="Main"
                        className="h-64 w-full rounded-lg object-cover object-center"
                        width={128}
                        height={128}
                      />
                      <div className="absolute -right-3 -bottom-3">
                        <Button
                          danger
                          onClick={removeMainImage}
                          size="small"
                          shape="circle"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      beforeUpload={handleMainImageUpload}
                      showUploadList={false}
                    >
                      <div className="space-y-2">
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <Text className="block text-gray-600">
                          Tải lên ảnh chính
                        </Text>
                        <Text className="block text-sm text-gray-500">
                          JPG, PNG, GIF tối đa 5MB
                        </Text>
                      </div>
                    </Upload>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div className="space-y-4">
                <Text className="font-medium">Ảnh phụ (tối đa 9 ảnh)</Text>
                <div className="flex flex-wrap gap-6">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative size-24 rounded-lg">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="size-24 rounded-lg object-cover"
                        width={100}
                        height={100}
                      />
                      <div className="absolute -right-3 -bottom-3">
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          onClick={() => removeImage(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {imageFiles.length < 9 && (
                    <Upload
                      beforeUpload={handleImagesUpload}
                      showUploadList={false}
                    >
                      <div className="flex size-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                    </Upload>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="default"
                size="large"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save />}
                size="large"
                loading={submitting}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Đăng tin
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
