"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Activity {
  id: number;
  type: string;
  message: string;
  time: string;
  user: string;
}

interface Stats {
  totalProperties: number;
  pendingProperties: number;
  totalUsers: number;
  totalProjects: number;
  monthlyRevenue: number;
  recentActivities: Activity[];
}

const AdminDashboard = () => {
  const t = useTranslations();
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    totalProjects: 0,
    monthlyRevenue: 0,
    recentActivities: [],
  });

  // Mock data - in real app, fetch from API
  useEffect(() => {
    setStats({
      totalProperties: 1250,
      pendingProperties: 45,
      totalUsers: 850,
      totalProjects: 25,
      monthlyRevenue: 125000000, // LAK
      recentActivities: [
        {
          id: 1,
          type: "property",
          message: t("admin.newProperty"),
          time: `5 ${t("admin.minutesAgo")}`,
          user: t("admin.sampleUser1"),
        },
        {
          id: 2,
          type: "user",
          message: t("admin.newUser"),
          time: `15 ${t("admin.minutesAgo")}`,
          user: t("admin.systemUser"),
        },
        {
          id: 3,
          type: "project",
          message: t("admin.newProject"),
          time: `30 ${t("admin.minutesAgo")}`,
          user: t("admin.adminUser"),
        },
      ],
    });
  }, [t]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {t("admin.welcomeBack")}
        </h1>
        <p className="text-lg text-gray-600">{t("admin.systemOverview")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Properties */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">
                {t("admin.totalProperties")}
              </p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {stats.totalProperties.toString()}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">+12%</span>
                <span className="text-sm text-gray-500">
                  {t("admin.comparedToLastMonth")}
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200">
              <svg
                className="h-7 w-7 text-blue-600"
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
            </div>
          </div>
        </div>

        {/* Pending Properties */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">
                {t("admin.pendingApproval")}
              </p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {stats.pendingProperties}
              </p>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium text-yellow-600">
                  {t("admin.needsProcessing")}
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200">
              <svg
                className="h-7 w-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">
                {t("admin.users")}
              </p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {stats.totalUsers.toString()}
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">+8%</span>
                <span className="text-sm text-gray-500">
                  {t("admin.comparedToLastMonth")}
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200">
              <svg
                className="h-7 w-7 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-600">
                {t("admin.monthlyRevenue")}
              </p>
              <p className="mb-2 text-3xl font-bold text-gray-900">
                {(stats.monthlyRevenue / 1000000).toFixed(1)}M LAK
              </p>
              <div className="flex items-center gap-1">
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                <span className="text-sm font-medium text-green-600">+15%</span>
                <span className="text-sm text-gray-500">
                  {t("admin.comparedToLastMonth")}
                </span>
              </div>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-red-200">
              <svg
                className="h-7 w-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg
                className="h-5 w-5 text-green-600"
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
              {t("admin.quickActions")}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 transition-transform group-hover:scale-110">
                  <svg
                    className="h-6 w-6 text-blue-600"
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
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {t("admin.addProperty")}
                  </span>
                  <p className="text-xs text-gray-500">
                    {t("admin.postSaleRent")}
                  </p>
                </div>
              </button>

              <button className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 transition-transform group-hover:scale-110">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {t("admin.addProject")}
                  </span>
                  <p className="text-xs text-gray-500">
                    {t("admin.createNewProject")}
                  </p>
                </div>
              </button>

              <button className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-yellow-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 transition-transform group-hover:scale-110">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {t("admin.addUser")}
                  </span>
                  <p className="text-xs text-gray-500">
                    {t("admin.manageAccounts")}
                  </p>
                </div>
              </button>

              <button className="group flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-purple-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 transition-transform group-hover:scale-110">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-900">
                    {t("admin.viewReports")}
                  </span>
                  <p className="text-xs text-gray-500">
                    {t("admin.detailedStatistics")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t("admin.recentActivity")}
            </h2>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {activity.user}
                      </span>
                    </div>
                  </div>
                  <button className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-xl px-4 py-2 text-center text-sm font-medium text-green-600 transition-colors hover:bg-green-50 hover:text-green-700">
              {t("admin.viewAllActivity")}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Properties Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <svg
                className="h-5 w-5 text-green-600"
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
              {t("admin.latestProperties")}
            </h2>
            <Link
              href="/admin/properties"
              className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
            >
              {t("admin.viewAll")}
              <svg
                className="h-4 w-4"
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.title")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.type")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.price")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.status")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.postedDate")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-600 uppercase">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Căn hộ 2PN tại Vientiane Center
                        </div>
                        <div className="text-sm text-gray-500">
                          Vientiane, Lào
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {t("admin.apartment")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">
                    2.5 tỷ LAK
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      {t("admin.pending")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    10/08/2025
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="rounded px-2 py-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-900">
                        {t("admin.view")}
                      </button>
                      <button className="rounded px-2 py-1 text-green-600 transition-colors hover:bg-green-50 hover:text-green-900">
                        {t("admin.approve")}
                      </button>
                      <button className="rounded px-2 py-1 text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-900">
                        {t("admin.reject")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
