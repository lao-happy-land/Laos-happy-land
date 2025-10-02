"use client";

import { Card, Typography, Space, Button, Divider } from "antd";
import { useTranslations } from "next-intl";
import { Mail, Phone, Star, Share2 } from "lucide-react";
import { useRequest } from "ahooks";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { useUrlLocale } from "@/utils/locale";
import BankUsers from "./bank-users";

const { Title, Text } = Typography;

type Owner = {
  id?: string;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  image?: string | null;
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
      <Card>
        <Title level={4} className="mb-6 text-xl font-semibold">
          {t("property.contactOwner")}
        </Title>

        {owner && (
          <div className="mb-6">
            <Link
              href={`/${locale}/brokers/${owner.id}`}
              className="mb-6 flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-md"
            >
              {owner.image ? (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-lg">
                  <Image
                    src={owner.image}
                    alt={owner.fullName ?? "Owner"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Text className="text-xl font-bold text-white">
                    {owner.fullName?.charAt(0) ?? "U"}
                  </Text>
                </div>
              )}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {owner.fullName}
                </div>
                <Text className="text-sm text-gray-600">
                  {t("property.propertyOwner")}
                </Text>
                {reviewCount > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>
                      {averageRating} ({reviewCount} {t("property.reviews")})
                    </span>
                  </div>
                )}
              </div>
            </Link>

            <Space direction="vertical" className="w-full" size="middle">
              {owner.phone && (
                <Button
                  type="primary"
                  icon={<Phone size={16} />}
                  onClick={onCall}
                  className="h-12 w-full text-base font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                  size="large"
                >
                  {t("property.callPhone")}: {owner.phone}
                </Button>
              )}

              {owner.email && (
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
      <div className="mt-4">
        <BankUsers />
      </div>
    </div>
  );
}
