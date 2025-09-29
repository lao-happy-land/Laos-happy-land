"use client";

import { NextIntlClientProvider, type Messages } from "next-intl";
import type { ReactNode } from "react";

interface I18nProviderProps {
  children: ReactNode;
  messages: Messages;
  locale: string;
}

export default function I18nProvider({
  children,
  messages,
  locale,
}: I18nProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
