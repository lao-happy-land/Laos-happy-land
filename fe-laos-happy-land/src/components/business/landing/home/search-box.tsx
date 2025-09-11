"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useClickAway, useEventListener } from "ahooks";
import {
  Carousel,
  Tabs,
  Row,
  Col,
  Button,
  Card,
  Space,
  Typography,
  App,
  Input,
  Radio,
  Slider,
  Checkbox,
} from "antd";
import {
  Home,
  Building2,
  Construction,
  Flame,
  Globe2,
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
import {
  AREA_RANGE_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from "@/share/constant/home-search";

const { Title, Text } = Typography;

const SearchBox = () => {
  const { message } = App.useApp();
  const router = useRouter();
  const [searchType, setSearchType] = useState("sale");

  // Property search states
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // State for filter dropdowns
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);

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
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000000,
  ]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 1000]);
  const [selectedAreaRange, setSelectedAreaRange] = useState<string>("all");

  useClickAway(() => {
    setShowLocationPopup(false);
  }, [locationPopupRef, locationSelectorRef]);

  useClickAway(() => {
    setPropertyTypeOpen(false);
  }, [propertyTypeDropdownRef, propertyTypeButtonRef]);

  useClickAway(() => {
    setPriceRangeOpen(false);
  }, [priceRangeDropdownRef, priceRangeButtonRef]);

  useClickAway(() => {
    setAreaOpen(false);
  }, [areaDropdownRef, areaButtonRef]);

  useClickAway(() => {
    setShowLocationPopup(false);
    setPropertyTypeOpen(false);
    setPriceRangeOpen(false);
    setAreaOpen(false);
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
      setShowLocationPopup(false);
      setPropertyTypeOpen(false);
      setPriceRangeOpen(false);
      setAreaOpen(false);
    },
    { target: typeof window !== "undefined" ? document : undefined },
  );

  // Background images for carousel
  const backgroundImages = [
    "/images/landingpage/hero-slider/hero-banner-1.jpg",
    "/images/landingpage/hero-slider/hero-banner-2.jpg",
    "/images/landingpage/hero-slider/hero-banner-3.jpg",
    "/images/landingpage/hero-slider/hero-banner-4.jpg",
  ];

  const popularCities = [
    {
      id: "vientiane",
      name: "Vientiane",
      image: "/images/landingpage/cities/vientiane.jpg",
    },
    {
      id: "luang-prabang",
      name: "Luang Prabang",
      image: "/images/landingpage/cities/luang-prabang.jpg",
    },
    {
      id: "savannakhet",
      name: "Savannakhet",
      image: "/images/landingpage/cities/savannakhet.jpg",
    },
    {
      id: "pakse",
      name: "Pakse",
      image: "/images/landingpage/cities/pakse.jpg",
    },
    {
      id: "vang-vieng",
      name: "Vang Vieng",
      image: "/images/landingpage/cities/vang-vieng.jpg",
    },
    {
      id: "thakhek",
      name: "Thakhek",
      image: "/images/landingpage/cities/thakhek.jpg",
    },
  ];

  const allLocations = [
    "all",
    "thakhek",
    "vientiane",
    "luang-prabang",
    "savannakhet",
    "pakse",
    "vang-vieng",
  ];

  const searchTabs = [
    {
      id: "sale",
      label: "Nhà đất bán",
      icon: <Home size={16} />,
    },
    {
      id: "rent",
      label: "Nhà đất cho thuê",
      icon: <Building2 size={16} />,
    },
    {
      id: "project",
      label: "Dự án",
      icon: <Construction size={16} />,
    },
  ];

  const propertyTypeOptions = [
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

  const priceRanges = PRICE_RANGE_OPTIONS;

  const areaRanges = AREA_RANGE_OPTIONS;

  const handleSearch = async () => {
    const searchParams = new URLSearchParams();
    if (priceRange[0] === 0 && priceRange[1] === 100000000000) {
      searchParams.delete("minPrice");
      searchParams.delete("maxPrice");
    } else {
      searchParams.set("minPrice", priceRange[0].toString());
      searchParams.set("maxPrice", priceRange[1].toString());
    }
    if (areaRange[0] === 0 && areaRange[1] === 1000) {
      searchParams.delete("minArea");
      searchParams.delete("maxArea");
    } else {
      searchParams.set("minArea", areaRange[0].toString());
      searchParams.set("maxArea", areaRange[1].toString());
    }
    if (selectedPropertyTypes.length > 0) {
      searchParams.set(
        "selectedPropertyTypes",
        selectedPropertyTypes.join(","),
      );
    }
    if (selectedLocation) {
      searchParams.set("selectedLocation", selectedLocation);
    } else {
      searchParams.delete("selectedLocation");
    }
    if (keyword) {
      searchParams.set("keyword", keyword);
    } else {
      searchParams.delete("keyword");
    }
    if (searchType === "sale") {
      router.push(`/properties-for-sale?${searchParams.toString()}`);
    } else if (searchType === "rent") {
      router.push(`/properties-for-rent?${searchParams.toString()}`);
    } else if (searchType === "project") {
      router.push(`/properties-for-project?${searchParams.toString()}`);
    }
    message.success("Đang tìm kiếm...");
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPopup(false);
  };

  const getLocationDisplayName = () => {
    if (!selectedLocation) return "Trên toàn quốc";
    const popularCity = popularCities.find(
      (city) => city.id === selectedLocation,
    );
    return popularCity ? popularCity.name : selectedLocation;
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
    const numValue = value || 1000;
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
      case "200-300":
        minValue = 200;
        maxValue = 300;
        break;
      case "300-500":
        minValue = 300;
        maxValue = 500;
        break;
      case "over-500":
        minValue = 500;
        maxValue = 1000;
        break;
      case "all":
      default:
        minValue = 0;
        maxValue = 1000;
        break;
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
          {backgroundImages.map((image, index) => (
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
        <div className="mx-auto max-w-6xl">
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
          <div className="shadow-3xl relative rounded-2xl rounded-t-none bg-white p-4 sm:rounded-3xl sm:rounded-t-none md:p-6">
            <div className="relative mb-2 flex w-full flex-col items-stretch overflow-hidden rounded-xl border-2 border-gray-200 bg-white transition-all duration-300 focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-100 hover:border-red-300 hover:shadow-lg sm:flex-row sm:items-center sm:rounded-2xl">
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
                      ? getLocationDisplayName()
                      : "Trên toàn quốc"}
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
                    placeholder="Nhập tối đa 5 địa điểm, dự án..."
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
                  <span className="hidden sm:inline">Tìm kiếm</span>
                  <span className="sm:hidden">Tìm</span>
                </Button>
              </div>
            </div>
            {showLocationPopup && (
              <div
                ref={locationPopupRef}
                className="location-popup absolute z-50 h-[60vh] w-[calc(100%-2rem)] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl sm:h-[50vh] sm:w-[calc(100%-3rem)] sm:rounded-2xl"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-4 flex items-center justify-between sm:mb-6">
                    <div>
                      <Title level={4} className="mb-1 text-base sm:text-lg">
                        Chọn khu vực tìm kiếm
                      </Title>
                      <Text type="secondary" className="text-xs sm:text-sm">
                        Bạn muốn tìm bất động sản tại tỉnh thành nào?
                      </Text>
                    </div>
                    <Button
                      type="text"
                      icon={<X className="h-4 w-4 sm:h-5 sm:w-5" />}
                      onClick={() => setShowLocationPopup(false)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 sm:h-8 sm:w-8"
                    />
                  </div>

                  {/* Popular Cities */}
                  <div className="mb-6 sm:mb-8">
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <Flame className="h-4 w-4 text-red-500 sm:h-5 sm:w-5" />
                      <Text strong className="text-sm sm:text-base">
                        Top tỉnh thành nổi bật
                      </Text>
                    </div>
                    <Row gutter={[8, 8]}>
                      {popularCities.map((city) => (
                        <Col span={12} sm={8} md={6} lg={4} key={city.id}>
                          <Card
                            hoverable
                            onClick={() => handleLocationSelect(city.name)}
                            className={`group relative h-20 overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg sm:h-24 sm:rounded-xl ${
                              selectedLocation === city.name
                                ? "bg-red-50 ring-2 ring-red-500 ring-offset-2"
                                : "hover:ring-2 hover:ring-red-300"
                            }`}
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
                              <Text
                                strong
                                className={`text-sm drop-shadow-lg ${
                                  selectedLocation === city.name
                                    ? "text-red-800"
                                    : "text-white"
                                }`}
                              >
                                {city.name}
                              </Text>
                            </div>
                            {selectedLocation === city.name && (
                              <div className="absolute top-2 right-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                                  <CheckCircle
                                    className="text-white"
                                    size={16}
                                  />
                                </div>
                              </div>
                            )}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* All Locations */}
                  <div>
                    <div className="mb-3 flex items-center gap-2 sm:mb-4">
                      <Globe2 className="h-4 w-4 text-gray-500 sm:h-5 sm:w-5" />
                      <Text strong className="text-sm sm:text-base">
                        Tất cả tỉnh thành
                      </Text>
                    </div>
                    <Row gutter={[8, 8]}>
                      {allLocations.map((location) => (
                        <Col span={12} sm={8} md={6} lg={4} key={location}>
                          <Button
                            type={
                              selectedLocation === location
                                ? "primary"
                                : "default"
                            }
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full rounded-lg px-2 py-2 text-left text-xs font-medium transition-all duration-200 sm:px-3 sm:text-sm ${
                              selectedLocation === location
                                ? "border-red-500 bg-red-500 text-white shadow-md"
                                : "text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                            }`}
                          >
                            <label className="capitalize">{location}</label>
                            {selectedLocation === location && (
                              <CheckCircle className="text-white" size={14} />
                            )}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Dropdowns */}
            <div className="relative mt-4 grid w-full grid-cols-3 gap-4">
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
                    Loại BĐS
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      propertyTypeOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Property Type Dropdown */}
                {propertyTypeOpen && (
                  <div
                    ref={propertyTypeDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          Loại nhà đất
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
                      {propertyTypeOptions.map((type) => (
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

                    <div className="flex justify-between border-t border-gray-100 p-3 sm:p-4">
                      <Button
                        type="text"
                        onClick={() => setSelectedPropertyTypes([])}
                        className="text-sm text-gray-500 hover:text-red-500 sm:text-base"
                      >
                        Đặt lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPropertyTypeOpen(false)}
                        className="border-0 bg-red-500 text-sm hover:bg-red-600 sm:text-base"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                )}
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
                      ? "Mức giá"
                      : `${numberToString(priceRange[0])} - ${numberToString(priceRange[1])}`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      priceRangeOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Price Range Dropdown */}
                {priceRangeOpen && (
                  <div
                    ref={priceRangeDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          Mức giá
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
                            <Text className="mb-1 block text-sm text-gray-600">
                              Từ: {numberToString(priceRange[0])}
                            </Text>
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
                            <Text className="mb-1 block text-sm text-gray-600">
                              Đến: {numberToString(priceRange[1])}
                            </Text>
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

                    <div className="flex justify-between border-t border-gray-100 p-4">
                      <Button
                        type="text"
                        onClick={() => {
                          handlePriceRangeSelection("all");
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        Đặt lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setPriceRangeOpen(false)}
                        className="border-0 bg-red-500 hover:bg-red-600"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                )}
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
                      ? "Diện tích"
                      : `${numberToString(areaRange[0])} - ${numberToString(areaRange[1])}`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      areaOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Area Dropdown */}
                {areaOpen && (
                  <div
                    ref={areaDropdownRef}
                    className="filter-dropdown absolute top-full left-0 z-50 mt-3 w-full rounded-xl border border-gray-200 bg-white shadow-2xl sm:rounded-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-gray-100 p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <Title level={5} className="mb-0 text-sm sm:text-base">
                          Diện tích
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
                              Diện tích nhỏ nhất
                            </Text>
                            <Input
                              placeholder="Từ"
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
                              Diện tích lớn nhất
                            </Text>
                            <Input
                              placeholder="Đến"
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
                        Đặt lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => setAreaOpen(false)}
                        className="border-0 bg-red-500 hover:bg-red-600"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBox;
