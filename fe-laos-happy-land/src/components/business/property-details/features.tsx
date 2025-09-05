"use client";

import { Typography } from "antd";
import { Bed, Bath, Square, Building } from "lucide-react";

const { Title, Text } = Typography;

type Details = {
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
};

type Props = {
  details?: Details | null;
  typeName?: string | null;
};

export default function Features({ details, typeName }: Props) {
  return (
    <div className="mb-8">
      <Title level={3} className="mb-4 text-xl font-semibold">
        Thông tin cơ bản
      </Title>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {details?.bedrooms && (
          <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
              <Bed size={24} className="text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {details.bedrooms}
            </div>
            <Text className="text-xs text-gray-600">Phòng ngủ</Text>
          </div>
        )}
        {details?.bathrooms && (
          <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
              <Bath size={24} className="text-purple-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {details.bathrooms}
            </div>
            <Text className="text-xs text-gray-600">Phòng tắm</Text>
          </div>
        )}
        {details?.area && (
          <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200">
              <Square size={24} className="text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {details.area}m²
            </div>
            <Text className="text-xs text-gray-600">Diện tích</Text>
          </div>
        )}
        <div className="group rounded-xl bg-white p-4 text-center shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200">
            <Building size={24} className="text-orange-600" />
          </div>
          <div className="text-lg font-bold text-gray-900">
            {typeName ?? "N/A"}
          </div>
          <Text className="text-xs text-gray-600">Loại BDS</Text>
        </div>
      </div>
    </div>
  );
}
