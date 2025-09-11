"use client";

import { Button } from "antd";
import { FcGoogle } from "react-icons/fc";
import { useRequest } from "ahooks";
import { useAuthStore } from "@/share/store/auth.store";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  redirectUrl?: string;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
  loading = false,
  disabled = false,
  className = "",
  children,
  redirectUrl,
}: GoogleLoginButtonProps) {
  const { googleLogin } = useAuthStore();

  const { run: handleGoogleLogin, loading: isGoogleLoading } = useRequest(
    async () => {
      await googleLogin(redirectUrl);
    },
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error: Error) => {
        console.error("Google login error:", error);
        onError?.(
          error.message || "Đăng nhập Google thất bại. Vui lòng thử lại.",
        );
      },
    },
  );

  const isLoading = loading || isGoogleLoading;

  return (
    <Button
      type="default"
      size="large"
      className={`flex h-12 w-full items-center justify-center gap-3 border-gray-300 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 ${className}`}
      onClick={handleGoogleLogin}
      loading={isLoading}
      disabled={disabled || isLoading}
      icon={<FcGoogle className="text-xl" />}
    >
      {children ?? "Đăng nhập với Google"}
    </Button>
  );
}
