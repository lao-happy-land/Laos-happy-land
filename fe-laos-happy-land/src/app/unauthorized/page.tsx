"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Không có quyền truy cập
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bạn không có quyền truy cập vào khu vực quản trị. Vui lòng liên hệ
              quản trị viên để được hỗ trợ.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <Home className="h-4 w-4" />
              Về trang chủ
            </Link>
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Đăng nhập lại
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Nếu bạn cho rằng đây là lỗi, vui lòng{" "}
              <Link
                href="mailto:support@example.com"
                className="text-blue-600 hover:text-blue-500"
              >
                liên hệ hỗ trợ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
