"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();
  const [searchType, setSearchType] = useState("mua");
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Property search states
  const [keyword, setKeyword] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Background images for carousel
  const backgroundImages = [
    "/images/landingpage/hero-slider/hero-banner-1.jpg",
    "/images/landingpage/hero-slider/hero-banner-2.jpg",
    "/images/landingpage/hero-slider/hero-banner-3.jpg",
    "/images/landingpage/hero-slider/hero-banner-4.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const searchTabs = [
    { id: "mua", label: "Nhà đất bán", icon: "🏠" },
    { id: "thue", label: "Nhà đất cho thuê", icon: "🔑" },
    { id: "du-an", label: "Dự án", icon: "🏗️" },
  ];

  const propertyTypes = [
    { id: "", label: "Tất cả loại BDS" },
    { id: "apartment", label: "Căn hộ/Chung cư" },
    { id: "house", label: "Nhà riêng" },
    { id: "villa", label: "Biệt thự" },
    { id: "townhouse", label: "Nhà phố" },
    { id: "land", label: "Đất nền" },
    { id: "office", label: "Văn phòng" },
    { id: "shop", label: "Cửa hàng/Ki ốt" },
    { id: "warehouse", label: "Nhà kho" },
    { id: "other", label: "Loại khác" },
  ];

  // Handle search
  const handleSearch = async () => {
    const searchData = {
      searchType,
      keyword,
      propertyType,
      minPrice,
      maxPrice,
    };
    console.log("Search data:", searchData);
    router.push('/properties-for-sale');
  };

  const featuredProperties = [
    {
      id: 1,
      title: "Căn hộ cao cấp tại trung tâm Vientiane",
      location: "Vientiane",
      price: "2.5 tỷ LAK",
      area: "85 m²",
      bedrooms: 2,
      bathrooms: 2,
      image: "/images/landingpage/apartment/apart-1.jpg",
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
      image: "/images/landingpage/apartment/apart-2.jpg",
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
      image: "/images/landingpage/apartment/apart-3.jpg",
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
      image: "/images/landingpage/apartment/apart-2.jpg",
      type: "Villa",
      featured: true,
    },
  ];
  const projectData = [
    {
      image: "/images/landingpage/project/project-1.jpg",
      title: "Dự án Vinhomes Smart City Lào",
      description: "Khu đô thị thông minh tại Vientiane",
      price: "Từ 1.2 tỷ LAK",
      status: "🏗️ Đang xây dựng",
      handover: "📅 Bàn giao Q4/2025",
    },
    {
      image: "/images/landingpage/project/project-2.jpg",
      title: "Dự án Eco Green Saigon",
      description: "Căn hộ cao cấp tại Quận 7",
      price: "Từ 2.5 tỷ VND",
      status: "✅ Đã hoàn thành",
      handover: "📅 Bàn giao Q1/2024",
    },
    {
      image: "/images/landingpage/project/project-3.jpg",
      title: "Dự án The Matrix One",
      description: "Vị trí vàng tại Mỹ Đình",
      price: "Từ 3.1 tỷ VND",
      status: "🏗️ Đang xây dựng",
      handover: "📅 Bàn giao Q2/2026",
    },
  ];
  const newsItems = [
    {
      id: 1,
      image: "/images/landingpage/market-news/market-news-1.jpg",
      title: "Thị trường bất động sản Lào tăng trưởng mạnh trong Q3/2025",
      excerpt:
        "Theo báo cáo mới nhất, thị trường BDS Lào đạt mức tăng trưởng 15% so với cùng kỳ năm trước...",
      date: "8 tháng 8, 2025",
      category: "Thị trường",
    },
    {
      id: 2,
      image: "/images/landingpage/market-news/market-news-2.jpg",
      title: "Xu hướng đầu tư BDS tại khu vực Mekong",
      excerpt:
        "Các chuyên gia dự báo khu vực ven sông Mekong sẽ là điểm nóng trong thời gian tới...",
      date: "5 tháng 8, 2025",
      category: "Đầu tư",
    },
    {
      id: 3,
      image: "/images/landingpage/market-news/market-news-3.jpg",
      title: "Chính sách mới về sở hữu BDS cho người nước ngoài",
      excerpt:
        "Chính phủ Lào công bố những điều chỉnh quan trọng trong quy định sở hữu bất động sản...",
      date: "2 tháng 8, 2025",
      category: "Pháp lý",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Carousel and Search */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex">
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

            <div className="rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm bất động sản..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <svg
                      className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
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

                <button 
                  onClick={handleSearch}
                  className="rounded-lg bg-red-500 px-8 py-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-red-600"
                >
                  Tìm kiếm
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="">Loại hình dự án</option>
                  {propertyTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Giá tối thiểu (LAK)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />

                <input
                  type="number"
                  placeholder="Giá tối đa (LAK)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Bất động sản dành cho bạn
            </h2>
            <p className="text-gray-600">
              Khám phá những căn hộ, nhà đất chất lượng tại các khu vực nổi bật
            </p>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                "Tất cả",
                "Căn hộ/Chung cư",
                "Nhà riêng",
                "Đất nền",
                "Biệt thự",
              ].map((filter) => (
                <button
                  key={filter}
                  className="rounded border border-gray-300 px-4 py-2 text-sm transition-colors hover:border-red-500 hover:text-red-500"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="group rounded bg-white shadow transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={400} // bạn nên đặt width thực tế của ảnh
                    height={160} // height thực tế của ảnh
                    className="h-40 w-full rounded-t object-cover"
                  />
                  {property.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white">
                        Nổi bật
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-white">
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-red-500">
                    {property.title}
                  </h3>

                  <div className="mb-2 text-sm font-bold text-red-500">
                    {property.price}
                  </div>

                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {property.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      {property.area}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                          {property.bedrooms} PN
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3"
                            />
                          </svg>
                          {property.bathrooms} WC
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-orange-500">
                      {property.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white">
              Xem thêm
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Dự án bất động sản
            </h2>
            <p className="text-gray-600">Khám phá các dự án đang mở bán</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {projectData.map((project, index) => (
              <div
                key={index}
                className="rounded bg-white shadow transition-shadow hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden rounded-t">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-bold text-gray-900">
                    {project.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {project.description}
                  </p>
                  <div className="mb-2 font-bold text-red-500">
                    {project.price}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{project.status}</span>
                    <span>{project.handover}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white">
              Xem tất cả dự án
            </button>
          </div>
        </div>
      </section>

      <section className="bg-orange-500 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <div className="mb-1 text-2xl font-bold md:text-3xl">
                100,000+
              </div>
              <div className="text-sm text-orange-100">Tin đăng</div>
            </div>
            <div>
              <div className="mb-1 text-2xl font-bold md:text-3xl">5,000+</div>
              <div className="text-sm text-orange-100">Môi giới</div>
            </div>
            <div>
              <div className="mb-1 text-2xl font-bold md:text-3xl">10,000+</div>
              <div className="text-sm text-orange-100">Khách hàng</div>
            </div>
            <div>
              <div className="mb-1 text-2xl font-bold md:text-3xl">500+</div>
              <div className="text-sm text-orange-100">Dự án</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Tin tức thị trường
            </h2>
            <p className="text-gray-600">
              Cập nhật thông tin mới nhất về bất động sản
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {newsItems.map((news) => (
              <article
                key={news.id}
                className="rounded bg-white shadow transition-shadow hover:shadow-md"
              >
                <div className="relative h-32 w-full overflow-hidden rounded-t">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors hover:text-red-500">
                    {news.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 text-xs text-gray-600">
                    {news.excerpt}
                  </p>
                  <Link
                    href={`/news/${news.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Đọc thêm
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="rounded border border-red-500 px-6 py-2 text-red-500 transition-colors hover:bg-red-500 hover:text-white">
              Xem tất cả tin tức
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Tại sao chọn Laos Happy Land?
            </h2>
            <p className="text-gray-600">
              Chúng tôi cam kết mang đến dịch vụ tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold">Tin cậy & Minh bạch</h3>
              <p className="text-sm text-gray-600">
                Thông tin chính xác, pháp lý rõ ràng
              </p>
            </div>

            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold">Nhanh chóng</h3>
              <p className="text-sm text-gray-600">
                Tìm kiếm và đăng tin dễ dàng
              </p>
            </div>

            <div className="p-4 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-bold">Hỗ trợ 24/7</h3>
              <p className="text-sm text-gray-600">
                Đội ngũ tư vấn chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">
            Bạn đang có bất động sản cần bán/cho thuê?
          </h2>
          <p className="mb-6 text-lg text-red-100">
            Đăng tin miễn phí - Tiếp cận hàng triệu khách hàng tiềm năng
          </p>
          <div className="mx-auto flex max-w-md flex-col justify-center gap-3 sm:flex-row">
            <button className="rounded bg-white px-6 py-3 font-medium text-red-500 transition-colors hover:bg-gray-100">
              Đăng tin miễn phí
            </button>
            <button className="rounded border-2 border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white hover:text-red-500">
              Tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
