"use client";

import type {
  APIResponse,
  LocationInfo,
  Property,
  PropertyType,
} from "@/@types/types";
import PropertiesMap from "@/components/business/common/properties-map";
import PropertyCardSkeleton from "@/components/business/common/property-card-skeleton";
import { numberToString } from "@/share/helper/number-to-string";
import locationInfoService from "@/share/service/location-info.service";
import propertyTypeService from "@/share/service/property-type.service";
import propertyService from "@/share/service/property.service";
import { useClickAway, useEventListener, useRequest } from "ahooks";
import {
  App,
  Button,
  Checkbox,
  Empty,
  Input,
  Modal,
  Pagination,
  Radio,
  Slider,
  Spin,
  Typography,
} from "antd";
import {
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronRight,
  ChevronUp,
  Filter,
  Grid3X3,
  List,
  Map,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropertyCard from "./property-card";

import {
  getLangByLocale,
  getPropertyParamsByLocale,
  getValidLocale,
  type SupportedLocale,
} from "@/share/helper/locale.helper";
import { useCurrencyStore } from "@/share/store/currency.store";
import { useUrlLocale } from "@/utils/locale";
import Image from "next/image";
import ApprovedBankRequests from "../../property-details/approved-bank-requests";
import BrokerUsers from "../../property-details/broker-users";

interface PropertiesProps {
  transaction: "sale" | "rent" | "project";
}

const Properties = ({ transaction }: PropertiesProps) => {
  const t = useTranslations();
  const { message } = App.useApp();
  const locale = useUrlLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { currency } = useCurrencyStore();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [locationInfos, setLocationInfos] = useState<LocationInfo[]>([]);
  const [trendingLocations, setTrendingLocations] = useState<LocationInfo[]>(
    [],
  );
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 50000]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedAreaRange, setSelectedAreaRange] = useState<string>("all");

  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [layout, setLayout] = useState<"grid" | "list" | "map">("list");
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  const searchModalRef = useRef<HTMLDivElement>(null);
  const locationModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const [allMapProperties, setAllMapProperties] = useState<Property[] | null>(null);
  const [isLoadingMapData, setIsLoadingMapData] = useState(false);
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-collapse/expand search section on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let timeoutId: NodeJS.Timeout;
    let scrollUpStartY: number | null = null;
    let scrollDownStartY: number | null = null;

    const handleScroll = () => {
      // Don't interfere if user is manually interacting
      if (isUserInteracting) return;

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;

        // Track scroll down distance and collapse after scrolling down more than 50px
        if (currentScrollY > 100 && isSearchExpanded && !isScrollingUp) {
          scrollDownStartY ??= currentScrollY;

          const scrollDownDistance = currentScrollY - scrollDownStartY;

          if (scrollDownDistance > 0) {
            setIsSearchExpanded(false);
            scrollUpStartY = null;
            scrollDownStartY = null;
          }
        }
        else if (currentScrollY < 5 && !isSearchExpanded) {
          setIsSearchExpanded(true);
          scrollUpStartY = null;
          scrollDownStartY = null;
        }
        // If scrolling up and already expanded, keep it expanded and reset down tracking
        else if (isScrollingUp && isSearchExpanded) {
          scrollUpStartY = null;
          scrollDownStartY = null;
        }
        // Reset scroll up tracking if scrolling down and not expanded
        else if (!isScrollingUp && !isSearchExpanded) {
          scrollUpStartY = null;
        }

        lastScrollY = currentScrollY;
      }, 50); // 50ms debounce
    };

    // Debounced scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchExpanded, isUserInteracting]);

  // Fetch property types
  const { loading: propertyTypesLoading } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: transaction,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data ?? [];
    },
    {
      onSuccess: (data) => {
        setPropertyTypes(data);
      },
      onError: (error) => {
        message.error(t("admin.cannotLoadPropertyTypes"));
      },
    },
  );

  // Fetch location infos
  const { loading: locationInfosLoading } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo({
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data ?? [];
    },
    {
      onSuccess: (data) => {
        setLocationInfos(data);
      },
      onError: (error) => {
        console.error("Failed to fetch location infos:", error);
        message.error(t("admin.cannotLoadLocations"));
      },
    },
  );

  // Fetch trending locations
  const { loading: trendingLocationsLoading } = useRequest(
    async () => {
      const response = await locationInfoService.getTrendingLocations(
        getLangByLocale(getValidLocale(locale)),
      );
      return response.data ?? [];
    },
    {
      onSuccess: (data) => {
        setTrendingLocations(data);
      },
      onError: (error) => {
        console.error("Failed to fetch trending locations:", error);
        message.error(t("admin.cannotLoadTrendingLocations"));
      },
    },
  );

  const updateSearchParams = useCallback(
    (params: Record<string, string | string[]>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            newSearchParams.set(key, value.join(","));
          } else {
            newSearchParams.delete(key);
          }
        } else {
          const shouldRemove =
            value === "" ||
            value === "0" ||
            value === "false" ||
            value === "all" ||
            !value ||
            value.trim() === "";

          if (shouldRemove) {
            newSearchParams.delete(key);
          } else {
            newSearchParams.set(key, value);
          }
        }
      });

      const newUrl = `${pathname}?${newSearchParams.toString()}`;
      router.push(newUrl);
    },
    [searchParams, pathname, router],
  );

  const {
    data: properties,
    loading: propertiesLoading,
    run: fetchProperties,
  } = useRequest(
    async (params?: Record<string, string | number | string[] | boolean>) => {
      const apiParams: Record<string, string | number | string[] | boolean> = {
        transaction: transaction,
        page: currentPage,
        perPage: pageSize,
        ...getPropertyParamsByLocale(locale as SupportedLocale),
        ...params,
      };

      if (debouncedKeyword?.trim()) {
        apiParams.keyword = debouncedKeyword;
      }

      if (minPrice && minPrice !== "0") {
        apiParams.minPrice = parseInt(minPrice);
      }

      if (maxPrice && maxPrice !== "" && parseInt(maxPrice) !== maxPriceValue) {
        apiParams.maxPrice = parseInt(maxPrice);
      }

      if (minArea && minArea !== "0") {
        apiParams.minArea = parseInt(minArea);
      }

      if (maxArea && maxArea !== "" && parseInt(maxArea) !== 10000) {
        apiParams.maxArea = parseInt(maxArea);
      }

      if (selectedLocation && selectedLocation !== "all") {
        apiParams.locationId = selectedLocation;
      }

      if (selectedPropertyTypes.length > 0) {
        apiParams.type = selectedPropertyTypes.join(",");
      }

      const response = await propertyService.getProperties(apiParams);
      return response as unknown as APIResponse<Property[]>;
    },
    {
      manual: true,
      cacheKey: "properties-search",
      onSuccess: (data) => {
        setTotal(data.meta?.itemCount ?? 0);
      },
    },
  );

  useEffect(() => {
    if (isInitialLoad) return;

    const timer = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    selectedPropertyTypes,
    debouncedKeyword,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    selectedLocation,
    fetchProperties,
    isInitialLoad,
    currency, // Refetch when currency changes
  ]);

  useEffect(() => {
    if (isInitialLoad) return;

    fetchProperties();
  }, [fetchProperties, isInitialLoad]);

  useClickAway(() => {
    setSearchModalOpen(false);
  }, [searchModalRef, searchInputRef]);

  useClickAway(() => {
    setLocationModalOpen(false);
  }, [locationModalRef, locationButtonRef]);

  useClickAway(() => {
    if (!isMobile) {
      setSearchModalOpen(false);
      setLocationModalOpen(false);
      setPriceRangeOpen(false);
      setPropertyTypeOpen(false);
      setAreaOpen(false);
    } else {
      setSearchModalOpen(false);
      setLocationModalOpen(false);
    }
  }, [searchModalRef, locationModalRef, searchInputRef, locationButtonRef]);

  useEventListener(
    "scroll",
    () => {
      if (!isMobile) {
        setSearchModalOpen(false);
        setLocationModalOpen(false);
        setPriceRangeOpen(false);
        setPropertyTypeOpen(false);
        setAreaOpen(false);
      } else {
        setSearchModalOpen(false);
        setLocationModalOpen(false);
      }
    },
    { target: typeof document !== "undefined" ? document : undefined },
  );
  useEffect(() => {

    if (layout !== "map") {
      setIsLoadingMapData(false);
      return;
    };

    let mounted = true;
    const loadMapProperties = async () => {
      setIsLoadingMapData(true);
      try {
        const apiParams: Record<string, string | number | string[] | boolean> = {
          transaction,
          page: 1,
          perPage: total > 0 ? total : 1000000,
          ...getPropertyParamsByLocale(locale as SupportedLocale),
        };

        if (debouncedKeyword?.trim()) apiParams.keyword = debouncedKeyword;
        if (minPrice && minPrice !== "0") apiParams.minPrice = parseInt(minPrice);
        if (maxPrice && maxPrice !== "" && parseInt(maxPrice) !== maxPriceValue) apiParams.maxPrice = parseInt(maxPrice);
        if (minArea && minArea !== "0") apiParams.minArea = parseInt(minArea);
        if (maxArea && maxArea !== "" && parseInt(maxArea) !== 10000) apiParams.maxArea = parseInt(maxArea);
        if (selectedLocation && selectedLocation !== "all") apiParams.locationId = selectedLocation;
        if (selectedPropertyTypes.length > 0) apiParams.type = selectedPropertyTypes.join(",");

        const resp = await propertyService.getProperties(apiParams);
        if (mounted) setAllMapProperties(resp?.data ?? []);
      } catch (err) {
        console.error("Failed to load map properties", err);
      }
      finally {
        if (mounted) {
          setIsLoadingMapData(false);
        }
      }
    };

    void loadMapProperties();

    return () => {
      mounted = false;
    };
  }, [
    layout,
    transaction,
    debouncedKeyword,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    selectedLocation,
    selectedPropertyTypes,
    total,
    locale,
    currency,
  ]);


  useEffect(() => {
    if (typeof document === "undefined" || isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isOutsideDropdown = !target.closest(".filter-dropdown");
      const isOutsideButton = !target.closest(".filter-dropdown-button");

      if (isOutsideDropdown && isOutsideButton) {
        setPriceRangeOpen(false);
        setPropertyTypeOpen(false);
        setAreaOpen(false);
      }
    };

    if (!isMobile && (priceRangeOpen || propertyTypeOpen || areaOpen)) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [priceRangeOpen, propertyTypeOpen, areaOpen, isMobile]);

  // Create locations array from API data
  const locations = [
    { id: "all", label: t("search.allAreas") },
    ...locationInfos.map((locationInfo) => ({
      id: locationInfo.id,
      label: locationInfo.name,
    })),
  ];

  // Create popular cities from API data (first 5 locations)
  const popularCities = locationInfos.slice(0, 5).map((locationInfo) => ({
    id: locationInfo.id,
    name: locationInfo.name,
    imageURL: locationInfo.imageURL ?? "/images/landingpage/cities/default.jpg",
  }));

  // Create all provinces from API data
  const allProvinces = [
    "all",
    ...locationInfos.map((locationInfo) => locationInfo.id),
  ];

  // Generate property type options from API data

  const propertyTypeOptions = [
    ...propertyTypes.map((type) => ({
      id: type.id,
      name: type.name,
      icon: <Building2 className="h-4 w-4" />,
    })),
  ];

  // Get max price based on currency and transaction type
  const getMaxPrice = (currency: string, transactionType: string) => {
    if (currency === "USD") {
      return transactionType === "sale" || transactionType === "project"
        ? 5000000
        : 100000;
    } else if (currency === "LAK") {
      return transactionType === "sale" || transactionType === "project"
        ? 100000000000
        : 2000000000;
    } else if (currency === "VND") {
      return transactionType === "sale" || transactionType === "project"
        ? 100000000000
        : 2000000000;
    } else if (currency === "THB") {
      return transactionType === "sale" || transactionType === "project"
        ? 150000000
        : 2000000;
    }
    return 100000000000; // Default fallback
  };

  // Calculate max price for current currency and transaction type
  const maxPriceValue = useMemo(
    () => getMaxPrice(currency, transaction),
    [currency, transaction],
  );

  // Get appropriate step size based on max price
  const priceStep = useMemo(() => {
    if (maxPriceValue >= 10000000000) {
      return 100000000; // 100M for very large values (LAK, VND)
    } else if (maxPriceValue >= 1000000000) {
      return 10000000; // 10M for large values
    } else if (maxPriceValue >= 100000000) {
      return 1000000; // 1M for medium-large values (THB)
    } else if (maxPriceValue >= 1000000) {
      return 100000; // 100K for medium values
    } else {
      return 1000; // 1K for smaller values (USD rent)
    }
  }, [maxPriceValue]);

  // Initialize price range when max value changes
  useEffect(() => {
    setPriceRange((prevRange) => {
      if (prevRange[1] === 0 || prevRange[1] > maxPriceValue) {
        return [prevRange[0], maxPriceValue];
      }
      return prevRange;
    });
  }, [maxPriceValue]);

  // Get price ranges based on currency and transaction type
  const getPriceRanges = useCallback(
    (currency: string, transactionType: string) => {
      const baseRanges = [{ value: "all", label: t("search.priceRanges.all") }];

      // Get currency unit labels based on locale
      const getUnits = () => {
        if (locale === "la") {
          return { billion: "ຕື້", million: "ລ້ານ", thousand: "ພັນ" };
        } else if (locale === "vn") {
          return { billion: "tỷ", million: "triệu", thousand: "nghìn" };
        } else {
          return { billion: "B", million: "M", thousand: "K" };
        }
      };

      const units = getUnits();

      if (currency === "USD") {
        if (transactionType === "sale" || transactionType === "project") {
          // Buy and Project ranges for USD
          return [
            ...baseRanges,
            { value: "0-10000", label: `0 - 10 ${units.thousand} ${currency}` },
            {
              value: "10000-20000",
              label: `10 ${units.thousand} - 20 ${units.thousand} ${currency}`,
            },
            {
              value: "20000-30000",
              label: `20 ${units.thousand} - 30 ${units.thousand} ${currency}`,
            },
            {
              value: "30000-50000",
              label: `30 ${units.thousand} - 50 ${units.thousand} ${currency}`,
            },
            {
              value: "50000-80000",
              label: `50 ${units.thousand} - 80 ${units.thousand} ${currency}`,
            },
            {
              value: "80000-100000",
              label: `80 ${units.thousand} - 100 ${units.thousand} ${currency}`,
            },
            {
              value: "100000-150000",
              label: `100 ${units.thousand} - 150 ${units.thousand} ${currency}`,
            },
            {
              value: "150000-200000",
              label: `150 ${units.thousand} - 200 ${units.thousand} ${currency}`,
            },
            {
              value: "200000-300000",
              label: `200 ${units.thousand} - 300 ${units.thousand} ${currency}`,
            },
            {
              value: "300000-500000",
              label: `300 ${units.thousand} - 500 ${units.thousand} ${currency}`,
            },
            {
              value: "500000-800000",
              label: `500 ${units.thousand} - 800 ${units.thousand} ${currency}`,
            },
            {
              value: "800000-1000000",
              label: `800 ${units.thousand} - 1 ${units.million} ${currency}`,
            },
            {
              value: "1000000-1500000",
              label: `1 ${units.million} - 1.5 ${units.million} ${currency}`,
            },
            {
              value: "1500000-2000000",
              label: `1.5 ${units.million} - 2 ${units.million} ${currency}`,
            },
            {
              value: "2000000-3000000",
              label: `2 ${units.million} - 3 ${units.million} ${currency}`,
            },
            {
              value: "over-3000000",
              label: `> 3 ${units.million} ${currency}`,
            },
          ];
        } else {
          // Rent ranges for USD
          return [
            ...baseRanges,
            { value: "0-100", label: `0 - 100 ${currency}` },
            { value: "100-200", label: `100 - 200 ${currency}` },
            { value: "200-300", label: `200 - 300 ${currency}` },
            { value: "300-500", label: `300 - 500 ${currency}` },
            { value: "500-800", label: `500 - 800 ${currency}` },
            {
              value: "800-1000",
              label: `800 - 1 ${units.thousand} ${currency}`,
            },
            {
              value: "1000-1500",
              label: `1 ${units.thousand} - 1.5 ${units.thousand} ${currency}`,
            },
            {
              value: "1500-2000",
              label: `1.5 ${units.thousand} - 2 ${units.thousand} ${currency}`,
            },
            {
              value: "2000-3000",
              label: `2 ${units.thousand} - 3 ${units.thousand} ${currency}`,
            },
            {
              value: "3000-5000",
              label: `3 ${units.thousand} - 5 ${units.thousand} ${currency}`,
            },
            {
              value: "5000-8000",
              label: `5 ${units.thousand} - 8 ${units.thousand} ${currency}`,
            },
            {
              value: "8000-10000",
              label: `8 ${units.thousand} - 10 ${units.thousand} ${currency}`,
            },
            {
              value: "10000-20000",
              label: `10 ${units.thousand} - 20 ${units.thousand} ${currency}`,
            },
            {
              value: "20000-50000",
              label: `20 ${units.thousand} - 50 ${units.thousand} ${currency}`,
            },
            {
              value: "over-50000",
              label: `> 50 ${units.thousand} ${currency}`,
            },
          ];
        }
      } else if (currency === "LAK") {
        if (transactionType === "sale" || transactionType === "project") {
          // Buy and Project ranges for LAK
          return [
            ...baseRanges,
            {
              value: "0-200000000",
              label: `0 - 200 ${units.million} ${currency}`,
            },
            {
              value: "200000000-400000000",
              label: `200 ${units.million} - 400 ${units.million} ${currency}`,
            },
            {
              value: "400000000-600000000",
              label: `400 ${units.million} - 600 ${units.million} ${currency}`,
            },
            {
              value: "600000000-800000000",
              label: `600 ${units.million} - 800 ${units.million} ${currency}`,
            },
            {
              value: "800000000-1000000000",
              label: `800 ${units.million} - 1 ${units.billion} ${currency}`,
            },
            {
              value: "1000000000-1500000000",
              label: `1 ${units.billion} - 1.5 ${units.billion} ${currency}`,
            },
            {
              value: "1500000000-2000000000",
              label: `1.5 ${units.billion} - 2 ${units.billion} ${currency}`,
            },
            {
              value: "2000000000-3000000000",
              label: `2 ${units.billion} - 3 ${units.billion} ${currency}`,
            },
            {
              value: "3000000000-5000000000",
              label: `3 ${units.billion} - 5 ${units.billion} ${currency}`,
            },
            {
              value: "5000000000-8000000000",
              label: `5 ${units.billion} - 8 ${units.billion} ${currency}`,
            },
            {
              value: "8000000000-10000000000",
              label: `8 ${units.billion} - 10 ${units.billion} ${currency}`,
            },
            {
              value: "10000000000-15000000000",
              label: `10 ${units.billion} - 15 ${units.billion} ${currency}`,
            },
            {
              value: "15000000000-20000000000",
              label: `15 ${units.billion} - 20 ${units.billion} ${currency}`,
            },
            {
              value: "20000000000-30000000000",
              label: `20 ${units.billion} - 30 ${units.billion} ${currency}`,
            },
            {
              value: "30000000000-50000000000",
              label: `30 ${units.billion} - 50 ${units.billion} ${currency}`,
            },
            {
              value: "over-50000000000",
              label: `> 50 ${units.billion} ${currency}`,
            },
          ];
        } else {
          // Rent ranges for LAK
          return [
            ...baseRanges,
            { value: "0-1000000", label: `0 - 1 ${units.million} ${currency}` },
            {
              value: "1000000-2000000",
              label: `1 ${units.million} - 2 ${units.million} ${currency}`,
            },
            {
              value: "2000000-3000000",
              label: `2 ${units.million} - 3 ${units.million} ${currency}`,
            },
            {
              value: "3000000-5000000",
              label: `3 ${units.million} - 5 ${units.million} ${currency}`,
            },
            {
              value: "5000000-8000000",
              label: `5 ${units.million} - 8 ${units.million} ${currency}`,
            },
            {
              value: "8000000-10000000",
              label: `8 ${units.million} - 10 ${units.million} ${currency}`,
            },
            {
              value: "10000000-15000000",
              label: `10 ${units.million} - 15 ${units.million} ${currency}`,
            },
            {
              value: "15000000-20000000",
              label: `15 ${units.million} - 20 ${units.million} ${currency}`,
            },
            {
              value: "20000000-30000000",
              label: `20 ${units.million} - 30 ${units.million} ${currency}`,
            },
            {
              value: "30000000-50000000",
              label: `30 ${units.million} - 50 ${units.million} ${currency}`,
            },
            {
              value: "50000000-80000000",
              label: `50 ${units.million} - 80 ${units.million} ${currency}`,
            },
            {
              value: "80000000-100000000",
              label: `80 ${units.million} - 100 ${units.million} ${currency}`,
            },
            {
              value: "100000000-200000000",
              label: `100 ${units.million} - 200 ${units.million} ${currency}`,
            },
            {
              value: "200000000-500000000",
              label: `200 ${units.million} - 500 ${units.million} ${currency}`,
            },
            {
              value: "500000000-1000000000",
              label: `500 ${units.million} - 1 ${units.billion} ${currency}`,
            },
            {
              value: "over-1000000000",
              label: `> 1 ${units.billion} ${currency}`,
            },
          ];
        }
      } else if (currency === "VND") {
        if (transactionType === "sale" || transactionType === "project") {
          // Buy and Project ranges for VND
          return [
            ...baseRanges,
            {
              value: "0-300000000",
              label: `0 - 300 ${units.million} ${currency}`,
            },
            {
              value: "300000000-500000000",
              label: `300 ${units.million} - 500 ${units.million} ${currency}`,
            },
            {
              value: "500000000-800000000",
              label: `500 ${units.million} - 800 ${units.million} ${currency}`,
            },
            {
              value: "800000000-1000000000",
              label: `800 ${units.million} - 1 ${units.billion} ${currency}`,
            },
            {
              value: "1000000000-1500000000",
              label: `1 ${units.billion} - 1.5 ${units.billion} ${currency}`,
            },
            {
              value: "1500000000-2000000000",
              label: `1.5 ${units.billion} - 2 ${units.billion} ${currency}`,
            },
            {
              value: "2000000000-3000000000",
              label: `2 ${units.billion} - 3 ${units.billion} ${currency}`,
            },
            {
              value: "3000000000-5000000000",
              label: `3 ${units.billion} - 5 ${units.billion} ${currency}`,
            },
            {
              value: "5000000000-8000000000",
              label: `5 ${units.billion} - 8 ${units.billion} ${currency}`,
            },
            {
              value: "8000000000-10000000000",
              label: `8 ${units.billion} - 10 ${units.billion} ${currency}`,
            },
            {
              value: "10000000000-15000000000",
              label: `10 ${units.billion} - 15 ${units.billion} ${currency}`,
            },
            {
              value: "15000000000-20000000000",
              label: `15 ${units.billion} - 20 ${units.billion} ${currency}`,
            },
            {
              value: "20000000000-30000000000",
              label: `20 ${units.billion} - 30 ${units.billion} ${currency}`,
            },
            {
              value: "30000000000-50000000000",
              label: `30 ${units.billion} - 50 ${units.billion} ${currency}`,
            },
            {
              value: "over-50000000000",
              label: `> 50 ${units.billion} ${currency}`,
            },
          ];
        } else {
          // Rent ranges for VND
          return [
            ...baseRanges,
            { value: "0-1000000", label: `0 - 1 ${units.million} ${currency}` },
            {
              value: "1000000-2000000",
              label: `1 ${units.million} - 2 ${units.million} ${currency}`,
            },
            {
              value: "2000000-3000000",
              label: `2 ${units.million} - 3 ${units.million} ${currency}`,
            },
            {
              value: "3000000-5000000",
              label: `3 ${units.million} - 5 ${units.million} ${currency}`,
            },
            {
              value: "5000000-8000000",
              label: `5 ${units.million} - 8 ${units.million} ${currency}`,
            },
            {
              value: "8000000-10000000",
              label: `8 ${units.million} - 10 ${units.million} ${currency}`,
            },
            {
              value: "10000000-15000000",
              label: `10 ${units.million} - 15 ${units.million} ${currency}`,
            },
            {
              value: "15000000-20000000",
              label: `15 ${units.million} - 20 ${units.million} ${currency}`,
            },
            {
              value: "20000000-30000000",
              label: `20 ${units.million} - 30 ${units.million} ${currency}`,
            },
            {
              value: "30000000-50000000",
              label: `30 ${units.million} - 50 ${units.million} ${currency}`,
            },
            {
              value: "50000000-80000000",
              label: `50 ${units.million} - 80 ${units.million} ${currency}`,
            },
            {
              value: "80000000-100000000",
              label: `80 ${units.million} - 100 ${units.million} ${currency}`,
            },
            {
              value: "100000000-200000000",
              label: `100 ${units.million} - 200 ${units.million} ${currency}`,
            },
            {
              value: "200000000-500000000",
              label: `200 ${units.million} - 500 ${units.million} ${currency}`,
            },
            {
              value: "500000000-1000000000",
              label: `500 ${units.million} - 1 ${units.billion} ${currency}`,
            },
            {
              value: "over-1000000000",
              label: `> 1 ${units.billion} ${currency}`,
            },
          ];
        }
      } else if (currency === "THB") {
        if (transactionType === "sale" || transactionType === "project") {
          // Buy and Project ranges for THB
          return [
            ...baseRanges,
            {
              value: "0-500000",
              label: `0 - 500 ${units.thousand} ${currency}`,
            },
            {
              value: "500000-1000000",
              label: `500 ${units.thousand} - 1 ${units.million} ${currency}`,
            },
            {
              value: "1000000-1500000",
              label: `1 ${units.million} - 1.5 ${units.million} ${currency}`,
            },
            {
              value: "1500000-2000000",
              label: `1.5 ${units.million} - 2 ${units.million} ${currency}`,
            },
            {
              value: "2000000-3000000",
              label: `2 ${units.million} - 3 ${units.million} ${currency}`,
            },
            {
              value: "3000000-5000000",
              label: `3 ${units.million} - 5 ${units.million} ${currency}`,
            },
            {
              value: "5000000-8000000",
              label: `5 ${units.million} - 8 ${units.million} ${currency}`,
            },
            {
              value: "8000000-10000000",
              label: `8 ${units.million} - 10 ${units.million} ${currency}`,
            },
            {
              value: "10000000-15000000",
              label: `10 ${units.million} - 15 ${units.million} ${currency}`,
            },
            {
              value: "15000000-20000000",
              label: `15 ${units.million} - 20 ${units.million} ${currency}`,
            },
            {
              value: "20000000-30000000",
              label: `20 ${units.million} - 30 ${units.million} ${currency}`,
            },
            {
              value: "30000000-50000000",
              label: `30 ${units.million} - 50 ${units.million} ${currency}`,
            },
            {
              value: "50000000-80000000",
              label: `50 ${units.million} - 80 ${units.million} ${currency}`,
            },
            {
              value: "over-80000000",
              label: `> 80 ${units.million} ${currency}`,
            },
          ];
        } else {
          // Rent ranges for THB
          return [
            ...baseRanges,
            { value: "0-3000", label: `0 - 3 ${units.thousand} ${currency}` },
            {
              value: "3000-5000",
              label: `3 ${units.thousand} - 5 ${units.thousand} ${currency}`,
            },
            {
              value: "5000-8000",
              label: `5 ${units.thousand} - 8 ${units.thousand} ${currency}`,
            },
            {
              value: "8000-10000",
              label: `8 ${units.thousand} - 10 ${units.thousand} ${currency}`,
            },
            {
              value: "10000-15000",
              label: `10 ${units.thousand} - 15 ${units.thousand} ${currency}`,
            },
            {
              value: "15000-20000",
              label: `15 ${units.thousand} - 20 ${units.thousand} ${currency}`,
            },
            {
              value: "20000-30000",
              label: `20 ${units.thousand} - 30 ${units.thousand} ${currency}`,
            },
            {
              value: "30000-50000",
              label: `30 ${units.thousand} - 50 ${units.thousand} ${currency}`,
            },
            {
              value: "50000-80000",
              label: `50 ${units.thousand} - 80 ${units.thousand} ${currency}`,
            },
            {
              value: "80000-100000",
              label: `80 ${units.thousand} - 100 ${units.thousand} ${currency}`,
            },
            {
              value: "100000-150000",
              label: `100 ${units.thousand} - 150 ${units.thousand} ${currency}`,
            },
            {
              value: "150000-200000",
              label: `150 ${units.thousand} - 200 ${units.thousand} ${currency}`,
            },
            {
              value: "200000-500000",
              label: `200 ${units.thousand} - 500 ${units.thousand} ${currency}`,
            },
            {
              value: "500000-1000000",
              label: `500 ${units.thousand} - 1 ${units.million} ${currency}`,
            },
            {
              value: "over-1000000",
              label: `> 1 ${units.million} ${currency}`,
            },
          ];
        }
      }

      // Default ranges (fallback)
      return [
        ...baseRanges,
        { value: "under-500", label: t("search.priceRanges.under500") },
        { value: "500-800", label: t("search.priceRanges.range500to800") },
        { value: "800-1000", label: t("search.priceRanges.range800to1000") },
        { value: "1000-2000", label: t("search.priceRanges.range1to2billion") },
        { value: "2000-5000", label: t("search.priceRanges.range2to5billion") },
        {
          value: "5000-10000",
          label: t("search.priceRanges.range5to10billion"),
        },
        { value: "over-10000", label: t("search.priceRanges.over10billion") },
      ];
    },
    [t, locale],
  );

  // Create translated price ranges based on current currency and transaction type
  const priceRanges = useMemo(
    () => getPriceRanges(currency, transaction),
    [getPriceRanges, currency, transaction],
  );

  const handleSearch = () => {
    const params: Record<string, string | string[]> = {};

    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minArea) params.minArea = minArea;
    if (maxArea) params.maxArea = maxArea;
    if (selectedPropertyTypes.length > 0) {
      params.type = selectedPropertyTypes.join(",");
    }
    if (selectedLocation && selectedLocation !== "all") {
      params.locationId = selectedLocation;
    }
    if (keyword) params.keyword = keyword;

    updateSearchParams(params);
    message.success(t("search.searching"));
  };

  const handleSelectedPropertyType = (type: string) => {
    let newSelectedTypes: string[];

    if (type === "all") {
      const allTypeIds = propertyTypes.map((pt) => pt.id);
      const isAllSelected = allTypeIds.every((id) =>
        selectedPropertyTypes.includes(id),
      );

      if (isAllSelected) {
        newSelectedTypes = [];
      } else {
        newSelectedTypes = allTypeIds;
      }
    } else {
      newSelectedTypes = selectedPropertyTypes.includes(type)
        ? selectedPropertyTypes.filter((id) => id !== type)
        : [...selectedPropertyTypes, type];
    }

    setSelectedPropertyTypes(newSelectedTypes);

    updateSearchParams({
      type: newSelectedTypes.join(","),
    });
  };

  const handlePriceRangeSelection = (rangeValue: string) => {
    setSelectedPriceRange(rangeValue);

    let minValue = 0;
    let maxValue = maxPriceValue;

    if (rangeValue === "all") {
      minValue = 0;
      maxValue = maxPriceValue;
      // Clear price range from URL params
      setPriceRange([minValue, maxValue]);
      setMinPrice("");
      setMaxPrice("");
      updateSearchParams({ minPrice: "", maxPrice: "" });
      return;
    } else if (rangeValue.startsWith("over-")) {
      // Handle "over-X" format
      const minStr = rangeValue.replace("over-", "");
      const parsedMin = parseInt(minStr);
      if (!isNaN(parsedMin)) {
        minValue = parsedMin;
        maxValue = maxPriceValue;
      }
    } else {
      // Parse range format "min-max"
      const parts = rangeValue.split("-");
      if (parts.length === 2) {
        const minStr = parts[0];
        const maxStr = parts[1];
        if (minStr && maxStr) {
          const parsedMin = parseInt(minStr);
          const parsedMax = parseInt(maxStr);

          if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
            minValue = parsedMin;
            maxValue = parsedMax;
          }
        }
      }
    }

    setPriceRange([minValue, maxValue]);
    setMinPrice(minValue.toString());
    setMaxPrice(maxValue.toString());

    const params: Record<string, string> = {};
    if (minValue !== 0) {
      params.minPrice = minValue.toString();
    } else {
      params.minPrice = "";
    }
    if (maxValue !== maxPriceValue) {
      params.maxPrice = maxValue.toString();
    } else {
      params.maxPrice = "";
    }

    updateSearchParams(params);
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setSelectedPriceRange("");
    setMinPrice(value[0].toString());
    setMaxPrice(value[1].toString());

    const params: Record<string, string> = {};
    if (value[0] !== 0) {
      params.minPrice = value[0].toString();
    } else {
      params.minPrice = "";
    }
    // If max value is at the maximum, treat it as infinity (no maxPrice parameter)
    if (value[1] !== maxPriceValue) {
      params.maxPrice = value[1].toString();
    } else {
      params.maxPrice = "";
    }

    updateSearchParams(params);
  };

  const handleMinPriceInputChange = (value: number) => {
    const numValue = value || 0;
    setPriceRange([numValue, priceRange[1]]);
    setSelectedPriceRange("");
    setMinPrice(numValue.toString());

    const params: Record<string, string> = {};
    if (numValue !== 0) {
      params.minPrice = numValue.toString();
    } else {
      params.minPrice = "";
    }

    updateSearchParams(params);
  };

  const handleMaxPriceInputChange = (value: number) => {
    const numValue = value || maxPriceValue;
    setPriceRange([priceRange[0], numValue]);
    setSelectedPriceRange("");
    setMaxPrice(numValue.toString());

    const params: Record<string, string> = {};
    // If max value is at the maximum, treat it as infinity (no maxPrice parameter)
    if (numValue !== maxPriceValue) {
      params.maxPrice = numValue.toString();
    } else {
      params.maxPrice = "";
    }

    updateSearchParams(params);
  };

  const handleAreaRangeChange = (value: [number, number]) => {
    setAreaRange(value);
    setSelectedAreaRange("");
    setMinArea(value[0].toString());
    setMaxArea(value[1].toString());

    const params: Record<string, string> = {};
    if (value[0] !== 0) {
      params.minArea = value[0].toString();
    } else {
      params.minArea = "";
    }
    if (value[1] !== 50000) {
      params.maxArea = value[1].toString();
    } else {
      params.maxArea = "";
    }

    updateSearchParams(params);
  };

  const handleAreaRangeSelection = (rangeValue: string) => {
    setSelectedAreaRange(rangeValue);

    let minValue = 0;
    let maxValue = 50000;

    if (rangeValue === "all") {
      minValue = 0;
      maxValue = 50000;
      // Clear area range from URL params
      setAreaRange([minValue, maxValue]);
      setMinArea("");
      setMaxArea("");
      updateSearchParams({ minArea: "", maxArea: "" });
      return;
    } else if (rangeValue.startsWith("under-")) {
      // Handle "under-X" format
      const maxStr = rangeValue.replace("under-", "");
      const parsedMax = parseInt(maxStr);
      if (!isNaN(parsedMax)) {
        minValue = 0;
        maxValue = parsedMax;
      }
    } else if (rangeValue.startsWith("over-")) {
      // Handle "over-X" format
      const minStr = rangeValue.replace("over-", "");
      const parsedMin = parseInt(minStr);
      if (!isNaN(parsedMin)) {
        minValue = parsedMin;
        maxValue = 50000;
      }
    } else {
      // Parse range format "min-max"
      const parts = rangeValue.split("-");
      if (parts.length === 2) {
        const minStr = parts[0];
        const maxStr = parts[1];
        if (minStr && maxStr) {
          const parsedMin = parseInt(minStr);
          const parsedMax = parseInt(maxStr);

          if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
            minValue = parsedMin;
            maxValue = parsedMax;
          }
        }
      }
    }

    setAreaRange([minValue, maxValue]);
    setMinArea(minValue.toString());
    setMaxArea(maxValue.toString());

    const params: Record<string, string> = {};
    if (minValue !== 0) {
      params.minArea = minValue.toString();
    } else {
      params.minArea = "";
    }
    if (maxValue !== 50000) {
      params.maxArea = maxValue.toString();
    } else {
      params.maxArea = "";
    }

    updateSearchParams(params);
  };

  const togglePropertyTypeModal = () => {
    setPropertyTypeOpen(!propertyTypeOpen);
    setPriceRangeOpen(false);
    setAreaOpen(false);
  };

  const togglePriceRangeModal = () => {
    setPriceRangeOpen(!priceRangeOpen);
    setPropertyTypeOpen(false);
    setAreaOpen(false);
  };

  const toggleAreaModal = () => {
    setAreaOpen(!areaOpen);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
  };

  const handleSearchInputClick = () => {
    setSearchModalOpen(!searchModalOpen);
    setLocationModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
    setAreaOpen(false);
    setLocationModalOpen(false);
  };

  const handleLocationClick = () => {
    setLocationModalOpen(!locationModalOpen);
    setSearchModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
    setAreaOpen(false);
  };

  const handleProvinceSelect = (id: string) => {
    setSelectedLocation(id);
    setLocationModalOpen(false);

    updateSearchParams({
      locationId: id || "",
    });
  };

  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlMinArea = searchParams.get("minArea");
    const urlMaxArea = searchParams.get("maxArea");
    const urlSelectedPropertyTypes =
      searchParams.get("type")?.split(",").filter(Boolean) ?? [];
    const urlSelectedLocation = searchParams.get("locationId") ?? "all";
    const urlKeyword = searchParams.get("keyword") ?? "";

    // Update state
    setMinPrice(urlMinPrice ?? "");
    setMaxPrice(urlMaxPrice ?? "");
    setMinArea(urlMinArea ?? "");
    setMaxArea(urlMaxArea ?? "");
    setSelectedPropertyTypes(urlSelectedPropertyTypes);
    setSelectedLocation(urlSelectedLocation);
    setKeyword(urlKeyword);
    setDebouncedKeyword(urlKeyword);

    // Update price range
    const newMinPrice = parseInt(urlMinPrice ?? "0");
    const newMaxPrice = parseInt(urlMaxPrice ?? maxPriceValue.toString());
    setPriceRange([newMinPrice, newMaxPrice]);

    // Update area range
    const newMinArea = parseInt(urlMinArea ?? "0");
    const newMaxArea = parseInt(urlMaxArea ?? "50000");
    setAreaRange([newMinArea, newMaxArea]);

    // Update selected price range based on current price ranges
    let newSelectedPriceRange = "all";
    if (newMinPrice !== 0 || newMaxPrice !== maxPriceValue) {
      // Find matching range from current price ranges
      const matchingRange = priceRanges.find((range) => {
        if (range.value === "all") return false;

        // Parse range format "min-max"
        const parts = range.value.split("-");
        if (parts.length === 2) {
          const minStr = parts[0];
          const maxStr = parts[1];
          if (minStr && maxStr) {
            const rangeMin = parseInt(minStr);
            const rangeMax = parseInt(maxStr);

            return newMinPrice === rangeMin && newMaxPrice === rangeMax;
          }
        }
        return false;
      });

      if (matchingRange) {
        newSelectedPriceRange = matchingRange.value;
      } else {
        newSelectedPriceRange = "";
      }
    }
    setSelectedPriceRange(newSelectedPriceRange);

    // Update selected area range
    let newSelectedAreaRange = "all";
    const urlMinAreaNum = parseInt(urlMinArea ?? "0");
    const urlMaxAreaNum = parseInt(urlMaxArea ?? "1000");

    if (urlMinAreaNum === 0 && urlMaxAreaNum === 50) {
      newSelectedAreaRange = "under-50";
    } else if (urlMinAreaNum === 50 && urlMaxAreaNum === 100) {
      newSelectedAreaRange = "50-100";
    } else if (urlMinAreaNum === 100 && urlMaxAreaNum === 200) {
      newSelectedAreaRange = "100-200";
    } else if (urlMinAreaNum === 200 && urlMaxAreaNum === 300) {
      newSelectedAreaRange = "200-300";
    } else if (urlMinAreaNum === 300 && urlMaxAreaNum === 500) {
      newSelectedAreaRange = "300-500";
    } else if (urlMinAreaNum === 500 && urlMaxAreaNum === 1000) {
      newSelectedAreaRange = "over-500";
    } else if (urlMinAreaNum !== 0 || urlMaxAreaNum !== 1000) {
      newSelectedAreaRange = "";
    }
    setSelectedAreaRange(newSelectedAreaRange);

    setIsInitialLoad(false);
  }, [searchParams, priceRanges, maxPriceValue]);

  useEffect(() => {
    if (isInitialLoad) return;

    const timer = setTimeout(() => {
      if (keyword !== debouncedKeyword) {
        setDebouncedKeyword(keyword);
        updateSearchParams({
          keyword: keyword || "",
        });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [keyword, debouncedKeyword, updateSearchParams, isInitialLoad]);

  // Fetch properties when page changes
  useEffect(() => {
    if (isInitialLoad) return;
    fetchProperties();
  }, [currentPage, fetchProperties, isInitialLoad]);

  // Initial fetch
  useEffect(() => {
    if (!isInitialLoad) {
      fetchProperties();
    }
  }, [fetchProperties, isInitialLoad]);

  const getFilterDisplayText = () => {
    const filters = [];

    if (selectedLocation && selectedLocation !== "all") {
      const location = locations.find((loc) => loc.id === selectedLocation);
      if (location) {
        filters.push(location.label);
      }
    }

    if (selectedPropertyTypes.length > 0) {
      const typeNames = selectedPropertyTypes
        .map((typeId) => {
          const propertyType = propertyTypes.find((pt) => pt.id === typeId);
          return propertyType?.name ?? typeId;
        })
        .filter(Boolean);

      if (typeNames.length > 0) {
        filters.push(typeNames.join(", "));
      }
    }

    if (minPrice && maxPrice) {
      filters.push(
        `${numberToString(parseInt(minPrice))} - ${numberToString(parseInt(maxPrice))}`,
      );
    }

    if (minArea || maxArea) {
      if (minArea && maxArea) {
        filters.push(`${minArea}m² - ${maxArea}m²`);
      } else if (minArea) {
        filters.push(`Từ ${minArea}m²`);
      } else if (maxArea) {
        filters.push(`Đến ${maxArea}m²`);
      }
    }

    if (keyword) {
      filters.push(`"${keyword}"`);
    }

    return filters.length > 0 ? filters.join(" • ") : "";
  };

  return (
    <div className="relative h-fit">
      <div className="sticky top-[80px] right-0 left-0 z-50 container mx-auto bg-white px-4 py-4 lg:max-w-[90%]">
        <div className="relative rounded-2xl bg-white shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm">
          {/* Search Toggle Button - Only show when collapsed */}
          {!isSearchExpanded && (
            <div className="border-b border-gray-100 p-2">
              <Button
                size="large"
                onClick={() => {
                  setIsUserInteracting(true);
                  setIsSearchExpanded(true);
                  // Reset user interaction flag after a delay
                  setTimeout(() => setIsUserInteracting(false), 1000);
                }}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Filter className="h-3 w-3 text-red-500" />
                  <div className="text-left ">

                    {getFilterDisplayText() ? (
                      <div className="max-w-[200px] truncate text-xs text-gray-600">
                        {getFilterDisplayText()}
                      </div>
                    ) : <div className="font-semibold text-sm text-gray-900 ">
                      {t("search.searchFilters")}
                    </div>}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 rotate-90 text-gray-400 transition-transform duration-200" />
              </Button>
            </div>
          )}

          {/* Search Form */}
          <div
            className={`p-2 lg:p-6 ${isSearchExpanded ? "block" : "hidden"}`}
          >
            {/* Collapse Button */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 lg:h-3 lg:w-3 2xl:h-5 2xl:w-5 text-red-500" />
                <span className="font-semibold text-gray-900 lg:text-xs 2xl:text-sm">
                  {t("search.searchFilters")}
                </span>
              </div>
              <Button
                type="text"
                size="small"
                onClick={() => {
                  setIsUserInteracting(true);
                  setIsSearchExpanded(false);
                  // Reset user interaction flag after a delay
                  setTimeout(() => setIsUserInteracting(false), 1000);
                }}
                className="flex items-center gap-1 text-gray-500 hover:text-red-500"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm lg:text-xs 2xl:text-sm">Collapse</span>
              </Button>
            </div>

            <div className="my-4 lg:my-2 2xl:my-4 hidden items-center text-sm lg:text-xs 2xl:text-sm lg:flex">
              <div className="flex items-center space-x-2">
                <span className="cursor-pointer text-gray-500 transition-colors hover:text-red-500 hover:underline">
                  {t("navigation.home")}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
                <span className="font-medium text-gray-900">
                  {transaction === "sale"
                    ? t("navigation.propertiesForSale")
                    : transaction === "rent"
                      ? t("navigation.propertiesForRent")
                      : t("navigation.projects")}
                </span>
                {getFilterDisplayText() && (
                  <>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                    <span
                      className="max-w-xs truncate text-gray-600"
                      title={getFilterDisplayText()}
                    >
                      {getFilterDisplayText()}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-2 lg:grid-cols-5 lg:gap-4">
              {/* Search Input */}
              <div ref={searchInputRef} className="search-input col-span-2 ">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-red-400 " />
                  </div>
                  <Input
                    size="middle"
                    prefix={<Search className="h-5 w-5 text-gray-400 " />}
                    placeholder={t("search.locationPlaceholder")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onClick={handleSearchInputClick}
                    onPressEnter={handleSearch}
                  />
                  {keyword && (
                    <button
                      onClick={() => setKeyword("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-4"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Location Selector */}
              <div className="lg:col-span-2">
                <Button
                  size="middle"
                  ref={locationButtonRef}
                  onClick={handleLocationClick}
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"

                >
                  <div className="flex items-center gap-3 lg:gap-1 2xl:gap-3">
                    <MapPin className="h-4 w-4 lg:h-3 lg:w-3 2xl:h-4 2xl:w-4 text-gray-500" />
                    <span className="text-sm lg:text-xs 2xl:text-sm font-medium text-gray-700 capitalize">
                      {selectedLocation !== "all"
                        ? (locations.find((loc) => loc.id === selectedLocation)
                          ?.label ?? selectedLocation)
                        : t("search.allAreas")}
                    </span>
                  </div>
                  <ChevronRight size={16} className="rotate-90 text-gray-400" />
                </Button>
              </div>

              {/* Search Button */}
              <Button
                type="primary"
                size="middle"
                onClick={handleSearch}
                className="h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 font-semibold shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
              >
                <Search className="hidden h-4 w-4 lg:h-3 lg:w-3 2xl:h-5 2xl:w-5 lg:block" />
                <span className="lg:text-xs 2xl:text-sm">{t("common.search")}</span>
              </Button>
            </div>

            {/* Filter Row */}
            <div className="mt-2 grid grid-cols-1 items-center gap-1 md:grid-cols-3  lg:gap-3">
              {/* Property Type Filter */}
              <div className="md:relative">
                <Button
                  onClick={togglePropertyTypeModal}
                  className="filter-dropdown-button flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 lg:h-3 lg:w-3 2xl:h-5 2xl:w-5 items-center justify-center rounded-full bg-blue-100">
                      <span className="lg:text-xs">🏠</span>
                    </div>
                    <span className="text-sm lg:text-xs 2xl:text-sm font-medium text-gray-700">
                      {t("search.propertyType")}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${propertyTypeOpen ? "rotate-90" : ""
                      }`}
                  />
                </Button>

                {/* Property Type Dropdown - Desktop */}
                {!isMobile && propertyTypeOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 lg:pb-0 2xl:pb-3">
                      <div className="flex items-center justify-between">
                        <Typography.Title level={5} className="mb-0 text-sm">
                          {t("search.propertyType")}
                        </Typography.Title>
                        <Button
                          type="text"
                          icon={<X className="text-gray-600" size={14} />}
                          onClick={() => setPropertyTypeOpen(false)}
                          className="flex h-5 w-5 items-center justify-center"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 lg:max-h-48 2xl:max-h-64 overflow-y-auto p-3 lg:py-0 2xl:py-3">
                      {propertyTypesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Spin size="small" />
                          <span className="ml-2 text-sm text-gray-500">
                            {t("search.loadingPropertyTypes")}
                          </span>
                        </div>
                      ) : (
                        propertyTypeOptions.map((type) => (
                          <div
                            key={type.id}
                            className="flex cursor-pointer items-center gap-3 lg:gap-2 2xl:gap-3 rounded px-2 py-2 hover:bg-gray-50"
                            onClick={() => handleSelectedPropertyType(type.id)}
                          >
                            <Checkbox
                              checked={
                                type.id === "all"
                                  ? propertyTypes
                                    .map((pt) => pt.id)
                                    .every((id) =>
                                      selectedPropertyTypes.includes(id),
                                    )
                                  : selectedPropertyTypes.includes(type.id)
                              }
                              className="text-red-500"
                            />
                            <span className="text-gray-600 lg:text-xs 2xl:text-sm">{type.icon}</span>
                            <span className="text-sm lg:text-xs 2xl:text-sm text-gray-700">
                              {type.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-between border-t border-gray-100 p-3">
                      <Button
                        type="text"
                        onClick={() => {
                          setSelectedPropertyTypes([]);
                          updateSearchParams({
                            type: [],
                          });
                        }}
                        className="text-sm text-gray-500 hover:text-red-500"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPropertyTypeOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Property Type Modal - Mobile */}
                <Modal
                  title={
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-base">🏠</span>
                      </div>
                      <span className="text-lg font-semibold">
                        {t("search.propertyType")}
                      </span>
                    </div>
                  }
                  open={isMobile && propertyTypeOpen}
                  onCancel={() => setPropertyTypeOpen(false)}
                  footer={
                    <div className="flex justify-between gap-3">
                      <Button
                        onClick={() => {
                          setSelectedPropertyTypes([]);
                          updateSearchParams({
                            type: [],
                          });
                        }}
                        className="flex-1 text-gray-500 hover:text-red-500"
                        size="large"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPropertyTypeOpen(false)}
                        className="flex-1 border-0 bg-red-500 hover:bg-red-600"
                        size="large"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  }
                  centered
                  width={400}
                >
                  <div className="max-h-[60vh] overflow-y-auto">
                    {propertyTypesLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Spin size="large" />
                        <span className="ml-3 text-gray-500">
                          {t("search.loadingPropertyTypes")}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {propertyTypeOptions.map((type) => (
                          <div
                            key={type.id}
                            className="flex cursor-pointer items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 hover:border-red-200 hover:bg-red-50"
                            onClick={() => handleSelectedPropertyType(type.id)}
                          >
                            <Checkbox
                              checked={
                                type.id === "all"
                                  ? propertyTypes
                                    .map((pt) => pt.id)
                                    .every((id) =>
                                      selectedPropertyTypes.includes(id),
                                    )
                                  : selectedPropertyTypes.includes(type.id)
                              }
                              className="text-red-500"
                            />
                            <span className="text-gray-600">{type.icon}</span>
                            <span className="font-medium text-gray-700">
                              {type.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Modal>
              </div>

              {/* Price Filter */}
              <div className="md:relative">
                <Button
                  onClick={togglePriceRangeModal}
                  className="filter-dropdown-button flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 lg:h-3 lg:w-3 2xl:h-5 2xl:w-5 items-center justify-center rounded-full bg-green-100">
                      <span className="text-xs">💰</span>
                    </div>
                    <span className="text-sm lg:text-xs 2xl:text-sm font-medium text-gray-700">
                      {t("search.priceRange")}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${priceRangeOpen ? "rotate-90" : ""
                      }`}
                  />
                </Button>

                {/* Price Range Dropdown - Desktop */}
                {!isMobile && priceRangeOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >


                    <div className="p-3">
                      {/* Custom Price Range */}
                      <div className="mb-6">
                        <div className="mb-4 flex gap-4">
                          <div className="flex-1">
                            <Typography.Text className="mb-1 block text-sm  text-gray-600">
                              {t("search.from")}:{" "}
                              {minPrice
                                ? numberToString(
                                  parseInt(minPrice),
                                  locale,
                                  currency,
                                )
                                : "0"}
                            </Typography.Text>
                            <Input
                              placeholder={t("search.from")}
                              className="rounded-lg"
                              value={minPrice}
                              onChange={(e) =>
                                handleMinPriceInputChange(
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </div>
                          <div className="flex items-end">
                            <ArrowRight className="mb-2 h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <Typography.Text className="mb-1 block text-sm  text-gray-600">
                              {t("search.to")}:{" "}
                              {maxPrice
                                ? numberToString(
                                  parseInt(maxPrice),
                                  locale,
                                  currency,
                                )
                                : "∞"}
                            </Typography.Text>
                            <Input
                              placeholder={t("search.to")}
                              className="rounded-lg"
                              value={maxPrice}
                              onChange={(e) =>
                                handleMaxPriceInputChange(
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        <Slider
                          range
                          value={priceRange}
                          onChange={(value) =>
                            handlePriceRangeChange(value as [number, number])
                          }
                          min={0}
                          step={priceStep}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value, locale, currency)}`;
                            },
                          }}
                          max={maxPriceValue}
                          className="mb-4"
                        />
                      </div>

                      {/* Predefined Price Ranges */}
                      <div className="max-h-48 lg:max-h-28 2xl:max-h-48 overflow-y-auto">
                        <Radio.Group
                          value={selectedPriceRange}
                          onChange={(e) =>
                            handlePriceRangeSelection(e.target.value as string)
                          }
                          className="w-full"
                        >
                          {priceRanges.map((range) => (
                            <div key={range.value} className="mb-2">
                              <Radio value={range.value} className="text-sm">
                                {range.label}
                              </Radio>
                            </div>
                          ))}
                        </Radio.Group>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-gray-100 p-3">
                      <Button
                        type="text"
                        onClick={() => {
                          handlePriceRangeSelection("all");
                        }}
                        className="text-sm text-gray-500 hover:text-red-500"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPriceRangeOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Price Range Modal - Mobile */}
                <Modal
                  title={
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <span className="text-base">💰</span>
                      </div>
                      <span className="text-lg font-semibold">
                        {t("search.priceRange")}
                      </span>
                    </div>
                  }
                  open={isMobile && priceRangeOpen}
                  onCancel={() => setPriceRangeOpen(false)}
                  footer={
                    <div className="flex justify-between gap-3">
                      <Button
                        onClick={() => {
                          handlePriceRangeSelection("all");
                        }}
                        className="flex-1 text-gray-500 hover:text-red-500"
                        size="large"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPriceRangeOpen(false)}
                        className="flex-1 border-0 bg-red-500 hover:bg-red-600"
                        size="large"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  }
                  centered
                  width={420}
                >
                  <div className="max-h-[70vh] overflow-y-auto">
                    {/* Custom Price Range */}
                    <div className="mb-6">
                      <div className="mb-6 flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Typography.Text className="mb-2 block text-sm  font-medium text-gray-700">
                              {t("search.from")}
                            </Typography.Text>
                            <Typography.Text className="mb-2 block text-lg font-bold text-red-600">
                              {minPrice
                                ? numberToString(
                                  parseInt(minPrice),
                                  locale,
                                  currency,
                                )
                                : "0"}
                            </Typography.Text>
                          </div>
                          <Input
                            placeholder={t("search.from")}
                            className="rounded-lg"
                            size="large"
                            value={minPrice}
                            onChange={(e) =>
                              handleMinPriceInputChange(
                                parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center pt-8">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Typography.Text className="mb-2 block text-sm font-medium text-gray-700">
                              {t("search.to")}
                            </Typography.Text>
                            <Typography.Text className="mb-2 block text-lg font-bold text-red-600">
                              {maxPrice
                                ? numberToString(
                                  parseInt(maxPrice),
                                  locale,
                                  currency,
                                )
                                : "∞"}
                            </Typography.Text>
                          </div>
                          <Input
                            placeholder={t("search.to")}
                            className="rounded-lg"
                            size="large"
                            value={maxPrice}
                            onChange={(e) =>
                              handleMaxPriceInputChange(
                                parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <Slider
                          range
                          value={priceRange}
                          onChange={(value) =>
                            handlePriceRangeChange(value as [number, number])
                          }
                          min={0}
                          step={priceStep}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value, locale, currency)}`;
                            },
                          }}
                          max={maxPriceValue}
                          className="mb-6"
                        />
                      </div>
                    </div>

                    {/* Predefined Price Ranges */}
                    <div>
                      <Typography.Text className="mb-3 block text-sm font-medium text-gray-700">
                        {t("search.quickSelect")}
                      </Typography.Text>
                      <Radio.Group
                        value={selectedPriceRange}
                        onChange={(e) =>
                          handlePriceRangeSelection(e.target.value as string)
                        }
                        className="w-full"
                      >
                        <div className="space-y-2">
                          {priceRanges.map((range) => (
                            <div
                              key={range.value}
                              className="rounded-lg border border-gray-100 p-3 hover:border-red-200 hover:bg-red-50"
                            >
                              <Radio value={range.value} className="text-base">
                                {range.label}
                              </Radio>
                            </div>
                          ))}
                        </div>
                      </Radio.Group>
                    </div>
                  </div>
                </Modal>
              </div>

              {/* Area Filter */}
              <div className="md:relative">
                <Button
                  onClick={toggleAreaModal}
                  className="filter-dropdown-button flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-100">
                      <span className="text-xs">📐</span>
                    </div>
                    <span className="text-sm lg:text-xs 2xl:text-sm font-medium text-gray-700">
                      {t("search.area")}
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${areaOpen ? "rotate-90" : ""
                      }`}
                  />
                </Button>

                {/* Area Filter Dropdown - Desktop */}
                {!isMobile && areaOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <div className="p-3">
                      {/* Custom Area Range */}
                      <div className="mb-6">
                        <div className="mb-4 flex gap-4">
                          <div className="flex-1">
                            <Typography.Text className="mb-1 block text-sm text-gray-600">
                              {t("search.from")}: {minArea || "0"}m²
                            </Typography.Text>
                            <Input
                              placeholder={t("search.from")}
                              className="rounded-lg"
                              value={minArea}
                              onChange={(e) => {
                                const value = e.target.value;
                                setMinArea(value);
                                if (value) {
                                  updateSearchParams({ minArea: value });
                                } else {
                                  updateSearchParams({ minArea: "" });
                                }
                              }}
                              suffix="m²"
                            />
                          </div>
                          <div className="flex items-end">
                            <ArrowRight className="mb-2 h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <Typography.Text className="mb-1 block text-sm text-gray-600">
                              {t("search.to")}: {maxArea || "∞"}m²
                            </Typography.Text>
                            <Input
                              placeholder={t("search.to")}
                              className="rounded-lg"
                              value={maxArea}
                              onChange={(e) => {
                                const value = e.target.value;
                                setMaxArea(value);
                                if (value) {
                                  updateSearchParams({ maxArea: value });
                                } else {
                                  updateSearchParams({ maxArea: "" });
                                }
                              }}
                              suffix="m²"
                            />
                          </div>
                        </div>
                        <Slider
                          range
                          value={areaRange}
                          onChange={(value) =>
                            handleAreaRangeChange(value as [number, number])
                          }
                          min={0}
                          step={50}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${value}m²`;
                            },
                          }}
                          max={50000}
                          className="mb-4"
                        />
                      </div>

                      {/* Predefined Area Ranges */}
                      <div className="max-h-48 lg:max-h-28 2xl:max-h-48 overflow-y-auto">
                        <Radio.Group
                          value={selectedAreaRange}
                          onChange={(e) =>
                            handleAreaRangeSelection(e.target.value as string)
                          }
                          className="w-full"
                        >
                          {[
                            {
                              value: "all",
                              label: t("search.areaRanges.all"),
                            },
                            {
                              value: "under-30",
                              label: "< 30 m²",
                            },
                            {
                              value: "30-50",
                              label: "30 - 50 m²",
                            },
                            {
                              value: "50-80",
                              label: "50 - 80 m²",
                            },
                            {
                              value: "80-100",
                              label: "80 - 100 m²",
                            },
                            {
                              value: "100-150",
                              label: "100 - 150 m²",
                            },
                            {
                              value: "150-200",
                              label: "150 - 200 m²",
                            },
                            {
                              value: "200-300",
                              label: "200 - 300 m²",
                            },
                            {
                              value: "300-500",
                              label: "300 - 500 m²",
                            },
                            {
                              value: "500-1000",
                              label: "500 - 1,000 m²",
                            },
                            {
                              value: "1000-2000",
                              label: "1,000 - 2,000 m²",
                            },
                            {
                              value: "2000-5000",
                              label: "2,000 - 5,000 m²",
                            },
                            {
                              value: "5000-10000",
                              label: "5,000 - 10,000 m²",
                            },
                            {
                              value: "10000-20000",
                              label: "10,000 - 20,000 m²",
                            },
                            {
                              value: "20000-50000",
                              label: "20,000 - 50,000 m²",
                            },
                            {
                              value: "over-50000",
                              label: "> 50,000 m²",
                            },
                          ].map((range) => (
                            <div key={range.value} className="mb-2">
                              <Radio value={range.value} className="text-sm">
                                {range.label}
                              </Radio>
                            </div>
                          ))}
                        </Radio.Group>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-gray-100 p-3">
                      <Button
                        type="text"
                        onClick={() => {
                          setMinArea("");
                          setMaxArea("");
                          updateSearchParams({
                            minArea: "",
                            maxArea: "",
                          });
                        }}
                        className="text-sm text-gray-500 hover:text-red-500"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setAreaOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Area Modal - Mobile */}
                <Modal
                  title={
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                        <span className="text-base">📐</span>
                      </div>
                      <span className="text-lg font-semibold">
                        {t("search.area")}
                      </span>
                    </div>
                  }
                  open={isMobile && areaOpen}
                  onCancel={() => setAreaOpen(false)}
                  footer={
                    <div className="flex justify-between gap-3">
                      <Button
                        onClick={() => {
                          setMinArea("");
                          setMaxArea("");
                          updateSearchParams({
                            minArea: "",
                            maxArea: "",
                          });
                        }}
                        className="flex-1 text-gray-500 hover:text-red-500"
                        size="large"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setAreaOpen(false)}
                        className="flex-1 border-0 bg-red-500 hover:bg-red-600"
                        size="large"
                      >
                        {t("common.apply")}
                      </Button>
                    </div>
                  }
                  centered
                  width={420}
                >
                  <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
                    {/* Custom Area Range */}
                    <div className="mb-6">
                      <div className="mb-6 flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Typography.Text className="mb-2 block text-sm font-medium text-gray-700">
                              {t("search.from")}
                            </Typography.Text>
                            <Typography.Text className="mb-2 block text-lg font-bold text-red-600">
                              {minArea || "0"}m²
                            </Typography.Text>
                          </div>
                          <Input
                            placeholder={t("search.from")}
                            className="rounded-lg"
                            size="large"
                            value={minArea}
                            onChange={(e) => {
                              const value = e.target.value;
                              setMinArea(value);
                              if (value) {
                                updateSearchParams({ minArea: value });
                              } else {
                                updateSearchParams({ minArea: "" });
                              }
                            }}
                            suffix="m²"
                          />
                        </div>
                        <div className="flex items-center pt-8">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Typography.Text className="mb-2 block text-sm font-medium text-gray-700">
                              {t("search.to")}
                            </Typography.Text>
                            <Typography.Text className="mb-2 block text-lg font-bold text-red-600">
                              {maxArea || "∞"}m²
                            </Typography.Text>
                          </div>
                          <Input
                            placeholder={t("search.to")}
                            className="rounded-lg"
                            size="large"
                            value={maxArea}
                            onChange={(e) => {
                              const value = e.target.value;
                              setMaxArea(value);
                              if (value) {
                                updateSearchParams({ maxArea: value });
                              } else {
                                updateSearchParams({ maxArea: "" });
                              }
                            }}
                            suffix="m²"
                          />
                        </div>
                      </div>
                      <div className="px-2">
                        <Slider
                          range
                          value={areaRange}
                          onChange={(value) =>
                            handleAreaRangeChange(value as [number, number])
                          }
                          min={0}
                          step={50}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${value}m²`;
                            },
                          }}
                          max={50000}
                          className="mb-6"
                        />
                      </div>
                    </div>

                    {/* Predefined Area Ranges */}
                    <div>
                      <Typography.Text className="mb-3 block text-sm font-medium text-gray-700">
                        {t("search.quickSelect")}
                      </Typography.Text>
                      <Radio.Group
                        value={selectedAreaRange}
                        onChange={(e) =>
                          handleAreaRangeSelection(e.target.value as string)
                        }
                        className="w-full"
                      >
                        <div className="space-y-2">
                          {[
                            {
                              value: "all",
                              label: t("search.areaRanges.all"),
                            },
                            {
                              value: "under-30",
                              label: "< 30 m²",
                            },
                            {
                              value: "30-50",
                              label: "30 - 50 m²",
                            },
                            {
                              value: "50-80",
                              label: "50 - 80 m²",
                            },
                            {
                              value: "80-100",
                              label: "80 - 100 m²",
                            },
                            {
                              value: "100-150",
                              label: "100 - 150 m²",
                            },
                            {
                              value: "150-200",
                              label: "150 - 200 m²",
                            },
                            {
                              value: "200-300",
                              label: "200 - 300 m²",
                            },
                            {
                              value: "300-500",
                              label: "300 - 500 m²",
                            },
                            {
                              value: "500-1000",
                              label: "500 - 1,000 m²",
                            },
                            {
                              value: "1000-2000",
                              label: "1,000 - 2,000 m²",
                            },
                            {
                              value: "2000-5000",
                              label: "2,000 - 5,000 m²",
                            },
                            {
                              value: "5000-10000",
                              label: "5,000 - 10,000 m²",
                            },
                            {
                              value: "10000-20000",
                              label: "10,000 - 20,000 m²",
                            },
                            {
                              value: "20000-50000",
                              label: "20,000 - 50,000 m²",
                            },
                            {
                              value: "over-50000",
                              label: "> 50,000 m²",
                            },
                          ].map((range) => (
                            <div
                              key={range.value}
                              className="rounded-lg border border-gray-100 p-3 hover:border-red-200 hover:bg-red-50"
                            >
                              <Radio value={range.value} className="text-base">
                                {range.label}
                              </Radio>
                            </div>
                          ))}
                        </div>
                      </Radio.Group>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
          {searchModalOpen && (
            <div
              ref={searchModalRef}
              className="search-popup absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:mt-4 max-h-[60vh] lg:max-h-80 2xl:max-h-[60vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("search.smartSearch")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("search.explorePopularAreas")}
                    </p>
                  </div>
                  <Button
                    type="text"
                    icon={<X className="h-5 w-5" />}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Search Trends Panel */}
                    <div className="space-y-6">
                      {/* Trending Locations */}
                      <div>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                            <span className="text-sm">🔥</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {t("search.trending")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("search.trendingDescription")}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {trendingLocationsLoading
                            ? Array.from({ length: 5 }).map((_, index) => (
                              <div
                                key={index}
                                className="h-16 animate-pulse rounded-xl bg-gray-200"
                              />
                            ))
                            : trendingLocations
                              .slice(0, 5)
                              .map((location, index) => (
                                <div
                                  key={location.id}
                                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                                  onClick={() =>
                                    handleProvinceSelect(location.id)
                                  }
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white ${index === 0
                                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                        : index === 1
                                          ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                          : index === 2
                                            ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                            : "bg-gradient-to-r from-blue-400 to-blue-500"
                                        }`}
                                    >
                                      <span className="text-sm">
                                        #{index + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900">
                                        {location.name}
                                      </span>
                                      <div className="mt-1 flex items-center gap-1">
                                        <span className="text-xs text-gray-500">
                                          {location.viewCount
                                            ? `${location.viewCount.toLocaleString()} ${t("search.views")}`
                                            : t("search.trending")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
                                </div>
                              ))}
                        </div>
                      </div>

                      {/* Popular Search Terms */}
                      <div>
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500">
                            <Search className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {t("search.hotKeywords")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("search.popularSearchTerms")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            t("search.propertyTypes.streetHouse"),
                            t("search.propertyTypes.apartment"),
                            t("search.propertyTypes.land"),
                          ].map((keyword) => (
                            <button
                              key={keyword}
                              className="group rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setKeyword(keyword)}
                            >
                              #{keyword}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Dropdown - Desktop */}
          {!isMobile && locationModalOpen && (
            <div
              ref={locationModalRef}
              className="location-popup absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl lg:mt-4 "
            >
              {/* Modal Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center justify-between lg:hidden 2xl:flex">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t("search.selectLocation")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("search.selectLocationDescription")}
                    </p>
                  </div>
                  <Button
                    type="text"
                    icon={<X className="h-5 w-5" />}
                    onClick={() => setLocationModalOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
                  />
                </div>
              </div>

              <div className="max-h-[60vh] lg:max-h-64 2xl:max-h-[60vh] overflow-y-auto">
                <div className="p-6">
                  {/* Popular Cities */}
                  <div className="mb-8 lg:mb-2 2xl:mb-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                        <span className="text-sm">🔥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {t("search.topLocations")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("search.topLocationsDescription")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                      {locationInfosLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-16 animate-pulse rounded-xl bg-gray-200"
                          />
                        ))
                        : popularCities.map((city) => (
                          <div
                            key={city.id}
                            className={`group relative h-32 overflow-hidden rounded-xl border-3 border-solid transition-all duration-200 hover:scale-105 hover:shadow-lg ${selectedLocation === city.id
                              ? "border-red-400 hover:border-red-400"
                              : "border-white hover:border-red-300"
                              }`}
                            onClick={() => handleProvinceSelect(city.id)}
                          >
                            <Image
                              src={
                                city.imageURL ??
                                "/images/landingpage/cities/default.jpg"
                              }
                              alt={city.name}
                              fill
                              className="object-cover"
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80"></div>
                            <div className="absolute right-3 bottom-3 left-3">
                              <span
                                className={`text-sm font-semibold drop-shadow-lg ${selectedLocation === city.id
                                  ? "rounded-full bg-white px-2 py-1 text-red-600"
                                  : "text-white"
                                  }`}
                              >
                                {city.name}
                              </span>
                            </div>
                            {selectedLocation === city.id && (
                              <div className="absolute top-2 right-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                                  <CheckCircle className="h-4 w-4" />
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* All Locations */}
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 lg:hidden 2xl:block items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                        <span className="text-sm">🌍</span>
                      </div>
                      <div className="lg:hidden 2xl:block">
                        <h4 className="font-semibold text-gray-900">
                          {t("search.allLocations")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("search.allLocationsDescription")}
                        </p>
                      </div>
                    </div>
                    <div className="max-h-80  overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {locationInfosLoading
                          ? Array.from({ length: 10 }).map((_, index) => (
                            <div
                              key={index}
                              className="h-16 animate-pulse rounded-xl bg-gray-200"
                            />
                          ))
                          : allProvinces.map((province) => (
                            <button
                              key={province}
                              onClick={() => handleProvinceSelect(province)}
                              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${selectedLocation === province
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                                }`}
                            >
                              <span className="capitalize">
                                {province === "all"
                                  ? t("search.allAreas")
                                  : (locationInfos.find(
                                    (loc) => loc.id === province,
                                  )?.name ?? province)}
                              </span>
                              {selectedLocation === province && (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Modal - Mobile */}
          <Modal
            title={
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-lg font-semibold">
                  {t("search.selectLocation")}
                </span>
              </div>
            }
            open={isMobile && locationModalOpen}
            onCancel={() => setLocationModalOpen(false)}
            footer={null}
            centered
            width="90%"
            style={{ maxWidth: 480 }}
          >
            <div className="max-h-[70vh] overflow-y-auto">
              {/* Popular Cities */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                    <span className="text-sm">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t("search.topLocations")}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t("search.topLocationsDescription")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {locationInfosLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-24 animate-pulse rounded-xl bg-gray-200"
                      />
                    ))
                    : popularCities.map((city) => (
                      <div
                        key={city.id}
                        className={`group relative h-24 overflow-hidden rounded-xl border-3 border-solid transition-all duration-200 hover:scale-105 hover:shadow-lg ${selectedLocation === city.id
                          ? "border-red-400 hover:border-red-400"
                          : "border-white hover:border-red-300"
                          }`}
                        onClick={() => {
                          handleProvinceSelect(city.id);
                          setLocationModalOpen(false);
                        }}
                      >
                        <Image
                          src={
                            city.imageURL ??
                            "/images/landingpage/cities/default.jpg"
                          }
                          alt={city.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/80"></div>
                        <div className="absolute right-2 bottom-2 left-2">
                          <span
                            className={`text-xs font-semibold drop-shadow-lg ${selectedLocation === city.id
                              ? "rounded-full bg-white px-2 py-1 text-red-600"
                              : "text-white"
                              }`}
                          >
                            {city.name}
                          </span>
                        </div>
                        {selectedLocation === city.id && (
                          <div className="absolute top-2 right-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* All Locations */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    <span className="text-sm">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t("search.allLocations")}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t("search.allLocationsDescription")}
                    </p>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
                  <div className="grid grid-cols-2 gap-2">
                    {locationInfosLoading
                      ? Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-12 animate-pulse rounded-lg bg-gray-200"
                        />
                      ))
                      : allProvinces.map((province) => (
                        <button
                          key={province}
                          onClick={() => {
                            handleProvinceSelect(province);
                            setLocationModalOpen(false);
                          }}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${selectedLocation === province
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                            }`}
                        >
                          <span className="truncate capitalize">
                            {province === "all"
                              ? t("search.allAreas")
                              : (locationInfos.find(
                                (loc) => loc.id === province,
                              )?.name ?? province)}
                          </span>
                          {selectedLocation === province && (
                            <CheckCircle className="ml-1 h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          {/* Enhanced Breadcrumb */}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-4 lg:max-w-[70%] xl:max-w-[65%] 2xl:max-w-[70%] ">
        {/* Layout Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden text-sm lg:text-xs 2xl:text-sm font-medium text-gray-700 lg:block">
              {t("search.display")}
            </span>
            <div className="flex rounded-lg border border-gray-200 bg-white p-1">
              <Button
                type={layout === "list" ? "primary" : "text"}
                size="small"
                icon={<List size={16} />}
                onClick={() => setLayout("list")}
                className="flex items-center gap-1 "
              >
                <span className="lg:text-xs 2xl:text-sm">{t("search.list")}</span>
              </Button>
              <div className="hidden lg:block">
                <Button
                  type={layout === "grid" ? "primary" : "text"}
                  size="small"
                  icon={<Grid3X3 size={16} />}
                  onClick={() => setLayout("grid")}
                  className="flex items-center gap-1"
                >
                  <span className="lg:text-xs 2xl:text-sm">{t("search.grid")}</span>
                </Button>
              </div>
              <Button
                type={layout === "map" ? "primary" : "text"}
                size="small"
                icon={<Map size={16} />}
                onClick={() => setLayout("map")}
                className="flex items-center gap-1"
              >
                <span className="lg:text-xs 2xl:text-sm">{t("search.map")}</span>
              </Button>
            </div>
          </div>

          <div className="text-sm lg:text-xs 2xl:text-sm text-gray-500">
            {layout === "map" ? (allMapProperties?.length ?? 0) : (properties?.data?.length ?? 0)} {t("search.properties")}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 lg:flex-row ">
          {/* Left Content - Property Listing */}
          <div className="w-full">
            {layout === "map" ? (
              <PropertiesMap
                properties={allMapProperties ?? properties?.data ?? []}
                loading={isLoadingMapData}
                height="70vh"
              />
            ) : propertiesLoading ? (
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {/* Property List */}
                {properties?.data.length === 0 ? (
                  <div className="flex h-[500px] items-center justify-center">
                    <Empty description={t("property.noSuitableProperties")} />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-6 xl:grid-cols-6">
                    <div
                      className={`col-span-3 xl:col-span-4 grid h-fit grid-cols-1 gap-6 ${layout === "grid" ? "grid-cols-2" : ""
                        }`}
                    >
                      {properties?.data.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                      {layout === "list" || layout === "grid" ? (
                        <div className="col-span-full">
                          <Pagination
                            align="center"
                            total={total}
                            pageSize={pageSize}
                            current={currentPage}
                            onChange={(page, pageSize) => {
                              setCurrentPage(page);
                              setPageSize(pageSize);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="col-span-3 xl:col-span-2 ">
                      <div className="flex flex-col">
                        <ApprovedBankRequests />
                        <BrokerUsers />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Properties;
