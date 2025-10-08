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
  Select,
  Popconfirm,
} from "antd";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import {
  bankRequestService,
  type BankRequest,
} from "@/share/service/bank-request.service";
import bankService, { type Bank } from "@/share/service/bank.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";
import {
  CheckCircle,
  XCircle,
  Search,
  Landmark,
  Shield,
  Eye,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { User } from "@/@types/types";
import Image from "next/image";

const { Option } = Select;

export default function AdminRequests() {
  const t = useTranslations();
  const { message, modal } = App.useApp();
  const locale = useUrlLocale();
  const [bankRequestsPage, setBankRequestsPage] = useState(1);
  const [brokerRequestsPage, setBrokerRequestsPage] = useState(1);
  const [bankRequestStatus, setBankRequestStatus] = useState<
    "pending" | "approved" | "rejected" | undefined
  >(undefined);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBankRequest, setSelectedBankRequest] =
    useState<BankRequest | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState<"bank" | "broker">("bank");
  const [banks, setBanks] = useState<Bank[]>([]);
  const pageSize = 10;

  // Fetch banks for display
  const { loading: loadingBanks } = useRequest(
    async () => {
      const response = await bankService.getBanks({
        page: 1,
        perPage: 100,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response;
    },
    {
      onSuccess: (data) => {
        console.log("Banks loaded:", data.data);
        setBanks(data.data ?? []);
      },
      onError: (error) => {
        console.error("Failed to load banks:", error);
      },
    },
  );

  // Fetch bank requests
  const {
    data: bankRequestsData,
    loading: bankRequestsLoading,
    run: fetchBankRequests,
  } = useRequest(
    async () => {
      return await bankRequestService.getAll({
        page: bankRequestsPage,
        perPage: pageSize,
        status: bankRequestStatus,
      });
    },
    {
      refreshDeps: [bankRequestsPage, bankRequestStatus],
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

  const handleApproveBankRequest = (id: string) => {
    modal.confirm({
      title: t("admin.confirmApprove"),
      content: t("admin.confirmApproveBankRequest"),
      onOk: async () => {
        try {
          await bankRequestService.approve(id);
          message.success(t("admin.bankRequestApproved"));
          fetchBankRequests();
        } catch (error) {
          console.error("Error approving bank request:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const handleRejectBankRequest = (id: string) => {
    modal.confirm({
      title: t("admin.confirmReject"),
      content: t("admin.confirmRejectBankRequest"),
      onOk: async () => {
        try {
          await bankRequestService.reject(id);
          message.success(t("admin.bankRequestRejected"));
          fetchBankRequests();
        } catch (error) {
          console.error("Error rejecting bank request:", error);
          message.error(t("admin.actionFailed"));
        }
      },
    });
  };

  const handleDeleteBankRequest = async (id: string) => {
    try {
      await bankRequestService.delete(id);
      message.success(t("common.deleteSuccess"));
      fetchBankRequests();
    } catch (error) {
      console.error("Error deleting bank request:", error);
      message.error(t("common.deleteFailed"));
    }
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

  const handleViewBankRequestDetails = (request: BankRequest) => {
    setSelectedBankRequest(request);
    setRequestType("bank");
    setDetailsModalOpen(true);
  };

  // Helper function to get bank name by ID
  const getBankName = (bankId?: string): string => {
    if (!bankId) return t("common.notAvailable");
    const bank = banks.find((b) => b.id === bankId);
    return bank?.name ?? `Bank ID: ${bankId.substring(0, 8)}...`;
  };

  const bankRequestColumns = [
    {
      title: t("admin.fullName"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("admin.email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("admin.phone"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("loanCalculator.selectBank"),
      key: "bank",
      render: (_: unknown, record: BankRequest) => {
        if (loadingBanks) {
          return <Tag color="processing">{t("common.loading")}</Tag>;
        }

        const bankName = getBankName(record.bankId);
        const isNotAvailable = bankName === t("common.notAvailable");
        const isBankId = bankName.startsWith("Bank ID:");

        return (
          <Tag
            color={isNotAvailable ? "default" : isBankId ? "warning" : "blue"}
          >
            {bankName}
          </Tag>
        );
      },
    },
    {
      title: t("admin.experience"),
      key: "experience",
      render: (_: unknown, record: BankRequest) =>
        `${record.yearsOfExperience ?? 0} ${t("admin.years")}`,
    },
    {
      title: t("admin.status"),
      key: "status",
      render: (_: unknown, record: BankRequest) => (
        <Tag
          color={
            record.status === "approved"
              ? "green"
              : record.status === "rejected"
                ? "red"
                : "orange"
          }
        >
          {record.status === "approved"
            ? t("admin.approved")
            : record.status === "rejected"
              ? t("admin.rejected")
              : t("admin.pending")}
        </Tag>
      ),
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (_: unknown, record: BankRequest) => (
        <Space>
          <Button
            size="small"
            icon={<Eye size={14} />}
            onClick={() => handleViewBankRequestDetails(record)}
          >
            {t("admin.viewDetails")}
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircle size={14} />}
                onClick={() => handleApproveBankRequest(record.id)}
              >
                {t("admin.approve")}
              </Button>
              <Button
                danger
                size="small"
                icon={<XCircle size={14} />}
                onClick={() => handleRejectBankRequest(record.id)}
              >
                {t("admin.reject")}
              </Button>
            </>
          )}
          <Popconfirm
            title={t("common.deleteConfirm")}
            description={t("common.deleteConfirmMessage")}
            onConfirm={() => handleDeleteBankRequest(record.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button danger size="small" icon={<Trash2 size={14} />}>
              {t("common.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
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
        {/* Filters */}
        <div className="mb-6 flex gap-4">
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
            <div className="mb-4">
              <Select
                placeholder={t("admin.selectStatus")}
                value={bankRequestStatus}
                onChange={setBankRequestStatus}
                allowClear
                style={{ width: 200 }}
              >
                <Option value="pending">{t("admin.pending")}</Option>
                <Option value="approved">{t("admin.approved")}</Option>
                <Option value="rejected">{t("admin.rejected")}</Option>
              </Select>
            </div>
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
          setSelectedBankRequest(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailsModalOpen(false);
              setSelectedUser(null);
              setSelectedBankRequest(null);
            }}
          >
            {t("common.close")}
          </Button>,
        ]}
        width={700}
      >
        {selectedBankRequest && requestType === "bank" && (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedBankRequest.fullName}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedBankRequest.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBankRequest.phone}
                </p>
              </div>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label={t("admin.status")}>
                <Tag
                  color={
                    selectedBankRequest.status === "approved"
                      ? "green"
                      : selectedBankRequest.status === "rejected"
                        ? "red"
                        : "orange"
                  }
                >
                  {selectedBankRequest.status === "approved"
                    ? t("admin.approved")
                    : selectedBankRequest.status === "rejected"
                      ? t("admin.rejected")
                      : t("admin.pending")}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("loanCalculator.selectBank")}>
                <Tag color={selectedBankRequest.bankId ? "blue" : "default"}>
                  {getBankName(selectedBankRequest.bankId)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("admin.requestNote")}>
                {selectedBankRequest.note ?? t("common.notAvailable")}
              </Descriptions.Item>
              <Descriptions.Item label={t("admin.experience")}>
                {selectedBankRequest.yearsOfExperience ?? 0} {t("admin.years")}
              </Descriptions.Item>
              <Descriptions.Item label={t("admin.supportingDocument")}>
                {selectedBankRequest.imageUrl ? (
                  <a
                    href={selectedBankRequest.imageUrl}
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
              <Descriptions.Item label={t("admin.createdAt")}>
                {new Date(selectedBankRequest.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t("admin.lastUpdated")}>
                {new Date(selectedBankRequest.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        {selectedUser && requestType === "broker" && (
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

              {selectedUser.roleRequests &&
                typeof selectedUser.roleRequests === "object" && (
                  <>
                    <Descriptions.Item label={t("admin.requestNote")}>
                      {(selectedUser.roleRequests as { note?: string }).note ??
                        t("common.notAvailable")}
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
