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

export const getColumns = (
  handleEditUser: (user: User) => void,
  handleDeleteUser: (id: string) => void,
  deletingUser: boolean,
) => {
  return [
    {
      title: "Người dùng",
      key: "user",
      render: (user: User) => (
        <Space>
          <Avatar src={user.avatar} icon={<User size={16} />} size={40} />
          <div>
            <div style={{ fontWeight: 500 }}>{user.fullName}</div>
            <Text type="secondary">ID: {user.id.slice(0, 8)}...</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      key: "role",
      render: (user: User) => {
        return <Tag color="blue">{user.role.name}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      render: (user: User) => (
        <Text>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (user: User) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEditUser(user)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(user.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              loading={deletingUser}
              title="Xóa"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
};
