"use client";

import type { User } from "@/@types/types";
import { userService } from "@/share/service/user.service";
import { useUrlLocale } from "@/utils/locale";
import { useRequest } from "ahooks";
import { Badge, Card, Empty, Spin, Typography } from "antd";
import { CheckCircle2, Mail, Phone, Star, UserCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const { Text } = Typography;

export default function BrokerUsers() {
  const t = useTranslations();
  const locale = useUrlLocale();

  const { data: brokerUsers, loading } = useRequest(
    async () => {
      const users = await userService.getAllUsers({
        role: "Broker",
        perPage: 5,
        page: 1,
      });
      return users.data as unknown as User[];
    },
    {
      onError: (error) => {
        console.error("Error loading bank users:", error);
      },
    },
  );

  if (loading) {
    return (
      <div className="mt-4 overflow-hidden rounded-lg shadow-sm">
        <Card bordered={false}>
          <div className="flex h-32 items-center justify-center">
            <Spin />
          </div>
        </Card>
      </div>
    );
  }

  // Ensure brokerUsers is an array
  const users = Array.isArray(brokerUsers) ? brokerUsers : [];

  if (users.length === 0) {
    return (
      <div className="mt-4 overflow-hidden rounded-lg shadow-sm">
        <Card>
          <Empty
            description={t("property.noBrokerConsultants")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <Card
        styles={{ body: { padding: "8px" } }}
        className="bg-transparent"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 xl:h-7 xl:w-7 2xl:h-9 2xl:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 shadow-lg shadow-emerald-500/30">
                <UserCheck className="h-4.5 w-4.5 xl:h-3 xl:w-3 2xl:h-4.5 2xl:w-4.5 text-white" />
              </div>
              <div>
                <span className="block text-base xl:text-sm 2xl:text-base font-bold text-gray-900">
                  {t("property.brokerConsultants")}
                </span>
                <span className="text-xs font-normal text-gray-500">
                  {users.length}{" "}
                  {users.length === 1 ? "consultant" : "consultants"}
                </span>
              </div>
            </div>
          </div>
        }
        bodyStyle={{ padding: "8px" }}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 opacity-5">
          <UserCheck className="h-full w-full text-emerald-600" />
        </div>

        <div className="relative space-y-3">
          {users.map((user, index: number) => (
            <Link
              key={user.id}
              href={`/${locale}/brokers/${user.id}`}
              className="block"
            >
              <div
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white via-emerald-50/30 to-white p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-emerald-200 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Hover glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-emerald-400/10" />
                </div>



                <div className="flex gap-4">
                  {/* Content */}
                  <div className="min-w-0 flex-1 ">
                    <div className="flex gap-3 items-center">
                      <div className=" flex-shrink-0">
                        {user.image || user.avatarUrl ? (
                          <div className=" relative  h-18 w-18 overflow-hidden rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                            <Image
                              src={
                                user.image ??
                                user.avatarUrl ??
                                "/images/admin/avatar.png"
                              }
                              alt={user.fullName}
                              fill
                              className="object-cover"
                              sizes="72px"
                            />
                          </div>
                        ) : (
                          <div className=" flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-200 to-green-300 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                            <span className="text-2xl font-bold text-emerald-800 transition-transform duration-300 group-hover:scale-110">
                              {user.fullName?.charAt(0) ?? "B"}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Name and Role */}
                      <div className="mt-2 flex flex-col gap-y-2">
                        <div className="flex items-center">
                          {/* <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
                          </div> */}
                          <Text className="truncate text-sm xl:text-xs 2xl:text-sm font-semibold text-gray-700">
                            {t("property.brokerConsultant")}
                          </Text>
                        </div>
                        {user.ratingAverage !== undefined &&
                          user.ratingAverage > 0 ? (
                          <div className=" inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1 shadow-sm ring-1 ring-amber-300/50 transition-all duration-200 hover:shadow-md">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            <span className="text-xs font-bold text-amber-800">
                              {user.ratingAverage} ({user.ratingCount ?? 0}{" "}
                              {t("property.reviews")})
                            </span>
                          </div>
                        ) : <div className=" inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1 shadow-sm ring-1 ring-amber-300/50 transition-all duration-200 hover:shadow-md">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-bold text-amber-800">
                            5  ({t("property.verified")})
                          </span>
                        </div>}
                      </div>
                    </div>


                    {/* Rating Badge with gradient */}
                    <div className="mt-5">
                      <div className="space-y-2">
                        <div className="flex items-center bg-gradient-to-r from-amber-50 to-transparent">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200 to-amber-600 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                            <UserCheck className="h-3.5 w-3.5 text-amber-900" />
                          </div>
                          <h4 className="px-2 truncate text-base xl:text-sm 2xl:text-base font-bold text-gray-900 transition-colors duration-200 group-hover:text-emerald-700">
                            {user.fullName}
                          </h4>
                          <Badge
                            count={
                              <CheckCircle2 className="h-4.5 w-4.5 fill-emerald-500 text-white drop-shadow-md" />
                            }
                          />
                        </div>

                        {user.phone && (
                          <a
                            href={`tel:${user.phone}`}
                            className="group/link flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent  py-1.5 text-sm xl:text-xs 2xl:text-sm text-gray-700 transition-all duration-200 hover:from-emerald-100 hover:text-emerald-700 hover:shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-md transition-all duration-200 group-hover/link:scale-110 group-hover/link:shadow-lg">
                              <Phone className="h-4 w-4 text-white" />
                            </div>
                            <span className="truncate font-semibold">
                              {user.phone}
                            </span>
                          </a>
                        )}
                        {user.email && (
                          <a
                            href={`mailto:${user.email}`}
                            className="group/link flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-emerald-50 to-transparent  py-1.5 text-sm xl:text-xs 2xl:text-sm text-gray-700 transition-all duration-200 hover:from-emerald-100 hover:text-emerald-700 hover:shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-md transition-all duration-200 group-hover/link:scale-110 group-hover/link:shadow-lg">
                              <Mail className="h-4 w-4 text-white" />
                            </div>
                            <span className="truncate font-semibold">
                              {user.email}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>


                    {/* Contact Information with enhanced styling */}

                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500">
            {t("property.brokerConsultantsHelper")}
          </p>
        </div>
      </Card>
    </div>
  );
}
