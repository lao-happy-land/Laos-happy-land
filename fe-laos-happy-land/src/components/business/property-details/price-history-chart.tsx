"use client";

import { Card, Typography, Empty, Select, Spin, Badge } from "antd";
import { useState, useMemo } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useTranslations } from "next-intl";
import type { PropertyPrice, PropertyPriceHistory } from "@/@types/types";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const { Title } = Typography;

type Props = {
  priceHistory: PropertyPriceHistory[];
  currentPrice: string | PropertyPrice | null;
};

type CurrencyType = "LAK" | "USD" | "VND";

export default function PriceHistoryChart({
  priceHistory,
  currentPrice,
}: Props) {
  const t = useTranslations();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>("USD");
  const [isLoading, setIsLoading] = useState(false);

  // Transform price history data for the chart
  const chartData = useMemo(() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    return priceHistory.map((item) => {
      let price = 0;

      try {
        // Check if rates is already an object (PropertyPrice) or a string
        if (typeof item.rates === "object" && item.rates !== null) {
          // rates is already an object
          const rates = item.rates;
          const rateValue = rates[selectedCurrency];
          price = parseFloat(rateValue?.toString() ?? "0");
        } else if (typeof item.rates === "string") {
          // Try to parse rates as JSON string
          const parsedRates = JSON.parse(item.rates) as PropertyPrice;
          const rateValue = parsedRates[selectedCurrency];
          price = parseFloat(rateValue?.toString() ?? "0");
        } else {
          // Fallback: treat as a simple number
          price = parseFloat(String(item.rates) || "0");
        }
      } catch {
        // If parsing fails, treat as a simple number string
        if (typeof item.rates === "object" && item.rates !== null) {
          // If it's an object but parsing failed, try to get the selected currency value
          const rates = item.rates;
          const rateValue = rates[selectedCurrency];
          price = parseFloat(rateValue?.toString() ?? "0");
        } else {
          price = parseFloat(String(item.rates) || "0");
        }
      }

      return {
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        price: price,
        fullDate: item.date,
      };
    });
  }, [priceHistory, selectedCurrency]);

  // Calculate price change percentage
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return null;

    const firstPrice = chartData[0]?.price;
    const lastPrice = chartData[chartData.length - 1]?.price;

    if (!firstPrice || !lastPrice || firstPrice === 0) return null;

    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
    return change;
  }, [chartData]);

  // Get currency symbol
  const getCurrencySymbol = (currency: CurrencyType) => {
    switch (currency) {
      case "USD":
        return "$";
      case "VND":
        return "₫";
      case "LAK":
        return "₭";
      default:
        return "";
    }
  };

  // Format price for display
  const formatPrice = (value: number) => {
    if (selectedCurrency === "USD") {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Handle currency change with loading state
  const handleCurrencyChange = (value: CurrencyType) => {
    setIsLoading(true);
    setSelectedCurrency(value);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Check if currentPrice is a PropertyPrice object
  const hasMultipleCurrencies =
    currentPrice && typeof currentPrice === "object";

  if (!priceHistory || priceHistory.length === 0) {
    return null;
  }

  const isPositiveTrend = priceChange !== null && priceChange >= 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <Card
      className="mt-4 overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 shadow-lg"
      style={{
        marginTop: 16,
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Header Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <Title level={4} className="!mb-1 !text-lg font-bold text-gray-900">
              {t("property.priceHistory")}
            </Title>
            <Typography.Text className="text-sm text-gray-500">
              {t("property.priceChangeOverTime")}
            </Typography.Text>
          </div>
        </div>

        {hasMultipleCurrencies && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <Select
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-32"
              size="middle"
              options={[
                {
                  value: "USD",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">$</span>
                      <span>USD</span>
                    </div>
                  ),
                },
                {
                  value: "VND",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">₫</span>
                      <span>VND</span>
                    </div>
                  ),
                },
                {
                  value: "LAK",
                  label: (
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">₭</span>
                      <span>LAK</span>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Price Change Indicator */}
      {priceChange !== null && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 p-4">
          <div className="flex items-center gap-3">
            <Badge
              count={
                <div
                  className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                    isPositiveTrend
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <TrendIcon size={14} />
                  <span className="text-sm font-semibold">
                    {isPositiveTrend ? "+" : ""}
                    {priceChange.toFixed(2)}%
                  </span>
                </div>
              }
            />
            <div>
              <Typography.Text className="text-sm font-medium text-gray-600">
                {isPositiveTrend ? "Price increased" : "Price decreased"}
              </Typography.Text>
              <div className="text-xs text-gray-500">
                Since {chartData[0]?.date}
              </div>
            </div>
          </div>
          <div className="text-right">
            <Typography.Text className="text-xs text-gray-500">
              Current Price
            </Typography.Text>
            <div className="text-lg font-bold text-gray-900">
              {getCurrencySymbol(selectedCurrency)}
              {formatPrice(chartData[chartData.length - 1]?.price ?? 0)}
            </div>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm">
            <Spin size="large" />
          </div>
        )}

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={isPositiveTrend ? "#10b981" : "#ef4444"}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={isPositiveTrend ? "#10b981" : "#ef4444"}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                angle={chartData.length > 6 ? -45 : 0}
                textAnchor={chartData.length > 6 ? "end" : "middle"}
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value: unknown) => formatPrice(value as number)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: unknown) => [
                  `${getCurrencySymbol(selectedCurrency)}${formatPrice(value as number)}`,
                  `${t("property.price")} (${selectedCurrency})`,
                ]}
                labelStyle={{
                  color: "#374151",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositiveTrend ? "#10b981" : "#ef4444"}
                strokeWidth={3}
                fill="url(#colorPrice)"
                dot={{
                  fill: isPositiveTrend ? "#10b981" : "#ef4444",
                  r: 4,
                  stroke: "white",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  stroke: isPositiveTrend ? "#10b981" : "#ef4444",
                  strokeWidth: 3,
                  fill: "white",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="py-12">
            <Empty
              description={
                <div className="text-center">
                  <div className="mb-2 text-gray-500">
                    {t("property.noPriceHistory")}
                  </div>
                  <Typography.Text className="text-sm text-gray-400">
                    Price history will appear here once available
                  </Typography.Text>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        )}
      </div>

      {/* Chart Footer Info */}
      {chartData.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${isPositiveTrend ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span>Price Trend</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-200"></div>
              <span>{chartData.length} Data Points</span>
            </div>
          </div>
          <Typography.Text className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </Typography.Text>
        </div>
      )}
    </Card>
  );
}
