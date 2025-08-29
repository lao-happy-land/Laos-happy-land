"use client";

import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  Button,
  Select,
  Card,
  message,
  Input as AntInput,
  Spin,
  Empty,
  Row,
  Col,
  Typography,
  Pagination,
} from "antd";
import { Plus, Search } from "lucide-react";
import { userService } from "@/share/service/user.service";
import UserModal from "./user-modal";
import { useUserRoles } from "@/share/hook/useUserRoles";
import { getColumns } from "./user-columns";

const { Title, Text } = Typography;

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

export default function Users() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openModal, setOpenModal] = useState<"create" | "update">("create");
  const [isVisible, setIsModalVisible] = useState(false);

  const [searchInputValue, setSearchInputValue] = useState(
    searchParams.get("search") ?? "",
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const [filterRole, setFilterRole] = useState(searchParams.get("role") ?? "");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Sync URL params with component state
  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    const urlRole = searchParams.get("role") ?? "";
    const urlPage = parseInt(searchParams.get("page") ?? "1");
    const urlPageSize = parseInt(searchParams.get("pageSize") ?? "10");

    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
      setSearchInputValue(urlSearch);
    }
    if (urlRole !== filterRole) setFilterRole(urlRole);
    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlPageSize !== pageSize) setPageSize(urlPageSize);
  }, [searchParams, searchTerm, filterRole, currentPage, pageSize]);

  const {
    data: usersData = { data: [], meta: { itemCount: 0, pageCount: 0 } },
    loading: usersLoading,
    refresh: refreshUsers,
  } = useRequest(
    async () => {
      const response = await userService.getAllUsers({
        search: searchTerm || undefined,
        role: filterRole || undefined,
        page: currentPage,
        perPage: pageSize,
      });
      return response as unknown as {
        data: User[];
        meta: {
          itemCount: number;
          pageCount: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
        };
      };
    },
    {
      refreshDeps: [searchTerm, filterRole, currentPage, pageSize],
      onSuccess: (data) => {
        setTotal(data.meta.itemCount ?? 0);
      },
      onError: (error) => {
        console.error("Error loading users:", error);
        message.error("Không thể tải danh sách người dùng. Vui lòng thử lại.");
      },
    },
  );

  const users = usersData.data || [];

  const { userRoles, rolesLoading } = useUserRoles();

  const { runAsync: deleteUser, loading: deletingUser } = useRequest(
    async (userId: string) => {
      await userService.deleteUser(userId);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Xóa người dùng thành công!");
        refreshUsers();
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
        message.error("Không thể xóa người dùng. Vui lòng thử lại.");
      },
    },
  );

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
  };

  const updateURLParams = (params: Record<string, string | number>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === "" || value === 0) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleSearch = () => {
    setSearchTerm(searchInputValue);
    updateURLParams({ search: searchInputValue, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
  };

  const handleRoleChange = (value: string) => {
    const roleValue = value === "all" ? "" : value;
    setFilterRole(roleValue);
    updateURLParams({ role: roleValue, page: 1 });
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    updateURLParams({ page, pageSize: size });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setOpenModal("update");
    setIsModalVisible(true);
  };

  const handleOpenModal = (action: "create" | "update") => {
    setOpenModal(action);
    setIsModalVisible(true);
  };

  if (usersLoading || rolesLoading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý người dùng
            </Title>
            <Text type="secondary">
              Quản lý tài khoản người dùng trong hệ thống
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => handleOpenModal("create")}
              size="large"
            >
              Thêm người dùng
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Search and Filter */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <AntInput
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchInputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<Search size={16} />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Select
              placeholder="Tất cả vai trò"
              value={filterRole || "all"}
              onChange={handleRoleChange}
              style={{ width: 200 }}
            >
              <Select.Option key="all" value="all">
                Tất cả vai trò
              </Select.Option>
              {userRoles.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {typeof role.name === "string" ? role.name : "Unknown Role"}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={getColumns(handleEditUser, handleDeleteUser, deletingUser)}
          dataSource={users}
          rowKey="id"
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                description={
                  searchTerm || filterRole
                    ? "Không tìm thấy người dùng phù hợp với bộ lọc."
                    : "Bắt đầu bằng cách thêm người dùng đầu tiên."
                }
              />
            ),
          }}
        />
        <Pagination
          style={{ marginTop: "20px" }}
          align="center"
          total={total}
          onChange={handlePaginationChange}
          current={currentPage}
          pageSize={pageSize}
        />
      </Card>

      <UserModal
        isOpen={isVisible}
        onClose={() => setIsModalVisible(false)}
        user={selectedUser}
        action={openModal}
        refreshUsers={refreshUsers}
      />
    </div>
  );
}
