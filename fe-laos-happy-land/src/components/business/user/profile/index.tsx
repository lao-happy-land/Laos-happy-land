"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/share/store/auth.store";
import { Button, Input, Breadcrumb } from "antd";
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
import Link from "next/link";

export default function Profile() {
  const { isAuthenticated, user: extendedUser } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setFormData({
        fullName: user.fullName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        address: user.location ?? "",
      });
    }
  }, [userData]);

  const { loading: updating, run: updateProfile } = useRequest(
    async (values: {
      fullName: string;
      email: string;
      phone?: string;
      address?: string;
      image?: File;
    }) => {
      const formData = new FormData();

      // Only include fields that are defined in UpdateUserDto
      formData.append("fullName", values.fullName ?? "");
      formData.append("email", values.email ?? "");
      formData.append("phone", values.phone ?? "");

      // Note: location/address is not in UpdateUserDto, so we'll skip it for now
      // formData.append("location", values.address || "");

      if (values.image) {
        formData.append("image", values.image);
      }

      const userId = userData?.user.id ?? "current";
      return await userService.updateProfile(userId, formData);
    },
    {
      manual: true,
      onSuccess: () => {
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
        setIsEditing(false);
        setAvatarFile(null);
        setTimeout(() => setMessage(null), 3000);
      },
      onError: (error) => {
        console.error("Profile update error:", error);
        setMessage({ type: "error", text: "Cập nhật thông tin thất bại" });
        setTimeout(() => setMessage(null), 3000);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      image: avatarFile ?? undefined,
    };

    updateProfile(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setMessage({ type: "error", text: "Chỉ có thể tải lên file hình ảnh!" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setMessage({ type: "error", text: "Hình ảnh phải nhỏ hơn 2MB!" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setAvatarFile(file);
    setMessage({
      type: "success",
      text: "Hình ảnh đã được chọn! Nhấn 'Lưu thay đổi' để cập nhật.",
    });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.files = e.dataTransfer.files;
      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", { value: input });
      handleAvatarUpload(event as unknown as ChangeEvent<HTMLInputElement>);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetForm = () => {
    if (userData?.user) {
      setFormData({
        fullName: userData.user.fullName ?? "",
        email: userData.user.email ?? "",
        phone: userData.user.phone ?? "",
        address: userData.user.location ?? "",
      });
    }
    setAvatarFile(null);
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="border-primary-500 mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-neutral-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-neutral-600">Không thể tải thông tin người dùng</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Trang chủ
        </Link>
      ),
    },
    {
      title: "Hồ sơ cá nhân",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mx-auto max-w-7xl px-6 pt-4`}>
          <div
            className={`rounded-lg p-4 ${
              message.type === "success"
                ? "bg-accent-50 border-accent-200 text-accent-700 border"
                : "bg-primary-50 border-primary-200 text-primary-700 border"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-neutral-900">
                Hồ sơ cá nhân
              </h1>
              <p className="text-lg text-neutral-600">
                Quản lý thông tin tài khoản của bạn
              </p>
            </div>
            <Button
              type={isEditing ? "default" : "primary"}
              icon={<Edit3 size={16} />}
              size="large"
              onClick={() => setIsEditing(!isEditing)}
              className="font-semibold"
            >
              {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="text-center">
                <div
                  className={`relative mb-4 inline-block transition-all duration-200 ${
                    isDragOver
                      ? "ring-primary-500 ring-opacity-50 scale-105 ring-2"
                      : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {avatarFile ? (
                    <div className="relative">
                      <div className="h-24 w-24 overflow-hidden rounded-full">
                        <Image
                          src={URL.createObjectURL(avatarFile)}
                          alt="Avatar"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <div className="absolute -top-1 -right-1">
                          <Button
                            danger
                            size="small"
                            shape="circle"
                            onClick={removeAvatar}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : userData?.user.avatarUrl ? (
                    <div className="relative">
                      <div className="h-24 w-24 overflow-hidden rounded-full">
                        <Image
                          src={userData.user.avatarUrl}
                          alt="Avatar"
                          width={96}
                          height={96}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {isEditing && (
                        <div className="absolute -top-1 -right-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <Button
                            size="small"
                            shape="circle"
                            className="hover:bg-primary-100 cursor-pointer"
                            onClick={triggerFileInput}
                          >
                            <Camera size={10} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="bg-primary-100 flex h-24 w-24 items-center justify-center rounded-full">
                        <User size={32} className="text-primary-500" />
                      </div>
                      {isEditing && (
                        <div className="absolute -top-1 -right-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <Button
                            size="small"
                            shape="circle"
                            className="hover:bg-primary-100 cursor-pointer"
                            onClick={triggerFileInput}
                          >
                            <Camera size={10} />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <p className="mb-2 text-xs text-neutral-500">
                    Nhấn vào biểu tượng camera
                  </p>
                )}

                <h3 className="mb-1 text-lg font-semibold text-neutral-900">
                  {userData?.user.fullName && userData.user.fullName !== "User"
                    ? userData.user.fullName
                    : "Chưa cập nhật"}
                </h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {userData?.user.email}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Shield size={14} />
                    <span>
                      {userData?.user.role?.name === "Admin"
                        ? "Quản trị viên"
                        : "Người dùng"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Calendar size={14} />
                    <span>
                      Tham gia:{" "}
                      {new Date(userData?.user.createdAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900">
                Thống kê nhanh
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Tài khoản</span>
                  <span className="font-medium text-neutral-900">
                    Hoạt động
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Bảo mật</span>
                  <span className="text-accent-600 font-medium">
                    Đã xác thực
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Cập nhật cuối</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(userData?.user.updatedAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            {/* Additional Information */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-neutral-200 pb-2">
                <Shield size={20} className="text-neutral-500" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  Thông tin bổ sung
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      ID người dùng
                    </label>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                      {userData?.user.id}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Trạng thái tài khoản
                    </label>
                    <div className="border-accent-200 bg-accent-50 text-accent-700 rounded-lg border px-3 py-2 text-sm">
                      Hoạt động
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Ngày tạo
                    </label>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                      {new Date(userData?.user.createdAt).toLocaleString(
                        "vi-VN",
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Cập nhật cuối
                    </label>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                      {new Date(userData?.user.updatedAt).toLocaleString(
                        "vi-VN",
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-neutral-200 pb-2">
                    <User size={20} className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-neutral-900">
                      Thông tin cơ bản
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">
                        Họ và tên *
                      </label>
                      <Input
                        placeholder="Nhập họ và tên..."
                        size="large"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">
                        Email *
                      </label>
                      <Input
                        placeholder="Nhập email..."
                        size="large"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={true}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Số điện thoại
                    </label>
                    <Input
                      placeholder="Nhập số điện thoại..."
                      size="large"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-neutral-200 pb-2">
                      <MapPin size={20} className="text-accent-500" />
                      <h3 className="text-lg font-semibold text-neutral-900">
                        Thông tin liên hệ
                      </h3>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">
                        Địa chỉ
                      </label>
                      <Input
                        placeholder="Nhập địa chỉ..."
                        size="large"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                      type="default"
                      size="large"
                      onClick={resetForm}
                      className="font-semibold"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<Save size={16} />}
                      size="large"
                      loading={updating}
                      className="font-semibold"
                    >
                      Lưu thay đổi
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
