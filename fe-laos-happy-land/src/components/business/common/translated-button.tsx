"use client";

import { Button } from "antd";
import { useTranslations } from "next-intl";

interface TranslatedButtonProps {
  translationKey: string;
  namespace?: string;
  onClick?: () => void;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function TranslatedButton({
  translationKey,
  namespace = "common",
  onClick,
  type = "default",
  size = "middle",
  loading = false,
  disabled = false,
  className,
}: TranslatedButtonProps) {
  const t = useTranslations(namespace);

  return (
    <Button
      type={type}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {t(translationKey)}
    </Button>
  );
}
