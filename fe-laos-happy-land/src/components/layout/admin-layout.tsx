"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const menuItems = [
    {
      id: 1,
      label: "Quản lý thông tin tài khoản",
      icon: "/images/admin/sidebar/user.svg",
      active: true,
    },
    {
      id: 2,
      label: "Quản lý căn Hộ",
      icon: "/images/admin/sidebar/triangle-li.svg",
      active: false,
    },
    {
      id: 3,
      label: "Quản lý danh mục căn hộ",
      icon: "/images/admin/sidebar/square-li.svg",
      active: false,
    },
    {
      id: 4,
      label: "Quản lý thông tin tài khoản",
      icon: "/images/admin/sidebar/circle-li.svg",
      active: false,
    },
    {
      id: 5,
      label: "Quản lý thông tin tài khoản",
      icon: "/images/admin/sidebar/hexagon-li.svg",
      active: false,
    },
    {
      id: 6,
      label: "Quản lý thông tin tài khoản",
      icon: "/images/admin/sidebar/octagon-li.svg",
      active: false,
    },
  ];
  return (
    <div className="container mx-auto">
      <div className="flex gap-6 p-6">
        <div className="flex w-[300px] flex-col items-center justify-center">
          <Image
            src="/images/admin/logo.svg"
            alt="Logo"
            width={52}
            height={46}
          />
          <p className="text-xl font-bold text-blue-600">Lào BDS</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="text-3xl font-bold">Quản lý thông tin tài khoản</div>
          <div className="flex gap-6">
            <Image
              src="/images/admin/bell-line.svg"
              alt="Bell"
              width={32}
              height={32}
            ></Image>
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/images/admin/avatar.png"
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full"
              ></Image>
              <p className="text-base">Quang Nguyen</p>
              <Image
                src="/images/admin/chevron-down.svg"
                alt="Arrow"
                width={32}
                height={32}
              ></Image>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="relative flex w-[348px] flex-col gap-2">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`relative flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 ${
                item.active
                  ? "bg-blue-50 text-blue-600 before:absolute before:top-0 before:left-0 before:h-full before:w-[6px] before:rounded-tr-[4px] before:rounded-br-[4px] before:bg-blue-500 before:content-['']"
                  : "border border-transparent text-gray-700 hover:bg-blue-50"
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={`object-contain ${
                  item.active
                    ? "hue-rotate-180 invert-20 saturate-500 sepia-100 filter"
                    : "grayscale"
                }`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
export default AdminLayout;
