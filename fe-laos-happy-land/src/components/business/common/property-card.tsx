"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Home, Bed, Bath, Eye } from "lucide-react";
import type { Property } from "@/@types/types";
import { numberToString } from "@/share/helper/number-to-string";
import { formatShortLocation } from "@/share/helper/format-location";
import { useUrlLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";
import {
  getCurrencyByLocale,
  type SupportedLocale,
} from "@/share/helper/locale.helper";

interface PropertyCardProps {
  property: Property;
  className?: string;
  size?: "small" | "medium" | "large";
  showDescription?: boolean;
}

export default function PropertyCard({
  property,
  className = "",
  size = "medium",
  showDescription = false,
}: PropertyCardProps) {
  const locale = useUrlLocale() as SupportedLocale;
  const t = useTranslations();
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

  return (
    <Link href={`/${locale}/property/${property.id}`} className="block h-full">
      <div
        className={`group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      >
        {/* Image Section */}
        <div className={`relative overflow-hidden ${getImageHeight()}`}>
          <Image
            src={(() => {
              const mainImg = property.mainImage;
              const firstImg = property.images?.[0];
              const fallback = "/images/landingpage/apartment/apart-1.jpg";

              // Check mainImage
              if (mainImg && typeof mainImg === "string") {
                try {
                  new URL(mainImg);
                  return mainImg;
                } catch {
                  if (mainImg.startsWith("/")) {
                    return mainImg;
                  }
                }
              }

              // Check first image
              if (firstImg && typeof firstImg === "string") {
                try {
                  new URL(firstImg);
                  return firstImg;
                } catch {
                  if (firstImg.startsWith("/")) {
                    return firstImg;
                  }
                }
              }

              return fallback;
            })()}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Priority badge */}
          {property.priority > 0 && (
            <div className="absolute top-3 left-3">
              <span className="bg-primary-500 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md">
                ⭐ {t("property.featured")}
              </span>
            </div>
          )}

          {/* View count overlay */}
          {property.viewsCount > 0 && (
            <div className="absolute right-3 bottom-3">
              <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                <Eye className="h-3 w-3" />
                {property.viewsCount}
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
            {property.title}
          </h3>

          {/* Description */}
          {showDescription && property.description && (
            <p
              className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.5rem",
              }}
            >
              {property.description}
            </p>
          )}

          {/* Price */}
          <div className="mb-4">
            <div className="text-lg font-bold text-red-500">
              {property.price
                ? numberToString(
                    Number(property.price),
                    locale,
                    getCurrencyByLocale(locale),
                  )
                : t("property.contactForPrice")}
            </div>
          </div>

          {/* Location and Area */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="truncate text-sm">
                {formatShortLocation(property, t("property.notUpdated"))}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-sm">
                {property.details?.area
                  ? `${property.details.area} m²`
                  : t("property.notUpdated")}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-4 flex items-center gap-4">
            {property.details?.bedrooms && property.details.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Bed className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="text-sm font-medium">
                  {property.details.bedrooms} {t("property.bedroomsShort")}
                </span>
              </div>
            )}
            {property.details?.bathrooms && property.details.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Bath className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span className="text-sm font-medium">
                  {property.details.bathrooms} {t("property.bathroomsShort")}
                </span>
              </div>
            )}
          </div>

          {/* Footer - Push to bottom */}
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
              {property.type?.name ?? property.transactionType}
            </span>
            <div className="text-xs text-gray-400">
              {new Date(property.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
