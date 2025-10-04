"use client";

import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface LoadingScreenProps {
  message?: string;
  variant?: "primary" | "blue" | "green" | "purple";
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  showProgress?: boolean;
  duration?: number; // in seconds
  className?: string;
}

export default function LoadingScreen({
  message,
  variant = "primary",
  size = "md",
  showLogo = true,
  showProgress = true,
  duration = 3,
  className = "",
}: LoadingScreenProps) {
  const t = useTranslations();
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (!showProgress) return;

    // Progressive messages for better UX
    const progressMessages = [
      "Laohappyland",
      t("loading.connecting"),
      t("loading.loadingData"),
      t("loading.completing"),
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 100 / (duration * 10), 100);

        // Update message based on progress
        const messageIndex = Math.floor(
          (newProgress / 100) * progressMessages.length,
        );
        if (messageIndex < progressMessages.length) {
          setCurrentMessage(progressMessages[messageIndex] ?? message);
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, showProgress, message, t]);
  const variants = {
    primary: {
      bg: "bg-gradient-to-br from-red-50 via-orange-25 to-pink-50",
      bgOverlay: "bg-gradient-to-t from-orange-500/5 to-pink-500/5",
      accent: "text-[#fc746f]",
      spinner: "border-[#fc746f]",
      spinnerGlow: "shadow-[#fc746f]/20",
      logo: "bg-gradient-to-br from-orange-100 to-pink-100 text-[#fc746f]",
      logoGlow: "shadow-lg shadow-[#fc746f]/25",
      dots: "bg-gradient-to-r from-[#fc746f] to-[#ff8a80]",
      card: "bg-white/95 backdrop-blur-xl border-[#fc746f]/20 shadow-[#fc746f]/10",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 via-sky-25 to-indigo-50",
      bgOverlay: "bg-gradient-to-t from-blue-500/5 to-indigo-500/5",
      accent: "text-blue-600",
      spinner: "border-blue-500",
      spinnerGlow: "shadow-blue-500/20",
      logo: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600",
      logoGlow: "shadow-lg shadow-blue-500/20",
      dots: "bg-gradient-to-r from-blue-500 to-blue-600",
      card: "bg-white/80 backdrop-blur-xl border-blue-100",
    },
    green: {
      bg: "bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50",
      bgOverlay: "bg-gradient-to-t from-green-500/5 to-emerald-500/5",
      accent: "text-green-600",
      spinner: "border-green-500",
      spinnerGlow: "shadow-green-500/20",
      logo: "bg-gradient-to-br from-green-100 to-green-200 text-green-600",
      logoGlow: "shadow-lg shadow-green-500/20",
      dots: "bg-gradient-to-r from-green-500 to-green-600",
      card: "bg-white/80 backdrop-blur-xl border-green-100",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 via-violet-25 to-fuchsia-50",
      bgOverlay: "bg-gradient-to-t from-purple-500/5 to-violet-500/5",
      accent: "text-purple-600",
      spinner: "border-purple-500",
      spinnerGlow: "shadow-purple-500/20",
      logo: "bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600",
      logoGlow: "shadow-lg shadow-purple-500/20",
      dots: "bg-gradient-to-r from-purple-500 to-purple-600",
      card: "bg-white/80 backdrop-blur-xl border-purple-100",
    },
  };

  const sizes = {
    sm: {
      logo: "h-10 w-10",
      logoIcon: "h-5 w-5",
      spinner: "h-8 w-8",
      text: "text-sm",
      dots: "h-2 w-2",
      card: "p-6 max-w-xs",
      progress: "w-48",
    },
    md: {
      logo: "h-16 w-16",
      logoIcon: "h-8 w-8",
      spinner: "h-12 w-12",
      text: "text-base",
      dots: "h-3 w-3",
      card: "p-8 max-w-sm",
      progress: "w-64",
    },
    lg: {
      logo: "h-24 w-24",
      logoIcon: "h-12 w-12",
      spinner: "h-16 w-16",
      text: "text-lg",
      dots: "h-4 w-4",
      card: "p-10 max-w-md",
      progress: "w-80",
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-screen items-center justify-center ${currentVariant.bg} ${className} transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Animated background with sophisticated patterns */}
      <div
        className={`absolute inset-0 ${currentVariant.bgOverlay} overflow-hidden`}
      >
        {/* Geometric floating shapes */}
        <div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${
              currentVariant.spinner.includes("[#fc746f]")
                ? "#fc746f"
                : currentVariant.spinner.includes("blue")
                  ? "#3b82f6"
                  : currentVariant.spinner.includes("green")
                    ? "#10b981"
                    : "#8b5cf6"
            } 0%, transparent 70%)`,
            animation: "floating 6s ease-in-out infinite",
          }}
        />

        {/* Hexagonal pattern */}
        <div
          className="absolute right-1/4 bottom-1/4 h-32 w-32 opacity-10"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${
              currentVariant.spinner.includes("[#fc746f]")
                ? "#fc746f"
                : currentVariant.spinner.includes("blue")
                  ? "#3b82f6"
                  : currentVariant.spinner.includes("green")
                    ? "#10b981"
                    : "#8b5cf6"
            }, transparent)`,
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
            animation: "floating 8s ease-in-out infinite 2s",
          }}
        />

        {/* Spiral gradient */}
        <div
          className="absolute top-1/2 right-1/3 h-48 w-48 rounded-full opacity-5"
          style={{
            background: `conic-gradient(from 45deg, transparent, ${
              currentVariant.spinner.includes("[#fc746f]")
                ? "#fc746f"
                : currentVariant.spinner.includes("blue")
                  ? "#3b82f6"
                  : currentVariant.spinner.includes("green")
                    ? "#10b981"
                    : "#8b5cf6"
            }40, transparent)`,
            animation:
              "orbit 12s linear infinite, floating 7s ease-in-out infinite 1s",
          }}
        />

        {/* Moving light streaks */}
        <div
          className="absolute top-0 left-0 h-1 w-full opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${
              currentVariant.spinner.includes("[#fc746f]")
                ? "#fc746f"
                : currentVariant.spinner.includes("blue")
                  ? "#3b82f6"
                  : currentVariant.spinner.includes("green")
                    ? "#10b981"
                    : "#8b5cf6"
            }60, transparent)`,
            animation: "shimmer 4s ease-in-out infinite",
          }}
        />

        {/* Particle dots */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute h-1 w-1 rounded-full opacity-30`}
            style={{
              background: currentVariant.spinner.includes("[#fc746f]")
                ? "#fc746f"
                : currentVariant.spinner.includes("blue")
                  ? "#3b82f6"
                  : currentVariant.spinner.includes("green")
                    ? "#10b981"
                    : "#8b5cf6",
              top: `${10 + ((i * 12) % 80)}%`,
              left: `${15 + ((i * 18) % 70)}%`,
              animation: `floating ${4 + (i % 3)}s ease-in-out infinite ${(i * 0.3) % 2}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced glass card container */}
      <div
        className={`relative z-10 ${currentSize.card} rounded-3xl border border-[#fc746f]/15 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
        style={{
          animation: "slideInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow:
            "0 20px 60px rgba(252, 116, 111, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
        }}
      >
        {/* Subtle gradient overlay for card */}
        <div
          className="absolute inset-0 rounded-3xl opacity-5"
          style={{
            background:
              "linear-gradient(135deg, #fc746f 0%, transparent 50%, #ff8a80 100%)",
          }}
        />

        {/* Enhanced header with modern logo design */}
        {showLogo && (
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Main logo container with glassmorphism */}
              <div
                className={`relative flex items-center justify-center ${currentSize.logo} rounded-3xl border border-[#fc746f]/20 bg-white/90 backdrop-blur-xl ${currentVariant.logoGlow}`}
                style={{
                  animation: "breathe 4s ease-in-out infinite",
                  boxShadow:
                    "0 8px 32px rgba(252, 116, 111, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                }}
              >
                {/* Gradient background overlay */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #fc746f 0%, #ff8a80 50%, #ffab91 100%)",
                  }}
                />

                {/* Logo icon */}
                <Building2
                  className={`relative z-10 ${currentVariant.accent} ${currentSize.logoIcon} transition-all duration-500 hover:scale-110`}
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(252, 116, 111, 0.2))",
                  }}
                />

                {/* Subtle inner glow */}
                <div
                  className="absolute inset-1 rounded-3xl opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle at center, #fc746f 0%, transparent 70%)",
                    animation: "energyPulse 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* Orbital rings with different animations */}
              <div
                className="absolute inset-0 rounded-3xl border-2 border-[#fc746f]/30"
                style={{
                  animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
                }}
              />
              <div
                className="absolute inset-0 rounded-3xl border border-[#fc746f]/20"
                style={{
                  animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite 1s",
                }}
              />

              {/* Floating accent dots */}
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="absolute h-2 w-2 rounded-full bg-[#fc746f]/40"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-${40 + index * 5}px)`,
                    animation: `orbit ${4 + index * 0.5}s linear infinite ${index * 0.3}s, particleFloat 2s ease-in-out infinite ${index * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Advanced multi-layer spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer rotating ring with dashed pattern */}
            <div
              className={`${currentSize.spinner} rounded-full border-2 border-dashed ${currentVariant.spinner} opacity-40`}
              style={{
                animation: "spin 4s linear infinite",
              }}
            />

            {/* Middle ring with gradient stroke */}
            <div
              className={`absolute inset-2 rounded-full border-2 border-transparent ${currentVariant.spinnerGlow}`}
              style={{
                background: `conic-gradient(from 0deg, transparent, ${
                  currentVariant.spinner.includes("[#fc746f]")
                    ? "#fc746f"
                    : currentVariant.spinner.includes("blue")
                      ? "#3b82f6"
                      : currentVariant.spinner.includes("green")
                        ? "#10b981"
                        : "#8b5cf6"
                }, transparent)`,
                animation: "spin 2s linear infinite",
                borderRadius: "50%",
              }}
            />

            {/* Multiple orbiting particles */}
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`absolute inset-0 ${currentSize.spinner}`}
                style={{
                  animation: `orbit ${3 + index * 0.5}s linear infinite`,
                  animationDelay: `${index * 0.8}s`,
                }}
              >
                <div
                  className={`absolute ${currentSize.dots} rounded-full ${currentVariant.dots} opacity-80 shadow-lg`}
                  style={{
                    top: `${20 + index * 10}%`,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            ))}

            {/* Central pulsing core */}
            <div
              className={`absolute inset-0 flex items-center justify-center`}
            >
              <div
                className={`${currentSize.dots} ${currentSize.dots} rounded-full ${currentVariant.dots} shadow-xl`}
                style={{
                  animation: "pulse 2s ease-in-out infinite",
                  transform: "scale(2)",
                }}
              />
            </div>

            {/* Floating energy rings */}
            <div
              className={`absolute inset-1 rounded-full border ${currentVariant.spinner} opacity-20`}
              style={{
                animation: "breathe 3s ease-in-out infinite",
              }}
            />
            <div
              className={`absolute inset-3 rounded-full border ${currentVariant.spinner} opacity-30`}
              style={{
                animation: "breathe 3s ease-in-out infinite 0.5s",
              }}
            />
          </div>
        </div>

        {/* Dynamic message with typewriter effect */}
        <div className="mb-6 text-center">
          <h3
            className={`font-semibold ${currentVariant.accent} ${currentSize.text} mb-2 transition-all duration-500`}
            key={currentMessage}
            style={{
              animation: "fadeInUp 0.5s ease-out",
            }}
          >
            {currentMessage}
          </h3>

          {/* Animated dots with wave effect */}
          <div className="flex items-center justify-center space-x-1">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${currentSize.dots} rounded-full ${currentVariant.dots} shadow-sm`}
                style={{
                  animation: `wave 1.5s ease-in-out ${index * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced progress bar */}
        {showProgress && (
          <div className="space-y-3">
            <div
              className={`${currentSize.progress} mx-auto overflow-hidden rounded-full bg-gray-200/50 shadow-inner`}
            >
              <div
                className={`h-2 rounded-full ${currentVariant.dots} shadow-sm transition-all duration-300 ease-out`}
                style={{
                  width: `${progress}%`,
                  boxShadow: `0 0 10px ${
                    currentVariant.spinner.includes("[#fc746f]")
                      ? "#fc746f"
                      : currentVariant.spinner.includes("blue")
                        ? "#3b82f6"
                        : currentVariant.spinner.includes("green")
                          ? "#10b981"
                          : "#8b5cf6"
                  }40`,
                }}
              />
            </div>
            <div className="text-center">
              <span
                className={`text-xs ${currentVariant.accent} font-medium opacity-70`}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.08) rotate(2deg);
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.3) translateY(-4px);
          }
        }

        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floating {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
          }
        }

        @keyframes morphShape {
          0%,
          100% {
            border-radius: 50%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 30% 70% 40% 60%;
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            border-radius: 70% 30% 60% 40%;
            transform: rotate(180deg) scale(0.9);
          }
          75% {
            border-radius: 40% 60% 30% 70%;
            transform: rotate(270deg) scale(1.05);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes energyPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Export preset configurations for common use cases
export const LoadingPresets = {
  auth: {
    variant: "blue" as const,
    message: "loading.authenticating",
    size: "md" as const,
    showProgress: true,
    duration: 2,
  },
  page: {
    variant: "primary" as const,
    message: "loading.loadingPage",
    size: "lg" as const,
    showProgress: true,
    duration: 3,
  },
  form: {
    variant: "green" as const,
    message: "loading.processing",
    size: "sm" as const,
    showLogo: false,
    showProgress: false,
  },
  data: {
    variant: "purple" as const,
    message: "loading.loadingData",
    size: "md" as const,
    showProgress: true,
    duration: 2.5,
  },
  upload: {
    variant: "blue" as const,
    message: "loading.uploading",
    size: "md" as const,
    showProgress: true,
    duration: 4,
  },
  download: {
    variant: "green" as const,
    message: "loading.downloading",
    size: "md" as const,
    showProgress: true,
    duration: 5,
  },
} as const;
