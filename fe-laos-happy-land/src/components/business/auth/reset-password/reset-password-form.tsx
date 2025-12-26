"use client";

import { useState } from "react";
import { Form, Input, Button, App, Steps } from "antd";
import {
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import authService from "@/share/service/auth.service";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";

interface ResetPasswordFormProps {
  onError?: (error: string) => void;
}

export default function ResetPasswordForm({ onError }: ResetPasswordFormProps) {
  const { message } = App.useApp();
  const [step1Form] = Form.useForm();
  const [step2Form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState<string>("");
  const t = useTranslations();
  const router = useRouter();
  const locale = useUrlLocale();

  const handleSendCode = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authService.sendResetCode(values.email);
      setEmail(values.email);
      setCurrentStep(1);
      message.success(t("auth.resetPasswordCodeSent"));
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (error as { message?: string })?.message ??
        t("auth.sendCodeFailed");
      if (onError) {
        onError(errorMessage);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: {
    code: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t("auth.passwordsDoNotMatch"));
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordWithCode(
        email,
        values.code,
        values.newPassword,
      );
      message.success(t("auth.passwordResetSuccess"));
      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ??
        (error as { message?: string })?.message ??
        t("auth.resetPasswordFailed");
      if (onError) {
        onError(errorMessage);
      } else {
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setCurrentStep(0);
    step2Form.resetFields();
  };

  return (
    <div>
      <Steps
        current={currentStep}
        items={[
          {
            title: t("auth.enterEmail"),
          },
          {
            title: t("auth.resetPassword"),
          },
        ]}
        className="mb-8"
      />

      {currentStep === 0 && (
        <Form
          form={step1Form}
          layout="vertical"
          onFinish={handleSendCode}
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
            <Input
              placeholder={t("auth.enterYourEmail")}
              prefix={<Mail className="h-4 w-4 text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {t("auth.sendResetCode")}
            </Button>
          </Form.Item>
        </Form>
      )}

      {currentStep === 1 && (
        <Form
          form={step2Form}
          layout="vertical"
          onFinish={handleResetPassword}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            label={t("auth.verificationCode")}
            name="code"
            rules={[
              { required: true, message: t("auth.pleaseEnterCode") },
              {
                pattern: /^\d{6}$/,
                message: t("auth.codeMustBe6Digits"),
              },
            ]}
          >
            <Input
              placeholder={t("auth.enterVerificationCode")}
              prefix={<KeyRound className="h-4 w-4 text-gray-400" />}
              maxLength={6}
            />
          </Form.Item>

          <Form.Item
            label={t("auth.newPassword")}
            name="newPassword"
            rules={[
              { required: true, message: t("auth.pleaseEnterNewPassword") },
              { min: 6, message: t("auth.passwordMinLength") },
            ]}
          >
            <Input.Password
              placeholder={t("auth.enterNewPassword")}
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
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: t("auth.pleaseConfirmPassword") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("auth.passwordsDoNotMatch")),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder={t("auth.confirmNewPassword")}
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
            <div className="flex gap-2">
              <Button
                onClick={handleBackToStep1}
                className="flex-1"
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                {t("auth.back")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="flex-1"
                loading={loading}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                {t("auth.resetPassword")}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
