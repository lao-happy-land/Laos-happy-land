"use client";

import { useState, useEffect, useRef } from "react";
import { useClickAway, useEventListener } from "ahooks";
import Image from "next/image";
import {
  Filter,
  MapPin,
  Bed,
  Bath,
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
  Grid,
  List,
  DollarSign,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { numberToString } from "@/share/helper/number-to-string";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Typography,
  message,
  Slider,
  Radio,
  Switch,
} from "antd";
import { PRICE_RANGE_OPTIONS } from "@/share/constant/home-search";

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  image: string;
  type: string;
  featured: boolean;
  direction: string;
  posted: string;
  contact: string;
}

const PropertiesForSale = () => {
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [minArea, setMinArea] = useState(searchParams.get("minArea") ?? "");
  const [maxArea, setMaxArea] = useState(searchParams.get("maxArea") ?? "");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    searchParams.get("selectedPropertyTypes")?.split(",") ?? [],
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("selectedLocation") ?? "",
  );
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Price range slider state
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(minPrice) || 0,
    parseInt(maxPrice) || 100000000000,
  ]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");

  const [priceRangeOpen, setPriceRangeOpen] = useState(false);
  const [propertyTypeOpen, setPropertyTypeOpen] = useState(false);
  const [verifiedOpen, setVerifiedOpen] = useState(false);
  const [brokerOpen, setBrokerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Refs for modals
  const searchModalRef = useRef<HTMLDivElement>(null);
  const locationModalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const locationButtonRef = useRef<HTMLButtonElement>(null);

  // Click away to close modals
  useClickAway(() => {
    setSearchModalOpen(false);
  }, [searchModalRef, searchInputRef]);

  useClickAway(() => {
    setLocationModalOpen(false);
  }, [locationModalRef, locationButtonRef]);

  // Click away to close all modals when clicking outside
  useClickAway(() => {
    setSearchModalOpen(false);
    setLocationModalOpen(false);
    setPriceRangeOpen(false);
    setPropertyTypeOpen(false);
  }, [searchModalRef, locationModalRef, searchInputRef, locationButtonRef]);

  // Scroll outside to close modals
  useEventListener(
    "scroll",
    () => {
      // Close all modals when scrolling anywhere
      setSearchModalOpen(false);
      setLocationModalOpen(false);
      setPriceRangeOpen(false);
      setPropertyTypeOpen(false);
    },
    { target: document },
  );

  // Legacy useEffect for filter dropdowns (keeping for compatibility)
  useEffect(() => {
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

  // Districts data for Tây Ninh
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

  // Popular cities for location modal
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

  // All provinces/cities
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

  // Mock data cho properties
  const mockProperties: Property[] = [
    {
      id: 1,
      title:
        "Tháng 8 trực tiếp CĐT quỹ căn VIP view hồ The Nelson Ba Định full nội thất nhận nhà ngay giá tốt",
      location: "Ba Đình, Hà Nội",
      price: "11,7 tỷ",
      area: "87,4 m²",
      bedrooms: 2,
      bathrooms: 2,
      floor: "Tầng 15",
      image: "/images/landingpage/apartment/apart-1.jpg",
      type: "Căn hộ",
      featured: true,
      direction: "Đông Nam",
      posted: "Đăng hôm nay",
      contact: "Chính chủ",
    },
    {
      id: 2,
      title:
        "Bán căn hộ The Matrix One 3PN 2WC view đẹp tầng cao full nội thất cao cấp",
      location: "Mỹ Đình, Nam Từ Liêm, Hà Nội",
      price: "4.2 tỷ",
      area: "98 m²",
      bedrooms: 3,
      bathrooms: 2,
      floor: "Tầng 18",
      image: "/images/landingpage/apartment/apart-2.jpg",
      type: "Căn hộ",
      featured: true,
      direction: "Nam",
      posted: "Đăng hôm nay",
      contact: "Chính chủ",
    },
    {
      id: 3,
      title:
        "Shophouse mặt tiền đường lớn khu vực kinh doanh sầm uất giá đầu tư",
      location: "Quận 7, TP Hồ Chí Minh",
      price: "12.8 tỷ",
      area: "150 m²",
      bedrooms: 4,
      bathrooms: 3,
      floor: "4 tầng",
      image: "/images/landingpage/apartment/apart-3.jpg",
      type: "Shophouse",
      featured: false,
      direction: "Đông",
      posted: "Đăng hôm nay",
      contact: "Môi giới",
    },
    {
      id: 4,
      title:
        "Villa biệt thự song lập view công viên hồ điều hòa thiết kế hiện đại sang trọng",
      location: "Ecopark, Văn Giang, Hưng Yên",
      price: "8.5 tỷ",
      area: "280 m²",
      bedrooms: 5,
      bathrooms: 4,
      floor: "3 tầng + tum",
      image: "/images/landingpage/apartment/apart-4.jpg",
      type: "Villa",
      featured: true,
      direction: "Tây Nam",
      posted: "Đăng hôm nay",
      contact: "Chính chủ",
    },
    {
      id: 5,
      title:
        "Căn hộ Goldmark City 2PN 2WC đầy đủ nội thất cao cấp sổ đỏ chính chủ",
      location: "Goldmark City, Cầu Giấy, Hà Nội",
      price: "3.1 tỷ",
      area: "68 m²",
      bedrooms: 2,
      bathrooms: 2,
      floor: "Tầng 20",
      image: "/images/landingpage/apartment/apart-1.jpg",
      type: "Căn hộ",
      featured: false,
      direction: "Tây Nam",
      posted: "Đăng hôm nay",
      contact: "Chính chủ",
    },
    {
      id: 6,
      title: "Nhà phố mặt tiền Hoàng Quốc Việt 4 tầng 1 tum kinh doanh đắc địa",
      location: "Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
      price: "16.5 tỷ",
      area: "75 m²",
      bedrooms: 4,
      bathrooms: 5,
      floor: "4 tầng + tum",
      image: "/images/landingpage/apartment/apart-2.jpg",
      type: "Nhà phố",
      featured: true,
      direction: "Đông Bắc",
      posted: "Đăng hôm nay",
      contact: "Chính chủ",
    },
  ];

  // Tính toán pagination
  const totalItems = mockProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = mockProperties.slice(startIndex, endIndex);

  // Function to handle search
  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    if (minPrice) searchParams.set("minPrice", minPrice);
    if (maxPrice) searchParams.set("maxPrice", maxPrice);
    if (minArea) searchParams.set("minArea", minArea);
    if (maxArea) searchParams.set("maxArea", maxArea);
    if (selectedPropertyTypes.length > 0) {
      searchParams.set(
        "selectedPropertyTypes",
        selectedPropertyTypes.join(","),
      );
    }
    if (selectedLocation)
      searchParams.set("selectedLocation", selectedLocation);
    if (keyword) searchParams.set("keyword", keyword);

    // Update URL with search parameters
    // const newUrl = `/properties-for-sale?${searchParams.toString()}`;
    // window.history.pushState({}, "", newUrl);
    message.success("Đang tìm kiếm...");
  };

  // Function to handle property type selection
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
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    setSelectedPriceRange("");
    setMinPrice(value[0].toString());
    setMaxPrice(value[1].toString());
  };

  const handleMinPriceInputChange = (value: number) => {
    const numValue = value || 0;
    setPriceRange([numValue, priceRange[1]]);
    setSelectedPriceRange("");
    setMinPrice(numValue.toString());
  };

  const handleMaxPriceInputChange = (value: number) => {
    const numValue = value || 100000000000;
    setPriceRange([priceRange[0], numValue]);
    setSelectedPriceRange("");
    setMaxPrice(numValue.toString());
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
    setVerifiedOpen(!verifiedOpen);
  };

  const toggleBrokerModal = () => {
    setBrokerOpen(!brokerOpen);
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
  };

  const handleProvinceSelect = (provinceName: string) => {
    setSelectedLocation(provinceName);
    setLocationModalOpen(false);
  };

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

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-xl">
      <div className="flex flex-col">
        {/* Images Section */}
        <div className="flex w-full">
          {/* Main Image - 7/10 width */}
          <div className="relative h-[280px] w-[70%] flex-shrink-0">
            <Image
              src={property.image}
              alt={property.title}
              fill
              className="object-cover"
            />

            {/* VIP Kim Cương Badge */}
            {property.featured && (
              <div className="absolute top-3 left-3">
                <span className="rounded bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  VIP KIM CƯƠNG
                </span>
              </div>
            )}

            {/* Image count */}
            <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
              <span>📷</span>
              <span>20</span>
            </div>
          </div>

          {/* Right Side Images - 3/10 width */}
          <div className="flex h-[280px] w-[30%] flex-col">
            {/* Top Image - Full Width */}
            <div className="relative h-[140px]">
              <Image
                src="/images/landingpage/apartment/apart-2.jpg"
                alt="Property image 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
              />
            </div>

            {/* Bottom Images - Split Width */}
            <div className="flex h-[140px]">
              <div className="relative w-[50%]">
                <Image
                  src="/images/landingpage/apartment/apart-3.jpg"
                  alt="Property image 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
              <div className="relative w-[50%]">
                <Image
                  src="/images/landingpage/apartment/apart-4.jpg"
                  alt="Property image 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h3 className="mb-4 cursor-pointer text-base leading-6 font-medium text-gray-900 transition-colors group-hover:text-red-500">
            {property.title.toUpperCase()}
          </h3>

          {/* Price and Details Row */}
          <div className="mb-4 flex items-center gap-6">
            <span className="text-xl font-bold text-red-600">
              {property.price}
            </span>
            <span className="text-xl font-bold text-red-600">
              {property.area}
            </span>
            <span className="text-gray-600">133,87 tr/m²</span>
            <div className="flex items-center gap-4 text-gray-600">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <span>{property.direction}</span>
            </div>
          </div>

          {/* Description */}
          <p className="mb-4 text-sm leading-relaxed text-gray-700">
            * Tháng 8 phòng kinh doanh chủ đầu tư mở bán trực tiếp quỹ căn ngoại
            giao, quỹ căn view hồ đẹp nhất dự án The Nelson 29 Láng Hạ, Ba Đình.
            * Hotline: 0985 009 *** (Phòng kinh doanh - Phan Tuấn).- Quỹ căn
            tầng đẹp chỉ còn lại duy nhất trong tháng 8. * Địa...
          </p>

          {/* Location */}
          <div className="mb-6 flex items-start text-sm text-gray-600">
            <MapPin className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
            <span>{property.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Phòng Kinh Doanh CĐT: Phan Tuấn
                </div>
                <div className="text-xs text-gray-500">Đăng hôm nay</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded bg-teal-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600">
                📞 0985 009 *** - Hiển số
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 transition-colors hover:bg-gray-50">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
                      onClick={() => setSelectedPropertyTypes([])}
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
            <Button type="default" onClick={toggleVerifiedModal}>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Tin xác thực</span>
              <Switch checked={verifiedOpen} />
            </Button>

            {/* Broker Filter */}
            <Button type="default" onClick={toggleBrokerModal}>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">
                Môi giới chuyên nghiệp
              </span>
              <Switch checked={brokerOpen} />
            </Button>
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

            {/* Enhanced Results Header */}
            <div className="mb-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Mua bán nhà đất Lào
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>Hiện có</span>
                    <span className="text-lg font-bold text-red-500">
                      {totalItems.toString()}
                    </span>
                    <span>bất động sản</span>
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
            <div className="space-y-6">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

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
            {totalPages > 1 && (
              <div className="mt-12">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Hiển thị{" "}
                    <span className="font-medium text-gray-900">
                      {startIndex + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium text-gray-900">
                      {Math.min(endIndex, totalItems)}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-medium text-gray-900">
                      {totalItems}
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
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
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
                      })}
                    </div>

                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
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
            <div className="rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center text-lg font-bold text-gray-900">
                  <Filter className="mr-3 h-5 w-5 text-red-500" />
                  Bộ lọc
                </h3>
                <Button
                  type="text"
                  size="small"
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
