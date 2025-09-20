"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  Button,
  Input,
  Typography,
  Select,
  Form,
  type FormInstance,
} from "antd";
import { MapPin, Search, Check } from "lucide-react";
import Map from "react-map-gl/mapbox";
import { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const { Text } = Typography;
const { Option } = Select;

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
}

interface LocationInfo {
  id: string;
  name: string;
  imageURL?: string;
  viewCount?: number;
  strict?: string[];
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
}

interface MapboxLocationSelectorProps {
  form?: FormInstance;
  value?: LocationData | null;
  onChange?: (location: LocationData | null) => void;
  placeholder?: string;
  disabled?: boolean;
  initialSearchValue?: string;
  locationInfos?: LocationInfo[];
  selectedLocationInfoId?: string;
  onLocationInfoChange?: (locationInfoId: string) => void;
  loadingLocations?: boolean;
  mode?: "create" | "edit";
  hasExistingLocation?: boolean;
}

interface MapboxFeature {
  center: [number, number];
  place_name: string;
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface MapboxGeocodingResponse {
  features: MapboxFeature[];
}

export default function MapboxLocationSelector({
  form,
  value,
  onChange,
  placeholder: _placeholder = "Chọn vị trí trên bản đồ",
  disabled = false,
  initialSearchValue,
  locationInfos = [],
  selectedLocationInfoId,
  onLocationInfoChange,
  loadingLocations = false,
  mode = "create",
  hasExistingLocation = false,
}: MapboxLocationSelectorProps) {
  const [mapLocation, setMapLocation] = useState<LocationData | null>(
    value ?? null,
  );

  const [location, setLocation] = useState<LocationData | null>(
    form?.getFieldValue("location") as LocationData | null,
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchValue ?? "");
  const [searchResults, setSearchResults] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const defaultCenter = {
    longitude: location?.longitude ?? 102.6333,
    latitude: location?.latitude ?? 17.9757,
    zoom: 10,
  };

  const [viewState, setViewState] = useState({
    longitude:
      location?.longitude && typeof location.longitude === "number"
        ? location.longitude
        : defaultCenter.longitude,
    latitude:
      location?.latitude && typeof location.latitude === "number"
        ? location.latitude
        : defaultCenter.latitude,
    zoom: location ? 15 : defaultCenter.zoom,
  });

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Determine if location fields should be required based on mode and existing data
  const isLocationRequired =
    mode === "create" || (mode === "edit" && !hasExistingLocation);

  useEffect(() => {
    if (initialSearchValue && initialSearchValue !== searchQuery) {
      setSearchQuery(initialSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize with existing data
  useEffect(() => {
    console.log("MapboxLocationSelector value effect:", {
      location,
      mapLocation,
      searchQuery,
    });
    if (value && value !== mapLocation) {
      console.log("Setting mapLocation to:", value);
      setMapLocation(value);

      // Only update view state if coordinates are valid numbers
      if (
        typeof value.longitude === "number" &&
        typeof value.latitude === "number" &&
        !isNaN(value.longitude) &&
        !isNaN(value.latitude)
      ) {
        console.log("Setting viewState to:", {
          longitude: value.longitude,
          latitude: value.latitude,
          zoom: 15,
        });
        setViewState({
          longitude: value.longitude,
          latitude: value.latitude,
          zoom: 15,
        });
      }

      if (
        value.address &&
        value.address !== searchQuery &&
        searchQuery === ""
      ) {
        console.log("Setting searchQuery to:", value.address);
        setSearchQuery(value.address);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mapLocation]);

  // Initialize selected location info
  useEffect(() => {
    if (selectedLocationInfoId && locationInfos.length > 0) {
      const selectedLocation = locationInfos.find(
        (loc) => loc.id === selectedLocationInfoId,
      );
      if (selectedLocation) {
        setSearchQuery(selectedLocation.name);
      }
    }
  }, [selectedLocationInfoId, locationInfos]);

  const handleLocationInfoChange = (locationInfoId: string) => {
    const selectedLocation = locationInfos.find(
      (loc) => loc.id === locationInfoId,
    );
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
    onLocationInfoChange?.(locationInfoId);
  };

  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<string | null> => {
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is not available for reverse geocoding");
        return null;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=vi&country=la`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as MapboxGeocodingResponse;

        if (data.features && data.features.length > 0) {
          return data.features[0]?.place_name ?? null;
        }
        return null;
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
      }
    },
    [MAPBOX_TOKEN],
  );

  const handleMapClick = useCallback(
    (event: { lngLat: { lat: number; lng: number } }) => {
      const { lngLat } = event;

      // Validate coordinates
      if (
        typeof lngLat.lat !== "number" ||
        typeof lngLat.lng !== "number" ||
        isNaN(lngLat.lat) ||
        isNaN(lngLat.lng)
      ) {
        console.error("Invalid coordinates from map click:", lngLat);
        return;
      }

      const newLocation: LocationData = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        address: `${lngLat.lat?.toFixed(6) ?? "N/A"}, ${lngLat.lng?.toFixed(6) ?? "N/A"}`,
      };

      setMapLocation(newLocation);
      onChange?.(newLocation);

      void reverseGeocode(lngLat.lat, lngLat.lng).then((address) => {
        const locationWithAddress = {
          ...newLocation,
          address: typeof address === "string" ? address : newLocation.address,
        };
        setMapLocation(locationWithAddress);
        onChange?.(locationWithAddress);
      });
    },
    [reverseGeocode, onChange],
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery,
        )}.json?access_token=${MAPBOX_TOKEN}&country=la&language=vi&limit=5`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as MapboxGeocodingResponse;

      if (data.features) {
        setSearchResults(data.features);
      } else {
        console.warn("No search results found");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result: MapboxFeature) => {
    const [lng, lat] = result.center;

    // Validate coordinates
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      console.error("Invalid coordinates from search result:", result);
      return;
    }

    const location: LocationData = {
      latitude: lat,
      longitude: lng,
      address: result.place_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      city: result.context?.find((c) => c.id.startsWith("place"))?.text,
      country: result.context?.find((c) => c.id.startsWith("country"))?.text,
    };

    setMapLocation(location);
    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 15,
    });

    if (mapRef.current) {
      try {
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          duration: 1000,
        });
      } catch (error) {
        console.error("Error flying to location:", error);
      }
    }

    onChange?.(location);
  };

  const handleConfirm = () => {
    if (mapLocation) {
      onChange?.(mapLocation);
    }
  };

  const handleClear = () => {
    setMapLocation(null);
    onChange?.(null);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border border-neutral-200">
        <div className="space-y-4">
          {/* Location Info Dropdown */}
          <div>
            <Text className="mb-2 block text-sm font-medium text-neutral-700">
              Khu vực <span className="text-red-500">*</span>
            </Text>
            <div className="grid w-full grid-cols-4 gap-2">
              <div className="col-span-3">
                <Input
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={handleSearch}
                  prefix={<Search className="h-4 w-4 text-neutral-400" />}
                  className="w-full flex-1"
                  disabled={disabled}
                />
              </div>
              <div className="col-span-1 grid grid-cols-3 gap-2">
                <Form.Item
                  key={selectedLocationInfoId ?? "empty"}
                  name="locationInfoId"
                  className="col-span-2"
                  initialValue={selectedLocationInfoId}
                  rules={[
                    {
                      required: isLocationRequired,
                      message: "Vui lòng chọn khu vực!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn khu vực"
                    loading={loadingLocations}
                    showSearch
                    className="w-full"
                    onChange={handleLocationInfoChange}
                    filterOption={(input, option) => {
                      const text = option?.children as unknown as string;
                      return text.toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    {Array.isArray(locationInfos) &&
                      locationInfos.map((location) => (
                        <Option key={location.id} value={location.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{location.name}</span>
                          </div>
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Button
                  type="primary"
                  onClick={handleSearch}
                  loading={isSearching}
                  icon={<Search className="h-4 w-4" />}
                  disabled={disabled}
                >
                  Tìm
                </Button>
              </div>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-32 overflow-y-auto rounded-lg border border-neutral-200">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="cursor-pointer p-3 transition-colors hover:bg-neutral-50"
                  onClick={() => {
                    handleSearchResultClick(result);
                  }}
                >
                  <Text className="text-sm font-medium">
                    {result.place_name}
                  </Text>
                </div>
              ))}
            </div>
          )}

          {searchResults.length === 0 && isSearching && (
            <div className="p-3 text-center text-sm text-gray-500">
              Đang tìm kiếm...
            </div>
          )}

          <div className="h-[40vh] w-full overflow-hidden rounded-lg border border-neutral-200">
            <Map
              ref={mapRef}
              {...(typeof viewState.longitude === "number" &&
              typeof viewState.latitude === "number" &&
              !isNaN(viewState.longitude) &&
              !isNaN(viewState.latitude)
                ? viewState
                : defaultCenter)}
              onMove={(evt: { viewState: typeof viewState }) =>
                setViewState(evt.viewState)
              }
              onClick={(() => {
                return disabled ? undefined : handleMapClick;
              })()}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{ width: "100%", height: "100%" }}
            >
              {mapLocation &&
                typeof mapLocation.latitude === "number" &&
                typeof mapLocation.longitude === "number" && (
                  <Marker
                    longitude={mapLocation.longitude}
                    latitude={mapLocation.latitude}
                    anchor="bottom"
                  >
                    <div className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg">
                      <MapPin className="h-4 w-4" />
                    </div>
                  </Marker>
                )}

              {mapLocation &&
                typeof mapLocation.latitude === "number" &&
                typeof mapLocation.longitude === "number" && (
                  <Popup
                    longitude={mapLocation.longitude}
                    latitude={mapLocation.latitude}
                    anchor="top"
                    closeButton={false}
                    closeOnClick={false}
                  >
                    <div className="p-2">
                      <Text className="text-sm font-medium">
                        {typeof mapLocation.address === "string"
                          ? mapLocation.address
                          : `${mapLocation.latitude?.toFixed(6) ?? "N/A"}, ${mapLocation.longitude?.toFixed(6) ?? "N/A"}`}
                      </Text>
                      <div className="mt-1 text-xs text-neutral-500">
                        {mapLocation.latitude?.toFixed(6) ?? "N/A"},{" "}
                        {mapLocation.longitude?.toFixed(6) ?? "N/A"}
                      </div>
                    </div>
                  </Popup>
                )}
            </Map>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Text className="text-sm text-neutral-600">
              💡 <strong>Hướng dẫn:</strong> Nhấp vào bản đồ để chọn vị trí hoặc
              sử dụng thanh tìm kiếm để tìm địa điểm cụ thể.
            </Text>
            <div className="flex justify-end gap-2">
              {mapLocation && (
                <Button onClick={handleClear} disabled={disabled}>
                  Xóa
                </Button>
              )}
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!mapLocation || disabled}
                icon={<Check className="h-4 w-4" />}
              >
                Xác nhận
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-primary-600 bg-primary-50 flex rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <p className="text-sm text-neutral-600">
              Địa chỉ: {mapLocation?.address ?? "Chưa cập nhật"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
