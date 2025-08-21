"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useClickAway, useEventListener } from "ahooks";
import {
  Filter,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
  Square,
  X,
  Home,
  Building2,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { numberToString } from "@/share/helper/number-to-string";
import {
  Button,
  Input,
  Checkbox,
  Typography,
  message,
  Slider,
  Radio,
  Switch,
  Spin,
  Empty,
} from "antd";
import { PRICE_RANGE_OPTIONS } from "@/share/constant/home-search";
import propertyService from "@/share/service/property.service";
import { useRequest } from "ahooks";
import type { Property } from "@/@types/types";
import PropertyCard from "./property-card";

const PropertiesForSale = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );
  const [selectedLocation, setSelectedLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000000,
  ]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [verifiedOpen, setVerifiedOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const searchModalRef = useRef<HTMLDivElement>(null);
  const locationModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

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
            value === "100000000000" ||
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
        transaction: "sale",
        ...params,
      };

      if (debouncedKeyword?.trim()) {
        apiParams.keyword = debouncedKeyword;
      }

      if (minPrice && minPrice !== "0") {
        apiParams.minPrice = parseInt(minPrice);
      }

      if (maxPrice && maxPrice !== "100000000000") {
        apiParams.maxPrice = parseInt(maxPrice);
      }

      if (minArea && minArea !== "0") {
        apiParams.minArea = parseInt(minArea);
      }

      if (maxArea && maxArea !== "100000000000") {
        apiParams.maxArea = parseInt(maxArea);
      }

      if (selectedLocation?.trim()) {
        apiParams.location = selectedLocation;
      }

      if (selectedPropertyTypes.length > 0) {
        apiParams.propertyTypes = selectedPropertyTypes;
      }

      if (verifiedOpen) {
        apiParams.isVerified = true;
      }

      if (brokerOpen) {
        apiParams.isBroker = true;
      }

      const response = await propertyService.getProperties(apiParams);
      return response as unknown as {
        data: Property[];
        meta: {
          itemCount: number;
          pageCount: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
        };
      };
    },
    {
      manual: true,
      cacheKey: "properties-search",
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
  ]);

  useEffect(() => {
    if (isInitialLoad) return;

    fetchProperties();
  }, [verifiedOpen, brokerOpen, fetchProperties, isInitialLoad]);

  useClickAway(() => {
    setSearchModalOpen(false);
  }, [searchModalRef, searchInputRef]);

  useClickAway(() => {
    setLocationModalOpen(false);
  }, [locationModalRef, locationButtonRef]);

  useClickAway(() => {
    setSearchModalOpen(false);
    setLocationModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
  }, [searchModalRef, locationModalRef, searchInputRef, locationButtonRef]);

  useEventListener(
    "scroll",
    () => {
      setSearchModalOpen(false);
      setLocationModalOpen(false);
      setPriceRangeOpen(false);
      setPropertyTypeOpen(false);
    },
    { target: typeof document !== "undefined" ? document : undefined },
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isOutsideDropdown = !target.closest(".filter-dropdown");
      const isOutsideButton = !target.closest(".filter-dropdown-button");

      if (isOutsideDropdown && isOutsideButton) {
        setPriceRangeOpen(false);
        setPropertyTypeOpen(false);
      }
    };

    if (priceRangeOpen || propertyTypeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [priceRangeOpen, propertyTypeOpen]);

  const locations = [
    { id: "", label: "Tất cả khu vực" },
    { id: "vientiane", label: "Vientiane" },
    { id: "luang-prabang", label: "Luang Prabang" },
    { id: "pakse", label: "Pakse" },
    { id: "savannakhet", label: "Savannakhet" },
    { id: "thakhek", label: "Thakhek" },
    { id: "xam-nua", label: "Xam Nua" },
  ];

  const districts = [
    { id: "tay-ninh-city", name: "Thành phố Tây Ninh", searchCount: 1847 },
    { id: "ben-cau", name: "Huyện Bến Cầu", searchCount: 523 },
    { id: "chau-thanh", name: "Huyện Châu Thành", searchCount: 456 },
    { id: "duong-minh-chau", name: "Huyện Dương Minh Châu", searchCount: 789 },
    { id: "go-dau", name: "Huyện Gò Dầu", searchCount: 1209 },
    { id: "hoa-thanh", name: "Huyện Hòa Thành", searchCount: 937 },
    { id: "tan-bien", name: "Huyện Tân Biên", searchCount: 634 },
    { id: "tan-chau", name: "Huyện Tân Châu", searchCount: 445 },
    { id: "trang-bang", name: "Huyện Trảng Bàng", searchCount: 4083 },
  ];

  const popularCities = [
    {
      id: "hanoi",
      name: "Hà Nội",
      image: "/images/landingpage/cities/hanoi.jpg",
    },
    {
      id: "ho-chi-minh",
      name: "Hồ Chí Minh",
      image: "/images/landingpage/cities/ho-chi-minh.jpg",
    },
    {
      id: "da-nang",
      name: "Đà Nẵng",
      image: "/images/landingpage/cities/da-nang.jpg",
    },
    {
      id: "binh-duong",
      name: "Bình Dương",
      image: "/images/landingpage/cities/binh-duong.jpg",
    },
    {
      id: "dong-nai",
      name: "Đồng Nai",
      image: "/images/landingpage/cities/dong-nai.jpg",
    },
  ];

  const allProvinces = [
    "An Giang",
    "Cao Bằng",
    "Hải Phòng",
    "Nam Định",
    "Bà Rịa Vũng Tàu",
    "Đà Nẵng",
    "Hậu Giang",
    "Nghệ An",
    "Bắc Giang",
    "Đắk Lắk",
    "Hồ Chí Minh",
    "Ninh Bình",
    "Bắc Kạn",
    "Đắk Nông",
    "Hòa Bình",
    "Ninh Thuận",
    "Bạc Liêu",
    "Điện Biên",
    "Hưng Yên",
    "Phú Thọ",
    "Thừa Thiên Huế",
    "Tây Ninh",
    "Lào Cai",
    "Phú Yên",
    "Tiền Giang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
    "Cà Mau",
    "Lạng Sơn",
    "Quảng Bình",
    "Trà Vinh",
    "Cần Thơ",
    "Lâm Đồng",
    "Quảng Nam",
    "Tuyên Quang",
    "Đồng Tháp",
    "Long An",
    "Quảng Ngãi",
    "Vĩnh Phúc",
  ];

  const sortOptions = [
    { id: "newest", label: "Mới nhất" },
    { id: "price-low", label: "Giá thấp nhất" },
    { id: "price-high", label: "Giá cao nhất" },
    { id: "area-large", label: "Diện tích lớn nhất" },
    { id: "area-small", label: "Diện tích nhỏ nhất" },
  ];

  const priceRanges = PRICE_RANGE_OPTIONS;

  const propertyTypeOptions = [
    { id: "all", name: "Tất cả nhà đất", icon: <Home className="h-4 w-4" /> },
    {
      id: "apartment",
      name: "Căn hộ chung cư",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: "mini-apartment",
      name: "Chung cư mini, căn hộ dịch vụ",
      icon: <Building2 className="h-4 w-4" />,
    },
    { id: "house", name: "Nhà riêng", icon: <Home className="h-4 w-4" /> },
    {
      id: "villa",
      name: "Nhà biệt thự, liền kề",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: "street-house",
      name: "Nhà mặt phố",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: "shophouse",
      name: "Shophouse, nhà phố thương mại",
      icon: <Building2 className="h-4 w-4" />,
    },
    { id: "land", name: "Đất nền", icon: <Square className="h-4 w-4" /> },
  ];

  const handleSearch = () => {
    const params: Record<string, string | string[]> = {};

    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (minArea) params.minArea = minArea;
    if (maxArea) params.maxArea = maxArea;
    if (selectedPropertyTypes.length > 0) {
      params.selectedPropertyTypes = selectedPropertyTypes;
    }
    if (selectedLocation) params.selectedLocation = selectedLocation;
    if (keyword) params.keyword = keyword;
    if (verifiedOpen) params.isVerified = "true";
    if (brokerOpen) params.isBroker = "true";

    updateSearchParams(params);
    message.success("Đang tìm kiếm...");
  };

  const handleSelectedPropertyType = (type: string) => {
    let newSelectedTypes: string[];

    if (type === "all") {
      const allTypeIds = propertyTypeOptions
        .filter((option) => option.id !== "all")
        .map((option) => option.id);
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
      selectedPropertyTypes: newSelectedTypes,
    });
  };

  const handlePriceRangeSelection = (rangeValue: string) => {
    setSelectedPriceRange(rangeValue);

    let minValue = 0;
    let maxValue = 100000000000;

    switch (rangeValue) {
      case "under-500":
        minValue = 0;
        maxValue = 500000000;
        break;
      case "500-800":
        minValue = 500000000;
        maxValue = 800000000;
        break;
      case "800-1000":
        minValue = 800000000;
        maxValue = 1000000000;
        break;
      case "1000-2000":
        minValue = 1000000000;
        maxValue = 2000000000;
        break;
      case "2000-5000":
        minValue = 2000000000;
        maxValue = 5000000000;
        break;
      case "5000-10000":
        minValue = 5000000000;
        maxValue = 10000000000;
        break;
      case "over-10000":
        minValue = 10000000000;
        maxValue = 100000000000;
        break;
      case "all":
      default:
        minValue = 0;
        maxValue = 100000000000;
        break;
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
    if (maxValue !== 100000000000) {
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
    if (value[1] !== 100000000000) {
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
    const numValue = value || 100000000000;
    setPriceRange([priceRange[0], numValue]);
    setSelectedPriceRange("");
    setMaxPrice(numValue.toString());

    const params: Record<string, string> = {};
    if (numValue !== 100000000000) {
      params.maxPrice = numValue.toString();
    } else {
      params.maxPrice = "";
    }

    updateSearchParams(params);
  };

  const togglePropertyTypeModal = () => {
    setPropertyTypeOpen(!propertyTypeOpen);
    setPriceRangeOpen(false);
  };

  const togglePriceRangeModal = () => {
    setPriceRangeOpen(!priceRangeOpen);
    setPropertyTypeOpen(false);
  };

  const toggleVerifiedModal = () => {
    const newVerifiedOpen = !verifiedOpen;
    setVerifiedOpen(newVerifiedOpen);

    const params: Record<string, string> = {};
    if (newVerifiedOpen) {
      params.isVerified = "true";
    } else {
      params.isVerified = "";
    }

    updateSearchParams(params);
  };

  const toggleBrokerModal = () => {
    const newBrokerOpen = !brokerOpen;
    setBrokerOpen(newBrokerOpen);

    const params: Record<string, string> = {};
    if (newBrokerOpen) {
      params.isBroker = "true";
    } else {
      params.isBroker = "";
    }

    updateSearchParams(params);
  };

  const handleSearchInputClick = () => {
    setSearchModalOpen(!searchModalOpen);
    setLocationModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
  };

  const handleLocationClick = () => {
    setLocationModalOpen(!locationModalOpen);
    setSearchModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
  };

  const handleDistrictSelect = (districtName: string) => {
    setKeyword(districtName);
    setSearchModalOpen(false);

    updateSearchParams({
      keyword: districtName || "",
    });
  };

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedLocation(provinceName);
    setLocationModalOpen(false);

    updateSearchParams({
      selectedLocation: provinceName || "",
    });
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setSelectedPropertyTypes([]);
    setSelectedLocation("");
    setKeyword("");
    setVerifiedOpen(false);
    setBrokerOpen(false);
    setPriceRange([0, 100000000000]);
    setSelectedPriceRange("all");

    router.push(pathname);
  };

  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlMinArea = searchParams.get("minArea");
    const urlMaxArea = searchParams.get("maxArea");
    const urlSelectedPropertyTypes =
      searchParams.get("selectedPropertyTypes")?.split(",").filter(Boolean) ??
      [];
    const urlSelectedLocation = searchParams.get("selectedLocation") ?? "";
    const urlKeyword = searchParams.get("keyword") ?? "";
    const urlIsVerified = searchParams.get("isVerified") === "true";
    const urlIsBroker = searchParams.get("isBroker") === "true";

    // Update state
    setMinPrice(urlMinPrice ?? "");
    setMaxPrice(urlMaxPrice ?? "");
    setMinArea(urlMinArea ?? "");
    setMaxArea(urlMaxArea ?? "");
    setSelectedPropertyTypes(urlSelectedPropertyTypes);
    setSelectedLocation(urlSelectedLocation);
    setKeyword(urlKeyword);
    setDebouncedKeyword(urlKeyword);
    setVerifiedOpen(urlIsVerified);
    setBrokerOpen(urlIsBroker);

    // Update price range
    const newMinPrice = parseInt(urlMinPrice ?? "0");
    const newMaxPrice = parseInt(urlMaxPrice ?? "100000000000");
    setPriceRange([newMinPrice, newMaxPrice]);

    // Update selected price range
    let newSelectedPriceRange = "all";
    if (newMinPrice === 0 && newMaxPrice === 500000000) {
      newSelectedPriceRange = "under-500";
    } else if (newMinPrice === 500000000 && newMaxPrice === 800000000) {
      newSelectedPriceRange = "500-800";
    } else if (newMinPrice === 800000000 && newMaxPrice === 1000000000) {
      newSelectedPriceRange = "800-1000";
    } else if (newMinPrice === 1000000000 && newMaxPrice === 2000000000) {
      newSelectedPriceRange = "1000-2000";
    } else if (newMinPrice === 2000000000 && newMaxPrice === 5000000000) {
      newSelectedPriceRange = "2000-5000";
    } else if (newMinPrice === 5000000000 && newMaxPrice === 10000000000) {
      newSelectedPriceRange = "5000-10000";
    } else if (newMinPrice === 10000000000 && newMaxPrice === 100000000000) {
      newSelectedPriceRange = "over-10000";
    } else if (newMinPrice !== 0 || newMaxPrice !== 100000000000) {
      newSelectedPriceRange = "";
    }
    setSelectedPriceRange(newSelectedPriceRange);

    setIsInitialLoad(false);
  }, [searchParams]);

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

  const getFilterDisplayText = () => {
    const filters = [];

    if (selectedLocation) {
      const location = locations.find((loc) => loc.id === selectedLocation);
      if (location) {
        filters.push(location.label);
      }
    }

    if (selectedPropertyTypes.length > 0) {
      const typeNames = {
        apartment: "Căn hộ",
        house: "Nhà riêng",
        villa: "Villa",
        shophouse: "Shophouse",
        land: "Đất nền",
      };
      const typeText = selectedPropertyTypes
        .map((type) => typeNames[type as keyof typeof typeNames] || type)
        .join(", ");
      filters.push(typeText);
    }

    if (minPrice && maxPrice) {
      filters.push(
        `${numberToString(parseInt(minPrice))} - ${numberToString(parseInt(maxPrice))}`,
      );
    }

    if (keyword) {
      filters.push(`"${keyword}"`);
    }

    return filters.length > 0 ? filters.join(" • ") : "";
  };

  return (
    <div className="min-h-screen">
      <div className="">
        <div className="container mx-auto px-4 py-4">
          <div className="relative flex items-center gap-2 rounded-xl border border-gray-200">
            <div
              ref={searchInputRef}
              className="search-input flex flex-1 items-center gap-2"
            >
              <Input
                prefix={<Search className="mx-2 text-gray-500" size={18} />}
                placeholder={keyword || "Đường Láng"}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onClick={handleSearchInputClick}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
                onPressEnter={handleSearch}
              />
            </div>

            <Button
              type="text"
              ref={locationButtonRef}
              className="location-button flex w-1/10 items-center gap-2 rounded-lg bg-white px-3 py-2"
              onClick={handleLocationClick}
              style={{
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <span className="text-sm font-medium text-gray-900">
                {selectedLocation ? selectedLocation : "Tây Ninh"}
              </span>
              <ChevronRight size={14} className="rotate-90 text-gray-400" />
            </Button>

            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              className="rounded-lg border-red-500 bg-red-500 px-6 hover:border-red-600 hover:bg-red-600"
            >
              Tìm kiếm
            </Button>
            {searchModalOpen && (
              <div
                ref={searchModalRef}
                className="search-popup absolute top-full left-0 z-50 mt-2 h-[60vh] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl sm:h-[50vh]"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <div>
                      <Typography.Title
                        level={4}
                        className="mb-1 text-base sm:text-lg"
                      >
                        Tìm kiếm
                      </Typography.Title>
                      <Typography.Text
                        type="secondary"
                        className="text-xs sm:text-sm"
                      >
                        Nhập từ khóa tìm kiếm
                      </Typography.Text>
                    </div>
                    <Button
                      type="text"
                      icon={<X className="h-4 w-4 sm:h-5 sm:w-5" />}
                      onClick={() => setSearchModalOpen(false)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 sm:h-8 sm:w-8"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                      <div className="mb-3 flex items-center gap-2 sm:mb-4">
                        <MapPin className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                        <Typography.Text
                          strong
                          className="text-sm sm:text-base"
                        >
                          Danh sách quận huyện
                        </Typography.Text>
                      </div>
                      <div className="max-h-96 space-y-2 overflow-y-auto">
                        {districts.map((district) => (
                          <div
                            key={district.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-gray-50"
                            onClick={() => handleDistrictSelect(district.name)}
                          >
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {district.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Panel - Search Trends */}
                    <div className="lg:col-span-2">
                      <div className="mb-3 flex items-center gap-2 sm:mb-4">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 sm:h-5 sm:w-5">
                          <span className="text-xs text-white">🔥</span>
                        </div>
                        <Typography.Text
                          strong
                          className="text-sm sm:text-base"
                        >
                          Xu hướng tìm kiếm
                        </Typography.Text>
                      </div>
                      <div className="space-y-3">
                        {districts
                          .sort((a, b) => b.searchCount - a.searchCount)
                          .slice(0, 5)
                          .map((district, index) => (
                            <div
                              key={district.id}
                              className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all duration-200 hover:bg-gray-50"
                              onClick={() =>
                                handleDistrictSelect(district.name)
                              }
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                                  <span className="text-sm font-medium text-gray-600">
                                    #{index + 1}
                                  </span>
                                </div>
                                <span className="text-sm font-medium">
                                  {district.name}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {district.searchCount.toLocaleString()} lượt tìm
                                kiếm
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Location Modal */}
            {locationModalOpen && (
              <div
                ref={locationModalRef}
                className="location-popup absolute top-full left-0 z-50 mt-2 h-[60vh] w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl sm:h-[50vh]"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <div>
                      <Typography.Title
                        level={4}
                        className="mb-1 text-base sm:text-lg"
                      >
                        Chọn khu vực tìm kiếm
                      </Typography.Title>
                      <Typography.Text
                        type="secondary"
                        className="text-xs sm:text-sm"
                      >
                        Bạn muốn tìm bất động sản tại tỉnh thành nào?
                      </Typography.Text>
                    </div>
                    <Button
                      type="text"
                      icon={<X className="h-4 w-4 sm:h-5 sm:w-5" />}
                      onClick={() => setLocationModalOpen(false)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 sm:h-8 sm:w-8"
                    />
                  </div>

                  {/* Popular Cities */}
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 sm:h-5 sm:w-5">
                        <span className="text-xs text-white">🔥</span>
                      </div>
                      <Typography.Text strong className="text-sm sm:text-base">
                        Top tỉnh thành nổi bật
                      </Typography.Text>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                      {popularCities.map((city) => (
                        <div
                          key={city.id}
                          className={`group relative h-20 overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg sm:h-24 sm:rounded-xl ${
                            selectedLocation === city.name
                              ? "bg-red-50 ring-2 ring-red-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-red-300"
                          }`}
                          onClick={() => handleProvinceSelect(city.name)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                          <div
                            className={`absolute inset-0 ${
                              selectedLocation === city.name
                                ? "bg-red-200"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="absolute right-3 bottom-3 left-3">
                            <Typography.Text
                              strong
                              className={`text-sm drop-shadow-lg ${
                                selectedLocation === city.name
                                  ? "text-red-800"
                                  : "text-white"
                              }`}
                            >
                              {city.name}
                            </Typography.Text>
                          </div>
                          {selectedLocation === city.name && (
                            <div className="absolute top-2 right-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                                <CheckCircle className="text-white" size={16} />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Locations */}
                  <div>
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-500 sm:h-5 sm:w-5">
                        <span className="text-xs text-white">🌍</span>
                      </div>
                      <Typography.Text strong className="text-sm sm:text-base">
                        Tất cả tỉnh thành
                      </Typography.Text>
                    </div>
                    <div className="grid max-h-96 grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
                      {allProvinces.map((province) => (
                        <Button
                          key={province}
                          type={
                            selectedLocation === province
                              ? "primary"
                              : "default"
                          }
                          onClick={() => handleProvinceSelect(province)}
                          className={`w-full rounded-lg px-2 py-2 text-left text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm ${
                            selectedLocation === province
                              ? "border-red-500 bg-red-500 text-white shadow-md"
                              : "text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          <label className="capitalize">{province}</label>
                          {selectedLocation === province && (
                            <CheckCircle className="ml-2 h-4 w-4" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter Row */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {/* Filter Button */}
            <Button
              icon={<Filter className="h-4 w-4" />}
              className="rounded-lg border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            >
              Lọc
            </Button>

            {/* Property Type Filter */}
            <div className="relative">
              <Button
                type="default"
                onClick={togglePropertyTypeModal}
                className={`filter-dropdown-button flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all duration-200 ${
                  propertyTypeOpen
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "hover:border-gray-300"
                }`}
              >
                <span className="text-sm text-gray-600">Loại nhà đất</span>
                <ChevronRight
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    propertyTypeOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {/* Property Type Dropdown */}
              {propertyTypeOpen && (
                <div
                  className="filter-dropdown absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <Typography.Title level={5} className="mb-0 text-sm">
                        Loại nhà đất
                      </Typography.Title>
                      <Button
                        type="text"
                        icon={<X className="text-gray-600" size={14} />}
                        onClick={() => setPropertyTypeOpen(false)}
                        className="flex h-5 w-5 items-center justify-center"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto p-3">
                    {propertyTypeOptions.map((type) => (
                      <div
                        key={type.id}
                        className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-gray-50"
                        onClick={() => handleSelectedPropertyType(type.id)}
                      >
                        <Checkbox
                          checked={
                            type.id === "all"
                              ? propertyTypeOptions
                                  .filter((option) => option.id !== "all")
                                  .every((option) =>
                                    selectedPropertyTypes.includes(option.id),
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
                    ))}
                  </div>

                  <div className="flex justify-between border-t border-gray-100 p-3">
                    <Button
                      type="text"
                      onClick={() => {
                        setSelectedPropertyTypes([]);
                        updateSearchParams({
                          selectedPropertyTypes: [],
                        });
                      }}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setPropertyTypeOpen(false)}
                      className="border-0 bg-red-500 text-sm hover:bg-red-600"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <Button
                type="default"
                onClick={togglePriceRangeModal}
                className={`filter-dropdown-button flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all duration-200 ${
                  priceRangeOpen
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "hover:border-gray-300"
                }`}
              >
                <span className="text-sm text-gray-600">Mức giá</span>
                <ChevronRight
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${
                    priceRangeOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>

              {/* Price Range Dropdown */}
              {priceRangeOpen && (
                <div
                  className="filter-dropdown absolute top-full left-0 z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="border-b border-gray-100 p-3">
                    <div className="flex items-center justify-between">
                      <Typography.Title level={5} className="mb-0 text-sm">
                        Mức giá
                      </Typography.Title>
                      <Button
                        type="text"
                        icon={<X className="text-gray-600" size={14} />}
                        onClick={() => setPriceRangeOpen(false)}
                        className="flex h-5 w-5 items-center justify-center"
                      />
                    </div>
                  </div>

                  <div className="p-3">
                    {/* Custom Price Range */}
                    <div className="mb-6">
                      <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                          <Typography.Text className="mb-1 block text-sm text-gray-600">
                            Từ: {numberToString(priceRange[0])}
                          </Typography.Text>
                          <Input
                            placeholder="Từ"
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
                          <Typography.Text className="mb-1 block text-sm text-gray-600">
                            Đến: {numberToString(priceRange[1])}
                          </Typography.Text>
                          <Input
                            placeholder="Đến"
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
                            return `${numberToString(value)}`;
                          },
                        }}
                        max={20000000000}
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

                  <div className="flex justify-between border-t border-gray-100 p-3">
                    <Button
                      type="text"
                      onClick={() => {
                        handlePriceRangeSelection("all");
                      }}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setPriceRangeOpen(false)}
                      className="border-0 bg-red-500 text-sm hover:bg-red-600"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Verified Filter */}
            <div
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all duration-200 hover:border-gray-300"
              onClick={toggleVerifiedModal}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Tin xác thực</span>
              <Switch checked={verifiedOpen} />
            </div>

            {/* Broker Filter */}
            <div
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all duration-200 hover:border-gray-300"
              onClick={toggleBrokerModal}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">
                Môi giới chuyên nghiệp
              </span>
              <Switch checked={brokerOpen} />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col justify-center gap-6 lg:flex-row">
          {/* Left Content - Property Listing */}
          <div className="w-full">
            {/* Enhanced Breadcrumb */}
            <div className="mb-4 flex items-center text-sm">
              <div className="flex items-center space-x-2">
                <span className="cursor-pointer text-gray-500 transition-colors hover:text-red-500 hover:underline">
                  Trang chủ
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300" />
                <span className="font-medium text-gray-900">Nhà đất bán</span>
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

            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Mua bán nhà đất Lào
              </h1>
            </div>

            {isInitialLoad ? (
              <div className="flex h-[500px] items-center justify-center">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Results Header */}
                <div className="mb-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3"></div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>Hiện có</span>
                        <span className="text-lg font-bold text-red-500">
                          {properties?.meta.itemCount.toString()}
                        </span>
                        <span>bất động sản</span>
                        {propertiesLoading && (
                          <Spin size="small" className="ml-2" />
                        )}
                      </div>
                      {getFilterDisplayText() && (
                        <div className="flex items-center gap-2">
                          <span>cho</span>
                          <span className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-900">
                            &quot;{getFilterDisplayText()}&quot;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property List */}
                {properties?.data.length === 0 ? (
                  <div className="flex h-[500px] items-center justify-center">
                    <Empty description="Không tìm thấy bất động sản phù hợp" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {properties?.data.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Enhanced Show More Section */}
            <div className="mt-12 text-center">
              <div className="rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 p-8">
                <div className="mb-4">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    Không tìm thấy bất động sản phù hợp?
                  </h3>
                  <p className="text-gray-600">
                    Hãy thử điều chỉnh bộ lọc hoặc đăng ký nhận thông báo khi có
                    tin mới
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="large"
                    className="border-red-500 bg-red-500 px-8 text-white hover:border-red-600 hover:bg-red-600"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Điều chỉnh bộ lọc
                  </Button>
                  <Button
                    size="large"
                    className="border-gray-300 px-8 hover:bg-gray-50"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Đăng ký thông báo
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Pagination */}
            {properties?.meta.pageCount &&
              properties?.meta.pageCount > 1 &&
              properties?.meta.itemCount &&
              properties?.meta.itemCount > 0 && (
                <div className="mt-12">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Page Info */}
                    <div className="text-sm text-gray-600">
                      Hiển thị{" "}
                      <span className="font-medium text-gray-900">
                        {(properties?.meta.itemCount ?? 0) + 1}
                      </span>{" "}
                      -{" "}
                      <span className="font-medium text-gray-900">
                        {Math.min(
                          (properties?.meta.itemCount ?? 0) + 1,
                          properties?.meta.itemCount ?? 0,
                        )}
                      </span>{" "}
                      trong tổng số{" "}
                      <span className="font-medium text-gray-900">
                        {properties?.meta.itemCount}
                      </span>{" "}
                      kết quả
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        icon={<ChevronLeft className="h-4 w-4" />}
                        className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="hidden sm:inline">Trước</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: properties?.meta.pageCount ?? 0 },
                          (_, index) => {
                            const page = index + 1;
                            if (
                              page === 1 ||
                              page === properties?.meta.pageCount ||
                              (page >= currentPage - 2 &&
                                page <= currentPage + 2)
                            ) {
                              return (
                                <Button
                                  key={page}
                                  onClick={() => setCurrentPage(page)}
                                  className={`h-10 w-10 p-0 transition-all duration-200 ${
                                    page === currentPage
                                      ? "border-red-500 bg-red-500 text-white shadow-lg hover:bg-red-600"
                                      : "border-gray-300 hover:border-red-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {page}
                                </Button>
                              );
                            } else if (
                              page === currentPage - 3 ||
                              page === currentPage + 3
                            ) {
                              return (
                                <span
                                  key={page}
                                  className="flex h-10 w-10 items-center justify-center text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          },
                        )}
                      </div>

                      <Button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, properties?.meta.pageCount ?? 0),
                          )
                        }
                        disabled={
                          currentPage === (properties?.meta.pageCount ?? 0)
                        }
                        icon={<ChevronRight className="h-4 w-4" />}
                        className="border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <span className="hidden sm:inline">Sau</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Enhanced Filters Sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-20">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-bold text-gray-900">
                  <Filter className="mr-3 h-5 w-5 text-red-500" />
                  Bộ lọc
                </h3>
                <Button
                  type="text"
                  size="small"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-red-500"
                >
                  Đặt lại
                </Button>
              </div>

              {/* Area - Hidden on mobile */}
              <div className="mb-4 hidden lg:mb-6 lg:block">
                <h4 className="mb-2 text-xs font-semibold text-gray-800 lg:mb-3 lg:text-sm">
                  Diện tích
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "< 30m²",
                    "30-50m²",
                    "50-80m²",
                    "80-100m²",
                    "100-150m²",
                    "> 150m²",
                  ].map((area) => (
                    <Button
                      key={area}
                      size="small"
                      className="border-gray-300 text-xs hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bedrooms - Hidden on mobile */}
              <div className="mb-4 hidden lg:mb-6 lg:block">
                <h4 className="mb-2 text-xs font-semibold text-gray-800 lg:mb-3 lg:text-sm">
                  Số phòng ngủ
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {["1 PN", "2 PN", "3 PN", "4+ PN"].map((bedroom) => (
                    <Button
                      key={bedroom}
                      size="small"
                      className="border-gray-300 text-xs hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                      {bedroom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Special Features - Hidden on mobile */}
              <div className="mb-4 hidden lg:mb-6 lg:block">
                <h4 className="mb-2 text-xs font-semibold text-gray-800 lg:mb-3 lg:text-sm">
                  Đặc điểm
                </h4>
                <div className="space-y-2">
                  {[
                    "Có hình ảnh",
                    "Có video",
                    "Chính chủ",
                    "Căn góc",
                    "Gần trường học",
                    "Gần bệnh viện",
                  ].map((feature) => (
                    <Checkbox key={feature} className="text-sm">
                      {feature}
                    </Checkbox>
                  ))}
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                className="w-full border-red-500 bg-red-500 shadow-lg hover:border-red-600 hover:bg-red-600"
              >
                <Filter className="mr-2 h-4 w-4" />
                Áp dụng bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesForSale;
