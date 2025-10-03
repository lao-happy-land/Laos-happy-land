"use client";

import { useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Space,
  Modal,
  App,
  Tag,
  Input,
  Descriptions,
} from "antd";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import {
  CheckCircle,
  XCircle,
  Search,
  Landmark,
  Shield,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { User } from "@/@types/types";
import Image from "next/image";

export default function AdminRequests() {
  const t = useTranslations();
  const { message, modal } = App.useApp();
  const [bankRequestsPage, setBankRequestsPage] = useState(1);
  const [brokerRequestsPage, setBrokerRequestsPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"bank" | "broker">("bank");
  const pageSize = 10;

  // Fetch bank requests
  const {
    data: bankRequestsData,
    loading: bankRequestsLoading,
    run: fetchBankRequests,
  } = useRequest(
    async () => {
      return await userService.getBankRequests({
        page: bankRequestsPage,
        perPage: pageSize,
        search: searchText,
      });
    },
    {
      refreshDeps: [bankRequestsPage, searchText],
    },
  );

  // Fetch broker (role upgrade) requests
  const {
    data: brokerRequestsData,
    loading: brokerRequestsLoading,
    run: fetchBrokerRequests,
  } = useRequest(
    async () => {
      return await userService.getRoleUpgradeRequests({
        page: brokerRequestsPage,
        perPage: pageSize,
        search: searchText,
      });
    },
    {
      refreshDeps: [brokerRequestsPage, searchText],
    },
  );

  const handleApproveBankRequest = (userId: string, approve: boolean) => {
    modal.confirm({
      title: approve ? t("admin.confirmApprove") : t("admin.confirmReject"),
      content: approve
        ? t("admin.confirmApproveBankRequest")
        : t("admin.confirmRejectBankRequest"),
      onOk: async () => {
        try {
          await userService.approveIsFromBank(userId, approve);
          message.success(
            approve
              ? t("admin.bankRequestApproved")
              : t("admin.bankRequestRejected"),
          );
          fetchBankRequests();
        } catch (error) {
          console.error("Error approving bank request:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const handleApproveBrokerRequest = (userId: string, approve: boolean) => {
    modal.confirm({
      title: approve ? t("admin.confirmApprove") : t("admin.confirmReject"),
      content: approve
        ? t("admin.confirmApproveBrokerRequest")
        : t("admin.confirmRejectBrokerRequest"),
      onOk: async () => {
        try {
          await userService.approveRoleUpgrade(userId, approve);
          message.success(
            approve
              ? t("admin.brokerRequestApproved")
              : t("admin.brokerRequestRejected"),
          );
          fetchBrokerRequests();
        } catch (error) {
          console.error("Error approving broker request:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const handleViewDetails = (user: User, type: "bank" | "broker") => {
    setSelectedUser(user);
    setRequestType(type);
    setDetailsModalOpen(true);
  };

  const bankRequestColumns = [
    {
      title: t("admin.user"),
      key: "user",
      render: (_: unknown, record: User) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={
                record.image ?? record.avatarUrl ?? "/images/admin/avatar.png"
              }
              alt={record.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.fullName}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("admin.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("admin.role"),
      key: "role",
      render: (_: unknown, record: User) => (
        <Tag color="blue">{record.role?.name}</Tag>
      ),
    },
    {
      title: t("admin.status"),
      key: "status",
      render: (_: unknown, record: User) => {
        const isApproved =
          record.fromBank &&
          typeof record.fromBank === "object" &&
          (record.fromBank as { isFromBank?: boolean }).isFromBank;

        return (
          <Tag color={isApproved ? "green" : "orange"}>
            {isApproved ? t("admin.approved") : t("admin.pending")}
          </Tag>
        );
      },
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (_: unknown, record: User) => {
        const isApproved =
          record.fromBank &&
          typeof record.fromBank === "object" &&
          (record.fromBank as { isFromBank?: boolean }).isFromBank;

        return (
          <Space>
            <Button
              size="small"
              icon={<Eye size={14} />}
              onClick={() => handleViewDetails(record, "bank")}
            >
              {t("admin.viewDetails")}
            </Button>
            {!isApproved && (
              <>
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircle size={14} />}
                  onClick={() => handleApproveBankRequest(record.id, true)}
                >
                  {t("admin.approve")}
                </Button>
                <Button
                  danger
                  size="small"
                  icon={<XCircle size={14} />}
                  onClick={() => handleApproveBankRequest(record.id, false)}
                >
                  {t("admin.reject")}
                </Button>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const brokerRequestColumns = [
    {
      title: t("admin.user"),
      key: "user",
      render: (_: unknown, record: User) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={
                record.image ?? record.avatarUrl ?? "/images/admin/avatar.png"
              }
              alt={record.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.fullName}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("admin.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("admin.currentRole"),
      key: "currentRole",
      render: (_: unknown, record: User) => (
        <Tag color="blue">{record.role?.name}</Tag>
      ),
    },
    {
      title: t("admin.experience"),
      dataIndex: "experienceYears",
      key: "experienceYears",
      render: (years: number) => `${years || 0} ${t("admin.years")}`,
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewDetails(record, "broker")}
          >
            {t("admin.viewDetails")}
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircle size={14} />}
            onClick={() => handleApproveBrokerRequest(record.id, true)}
          >
            {t("admin.approve")}
          </Button>
          <Button
            danger
            size="small"
            icon={<XCircle size={14} />}
            onClick={() => handleApproveBrokerRequest(record.id, false)}
          >
            {t("admin.reject")}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("admin.requests")}
          </h1>
          <p className="text-gray-600">{t("admin.manageUserRequests")}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder={t("admin.searchUsers")}
            prefix={<Search className="h-4 w-4 text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            allowClear
            className="max-w-md"
          />
        </div>

        <Tabs defaultActiveKey="bank">
          <Tabs.TabPane
            tab={
              <div className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                {t("admin.bankRequests")} (
                {bankRequestsData?.meta?.itemCount ?? 0})
              </div>
            }
            key="bank"
          >
            <Table
              columns={bankRequestColumns}
              dataSource={bankRequestsData?.data ?? []}
              loading={bankRequestsLoading}
              rowKey="id"
              pagination={{
                current: bankRequestsPage,
                pageSize,
                total: bankRequestsData?.meta?.itemCount ?? 0,
                onChange: (page) => setBankRequestsPage(page),
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.requests")}`,
              }}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {t("admin.brokerRequests")} (
                {brokerRequestsData?.meta?.itemCount ?? 0})
              </div>
            }
            key="broker"
          >
            <Table
              columns={brokerRequestColumns}
              dataSource={brokerRequestsData?.data ?? []}
              loading={brokerRequestsLoading}
              rowKey="id"
              pagination={{
                current: brokerRequestsPage,
                pageSize,
                total: brokerRequestsData?.meta?.itemCount ?? 0,
                onChange: (page) => setBrokerRequestsPage(page),
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} ${t("admin.of")} ${total} ${t("admin.requests")}`,
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>

      {/* Request Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            {requestType === "bank" ? (
              <Landmark className="h-5 w-5 text-blue-600" />
            ) : (
              <Shield className="h-5 w-5 text-green-600" />
            )}
            <span>
              {requestType === "bank"
                ? t("admin.bankRequestDetails")
                : t("admin.brokerRequestDetails")}
            </span>
          </div>
        }
        open={detailsModalOpen}
        onCancel={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailsModalOpen(false)}>
            {t("common.close")}
          </Button>,
        ]}
        width={700}
      >
        {selectedUser && (
          <div className="space-y-6 py-4">
            {/* User Info */}
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={
                    selectedUser.image ??
                    selectedUser.avatarUrl ??
                    "/images/admin/avatar.png"
                  }
                  alt={selectedUser.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedUser.fullName}
                </h3>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-sm text-gray-600">{selectedUser.phone}</p>
              </div>
            </div>

            {/* Request Details */}
            <Descriptions bordered column={1}>
              <Descriptions.Item label={t("admin.currentRole")}>
                <Tag color="blue">{selectedUser.role?.name}</Tag>
              </Descriptions.Item>

              {requestType === "bank" ? (
                <>
                  {selectedUser.fromBank &&
                    typeof selectedUser.fromBank === "object" &&
                    selectedUser.fromBank !== null && (
                      <>
                        <Descriptions.Item label={t("admin.requestNote")}>
                          {(selectedUser.fromBank as { note?: string }).note ??
                            t("common.notAvailable")}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.requestPhone")}>
                          {(selectedUser.fromBank as { phone?: string })
                            .phone ?? selectedUser.phone}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t("admin.supportingDocument")}
                        >
                          {(selectedUser.fromBank as { imageUrl?: string })
                            .imageUrl ? (
                            <a
                              href={
                                (selectedUser.fromBank as { imageUrl?: string })
                                  .imageUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {t("admin.viewDocument")}
                            </a>
                          ) : (
                            t("common.notAvailable")
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.requestStatus")}>
                          <Tag
                            color={
                              (
                                selectedUser.fromBank as {
                                  isFromBank?: boolean;
                                }
                              ).isFromBank
                                ? "green"
                                : "orange"
                            }
                          >
                            {(selectedUser.fromBank as { isFromBank?: boolean })
                              .isFromBank
                              ? t("admin.approved")
                              : t("admin.pending")}
                          </Tag>
                        </Descriptions.Item>
                      </>
                    )}
                </>
              ) : (
                <>
                  {selectedUser.roleRequests &&
                    typeof selectedUser.roleRequests === "object" && (
                      <>
                        <Descriptions.Item label={t("admin.requestNote")}>
                          {(selectedUser.roleRequests as { note?: string })
                            .note ?? t("common.notAvailable")}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.requestedAt")}>
                          {(
                            selectedUser.roleRequests as {
                              requestedAt?: string;
                            }
                          ).requestedAt
                            ? new Date(
                                (
                                  selectedUser.roleRequests as {
                                    requestedAt?: string;
                                  }
                                ).requestedAt!,
                              ).toLocaleString()
                            : t("common.notAvailable")}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.experience")}>
                          {selectedUser.experienceYears ?? 0} {t("admin.years")}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.specialties")}>
                          {selectedUser.specialties &&
                          selectedUser.specialties.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.specialties.map((s, i) => (
                                <Tag key={i} color="blue">
                                  {s}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            t("common.notAvailable")
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.languages")}>
                          {selectedUser.languages &&
                          selectedUser.languages.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.languages.map((l, i) => (
                                <Tag key={i} color="green">
                                  {l}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            t("common.notAvailable")
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label={t("admin.certifications")}>
                          {selectedUser.certifications &&
                          selectedUser.certifications.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {selectedUser.certifications.map((c, i) => (
                                <Tag key={i} color="purple">
                                  {c}
                                </Tag>
                              ))}
                            </div>
                          ) : (
                            t("common.notAvailable")
                          )}
                        </Descriptions.Item>
                      </>
                    )}
                </>
              )}

              <Descriptions.Item label={t("admin.company")}>
                {selectedUser.company ?? t("common.notAvailable")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
