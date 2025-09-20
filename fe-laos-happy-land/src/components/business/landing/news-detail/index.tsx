"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Tag, Breadcrumb } from "antd";
import {
  Calendar,
  Eye,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
} from "lucide-react";

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

const NewsDetailPage = () => {
  // Mock data - in real app, this would come from API based on the ID from URL params
  const newsData: NewsItem = {
    id: "1",
    title: "Thị trường bất động sản Lào tăng trưởng mạnh trong Q3/2025",
    excerpt:
      "Theo báo cáo mới nhất, thị trường BDS Lào đạt mức tăng trưởng 15% so với cùng kỳ năm trước, với sự gia tăng đáng kể trong các dự án đầu tư từ nước ngoài.",
    content: `
      <p>Thị trường bất động sản Lào đang trải qua một giai đoạn tăng trưởng mạnh mẽ trong quý 3 năm 2025, với nhiều chỉ số tích cực được ghi nhận từ các báo cáo chính thức.</p>
      
      <h3>Tăng trưởng ấn tượng</h3>
      <p>Theo số liệu từ Bộ Kế hoạch và Đầu tư Lào, tổng giá trị giao dịch bất động sản trong quý 3/2025 đạt 2.5 tỷ USD, tăng 15% so với cùng kỳ năm trước. Đây là mức tăng trưởng cao nhất trong 3 năm qua.</p>
      
      <p>Các khu vực có mức tăng trưởng mạnh nhất bao gồm:</p>
      <ul>
        <li>Vientiane: +18%</li>
        <li>Luang Prabang: +22%</li>
        <li>Pakse: +12%</li>
        <li>Savannakhet: +15%</li>
      </ul>
      
      <h3>Đầu tư nước ngoài tăng mạnh</h3>
      <p>Đầu tư từ nước ngoài vào lĩnh vực bất động sản Lào đạt mức kỷ lục với 850 triệu USD trong quý 3, chủ yếu từ các nhà đầu tư Trung Quốc, Thái Lan và Việt Nam.</p>
      
      <p>Các dự án lớn được triển khai bao gồm:</p>
      <ul>
        <li>Khu đô thị mới tại Vientiane với tổng vốn đầu tư 300 triệu USD</li>
        <li>Dự án resort cao cấp tại Luang Prabang trị giá 200 triệu USD</li>
        <li>Khu công nghiệp tại Savannakhet với vốn đầu tư 150 triệu USD</li>
      </ul>
      
      <h3>Triển vọng tương lai</h3>
      <p>Các chuyên gia dự báo thị trường bất động sản Lào sẽ tiếp tục tăng trưởng mạnh trong các quý tiếp theo, nhờ vào:</p>
      <ul>
        <li>Chính sách mở cửa của chính phủ</li>
        <li>Hạ tầng giao thông được cải thiện</li>
        <li>Nhu cầu nhà ở tăng cao từ tầng lớp trung lưu</li>
        <li>Du lịch phát triển mạnh</li>
      </ul>
      
      <p>Tuy nhiên, các nhà đầu tư cần lưu ý về các rủi ro tiềm ẩn như biến động chính trị và thay đổi chính sách pháp lý.</p>
    `,
    image: "/images/landingpage/market-news/market-news-1.jpg",
    category: "Thị trường",
    author: "Nguyễn Văn A",
    publishDate: "8 tháng 8, 2025",
    readTime: "5 phút đọc",
    views: 1250,
    tags: ["BDS Lào", "Thị trường", "Tăng trưởng"],
  };

  const relatedNews: NewsItem[] = [
    {
      id: "2",
      title: "Xu hướng đầu tư BDS tại khu vực Mekong",
      excerpt:
        "Các chuyên gia dự báo khu vực ven sông Mekong sẽ là điểm nóng trong thời gian tới với nhiều dự án lớn được triển khai.",
      content: "",
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
      content: "",
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
      content: "",
      image: "/images/landingpage/market-news/market-news-1.jpg",
      category: "Phân tích",
      author: "Phạm Thị D",
      publishDate: "1 tháng 8, 2025",
      readTime: "8 phút đọc",
      views: 1750,
      tags: ["Vientiane", "Giá đất", "Phân tích"],
    },
  ];

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
      title: (
        <Link
          href="/news"
          className="hover:text-primary-500 text-neutral-600 transition-colors"
        >
          Tin tức
        </Link>
      ),
    },
    {
      title: newsData.title,
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
              {/* Article Header */}
              <div className="p-8">
                <div className="mb-6">
                  <Tag color="red" className="mb-4 px-3 py-1 text-sm">
                    {newsData.category}
                  </Tag>
                  <h1 className="mb-6 text-4xl leading-tight font-bold text-neutral-900">
                    {newsData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{newsData.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{newsData.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye size={16} />
                      <span>{newsData.views} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{newsData.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Article Image */}
                <div className="relative mb-8 h-96 w-full overflow-hidden rounded-xl">
                  <Image
                    src={newsData.image}
                    alt={newsData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </div>

                {/* Article Content */}
                <div className="prose prose-lg mb-8 max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: newsData.content }}
                    className="prose-headings:text-neutral-900 prose-headings:font-semibold prose-p:text-neutral-700 prose-p:leading-relaxed prose-li:text-neutral-700 prose-li:leading-relaxed leading-relaxed text-neutral-700"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h5 className="mb-3 text-lg font-semibold text-neutral-900">
                    Tags:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {newsData.tags.map((tag) => (
                      <Tag
                        key={tag}
                        className="hover:bg-primary-50 cursor-pointer transition-colors"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="border-t border-neutral-200 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-neutral-700">
                        Chia sẻ:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="text"
                          icon={<Facebook size={18} />}
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        />
                        <Button
                          type="text"
                          icon={<Twitter size={18} />}
                          className="text-blue-400 hover:bg-blue-50 hover:text-blue-500"
                        />
                        <Button
                          type="text"
                          icon={<Linkedin size={18} />}
                          className="text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                        />
                        <Button
                          type="text"
                          icon={<Share2 size={18} />}
                          className="text-neutral-500 hover:bg-neutral-50 hover:text-neutral-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related News */}
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-neutral-900">
                Tin liên quan
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedNews.map((news) => (
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
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Tag color="blue" className="px-2 py-1 text-xs">
                          {news.category}
                        </Tag>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="hover:text-primary-500 mb-3 line-clamp-2 text-lg leading-tight font-semibold text-neutral-900 transition-colors">
                        <Link
                          href={`/news/${news.id}`}
                          className="text-inherit"
                        >
                          {news.title}
                        </Link>
                      </h4>
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Back to News */}
            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
              <Link href="/news">
                <Button
                  type="default"
                  icon={<ArrowLeft size={16} />}
                  block
                  size="large"
                  className="font-semibold"
                >
                  Quay lại
                </Button>
              </Link>
            </div>

            {/* Author Info */}
            <div className="mb-6 rounded-xl bg-white p-6 text-center shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                Tác giả
              </h3>
              <div>
                <div className="mb-4 flex justify-center">
                  <div className="bg-primary-50 flex h-16 w-16 items-center justify-center rounded-full">
                    <User size={24} className="text-primary-500" />
                  </div>
                </div>
                <h5 className="mb-2 text-lg font-semibold text-neutral-900">
                  {newsData.author}
                </h5>
                <p className="mb-4 text-sm text-neutral-600">
                  Chuyên gia phân tích thị trường bất động sản với hơn 10 năm
                  kinh nghiệm
                </p>
                <Button type="link" size="small" className="text-xs">
                  Xem thêm bài viết
                </Button>
              </div>
            </div>

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
                {relatedNews.map((news) => (
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
                        <Link href={`/news/${news.id}`}>
                          <h4 className="group-hover:text-primary-500 line-clamp-2 text-sm leading-tight font-medium text-neutral-900 transition-colors">
                            {news.title}
                          </h4>
                        </Link>
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
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="focus:border-primary-500 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm transition-colors focus:outline-none"
                  />
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
    </div>
  );
};

export default NewsDetailPage;
