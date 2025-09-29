"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { Wifi, Tv, Snowflake, Car, Utensils, Shield } from "lucide-react";

const { Title } = Typography;

type AmenitiesProps = {
  wifi?: boolean;
  tv?: boolean;
  airConditioner?: boolean;
  parking?: boolean;
  kitchen?: boolean;
  security?: boolean;
};

export default function Amenities(details: AmenitiesProps) {
  const t = useTranslations();
  const hasAny =
    (details.wifi ?? false) ||
    (details.tv ?? false) ||
    (details.airConditioner ?? false) ||
    (details.parking ?? false) ||
    (details.kitchen ?? false) ||
    (details.security ?? false);

  if (!hasAny) return null;

  return (
    <div className="mb-8">
      <Title level={3} className="mb-4 text-xl font-semibold">
        {t("property.amenities")}
      </Title>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {details.wifi && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Wifi size={20} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">WiFi</span>
          </div>
        )}
        {details.tv && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Tv size={20} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">TV</span>
          </div>
        )}
        {details.airConditioner && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Snowflake size={20} className="text-cyan-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("property.airConditioner")}
            </span>
          </div>
        )}
        {details.parking && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Car size={20} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("property.parking")}
            </span>
          </div>
        )}
        {details.kitchen && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Utensils size={20} className="text-pink-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("property.kitchen")}
            </span>
          </div>
        )}
        {details.security && (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 hover:bg-gray-100">
            <Shield size={20} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              {t("property.security")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
