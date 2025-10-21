"use client";

import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useCurrencyStore } from "@/share/store/currency.store";
import { useClickAway, useEventListener } from "ahooks";
import { useRequest } from "ahooks";
import {
  Carousel,
  Tabs,
  Button,
  Space,
  Typography,
  App,
  Input,
  Radio,
  Slider,
  Checkbox,
  Modal,
} from "antd";
import {
  Home,
  Building2,
  Construction,
  MapPin,
  CheckCircle,
  X,
  ChevronDown,
  Search,
  Filter,
  DollarSign,
  Square,
  ArrowRight,
} from "lucide-react";

import Image from "next/image";
import { numberToString } from "@/share/helper/number-to-string";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import locationInfoService from "@/share/service/location-info.service";
import propertyTypeService from "@/share/service/property-type.service";
import { settingService } from "@/share/service/setting.service";
import type { LocationInfo, PropertyType } from "@/@types/types";
import { useTranslations } from "next-intl";
const { Title, Text } = Typography;

const SearchBox = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const locale = useUrlLocale();
  const [searchType, setSearchType] = useState("sale");
  const t = useTranslations();
  const { currency } = useCurrencyStore();

  // Fetch all locations
  const { data: allLocationsData, loading: allLocationsLoading } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo({
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data ?? [];
    },
  );

  // Fetch settings for carousel images
  const { data: settingsData } = useRequest(
    async () => {
      try {
        const response = await settingService.getSetting();
        return response;
      } catch (error) {
        console.error("Error fetching settings:", error);
        return null;
      }
    },
    {
      onError: () => {
        // Silently fail, use default images
      },
    },
  );

  // Fetch property types based on current search type
  const { loading: propertyTypesLoading } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: searchType as "rent" | "sale" | "project",
        page: 1,
        perPage: 100,
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data;
    },
    {
      refreshDeps: [searchType], // Refresh when search type changes
      onSuccess: (data) => {
        setPropertyTypes(data || []);
        // Reset selected property types when search type changes
        setSelectedPropertyTypes([]);
      },
      onError: (error) => {
        console.error("Error loading property types:", error);
        message.error(t("errors.cannotLoadPropertyTypes"));
      },
    },
  );

  // Property search states
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // State for filter dropdowns
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  // Refs for modals
  const locationPopupRef = useRef<HTMLDivElement>(null);
  const locationSelectorRef = useRef<HTMLButtonElement>(null);
  const propertyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const propertyTypeButtonRef = useRef<HTMLButtonElement>(null);
  const priceRangeDropdownRef = useRef<HTMLDivElement>(null);
  const priceRangeButtonRef = useRef<HTMLButtonElement>(null);
  const areaDropdownRef = useRef<HTMLDivElement>(null);
  const areaButtonRef = useRef<HTMLButtonElement>(null);

  // State for filter values
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000000,
  ]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 50000]);
  const [selectedAreaRange, setSelectedAreaRange] = useState<string>("all");

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useClickAway(() => {
    setShowLocationPopup(false);
  }, [locationPopupRef, locationSelectorRef]);

  useClickAway(() => {
    if (!isMobile) {
      setPropertyTypeOpen(false);
    }
  }, [propertyTypeDropdownRef, propertyTypeButtonRef]);

  useClickAway(() => {
    if (!isMobile) {
      setPriceRangeOpen(false);
    }
  }, [priceRangeDropdownRef, priceRangeButtonRef]);

  useClickAway(() => {
    if (!isMobile) {
      setAreaOpen(false);
    }
  }, [areaDropdownRef, areaButtonRef]);

  useClickAway(() => {
    if (!isMobile) {
      setShowLocationPopup(false);
      setPropertyTypeOpen(false);
      setPriceRangeOpen(false);
      setAreaOpen(false);
    } else {
      setShowLocationPopup(false);
    }
  }, [
    locationPopupRef,
    locationSelectorRef,
    propertyTypeDropdownRef,
    propertyTypeButtonRef,
    priceRangeDropdownRef,
    priceRangeButtonRef,
    areaDropdownRef,
    areaButtonRef,
  ]);

  useEventListener(
    "scroll",
    () => {
      if (!isMobile) {
        setShowLocationPopup(false);
        setPropertyTypeOpen(false);
        setPriceRangeOpen(false);
        setAreaOpen(false);
      } else {
        setShowLocationPopup(false);
      }
    },
    { target: typeof window !== "undefined" ? document : undefined },
  );

  // Background images for carousel - use from settings or fallback to defaults
  const defaultImages = [
    "/images/landingpage/hero-slider/hero-banner-1.jpg",
    "/images/landingpage/hero-slider/hero-banner-2.jpg",
    "/images/landingpage/hero-slider/hero-banner-3.jpg",
    "/images/landingpage/hero-slider/hero-banner-4.jpg",
  ];

  const backgroundImages: string[] =
    settingsData?.images && settingsData.images.length > 0
      ? settingsData.images.filter(
          (img: unknown): img is string =>
            typeof img === "string" && img.length > 0,
        )
      : defaultImages;

  // Create popular cities from trending locations API data
  const popularCities = allLocationsData?.slice(0, 6).map((locationInfo) => ({
    id: locationInfo.id,
    name: locationInfo.name,
    imageURL: locationInfo.imageURL ?? "/images/landingpage/cities/default.jpg",
  }));

  // Create all locations from trending locations API data
  const allLocations = [
    "all",
    ...(allLocationsData?.map((location: LocationInfo) => location.id) ?? []),
  ];

  const searchTabs = [
    {
      id: "sale",
      label: t("navigation.propertiesForSale"),
      icon: <Home size={16} />,
    },
    {
      id: "rent",
      label: t("navigation.propertiesForRent"),
      icon: <Building2 size={16} />,
    },
    {
      id: "project",
      label: t("navigation.projects"),
      icon: <Construction size={16} />,
    },
  ];

  // Helper function to get icon based on property type name (language-agnostic)
  const getPropertyTypeIcon = (typeName: string) => {
    const lowerName = typeName.toLowerCase();

    // Apartment/Building keywords (multi-language)
    const apartmentKeywords = [
      "apartment",
      "căn hộ",
      "ອະພາດເມັນ",
      "building",
      "condo",
    ];
    if (apartmentKeywords.some((keyword) => lowerName.includes(keyword))) {
      return <Building2 className="h-4 w-4" />;
    }

    // House/Villa keywords (multi-language)
    const houseKeywords = [
      "house",
      "nhà",
      "ເຮືອນ",
      "villa",
      "home",
      "biệt thự",
    ];
    if (houseKeywords.some((keyword) => lowerName.includes(keyword))) {
      return <Home className="h-4 w-4" />;
    }

    // Land/Plot keywords (multi-language)
    const landKeywords = ["land", "đất", "ທີ່ດິນ", "plot", "lot"];
    if (landKeywords.some((keyword) => lowerName.includes(keyword))) {
      return <Square className="h-4 w-4" />;
    }

    return <Building2 className="h-4 w-4" />; // Default icon
  };

  // Transform API property types to match the expected format
  const propertyTypeOptions = [
    ...propertyTypes.map((type) => ({
      id: type.id,
      name: type.name,
      icon: getPropertyTypeIcon(type.name),
    })),
  ];

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

  // Create translated price ranges based on current currency and search type
  const priceRanges = useMemo(
    () => getPriceRanges(currency ?? "LAK", searchType),
    [getPriceRanges, currency, searchType],
  );

  // Create translated area ranges
  const areaRanges = [
    { value: "all", label: t("search.areaRanges.all") },
    { value: "under-30", label: "< 30 m²" },
    { value: "30-50", label: "30 - 50 m²" },
    { value: "50-80", label: "50 - 80 m²" },
    { value: "80-100", label: "80 - 100 m²" },
    { value: "100-150", label: "100 - 150 m²" },
    { value: "150-200", label: "150 - 200 m²" },
    { value: "200-300", label: "200 - 300 m²" },
    { value: "300-500", label: "300 - 500 m²" },
    { value: "500-1000", label: "500 - 1,000 m²" },
    { value: "1000-2000", label: "1,000 - 2,000 m²" },
    { value: "2000-5000", label: "2,000 - 5,000 m²" },
    { value: "5000-10000", label: "5,000 - 10,000 m²" },
    { value: "10000-20000", label: "10,000 - 20,000 m²" },
    { value: "20000-50000", label: "20,000 - 50,000 m²" },
    { value: "over-50000", label: "> 50,000 m²" },
  ];

  const handleSearch = async () => {
    const searchParams = new URLSearchParams();
    if (priceRange[0] === 0 && priceRange[1] === 100000000000) {
      searchParams.delete("minPrice");
      searchParams.delete("maxPrice");
    } else {
      searchParams.set("minPrice", priceRange[0].toString());
      searchParams.set("maxPrice", priceRange[1].toString());
    }
    if (areaRange[0] === 0 && areaRange[1] === 50000) {
      searchParams.delete("minArea");
      searchParams.delete("maxArea");
    } else {
      searchParams.set("minArea", areaRange[0].toString());
      searchParams.set("maxArea", areaRange[1].toString());
    }
    if (selectedPropertyTypes.length > 0) {
      searchParams.set("type", selectedPropertyTypes.join(","));
    }
    if (selectedLocation) {
      searchParams.set("locationId", selectedLocation);
    } else {
      searchParams.delete("locationId");
    }
    if (keyword) {
      searchParams.set("keyword", keyword);
    } else {
      searchParams.delete("keyword");
    }
    if (searchType === "sale") {
      router.push(`/${locale}/properties-for-sale?${searchParams.toString()}`);
    } else if (searchType === "rent") {
      router.push(`/${locale}/properties-for-rent?${searchParams.toString()}`);
    } else if (searchType === "project") {
      router.push(
        `/${locale}/properties-for-project?${searchParams.toString()}`,
      );
    }
    message.success(t("search.searching"));
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPopup(false);
  };

  const handleToggleFilterModal = (type: string, event?: React.MouseEvent) => {
    event?.stopPropagation();

    if (type === "propertyType") {
      setPropertyTypeOpen((prev) => !prev);
      setPriceRangeOpen(false);
      setAreaOpen(false);
      setShowLocationPopup(false);
    } else if (type === "priceRange") {
      setPriceRangeOpen((prev) => !prev);
      setPropertyTypeOpen(false);
      setAreaOpen(false);
      setShowLocationPopup(false);
    } else if (type === "areaRange") {
      setAreaOpen((prev) => !prev);
      setPropertyTypeOpen(false);
      setPriceRangeOpen(false);
      setShowLocationPopup(false);
    }
  };

  const handleSelectedPropertyType = (type: string) => {
    if (type === "all") {
      const allTypeIds = propertyTypeOptions
        .filter((option) => option.id !== "all")
        .map((option) => option.id);
      const isAllSelected = allTypeIds.every((id) =>
        selectedPropertyTypes.includes(id),
      );

      if (isAllSelected) {
        setSelectedPropertyTypes([]);
      } else {
        setSelectedPropertyTypes(allTypeIds);
      }
    } else {
      setSelectedPropertyTypes((prev) =>
        prev.includes(type)
          ? prev.filter((id) => id !== type)
          : [...prev, type],
      );
    }
  };

  const handleMinPriceInputChange = (value: number) => {
    const numValue = value || 0;
    setPriceRange([numValue, priceRange[1]]);
    setSelectedPriceRange("");
  };

  const handleMaxPriceInputChange = (value: number) => {
    const numValue = value || 100000000000;
    setPriceRange([priceRange[0], numValue]);
    setSelectedPriceRange("");
  };

  const handleMinAreaInputChange = (value: number) => {
    const numValue = value || 0;
    setAreaRange([numValue, areaRange[1]]);
    setSelectedAreaRange("");
  };

  const handleMaxAreaInputChange = (value: number) => {
    const numValue = value || 50000;
    setAreaRange([areaRange[0], numValue]);
    setSelectedAreaRange("");
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setSelectedPriceRange("");
  };

  const handleAreaRangeChange = (value: [number, number]) => {
    setAreaRange(value);
    setSelectedAreaRange("");
  };

  const handlePriceRangeSelection = (rangeValue: string) => {
    setSelectedPriceRange(rangeValue);

    let minValue = 0;
    let maxValue = 100000000000;

    if (rangeValue === "all") {
      minValue = 0;
      maxValue = 100000000000;
    } else if (rangeValue.startsWith("over-")) {
      // Handle "over-X" format
      const minStr = rangeValue.replace("over-", "");
      const parsedMin = parseInt(minStr);
      if (!isNaN(parsedMin)) {
        minValue = parsedMin;
        maxValue = 100000000000;
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
  };

  const handleAreaRangeSelection = (rangeValue: string) => {
    setSelectedAreaRange(rangeValue);

    let minValue = 0;
    let maxValue = 50000;

    if (rangeValue === "all") {
      minValue = 0;
      maxValue = 50000;
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
  };

  return (
    <section className="relative h-[50vh] md:h-[40vh]">
      <div className="absolute inset-0 z-1">
        <Carousel
          autoplay
          dots={true}
          dotPosition="bottom"
          infinite={true}
          autoplaySpeed={5000}
          slidesToShow={1}
          slidesToScroll={1}
          effect="scrollx"
          className="h-full"
          accessibility={true}
          pauseOnHover={true}
        >
          {backgroundImages.map((image: string, index: number) => (
            <Image
              key={index}
              src={image}
              alt="background"
              className="h-[50vh] w-full object-cover md:h-[40vh]"
              width={1000}
              height={500}
              sizes="100vw"
              priority={index === 0}
            />
          ))}
        </Carousel>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-8 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          {/* Search Type Tabs */}
          <div className="w-full">
            <div className="w-full rounded-2xl rounded-b-none bg-white shadow-2xl">
              <Tabs
                activeKey={searchType}
                onChange={setSearchType}
                className="search-tabs"
                centered
                size="small"
                items={searchTabs.map((tab) => ({
                  key: tab.id,
                  label: (
                    <Space className="px-2 py-1 sm:px-4 sm:py-2">
                      <span
                        className={`text-sm sm:text-base ${searchType === tab.id ? "text-[#ef4444]" : "text-gray-500"}`}
                      >
                        {tab.icon}
                      </span>
                      <span
                        className={`text-sm sm:inline sm:text-base ${searchType === tab.id ? "font-medium text-[#ef4444]" : "text-gray-500"}`}
                      >
                        {tab.label}
                      </span>
                    </Space>
                  ),
                }))}
              />
            </div>
          </div>

          {/* Main Search Container */}
          <div className="shadow-3xl relative rounded-2xl rounded-t-none bg-white p-2 sm:rounded-3xl sm:rounded-t-none lg:p-4">
            <div className="relative mb-2 flex w-full flex-col items-stretch overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 hover:border-red-300 hover:shadow-lg sm:flex-row sm:items-center sm:rounded-2xl lg:hidden">
              <div className="flex items-center gap-2 p-2 sm:gap-3 sm:p-0">
                <div className="flex flex-1 items-center gap-2 border-b border-gray-200 p-3 pb-4">
                  <Search className="text-gray-600" size={16} />
                  <input
                    type="text"
                    placeholder={t("search.locationPlaceholder")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-xs font-medium text-gray-700 placeholder-gray-500 outline-none sm:text-sm"
                  />
                </div>
              </div>

              <div className="mr-4 hidden h-6 w-px bg-gray-300 sm:block"></div>

              <div className="grid grid-cols-2 items-center gap-2 p-2 sm:gap-3 sm:p-0">
                <Button
                  ref={locationSelectorRef}
                  type="text"
                  size="large"
                  className="w-full"
                  onClick={() => setShowLocationPopup(!showLocationPopup)}
                >
                  <MapPin className="text-gray-600" size={16} />
                  <span className="text-xs font-medium text-gray-700 capitalize sm:text-sm">
                    {selectedLocation
                      ? (allLocationsData?.find(
                          (loc: LocationInfo) => loc.id === selectedLocation,
                        )?.name ?? selectedLocation)
                      : t("search.nationwide")}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      showLocationPopup ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearch}
                  icon={<Search className="text-white" size={16} />}
                  className="rounded-none"
                >
                  <span className="hidden sm:inline">{t("common.search")}</span>
                  <span className="sm:hidden">{t("common.find")}</span>
                </Button>
              </div>
            </div>

            <div className="relative mb-2 hidden w-full flex-col items-stretch overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 hover:border-red-300 hover:shadow-lg sm:flex-row sm:items-center sm:rounded-2xl lg:flex">
              <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-0">
                <Button
                  ref={locationSelectorRef}
                  type="text"
                  size="large"
                  className="w-full"
                  onClick={() => setShowLocationPopup(!showLocationPopup)}
                >
                  <MapPin className="text-gray-600" size={16} />
                  <span className="text-xs font-medium text-gray-700 capitalize sm:text-sm">
                    {selectedLocation
                      ? (allLocationsData?.find(
                          (loc: LocationInfo) => loc.id === selectedLocation,
                        )?.name ?? selectedLocation)
                      : t("search.nationwide")}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      showLocationPopup ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              <div className="mr-4 hidden h-6 w-px bg-gray-300 sm:block"></div>

              <div className="flex flex-1 items-center gap-2 border-t border-gray-200 p-2 sm:border-none sm:p-0">
                <div className="flex flex-1 items-center gap-2 p-3 sm:gap-3 sm:p-0">
                  <Search className="text-gray-600" size={16} />
                  <input
                    type="text"
                    placeholder={t("search.locationPlaceholder")}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-xs font-medium text-gray-700 placeholder-gray-500 outline-none sm:text-sm"
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearch}
                  icon={<Search className="text-white" size={16} />}
                  className="rounded-none"
                >
                  <span className="hidden sm:inline">{t("common.search")}</span>
                  <span className="sm:hidden">{t("common.find")}</span>
                </Button>
              </div>
            </div>
            {!isMobile && showLocationPopup && (
              <div
                ref={locationPopupRef}
                className="location-popup absolute z-50 h-[60vh] w-[calc(100%-1rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl sm:h-[50vh] sm:w-[calc(100%-3rem)] sm:rounded-2xl"
              >
                <div className="p-2 lg:p-4">
                  <div className="mb-2 flex items-center justify-between sm:mb-4">
                    <div>
                      <Title level={4} className="mb-1 text-base sm:text-lg">
                        {t("search.selectLocation")}
                      </Title>
                      <Text type="secondary" className="text-xs sm:text-sm">
                        {t("search.selectLocationDescription")}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      icon={<X className="h-4 w-4 sm:h-5 sm:w-5" />}
                      onClick={() => setShowLocationPopup(false)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 sm:h-8 sm:w-8"
                    />
                  </div>

                  {/* Trending Locations */}
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                        <span className="text-sm">🔥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {t("search.explorePopularAreas")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("search.trendingDescription")}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 space-y-2 lg:grid-cols-6">
                      {allLocationsLoading
                        ? // Loading skeleton for trending locations
                          Array.from({ length: 6 }).map((_, index) => (
                            <div
                              key={index}
                              className="h-16 animate-pulse rounded-xl bg-gray-200"
                            />
                          ))
                        : popularCities?.map((city) => (
                            <div
                              key={city.id}
                              className={`group relative h-32 overflow-hidden rounded-xl border-3 border-solid transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                                selectedLocation === city.id
                                  ? "border-red-400 hover:border-red-400"
                                  : "border-white hover:border-red-300"
                              }`}
                              onClick={() => handleLocationSelect(city.id)}
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
                                  className={`text-sm font-semibold drop-shadow-lg ${
                                    selectedLocation === city.id
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                        <span className="text-sm">🌍</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {t("search.allLocations")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("search.allLocationsDescription")}
                        </p>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {allLocationsLoading
                          ? // Loading skeleton for all locations
                            Array.from({ length: 12 }).map((_, index) => (
                              <div
                                key={index}
                                className="h-12 animate-pulse rounded-lg bg-gray-200"
                              />
                            ))
                          : allLocations.map((location) => (
                              <button
                                key={location}
                                onClick={() => handleLocationSelect(location)}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
                                  selectedLocation === location
                                    ? "bg-red-500 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                                }`}
                              >
                                <span className="capitalize">
                                  {location === "all"
                                    ? t("search.allAreas")
                                    : (allLocationsData?.find(
                                        (loc: LocationInfo) =>
                                          loc.id === location,
                                      )?.name ?? location)}
                                </span>
                                {selectedLocation === location && (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </button>
                            ))}
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
              open={isMobile && showLocationPopup}
              onCancel={() => setShowLocationPopup(false)}
              footer={null}
              centered
              width={420}
            >
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Trending Locations */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                      <span className="text-sm">🔥</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {t("search.explorePopularAreas")}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {t("search.trendingDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {allLocationsLoading
                      ? Array.from({ length: 6 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-24 animate-pulse rounded-xl bg-gray-200"
                          />
                        ))
                      : popularCities?.slice(0, 6).map((city) => (
                          <div
                            key={city.id}
                            className={`group relative h-24 overflow-hidden rounded-xl border-2 border-solid transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                              selectedLocation === city.id
                                ? "border-red-400"
                                : "border-gray-200 hover:border-red-300"
                            }`}
                            onClick={() => handleLocationSelect(city.id)}
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
                                className={`text-sm font-semibold drop-shadow-lg ${
                                  selectedLocation === city.id
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
                      <p className="text-sm text-gray-500">
                        {t("search.allLocationsDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {allLocationsLoading
                      ? Array.from({ length: 8 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-gray-200"
                          />
                        ))
                      : allLocations.map((location) => (
                          <button
                            key={location}
                            onClick={() => handleLocationSelect(location)}
                            className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                              selectedLocation === location
                                ? "border-red-500 bg-red-500 text-white shadow-md"
                                : "border-gray-100 bg-gray-50 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            <span className="capitalize">
                              {location === "all"
                                ? t("search.allAreas")
                                : (allLocationsData?.find(
                                    (loc: LocationInfo) => loc.id === location,
                                  )?.name ?? location)}
                            </span>
                            {selectedLocation === location && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                  </div>
                </div>
              </div>
            </Modal>

            {/* Filter Dropdowns */}
            <div className="relative mt-2 grid w-full gap-2 lg:mt-4 lg:grid-cols-3 lg:gap-4">
              {/* Property Type Filter */}
              <div className="col-span-1 md:relative">
                <Button
                  ref={propertyTypeButtonRef}
                  type="default"
                  size="large"
                  icon={<Filter className="text-gray-600" size={16} />}
                  onClick={(e) => handleToggleFilterModal("propertyType", e)}
                  className={`filter-dropdown-button flex w-full items-center justify-between rounded-xl border-2 transition-all duration-300 sm:rounded-2xl ${
                    propertyTypeOpen
                      ? "border-red-500 bg-red-50 text-red-600 shadow-lg"
                      : "border-gray-200 hover:border-red-300 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm font-medium sm:text-base">
                    {t("search.propertyType")}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      propertyTypeOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Property Type Dropdown - Desktop */}
                {!isMobile && propertyTypeOpen && (
                  <div
                    ref={propertyTypeDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          {t("search.propertyType")}
                        </Title>
                        <Button
                          type="text"
                          icon={<X className="text-gray-600" size={14} />}
                          onClick={() => setPropertyTypeOpen(false)}
                          className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
                        />
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-3 sm:p-4">
                      {propertyTypesLoading ? (
                        <div className="flex justify-center py-4">
                          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        propertyTypeOptions.map((type) => (
                          <div
                            key={type.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                            onClick={() => handleSelectedPropertyType(type.id)}
                          >
                            <Checkbox
                              checked={
                                type.id === "all"
                                  ? propertyTypeOptions
                                      .filter((option) => option.id !== "all")
                                      .every((option) =>
                                        selectedPropertyTypes.includes(
                                          option.id,
                                        ),
                                      )
                                  : selectedPropertyTypes.includes(type.id)
                              }
                              className="text-red-500"
                            />
                            <span className="text-gray-600">{type.icon}</span>
                            <span className="text-sm text-gray-700">
                              {type.name}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-between border-t border-gray-100 p-3 sm:p-4">
                      <Button
                        type="text"
                        onClick={() => setSelectedPropertyTypes([])}
                        className="text-sm text-gray-500 hover:text-red-500 sm:text-base"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPropertyTypeOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600 sm:text-base"
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
                        onClick={() => setSelectedPropertyTypes([])}
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
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-500"></div>
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
                                  ? propertyTypeOptions
                                      .filter((option) => option.id !== "all")
                                      .every((option) =>
                                        selectedPropertyTypes.includes(
                                          option.id,
                                        ),
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

              {/* Price Range Filter */}
              <div className="col-span-1 md:relative">
                <Button
                  ref={priceRangeButtonRef}
                  type="default"
                  size="large"
                  icon={<DollarSign className="text-gray-600" size={16} />}
                  onClick={(e) => handleToggleFilterModal("priceRange", e)}
                  className={`filter-dropdown-button flex w-full items-center justify-between rounded-xl border-2 transition-all duration-300 sm:rounded-2xl ${
                    priceRangeOpen
                      ? "border-red-500 bg-red-50 text-red-600 shadow-lg"
                      : "border-gray-200 hover:border-red-300 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm font-medium sm:text-base">
                    {selectedPriceRange === "all"
                      ? t("search.priceRange")
                      : `${numberToString(priceRange[0], locale, currency)} - ${numberToString(priceRange[1], locale, currency)}`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      priceRangeOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Price Range Dropdown - Desktop */}
                {!isMobile && priceRangeOpen && (
                  <div
                    ref={priceRangeDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          {t("search.priceRange")}
                        </Title>
                        <Button
                          type="text"
                          icon={<X className="text-gray-600" size={14} />}
                          onClick={() => setPriceRangeOpen(false)}
                          className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
                        />
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      {/* Custom Price Range */}
                      <div className="mb-6">
                        <div className="mb-4 flex gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col gap-2">
                              <Text className="mb-1 block text-sm text-gray-600">
                                {t("search.from")}:
                              </Text>
                              <Text className="mb-1 block text-lg font-bold text-red-600">
                                {numberToString(
                                  priceRange[0],
                                  locale,
                                  currency,
                                )}
                              </Text>
                            </div>
                            <Input
                              placeholder={t("search.from")}
                              className="rounded-lg"
                              value={priceRange[0]}
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
                            <div className="flex flex-col gap-2">
                              <Text className="mb-1 block text-sm text-gray-600">
                                {t("search.to")}:
                              </Text>
                              <Text className="mb-1 block text-lg font-bold text-red-600">
                                {priceRange[1] === 100000000000
                                  ? "∞"
                                  : numberToString(
                                      priceRange[1],
                                      locale,
                                      currency,
                                    )}
                              </Text>
                            </div>
                            <Input
                              placeholder={t("search.to")}
                              className="rounded-lg"
                              value={priceRange[1]}
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
                          step={1000000}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value, locale, currency)}`;
                            },
                          }}
                          max={
                            currency === "USD"
                              ? 10000000
                              : currency === "LAK"
                                ? 20000000000
                                : currency === "THB"
                                  ? 20000000000
                                  : 200000000000
                          }
                          className="mb-4"
                        />
                      </div>

                      {/* Predefined Price Ranges */}
                      <div className="max-h-48 overflow-y-auto">
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

                    <div className="flex justify-between border-t border-gray-100 p-4">
                      <Button
                        type="text"
                        onClick={() => {
                          handlePriceRangeSelection("all");
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPriceRangeOpen(false)}
                        className="border-0 bg-red-500 hover:bg-red-600"
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
                          <Text className="mb-2 block text-sm font-medium text-gray-700">
                            {t("search.from")}
                          </Text>
                          <Text className="mb-2 block text-lg font-bold text-red-600">
                            {numberToString(priceRange[0], locale, currency)}
                          </Text>
                          <Input
                            placeholder={t("search.from")}
                            className="rounded-lg"
                            size="large"
                            value={priceRange[0]}
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
                          <Text className="mb-2 block text-sm font-medium text-gray-700">
                            {t("search.to")}
                          </Text>
                          <Text className="mb-2 block text-lg font-bold text-red-600">
                            {priceRange[1] === 100000000000
                              ? "∞"
                              : numberToString(priceRange[1], locale, currency)}
                          </Text>
                          <Input
                            placeholder={t("search.to")}
                            className="rounded-lg"
                            size="large"
                            value={priceRange[1]}
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
                          step={1000000}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value, locale, currency)}`;
                            },
                          }}
                          max={
                            currency === "USD"
                              ? 10000000
                              : currency === "LAK"
                                ? 20000000000
                                : currency === "THB"
                                  ? 20000000000
                                  : 200000000000
                          }
                          className="mb-6"
                        />
                      </div>
                    </div>

                    {/* Predefined Price Ranges */}
                    <div>
                      <Text className="mb-3 block text-sm font-medium text-gray-700">
                        {t("search.quickSelect")}
                      </Text>
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
              <div className="col-span-1 md:relative">
                <Button
                  ref={areaButtonRef}
                  type="default"
                  size="large"
                  icon={<Square className="text-gray-600" size={16} />}
                  onClick={(e) => handleToggleFilterModal("areaRange", e)}
                  className={`filter-dropdown-button flex w-full items-center justify-between rounded-xl border-2 transition-all duration-300 sm:rounded-2xl ${
                    areaOpen
                      ? "border-red-500 bg-red-50 text-red-600 shadow-lg"
                      : "border-gray-200 hover:border-red-300 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm font-medium sm:text-base">
                    {selectedAreaRange === "all"
                      ? t("search.area")
                      : `${areaRange[0]} m² - ${areaRange[1]} m²`}{" "}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      areaOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Area Dropdown - Desktop */}
                {!isMobile && areaOpen && (
                  <div
                    ref={areaDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          {t("search.area")}
                        </Title>
                        <Button
                          type="text"
                          icon={<X className="text-gray-600" size={14} />}
                          onClick={() => setAreaOpen(false)}
                          className="flex h-5 w-5 items-center justify-center sm:h-6 sm:w-6"
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Custom Area Range */}
                      <div className="mb-6">
                        <div className="mb-4 flex gap-4">
                          <div className="flex-1">
                            <Text className="mb-1 block text-sm text-gray-600">
                              {t("search.minArea")}
                            </Text>
                            <Input
                              placeholder={t("search.from")}
                              className="rounded-lg"
                              suffix="m²"
                              value={areaRange[0]}
                              onChange={(e) =>
                                handleMinAreaInputChange(
                                  parseInt(e.target.value),
                                )
                              }
                            />
                          </div>
                          <div className="flex items-end">
                            <ArrowRight className="mb-2 h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <Text className="mb-1 block text-sm text-gray-600">
                              {t("search.maxArea")}
                            </Text>
                            <Input
                              placeholder={t("search.to")}
                              className="rounded-lg"
                              suffix="m²"
                              value={areaRange[1]}
                              onChange={(e) =>
                                handleMaxAreaInputChange(
                                  parseInt(e.target.value),
                                )
                              }
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
                          max={50000}
                          step={50}
                          className="mb-4"
                        />
                      </div>

                      {/* Predefined Area Ranges */}
                      <div className="max-h-48 overflow-y-auto">
                        <Radio.Group
                          value={selectedAreaRange}
                          onChange={(e) =>
                            handleAreaRangeSelection(e.target.value as string)
                          }
                          className="w-full"
                        >
                          {areaRanges.map((range) => (
                            <div key={range.value} className="mb-2">
                              <Radio value={range.value} className="text-sm">
                                {range.label}
                              </Radio>
                            </div>
                          ))}
                        </Radio.Group>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-gray-100 p-4">
                      <Button
                        type="text"
                        onClick={() => {
                          handleAreaRangeSelection("all");
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        {t("common.reset")}
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setAreaOpen(false)}
                        className="border-0 bg-red-500 hover:bg-red-600"
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
                          handleAreaRangeSelection("all");
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
                  <div className="max-h-[70vh] overflow-y-auto">
                    {/* Custom Area Range */}
                    <div className="mb-6">
                      <div className="mb-6 flex gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Text className="mb-2 block text-sm font-medium text-gray-700">
                              {t("search.from")}
                            </Text>
                            <Text className="mb-2 block text-lg font-bold text-red-600">
                              {areaRange[0]}m²
                            </Text>
                          </div>
                          <Input
                            placeholder={t("search.from")}
                            className="rounded-lg"
                            size="large"
                            suffix="m²"
                            value={areaRange[0]}
                            onChange={(e) =>
                              handleMinAreaInputChange(parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="flex items-center pt-8">
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Text className="mb-2 block text-sm font-medium text-gray-700">
                              {t("search.to")}
                            </Text>
                            <Text className="mb-2 block text-lg font-bold text-red-600">
                              {areaRange[1] === 50000 ? "∞" : areaRange[1]}m²
                            </Text>
                          </div>
                          <Input
                            placeholder={t("search.to")}
                            className="rounded-lg"
                            size="large"
                            suffix="m²"
                            value={areaRange[1]}
                            onChange={(e) =>
                              handleMaxAreaInputChange(parseInt(e.target.value))
                            }
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
                      <Text className="mb-3 block text-sm font-medium text-gray-700">
                        {t("search.quickSelect")}
                      </Text>
                      <Radio.Group
                        value={selectedAreaRange}
                        onChange={(e) =>
                          handleAreaRangeSelection(e.target.value as string)
                        }
                        className="w-full"
                      >
                        <div className="space-y-2">
                          {areaRanges.map((range) => (
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
        </div>
      </div>
    </section>
  );
};

export default SearchBox;
