"use client";

import { Avatar, Button, Popconfirm, Space, Tag, Typography } from "antd";
import { Edit, Trash2, User } from "lucide-react";

const { Text } = Typography;

interface UserRole {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Utility function to format date consistently
const formatDate = (dateString: string, t: (key: string) => string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return t("common.invalidDate");
  }
};

export const getColumns = (
  handleEditUser: (user: User) => void,
  handleDeleteUser: (id: string) => Promise<void>,
  deletingUser: boolean,
  t: (key: string) => string,
) => {
  return [
    {
      title: t("admin.user"),
      key: "user",
      render: (user: User) => (
        <Space>
          <Avatar
            src={user.avatar ?? undefined}
            icon={<User size={16} />}
            size={40}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{user.fullName}</div>
            <div style={{ fontWeight: 500 }}>{user.id}</div>

            <Text type="secondary">
              {t("admin.id")}: {user.id.slice(0, 8)}...
            </Text>
          </div>
        </Space>
      ),
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
      title: t("admin.role"),
      key: "role",
      render: (user: User) => {
        return <Tag color="blue">{user.role.name}</Tag>;
      },
    },
    {
      title: t("admin.createdAt"),
      key: "createdAt",
      render: (user: User) => <Text>{formatDate(user.createdAt, t)}</Text>,
    },
    {
      title: t("admin.actions"),
      key: "actions",
      render: (user: User) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEditUser(user)}
            title={t("admin.edit")}
          />
          <Popconfirm
            title={t("admin.deleteUser")}
            description={t("admin.deleteUserConfirm")}
            onConfirm={() => handleDeleteUser(user.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              loading={deletingUser}
              title={t("admin.delete")}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
