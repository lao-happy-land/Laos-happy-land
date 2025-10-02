"use client";

import { Card, Typography, Spin } from "antd";
import { useRequest } from "ahooks";
import { userService } from "@/share/service/user.service";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUrlLocale } from "@/utils/locale";

const { Title } = Typography;

export default function BankUsers() {
  const t = useTranslations();
  const locale = useUrlLocale();

  const { data: bankUsers, loading } = useRequest(
    async () => {
      const users = await userService.getRandomBankUsers();
      console.log("Bank users response:", users);
      return users;
    },
    {
      onError: (error) => {
        console.error("Error loading bank users:", error);
      },
    },
  );

  if (loading) {
    return (
      <Card className="mt-4">
        <div className="flex items-center justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  // Ensure bankUsers is an array
  const users = Array.isArray(bankUsers) ? bankUsers : [];

  if (users.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <Title level={4} className="mb-6 text-xl font-semibold">
        {t("property.bankConsultants")}
      </Title>

      <div className="space-y-4">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/${locale}/brokers/${user.id}`}
            className="block"
          >
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all duration-200 hover:from-green-100 hover:to-emerald-100 hover:shadow-md">
              {user.image || user.avatarUrl ? (
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full shadow-lg">
                  <Image
                    src={
                      user.image ?? user.avatarUrl ?? "/images/admin/avatar.png"
                    }
                    alt={user.fullName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <span className="text-xl font-bold text-white">
                    {user.fullName?.charAt(0) ?? "B"}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {user.fullName}
                </div>
                <div className="text-sm text-gray-600">
                  {t("property.bankConsultant")}
                </div>
                {user.ratingAverage !== undefined && user.ratingAverage > 0 && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>
                      {user.ratingAverage} ({user.ratingCount ?? 0}{" "}
                      {t("property.reviews")})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs text-gray-500">
          {t("property.bankConsultantsHelper")}
        </p>
      </div>
    </Card>
  );
}
