"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Image,
  Tooltip,
} from "antd";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
import { useRequest } from "ahooks";
import { settingService } from "@/share/service/setting.service";
import type { Setting } from "@/share/service/setting.service";
import SettingModal from "./setting-modal";
import { useTranslations } from "next-intl";

const { Title } = Typography;

const SettingsAdmin: React.FC = () => {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  // Fetch settings
  const {
    data: settingsData,
    loading,
    refresh,
  } = useRequest(
    () => settingService.getAllSettings({ page: 1, perPage: 100 }),
    {
      refreshDeps: [],
      onError: (error: unknown) => {
        console.error("Failed to fetch settings:", error);
        message.error(t("admin.cannotLoadSettings"));
      },
    },
  );

  // Delete setting
  const { run: deleteSetting, loading: deleteLoading } = useRequest(
    (id: string) => settingService.deleteSetting(id),
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.deleteSettingSuccess"));
        refresh();
      },
      onError: (error: unknown) => {
        message.error(t("admin.deleteSettingFailed"));
        console.error("Delete error:", error);
      },
    },
  );

  const handleCreate = () => {
    setModalMode("create");
    setSelectedSetting(null);
    setModalVisible(true);
  };

  const handleEdit = (setting: Setting) => {
    setModalMode("edit");
    setSelectedSetting(setting);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteSetting(id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedSetting(null);
  };

  const handleModalSuccess = () => {
    refresh();
    handleModalClose();
  };

  // Filter settings based on search query
  const filteredSettings =
    settingsData?.data?.filter(
      (setting) =>
        setting.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
        setting.hotline?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        setting.facebook?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        [],
    ) ?? [];

  const columns = [
    {
      title: t("admin.description"),
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Tooltip title={text}>
          <div className="max-w-xs truncate">
            {text || t("common.notAvailable")}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("admin.hotline"),
      dataIndex: "hotline",
      key: "hotline",
      render: (text: string) => text || t("common.notAvailable"),
    },
    {
      title: t("admin.facebook"),
      dataIndex: "facebook",
      key: "facebook",
      render: (text: string) => (
        <Tooltip title={text}>
          <div className="max-w-xs truncate">
            {text || t("common.notAvailable")}
          </div>
        </Tooltip>
      ),
    },
    {
      title: t("admin.banner"),
      dataIndex: "banner",
      key: "banner",
      render: (banner: string) =>
        banner ? (
          <Image
            src={banner}
            alt="Banner"
            width={50}
            height={30}
            style={{ objectFit: "cover", borderRadius: "4px" }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <Tag color="default">{t("common.notAvailable")}</Tag>
        ),
    },
    {
      title: t("admin.images"),
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        <div className="flex gap-1">
          {images && images.length > 0 ? (
            images
              .slice(0, 3)
              .map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`Image ${index + 1}`}
                  width={30}
                  height={30}
                  style={{ objectFit: "cover", borderRadius: "4px" }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              ))
          ) : (
            <Tag color="default">{t("common.notAvailable")}</Tag>
          )}
          {images && images.length > 3 && (
            <Tag color="blue">+{images.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: t("admin.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        try {
          return new Date(date).toLocaleDateString();
        } catch {
          return t("common.invalidDate");
        }
      },
    },
    {
      title: t("admin.actions"),
      key: "actions",
      width: 120,
      render: (_: unknown, record: Setting) => (
        <Space>
          <Tooltip title={t("common.edit")}>
            <Button
              type="primary"
              size="small"
              icon={<Edit size={14} />}
              onClick={() => handleEdit(record)}
              className="bg-blue-500 hover:bg-blue-600"
            />
          </Tooltip>
          <Tooltip title={t("common.delete")}>
            <Popconfirm
              title={t("admin.deleteSettingConfirm")}
              onConfirm={() => handleDelete(record.id)}
              okText={t("common.confirm")}
              cancelText={t("common.cancel")}
              okButtonProps={{ loading: deleteLoading }}
            >
              <Button
                danger
                size="small"
                icon={<Trash2 size={14} />}
                loading={deleteLoading}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card>
        <Row gutter={[16, 16]} className="mb-6">
          <Col span={24}>
            <div className="flex items-center justify-between">
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
                icon={<Plus size={20} />}
                onClick={handleCreate}
                className="bg-blue-500 hover:bg-blue-600"
                size="large"
              >
                {t("admin.addSetting")}
              </Button>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder={t("admin.searchSettings")}
              prefix={<Search size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredSettings}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredSettings.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.settings")}`,
          }}
          scroll={{ x: 800 }}
          locale={{
            emptyText: (
              <div className="py-8 text-center text-gray-500">
                <Eye size={48} className="mx-auto mb-4 opacity-50" />
                <p className="mb-0">{t("admin.noSettings")}</p>
              </div>
            ),
          }}
        />
      </Card>

      <SettingModal
        visible={modalVisible}
        mode={modalMode}
        setting={selectedSetting}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default SettingsAdmin;
