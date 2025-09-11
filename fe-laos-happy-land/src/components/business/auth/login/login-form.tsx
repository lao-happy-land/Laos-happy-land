"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, App, Divider } from "antd";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/share/store/auth.store";
import GoogleLoginButton from "../google-login-button";

interface LoginFormProps {
  onError?: (error: string) => void;
  redirectUrl?: string;
}

export default function LoginForm({ onError, redirectUrl }: LoginFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (values: {
    email: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);
    try {
      await login(values.email, values.password, redirectUrl);
      // Redirect happens automatically, no need for success message
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (error as { message?: string })?.message ??
        "Đăng nhập thất bại";
      if (onError) {
        onError(errorMessage);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      requiredMark={false}
      size="large"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      >
        <Input placeholder="Nhập email của bạn" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
      >
        <Input.Password
          placeholder="Nhập mật khẩu"
          iconRender={(visible) =>
            visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Ghi nhớ đăng nhập</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={loading}
          icon={<LogIn className="h-4 w-4" />}
        >
          Đăng nhập
        </Button>
      </Form.Item>

      <Divider>Hoặc</Divider>

      <Form.Item>
        <GoogleLoginButton redirectUrl={redirectUrl} onError={onError} />
      </Form.Item>
    </Form>
  );
}
