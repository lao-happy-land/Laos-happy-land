import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportedCurrency } from "../helper/locale.helper";

export type { SupportedCurrency };

interface CurrencyState {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  getCurrency: () => SupportedCurrency;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "USD", // Default currency
      setCurrency: (currency: SupportedCurrency) => {
        set({ currency });
      },
      getCurrency: () => {
        return get().currency;
      },
    }),
    {
      name: "currency-storage", // localStorage key
      version: 1,
    },
  ),
);
