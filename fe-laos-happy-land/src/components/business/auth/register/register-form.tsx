"use client";

import { useState } from "react";
import { Form, Input, Button, Row, Col, App, Divider } from "antd";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from "@/share/service/auth.service";
import GoogleLoginButton from "../google-login-button";

interface RegisterFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function RegisterForm({
  onSuccess,
  onError,
}: RegisterFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      await authService.register({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        password: values.password,
      });

      message.success("Đăng ký thành công!");
      if (onSuccess) {
        onSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
      }
      form.resetFields();
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (error as { message?: string })?.message ??
        "Đăng ký thất bại";
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
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>
      </Row>

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
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" },
          { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
        ]}
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

      <Form.Item
        label="Xác nhận mật khẩu"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Vui lòng xác nhận mật khẩu!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="Nhập lại mật khẩu"
          iconRender={(visible) =>
            visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )
          }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={loading}
          icon={<UserPlus className="h-4 w-4" />}
        >
          Đăng ký
        </Button>
      </Form.Item>

      <Divider>Hoặc</Divider>

      <Form.Item>
        <GoogleLoginButton onError={onError}>
          Đăng ký với Google
        </GoogleLoginButton>
      </Form.Item>
    </Form>
  );
}
