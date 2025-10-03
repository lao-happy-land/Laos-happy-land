"use client";

import { Descriptions, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Building, Shield, Calendar, Clock, MapPin } from "lucide-react";
import type { Property } from "@/@types/types";

const { Title } = Typography;

type Props = {
  property?: Property | null;
  typeName?: string | null;
  legalStatus?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function DetailsSection({
  property,
  typeName,
  legalStatus,
  createdAt,
  updatedAt,
}: Props) {
  const t = useTranslations();
  return (
    <div>
      <Title level={3} className="mb-4 text-xl font-semibold">
        {t("property.detailedInfo")}
      </Title>
      <Descriptions
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        bordered
        size="small"
        className="overflow-hidden rounded-lg"
      >
        <Descriptions.Item label={t("property.propertyType")}>
          <div className="flex items-center gap-2">
            <Building size={16} className="text-blue-600" />
            {typeName}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t("property.legalStatus")}>
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            {legalStatus}
          </div>
        </Descriptions.Item>
        {property?.locationInfo?.name && (
          <Descriptions.Item label={t("map.area")} span={2}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-600" />
              {property.locationInfo.name}
            </div>
          </Descriptions.Item>
        )}
        {property?.location?.district && (
          <Descriptions.Item label={t("map.district")} span={2}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600" />
              {property.location.district}
            </div>
          </Descriptions.Item>
        )}
        {property?.location?.address && (
          <Descriptions.Item label={t("map.street")} span={2}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-600" />
              {property.location.address}
            </div>
          </Descriptions.Item>
        )}
        {property?.location?.city && (
          <Descriptions.Item label={t("map.city")}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-600" />
              {property.location.city}
            </div>
          </Descriptions.Item>
        )}
        {property?.location?.province && (
          <Descriptions.Item label={t("map.province")}>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-600" />
              {property.location.province}
            </div>
          </Descriptions.Item>
        )}
        <Descriptions.Item label={t("property.postedDate")}>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            {new Date(createdAt).toLocaleDateString("vi-VN")}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={t("property.lastUpdated")}>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-600" />
            {new Date(updatedAt).toLocaleDateString("vi-VN")}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
