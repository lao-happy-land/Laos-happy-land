"use client";

import Link from "next/link";
import { useState } from "react";
import { Breadcrumb, Tag, Button, Typography } from "antd";
import { MapPin, Shield } from "lucide-react";
import MapboxModal from "@/components/business/common/mapbox-modal";

const { Text } = Typography;

type Props = {
  title: string;
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

const getTransactionTypeText = (type: string) => {
  switch (type) {
    case "rent":
      return "Cho thuê";
    case "sale":
      return "Bán";
    case "project":
      return "Dự án";
    default:
      return type;
  }
};

export default function HeaderBar({
  title,
  location,
  status,
  transactionType,
  coordinates,
}: Props) {
  const [mapModalOpen, setMapModalOpen] = useState(false);

  return (
    <>
      <div className="mb-4">
        <Breadcrumb
          items={[
            {
              title: (
                <Link href="/">
                  <span className="inline-flex items-center gap-1">
                    Trang chủ
                  </span>
                </Link>
              ),
            },
            {
              title: (
                <Link
                  href={
                    transactionType === "project"
                      ? "/properties-for-project"
                      : transactionType === "rent"
                        ? "/properties-for-rent"
                        : "/properties-for-sale"
                  }
                >
                  Bất động sản
                </Link>
              ),
            },
            { title: <span className="text-gray-700">Chi tiết</span> },
          ]}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {location && (
              <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                <MapPin size={16} className="text-blue-600" />
                <Text className="text-sm font-medium text-blue-700">
                  {location}
                </Text>
                <Button
                  size="small"
                  type="link"
                  onClick={() => setMapModalOpen(true)}
                  className="px-1"
                >
                  Xem bản đồ
                </Button>
              </div>
            )}
            {status === "approved" && (
              <Tag
                color="green"
                className="flex items-center gap-1 text-sm font-medium text-green-700"
              >
                <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                  <Shield size={14} /> Đã xác minh
                </span>
              </Tag>
            )}
            <Tag
              color={getTransactionTypeColor(transactionType)}
              className="text-sm font-medium"
            >
              {getTransactionTypeText(transactionType)}
            </Tag>
          </div>
        </div>
      </div>

      {/* Mapbox Modal */}
      <MapboxModal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        location={location}
        coordinates={coordinates}
      />
    </>
  );
}
