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
  Switch,
  Button,
  Upload,
  Divider,
  Typography,
  App,
  Progress,
  Spin,
  Tooltip,
} from "antd";
import {
  Building2,
  Home,
  Bath,
  Bed,
  Save,
  Upload as UploadIcon,
  Plus,
  Camera,
  X,
  Shield,
  Utensils,
  Car,
  Snowflake,
  Tv,
  Wifi,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { CreatePropertyDto } from "@/@types/gentype-axios";
import type { PropertyType, LocationInfo } from "@/@types/types";
import { useRequest } from "ahooks";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";
import MapboxLocationSelector from "@/components/business/common/mapbox-location-selector";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import locationInfoService from "@/share/service/location-info.service";
import uploadService from "@/share/service/upload.service";
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
  const [locationInfos, setLocationInfos] = useState<LocationInfo[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "rent" | "sale" | "project"
  >("sale");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    country?: string;
  } | null>(null);

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

  // Load location infos
  const { loading: loadingLocations, run: fetchLocationInfos } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo();
      return response.data;
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (Array.isArray(data)) {
          setLocationInfos(data);
        } else {
          console.warn("Location infos data is not an array:", data);
          setLocationInfos([]);
        }
      },
      onError: (error) => {
        console.error("Error loading location infos:", error);
        message.error("Không thể tải danh sách địa điểm");
        setLocationInfos([]);
      },
    },
  );

  useEffect(() => {
    fetchPropertyTypes();
    fetchLocationInfos();
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
      locationInfoId: string;
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
      content?: (
        | { type: "heading"; text: string; level?: 1 | 2 | 3 }
        | { type: "paragraph"; text: string }
        | { type: "image"; url: string; caption?: string }
      )[];
    }) => {
      if (!mainImageFile) {
        throw new Error("Vui lòng tải lên ảnh chính");
      }

      const userId = user?.id;
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Use already uploaded image URLs
      if (!mainImageUrl && mainImageFile) {
        throw new Error("Ảnh chính chưa được tải lên thành công");
      }

      if (imageUrls.length !== imageFiles.length) {
        throw new Error("Một số ảnh phụ chưa được tải lên thành công");
      }

      const formData: CreatePropertyDto = {
        typeId: values.typeId,
        locationInfoId: values.locationInfoId,
        title: values.title,
        description: values.description,
        price: values.price,
        legalStatus: values.legalStatus,
        location: locationData ?? undefined,
        transactionType: values.transactionType,
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
          content: values.content ?? [],
        },
        mainImage: mainImageUrl ?? undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      return await propertyService.createProperty(formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo tin đăng thành công!");
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error("Failed to submit form:", error);
        message.error("Không thể tạo tin đăng");
      },
    },
  );

  const handleSubmit = (values: {
    typeId: string;
    locationInfoId: string;
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
    locationText?: string;
    transactionType: "rent" | "sale" | "project";
  }) => {
    if (selectedTransactionType !== "project" && !mainImageUrl) {
      message.error("Vui lòng tải lên ảnh chính");
      return;
    }
    if (selectedTransactionType !== "project" && imageUrls.length < 3) {
      message.error("Vui lòng tải lên ít nhất 3 ảnh phụ");
      return;
    }
    if (!locationData) {
      message.error("Vui lòng chọn vị trí trên bản đồ");
      return;
    }
    submitForm(values);
  };

  const handleMainImageUpload = async (file: File) => {
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
    setUploadingMainImage(true);

    try {
      const result = await uploadService.uploadImage(file);
      setMainImageUrl(result.url);
      message.success("Tải lên ảnh chính thành công!");
    } catch (error) {
      console.error("Failed to upload main image:", error);
      message.error("Không thể tải lên ảnh chính");
      setMainImageFile(null);
    } finally {
      setUploadingMainImage(false);
    }

    return false;
  };

  const handleImagesUpload = async (file: File) => {
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

    const newIndex = imageFiles.length;
    setImageFiles([...imageFiles, file]);
    setUploadingImages([...uploadingImages, true]);

    try {
      const result = await uploadService.uploadImage(file);
      setImageUrls([...imageUrls, result.url]);
      message.success(`Tải lên ảnh ${newIndex + 1} thành công!`);
    } catch (error) {
      console.error("Failed to upload image:", error);
      message.error(`Không thể tải lên ảnh ${newIndex + 1}`);
      // Remove the failed file
      setImageFiles(imageFiles.filter((_, i) => i !== newIndex));
    } finally {
      setUploadingImages(uploadingImages.filter((_, i) => i !== newIndex));
    }

    return false;
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImageUrl(null);
  };

  const handleTransactionTypeChange = (value: "rent" | "sale" | "project") => {
    setSelectedTransactionType(value);
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
            <div className="space-y-2">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <Title
                  level={3}
                  className="!mb-0 !text-xl !font-semibold !text-gray-900"
                >
                  Thông tin cơ bản
                </Title>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Form.Item
                  name="title"
                  label={<Text className="font-medium">Tiêu đề tin đăng</Text>}
                  rules={[
                    { required: true, message: "Vui lòng nhập tiêu đề!" },
                    { min: 10, message: "Tiêu đề phải có ít nhất 10 ký tự!" },
                    {
                      max: 200,
                      message: "Tiêu đề không được vượt quá 200 ký tự!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tiêu đề tin đăng..."
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
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

                <Form.Item
                  name="legalStatus"
                  label={
                    <Text className="font-medium">Tình trạng pháp lý</Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tình trạng pháp lý!",
                    },
                    {
                      min: 5,
                      message: "Tình trạng pháp lý phải có ít nhất 5 ký tự!",
                    },
                    {
                      max: 100,
                      message:
                        "Tình trạng pháp lý không được vượt quá 100 ký tự!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập tình trạng pháp lý..."
                    size="large"
                    className="rounded-lg"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                <Form.Item
                  name="price"
                  label={<Text className="font-medium">Giá (USD$)</Text>}
                  rules={[
                    { required: true, message: "Vui lòng nhập giá!" },
                    { type: "number", min: 1, message: "Giá phải lớn hơn 0!" },
                    {
                      type: "number",
                      max: 10000000,
                      message: "Giá không được vượt quá 10,000,000 USD!",
                    },
                  ]}
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
                    {
                      type: "number",
                      min: 1,
                      message: "Diện tích phải lớn hơn 0!",
                    },
                    {
                      type: "number",
                      max: 10000,
                      message: "Diện tích không được vượt quá 10,000 m²!",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    placeholder="0"
                    size="large"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                {selectedTransactionType !== "project" && (
                  <>
                    <Form.Item
                      name="bedrooms"
                      label={
                        <span className="flex items-center gap-1 font-medium">
                          <Bed className="h-4 w-4" />
                          Phòng ngủ
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số phòng ngủ!",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Số phòng ngủ không được âm!",
                        },
                        {
                          type: "number",
                          max: 20,
                          message: "Số phòng ngủ không được vượt quá 20!",
                        },
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
                      name="bathrooms"
                      label={
                        <span className="flex items-center gap-1 font-medium">
                          <Bath className="h-4 w-4" />
                          Phòng tắm
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số phòng tắm!",
                        },
                        {
                          type: "number",
                          min: 0,
                          message: "Số phòng tắm không được âm!",
                        },
                        {
                          type: "number",
                          max: 10,
                          message: "Số phòng tắm không được vượt quá 10!",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        placeholder="0"
                        size="large"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </>
                )}
              </div>

              {selectedTransactionType !== "project" && (
                <>
                  <div className="mb-2 flex items-center gap-3 border-b border-gray-200 pb-2">
                    <Title
                      level={3}
                      className="!mb-0 !text-xl !font-semibold !text-gray-900"
                    >
                      Tiện ích
                    </Title>
                  </div>
                  <div className="grid grid-cols-3 justify-center gap-4 lg:grid-cols-6">
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
                </>
              )}

              <Form.Item
                name="description"
                label={<Text className="font-medium">Mô tả ngắn</Text>}
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả!" },
                  { min: 20, message: "Mô tả phải có ít nhất 20 ký tự!" },
                  {
                    max: 2000,
                    message: "Mô tả không được vượt quá 2000 ký tự!",
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Mô tả ngắn gọn về bất động sản, tiện ích xung quanh, hướng nhà, view..."
                  className="rounded-lg"
                />
              </Form.Item>
              {/* Project Content Builder */}

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                  <Title
                    level={3}
                    className="!mb-0 !text-xl !font-semibold !text-gray-900"
                  >
                    Nội dung bất động sản
                  </Title>
                </div>
                <Form.Item
                  name="content"
                  rules={[
                    {
                      validator: (_: unknown, value: unknown) => {
                        if (selectedTransactionType === "project") {
                          if (!Array.isArray(value) || value.length === 0) {
                            return Promise.reject(
                              new Error(
                                "Vui lòng thêm ít nhất 1 nội dung cho dự án!",
                              ),
                            );
                          }
                          if (value.length < 1) {
                            return Promise.reject(
                              new Error("Vui lòng thêm ít nhất 1 nội dung!"),
                            );
                          }
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <ProjectContentBuilder
                    form={form}
                    name="content"
                    textFieldName="value"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <Form.Item
                label={<Text className="font-medium">Vị trí trên bản đồ</Text>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn khu vực và vị trí trên bản đồ!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(
                          new Error("Vui lòng chọn khu vực!"),
                        );
                      }
                      if (!locationData) {
                        return Promise.reject(
                          new Error("Vui lòng chọn vị trí trên bản đồ!"),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <MapboxLocationSelector
                  form={form}
                  value={locationData ?? undefined}
                  onChange={setLocationData}
                  placeholder="Chọn vị trí trên bản đồ"
                  locationInfos={locationInfos}
                  selectedLocationInfoId={
                    form.getFieldValue("locationInfoId") as string
                  }
                  onLocationInfoChange={(locationInfoId) => {
                    form.setFieldValue("locationInfoId", locationInfoId);
                  }}
                  loadingLocations={loadingLocations}
                  mode="create"
                  hasExistingLocation={false}
                />
              </Form.Item>
            </div>

            {/* Images */}
            {selectedTransactionType !== "project" && (
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
                  <div className="flex items-center gap-2">
                    <Text className="font-medium">Ảnh chính *</Text>
                    {mainImageUrl && (
                      <Tooltip title="Ảnh đã tải lên thành công">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Tooltip>
                    )}
                  </div>
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
                        {uploadingMainImage && (
                          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                            <div className="text-center text-white">
                              <Spin size="large" />
                              <div className="mt-2 text-sm">
                                Đang tải lên...
                              </div>
                            </div>
                          </div>
                        )}
                        {mainImageUrl && !uploadingMainImage && (
                          <div className="absolute top-2 right-2">
                            <Tooltip title="Tải lên thành công">
                              <CheckCircle className="h-6 w-6 rounded-full bg-white text-green-500" />
                            </Tooltip>
                          </div>
                        )}
                        <div className="absolute -right-3 -bottom-3">
                          <Button
                            danger
                            onClick={removeMainImage}
                            size="small"
                            shape="circle"
                            disabled={uploadingMainImage}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Upload
                        beforeUpload={handleMainImageUpload}
                        showUploadList={false}
                        disabled={uploadingMainImage}
                      >
                        <div className="space-y-2">
                          {uploadingMainImage ? (
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
                          ) : (
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                          )}
                          <Text className="block text-gray-600">
                            {uploadingMainImage
                              ? "Đang tải lên..."
                              : "Tải lên ảnh chính"}
                          </Text>
                          <Text className="block text-sm text-gray-500">
                            JPG, PNG, GIF tối đa 5MB
                          </Text>
                          <Text className="block text-xs text-gray-400">
                            Kéo thả hoặc click để chọn
                          </Text>
                        </div>
                      </Upload>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Text className="font-medium">
                        Ảnh phụ (tối đa 9 ảnh)
                      </Text>
                      {imageUrls.length > 0 && (
                        <Tooltip
                          title={`${imageUrls.length} ảnh đã tải lên thành công`}
                        >
                          <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">
                              {imageUrls.length}
                            </span>
                          </div>
                        </Tooltip>
                      )}
                    </div>
                    <Text className="text-sm text-gray-500">
                      {imageFiles.length}/9 ảnh
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative size-24 rounded-lg">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Image ${index + 1}`}
                          className="size-24 rounded-lg object-cover"
                          width={100}
                          height={100}
                        />
                        {uploadingImages[index] && (
                          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                            <Spin size="small" />
                          </div>
                        )}
                        {imageUrls[index] && !uploadingImages[index] && (
                          <div className="absolute top-1 right-1">
                            <Tooltip title="Tải lên thành công">
                              <CheckCircle className="h-4 w-4 rounded-full bg-white text-green-500" />
                            </Tooltip>
                          </div>
                        )}
                        <div className="absolute -top-2 -right-2">
                          <Button
                            danger
                            shape="circle"
                            size="small"
                            onClick={() => removeImage(index)}
                            disabled={uploadingImages[index]}
                            className="h-6 w-6"
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {imageFiles.length < 9 && (
                      <Upload
                        beforeUpload={handleImagesUpload}
                        showUploadList={false}
                        disabled={uploadingImages.some(
                          (uploading) => uploading,
                        )}
                      >
                        <div className="flex size-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-400">
                          {uploadingImages.some((uploading) => uploading) ? (
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                          ) : (
                            <Plus className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </Upload>
                    )}
                  </div>
                  {imageFiles.length > 0 && (
                    <div className="mt-2">
                      <Progress
                        percent={Math.round(
                          (imageUrls.length / imageFiles.length) * 100,
                        )}
                        size="small"
                        status={
                          imageUrls.length === imageFiles.length
                            ? "success"
                            : "active"
                        }
                        showInfo={false}
                      />
                      <Text className="mt-1 block text-xs text-gray-500">
                        {imageUrls.length}/{imageFiles.length} ảnh đã tải lên
                      </Text>
                    </div>
                  )}
                </div>
                <Divider />
              </div>
            )}

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
