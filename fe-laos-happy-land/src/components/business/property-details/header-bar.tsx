"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Breadcrumb, Tag, Button, Typography } from "antd";
import { MapPin, Shield } from "lucide-react";
import MapboxModal from "@/components/business/common/mapbox-modal";
import { useUrlLocale } from "@/utils/locale";
import { useRouter } from "next/navigation";
import type { Property } from "@/@types/types";

const { Text } = Typography;

type Props = {
  title: string;
  property?: Property | null;
  location?: string | null;
  status?: string | null;
  transactionType: "rent" | "sale" | "project";
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
};

const getTransactionTypeColor = (type: string) => {
  switch (type) {
    case "rent":
      return "blue" as const;
    case "sale":
      return "green" as const;
    case "project":
      return "orange" as const;
    default:
      return "default" as const;
  }
};

const getTransactionTypeText = (type: string, t: (key: string) => string) => {
  switch (type) {
    case "rent":
      return t("property.forRent");
    case "sale":
      return t("property.forSale");
    case "project":
      return t("navigation.projects");
    default:
      return type;
  }
};

export default function HeaderBar({
  title,
  property,
  location,
  status,
  transactionType,
  coordinates,
}: Props) {
  const t = useTranslations();
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const locale = useUrlLocale();
  const router = useRouter();
  return (
    <>
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              title: (
                <button
                  className="cursor-pointer font-semibold text-gray-400 hover:text-blue-500"
                  onClick={() => router.push(`/${locale}`)}
                >
                  {t("navigation.home")}
                </button>
              ),
            },
            {
              title: (
                <button
                  type="button"
                  className="cursor-pointer font-semibold text-gray-400 hover:text-blue-500"
                  onClick={() =>
                    transactionType === "project"
                      ? router.push(`/${locale}/properties-for-project`)
                      : transactionType === "rent"
                        ? router.push(`/${locale}/properties-for-rent`)
                        : router.push(`/${locale}/properties-for-sale`)
                  }
                >
                  {t("navigation.properties")}
                </button>
              ),
            },
            {
              title: (
                <span className="font-bold text-blue-500">
                  {t("common.details")}
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {(property?.locationInfo ?? property?.location ?? location) && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                  <MapPin size={16} className="text-blue-600" />
                  <div className="flex flex-col">
                    {property?.locationInfo?.name && (
                      <Text className="text-sm font-semibold text-blue-800">
                        {property.locationInfo.name}
                      </Text>
                    )}
                    {property?.location?.district && (
                      <Text className="text-xs text-blue-600">
                        {property.location.district}
                        {(property.location.buildingNumber ??
                          property.location.street ??
                          property.location.address) &&
                          ` > ${property.location.buildingNumber ? property.location.buildingNumber + " " : ""}${property.location.street ?? property.location.address}`}
                      </Text>
                    )}
                    {!property?.location?.district &&
                      (property?.location?.buildingNumber ??
                        property?.location?.street ??
                        property?.location?.address ??
                        location) && (
                        <Text className="text-sm font-medium text-blue-700">
                          {property?.location?.buildingNumber &&
                            `${property.location.buildingNumber} `}
                          {property?.location?.street ??
                            property?.location?.address ??
                            location}
                        </Text>
                      )}
                  </div>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => setMapModalOpen(true)}
                    className="px-1"
                  >
                    {t("map.viewMap")}
                  </Button>
                </div>
              </div>
            )}
            {status === "approved" && (
              <Tag
                color="green"
                className="flex items-center gap-1 text-sm font-medium text-green-700"
              >
                <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                  <Shield size={14} /> {t("property.verified")}
                </span>
              </Tag>
            )}
            <Tag
              color={getTransactionTypeColor(transactionType)}
              className="text-sm font-medium"
            >
              {getTransactionTypeText(transactionType, t)}
            </Tag>
          </div>
        </div>
      </div>

      {/* Mapbox Modal */}
      <MapboxModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        property={property}
        location={location}
        coordinates={coordinates}
      />
    </>
  );
}
