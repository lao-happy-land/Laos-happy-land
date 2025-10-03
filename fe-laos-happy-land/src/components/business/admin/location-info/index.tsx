"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useTranslations } from "next-intl";
import {
  Table,
  Button,
  Input,
  Space,
  Card,
  Typography,
  Empty,
  Tooltip,
  App,
  Image,
  Tag,
} from "antd";
import { Plus, Search, Trash2, Edit, MapPin } from "lucide-react";
import locationInfoService from "@/share/service/location-info.service";
import type { LocationInfo } from "@/share/service/location-info.service";
import LocationInfoModal from "./location-info-modal";

const { Title, Text } = Typography;

const AdminLocationInfo = () => {
  const t = useTranslations();
  const { modal, message } = App.useApp();

  const [locationInfos, setLocationInfos] = useState<LocationInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationInfo, setSelectedLocationInfo] =
    useState<LocationInfo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Fetch location infos
  const { loading: loadingLocationInfos, run: fetchLocationInfos } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo();
      return response.data || response;
    },
    {
      onSuccess: (data) => {
        setLocationInfos(data);
      },
      onError: (error) => {
        console.error("Error fetching location infos:", error);
        message.error(t("admin.cannotLoadLocations"));
      },
    },
  );

  // Delete location info
  const { run: deleteLocationInfo } = useRequest(
    async (id: string) => {
      await locationInfoService.deleteLocationInfo(id);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success(t("admin.deleteLocationSuccess"));
        fetchLocationInfos();
      },
      onError: (error) => {
        console.error("Error deleting location info:", error);
        message.error(t("admin.cannotDeleteLocation"));
      },
    },
  );

  // Handle create
  const handleCreate = () => {
    setSelectedLocationInfo(null);
    setModalMode("create");
    setIsModalVisible(true);
  };

  // Handle edit
  const handleEdit = (locationInfo: LocationInfo) => {
    setSelectedLocationInfo(locationInfo);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  // Handle delete
  const handleDelete = (locationInfo: LocationInfo) => {
    modal.confirm({
      title: t("admin.confirmDeleteLocation"),
      content: t("admin.confirmDeleteLocationContent", {
        name: locationInfo.name,
      }),
      okText: t("admin.delete"),
      cancelText: t("admin.cancel"),
      okType: "danger",
      onOk: () => {
        deleteLocationInfo(locationInfo.id);
      },
    });
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLocationInfo(null);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    handleModalClose();
    fetchLocationInfos();
  };

  // Filter location infos based on search query
  const filteredLocationInfos = locationInfos.filter((locationInfo) =>
    locationInfo.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Table columns
  const columns = [
    {
      title: t("admin.avatar"),
      dataIndex: "imageURL",
      key: "imageURL",
      width: 100,
      render: (imageURL: string) => (
        <div className="flex justify-center">
          {imageURL ? (
            <Image
              src={imageURL}
              alt="Location"
              width={60}
              height={60}
              className="rounded-lg object-cover"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
            />
          ) : (
            <div className="flex h-15 w-15 items-center justify-center rounded-lg bg-gray-200">
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("admin.locationName"),
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Text className="font-medium text-gray-900">{name}</Text>
      ),
    },
    {
      title: t("admin.subAreas"),
      dataIndex: "strict",
      key: "strict",
      render: (strict: string[]) => (
        <div className="flex flex-wrap gap-1">
          {strict && strict.length > 0 ? (
            strict.slice(0, 3).map((item, index) => (
              <Tag key={index} color="blue" className="text-xs">
                {item}
              </Tag>
            ))
          ) : (
            <Text className="text-sm text-gray-400">
              {t("common.notAvailable")}
            </Text>
          )}
          {strict && strict.length > 3 && (
            <Tag color="default" className="text-xs">
              +{strict.length - 3}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: t("property.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <Text className="text-sm text-gray-600">
          {new Date(createdAt).toLocaleDateString("vi-VN")}
        </Text>
      ),
    },
    {
      title: t("admin.actions"),
      key: "actions",
      width: 150,
      render: (_: unknown, record: LocationInfo) => (
        <Space size="small">
          <Tooltip title={t("common.edit")}>
            <Button
              type="text"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => handleEdit(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title={t("common.delete")}>
            <Button
              type="text"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => handleDelete(record)}
              className="text-red-600 hover:text-red-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchLocationInfos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={2} className="!mb-2">
            {t("admin.manageLocations")}
          </Title>
          <Text className="text-gray-600">
            {t("admin.manageLocationsDescription")}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={handleCreate}
          size="large"
        >
          {t("admin.addLocation")}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Input
            placeholder={t("admin.searchLocations")}
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            size="large"
          />
        </div>
      </Card>

      {/* Table */}
      <Card style={{ marginTop: "16px" }}>
        <Table
          columns={columns}
          dataSource={filteredLocationInfos}
          rowKey="id"
          loading={loadingLocationInfos}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              t("admin.locationsPagination", {
                start: range[0],
                end: range[1],
                total,
              }),
          }}
          locale={{
            emptyText: (
              <Empty
                description={t("admin.noLocations")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
        />
      </Card>

      {/* Modal */}
      <LocationInfoModal
        visible={isModalVisible}
        mode={modalMode}
        locationInfo={selectedLocationInfo}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminLocationInfo;
