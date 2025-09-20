"use client";

import { useEffect, useState, useRef } from "react";
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
  Spin,
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
  MapPin,
  Wifi,
} from "lucide-react";
import type { UpdatePropertyDto } from "@/@types/gentype-axios";
import type { PropertyType, LocationInfo } from "@/@types/types";
import { useRequest } from "ahooks";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import locationInfoService from "@/share/service/location-info.service";
import ProjectContentBuilder from "@/components/business/common/project-content-builder";
import MapboxLocationSelector from "@/components/business/common/mapbox-location-selector";
import Image from "next/image";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

type EditPropertyProps = { propertyId: string };

export default function EditProperty({ propertyId }: EditPropertyProps) {
  const { message } = App.useApp();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [locationInfos, setLocationInfos] = useState<LocationInfo[]>([]);
  const [selectedLocationInfoId, setSelectedLocationInfoId] =
    useState<string>("");
  const [selectedTransactionType, setSelectedTransactionType] = useState<
    "rent" | "sale" | "project"
  >("sale");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    city?: string;
    country?: string;
  } | null>(null);
  const initializedRef = useRef(false);

  const { data: property, loading: loadingProperty } = useRequest(async () => {
    const data = await propertyService.getPropertyById(propertyId);
    return data;
  });

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
      onSuccess: (data) => setPropertyTypes(data),
      onError: () => {
        message.error("Không thể tải danh sách loại bất động sản");
      },
    },
  );

  // Load location infos
  const { loading: loadingLocations, run: fetchLocationInfos } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo();
      return response;
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
    if (selectedTransactionType) {
      fetchPropertyTypes();
    }
    fetchLocationInfos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTransactionType]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/edit-property");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!property || initializedRef.current) return;

    initializedRef.current = true;

    // Use setTimeout to defer state updates to avoid setState during render
    setTimeout(() => {
      setSelectedTransactionType(property.transactionType);

      // Set location data if available
      if (property.location) {
        setLocationData({
          latitude: property.location.latitude,
          longitude: property.location.longitude,
          address: property.location.address,
          city: property.location.city,
          country: property.location.country,
        });
      }

      form.setFieldsValue({
        title: property.title,
        description: property.description,
        price: property.price ? parseFloat(property.price) : undefined,
        area: property.details?.area,
        bedrooms: property.details?.bedrooms,
        bathrooms: property.details?.bathrooms,
        wifi: property.details?.wifi ?? false,
        tv: property.details?.tv ?? false,
        airConditioner: property.details?.airConditioner ?? false,
        parking: property.details?.parking ?? false,
        kitchen: property.details?.kitchen ?? false,
        security: property.details?.security ?? false,
        legalStatus: property.legalStatus ?? "",
        location: property.location?.address ?? "",
        transactionType: property.transactionType,
        typeId: property.type?.id,
        locationInfoId: property.locationInfo?.id ?? "",
        content: property.details?.content,
      });

      // Set the selected location info ID state
      setSelectedLocationInfoId(property.locationInfo?.id ?? "");
    }, 0);
  }, [property, form]);

  // Update selectedLocationInfoId when locationInfos are loaded (for proper Select initialization)
  useEffect(() => {
    if (property?.locationInfo?.id && locationInfos.length > 0) {
      setSelectedLocationInfoId(property.locationInfo.id);
    }
  }, [property?.locationInfo?.id, locationInfos]);

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
      const formData: UpdatePropertyDto = {
        typeId: values.typeId,
        locationInfoId: values.locationInfoId,
        title: values.title,
        description: values.description,
        price: values.price,
        legalStatus: values.legalStatus ?? "",
        location: locationData,
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
          content:
            values.transactionType === "project"
              ? (values.content ?? [])
              : undefined,
        },
      } as UpdatePropertyDto;

      return await propertyService.updateProperty(propertyId, formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật tin đăng thành công!");
        router.push("/dashboard");
      },
      onError: () => {
        message.error("Không thể cập nhật tin đăng");
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
    if (selectedTransactionType !== "project" && !mainImageFile) {
      message.error("Vui lòng tải lên ảnh chính");
      return;
    }
    if (selectedTransactionType !== "project" && imageFiles.length < 3) {
      message.error("Vui lòng tải lên ít nhất 3 ảnh phụ");
      return;
    }
    if (!locationData) {
      message.error("Vui lòng chọn vị trí trên bản đồ");
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
    return false;
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
    return false;
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
  };

  const handleTransactionTypeChange = (value: "rent" | "sale" | "project") => {
    setSelectedTransactionType(value);
    form.setFieldsValue({ typeId: undefined });
  };

  if (loadingProperty || !property) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (property?.status === "approved") {
    message.error("Tin đăng đã được duyệt, không thể chỉnh sửa!");
    return router.push("/dashboard");
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <Title
            level={1}
            className="!mb-2 !text-3xl !font-bold !text-gray-900"
          >
            Cập nhật tin bất động sản
          </Title>
          <Text className="text-lg text-gray-600">
            Chỉnh sửa thông tin tin đăng của bạn
          </Text>
        </div>

        <Card className="border-0 shadow-lg">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="space-y-8"
            initialValues={{
              transactionType: property.transactionType,
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
                  label={<Text className="font-medium">Giá (LAK)</Text>}
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
                    Nội dung dự án
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
              <Form.Item>
                <MapboxLocationSelector
                  value={locationData}
                  onChange={setLocationData}
                  placeholder="Chọn vị trí trên bản đồ"
                  initialSearchValue={property?.location?.address}
                  locationInfos={locationInfos}
                  selectedLocationInfoId={selectedLocationInfoId}
                  onLocationInfoChange={(locationInfoId) => {
                    setSelectedLocationInfoId(locationInfoId);
                  }}
                  loadingLocations={loadingLocations}
                  mode="edit"
                  hasExistingLocation={
                    !!(property?.location && property?.locationInfo)
                  }
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
                Cập nhật
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
