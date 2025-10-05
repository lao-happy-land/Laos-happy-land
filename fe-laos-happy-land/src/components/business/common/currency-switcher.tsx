"use client";

import { Button, Dropdown } from "antd";
import { DollarSign } from "lucide-react";
import {
  useCurrencyStore,
  type SupportedCurrency,
} from "@/share/store/currency.store";

const currencies = [
  {
    code: "USD" as SupportedCurrency,
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
  },
  {
    code: "LAK" as SupportedCurrency,
    name: "Lao Kip",
    symbol: "₭",
    flag: "🇱🇦",
  },
  {
    code: "THB" as SupportedCurrency,
    name: "Thai Baht",
    symbol: "฿",
    flag: "🇹🇭",
  },
];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore();

  const currentCurrency = currencies.find((curr) => curr.code === currency);

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    if (newCurrency === currency) return;

    // Store user's currency preference
    setCurrency(newCurrency);

    // Also set a cookie for potential server-side access
    document.cookie = `currency-preference=${newCurrency}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const menuItems = currencies.map((curr) => ({
    key: curr.code,
    label: (
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex flex-col">
          <span className="font-medium">{curr.code}</span>
          <span className="text-xs text-gray-500">{curr.name}</span>
        </div>
        {curr.code === currency && (
          <span className="ml-auto text-blue-500">✓</span>
        )}
      </div>
    ),
    onClick: () => handleCurrencyChange(curr.code),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        icon={<DollarSign size={16} />}
        className="flex items-center gap-2 border-0 shadow-none hover:bg-gray-50"
      >
        <span className="inline font-medium">{currentCurrency?.code}</span>
      </Button>
    </Dropdown>
  );
}
