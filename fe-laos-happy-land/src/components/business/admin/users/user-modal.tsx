import type { CreateUserDto, UpdateUserDto } from "@/@types/gentype-axios";
import { Col, Form, Input, Modal, Row, Select, App } from "antd";
import { useEffect } from "react";
import { useUserRoles } from "@/share/hook/useUserRoles";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import { useTranslations } from "next-intl";

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
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { userRoles } = useUserRoles();
  const t = useTranslations();

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
        message.success(t("admin.createUserSuccess"));
        onClose();
        refreshUsers();
      },
      onError: (error) => {
        console.error("Error creating user:", error);
        message.error(t("admin.createUserFailed"));
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
        message.success(t("admin.updateUserSuccess"));
        onClose();
        refreshUsers();
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        message.error(t("admin.updateUserFailed"));
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
    } catch {
      console.error("Error submitting form:");
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        action === "create" ? t("admin.createUser") : t("admin.updateUser")
      }
      onOk={() => {
        form.submit();
      }}
      okText={action === "create" ? t("admin.create") : t("admin.update")}
      cancelText={t("admin.cancel")}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="fullName"
          label={t("admin.fullName")}
          rules={[{ required: true, message: t("admin.pleaseEnterFullName") }]}
        >
          <Input />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label={t("admin.email")}
              rules={[
                { required: true, message: t("admin.pleaseEnterEmail") },
                { type: "email", message: t("admin.invalidEmail") },
              ]}
            >
              <Input disabled={action === "update"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="roleId"
              label={t("admin.role")}
              rules={[{ required: true, message: t("admin.pleaseSelectRole") }]}
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
          label={t("admin.phone")}
          rules={[{ required: true, message: t("admin.pleaseEnterPhone") }]}
        >
          <Input />
        </Form.Item>
        {action === "create" && (
          <Form.Item
            name="password"
            label={t("admin.password")}
            rules={[
              { required: true, message: t("admin.pleaseEnterPassword") },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
