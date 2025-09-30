"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { numberToString } from "@/share/helper/number-to-string";
import {
  getCurrencyByLocale,
  type SupportedLocale,
} from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";
import type { PropertyPrice } from "@/@types/types";

const { Text } = Typography;

type Props = {
  price?: PropertyPrice | null;
  transactionType: "rent" | "sale" | "project";
  createdAt: string;
};

export default function PriceInfo({
  price,
  transactionType,
  createdAt,
}: Props) {
  const t = useTranslations();
  const locale = useUrlLocale() as SupportedLocale;
  const priceCurrency = getCurrencyByLocale(locale);
  const priceFormatted = price?.[priceCurrency];
  return (
    <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
        <div>
          <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
            {numberToString(Number(priceFormatted))} {priceCurrency}
          </div>
          <Text className="text-sm text-gray-600">
            {transactionType === "rent"
              ? t("property.rentalPrice")
              : t("property.salePrice")}
          </Text>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>
            {t("property.posted")}{" "}
            {new Date(createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  );
}
