"use client";

import Image from "next/image";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: "login" | "register";
  onSwitchType: (type: "login" | "register") => void;
};

export default function AuthModal({ isOpen, onClose, type, onSwitchType }: AuthModalProps) {
  if (!isOpen) return null;
  const isLogin = type === "login";

  const handleSuccess = () => {
    onClose();
  };

  const handleError = (error: string) => {
    console.error("Auth error:", error);
  };

  const handleRegisterSuccess = (message: string) => {
    console.log("Register success:", message);
    // Modal sẽ tự động switch sang login sau 2 giây
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex w-1/2 flex-col items-center justify-center bg-[#FFEFEF] p-6">
          <Image
            src="/images/auth/login-bg.png"
            alt="Auth Background"
            width={500}
            height={300}
            priority
          />
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            Tìm nhà đất <br />
            <span className="font-semibold">Lào BDS dẫn lối</span>
          </p>
        </div>

        <div className="relative w-1/2 p-8 flex items-center justify-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors"
          >
            ×
          </button>

          <div className="w-full max-w-sm">
            {isLogin ? (
              <LoginForm
                onSuccess={handleSuccess}
                onError={handleError}
                onSwitchToRegister={() => onSwitchType("register")}
              />
            ) : (
              <RegisterForm
                onSuccess={handleSuccess}
                onError={handleError}
                onSwitchToLogin={() => onSwitchType("login")}
                onRegisterSuccess={handleRegisterSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
