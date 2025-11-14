import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocaleState {
  locale: string;
  setLocale: (locale: string) => void;
  getLocale: () => string;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "la", // Default locale
      setLocale: (locale: string) => {
        set({ locale });
      },
      getLocale: () => {
        return get().locale;
      },
    }),
    {
      name: "locale-storage", // localStorage key
      version: 1,
    },
  ),
);
