"use client";

import type { BankRequest } from "@/share/service/bank-request.service";
import { bankRequestService } from "@/share/service/bank-request.service";
import { useRequest } from "ahooks";
import { Badge, Card, Empty, Spin, Typography } from "antd";
import { Award, Building2, CheckCircle2, Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

const { Text } = Typography;

export default function ApprovedBankRequests() {
  const t = useTranslations();

  const { data, loading } = useRequest(
    () =>
      bankRequestService.getAll({
        status: "approved",
        perPage: 10,
        page: 1,
      }),
    {
      cacheKey: "approved-bank-requests",
    },
  );

  if (loading) {
    return (
      <div className="mb-4 overflow-hidden rounded-lg shadow-sm">
        <Card styles={{ body: { padding: "16px" } }}>
          <div className="flex h-32 items-center justify-center">
            <Spin />
          </div>
        </Card>
      </div>
    );
  }

  const bankRequests = data?.data ?? [];

  if (bankRequests.length === 0) {
    return (
      <div className="mb-4 overflow-hidden rounded-lg shadow-sm">
        <Card styles={{ body: { padding: "16px" } }}>
          <Empty
            description={t("bankRequest.noApprovedBankRequests")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-4 overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <Card
        styles={{ body: { padding: "8px" } }}
        className="bg-transparent"
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                <Building2 className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <span className="block text-base xl:text-sm 2xl:text-base font-bold text-gray-900">
                  {t("bankRequest.approvedBankAgents")}
                </span>
                <span className="text-xs font-normal text-gray-500">
                  {bankRequests.length}{" "}
                  {bankRequests.length === 1 ? "agent" : "agents"}
                </span>
              </div>
            </div>
          </div>
        }
        bodyStyle={{ padding: "8px" }}
      >
        <div className="relative space-y-3">
          {bankRequests.map((request: BankRequest, index: number) => (
            <div
              key={request.id}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white via-blue-50/30 to-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 hover:shadow-xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Hover glow effect */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-transparent to-blue-400/10" />
              </div>
              <div className="relative flex gap-4">
                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Name and Bank */}
                  <div className="mb-2.5">
                    <div className="flex gap-1 items-center">
                      <h4 className="truncate text-lg xl:text-sm 2xl:text-lg font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-700">
                        {request.fullName}
                      </h4>
                      <Badge
                        count={
                          <CheckCircle2 className="h-4.5 w-4.5 fill-green-500 text-white drop-shadow-md" />
                        }
                      />
                    </div>

                    {request.bank && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
                          <Building2 className="h-3.5 w-3.5 xl:h-3 xl:w-3 2xl:h-3.5 2xl:w-3.5 text-blue-700" />
                        </div>
                        <Text className="truncate text-sm xl:text-xs 2xl:text-sm font-semibold text-gray-700">
                          {request.bank.name}
                        </Text>
                      </div>
                    )}
                  </div>

                  {/* Experience Badge with gradient */}
                  {request.yearsOfExperience &&
                    request.yearsOfExperience > 0 ? (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1 shadow-sm ring-1 ring-amber-300/50 transition-all duration-200 hover:shadow-md">
                      <Award className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-xs font-bold text-amber-800">
                        {request.yearsOfExperience}{" "}
                        {t("bankRequest.yearsExperience")}
                      </span>
                    </div>
                  ) : null}

                  {/* Contact Information with enhanced styling */}
                  <div className="space-y-2">
                    {request.phone && (
                      <a
                        href={`tel:${request.phone}`}
                        className="group/link flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-transparent px-2 py-1.5 text-sm text-gray-700 transition-all duration-200 hover:from-blue-100 hover:text-blue-700 hover:shadow-sm"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md transition-all duration-200 group-hover/link:scale-110 group-hover/link:shadow-lg">
                          <Phone className="h-4 w-4 xl:h-3 xl:w-3 2xl:h-4 2xl:w-4 text-white" />
                        </div>
                        <span className="truncate font-semibold xl:text-xs 2xl:text-sm">
                          {request.phone}
                        </span>
                      </a>
                    )}
                    {request.email && (
                      <a
                        href={`mailto:${request.email}`}
                        className="group/link flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-transparent px-2 py-1.5 text-sm text-gray-700 transition-all duration-200 hover:from-blue-100 hover:text-blue-700 hover:shadow-sm"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md transition-all duration-200 group-hover/link:scale-110 group-hover/link:shadow-lg">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <span className="truncate font-semibold xl:text-xs 2xl:text-sm">
                          {request.email}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
