"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useClickAway, useEventListener } from "ahooks";
import {
  Filter,
  MapPin,
  Heart,
  ChevronRight,
  Search,
  Square,
  X,
  Home,
  Building2,
  ArrowRight,
  CheckCircle,
  List,
} from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { numberToString } from "@/share/helper/number-to-string";
import {
  Button,
  Input,
  Checkbox,
  Typography,
  Slider,
  Radio,
  Spin,
  Empty,
  Pagination,
  App,
  Tooltip,
  Col,
} from "antd";
import { PRICE_RANGE_OPTIONS } from "@/share/constant/home-search";
import propertyService from "@/share/service/property.service";
import propertyTypeService from "@/share/service/property-type.service";
import { useRequest } from "ahooks";
import type { APIResponse, Property, PropertyType } from "@/@types/types";
import PropertyCard from "./property-card";
import PropertyCardSkeleton from "@/components/business/common/property-card-skeleton";

interface PropertiesProps {
  transaction: "sale" | "rent" | "project";
}

const Properties = ({ transaction }: PropertiesProps) => {
  const { message } = App.useApp();
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
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000000,
  ]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 1000]);
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
  const [layout, setLayout] = useState<"grid" | "list">("list");

  const searchModalRef = useRef<HTMLDivElement>(null);
  const locationModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch property types
  const { loading: propertyTypesLoading } = useRequest(
    async () => {
      const response = await propertyTypeService.getPropertyTypes({
        transaction: transaction,
      });
      return response.data ?? [];
    },
    {
      onSuccess: (data) => {
        setPropertyTypes(data);
      },
      onError: (error) => {
        console.error("Failed to fetch property types:", error);
        message.error("Không thể tải danh sách loại bất động sản");
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
        transaction: transaction,
        page: currentPage,
        perPage: pageSize,
        ...params,
      };

      if (debouncedKeyword?.trim()) {
        apiParams.keyword = debouncedKeyword;
      }

      if (minPrice && minPrice !== "0") {
        apiParams.minPrice = parseInt(minPrice);
      }

      if (maxPrice && maxPrice !== "100000000000" && maxPrice !== "") {
        apiParams.maxPrice = parseInt(maxPrice);
      }

      if (minArea && minArea !== "0") {
        apiParams.minArea = parseInt(minArea);
      }

      if (maxArea && maxArea !== "100000000000") {
        apiParams.maxArea = parseInt(maxArea);
      }

      if (selectedLocation && selectedLocation !== "all") {
        apiParams.location = selectedLocation;
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
    setSearchModalOpen(false);
    setLocationModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
    setAreaOpen(false);
  }, [searchModalRef, locationModalRef, searchInputRef, locationButtonRef]);

  useEventListener(
    "scroll",
    () => {
      setSearchModalOpen(false);
      setLocationModalOpen(false);
      setPriceRangeOpen(false);
      setPropertyTypeOpen(false);
      setAreaOpen(false);
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
        setAreaOpen(false);
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
    { id: "all", label: "Tất cả khu vực" },
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
    "all",
    "vientiane",
    "luang-prabang",
    "pakse",
    "savannakhet",
    "thakhek",
    "xam-nua",
  ];

  const priceRanges = PRICE_RANGE_OPTIONS;

  // Generate property type options from API data

  const propertyTypeOptions = [
    ...propertyTypes.map((type) => ({
      id: type.id,
      name: type.name,
      icon: <Building2 className="h-4 w-4" />,
    })),
  ];

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
      params.location = selectedLocation;
    }
    if (keyword) params.keyword = keyword;

    updateSearchParams(params);
    message.success("Đang tìm kiếm...");
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
    // For "all" option, clear the input fields
    if (rangeValue === "all") {
      setMinPrice("");
      setMaxPrice("");
    } else {
      // For "under-500" option, show "0" in min price input
      if (rangeValue === "under-500") {
        setMinPrice("0");
        setMaxPrice(maxValue.toString());
      } else {
        setMinPrice(minValue.toString());
        setMaxPrice(maxValue.toString());
      }
    }

    const params: Record<string, string> = {};
    if (minValue !== 0) {
      params.minPrice = minValue.toString();
    } else {
      params.minPrice = "";
    }
    // For "all" option, don't set maxPrice (infinity)
    if (rangeValue !== "all" && maxValue !== 100000000000) {
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
    // If max value is at the maximum, treat it as infinity (no maxPrice parameter)
    if (numValue !== 100000000000) {
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
    if (value[1] !== 1000) {
      params.maxArea = value[1].toString();
    } else {
      params.maxArea = "";
    }

    updateSearchParams(params);
  };

  const handleAreaRangeSelection = (rangeValue: string) => {
    setSelectedAreaRange(rangeValue);

    let minValue = 0;
    let maxValue = 1000;

    switch (rangeValue) {
      case "under-50":
        minValue = 0;
        maxValue = 50;
        break;
      case "50-100":
        minValue = 50;
        maxValue = 100;
        break;
      case "100-200":
        minValue = 100;
        maxValue = 200;
        break;
      case "200-500":
        minValue = 200;
        maxValue = 500;
        break;
      case "500-1000":
        minValue = 500;
        maxValue = 1000;
        break;
      case "over-1000":
        minValue = 1000;
        maxValue = 1000;
        break;
      case "all":
      default:
        minValue = 0;
        maxValue = 1000;
        break;
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
    if (maxValue !== 1000) {
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
      location: provinceName || "",
    });
  };

  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlMinArea = searchParams.get("minArea");
    const urlMaxArea = searchParams.get("maxArea");
    const urlSelectedPropertyTypes =
      searchParams.get("type")?.split(",").filter(Boolean) ?? [];
    const urlSelectedLocation = searchParams.get("location") ?? "all";
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
    const newMaxPrice = parseInt(urlMaxPrice ?? "100000000000");
    setPriceRange([newMinPrice, newMaxPrice]);

    // Update area range
    const newMinArea = parseInt(urlMinArea ?? "0");
    const newMaxArea = parseInt(urlMaxArea ?? "1000");
    setAreaRange([newMinArea, newMaxArea]);

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
    } else if (urlMinAreaNum === 200 && urlMaxAreaNum === 500) {
      newSelectedAreaRange = "200-500";
    } else if (urlMinAreaNum === 500 && urlMaxAreaNum === 1000) {
      newSelectedAreaRange = "500-1000";
    } else if (urlMinAreaNum === 1000 && urlMaxAreaNum === 1000) {
      newSelectedAreaRange = "over-1000";
    } else if (urlMinAreaNum !== 0 || urlMaxAreaNum !== 1000) {
      newSelectedAreaRange = "";
    }
    setSelectedAreaRange(newSelectedAreaRange);

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
    <div className="min-h-screen">
      <div className="sticky top-[80px] right-0 left-0 z-50 container mx-auto px-4 py-4">
        <div className="relative rounded-2xl bg-white shadow-md ring-1 ring-gray-200/50 backdrop-blur-sm">
          {/* Search Form */}
          <div className="p-4 lg:p-6">
            <div className="my-4 flex items-center text-sm">
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
            <div className="relative grid grid-cols-5 gap-4">
              {/* Search Input */}
              <div ref={searchInputRef} className="search-input col-span-2">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    size="large"
                    prefix={<Search className="h-5 w-5 text-gray-400" />}
                    placeholder="Nhập địa điểm, dự án, hoặc từ khóa..."
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
              <div className="col-span-2">
                <Button
                  size="large"
                  ref={locationButtonRef}
                  onClick={handleLocationClick}
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {selectedLocation !== "all"
                        ? selectedLocation
                        : "Tất cả khu vực"}
                    </span>
                  </div>
                  <ChevronRight size={16} className="rotate-90 text-gray-400" />
                </Button>
              </div>

              {/* Search Button */}
              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                className="h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 font-semibold shadow-lg transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
              >
                <Search className="hidden h-4 w-4 lg:block" />
                Tìm kiếm
              </Button>
            </div>

            {/* Filter Row */}
            <div className="mt-4 grid grid-cols-3 items-center gap-3 md:grid-cols-3">
              {/* Property Type Filter */}
              <div className="md:relative">
                <Button
                  onClick={togglePropertyTypeModal}
                  className="filter-dropdown-button flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100">
                      <span className="text-xs">🏠</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Loại BĐS
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      propertyTypeOpen ? "rotate-90" : ""
                    }`}
                  />
                </Button>

                {/* Property Type Dropdown */}
                {propertyTypeOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
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
                      {propertyTypesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Spin size="small" />
                          <span className="ml-2 text-sm text-gray-500">
                            Đang tải loại bất động sản...
                          </span>
                        </div>
                      ) : (
                        propertyTypeOptions.map((type) => (
                          <div
                            key={type.id}
                            className="flex cursor-pointer items-center gap-3 rounded px-2 py-2 hover:bg-gray-50"
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
                            <span className="text-sm text-gray-700">
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
              <div className="md:relative">
                <Button
                  onClick={togglePriceRangeModal}
                  className="filter-dropdown-button flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <span className="text-xs">💰</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Mức giá
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      priceRangeOpen ? "rotate-90" : ""
                    }`}
                  />
                </Button>

                {/* Price Range Dropdown */}
                {priceRangeOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
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
                              Từ:{" "}
                              {minPrice
                                ? numberToString(parseInt(minPrice))
                                : "0"}
                            </Typography.Text>
                            <Input
                              placeholder="Từ"
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
                            <Typography.Text className="mb-1 block text-sm text-gray-600">
                              Đến:{" "}
                              {maxPrice
                                ? numberToString(parseInt(maxPrice))
                                : "∞"}
                            </Typography.Text>
                            <Input
                              placeholder="Đến"
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
                          step={1000000}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value)}`;
                            },
                          }}
                          max={100000000000}
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
                    <span className="text-sm font-medium text-gray-700">
                      Diện tích
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      areaOpen ? "rotate-90" : ""
                    }`}
                  />
                </Button>

                {/* Area Filter Dropdown */}
                {areaOpen && (
                  <div
                    className="filter-dropdown absolute top-full right-0 z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3">
                      <div className="flex items-center justify-between">
                        <Typography.Title level={5} className="mb-0 text-sm">
                          Diện tích
                        </Typography.Title>
                        <Button
                          type="text"
                          icon={<X className="text-gray-600" size={14} />}
                          onClick={() => setAreaOpen(false)}
                          className="flex h-5 w-5 items-center justify-center"
                        />
                      </div>
                    </div>

                    <div className="p-3">
                      {/* Custom Area Range */}
                      <div className="mb-6">
                        <div className="mb-4 flex gap-4">
                          <div className="flex-1">
                            <Typography.Text className="mb-1 block text-sm text-gray-600">
                              Từ: {minArea || "0"}m²
                            </Typography.Text>
                            <Input
                              placeholder="Từ"
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
                              Đến: {maxArea || "∞"}m²
                            </Typography.Text>
                            <Input
                              placeholder="Đến"
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
                          step={5}
                          tooltip={{
                            formatter: (value?: number) => {
                              if (typeof value !== "number") return "";
                              return `${numberToString(value)}`;
                            },
                          }}
                          max={1000}
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
                          {[
                            { value: "under-50", label: "Dưới 50m²" },
                            { value: "50-100", label: "50-100m²" },
                            { value: "100-200", label: "100-200m²" },
                            { value: "200-500", label: "200-500m²" },
                            { value: "500-1000", label: "500-1000m²" },
                            { value: "over-1000", label: "Trên 1000m²" },
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
                        Đặt lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setAreaOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {searchModalOpen && (
            <div
              ref={searchModalRef}
              className="search-popup absolute top-full left-0 z-50 mt-4 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Tìm kiếm thông minh
                    </h3>
                    <p className="text-sm text-gray-600">
                      Khám phá các khu vực phổ biến
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

              <div className="max-h-[60vh] overflow-y-auto">
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Quận huyện
                          </h4>
                          <p className="text-sm text-gray-500">
                            Chọn khu vực tìm kiếm
                          </p>
                        </div>
                      </div>
                      <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
                        {districts.map((district) => (
                          <div
                            key={district.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:bg-white hover:shadow-sm"
                            onClick={() => handleDistrictSelect(district.name)}
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                              <MapPin className="h-3 w-3 text-gray-500" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {district.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Panel - Search Trends */}
                    <div className="lg:col-span-2">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                          <span className="text-sm">🔥</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Xu hướng tìm kiếm
                          </h4>
                          <p className="text-sm text-gray-500">
                            Khu vực được tìm kiếm nhiều nhất
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {districts
                          .sort((a, b) => b.searchCount - a.searchCount)
                          .slice(0, 5)
                          .map((district, index) => (
                            <div
                              key={district.id}
                              className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:shadow-md"
                              onClick={() =>
                                handleDistrictSelect(district.name)
                              }
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white ${
                                    index === 0
                                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                      : index === 1
                                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                        : index === 2
                                          ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                          : "bg-gradient-to-r from-blue-400 to-blue-500"
                                  }`}
                                >
                                  <span className="text-sm">#{index + 1}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">
                                    {district.name}
                                  </span>
                                  <div className="mt-1 flex items-center gap-1">
                                    <div className="h-1 w-16 rounded-full bg-gray-200">
                                      <div
                                        className="h-1 rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                                        style={{
                                          width: `${(district.searchCount / Math.max(...districts.map((d) => d.searchCount))) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-semibold text-red-600">
                                  {district.searchCount.toLocaleString()}
                                </span>
                                <p className="text-xs text-gray-500">
                                  lượt tìm kiếm
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
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
              className="location-popup absolute top-full left-0 z-50 mt-4 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Chọn khu vực tìm kiếm
                    </h3>
                    <p className="text-sm text-gray-600">
                      Bạn muốn tìm bất động sản tại tỉnh thành nào?
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

              <div className="max-h-[60vh] overflow-y-auto">
                <div className="p-6">
                  {/* Popular Cities */}
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                        <span className="text-sm">🔥</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Top tỉnh thành nổi bật
                        </h4>
                        <p className="text-sm text-gray-500">
                          Các khu vực được quan tâm nhiều nhất
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                      {popularCities.map((city) => (
                        <div
                          key={city.id}
                          className={`group relative h-24 overflow-hidden rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                            selectedLocation === city.name
                              ? "ring-2 ring-red-500 ring-offset-2"
                              : "hover:ring-2 hover:ring-red-300"
                          }`}
                          onClick={() => handleProvinceSelect(city.name)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          <div className="absolute right-3 bottom-3 left-3">
                            <span
                              className={`text-sm font-semibold drop-shadow-lg ${
                                selectedLocation === city.name
                                  ? "text-red-800"
                                  : "text-white"
                              }`}
                            >
                              {city.name}
                            </span>
                          </div>
                          {selectedLocation === city.name && (
                            <div className="absolute top-2 right-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                                <CheckCircle className="h-4 w-4" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
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
                          Tất cả tỉnh thành
                        </h4>
                        <p className="text-sm text-gray-500">
                          Chọn từ danh sách đầy đủ
                        </p>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                        {allProvinces.map((province) => (
                          <button
                            key={province}
                            onClick={() => handleProvinceSelect(province)}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 ${
                              selectedLocation === province
                                ? "bg-red-500 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:shadow-sm"
                            }`}
                          >
                            <span className="capitalize">{province}</span>
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
          {/* Enhanced Breadcrumb */}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col justify-center gap-6 lg:flex-row">
          {/* Left Content - Property Listing */}
          <div className="w-full">
            {propertiesLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
              ))
            ) : (
              <>
                {/* Property List */}
                {properties?.data.length === 0 ? (
                  <div className="flex h-[500px] items-center justify-center">
                    <Empty description="Không tìm thấy bất động sản phù hợp" />
                  </div>
                ) : (
                  <div
                    className={`grid grid-cols-1 gap-6 ${
                      layout === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""
                    }`}
                  >
                    {properties?.data.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                    <div className="col-span-full">
                      <Pagination
                        align="center"
                        total={total}
                        pageSize={pageSize}
                        current={currentPage}
                        onChange={(page, pageSize) => {
                          setCurrentPage(page);
                          setPageSize(pageSize);
                        }}
                      />
                    </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
