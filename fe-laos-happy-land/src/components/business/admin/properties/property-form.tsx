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
  Typography,
  Spin,
  Divider,
  App,
  Progress,
  Tooltip,
} from "antd";
import {
  Plus,
  Save,
  Wifi,
  Tv,
  Snowflake,
  Car,
  Utensils,
  Shield,
  Building2,
  Home,
  Bath,
  Bed,
  Upload as UploadIcon,
  Camera,
  X,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useRequest } from "ahooks";
import type {
  CreatePropertyDto,
  UpdatePropertyDto,
} from "@/@types/gentype-axios";
import type { PropertyType, Property, LocationInfo } from "@/@types/types";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import locationInfoService from "@/share/service/location-info.service";
import uploadService from "@/share/service/upload.service";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";
import MapboxLocationSelector from "@/components/business/common/mapbox-location-selector";
import { useAuthStore } from "@/share/store/auth.store";
import Image from "next/image";
import type { LocationDto } from "@/@types/gentype-axios";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface PropertyFormProps {
  propertyId?: string;
  mode: "create" | "edit";
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
}

const PropertyForm = ({ propertyId, mode }: PropertyFormProps) => {
  const { message } = App.useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingMainImage, setExistingMainImage] = useState<string | null>(
    null,
  );
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "rent" | "sale" | "project"
  >("sale");
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationInfos, setLocationInfos] = useState<LocationInfo[]>([]);
  const [selectedLocationInfoId, setSelectedLocationInfoId] =
    useState<string>("");

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

      // Set location data if available
      if (currentProperty.location) {
        setLocationData({
          latitude: currentProperty.location.latitude,
          longitude: currentProperty.location.longitude,
          address: currentProperty.location.address,
          city: currentProperty.location.city,
          country: currentProperty.location.country,
        });
      }

      form.setFieldsValue({
        typeId: currentProperty.type?.id,
        title: currentProperty.title,
        description: currentProperty.description ?? undefined,
        price: currentProperty.price
          ? typeof currentProperty.price === "object" &&
            currentProperty.price !== null &&
            "USD" in currentProperty.price
            ? parseFloat(currentProperty.price.USD)
            : parseFloat(currentProperty.price.toString())
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
        transactionType: currentProperty.transactionType,
        locationInfoId: currentProperty.locationInfo?.id ?? "",
        location: currentProperty.location?.address ?? "",
      });

      setSelectedLocationInfoId(currentProperty.locationInfo?.id ?? "");

      // Set existing images
      setExistingMainImage(currentProperty.mainImage);
      setExistingImages(currentProperty.images ?? []);
    }
  }, [currentProperty, form]);

  // Set selectedLocationInfoId after locationInfos are loaded
  useEffect(() => {
    if (currentProperty?.locationInfo?.id && locationInfos.length > 0) {
      const locationExists = locationInfos.some(
        (loc) => loc.id === currentProperty.locationInfo?.id,
      );
      if (
        locationExists &&
        selectedLocationInfoId !== currentProperty.locationInfo.id
      ) {
        setSelectedLocationInfoId(currentProperty.locationInfo.id);
      }
    }
  }, [
    currentProperty?.locationInfo?.id,
    locationInfos,
    selectedLocationInfoId,
  ]);

  // Sync locationData with form field
  useEffect(() => {
    if (locationData?.address) {
      form.setFieldValue("location", locationData.address);
    }
  }, [locationData, form]);

  const { loading: submitting, run: submitForm } = useRequest(
    async (
      values: {
        typeId: string;
        title: string;
        description?: string;
        price?: number;
        area?: number;
        bedrooms?: number;
        bathrooms?: number;
        wifi?: boolean;
        tv?: boolean;
        airConditioner?: boolean;
        parking?: boolean;
        kitchen?: boolean;
        security?: boolean;
        content?: (
          | { type: "heading"; text: string; level?: 1 | 2 | 3 }
          | { type: "paragraph"; text: string }
          | { type: "image"; url: string; caption?: string }
        )[];
        legalStatus?: string;
        location?: string;
        locationInfoId?: string;
        transactionType: "rent" | "sale" | "project";
      },
      currentLocationInfoId: string,
    ) => {
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
          content: values.content ?? [],
        },
        legalStatus: values.legalStatus,
        location: locationData as LocationDto | undefined,
        locationInfoId: currentLocationInfoId,
        transactionType: values.transactionType,
      };

      // Use already uploaded image URLs
      if (mode === "create") {
        if (!mainImageUrl && mainImageFile) {
          throw new Error("Ảnh chính chưa được tải lên thành công");
        }
        if (imageUrls.length !== imageFiles.length) {
          throw new Error("Một số ảnh phụ chưa được tải lên thành công");
        }
      }

      // Handle main image URL
      if (mainImageUrl) {
        (formData as CreatePropertyDto).mainImage = mainImageUrl;
      } else if (existingMainImage) {
        (formData as CreatePropertyDto).mainImage = existingMainImage;
      }

      // Handle additional image URLs
      const allImageUrls = [...imageUrls, ...existingImages];
      if (allImageUrls.length > 0) {
        (formData as CreatePropertyDto).images = allImageUrls;
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
    locationInfoId?: string;
    transactionType: "rent" | "sale" | "project";
  }) => {
    if (selectedTransactionType !== "project") {
      // Check main image - either new upload or existing image
      const hasMainImage = mainImageFile ?? mainImageUrl ?? existingMainImage;
      if (!hasMainImage) {
        message.error("Vui lòng tải lên ảnh chính");
        return;
      }

      // Check additional images - count existing images + new uploads
      const totalImages = existingImages.length + imageUrls.length;
      if (totalImages < 3) {
        message.error("Vui lòng tải lên ít nhất 3 ảnh phụ");
        return;
      }
    }

    // Check location from form field
    if (!values.location) {
      message.error("Vui lòng chọn vị trí trên bản đồ");
      return;
    }

    // Check locationInfoId from form field
    const currentLocationInfoId =
      values.locationInfoId ?? selectedLocationInfoId;
    if (!currentLocationInfoId) {
      message.error("Vui lòng chọn khu vực");
      return;
    }

    submitForm(values, currentLocationInfoId);
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

    return false; // Prevent default upload
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

    return false; // Prevent default upload
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

  if (propertyLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="bg-primary-100 border-primary-300 mb-4 rounded-2xl border p-6 shadow-md">
        <h2 className="!text-primary-600 !mb-2 !text-3xl !font-bold">
          {mode === "create" ? "Thêm tin đăng mới" : "Chỉnh sửa tin đăng"}
        </h2>
        <p className="text-primary-600 text-md">
          {mode === "create"
            ? "Tạo tin đăng bất động sản mới"
            : "Cập nhết thông tin tin đăng"}
        </p>
      </div>
      <Card>
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
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
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
                rules={[{ required: true, message: "Vui lòng chọn loại BĐS!" }]}
              >
                <Select
                  placeholder="Chọn loại bất động sản"
                  size="large"
                  className="rounded-lg"
                  loading={propertyTypesLoading}
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
                label={<Text className="font-medium">Tình trạng pháp lý</Text>}
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
              rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
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
                  {selectedTransactionType === "project"
                    ? "Nội dung dự án"
                    : selectedTransactionType === "sale"
                      ? "Chi tiết bán"
                      : "Chi tiết cho thuê"}
                </Title>
              </div>
              <ProjectContentBuilder
                form={form}
                name="content"
                textFieldName="value"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            {/* Hidden field to track locationInfoId */}
            <Form.Item name="locationInfoId" hidden>
              <Input />
            </Form.Item>

            {/* Hidden field to track location */}
            <Form.Item name="location" hidden>
              <Input />
            </Form.Item>

            <div className="space-y-2">
              <Text className="font-medium">Vị trí trên bản đồ *</Text>
              <MapboxLocationSelector
                form={form}
                value={locationData}
                onChange={(newLocationData) => {
                  console.log(
                    "MapboxLocationSelector onChange:",
                    newLocationData,
                  );
                  setLocationData(newLocationData);
                  // Update the form field with the location address
                  if (newLocationData?.address) {
                    form.setFieldValue("location", newLocationData.address);
                  }
                }}
                placeholder="Chọn vị trí trên bản đồ"
                initialSearchValue={currentProperty?.location?.address}
                locationInfos={locationInfos}
                selectedLocationInfoId={selectedLocationInfoId}
                onLocationInfoChange={(locationInfoId) => {
                  setSelectedLocationInfoId(locationInfoId);
                  form.setFieldValue("locationInfoId", locationInfoId);
                }}
                loadingLocations={loadingLocations}
                mode={mode}
                hasExistingLocation={
                  !!(currentProperty?.location && currentProperty?.locationInfo)
                }
              />
            </div>
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
                  {(mainImageUrl ?? existingMainImage) && (
                    <Tooltip title="Ảnh đã sẵn sàng">
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
                            <div className="mt-2 text-sm">Đang tải lên...</div>
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
                  ) : existingMainImage ? (
                    <div className="relative h-64 w-full">
                      <Image
                        src={existingMainImage}
                        alt="Main"
                        className="h-64 w-full rounded-lg object-cover object-center"
                        width={128}
                        height={128}
                      />
                      <div className="absolute top-2 right-2">
                        <Tooltip title="Ảnh hiện có">
                          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1">
                            <span className="text-xs text-blue-600">
                              Hiện có
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                      <div className="absolute -right-3 -bottom-3">
                        <Button
                          danger
                          onClick={() => setExistingMainImage(null)}
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
                    <Text className="font-medium">Ảnh phụ (tối đa 9 ảnh)</Text>
                    {imageUrls.length > 0 && (
                      <Tooltip
                        title={`${imageUrls.length} ảnh mới đã tải lên thành công`}
                      >
                        <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            {imageUrls.length}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                    {existingImages.length > 0 && (
                      <Tooltip title={`${existingImages.length} ảnh hiện có`}>
                        <div className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1">
                          <span className="text-xs text-blue-600">
                            {existingImages.length}
                          </span>
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <Text className="text-sm text-gray-500">
                    {existingImages.length + imageFiles.length}/9 ảnh
                  </Text>
                </div>
                <div className="flex flex-wrap gap-4">
                  {/* Existing images */}
                  {existingImages.map((imageUrl, index) => (
                    <div
                      key={`existing-${index}`}
                      className="relative size-24 rounded-lg"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Existing Image ${index + 1}`}
                        className="size-24 rounded-lg object-cover"
                        width={100}
                        height={100}
                      />
                      <div className="absolute top-1 right-1">
                        <Tooltip title="Ảnh hiện có">
                          <div className="flex items-center gap-1 rounded-full bg-blue-100 px-1 py-0.5">
                            <span className="text-xs text-blue-600">
                              Hiện có
                            </span>
                          </div>
                        </Tooltip>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          onClick={() => {
                            const newExistingImages = existingImages.filter(
                              (_, i) => i !== index,
                            );
                            setExistingImages(newExistingImages);
                          }}
                          className="h-6 w-6"
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* New uploaded images */}
                  {imageFiles.map((file, index) => (
                    <div
                      key={`new-${index}`}
                      className="relative size-24 rounded-lg"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`New Image ${index + 1}`}
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
                  {existingImages.length + imageFiles.length < 9 && (
                    <Upload
                      beforeUpload={handleImagesUpload}
                      showUploadList={false}
                      disabled={uploadingImages.some((uploading) => uploading)}
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
                {(imageFiles.length > 0 || existingImages.length > 0) && (
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
                      {imageUrls.length}/{imageFiles.length} ảnh mới đã tải lên
                      {existingImages.length > 0 &&
                        ` • ${existingImages.length} ảnh hiện có`}
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
              onClick={() => router.push("/admin/properties")}
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
              {mode === "create" ? "Tạo tin đăng" : "Cập nhật"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default PropertyForm;
