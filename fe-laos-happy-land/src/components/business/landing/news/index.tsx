"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Tag, Breadcrumb, Input, Select } from "antd";
import {
  Calendar,
  Eye,
  ArrowRight,
  Search as SearchIcon,
  Filter,
} from "lucide-react";

const { Search } = Input;
const { Option } = Select;

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: string;
  views: number;
  tags: string[];
}

const NewsPage = () => {
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    sortBy: "newest",
  });

  const newsData: NewsItem[] = [
    {
      id: "1",
      title: "Thị trường bất động sản Lào tăng trưởng mạnh trong Q3/2025",
      excerpt:
        "Theo báo cáo mới nhất, thị trường BDS Lào đạt mức tăng trưởng 15% so với cùng kỳ năm trước, với sự gia tăng đáng kể trong các dự án đầu tư từ nước ngoài.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-1.jpg",
      category: "Thị trường",
      author: "Nguyễn Văn A",
      publishDate: "8 tháng 8, 2025",
      readTime: "5 phút đọc",
      views: 1250,
      tags: ["BDS Lào", "Thị trường", "Tăng trưởng"],
    },
    {
      id: "2",
      title: "Xu hướng đầu tư BDS tại khu vực Mekong",
      excerpt:
        "Các chuyên gia dự báo khu vực ven sông Mekong sẽ là điểm nóng trong thời gian tới với nhiều dự án lớn được triển khai.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-2.jpg",
      category: "Đầu tư",
      author: "Trần Thị B",
      publishDate: "5 tháng 8, 2025",
      readTime: "7 phút đọc",
      views: 980,
      tags: ["Mekong", "Đầu tư", "Dự án"],
    },
    {
      id: "3",
      title: "Chính sách mới về sở hữu BDS cho người nước ngoài",
      excerpt:
        "Chính phủ Lào công bố những điều chỉnh quan trọng trong quy định sở hữu bất động sản cho công dân nước ngoài.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-3.jpg",
      category: "Pháp lý",
      author: "Lê Văn C",
      publishDate: "2 tháng 8, 2025",
      readTime: "6 phút đọc",
      views: 2100,
      tags: ["Pháp lý", "Nước ngoài", "Sở hữu"],
    },
    {
      id: "4",
      title: "Phân tích giá đất tại Vientiane năm 2025",
      excerpt:
        "Báo cáo chi tiết về xu hướng giá đất tại thủ đô Vientiane với những dự báo quan trọng cho nhà đầu tư.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-1.jpg",
      category: "Phân tích",
      author: "Phạm Thị D",
      publishDate: "1 tháng 8, 2025",
      readTime: "8 phút đọc",
      views: 1750,
      tags: ["Vientiane", "Giá đất", "Phân tích"],
    },
    {
      id: "5",
      title: "Cơ hội đầu tư BDS tại Luang Prabang",
      excerpt:
        "Khám phá tiềm năng đầu tư bất động sản tại thành phố di sản Luang Prabang với những dự án hấp dẫn.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-2.jpg",
      category: "Đầu tư",
      author: "Hoàng Văn E",
      publishDate: "30 tháng 7, 2025",
      readTime: "6 phút đọc",
      views: 1420,
      tags: ["Luang Prabang", "Đầu tư", "Di sản"],
    },
    {
      id: "6",
      title: "Hướng dẫn mua nhà tại Lào cho người Việt",
      excerpt:
        "Tổng hợp những điều cần biết khi mua nhà tại Lào, từ thủ tục pháp lý đến kinh nghiệm thực tế.",
      content: "Nội dung chi tiết của bài viết...",
      image: "/images/landingpage/market-news/market-news-3.jpg",
      category: "Hướng dẫn",
      author: "Vũ Thị F",
      publishDate: "28 tháng 7, 2025",
      readTime: "10 phút đọc",
      views: 3200,
      tags: ["Hướng dẫn", "Mua nhà", "Người Việt"],
    },
  ];

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "Thị trường", label: "Thị trường" },
    { value: "Đầu tư", label: "Đầu tư" },
    { value: "Pháp lý", label: "Pháp lý" },
    { value: "Phân tích", label: "Phân tích" },
    { value: "Hướng dẫn", label: "Hướng dẫn" },
  ];

  const featuredNews = newsData.slice(0, 1)[0];
  const regularNews = newsData.slice(1);

  const breadcrumbItems = [
    {
      title: (
        <Link
          href="/"
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Trang chủ
        </Link>
      ),
    },
    {
      title: "Tin tức",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-4 text-5xl font-bold text-neutral-900">
            Tin tức bất động sản
          </h1>
          <p className="text-xl text-neutral-600">
            Cập nhật thông tin mới nhất về thị trường bất động sản Lào
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="sticky top-[80px] z-50 border-b border-neutral-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <Search
                placeholder="Tìm kiếm tin tức..."
                allowClear
                size="large"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                prefix={<SearchIcon size={16} />}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-4">
              <Select
                value={filters.category}
                onChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
                size="large"
                className="w-40"
                suffixIcon={<Filter size={16} />}
              >
                {categories.map((cat) => (
                  <Option key={cat.value} value={cat.value}>
                    {cat.label}
                  </Option>
                ))}
              </Select>
              <Select
                value={filters.sortBy}
                onChange={(value) => setFilters({ ...filters, sortBy: value })}
                size="large"
                className="w-40"
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="popular">Phổ biến</Option>
                <Option value="views">Lượt xem</Option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured News */}
            {featuredNews && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
                  Tin nổi bật
                </h2>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Tag color="red" className="px-3 py-1 text-sm">
                        {featuredNews.category}
                      </Tag>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="mb-4 text-2xl leading-tight font-bold text-neutral-900">
                      {featuredNews.title}
                    </h3>
                    <p className="mb-6 text-lg leading-relaxed text-neutral-600">
                      {featuredNews.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-neutral-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{featuredNews.publishDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={16} />
                          <span>{featuredNews.views} lượt xem</span>
                        </div>
                        <span>{featuredNews.readTime}</span>
                      </div>
                      <Link href={`/news/${featuredNews.id}`}>
                        <Button
                          type="primary"
                          size="large"
                          icon={<ArrowRight size={16} />}
                          className="font-semibold"
                        >
                          Đọc tiếp
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular News Grid */}
            <div className="mb-6">
              <h2 className="mb-6 text-2xl font-semibold text-neutral-900">
                Tin tức mới nhất
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularNews.map((news) => (
                <div
                  key={news.id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Tag color="blue" className="px-2 py-1 text-xs">
                        {news.category}
                      </Tag>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-tight font-semibold text-neutral-900 transition-colors">
                      {news.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                      {news.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{news.publishDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} />
                          <span>{news.views}</span>
                        </div>
                      </div>
                      <Link href={`/news/${news.id}`}>
                        <Button
                          type="link"
                          size="small"
                          icon={<ArrowRight size={12} />}
                          className="text-primary-500 hover:text-primary-600 p-0 font-semibold"
                        >
                          Đọc
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button type="primary" size="large">
                  1
                </Button>
                <Button size="large">2</Button>
                <Button size="large">3</Button>
                <Button size="large">4</Button>
                <Button size="large">5</Button>
                <span className="px-3 text-neutral-500">...</span>
                <Button size="large">20</Button>
                <Button size="large">→</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Popular Tags */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Tags phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "BDS Lào",
                  "Thị trường",
                  "Đầu tư",
                  "Pháp lý",
                  "Vientiane",
                  "Luang Prabang",
                  "Mua nhà",
                  "Cho thuê",
                ].map((tag) => (
                  <Tag
                    key={tag}
                    className="hover:bg-primary-50 cursor-pointer transition-colors"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>

            {/* Recent News */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Tin gần đây
              </h3>
              <div className="space-y-4">
                {newsData.slice(0, 5).map((news) => (
                  <div key={news.id} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image
                          src={news.image}
                          alt={news.title}
                          width={64}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="group-hover:text-primary-500 line-clamp-2 text-sm leading-tight font-medium text-neutral-900 transition-colors">
                          {news.title}
                        </h4>
                        <p className="mt-1 text-xs text-neutral-500">
                          {news.publishDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Đăng ký nhận tin
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Nhận tin tức mới nhất về bất động sản Lào
                </p>
                <Input placeholder="Email của bạn" size="large" />
                <Button
                  type="primary"
                  block
                  size="large"
                  className="font-semibold"
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
