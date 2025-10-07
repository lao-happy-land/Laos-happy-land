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

const { Title, Text } = Typography;

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
    <div className="sticky top-[100px] z-10">
      <Card
        className={
          owner?.isBroker
            ? "overflow-hidden border-2 border-amber-300 bg-gradient-to-br from-amber-50/30 via-yellow-50/20 to-orange-50/30 shadow-xl"
            : ""
        }
      >
        {/* Premium Broker Badge */}
        {owner?.isBroker && (
          <div className="absolute top-0 right-0 z-10">
            <div className="flex items-center gap-1 rounded-bl-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 shadow-md">
              <Award size={14} className="text-white" />
              <span className="text-xs font-bold text-white">
                {t("property.verifiedBroker")}
              </span>
            </div>
          </div>
        )}

        <Title level={4} className="mb-6 text-xl font-semibold">
          {true ? t("property.contactBroker") : t("property.contactOwner")}
        </Title>

        {owner && (
          <div className="mb-6">
            {true ? (
              /* Enhanced Broker Layout */
              <div className="space-y-6">
                {/* Broker Header Card */}
                <Link
                  href={`/${locale}/brokers/${owner.id}`}
                  className="block overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {owner.image ? (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full shadow-xl ring-4 ring-amber-400 ring-offset-2">
                        <Image
                          src={owner.image}
                          alt={owner.fullName ?? "Broker"}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl ring-4 ring-amber-400 ring-offset-2">
                        <Text className="text-3xl font-bold text-white">
                          {owner.fullName?.charAt(0) ?? "B"}
                        </Text>
                      </div>
                    )}
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
                          <div className="flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1">
                            <Shield size={12} className="text-white" />
                            <span className="text-sm font-semibold text-white">
                              {t("property.professionalBroker")}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="mb-3 grid grid-cols-3 gap-4">
                        {reviewCount > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span className="font-semibold text-gray-900">
                              {averageRating}
                            </span>
                            <span className="text-gray-600">
                              ({reviewCount})
                            </span>
                          </div>
                        )}
                        {owner.experienceYears && (
                          <div className="col-span-2 flex items-center gap-1 text-sm text-gray-700">
                            <Award size={14} />
                            <span>
                              {owner.experienceYears}{" "}
                              {t("property.yearsExperience")}
                            </span>
                          </div>
                        )}
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
                <Space direction="vertical" className="w-full" size="middle">
                  {owner.phone && (
                    <Button
                      type="primary"
                      icon={<Phone size={18} />}
                      onClick={onCall}
                      className="h-14 w-full border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-md"
                      size="large"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-normal opacity-90">
                          {owner.phone}
                        </span>
                      </div>
                    </Button>
                  )}

                  {owner.email && (
                    <Button
                      icon={<Mail size={18} />}
                      onClick={onEmail}
                      className="h-14 w-full border-2 border-amber-300 text-lg font-semibold shadow-md transition-all duration-200 hover:border-amber-400 hover:shadow-md"
                      size="large"
                    >
                      <div className="flex flex-col items-center">
                        <span>{t("property.sendEmail")}</span>
                      </div>
                    </Button>
                  )}
                </Space>
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
                          <span className="font-semibold">{averageRating}</span>
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

        <Divider />

        <div>
          <Title level={5} className="mb-4 text-lg font-semibold">
            {t("property.quickActions")}
          </Title>
          <Space direction="vertical" className="w-full" size="middle">
            <Button
              icon={<Share2 size={16} />}
              onClick={onShare}
              className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {t("property.share")}
            </Button>
          </Space>
        </div>
      </Card>
      <div className="mt-4 grid grid-cols-1 gap-4">
        <BrokerUsers />
        {/* <BankUsers /> */}
      </div>
    </div>
  );
}
