"use client";

import type { Property } from "@/@types/types";
import {
  MapPin,
  Heart,
  Bath,
  Bed,
  Star,
  Eye,
  Phone,
  Calendar,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { numberToString } from "@/share/helper/number-to-string";
import { Button } from "antd";
import { useState } from "react";
import { formatCreatedDate } from "@/share/helper/format-date";

export default function PropertyCard({ property }: { property: Property }) {
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  const hiddenPhone = property.owner?.phone?.slice(0, -4) + "****";

  const handleRevealPhone = () => {
    setIsPhoneRevealed(true);
  };

  return (
    <Link href={`/property/${property.id}`} className="block">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:border-red-200 hover:shadow-lg">
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm">
            <Shield className="h-3 w-3" />
            <span>Đã xác thực</span>
          </div>
        </div>

        <div className="flex h-full flex-col">
          <div className="relative flex w-full overflow-hidden">
            <div className="relative h-[240px] w-[60%] flex-shrink-0">
              <Image
                src={
                  property.mainImage ??
                  "/images/landingpage/apartment/apart-1.jpg"
                }
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 30vw"
                priority
              />
            </div>

            <div className="flex h-[240px] w-[40%] flex-col">
              {/* Top Image - Full Width */}
              <div className="relative h-[120px] overflow-hidden">
                <Image
                  src={
                    property.images?.[0] ??
                    "/images/landingpage/apartment/apart-2.jpg"
                  }
                  alt="Property image 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>

              {/* Bottom Images - Split Width */}
              <div className="flex h-[120px]">
                <div className="relative w-[50%] overflow-hidden">
                  <Image
                    src={
                      property.images?.[1] ??
                      "/images/landingpage/apartment/apart-3.jpg"
                    }
                    alt="Property image 3"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 15vw"
                  />
                </div>
                <div className="relative w-[50%] overflow-hidden">
                  <Image
                    src={
                      property.images?.[2] ??
                      "/images/landingpage/apartment/apart-4.jpg"
                    }
                    alt="Property image 4"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 15vw"
                  />
                </div>
              </div>
            </div>

            <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              <span>{property.viewsCount}</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4">
            <h3 className="mb-2 line-clamp-2 cursor-pointer text-lg leading-tight font-bold text-gray-900">
              {property.title}
            </h3>

            <div className="mb-2 flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600">
                {numberToString(Number(property.price))}
              </span>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm text-gray-600">
                  {property.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {(property.details?.bedrooms ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">
                  <Bed className="h-4 w-4" />
                  <span className="font-medium">
                    {property.details?.bedrooms}
                  </span>
                </div>
              )}
              {(property.details?.bathrooms ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-purple-700">
                  <Bath className="h-4 w-4" />
                  <span className="font-medium">
                    {property.details?.bathrooms}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <Star className="h-3 w-3 fill-current" />
                <span>{property.details?.area ?? 0} m²</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                <span className="font-medium">{property.legalStatus}</span>
              </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
              {property.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold text-gray-900">
                  {property.owner?.fullName ?? "N/A"}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Đăng {formatCreatedDate(property.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="primary"
                onClick={handleRevealPhone}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>
                  {isPhoneRevealed ? property.owner?.phone : hiddenPhone}
                </span>
                <span className="hidden text-xs opacity-90 sm:inline">
                  - Hiển số
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
