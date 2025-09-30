export const PRICE_RANGE_VALUE = [0, 100000000000];
export const AREA_RANGE_VALUE = [0, 500000];

// Price range option values - static for logic
export const PRICE_RANGE_VALUES = [
  "all",
  "under-500",
  "500-800",
  "800-1000",
  "1000-2000",
  "2000-5000",
  "5000-10000",
  "over-10000",
] as const;

// Area range option values - static for logic
export const AREA_RANGE_VALUES = [
  "all",
  "under-50",
  "50-100",
  "100-200",
  "200-300",
  "300-500",
  "over-500",
] as const;
