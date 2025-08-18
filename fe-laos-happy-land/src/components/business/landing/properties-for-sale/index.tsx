"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Filter,
  MapPin,
  Bed,
  Bath,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const locations = [
    { id: "", label: "Tất cả khu vực" },
    { id: "vientiane", label: "Vientiane" },
    { id: "luang-prabang", label: "Luang Prabang" },
    { id: "pakse", label: "Pakse" },
    { id: "savannakhet", label: "Savannakhet" },
    { id: "thakhek", label: "Thakhek" },
    { id: "xam-nua", label: "Xam Nua" },
  ];

  const sortOptions = [
    { id: "newest", label: "Mới nhất" },
    { id: "price-low", label: "Giá thấp nhất" },
    { id: "price-high", label: "Giá cao nhất" },
    { id: "area-large", label: "Diện tích lớn nhất" },
    { id: "area-small", label: "Diện tích nhỏ nhất" },
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

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
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
                />
              </div>
              <div className="relative w-[50%]">
                <Image
                  src="/images/landingpage/apartment/apart-4.jpg"
                  alt="Property image 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-6 pb-6">
          {/* Title */}
          <h3 className="mb-4 cursor-pointer text-base leading-6 font-medium text-gray-900 transition-colors hover:text-red-500">
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="flex-1 min-w-[300px] relative">
              <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Trên toàn quốc"
                  className="bg-transparent flex-1 outline-none text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Tìm kiếm
            </button>

            {/* View Map Button */}
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              Xem bản đồ
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {/* Filter Button */}
            <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:border-gray-400 transition-colors">
              <Filter className="w-4 h-4" />
              Lọc
            </button>

            {/* Property Type Filter */}
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 hover:border-gray-400 transition-colors bg-white">
                <option>Loại nhà đất</option>
                <option>Căn hộ</option>
                <option>Nhà phố</option>
                <option>Villa</option>
                <option>Shophouse</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
            </div>

            {/* Price Filter */}
            <div className="relative">
              <select className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 hover:border-gray-400 transition-colors bg-white">
                <option>Mức giá</option>
                <option>Dưới 1 tỷ</option>
                <option>1 - 3 tỷ</option>
                <option>3 - 5 tỷ</option>
                <option>Trên 5 tỷ</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" />
            </div>

            {/* Verified Filter */}
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="relative">
                  <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">Tin xác thực</span>
              </label>
            </div>

            {/* Broker Filter */}
            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only" />
                <div className="relative">
                  <div className="w-10 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                  <div className="absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform duration-200 ease-in-out"></div>
                </div>
                <span className="ml-2 text-sm text-gray-700">Môi giới chuyên nghiệp</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <span className="cursor-pointer hover:text-red-500">Trang chủ</span>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-gray-900">Nhà đất bán</span>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                Mua bán nhà đất Lào
              </h1>
              <span className="text-gray-500">
                Hiện có{" "}
                <span className="font-semibold text-gray-900">
                  {totalItems.toLocaleString()}
                </span>{" "}
                bất động sản.
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap text-gray-600">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-6">
          <div className="flex w-2/3 gap-8">
            {/* Left Content - Property Listing */}
            <div className="flex-1">
              {/* Property Grid/List */}
              <div className="space-y-6">
                {currentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Show more */}
              <div className="mt-8 text-center">
                <button className="rounded-lg border border-gray-300 bg-white px-8 py-3 font-medium transition-colors hover:bg-gray-50">
                  Xem thêm tin đăng
                </button>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Trước</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border font-medium ${
                            page === currentPage
                              ? "border-red-500 bg-red-500 text-white"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
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

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="hidden sm:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Filters */}
          <div className="hidden w-72 flex-shrink-0 lg:block">
            <div className="sticky top-6 rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                <Filter className="mr-2 h-5 w-5 text-red-500" />
                Lọc kết quả
              </h3>

              {/* Location Filter */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
                  Khu vực
                </h4>
                <div className="space-y-2">
                  {locations.slice(1, 6).map((loc) => (
                    <label key={loc.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {loc.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
                  Mức giá
                </h4>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["< 1 tỷ", "1 - 3 tỷ", "3 - 5 tỷ", "> 5 tỷ"].map((price) => (
                    <button
                      key={price}
                      className="rounded border border-gray-300 px-3 py-2 text-xs transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
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
                    <button
                      key={area}
                      className="rounded border border-gray-300 px-3 py-2 text-xs transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
                  Số phòng ngủ
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {["1 PN", "2 PN", "3 PN", "4+ PN"].map((bedroom) => (
                    <button
                      key={bedroom}
                      className="rounded border border-gray-300 px-3 py-2 text-xs transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                    >
                      {bedroom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Features */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">
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
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {feature}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full rounded-lg bg-red-500 py-3 font-medium text-white transition-colors hover:bg-red-600">
                Áp dụng lọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesForSale;
