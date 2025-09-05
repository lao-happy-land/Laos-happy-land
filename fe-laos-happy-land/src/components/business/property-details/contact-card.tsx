"use client";

import { Card, Typography, Space, Button, Divider } from "antd";
import { Mail, Phone, Star, Heart, Share2, Building } from "lucide-react";

const { Title, Text } = Typography;

type Owner = {
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
};

type Props = {
  owner?: Owner | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  onCall: () => void;
  onEmail: () => void;
};

export default function ContactCard({
  owner,
  isFavorite,
  onToggleFavorite,
  onShare,
  onCall,
  onEmail,
}: Props) {
  return (
    <div className="sticky top-[100px] z-10">
      <Card>
        <Title level={4} className="mb-6 text-xl font-semibold">
          Liên hệ chủ sở hữu
        </Title>

        {owner && (
          <div className="mb-6">
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Text className="text-xl font-bold text-white">
                  {owner.fullName?.charAt(0) ?? "U"}
                </Text>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  {owner.fullName}
                </div>
                <Text className="text-sm text-gray-600">
                  Chủ sở hữu bất động sản
                </Text>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span>4.8 (120 đánh giá)</span>
                </div>
              </div>
            </div>

            <Space direction="vertical" className="w-full" size="middle">
              {owner.phone && (
                <Button
                  type="primary"
                  icon={<Phone size={16} />}
                  onClick={onCall}
                  className="h-12 w-full text-base font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                  size="large"
                >
                  Gọi điện: {owner.phone}
                </Button>
              )}

              {owner.email && (
                <Button
                  icon={<Mail size={16} />}
                  onClick={onEmail}
                  className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                  size="large"
                >
                  Gửi email
                </Button>
              )}
            </Space>
          </div>
        )}

        <Divider />

        <div>
          <Title level={5} className="mb-4 text-lg font-semibold">
            Hành động nhanh
          </Title>
          <Space direction="vertical" className="w-full" size="middle">
            <Button
              type="primary"
              ghost
              icon={
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              }
              onClick={onToggleFavorite}
              className={`h-12 w-full text-base font-medium transition-all duration-200 ${
                isFavorite ? "bg-red-50 text-red-600 hover:bg-red-100" : ""
              }`}
            >
              {isFavorite ? "Đã yêu thích" : "Thêm vào yêu thích"}
            </Button>
            <Button
              icon={<Share2 size={16} />}
              onClick={onShare}
              className="h-12 w-full text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Chia sẻ
            </Button>
          </Space>
        </div>
      </Card>

      <Card style={{ marginTop: 10 }}>
        <Title level={4} className="mb-4 text-xl font-semibold">
          Bất động sản tương tự
        </Title>
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Building size={24} className="text-blue-600" />
          </div>
          <Text className="text-gray-600">Tính năng đang được phát triển</Text>
          <Text className="text-sm text-gray-500">Sẽ có sớm!</Text>
        </div>
      </Card>
    </div>
  );
}
