"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
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
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-600 text-white">
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
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 p-2 shadow-2xl ring-2 ring-white/20 backdrop-blur-sm">
                <Image
                  src="/images/logo.png"
                  alt="Laohappyland Logo"
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold text-transparent">
              {t("about.title")}
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-blue-100">
              {t("about.subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Heart className="h-5 w-5 text-red-400" />
                <span className="text-sm font-medium">
                  {t("about.foundedIn")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <MapPin className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium">
                  {t("about.location")}
                </span>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">
                  {t("about.teamSize")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Mission */}
            <div className="space-y-6">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("about.mission")}
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                {t("about.missionDescription")}
              </p>
              <div className="space-y-3">
                {[
                  t("about.missionPoint1"),
                  t("about.missionPoint2"),
                  t("about.missionPoint3"),
                  t("about.missionPoint4"),
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div className="space-y-6">
              <div className="mb-6 flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t("about.vision")}
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                {t("about.visionDescription")}
              </p>
              <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                <blockquote className="text-lg font-medium text-purple-800 italic">
                  &quot;{t("about.visionQuote")}&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t("about.ourValues")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t("about.valuesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: t("about.value1Title"),
                description: t("about.value1Description"),
                color: "from-blue-500 to-cyan-600",
              },
              {
                icon: Award,
                title: t("about.value2Title"),
                description: t("about.value2Description"),
                color: "from-green-500 to-emerald-600",
              },
              {
                icon: Heart,
                title: t("about.value3Title"),
                description: t("about.value3Description"),
                color: "from-red-500 to-pink-600",
              },
              {
                icon: TrendingUp,
                title: t("about.value4Title"),
                description: t("about.value4Description"),
                color: "from-purple-500 to-indigo-600",
              },
            ].map((value, index) => (
              <div key={index} className="group">
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${value.color} mb-6 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-red-800 to-orange-700 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">{t("about.ourImpact")}</h2>
            <p className="mx-auto max-w-3xl text-xl text-blue-100">
              {t("about.impactDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: "10,000+", label: t("about.stat1") },
              { number: "500+", label: t("about.stat2") },
              { number: "50+", label: t("about.stat3") },
              { number: "99%", label: t("about.stat4") },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                  <div className="mb-2 text-4xl font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="font-medium text-blue-100">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t("about.ourTeam")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t("about.teamDescription")}
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                  {t("about.teamTitle")}
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-gray-600">
                  {t("about.teamContent")}
                </p>
                <div className="space-y-4">
                  {[
                    t("about.teamPoint1"),
                    t("about.teamPoint2"),
                    t("about.teamPoint3"),
                    t("about.teamPoint4"),
                  ].map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8">
                  <div className="text-center text-white">
                    <Users className="mx-auto mb-4 h-24 w-24 opacity-80" />
                    <h4 className="text-xl font-bold">{t("about.teamSize")}</h4>
                    <p className="text-blue-100">{t("about.teamMembers")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {t("about.getInTouch")}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t("about.contactDescription")}
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {t("about.phone")}
                </h3>
                <p className="text-gray-600">+856 205 872 1100</p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("about.phoneHours")}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {t("about.email")}
                </h3>
                <p className="text-gray-600">info@laohappyland.com</p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("about.emailResponse")}
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {t("about.address")}
                </h3>
                <p className="text-sm text-gray-500">{t("footer.address")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
