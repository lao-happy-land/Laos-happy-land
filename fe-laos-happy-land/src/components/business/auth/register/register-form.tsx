"use client";

import { useState } from "react";
import { Form, Input, Button, Row, Col, App, Divider } from "antd";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { authService } from "@/share/service/auth.service";
import GoogleLoginButton from "../google-login-button";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

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

      message.success(t("auth.registrationSuccess"));
      if (onSuccess) {
        onSuccess(t("auth.registrationSuccessMessage"));
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
        t("auth.registrationFailed");
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
            label={t("auth.fullName")}
            name="fullName"
            rules={[{ required: true, message: t("auth.pleaseEnterFullName") }]}
          >
            <Input placeholder={t("auth.enterFullName")} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t("auth.phone")}
            name="phone"
            rules={[
              { required: true, message: t("auth.pleaseEnterPhone") },
              {
                pattern: /^[0-9]{10,11}$/,
                message: t("auth.invalidPhone"),
              },
            ]}
          >
            <Input placeholder={t("auth.enterPhone")} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={t("auth.email")}
        name="email"
        rules={[
          { required: true, message: t("auth.pleaseEnterEmail") },
          { type: "email", message: t("auth.invalidEmail") },
        ]}
      >
        <Input placeholder={t("auth.enterEmail")} />
      </Form.Item>

      <Form.Item
        label={t("auth.password")}
        name="password"
        rules={[
          { required: true, message: t("auth.pleaseEnterPassword") },
          { min: 6, message: t("auth.passwordMinLength") },
        ]}
      >
        <Input.Password
          placeholder={t("auth.enterPassword")}
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
        label={t("auth.confirmPassword")}
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: t("auth.pleaseConfirmPassword") },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t("auth.passwordMismatch")));
            },
          }),
        ]}
      >
        <Input.Password
          placeholder={t("auth.reEnterPassword")}
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
          {t("auth.register")}
        </Button>
      </Form.Item>

      <Divider>{t("auth.or")}</Divider>

      <Form.Item>
        <GoogleLoginButton onError={onError}>
          {t("auth.registerWithGoogle")}
        </GoogleLoginButton>
      </Form.Item>
    </Form>
  );
}
