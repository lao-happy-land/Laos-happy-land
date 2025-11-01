"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { settingService } from "@/share/service/setting.service";
import type { Setting } from "@/share/service/setting.service";
import {
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Building2,
  MapPin,
  Phone,
  Mail,
  Lightbulb,
  Shield,
  Link,
  Sparkles,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function AboutPageClient() {
  const t = useTranslations();
  const [setting, setSetting] = useState<Setting | null>(null);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const data = await settingService.getSetting();
        setSetting(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    void fetchSetting();
  }, []);

  const historyTimeline = [
    {
      year: "2018",
      title: t("about.history2018Title"),
      description: t("about.history2018Description"),
    },
    {
      year: "2021-2023",
      title: t("about.history2021Title"),
      description: t("about.history2021Description"),
    },
    {
      year: "2023-2024",
      title: t("about.history2023Title"),
      description: t("about.history2023Description"),
    },
    {
      year: "2025",
      title: t("about.history2025Title"),
      description: t("about.history2025Description"),
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: t("about.value1Title"),
      description: t("about.value1Description"),
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Link,
      title: t("about.value2Title"),
      description: t("about.value2Description"),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Shield,
      title: t("about.value3Title"),
      description: t("about.value3Description"),
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Sparkles,
      title: t("about.value4Title"),
      description: t("about.value4Description"),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: Lightbulb,
      title: t("about.value5Title"),
      description: t("about.value5Description"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      icon: Briefcase,
      title: t("about.value6Title"),
      description: t("about.value6Description"),
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  const whyChooseUs = [
    {
      icon: Building2,
      title: t("about.reason1Title"),
      description: t("about.reason1Description"),
    },
    {
      icon: Sparkles,
      title: t("about.reason2Title"),
      description: t("about.reason2Description"),
    },
    {
      icon: Users,
      title: t("about.reason3Title"),
      description: t("about.reason3Description"),
    },
    {
      icon: Shield,
      title: t("about.reason4Title"),
      description: t("about.reason4Description"),
    },
    {
      icon: Award,
      title: t("about.reason5Title"),
      description: t("about.reason5Description"),
    },
    {
      icon: Globe,
      title: t("about.reason6Title"),
      description: t("about.reason6Description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("about.headline")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-white/90">
              {t("about.subheadline")}
            </p>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.historyTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t("about.historySubtitle")}
            </p>
          </div>

          <div className="relative">
            {/* Enhanced Timeline line with gradient */}
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-1 -translate-x-1/2 bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 lg:block" />
            <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-red-600 to-orange-600 lg:block" />

            <div className="space-y-16">
              {historyTimeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row"
                  }`}
                >
                  {/* Year badge with enhanced styling */}
                  <div className="hidden lg:block lg:flex-1">
                    {index % 2 === 0 && (
                      <div className="text-right">
                        <div className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                          <div className="relative flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold">
                              {item.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced content card */}
                  <div className="flex-1">
                    <div className="group relative rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-red-200">
                      {/* Mobile year badge */}
                      <div className="mb-4 flex items-center gap-3 lg:hidden">
                        <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2 text-white shadow-lg">
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold">{item.year}</span>
                        </div>
                      </div>

                      {/* Content with enhanced typography */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-red-600">
                          {item.title}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-20"></div>
                      <div className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 opacity-20"></div>
                    </div>
                  </div>

                  {/* Year badge (right side) with enhanced styling */}
                  <div className="hidden lg:block lg:flex-1">
                    {index % 2 !== 0 && (
                      <div className="text-left">
                        <div className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 opacity-75 blur transition duration-300 group-hover:opacity-100"></div>
                          <div className="relative flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold">
                              {item.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline end decoration */}
            <div className="absolute -bottom-4 left-1/2 hidden h-8 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 shadow-lg lg:block">
              <div className="flex h-full w-full items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.visionMissionTitle")}
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Vision */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl ring-1 ring-blue-200">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                  <Globe className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.vision")}
                </h2>
              </div>
              <p className="mb-4 text-lg leading-relaxed text-gray-700">
                {t("about.visionDescription")}
              </p>
            </div>

            {/* Mission */}
            <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-8 shadow-xl ring-1 ring-red-200">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg">
                  <Target className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.mission")}
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-700">
                {t("about.missionDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.coreValuesTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              {t("about.coreValuesSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl ${value.bgColor} ${value.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.whyChooseTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t("about.whyChooseSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((reason, index) => (
              <div
                key={index}
                className="group rounded-xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                  <reason.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {reason.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              {t("about.commitmentTitle")}
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-xl text-white/90">
              {t("about.commitmentQuote")}
            </p>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-8 text-left backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {t("about.commitment1Title")}
                  </h3>
                </div>
                <p className="leading-relaxed text-white/90">
                  {t("about.commitment1Description")}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-8 text-left backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {t("about.commitment2Title")}
                  </h3>
                </div>
                <p className="leading-relaxed text-white/90">
                  {t("about.commitment2Description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.contact")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t("about.contactDescription")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("about.address")}
              </h3>
              <p className="text-gray-600">{t("about.addressValue")}</p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("about.phone")}
              </h3>
              <p className="text-gray-600">
                {setting?.hotline ?? t("about.phoneValue")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-200">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {t("about.email")}
              </h3>
              <p className="text-gray-600">{t("about.emailValue")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
