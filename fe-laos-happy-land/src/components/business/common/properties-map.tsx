"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Spin, Empty } from "antd";
import { MapPin, X, Eye } from "lucide-react";
import Map from "react-map-gl/mapbox";
import { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Property } from "@/@types/types";
import { formatShortLocation } from "@/share/helper/format-location";
import { useUrlLocale } from "@/utils/locale";
import { useRouter } from "next/navigation";
import { numberToString } from "@/share/helper/number-to-string";
import { useCurrencyStore } from "@/share/store/currency.store";

interface PropertiesMapProps {
  properties: Property[];
  loading?: boolean;
  onPropertyClick?: (property: Property) => void;
  height?: string;
}

export default function PropertiesMap({
  properties,
  loading = false,
  onPropertyClick,
  height = "600px",
}: PropertiesMapProps) {
  const t = useTranslations("property");
  const locale = useUrlLocale();
  const router = useRouter();
  const { currency } = useCurrencyStore();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const [viewState, setViewState] = useState({
    longitude: 102.6333, // Laos center
    latitude: 17.9757,
    zoom: 10,
  });
  const mapRef = useRef<MapRef>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Calculate map bounds to fit all properties
  useEffect(() => {
    if (properties.length > 0 && mapRef.current) {
      const coordinates = properties
        .filter((p) => p.location?.latitude && p.location?.longitude)
        .map(
          (p) =>
            [p.location!.longitude, p.location!.latitude] as [number, number],
        );

      if (coordinates.length > 0) {
        // Calculate bounds
        const lngs = coordinates.map((c) => c[0]);
        const lats = coordinates.map((c) => c[1]);
        const bounds = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ] as [[number, number], [number, number]];

        // Fit map to bounds with padding
        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000,
        });
      }
    }
  }, [properties]);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  const handleClosePopup = () => {
    setSelectedProperty(null);
  };

  const getImageURL = (property: Property) => {
    if (property.mainImage) {
      return property.mainImage;
    }
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    return "/images/placeholder-property.jpg";
  };

  const handleViewDetails = (property: Property) => {
    router.push(`/${locale}/properties/${property.id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <Empty description="Không có bất động sản nào để hiển thị trên bản đồ" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height }}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={[]}
      >
        {/* Property Markers */}
        {properties
          .filter(
            (property) =>
              property.location?.latitude && property.location?.longitude,
          )
          .map((property) => (
            <Marker
              key={property.id}
              longitude={property.location!.longitude}
              latitude={property.location!.latitude}
              anchor="bottom"
              onClick={() => handleMarkerClick(property)}
            >
              <div className="relative">
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></div>

                {/* Main marker */}
                <div className="marker-pulse relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl ring-4 ring-red-100 transition-transform duration-200 hover:scale-110">
                  <MapPin className="h-5 w-5 drop-shadow-sm" />
                </div>

                {/* Property type indicator */}
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-red-200">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </Marker>
          ))}

        {/* Property Popup */}
        {selectedProperty && (
          <Popup
            longitude={selectedProperty.location!.longitude}
            latitude={selectedProperty.location!.latitude}
            anchor="top"
            closeButton={false}
            closeOnClick={false}
            className="custom-popup"
          >
            <div className="property-card-enter min-w-[320px] overflow-hidden rounded-xl bg-white shadow-2xl">
              {/* Property Image with Overlay */}
              <div className="relative h-40 w-full">
                <Image
                  src={
                    getImageURL(selectedProperty) ??
                    "/images/placeholder-property.jpg"
                  }
                  alt={selectedProperty.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Close Button */}
                <div className="absolute top-3 right-3">
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={16} />}
                    onClick={handleClosePopup}
                    className="bg-white/90 text-gray-700 shadow-lg hover:bg-white hover:text-gray-900"
                  />
                </div>

                {/* Property Type Badge */}
                <div className="absolute bottom-3 left-3">
                  <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
                    {selectedProperty.transactionType === "sale"
                      ? t("forSale")
                      : t("forRent")}
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute right-3 bottom-3">
                  <div className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    {numberToString(
                      Number(selectedProperty.price),
                      locale,
                      currency,
                    )}
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-5">
                {/* Title with Location Icon */}
                <div className="mb-3 flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                    <MapPin className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-base leading-tight font-bold text-gray-900">
                      {selectedProperty.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-gray-600">
                      {formatShortLocation(selectedProperty, "")}
                    </p>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye size={14} className="text-blue-500" />
                      <span className="font-medium">
                        {selectedProperty.viewsCount || 0}
                      </span>
                      <span className="text-xs">{t("views")}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(selectedProperty.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => handleViewDetails(selectedProperty)}
                    block
                    className="bg-red-500 font-semibold shadow-lg hover:bg-red-600"
                  >
                    {t("viewDetails")}
                  </Button>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Custom CSS for marker animation */}
      <style jsx global>{`
        .marker-pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }

        .custom-popup .mapboxgl-popup-content {
          padding: 0;
          border-radius: 16px;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .custom-popup .mapboxgl-popup-tip {
          border-top-color: white;
          filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
        }

        .custom-popup .mapboxgl-popup-close-button {
          display: none;
        }

        /* Enhanced marker hover effects */
        .marker-pulse:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }

        /* Property card animations */
        .property-card-enter {
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
