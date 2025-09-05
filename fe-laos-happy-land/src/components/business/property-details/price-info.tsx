"use client";

import { Typography } from "antd";
import { Clock } from "lucide-react";
import { numberToString } from "@/share/helper/number-to-string";

const { Text } = Typography;

type Props = {
  price?: number | null;
  transactionType: "rent" | "sale" | "project";
  createdAt: string;
};

export default function PriceInfo({
  price,
  transactionType,
  createdAt,
}: Props) {
  return (
    <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
        <div>
          <div className="text-3xl font-bold text-blue-600 sm:text-4xl">
            {numberToString(Number(price))} LAK
          </div>
          <Text className="text-sm text-gray-600">
            {transactionType === "rent" ? "Giá thuê/tháng" : "Giá bán"}
          </Text>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={16} />
          <span>Đăng {new Date(createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
      </div>
    </div>
  );
}
