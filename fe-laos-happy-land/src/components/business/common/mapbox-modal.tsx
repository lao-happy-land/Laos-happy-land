"use client";

import { useState, useRef, useEffect } from "react";
import { Modal, Button } from "antd";
import { MapPin } from "lucide-react";
import Map from "react-map-gl/mapbox";
import { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// Custom styles for enhanced marker and popup

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface MapboxModalProps {
  open: boolean;
  onClose: () => void;
  location?: string | null;
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function MapboxModal({
  open,
  onClose,
  location,
  coordinates,
}: MapboxModalProps) {
  const [mapLocation, setMapLocation] = useState<LocationData | null>(
    coordinates
      ? {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address: location ?? "",
        }
      : null,
  );
  const mapRef = useRef<MapRef>(null);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const defaultCenter = {
    longitude: mapLocation?.longitude ?? 102.6333, // Vientiane, Laos
    latitude: mapLocation?.latitude ?? 17.9757,
    zoom: 10,
  };

  const [viewState, setViewState] = useState({
    longitude: mapLocation?.longitude ?? defaultCenter.longitude,
    latitude: mapLocation?.latitude ?? defaultCenter.latitude,
    zoom: mapLocation ? 15 : defaultCenter.zoom,
  });

  // Initialize map location when modal opens
  useEffect(() => {
    if (open && coordinates) {
      // If coordinates are provided, use them directly
      setMapLocation({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        address: location ?? "",
      });

      // Update view state to center on coordinates
      setViewState({
        longitude: coordinates.longitude,
        latitude: coordinates.latitude,
        zoom: 15,
      });

      // Center map on coordinates
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 15,
          duration: 1000,
        });
      }
    }
  }, [open, location, coordinates]);

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Vị trí trên bản đồ</span>
          </div>
        }
        open={open}
        onCancel={onClose}
        width="90vw"
        style={{ maxWidth: 1200 }}
        footer={[
          <Button key="close" onClick={onClose}>
            Đóng
          </Button>,
        ]}
        className="mapbox-modal"
        destroyOnClose={false}
        maskClosable={true}
        keyboard={true}
      >
        <div className="space-y-4">
          {/* Location Display */}
          {location && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">
                  Vị trí tài sản:
                </p>
              </div>
              <p className="mt-1 block text-sm text-blue-600">{location}</p>
            </div>
          )}

          {/* Map */}
          <div className="h-[60vh] w-full overflow-hidden rounded-lg border border-gray-200">
            <Map
              ref={mapRef}
              {...viewState}
              onMove={(evt: { viewState: typeof viewState }) =>
                setViewState(evt.viewState)
              }
              mapStyle="mapbox://styles/mapbox/streets-v12"
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
            >
              {mapLocation && (
                <Marker
                  longitude={mapLocation.longitude}
                  latitude={mapLocation.latitude}
                  anchor="bottom"
                >
                  <div className="relative">
                    {/* Pulsing ring animation */}
                    <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75"></div>

                    {/* Main marker */}
                    <div className="marker-pulse relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl ring-4 ring-red-100">
                      <MapPin className="h-6 w-6 drop-shadow-sm" />
                    </div>

                    {/* Property type indicator */}
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-red-200">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </Marker>
              )}

              {mapLocation && (
                <Popup
                  longitude={mapLocation.longitude}
                  latitude={mapLocation.latitude}
                  anchor="top"
                  closeButton={false}
                  closeOnClick={false}
                  className="custom-popup"
                >
                  <div className="min-w-[200px] rounded-lg p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        Vị trí tài sản
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {mapLocation.address}
                    </p>
                    <div className="mt-2 border-t border-gray-100 pt-2">
                      <p className="text-xs text-gray-500">
                        📍 {mapLocation.latitude.toFixed(6)},{" "}
                        {mapLocation.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          </div>

          {/* Location Info */}
          {mapLocation && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">
                  Vị trí đã chọn:
                </p>
              </div>
              <p className="mt-1 block text-sm text-blue-600">
                {mapLocation.address}
              </p>
              <p className="mt-1 text-xs text-blue-500">
                Tọa độ: {mapLocation.latitude.toFixed(6)},{" "}
                {mapLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
