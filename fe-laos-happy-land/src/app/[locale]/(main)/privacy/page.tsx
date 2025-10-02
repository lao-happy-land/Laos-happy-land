"use client";

import { useTranslations } from "next-intl";
import {
  Shield,
  Eye,
  Lock,
  FileText,
  Users,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl ring-2 ring-white/20 backdrop-blur-sm">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold text-transparent">
              {t("privacy.title")}
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-blue-100">
              {t("privacy.subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Clock className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">
                  {t("privacy.lastUpdated")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">
                  {t("privacy.gdprCompliant")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">
                  {t("privacy.secureData")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-blue-50/30 p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    {t("privacy.quickOverview")}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-600">
                    {t("privacy.overviewDescription")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Information We Collect */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                    <Database className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {t("privacy.informationWeCollect")}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      {t("privacy.personalInformation")}
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.personalInfo1")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.personalInfo2")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.personalInfo3")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.personalInfo4")}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">
                      {t("privacy.automaticallyCollected")}
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.autoInfo1")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.autoInfo2")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.autoInfo3")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.autoInfo4")}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {t("privacy.howWeUseInfo")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: t("privacy.usePurpose1"),
                      description: t("privacy.usePurpose1Desc"),
                      icon: "🏠",
                    },
                    {
                      title: t("privacy.usePurpose2"),
                      description: t("privacy.usePurpose2Desc"),
                      icon: "📞",
                    },
                    {
                      title: t("privacy.usePurpose3"),
                      description: t("privacy.usePurpose3Desc"),
                      icon: "📧",
                    },
                    {
                      title: t("privacy.usePurpose4"),
                      description: t("privacy.usePurpose4Desc"),
                      icon: "🔒",
                    },
                  ].map((purpose, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6"
                    >
                      <div className="mb-3 flex items-center space-x-3">
                        <span className="text-2xl">{purpose.icon}</span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {purpose.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{purpose.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Sharing */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {t("privacy.dataSharing")}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-red-500" />
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-red-800">
                          {t("privacy.weDoNotSell")}
                        </h3>
                        <p className="text-red-700">
                          {t("privacy.weDoNotSellDesc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {t("privacy.whenWeShare")}
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.shareReason1")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.shareReason2")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.shareReason3")}</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{t("privacy.shareReason4")}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {t("privacy.dataSecurity")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[
                    {
                      title: t("privacy.securityMeasure1"),
                      description: t("privacy.securityMeasure1Desc"),
                      color: "from-blue-500 to-cyan-600",
                    },
                    {
                      title: t("privacy.securityMeasure2"),
                      description: t("privacy.securityMeasure2Desc"),
                      color: "from-green-500 to-emerald-600",
                    },
                    {
                      title: t("privacy.securityMeasure3"),
                      description: t("privacy.securityMeasure3Desc"),
                      color: "from-purple-500 to-pink-600",
                    },
                    {
                      title: t("privacy.securityMeasure4"),
                      description: t("privacy.securityMeasure4Desc"),
                      color: "from-orange-500 to-red-600",
                    },
                  ].map((measure, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6"
                    >
                      <div
                        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${measure.color} mb-4`}
                      ></div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {measure.title}
                      </h3>
                      <p className="text-gray-600">{measure.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Rights */}
              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
                <div className="mb-6 flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {t("privacy.yourRights")}
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: t("privacy.right1"),
                      description: t("privacy.right1Desc"),
                      icon: "👁️",
                    },
                    {
                      title: t("privacy.right2"),
                      description: t("privacy.right2Desc"),
                      icon: "✏️",
                    },
                    {
                      title: t("privacy.right3"),
                      description: t("privacy.right3Desc"),
                      icon: "🗑️",
                    },
                    {
                      title: t("privacy.right4"),
                      description: t("privacy.right4Desc"),
                      icon: "📤",
                    },
                    {
                      title: t("privacy.right5"),
                      description: t("privacy.right5Desc"),
                      icon: "🚫",
                    },
                    {
                      title: t("privacy.right6"),
                      description: t("privacy.right6Desc"),
                      icon: "📞",
                    },
                  ].map((right, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 p-4"
                    >
                      <span className="text-2xl">{right.icon}</span>
                      <div>
                        <h3 className="mb-1 text-lg font-semibold text-gray-800">
                          {right.title}
                        </h3>
                        <p className="text-gray-600">{right.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-3xl font-bold">
                    {t("privacy.contactUs")}
                  </h2>
                  <p className="text-xl text-blue-100">
                    {t("privacy.contactDescription")}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {t("privacy.emailUs")}
                    </h3>
                    <p className="text-blue-100">privacy@laohappyland.com</p>
                    <p className="mt-1 text-sm text-blue-200">
                      {t("privacy.emailResponse")}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">
                      {t("privacy.callUs")}
                    </h3>
                    <p className="text-blue-100">+856 20 1234 5678</p>
                    <p className="mt-1 text-sm text-blue-200">
                      {t("privacy.phoneHours")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              <div className="rounded-2xl border border-gray-200 bg-gray-100 p-6">
                <div className="text-center">
                  <p className="mb-2 text-gray-600">
                    <strong>{t("privacy.lastUpdated")}:</strong>{" "}
                    {t("privacy.lastUpdatedDate")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t("privacy.updateNote")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
