"use client";

import { useEffect, useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useAuthStore } from "@/share/store/auth.store";
import { Button, Input, Breadcrumb, Modal, App } from "antd";
import {
  User,
  MapPin,
  Save,
  Camera,
  Edit3,
  Shield,
  Calendar,
  X,
} from "lucide-react";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import MapboxLocationSelector from "@/components/business/common/mapbox-location-selector";
import type { UpdateUserDto, LocationDto } from "@/@types/gentype-axios";

export default function Profile() {
  const { isAuthenticated, user: extendedUser } = useAuthStore();
  const router = useRouter();
  const t = useTranslations();
  const locale = useUrlLocale();
  const { message: antMessage } = App.useApp();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experienceYears: 0,
    company: "",
    specialties: [] as string[],
    languages: [] as string[],
    certifications: [] as string[],
  });
  const [locationData, setLocationData] = useState<{
    locationInfoId?: string;
    location?: LocationDto | null;
  } | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // States for managing array fields
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Broker request modal states
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [brokerRequestNote, setBrokerRequestNote] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login?redirect=/${locale}/profile`);
    }
  }, [isAuthenticated, router, locale]);

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
        experienceYears: user.experienceYears ?? 0,
        company: user.company ?? "",
        specialties: user.specialties ?? [],
        languages: user.languages ?? [],
        certifications: user.certifications ?? [],
      });

      // If user has location data, set it
      if (user.location || user.locationInfo) {
        setLocationData({
          locationInfoId: user.locationInfo?.id,
          location:
            typeof user.location === "string"
              ? {
                  latitude: 0,
                  longitude: 0,
                  address: user.location,
                }
              : user.location,
        });
      }
    }
  }, [userData]);

  const { loading: updating, run: updateProfile } = useRequest(
    async (values: {
      fullName: string;
      email: string;
      phone?: string;
      address?: string;
      image?: File;
      location?: LocationDto;
      experienceYears?: number;
      company?: string;
      specialties?: string[];
      languages?: string[];
      certifications?: string[];
    }) => {
      const updateData: UpdateUserDto = {
        fullName: values.fullName,
        phone: values.phone,
        experienceYears: values.experienceYears,
        company: values.company,
        specialties: values.specialties,
        languages: values.languages,
        certifications: values.certifications,
        ...(values.location?.address && { location: values.location }),
        ...(values.image && { image: values.image }),
      };

      const userId = userData?.user.id ?? "current";
      return await userService.updateProfile(userId, updateData);
    },
    {
      manual: true,
      onSuccess: () => {
        setMessage({ type: "success", text: t("common.updateSuccess") });
        setIsEditing(false);
        setAvatarFile(null);
        setTimeout(() => setMessage(null), 3000);
      },
      onError: (error) => {
        console.error("Profile update error:", error);
        setMessage({ type: "error", text: t("common.updateFailed") });
        setTimeout(() => setMessage(null), 3000);
      },
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      image: avatarFile ?? undefined,
      location: locationData?.location ?? undefined,
    };

    updateProfile(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (
    data: {
      locationInfoId?: string;
      location?: LocationDto | null;
    } | null,
  ) => {
    setLocationData(data);
    // Also update the address field for backward compatibility
    if (data?.location?.address) {
      setFormData((prev) => ({
        ...prev,
        address: data.location?.address ?? "",
      }));
    }
  };

  // Helper functions for managing array fields
  const handleAddSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !formData.specialties.includes(newSpecialty.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleAddLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()],
      }));
      setNewLanguage("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }));
  };

  const handleAddCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certification),
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      setMessage({ type: "error", text: t("common.onlyImageAllowed") });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setMessage({ type: "error", text: t("common.imageSizeLimit") });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setAvatarFile(file);
    setMessage({
      type: "success",
      text: t("common.imageSelected"),
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
        experienceYears: userData.user.experienceYears ?? 0,
        company: userData.user.company ?? "",
        specialties: userData.user.specialties ?? [],
        languages: userData.user.languages ?? [],
        certifications: userData.user.certifications ?? [],
      });

      // Reset location data
      if (userData.user.location || userData.user.locationInfo) {
        setLocationData({
          locationInfoId: userData.user.locationInfo?.id,
          location:
            typeof userData.user.location === "string"
              ? {
                  latitude: 0,
                  longitude: 0,
                  address: userData.user.location,
                }
              : userData.user.location,
        });
      }

      // Reset array field inputs
      setNewSpecialty("");
      setNewLanguage("");
      setNewCertification("");
    } else {
      setLocationData(null);
    }
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Broker request handler
  const { loading: submittingBrokerRequest, run: submitBrokerRequest } =
    useRequest(
      async () => {
        if (!userData?.user?.id) {
          throw new Error("User ID not found");
        }

        await userService.requestRoleUpgrade(userData.user.id, {
          note: brokerRequestNote || null,
        });
      },
      {
        manual: true,
        onSuccess: () => {
          antMessage.success(t("profile.brokerRequestSent"));
          setIsBrokerModalOpen(false);
          setBrokerRequestNote("");
        },
        onError: (error) => {
          console.error("Broker request error:", error);
          antMessage.error(t("profile.brokerRequestFailed"));
        },
      },
    );

  const handleBrokerRequestSubmit = () => {
    if (!brokerRequestNote.trim()) {
      antMessage.error(t("profile.noteRequired"));
      return;
    }
    submitBrokerRequest();
  };

  // const isFromBank = (): boolean => {
  //   const fromBank = userData?.user?.fromBank;

  //   if (fromBank === null || fromBank === undefined) {
  //     return false;
  //   }

  //   if (typeof fromBank === "string") {
  //     return false;
  //   }

  //   return fromBank.isFromBank === true;
  // };

  if (!isAuthenticated) {
    return null;
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="border-primary-500 mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-neutral-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-neutral-600">{t("common.cannotLoadUserInfo")}</p>
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
          {t("common.home")}
        </Link>
      ),
    },
    {
      title: t("common.profile"),
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
                {t("common.profile")}
              </h1>
              <p className="text-lg text-neutral-600">
                {t("common.manageAccountInfo")}
              </p>
            </div>
            <Button
              type={isEditing ? "default" : "primary"}
              icon={<Edit3 size={16} />}
              size="large"
              onClick={() => setIsEditing(!isEditing)}
              className="font-semibold"
            >
              {isEditing ? t("common.cancelEdit") : t("common.edit")}
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
                    {t("common.clickCameraIcon")}
                  </p>
                )}

                <h3 className="mb-1 text-lg font-semibold text-neutral-900">
                  {userData?.user.fullName && userData.user.fullName !== "User"
                    ? userData.user.fullName
                    : t("common.notUpdated")}
                </h3>
                <p className="mb-3 text-sm text-neutral-600">
                  {userData?.user.email}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Shield size={14} />
                    <span>
                      {userData?.user.role?.name === "Admin"
                        ? t("common.admin")
                        : t("common.user")}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                    <Calendar size={14} />
                    <span>
                      {t("common.joined")}:{" "}
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
                {t("common.quickStats")}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    {t("common.account")}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {t("common.active")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    {t("common.security")}
                  </span>
                  <span className="text-accent-600 font-medium">
                    {t("common.verified")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">
                    {t("common.updatedAt")}
                  </span>
                  <span className="font-medium text-neutral-900">
                    {new Date(userData?.user.updatedAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Request Buttons */}
            <div className="mt-4 space-y-3">
              {/* Broker Request Button - Show only for user role */}
              {userData?.user?.role?.name?.toLowerCase() === "user" && (
                <Button
                  type="primary"
                  icon={<Shield size={16} />}
                  size="large"
                  block
                  onClick={() => setIsBrokerModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 font-semibold shadow-md hover:from-green-600 hover:to-emerald-700"
                >
                  {t("profile.requestBrokerStatus")}
                </Button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            {/* Additional Information */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 border-b border-neutral-200 pb-2">
                <Shield size={20} className="text-neutral-500" />
                <h3 className="text-lg font-semibold text-neutral-900">
                  {t("common.additionalInfo")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      {t("common.userId")}
                    </label>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                      {userData?.user.id}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      {t("common.accountStatus")}
                    </label>
                    <div className="border-accent-200 bg-accent-50 text-accent-700 rounded-lg border px-3 py-2 text-sm">
                      {t("common.active")}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      {t("common.createdAt")}
                    </label>
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
                      {new Date(userData?.user.createdAt).toLocaleString(
                        "vi-VN",
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      {t("common.lastUpdated")}
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
                      {t("common.basicInfo")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">
                        {t("common.fullName")} *
                      </label>
                      <Input
                        placeholder={t("common.enterFullName")}
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
                        placeholder={t("common.enterEmail")}
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
                      {t("common.phone")}
                    </label>
                    <Input
                      placeholder={t("common.enterPhone")}
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
                        {t("common.contactInfo")}
                      </h3>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">
                        {t("common.address")}
                      </label>
                      {isEditing ? (
                        <MapboxLocationSelector
                          value={locationData}
                          onChange={handleLocationChange}
                          disabled={!isEditing}
                        />
                      ) : (
                        <Input
                          placeholder={t("common.enterAddress")}
                          size="large"
                          value={formData.address}
                          disabled={true}
                          className="bg-neutral-50"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                {userData?.user.role?.name?.toLowerCase() === "broker" && (
                  <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <h3 className="mb-6 text-xl font-bold text-neutral-900">
                      {t("common.professionalInfo")}
                    </h3>

                    <div className="space-y-6">
                      {/* Experience Years and Company */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-neutral-700">
                            {t("common.experienceYears")}
                          </label>
                          <Input
                            type="number"
                            placeholder={t("common.enterExperienceYears")}
                            size="large"
                            value={formData.experienceYears}
                            onChange={(e) =>
                              handleInputChange(
                                "experienceYears",
                                e.target.value,
                              )
                            }
                            disabled={!isEditing}
                            className={!isEditing ? "bg-neutral-50" : ""}
                            min={0}
                            max={50}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-neutral-700">
                            {t("common.company")}
                          </label>
                          <Input
                            placeholder={t("common.enterCompany")}
                            size="large"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            disabled={!isEditing}
                            className={!isEditing ? "bg-neutral-50" : ""}
                          />
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                          {t("common.specialties")}
                        </label>
                        {isEditing && (
                          <div className="mb-3 flex gap-2">
                            <Input
                              placeholder={t("common.enterSpecialty")}
                              size="large"
                              value={newSpecialty}
                              onChange={(e) => setNewSpecialty(e.target.value)}
                              onPressEnter={handleAddSpecialty}
                            />
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleAddSpecialty}
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              {t("common.add")}
                            </Button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {formData.specialties.length > 0 ? (
                            formData.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                              >
                                {specialty}
                                {isEditing && (
                                  <X
                                    size={14}
                                    className="cursor-pointer hover:text-blue-900"
                                    onClick={() =>
                                      handleRemoveSpecialty(specialty)
                                    }
                                  />
                                )}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              {t("common.noSpecialties")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                          {t("common.languages")}
                        </label>
                        {isEditing && (
                          <div className="mb-3 flex gap-2">
                            <Input
                              placeholder={t("common.enterLanguage")}
                              size="large"
                              value={newLanguage}
                              onChange={(e) => setNewLanguage(e.target.value)}
                              onPressEnter={handleAddLanguage}
                            />
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleAddLanguage}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              {t("common.add")}
                            </Button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {formData.languages.length > 0 ? (
                            formData.languages.map((language, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700"
                              >
                                {language}
                                {isEditing && (
                                  <X
                                    size={14}
                                    className="cursor-pointer hover:text-green-900"
                                    onClick={() =>
                                      handleRemoveLanguage(language)
                                    }
                                  />
                                )}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">
                              {t("common.noLanguages")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Certifications */}
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700">
                          {t("common.certifications")}
                        </label>
                        {isEditing && (
                          <div className="mb-3 flex gap-2">
                            <Input
                              placeholder={t("common.enterCertification")}
                              size="large"
                              value={newCertification}
                              onChange={(e) =>
                                setNewCertification(e.target.value)
                              }
                              onPressEnter={handleAddCertification}
                            />
                            <Button
                              type="primary"
                              size="large"
                              onClick={handleAddCertification}
                              className="bg-purple-500 hover:bg-purple-600"
                            >
                              {t("common.add")}
                            </Button>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications.length > 0 ? (
                            formData.certifications.map(
                              (certification, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                                >
                                  {certification}
                                  {isEditing && (
                                    <X
                                      size={14}
                                      className="cursor-pointer hover:text-purple-900"
                                      onClick={() =>
                                        handleRemoveCertification(certification)
                                      }
                                    />
                                  )}
                                </span>
                              ),
                            )
                          ) : (
                            <span className="text-sm text-gray-500">
                              {t("common.noCertifications")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                {isEditing && (
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <Button
                      type="default"
                      size="large"
                      onClick={resetForm}
                      className="font-semibold"
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<Save size={16} />}
                      size="large"
                      loading={updating}
                      className="font-semibold"
                    >
                      {t("common.saveChanges")}
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Request Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>{t("profile.requestBrokerStatus")}</span>
          </div>
        }
        open={isBrokerModalOpen}
        onCancel={() => {
          setIsBrokerModalOpen(false);
          setBrokerRequestNote("");
        }}
        onOk={handleBrokerRequestSubmit}
        confirmLoading={submittingBrokerRequest}
        okText={t("common.submit")}
        cancelText={t("common.cancel")}
        width={600}
      >
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              {t("profile.brokerRequestInfo")}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              {t("profile.brokerRequestNote")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input.TextArea
              placeholder={t("profile.enterBrokerRequestNote")}
              value={brokerRequestNote}
              onChange={(e) => setBrokerRequestNote(e.target.value)}
              rows={4}
              maxLength={500}
              showCount
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
