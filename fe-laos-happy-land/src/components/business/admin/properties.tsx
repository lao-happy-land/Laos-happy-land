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
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Chờ duyệt
          </span>
        );
      case "approved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getFilterCount = (status: string) => {
    if (status === "all") return properties.length;
    return properties.filter(p => p.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Quản lý tin đăng
            </h1>
            <p className="text-gray-600 text-lg">
              Quản lý tất cả tin đăng bất động sản trên hệ thống
            </p>
          </div>
          <Link
            href="/admin/properties/create"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm tin đăng
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Tất cả", count: getFilterCount("all") },
              { key: "pending", label: "Chờ duyệt", count: getFilterCount("pending") },
              { key: "approved", label: "Đã duyệt", count: getFilterCount("approved") },
              { key: "rejected", label: "Từ chối", count: getFilterCount("rejected") },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterOption.label}
                <span className="bg-white/60 text-xs px-2 py-1 rounded-full">
                  {filterOption.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm tin đăng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Tin đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          📍 {property.location} • ✍️ {property.author}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {property.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(property.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-green-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50">
              Trước
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50">
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-green-700">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">10</span> trong{" "}
                <span className="font-medium">{filteredProperties.length}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-green-300 bg-white text-sm font-medium text-green-500 hover:bg-green-50">
                  Trước
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-green-300 bg-green-500 text-sm font-medium text-white hover:bg-green-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-green-300 bg-white text-sm font-medium text-green-700 hover:bg-green-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-green-300 bg-white text-sm font-medium text-green-500 hover:bg-green-50">
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
