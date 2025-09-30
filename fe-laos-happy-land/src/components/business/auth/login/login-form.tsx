"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, App, Divider } from "antd";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuthStore } from "@/share/store/auth.store";
import GoogleLoginButton from "../google-login-button";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  onError?: (error: string) => void;
  redirectUrl?: string;
}

export default function LoginForm({ onError, redirectUrl }: LoginFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const t = useTranslations();

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
        t("auth.loginFailed");
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
        label={t("auth.email")}
        name="email"
        rules={[
          { required: true, message: t("auth.pleaseEnterEmail") },
          { type: "email", message: t("auth.invalidEmail") },
        ]}
      >
        <Input placeholder={t("auth.enterYourEmail")} />
      </Form.Item>

      <Form.Item
        label={t("auth.password")}
        name="password"
        rules={[{ required: true, message: t("auth.pleaseEnterPassword") }]}
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

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>{t("auth.rememberLogin")}</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          loading={loading}
          icon={<LogIn className="h-4 w-4" />}
        >
          {t("auth.login")}
        </Button>
      </Form.Item>

      <Divider>{t("auth.or")}</Divider>

      <Form.Item>
        <GoogleLoginButton redirectUrl={redirectUrl} onError={onError} />
      </Form.Item>
    </Form>
  );
}
