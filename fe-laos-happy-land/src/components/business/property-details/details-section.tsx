"use client";

import { Descriptions, Typography } from "antd";
import { Building, Shield, Calendar, Clock } from "lucide-react";

const { Title } = Typography;

type Props = {
  typeName?: string | null;
  legalStatus?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function DetailsSection({
  typeName,
  legalStatus,
  createdAt,
  updatedAt,
}: Props) {
  return (
    <div>
      <Title level={3} className="mb-4 text-xl font-semibold">
        Thông tin chi tiết
      </Title>
      <Descriptions
        column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        bordered
        size="small"
        className="overflow-hidden rounded-lg"
      >
        <Descriptions.Item label="Loại bất động sản">
          <div className="flex items-center gap-2">
            <Building size={16} className="text-blue-600" />
            {typeName}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Tình trạng pháp lý">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            {legalStatus}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đăng">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-600" />
            {new Date(createdAt).toLocaleDateString("vi-VN")}
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật lần cuối">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-600" />
            {new Date(updatedAt).toLocaleDateString("vi-VN")}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
