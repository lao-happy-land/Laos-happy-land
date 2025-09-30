"use client";

import Link from "next/link";
import { Button } from "antd";
import { Home, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto mb-6 h-64 w-64">
            <Image
              src="/images/404-illustration.svg"
              alt="404 Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-8xl font-bold text-transparent">
            404
          </h1>
          <h2 className="mb-4 text-3xl font-semibold text-gray-800">
            Trang không tìm thấy
          </h2>
          <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
            chuyển.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button
              type="primary"
              size="large"
              icon={<Home className="h-4 w-4" />}
              className="flex h-12 items-center gap-2 px-6 py-3 text-base font-medium"
            >
              Về trang chủ
            </Button>
          </Link>

          <Button
            size="large"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => window.history.back()}
            className="flex h-12 items-center gap-2 px-6 py-3 text-base font-medium"
          >
            Quay lại
          </Button>
        </div>

        {/* Search Suggestion */}
        <div className="mt-12 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Tìm kiếm thay thế
            </h3>
          </div>
          <p className="mb-4 text-gray-600">Có thể bạn đang tìm kiếm:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/properties-for-sale">
              <Button type="text" className="text-blue-600 hover:text-blue-800">
                Nhà đất bán
              </Button>
            </Link>
            <Link href="/properties-for-rent">
              <Button type="text" className="text-blue-600 hover:text-blue-800">
                Nhà đất cho thuê
              </Button>
            </Link>
            <Link href="/news">
              <Button type="text" className="text-blue-600 hover:text-blue-800">
                Tin tức
              </Button>
            </Link>
            <Link href="/brokers">
              <Button type="text" className="text-blue-600 hover:text-blue-800">
                Danh bạ môi giới
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Nếu bạn tin rằng đây là lỗi, vui lòng{" "}
            <Link
              href="/contact"
              className="text-blue-600 underline hover:text-blue-800"
            >
              liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
