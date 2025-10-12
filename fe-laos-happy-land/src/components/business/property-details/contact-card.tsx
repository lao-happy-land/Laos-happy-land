"use client";

import { Card, Typography, Space, Button, Divider } from "antd";
import { useTranslations } from "next-intl";
import {
  Mail,
  Phone,
  Star,
  Share2,
  Award,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useRequest } from "ahooks";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { useUrlLocale } from "@/utils/locale";
// import BankUsers from "./bank-users";
import BrokerUsers from "./broker-users";

const { Text } = Typography;

type Owner = {
  id?: string;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: string | null;
  isBroker?: boolean;
  verified?: boolean;
  experienceYears?: number;
  company?: string;
  specialties?: string[];
};

type Props = {
  owner?: Owner | null;
  onShare: () => void;
  onCall: () => void;
  onEmail: () => void;
};

export default function ContactCard({
  owner,
  onShare,
  onCall,
  onEmail,
}: Props) {
  const t = useTranslations();
  const locale = useUrlLocale();

  // Fetch user feedback/reviews
  const { data: feedbackData } = useRequest(
    async () => {
      if (!owner?.id) {
        return null;
      }
      const result = await userFeedbackService.getFeedbackByUserId(owner.id, {
        page: 1,
        perPage: 100,
      });
      return result;
    },
    {
      refreshDeps: [owner?.id],
      ready: !!owner?.id,
    },
  );

  // Calculate average rating and review count
  const { averageRating, reviewCount } = useMemo(() => {
    if (!feedbackData?.data || feedbackData.data.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const total = feedbackData.data.reduce(
      (sum, feedback) => sum + feedback.rating,
      0,
    );
    const avg = total / feedbackData.data.length;

    return {
      averageRating: Math.round(avg * 10) / 10, // Round to 1 decimal
      reviewCount: feedbackData.data.length,
    };
  }, [feedbackData]);

  return (
    <div className="mb-4">
      <div
        className={
          owner?.isBroker
            ? "overflow-hidden rounded-lg border-0 bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-orange-50/50 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            : "overflow-hidden rounded-lg border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl"
        }
      >
        <Card className="bg-transparent" styles={{ body: { padding: "16px" } }}>
          {owner?.isBroker && (
            <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 opacity-5">
              <Award className="h-full w-full text-amber-600" />
            </div>
          )}

          {owner?.isBroker && (
            <div className="absolute top-0 right-0 z-10">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-bl-xl bg-amber-400 opacity-20" />
                <div className="flex items-center gap-1.5 rounded-bl-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-4 py-2 shadow-lg shadow-amber-500/30">
                  <Award size={16} className="text-white drop-shadow-sm" />
                  <span className="text-sm font-bold text-white drop-shadow-sm">
                    {t("property.verifiedBroker")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {owner && (
            <div className="mb-6">
              {true ? (
                /* Enhanced Broker Layout */
                <div className="relative space-y-6">
                  {/* Broker Header Card */}
                  <Link
                    href={`/${locale}/brokers/${owner.id}`}
                    className="group block overflow-hidden rounded-2xl border-2 border-amber-200/50 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/20 p-6 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-amber-300 hover:shadow-xl"
                  >
                    {/* Hover glow effect */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-orange-400/10" />
                    </div>

                    <div className="relative flex items-start gap-5">
                      {/* Avatar with glow */}
                      <div className="relative flex-shrink-0">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-30 blur-md transition-all duration-300 group-hover:opacity-50" />
                        {owner.image ? (
                          <div className="relative h-24 w-24 overflow-hidden rounded-full shadow-xl ring-4 ring-amber-300 ring-offset-2 transition-all duration-300 group-hover:ring-amber-400 group-hover:ring-offset-4">
                            <Image
                              src={owner.image}
                              alt={owner.fullName ?? "Broker"}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="96px"
                            />
                          </div>
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 shadow-xl ring-4 ring-amber-300 ring-offset-2 transition-all duration-300 group-hover:scale-110 group-hover:ring-amber-400 group-hover:ring-offset-4">
                            <Text className="text-3xl font-bold text-white drop-shadow-md">
                              {owner.fullName?.charAt(0) ?? "B"}
                            </Text>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="text-xl font-bold text-gray-900">
                            {owner.fullName}
                          </div>
                          {owner.verified && (
                            <CheckCircle
                              size={18}
                              className="fill-blue-500 text-white"
                            />
                          )}
                        </div>

                        {/* Professional Badge */}
                        {owner.isBroker && (
                          <div className="mb-3">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-3.5 py-1.5 shadow-md ring-1 ring-amber-600/20">
                              <Shield
                                size={14}
                                className="text-white drop-shadow-sm"
                              />
                              <span className="text-sm font-bold text-white drop-shadow-sm">
                                {t("property.professionalBroker")}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Stats Row */}
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          {reviewCount > 0 && (
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 shadow-sm ring-1 ring-amber-200/50">
                              <Star
                                size={14}
                                className="fill-amber-500 text-amber-500"
                              />
                              <span className="text-sm font-bold text-gray-900">
                                {averageRating}
                              </span>
                              <span className="text-xs text-gray-600">
                                ({reviewCount})
                              </span>
                            </div>
                          )}
                          {owner.experienceYears &&
                          owner.experienceYears > 0 ? (
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 shadow-sm ring-1 ring-blue-200/50">
                              <Award size={14} className="text-blue-600" />
                              <span className="text-sm font-semibold text-blue-900">
                                {owner.experienceYears}{" "}
                                {t("property.yearsExperience")}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        {owner.company && (
                          <div className="mb-3 text-sm font-medium text-gray-700">
                            {owner.company}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Broker Specialties */}
                    {owner.specialties && owner.specialties.length > 0 && (
                      <div className="mt-4 border-t border-amber-200 pt-4">
                        <div className="flex flex-wrap gap-2">
                          {owner.specialties
                            .slice(0, 4)
                            .map((specialty, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-700 shadow-sm"
                              >
                                {specialty}
                              </span>
                            ))}
                          {owner.specialties.length > 4 && (
                            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700">
                              +{owner.specialties.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Enhanced Contact Buttons for Broker */}
                  <div className="space-y-3">
                    {owner.phone && (
                      <button
                        onClick={onCall}
                        className="group relative w-full overflow-hidden rounded-xl border-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40"
                      >
                        <div className="flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-6 transition-all duration-300">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110">
                            <Phone size={18} className="text-white" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-xs font-medium text-white/90">
                              {t("property.callNow")}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {owner.phone}
                            </span>
                          </div>
                        </div>
                      </button>
                    )}

                    {owner.email && (
                      <button
                        onClick={onEmail}
                        className="group relative w-full overflow-hidden rounded-xl bg-white p-0.5 shadow-md ring-2 ring-amber-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:ring-amber-400"
                      >
                        <div className="flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 px-6 transition-all duration-300">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-sm transition-all duration-300 group-hover:scale-110">
                            <Mail size={18} className="text-white" />
                          </div>
                          <span className="text-base font-bold text-amber-900">
                            {t("property.sendEmail")}
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Regular Owner Layout */
                <div>
                  <Link
                    href={`/${locale}/brokers/${owner?.id}`}
                    className="mb-6 block overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      {owner?.image ? (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-lg">
                          <Image
                            src={owner?.image ?? "/images/admin/avatar.png"}
                            alt={owner?.fullName ?? "Owner"}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                          <Text className="text-xl font-bold text-white">
                            {owner?.fullName?.charAt(0) ?? "U"}
                          </Text>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold text-gray-900">
                            {owner?.fullName}
                          </div>
                          {owner?.verified && (
                            <CheckCircle
                              size={16}
                              className="fill-blue-500 text-white"
                            />
                          )}
                        </div>
                        <Text className="text-sm text-gray-600">
                          {t("property.propertyOwner")}
                        </Text>
                        {reviewCount > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                            <Star
                              size={12}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="font-semibold">
                              {averageRating}
                            </span>
                            <span className="text-gray-500">
                              ({reviewCount} {t("property.reviews")})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <Space direction="vertical" className="w-full" size="middle">
                    {owner?.phone && (
                      <Button
                        type="primary"
                        icon={<Phone size={16} />}
                        onClick={onCall}
                        className="h-12 w-full text-base font-medium shadow-md transition-all duration-200 hover:shadow-md"
                        size="large"
                      >
                        {t("property.callPhone")}: {owner?.phone}
                      </Button>
                    )}

                    {owner?.email && (
                      <Button
                        icon={<Mail size={16} />}
                        onClick={onEmail}
                        className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                        size="large"
                      >
                        {t("property.sendEmail")}
                      </Button>
                    )}
                  </Space>
                </div>
              )}
            </div>
          )}

          <Divider className="my-2" />

          <div className="relative">
            <button
              onClick={onShare}
              className="group relative w-full overflow-hidden rounded-xl bg-white p-0.5 shadow-md ring-2 ring-gray-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:ring-gray-300"
            >
              <div className="flex h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 px-6 transition-all duration-300">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 shadow-sm transition-all duration-300 group-hover:scale-110">
                  <Share2 size={16} className="text-white" />
                </div>
                <span className="text-base font-semibold text-gray-900">
                  {t("property.share")}
                </span>
              </div>
            </button>
          </div>
        </Card>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-4">
        <BrokerUsers />
        {/* <BankUsers /> */}
      </div>
    </div>
  );
}
