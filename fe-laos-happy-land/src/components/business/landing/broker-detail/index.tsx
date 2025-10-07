"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { Button, Tabs, Spin, App, Pagination } from "antd";
import { useRequest } from "ahooks";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  Award,
  MessageCircle,
  Share2,
} from "lucide-react";
import Image from "next/image";
import type { UserFeedback } from "@/@types/types";
import { userService } from "@/share/service/user.service";
import propertyService from "@/share/service/property.service";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import FeedbackInput from "./broker-feedback-form";
import { useTranslations } from "next-intl";
import { formatShortLocation } from "@/share/helper/format-location";
import { useCurrencyStore } from "@/share/store/currency.store";
import { numberToString } from "@/share/helper/number-to-string";

const { TabPane } = Tabs;

type BrokerDetailProps = {
  brokerId: string;
};

export default function BrokerDetail({ brokerId }: BrokerDetailProps) {
  const router = useRouter();
  const locale = useUrlLocale();
  const t = useTranslations();
  const { message } = App.useApp();
  const { currency } = useCurrencyStore();
  const [propertiesPagination, setPropertiesPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const [reviewsPagination, setReviewsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Fetch broker data with useRequest
  const { data: broker, loading: brokerLoading } = useRequest(
    async () => {
      const response = await userService.getUserById(brokerId);
      return response.user;
    },
    {
      refreshDeps: [brokerId],
      onError: (error) => {
        console.error("Error fetching broker:", error);
        message.error(t("errors.cannotLoadBroker"));
      },
    },
  );

  // Fetch properties data with useRequest
  const {
    data: propertiesData,
    loading: propertiesLoading,
    run: fetchProperties,
  } = useRequest(
    async () => {
      try {
        const response = await propertyService.getPropertyByUserId(brokerId, {
          page: propertiesPagination.current,
          perPage: propertiesPagination.pageSize,
        });

        // Handle APIResponse structure
        const propertiesArray = response.data ?? [];
        const totalCount = response.meta?.itemCount ?? propertiesArray.length;

        setPropertiesPagination((prev) => ({
          ...prev,
          total: totalCount,
        }));

        return propertiesArray;
      } catch (error) {
        console.error("Error in fetchProperties:", error);
        throw error;
      }
    },
    {
      refreshDeps: [
        propertiesPagination.current,
        propertiesPagination.pageSize,
        currency, // Refetch when currency changes
      ],
      onError: (error) => {
        console.error("Error fetching properties:", error);
        message.error(t("errors.cannotLoadProperties"));
      },
    },
  );

  const properties = propertiesData;

  // Fetch reviews data with useRequest
  const {
    data: reviewsData,
    loading: reviewsLoading,
    run: fetchReviews,
  } = useRequest(
    async () => {
      try {
        const response = await userFeedbackService.getFeedbackByUserId(
          brokerId,
          {
            page: reviewsPagination.current,
            perPage: reviewsPagination.pageSize,
          },
        );

        // Handle API response structure
        if (response && typeof response === "object") {
          const apiResponse = response as {
            data: UserFeedback[];
            meta: { itemCount: number };
          };
          setReviewsPagination((prev) => ({
            ...prev,
            total: apiResponse.meta?.itemCount ?? 0,
          }));
          return apiResponse.data ?? [];
        }

        return [];
      } catch (error) {
        console.error("Error in fetchReviews:", error);
        throw error;
      }
    },
    {
      manual: true,
      onError: (error) => {
        console.error("Error fetching reviews:", error);
        message.error(t("errors.cannotLoadReviews"));
      },
    },
  );

  // Initial data fetch when component mounts or brokerId changes
  useEffect(() => {
    if (brokerId) {
      fetchProperties();
      fetchReviews();
    }
  }, [brokerId, fetchProperties, fetchReviews]);

  const handlePropertiesPageChange = (page: number) => {
    setPropertiesPagination((prev) => ({ ...prev, current: page }));
    fetchProperties();
  };

  const handleReviewsPageChange = (page: number) => {
    setReviewsPagination((prev) => ({ ...prev, current: page }));
    fetchReviews();
  };

  const formatPrice = (price: number) => {
    return numberToString(price, locale, currency);
  };

  if (brokerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("brokerDetail.noBrokerFound")}
            </h1>
            <Button
              type="primary"
              onClick={() => router.push(`/${locale}/brokers`)}
              className="mt-4"
            >
              {t("brokerDetail.backToBrokerList")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 pb-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-8">
          {/* Back Button */}
          <Button
            icon={<ArrowLeft />}
            onClick={() => router.push(`/${locale}/brokers`)}
            className="mb-6 border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20 hover:text-white"
            size="large"
          >
            {t("brokerDetail.backToBrokerList")}
          </Button>

          {/* Broker Header Card */}
          <div className="overflow-hidden rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-md">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Broker Info */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                      <Image
                        src={
                          broker.image ??
                          broker.avatarUrl ??
                          "/images/admin/avatar.png"
                        }
                        alt={broker.fullName}
                        className="h-28 w-28 rounded-3xl object-cover"
                        width={112}
                        height={112}
                      />
                    </div>
                    {broker.role?.name === "broker" && (
                      <div className="absolute -right-2 -bottom-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-2 shadow-lg">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="mb-2 text-4xl font-bold text-gray-900">
                        {broker.fullName}
                      </h1>
                      <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2">
                        <Award className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          {broker.role?.name === "broker"
                            ? t("broker.realEstateAgent")
                            : broker.role?.name}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{broker.location ?? t("common.notUpdated")}</span>
                      </div>
                    </div>

                    {/* Rating and Actions */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-1 rounded-xl bg-yellow-50 px-4 py-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold text-gray-900">
                          {broker.ratingAverage ?? 0}
                        </span>
                        <span className="text-gray-600">
                          ({broker.ratingCount ?? 0} {t("brokerDetail.reviews")}
                          )
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          icon={<Share2 />}
                          size="large"
                          className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                          onClick={() => {
                            void navigator.clipboard.writeText(
                              window.location.href,
                            );
                          }}
                        >
                          {t("brokerDetail.share")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Contact Card */}
              <div className="lg:col-span-1">
                <div className="h-full rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-inner">
                  <div className="mb-6 text-center">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {t("brokerDetail.contactNow")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("brokerDetail.responseTime")}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Button
                      icon={<Phone className="h-5 w-5" />}
                      className="group w-full justify-start border-green-200 bg-green-50 text-green-700 transition-all hover:bg-green-100 hover:shadow-md"
                      size="large"
                      onClick={() => {
                        message.success(t("brokerDetail.callRequestSent"));
                        window.open(`tel:${broker.phone}`, "_self");
                      }}
                    >
                      <span className="ml-2">{broker.phone}</span>
                    </Button>
                    <Button
                      icon={<Mail className="h-5 w-5" />}
                      className="group w-full justify-start border-blue-200 bg-blue-50 text-blue-700 transition-all hover:bg-blue-100 hover:shadow-md"
                      size="large"
                      onClick={() => {
                        message.success(t("brokerDetail.emailRequestSent"));
                        window.open(`mailto:${broker.email}`, "_self");
                      }}
                    >
                      <span className="ml-2">
                        {t("brokerDetail.sendEmail")}
                      </span>
                    </Button>
                  </div>
                  <div className="mt-6 space-y-3 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-indigo-500" />
                      <span>{t("brokerDetail.workingHours")}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Award className="h-4 w-4 text-indigo-500" />
                      <span>{t("brokerDetail.responseTime")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto -mt-16 max-w-7xl px-6 pb-16">
        {/* Enhanced Tabs */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          <Tabs defaultActiveKey="about" size="large" className="enhanced-tabs">
            <TabPane
              tab={
                <div className="flex items-center gap-2 p-4">
                  <Award className="h-4 w-4" />
                  {t("brokerDetail.introduction")}
                </div>
              }
              key="about"
            >
              <div className="space-y-8 p-8">
                {/* Bio Section */}
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                    <Award className="h-6 w-6 text-blue-600" />
                    {t("brokerDetail.aboutMe")}
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-700">
                    {broker.role?.name === "broker"
                      ? t("broker.professionalDescription")
                      : t("broker.userInformation")}
                  </p>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-blue-600">
                      {broker.experienceYears ?? 5}+
                    </div>
                    <div className="text-sm font-medium text-blue-800">
                      {t("brokerDetail.experienceYears")}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-green-600">
                      {properties?.length ?? 0}
                    </div>
                    <div className="text-sm font-medium text-green-800">
                      {t("brokerDetail.soldProperties")}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-yellow-600">
                      {broker.ratingAverage ?? 4.5}
                    </div>
                    <div className="text-sm font-medium text-yellow-800">
                      {t("brokerDetail.averageRating")}
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center shadow-sm transition-all hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-purple-600">
                      {broker.ratingCount ?? 0}
                    </div>
                    <div className="text-sm font-medium text-purple-800">
                      {t("brokerDetail.totalReviews")}
                    </div>
                  </div>
                </div>

                {/* Professional Profile Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Specialties Section */}
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Star className="h-5 w-5 text-indigo-600" />
                      {t("brokerDetail.specialties")}
                    </h4>
                    {broker.specialties && broker.specialties.length > 0 ? (
                      <div className="space-y-3">
                        {broker.specialties.map((specialty, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg bg-indigo-50 p-3"
                          >
                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                            <span className="font-medium text-gray-700">
                              {specialty}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          "Căn hộ cao cấp",
                          "Nhà phố thương mại",
                          "Đất nền dự án",
                        ].map((specialty, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg bg-indigo-50 p-3"
                          >
                            <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                            <span className="font-medium text-gray-700">
                              {specialty}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contact & Info Section */}
                  <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      {t("brokerDetail.contactInformation")}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-gray-700">
                          {broker.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-700">
                          {broker.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                        <MapPin className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-700">
                          {broker.location ?? t("common.notUpdated")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages & Certifications */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Languages */}
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Calendar className="h-5 w-5 text-green-600" />
                      {t("brokerDetail.languages")}
                    </h4>
                    {broker.languages && broker.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {broker.languages.map((language, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {["Tiếng Việt", "English", "ລາວ"].map(
                          (language, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-green-700 shadow-sm"
                            >
                              {language}
                            </span>
                          ),
                        )}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 p-6">
                    <h4 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                      <Award className="h-5 w-5 text-purple-600" />
                      {t("brokerDetail.certifications")}
                    </h4>
                    {broker.certifications &&
                    broker.certifications.length > 0 ? (
                      <div className="space-y-3">
                        {broker.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
                          >
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-gray-700">
                              {cert}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[
                          "Chứng chỉ môi giới BĐS",
                          "Tư vấn tài chính",
                          "Chuyên gia bán hàng",
                        ].map((cert, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
                          >
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-gray-700">
                              {cert}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabPane>

            <TabPane
              tab={
                <div className="flex items-center gap-2 capitalize">
                  <MapPin className="h-4 w-4" />
                  {t("broker.properties")}
                </div>
              }
              key="properties"
            >
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {t("brokerDetail.listedProperties")} (
                    {properties?.length ?? 0})
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {t("common.lastUpdated")}: {new Date().toLocaleDateString()}
                  </div>
                </div>

                <Spin spinning={propertiesLoading}>
                  {!properties || properties.length === 0 ? (
                    <div className="py-20 text-center">
                      <div className="relative mx-auto mb-8">
                        {/* Animated background circles */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-32 w-32 animate-pulse rounded-full bg-blue-100 opacity-20"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-24 w-24 animate-pulse rounded-full bg-blue-200 opacity-30 delay-75"></div>
                        </div>
                        {/* Main icon */}
                        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
                          <svg
                            className="h-10 w-10 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="mx-auto max-w-md space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {t("brokerDetail.noPropertiesFound")}
                        </h3>
                        <p className="text-lg leading-relaxed text-gray-600">
                          {t("brokerDetail.noPropertiesDescription")}
                        </p>

                        {/* Action suggestions */}
                        <div className="mt-8 space-y-3">
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{t("brokerDetail.checkBackLater")}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{t("brokerDetail.contactDirectly")}</span>
                          </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                          <Button
                            icon={<MessageCircle />}
                            type="primary"
                            size="large"
                            className="border-0 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg transition-all hover:shadow-xl"
                            onClick={() =>
                              message.success(
                                t("brokerDetail.messageSentSuccessfully"),
                              )
                            }
                          >
                            {t("brokerDetail.sendMessage")}
                          </Button>
                          <Button
                            icon={<Phone />}
                            size="large"
                            className="border-blue-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                            onClick={() =>
                              message.success(t("brokerDetail.callRequestSent"))
                            }
                          >
                            {t("brokerDetail.callNow")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {properties?.map((property) => (
                        <div
                          key={property.id}
                          className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-blue-200"
                          onClick={() =>
                            router.push(`/${locale}/property/${property.id}`)
                          }
                        >
                          <div className="relative h-56 w-full overflow-hidden">
                            <Image
                              src={
                                property.mainImage ??
                                property.images?.[0] ??
                                "/images/landingpage/apartment/apart-1.jpg"
                              }
                              alt={property.title}
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              fill
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            <div className="absolute top-4 left-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 text-sm font-medium text-white shadow-lg">
                              {property.type?.name}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="mb-3 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                              {property.title}
                            </h3>
                            <div className="mb-3 flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {formatShortLocation(
                                  property,
                                  t("common.notUpdated"),
                                )}
                              </span>
                            </div>
                            <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
                              {property.price
                                ? formatPrice(Number(property.price))
                                : t("common.contact")}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                  </svg>
                                  <span>{property.details?.area} m²</span>
                                </div>
                                {property.details?.bedrooms && (
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="h-4 w-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                    <span>{property.details?.bedrooms} PN</span>
                                  </div>
                                )}
                                {property.details?.bathrooms && (
                                  <div className="flex items-center gap-1">
                                    <svg
                                      className="h-4 w-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z" />
                                    </svg>
                                    <span>
                                      {property.details?.bathrooms} WC
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {new Date(
                                  property.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Spin>

                {(properties?.length ?? 0) > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={propertiesPagination.current}
                      total={propertiesPagination.total}
                      pageSize={propertiesPagination.pageSize}
                      onChange={handlePropertiesPageChange}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} của ${total} bất động sản`
                      }
                    />
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane
              tab={
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {t("brokerDetail.reviews")}
                </div>
              }
              key="reviews"
            >
              <div className="space-y-8 p-8">
                {/* Feedback Input */}
                <FeedbackInput
                  brokerId={brokerId}
                  onSuccess={() => {
                    fetchReviews();
                  }}
                />

                {/* Review Summary */}
                <div className="flex items-center gap-2">
                  <div className="h-5 text-gray-600">
                    {t("brokerDetail.averageRating")}:
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= (broker.ratingAverage ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <Spin spinning={reviewsLoading}>
                  <div className="space-y-4">
                    {(reviewsData?.length ?? 0) > 0 ? (
                      reviewsData?.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                        >
                          <div className="flex items-start gap-4">
                            <Image
                              src={
                                review.reviewer?.avatarUrl ??
                                review.reviewer?.image ??
                                "/images/admin/avatar.png"
                              }
                              alt={
                                review.reviewer?.fullName ??
                                t("common.anonymous")
                              }
                              className="h-10 w-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.reviewer?.fullName ??
                                    t("common.anonymous")}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="mb-2 text-gray-700">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center">
                        <div className="relative mx-auto mb-8">
                          {/* Animated background */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-32 w-32 animate-pulse rounded-full bg-yellow-100 opacity-20"></div>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 animate-pulse rounded-full bg-yellow-200 opacity-30 delay-75"></div>
                          </div>
                          {/* Main icon */}
                          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-orange-100 shadow-lg">
                            <svg
                              className="h-10 w-10 text-yellow-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="mx-auto max-w-md space-y-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {t("brokerDetail.noReviewsYet")}
                          </h3>
                          <p className="text-lg leading-relaxed text-gray-600">
                            {t("brokerDetail.beFirstReview")}
                          </p>

                          {/* Encouragement message */}
                          <div className="mt-8 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                            <div className="mb-3 flex items-center gap-3">
                              <Star className="h-5 w-5 text-yellow-500" />
                              <span className="font-medium text-gray-900">
                                {t("brokerDetail.shareExperience")}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {t("brokerDetail.helpOthersDescription")}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reviews Pagination */}
                  {(reviewsData?.length ?? 0) > 0 &&
                    reviewsPagination.total > reviewsPagination.pageSize && (
                      <div className="mt-6 flex justify-center">
                        <Pagination
                          current={reviewsPagination.current}
                          total={reviewsPagination.total}
                          pageSize={reviewsPagination.pageSize}
                          onChange={handleReviewsPageChange}
                          showSizeChanger={false}
                          showTotal={(total, range) =>
                            `${range[0]}-${range[1]} của ${total} đánh giá`
                          }
                        />
                      </div>
                    )}
                </Spin>
              </div>
            </TabPane>

            {/* No longer needed */}
            {/* <TabPane tab="Liên hệ" key="contact">
              <div className="max-w-2xl">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Gửi tin nhắn cho {broker.name}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Họ và tên *"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      size="large"
                    />
                    <Input
                      placeholder="Email *"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      size="large"
                    />
                  </div>
                  <Input
                    placeholder="Số điện thoại"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    size="large"
                  />
                  <TextArea
                    placeholder="Tin nhắn của bạn *"
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleContactSubmit}
                    className="w-full"
                  >
                    Gửi tin nhắn
                  </Button>
                </div>
              </div>
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
