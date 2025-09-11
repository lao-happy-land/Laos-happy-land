"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Home, Eye } from "lucide-react";
import type { Property } from "@/@types/types";

interface ProjectCardProps {
  project: Property;
  className?: string;
  size?: "small" | "medium" | "large";
  showDescription?: boolean;
}

export default function ProjectCard({
  project,
  className = "",
  size = "medium",
  showDescription = false,
}: ProjectCardProps) {
  const getCardPadding = () => {
    switch (size) {
      case "small":
        return "p-3";
      case "large":
        return "p-5";
      default:
        return "p-4";
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const getImageHeight = () => {
    switch (size) {
      case "small":
        return "h-32";
      case "large":
        return "h-48";
      default:
        return "h-40";
    }
  };

  const getStatusInfo = () => {
    switch (project.status) {
      case "approved":
        return { color: "bg-green-100 text-green-800", text: "✅ Đã duyệt" };
      case "pending":
        return { color: "bg-orange-100 text-orange-800", text: "⏳ Chờ duyệt" };
      case "rejected":
        return { color: "bg-red-100 text-red-800", text: "❌ Từ chối" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: "📋 Chưa xác định" };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Link href={`/property/${project.id}`} className="block h-full">
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      >
        {/* Image Section */}
        <div className={`relative overflow-hidden ${getImageHeight()}`}>
          <Image
            src={
              project.mainImage ??
              project.images?.[0] ??
              "/images/landingpage/project/project-1.jpg"
            }
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Priority badge */}
          {project.priority > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary-500 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                ⭐ Nổi bật
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute bottom-3 left-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-md ${statusInfo.color}`}
            >
              {statusInfo.text}
            </span>
          </div>

          {/* View count overlay */}
          {project.viewsCount > 0 && (
            <div className="absolute right-3 bottom-3">
              <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                <Eye className="h-3 w-3" />
                {project.viewsCount}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`flex flex-1 flex-col ${getCardPadding()}`}>
          {/* Title */}
          <h3
            className={`mb-3 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-red-500 ${getTitleSize()}`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight:
                size === "small"
                  ? "2.5rem"
                  : size === "large"
                    ? "3.5rem"
                    : "3rem",
            }}
          >
            {project.title}
          </h3>

          {/* Description */}
          {showDescription && project.description && (
            <p
              className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.5rem",
              }}
            >
              {project.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="text-lg font-bold text-red-500">
              {project.price}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate text-sm">
              {project.location ?? "Chưa cập nhật"}
            </span>
          </div>

          {/* Area */}
          {project.details?.area && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <Home className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-sm">
                Diện tích: {project.details.area} m²
              </span>
            </div>
          )}

          {/* Footer - Push to bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              🏗️ Dự án
            </span>
            <div className="text-xs text-gray-400">
              {new Date(project.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
