"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useRequest } from "ahooks";
import { Alert, Spin } from "antd";
import { useAuthStore } from "@/share/store/auth.store";

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useUrlLocale();
  const { handleGoogleCallback } = useAuthStore();
  const [error, setError] = useState<string>("");

  const { run: processGoogleCallback, loading } = useRequest(
    async (token: string) => {
      await handleGoogleCallback(token);
    },
    {
      manual: true,
      onSuccess: () => {
        // Success is handled in the auth store with redirect
      },
      onError: (error: Error) => {
        console.error("Google callback error:", error);
        setError(
          error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.",
        );
      },
    },
  );

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      setError("Đăng nhập Google bị từ chối hoặc có lỗi xảy ra.");
      return;
    }

    if (token) {
      processGoogleCallback(token);
    } else {
      setError("Không nhận được token xác thực từ Google.");
    }
  }, [searchParams, processGoogleCallback]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
          <Alert
            message="Lỗi đăng nhập"
            description={error}
            type="error"
            showIcon
            action={
              <button
                onClick={() => router.push(`/${locale}/login`)}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Thử lại
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-md">
        <Spin size="large" spinning={loading} />
        <p className="mt-4 text-gray-600">Đang xử lý đăng nhập Google...</p>
      </div>
    </div>
  );
}
