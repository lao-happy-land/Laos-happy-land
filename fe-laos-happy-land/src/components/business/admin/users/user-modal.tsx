import type { CreateUserDto, UpdateUserDto } from "@/@types/gentype-axios";
import { Col, Form, Input, Modal, Row, Select, message } from "antd";
import { useEffect } from "react";
import { useUserRoles } from "@/share/hook/useUserRoles";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";

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

export default function UserModal({
  isOpen,
  onClose,
  user,
  action,
  refreshUsers,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  action: "create" | "update";
  refreshUsers: () => void;
}) {
  const [form] = Form.useForm();
  const { userRoles } = useUserRoles();

  useEffect(() => {
    if (user && action === "update") {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: user.role.id,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ roleId: userRoles?.[0]?.id ?? "" });
    }
  }, [form, user, action, userRoles]);

  const { runAsync: createUser } = useRequest(
    async (values: CreateUserDto) => {
      await userService.createUser(values);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Tạo người dùng thành công!");
        onClose();
        refreshUsers();
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        message.error(
          "Không thể tạo người dùng. Vui lòng kiểm tra thông tin và thử lại.",
        );
      },
    },
  );

  const { runAsync: updateUser } = useRequest(
    async (values: UpdateUserDto) => {
      await userService.updateUser(user?.id ?? "", values);
    },
    {
      manual: true,
      onSuccess: () => {
        message.success("Cập nhật người dùng thành công!");
        onClose();
        refreshUsers();
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        message.error(
          "Không thể cập nhật người dùng. Vui lòng kiểm tra thông tin và thử lại.",
        );
      },
    },
  );

  const handleSubmit = async (values: CreateUserDto | UpdateUserDto) => {
    try {
      if (action === "create") {
        await createUser(values as CreateUserDto);
      } else {
        await updateUser(values as UpdateUserDto);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={action === "create" ? "Tạo người dùng" : "Cập nhật người dùng"}
      onOk={() => {
        form.submit();
      }}
      okText={action === "create" ? "Tạo" : "Cập nhật"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label="Vai trò"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select
                options={userRoles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>
        {action === "create" && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
