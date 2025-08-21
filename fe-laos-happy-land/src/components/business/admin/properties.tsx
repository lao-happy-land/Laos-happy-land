"use client";

import { useState } from "react";
import Link from "next/link";

interface Property {
  id: number;
  title: string;
  type: string;
  location: string;
  price: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  author: string;
  views: number;
}

const AdminProperties = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const properties: Property[] = [
    {
      id: 1,
      title: "Căn hộ cao cấp 2PN tại Vientiane Center",
      type: "Căn hộ",
      location: "Vientiane",
      price: "2.5 tỷ LAK",
      status: "pending",
      createdAt: "2025-08-10",
      author: "Nguyễn Văn A",
      views: 145,
    },
    {
      id: 2,
      title: "Nhà phố 3 tầng mặt tiền đường lớn",
      type: "Nhà phố",
      location: "Luang Prabang",
      price: "1.8 tỷ LAK",
      status: "approved",
      createdAt: "2025-08-09",
      author: "Trần Thị B",
      views: 234,
    },
    {
      id: 3,
      title: "Đất nền dự án khu đô thị mới",
      type: "Đất nền",
      location: "Pakse",
      price: "800 triệu LAK",
      status: "rejected",
      createdAt: "2025-08-08",
      author: "Lê Văn C",
      views: 67,
    },
    {
      id: 4,
      title: "Villa sang trọng view sông Mekong",
      type: "Villa",
      location: "Vientiane",
      price: "5.2 tỷ LAK",
      status: "approved",
      createdAt: "2025-08-07",
      author: "Phạm Thị D",
      views: 356,
    },
    {
      id: 5,
      title: "Shophouse kinh doanh tại trung tâm",
      type: "Shophouse",
      location: "Savannakhet",
      price: "3.5 tỷ LAK",
      status: "pending",
      createdAt: "2025-08-06",
      author: "Hoàng Văn E",
      views: 89,
    },
  ];

  const filteredProperties = properties.filter((property) => {
    const matchesFilter = filter === "all" || property.status === filter;
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex rounded-full bg-yellow-100 px-2 text-xs leading-5 font-semibold text-yellow-800">
            Chờ duyệt
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getFilterCount = (status: string) => {
    if (status === "all") return properties.length;
    return properties.filter((p) => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-3xl font-bold text-gray-900">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Quản lý tin đăng
            </h1>
            <p className="text-lg text-gray-600">
              Quản lý tất cả tin đăng bất động sản trên hệ thống
            </p>
          </div>
          <Link
            href="/admin/properties/create"
            className="flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-green-700 hover:to-green-800 hover:shadow-xl"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Thêm tin đăng
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tất cả", count: getFilterCount("all") },
              {
                key: "pending",
                label: "Chờ duyệt",
                count: getFilterCount("pending"),
              },
              {
                key: "approved",
                label: "Đã duyệt",
                count: getFilterCount("approved"),
              },
              {
                key: "rejected",
                label: "Từ chối",
                count: getFilterCount("rejected"),
              },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterOption.label}
                <span className="rounded-full bg-white/60 px-2 py-1 text-xs">
                  {filterOption.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tin đăng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-green-500 md:w-80"
            />
            <svg
              className="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
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
      </div>

      {/* Properties Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Tin đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-green-700 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-16 flex-shrink-0 rounded bg-gray-200"></div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-sm font-medium text-gray-900">
                          {property.title}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          📍 {property.location} • ✍️ {property.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {property.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(property.status)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {property.views.toString()}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {(() => {
                      try {
                        const date = new Date(property.createdAt);
                        return date.toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        });
                      } catch {
                        return "Invalid date";
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="text-green-600 hover:text-green-900">
                        Xem
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Duyệt
                      </button>
                      <button className="text-amber-600 hover:text-amber-900">
                        Sửa
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-green-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
              Trước
            </button>
            <button className="relative ml-3 inline-flex items-center rounded-md border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-green-700">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">10</span> trong{" "}
                <span className="font-medium">{filteredProperties.length}</span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                <button className="relative inline-flex items-center rounded-l-md border border-green-300 bg-white px-2 py-2 text-sm font-medium text-green-500 hover:bg-green-50">
                  Trước
                </button>
                <button className="relative inline-flex items-center border border-green-300 bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                  1
                </button>
                <button className="relative inline-flex items-center border border-green-300 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
                  2
                </button>
                <button className="relative inline-flex items-center rounded-r-md border border-green-300 bg-white px-2 py-2 text-sm font-medium text-green-500 hover:bg-green-50">
                  Sau
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
