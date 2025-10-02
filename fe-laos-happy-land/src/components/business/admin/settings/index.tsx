"use client";

import React, { useState } from "react";
import { Button, message, Card, Typography, Spin } from "antd";
import { Edit } from "lucide-react";
import { useRequest } from "ahooks";
import { settingService } from "@/share/service/setting.service";
import SettingModal from "./setting-modal";
import { useTranslations } from "next-intl";
import Image from "next/image";

const { Title } = Typography;

const SettingsAdmin: React.FC = () => {
  const t = useTranslations();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch single setting
  const {
    data: setting,
    loading,
    refresh,
  } = useRequest(() => settingService.getSetting(), {
    refreshDeps: [],
    onError: (error: unknown) => {
      console.error("Failed to fetch setting:", error);
      message.error(t("admin.cannotLoadSettings"));
    },
  });

  const handleEdit = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Title level={2} className="!mb-2">
              {t("admin.manageSettings")}
            </Title>
            <p className="!mb-0 text-gray-600">
              {t("admin.manageSettingsDescription")}
            </p>
          </div>
          <Button
            type="primary"
            icon={<Edit size={20} />}
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600"
            size="large"
          >
            {t("admin.editSetting")}
          </Button>
        </div>

        {setting && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("admin.description")}
                </label>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {setting.description ?? t("common.notAvailable")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("admin.hotline")}
                </label>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {setting.hotline ?? t("common.notAvailable")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("admin.facebook")}
                </label>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {setting.facebook ?? t("common.notAvailable")}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t("admin.banner")}
                </label>
                {setting.banner && typeof setting.banner === "string" ? (
                  <Image
                    src={setting.banner}
                    alt="Banner"
                    className="h-20 w-full rounded-lg object-cover"
                    width={100}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <p className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {t("common.notAvailable")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {t("admin.images")}
              </label>
              {setting.images && setting.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {setting.images
                    .filter((img) => img && typeof img === "string")
                    .map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                        width={100}
                        height={100}
                        unoptimized
                      />
                    ))}
                </div>
              ) : (
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {t("common.notAvailable")}
                </p>
              )}
            </div>
          </div>
        )}
      </Card>

      <SettingModal
        visible={modalVisible}
        mode="edit"
        setting={setting ?? null}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default SettingsAdmin;
