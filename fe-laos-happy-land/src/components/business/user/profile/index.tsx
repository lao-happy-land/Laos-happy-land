"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Divider,
  App,
  Upload,
  Row,
  Col,
  Space,
} from "antd";
import {
  User,
  MapPin,
  Save,
  Camera,
  Edit3,
  Shield,
  Calendar,
} from "lucide-react";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import Image from "next/image";
const { Title, Text } = Typography;

export default function Profile() {
  const { message } = App.useApp();
  const { isAuthenticated, user: extendedUser } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, router]);

  const { data: userData, loading: loadingUser } = useRequest(async () => {
    if (!extendedUser?.id) return null;
    return await userService.getUserById(extendedUser.id);
  });

  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      form.setFieldsValue({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.location ?? "",
        image: user.avatarUrl ?? "",
      });
    }
  }, [userData, form]);

  const { loading: updating, run: updateProfile } = useRequest(
    async (values: {
      fullName: string;
      email: string;
      phone?: string;
      address?: string;
      image?: File;
    }) => {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      if (values.phone) formData.append("phone", values.phone);
      if (values.address) formData.append("address", values.address);
      if (values.image) formData.append("image", values.image);

      // Get current user ID from auth store
      const userId = userData?.user.id ?? "current";
      return await userService.updateProfile(userId, formData);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật thông tin thành công!");
        setIsEditing(false);
        setAvatarFile(null);
      },
      onError: () => {
        message.error("Cập nhật thông tin thất bại");
      },
    },
  );

  const handleSubmit = (values: {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    image?: File;
  }) => {
    updateProfile(values);
  };

  const handleAvatarUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể tải lên file hình ảnh!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    setAvatarFile(file);
    return false;
  };

  const removeAvatar = () => {
    setAvatarFile(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Title
                level={1}
                className="!mb-2 !text-3xl !font-bold !text-gray-900"
              >
                Hồ sơ cá nhân
              </Title>
              <Text className="text-lg text-gray-600">
                Quản lý thông tin tài khoản của bạn
              </Text>
            </div>
            <Button
              type={isEditing ? "default" : "primary"}
              icon={<Edit3 className="h-4 w-4" />}
              size="large"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-lg"
            >
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            </Button>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Overview */}
          <Col xs={24} lg={8}>
            <Card className="h-fit">
              <div className="text-center">
                <div className="relative mb-6 inline-block">
                  {avatarFile ? (
                    <div className="relative">
                      <Avatar
                        size={120}
                        src={
                          <Image
                            src={URL.createObjectURL(avatarFile)}
                            alt="Avatar"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                          />
                        }
                      />
                      {isEditing && (
                        <Button
                          danger
                          size="small"
                          shape="circle"
                          className="absolute -top-2 -right-2"
                          onClick={removeAvatar}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ) : userData?.user.avatarUrl ? (
                    <div className="relative">
                      <Avatar
                        size={120}
                        src={
                          <Image
                            src={userData.user.avatarUrl}
                            alt="Avatar"
                            width={120}
                            height={120}
                            className="rounded-full object-cover"
                          />
                        }
                      />
                      {isEditing && (
                        <Upload
                          beforeUpload={handleAvatarUpload}
                          showUploadList={false}
                        >
                          <Button
                            size="small"
                            shape="circle"
                            className="absolute -top-2 -right-2"
                          >
                            <Camera className="h-3 w-3" />
                          </Button>
                        </Upload>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <Avatar
                        size={120}
                        icon={<User />}
                        className="bg-blue-500"
                      />
                      {isEditing && (
                        <Upload
                          beforeUpload={handleAvatarUpload}
                          showUploadList={false}
                        >
                          <Button
                            size="small"
                            shape="circle"
                            className="absolute -top-2 -right-2"
                          >
                            <Camera className="h-3 w-3" />
                          </Button>
                        </Upload>
                      )}
                    </div>
                  )}
                </div>

                <Title level={3} className="!mb-2 !text-xl !font-semibold">
                  {userData?.user.fullName || "Chưa cập nhật"}
                </Title>
                <Text className="mb-4 block text-gray-600">
                  {userData?.user.email}
                </Text>

                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>
                      {userData?.user.role?.name === "Admin"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Tham gia:{" "}
                      {new Date(userData?.user.createdAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>

          {/* Profile Form */}
          <Col xs={24} lg={16}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                    <User className="h-6 w-6 text-blue-600" />
                    <Title
                      level={3}
                      className="!mb-0 !text-xl !font-semibold !text-gray-900"
                    >
                      Thông tin cơ bản
                    </Title>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="fullName"
                        label={<Text className="font-medium">Họ và tên</Text>}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập họ và tên!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập họ và tên..."
                          size="large"
                          className="rounded-lg"
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={<Text className="font-medium">Email</Text>}
                        rules={[
                          { required: true, message: "Vui lòng nhập email!" },
                          { type: "email", message: "Email không hợp lệ!" },
                        ]}
                      >
                        <Input
                          placeholder="Nhập email..."
                          size="large"
                          className="rounded-lg"
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="phone"
                    label={<Text className="font-medium">Số điện thoại</Text>}
                  >
                    <Input
                      placeholder="Nhập số điện thoại..."
                      size="large"
                      className="rounded-lg"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </div>

                <Divider />

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-200 pb-2">
                    <MapPin className="h-6 w-6 text-green-600" />
                    <Title
                      level={3}
                      className="!mb-0 !text-xl !font-semibold !text-gray-900"
                    >
                      Thông tin liên hệ
                    </Title>
                  </div>

                  <Form.Item
                    name="address"
                    label={<Text className="font-medium">Địa chỉ</Text>}
                  >
                    <Input
                      placeholder="Nhập địa chỉ..."
                      size="large"
                      className="rounded-lg"
                      disabled={!isEditing}
                    />
                  </Form.Item>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 border-t pt-6">
                    <Button
                      type="default"
                      size="large"
                      onClick={() => {
                        setIsEditing(false);
                        setAvatarFile(null);
                        form.resetFields();
                        if (userData?.user) {
                          form.setFieldsValue({
                            fullName: userData.user.fullName ?? "",
                            email: userData.user.email ?? "",
                            phone: userData.user.phone ?? "",
                            address: userData.user.location ?? "",
                            image: userData.user.avatarUrl ?? "",
                          });
                        }
                      }}
                      className="rounded-lg"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<Save className="h-4 w-4" />}
                      size="large"
                      loading={updating}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
