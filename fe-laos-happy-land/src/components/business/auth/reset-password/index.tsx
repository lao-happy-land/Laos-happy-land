"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "antd";
import ResetPasswordForm from "@/components/business/auth/reset-password/reset-password-form";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUrlLocale } from "@/utils/locale";

export default function ResetPassword() {
  const [resetError, setResetError] = useState<string>("");
  const t = useTranslations();
  const locale = useUrlLocale();

  return (
    <div className="from-primary-50 to-secondary-50 min-h-screen bg-gradient-to-br via-white">
      <div className="flex min-h-screen">
        <div className="relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
          <Image
            src="/images/auth/login-background.jpg"
            alt="Reset Password Background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 px-8 text-center text-white">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <KeyRound className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">
              {t("auth.resetPassword")}
            </h1>
            <p className="mb-8 text-xl text-orange-100">
              {t("auth.resetPasswordDescription")}
            </p>
          </div>
        </div>

        {/* Right side - Reset Password Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center">
              <Link
                href={`/${locale}/login`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#fc746f]"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.backToLogin")}
              </Link>

              <div className="mb-6 flex items-center justify-center lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <KeyRound className="h-6 w-6 text-[#fc746f]" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                {t("auth.resetPassword")}
              </h2>
              <p className="mt-2 text-gray-600">
                {t("auth.resetPasswordMessage")}
              </p>
            </div>

            {/* Reset Password Form */}
            {resetError && (
              <Alert
                message={t("auth.resetPasswordError")}
                description={resetError}
                type="error"
                showIcon
                closable
                onClose={() => setResetError("")}
                className="mb-6"
              />
            )}

            <ResetPasswordForm
              onError={(error) => {
                setResetError(error);
              }}
            />

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.rememberPassword")}{" "}
                <Link
                  href={`/${locale}/login`}
                  className="font-semibold text-[#fc746f] transition-colors hover:text-[#ff8a80]"
                >
                  {t("auth.backToLogin")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
