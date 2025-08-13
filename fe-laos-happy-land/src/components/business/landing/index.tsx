"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const LandingPage = () => {
  const [searchType, setSearchType] = useState("mua");
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background gradients for carousel as fallback
  const backgroundGradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Blue to purple
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink to red  
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue to cyan
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"  // Green to teal
  ];
  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4); // 4 gradients
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const searchTabs = [
    { id: "mua", label: "Nhà đất bán", icon: "🏠" },
    { id: "thue", label: "Nhà đất cho thuê", icon: "🔑" },
    { id: "du-an", label: "Dự án", icon: "🏗️" },
  ];

  const propertyTypes = [
    { id: "all", label: "Tất cả nhà đất" },
    { id: "can-ho-chung-cu", label: "Căn hộ chung cư" },
    { id: "nha-rieng", label: "Nhà riêng" },
    { id: "nha-biet-thu", label: "Nhà biệt thự, liền kề" },
    { id: "nha-mat-pho", label: "Nhà mặt phố" },
    { id: "shophouse", label: "Shophouse, nhà phố thương mại" },
    { id: "dat-nen", label: "Đất nền dự án" },
    { id: "ban-dat", label: "Bán đất" },
    { id: "trang-trai", label: "Trang trại, khu nghỉ dưỡng" },
    { id: "condotel", label: "Condotel" },
    { id: "kho-nha-xuong", label: "Kho, nhà xưởng" },
    { id: "loai-khac", label: "Loại khác" },
  ];

  const priceRanges = [
    { id: "", label: "Mức giá" },
    { id: "under-500m", label: "Dưới 500 triệu" },
    { id: "500m-800m", label: "500 - 800 triệu" },
    { id: "800m-1b", label: "800 triệu - 1 tỷ" },
    { id: "1b-2b", label: "1 - 2 tỷ" },
    { id: "2b-3b", label: "2 - 3 tỷ" },
    { id: "3b-5b", label: "3 - 5 tỷ" },
    { id: "5b-7b", label: "5 - 7 tỷ" },
    { id: "7b-10b", label: "7 - 10 tỷ" },
    { id: "10b-20b", label: "10 - 20 tỷ" },
    { id: "20b-30b", label: "20 - 30 tỷ" },
    { id: "above-30b", label: "Trên 30 tỷ" },
    { id: "deal", label: "Thỏa thuận" },
  ];

  const featuredProperties = [
    {
      id: 1,
      title: "Căn hộ cao cấp tại trung tâm Vientiane",
      location: "Vientiane",
      price: "2.5 tỷ LAK",
      area: "85 m²",
      bedrooms: 2,
      bathrooms: 2,
      image: "bg-gradient-to-r from-blue-400 to-blue-600",
      type: "Căn hộ",
      featured: true,
    },
    {
      id: 2,
      title: "Nhà phố 3 tầng gần Mekong",
      location: "Luang Prabang",
      price: "1.8 tỷ LAK",
      area: "120 m²",
      bedrooms: 3,
      bathrooms: 3,
      image: "bg-gradient-to-r from-green-400 to-green-600",
      type: "Nhà phố",
      featured: false,
    },
    {
      id: 3,
      title: "Đất thổ cư mặt tiền đường lớn",
      location: "Pakse",
      price: "800 triệu LAK",
      area: "200 m²",
      bedrooms: 0,
      bathrooms: 0,
      image: "bg-gradient-to-r from-yellow-400 to-orange-500",
      type: "Đất",
      featured: true,
    },
    {
      id: 4,
      title: "Villa sang trọng view sông",
      location: "Vientiane",
      price: "5.2 tỷ LAK",
      area: "300 m²",
      bedrooms: 4,
      bathrooms: 4,
      image: "bg-gradient-to-r from-purple-400 to-purple-600",
      type: "Villa",
      featured: true,
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Thị trường bất động sản Lào tăng trưởng mạnh trong Q3/2025",
      excerpt: "Theo báo cáo mới nhất, thị trường BDS Lào đạt mức tăng trưởng 15% so với cùng kỳ năm trước...",
      date: "8 tháng 8, 2025",
      category: "Thị trường",
    },
    {
      id: 2,
      title: "Xu hướng đầu tư BDS tại khu vực Mekong",
      excerpt: "Các chuyên gia dự báo khu vực ven sông Mekong sẽ là điểm nóng trong thời gian tới...",
      date: "5 tháng 8, 2025",
      category: "Đầu tư",
    },
    {
      id: 3,
      title: "Chính sách mới về sở hữu BDS cho người nước ngoài",
      excerpt: "Chính phủ Lào công bố những điều chỉnh quan trọng trong quy định sở hữu bất động sản...",
      date: "2 tháng 8, 2025",
      category: "Pháp lý",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel Background */}
      <section className="relative h-96 overflow-hidden">
        {/* Carousel Background */}
        <div className="absolute inset-0">
          {backgroundGradients.map((gradient, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: gradient,
              }}
            />
          ))}
          {/* Dark overlay */}
        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {backgroundGradients.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Search Form Container - Positioned over carousel */}
        <div className="relative z-10 container mx-auto px-4 pt-12">
          <div className="max-w-5xl mx-auto">
            {/* Search Tabs */}
            <div className="flex mb-6">
              {searchTabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchType(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-all ${
                    searchType === tab.id
                      ? "bg-white text-black"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  } ${index === 0 ? "rounded-l-lg" : ""} ${index === searchTabs.length - 1 ? "rounded-r-lg" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              {/* Search Input Row */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Trên toàn quốc"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 pl-10"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg text-sm transition-colors whitespace-nowrap">
                  Tìm kiếm
                </button>
              </div>

              {/* Dropdown Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                >
                  <option value="">Loại hình dự án</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                >
                  <option value="">Mức giá</option>
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                >
                  <option value="">Trạng thái</option>
                  <option value="sap-mo-ban">Sắp mở bán</option>
                  <option value="dang-mo-ban">Đang mở bán</option>
                  <option value="sap-ban-giao">Sắp bàn giao</option>
                  <option value="da-ban-giao">Đã bàn giao</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bất động sản dành cho bạn
            </h2>
            <p className="text-gray-600">
              Khám phá những căn hộ, nhà đất chất lượng tại các khu vực nổi bật
            </p>
          </div>

          {/* Property Filter Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {["Tất cả", "Căn hộ/Chung cư", "Nhà riêng", "Đất nền", "Biệt thự"].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProperties.map((property) => (
              <div key={property.id} className="bg-white rounded shadow hover:shadow-md transition-shadow group">
                <div className="relative">
                  <div className={`h-40 ${property.image} rounded-t`}></div>
                  {property.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Nổi bật
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 group-hover:text-red-500 transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="text-red-500 font-bold mb-2 text-sm">
                    {property.price}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      {property.area}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {property.bedrooms} PN
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3" />
                          </svg>
                          {property.bathrooms} WC
                        </span>
                      )}
                    </div>
                    <span className="text-orange-500 font-medium">{property.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dự án bất động sản
            </h2>
            <p className="text-gray-600">
              Khám phá các dự án đang mở bán
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((project) => (
              <div key={project} className="bg-white rounded shadow hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-t"></div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Dự án Vinhomes Smart City Lào
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Khu đô thị thông minh tại Vientiane
                  </p>
                  <div className="text-red-500 font-bold mb-2">
                    Từ 1.2 tỷ LAK
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>🏗️ Đang xây dựng</span>
                    <span>📅 Bàn giao Q4/2025</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
              Xem tất cả dự án
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-8 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">100,000+</div>
              <div className="text-orange-100 text-sm">Tin đăng</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">5,000+</div>
              <div className="text-orange-100 text-sm">Môi giới</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">10,000+</div>
              <div className="text-orange-100 text-sm">Khách hàng</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold mb-1">500+</div>
              <div className="text-orange-100 text-sm">Dự án</div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tin tức thị trường
            </h2>
            <p className="text-gray-600">
              Cập nhật thông tin mới nhất về bất động sản
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {newsItems.map((news) => (
              <article key={news.id} className="bg-white rounded shadow hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-t"></div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                      {news.category}
                    </span>
                    <span className="text-gray-500 text-xs">{news.date}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 hover:text-red-500 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                    {news.excerpt}
                  </p>
                  <Link
                    href={`/news/${news.id}`}
                    className="text-red-500 hover:text-red-700 font-medium text-xs flex items-center gap-1"
                  >
                    Đọc thêm
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
              Xem tất cả tin tức
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tại sao chọn Laos Happy Land?
            </h2>
            <p className="text-gray-600">
              Chúng tôi cam kết mang đến dịch vụ tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Tin cậy & Minh bạch</h3>
              <p className="text-gray-600 text-sm">
                Thông tin chính xác, pháp lý rõ ràng
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Nhanh chóng</h3>
              <p className="text-gray-600 text-sm">
                Tìm kiếm và đăng tin dễ dàng
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600 text-sm">
                Đội ngũ tư vấn chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Bạn đang có bất động sản cần bán/cho thuê?
          </h2>
          <p className="text-lg text-red-100 mb-6">
            Đăng tin miễn phí - Tiếp cận hàng triệu khách hàng tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button className="bg-white text-red-500 hover:bg-gray-100 font-medium py-3 px-6 rounded transition-colors">
              Đăng tin miễn phí
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-red-500 font-medium py-3 px-6 rounded transition-colors">
              Tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
