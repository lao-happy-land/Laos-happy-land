"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "antd";
import RegisterForm from "@/components/business/auth/register/register-form";
import {
  UserPlus,
  ArrowLeft,
  Building2,
  Shield,
  Users,
  Award,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Register() {
  const router = useRouter();
  const locale = useUrlLocale();
  const t = useTranslations();
  const [registerError, setRegisterError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="flex min-h-screen">
        {/* Left side - Background Image */}
        <div className="relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
          <Image
            src="/images/auth/register-background.jpg"
            alt="Register Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 px-8 text-center text-white">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold">{t("auth.joinUs")}</h1>
            <p className="mb-8 text-xl text-orange-100">
              {t("auth.startInvestmentJourney")}
            </p>

            {/* Features */}
            <div className="mx-auto max-w-sm space-y-6">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-orange-200" />
                <div className="text-left">
                  <div className="font-semibold">
                    {t("auth.absoluteSecurity")}
                  </div>
                  <div className="text-sm text-orange-100">
                    {t("auth.encryptedInfo")}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-orange-200" />
                <div className="text-left">
                  <div className="font-semibold">
                    {t("auth.investmentCommunity")}
                  </div>
                  <div className="text-sm text-orange-100">
                    {t("auth.connectInvestors")}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Award className="h-8 w-8 text-orange-200" />
                <div className="text-left">
                  <div className="font-semibold">
                    {t("auth.exclusiveBenefits")}
                  </div>
                  <div className="text-sm text-orange-100">
                    {t("auth.earlyAccess")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register Form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-8 text-center">
              <Link
                href={`/${locale}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#fc746f]"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("auth.backToHome")}
              </Link>

              <div className="mb-6 flex items-center justify-center lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <UserPlus className="h-6 w-6 text-[#fc746f]" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                {t("auth.createAccount")}
              </h2>
              <p className="mt-2 text-gray-600">
                {t("auth.joinLaosHappyLand")}
              </p>
            </div>

            {/* Register Form */}
            {registerError && (
              <Alert
                message={t("auth.registrationError")}
                description={registerError}
                type="error"
                showIcon
                closable
                onClose={() => setRegisterError("")}
                className="mb-6"
              />
            )}

            {successMessage && (
              <Alert
                message={t("auth.registrationSuccess")}
                description={successMessage}
                type="success"
                showIcon
                closable
                onClose={() => setSuccessMessage("")}
                className="mb-6"
              />
            )}

            <RegisterForm
              onSuccess={() => {
                setRegisterError("");
                setSuccessMessage(t("auth.registrationSuccessMessage"));
                setTimeout(() => {
                  router.push(`/${locale}/login`);
                }, 2000);
              }}
              onError={(error) => {
                setRegisterError(error);
                setSuccessMessage("");
              }}
            />

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link
                  href={`/${locale}/login`}
                  className="font-semibold text-[#fc746f] transition-colors hover:text-[#ff8a80]"
                >
                  {t("auth.loginNow")}
                </Link>
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                {t("auth.byRegistering")}{" "}
                <Link
                  href={`/${locale}/terms-of-use`}
                  className="text-[#fc746f] hover:text-[#ff8a80]"
                >
                  {t("auth.termsOfUse")}
                </Link>{" "}
                {t("auth.and")}{" "}
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="text-[#fc746f] hover:text-[#ff8a80]"
                >
                  {t("auth.privacyPolicy")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
