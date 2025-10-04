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
  Star,
  TrendingUp,
} from "lucide-react";

export default function AboutPageClient() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t("about.title")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-white/90">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Mission */}
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.mission")}
                </h2>
              </div>
              <p className="leading-relaxed text-gray-600">
                {t("about.missionDescription")}
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("about.vision")}
                </h2>
              </div>
              <p className="leading-relaxed text-gray-600">
                {t("about.visionDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.values")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t("about.valuesDescription")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Heart,
                title: t("about.value1Title"),
                description: t("about.value1Description"),
                color: "text-red-600",
                bgColor: "bg-red-100",
              },
              {
                icon: Award,
                title: t("about.value2Title"),
                description: t("about.value2Description"),
                color: "text-yellow-600",
                bgColor: "bg-yellow-100",
              },
              {
                icon: Users,
                title: t("about.value3Title"),
                description: t("about.value3Description"),
                color: "text-blue-600",
                bgColor: "bg-blue-100",
              },
              {
                icon: TrendingUp,
                title: t("about.value4Title"),
                description: t("about.value4Description"),
                color: "text-green-600",
                bgColor: "bg-green-100",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-50 p-6 text-center transition-all duration-300 hover:bg-white hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-xl ${value.bgColor} ${value.color} mb-4`}
                >
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
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

      {/* Stats */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("about.achievements")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
              {t("about.achievementsDescription")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "500+",
                label: t("about.stat1"),
                icon: Building2,
              },
              {
                number: "1000+",
                label: t("about.stat2"),
                icon: Users,
              },
              {
                number: "50+",
                label: t("about.stat3"),
                icon: Award,
              },
              {
                number: "99%",
                label: t("about.stat4"),
                icon: Star,
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 text-4xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("about.team")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              {t("about.teamDescription")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "John Doe",
                role: t("about.ceo"),
                image: "/images/team/ceo.jpg",
                description: t("about.ceoDescription"),
              },
              {
                name: "Jane Smith",
                role: t("about.cto"),
                image: "/images/team/cto.jpg",
                description: t("about.ctoDescription"),
              },
              {
                name: "Mike Johnson",
                role: t("about.cmo"),
                image: "/images/team/cmo.jpg",
                description: t("about.cmoDescription"),
              },
            ].map((member, index) => (
              <div
                key={index}
                className="rounded-xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-200 transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative mx-auto mb-4 h-32 w-32">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-avatar.jpg";
                    }}
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mb-3 font-medium text-red-600">{member.role}</p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-gray-50 py-20">
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
              <p className="text-gray-600">{t("about.phoneValue")}</p>
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
