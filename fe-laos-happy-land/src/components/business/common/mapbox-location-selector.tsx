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
import { useTranslations } from "next-intl";

const { Text } = Typography;
const { Option } = Select;

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
  buildingNumber?: string;
  street?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  neighborhood?: string;
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
  text?: string; // label (street name, place name)
  place_type?: string[]; // e.g. ["address"], ["place"], ["locality"]
  properties?: { address?: string }; // house number when place_type includes "address"
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface MapboxGeocodingResponse {
  type?: "FeatureCollection";
  query?: string[];
  features: MapboxFeature[];
  attribution?: string;
}

/** Helper: Parse a Mapbox feature into our LocationData fields */
function parseMapboxFeature(f: MapboxFeature) {
  let buildingNumber = "";
  let street = "";
  let district = "";
  let city = "";
  let province = "";
  let country = "";
  let postalCode = "";
  let neighborhood = "";

  const placeType = f.place_type ?? [];
  const ctx = f.context ?? [];

  // Primary signals
  if (placeType.includes("address")) {
    if (f.text) street = f.text;
    if (f.properties?.address) buildingNumber = String(f.properties.address);
  } else if (placeType.includes("locality")) {
    district = f.text ?? "";
  } else if (placeType.includes("place")) {
    const hasDistrictContext = ctx.some((item) =>
      item.id?.includes("district"),
    );
    const hasLocalityContext = ctx.some((item) =>
      item.id?.includes("locality"),
    );
    const hasRegionContext = ctx.some((item) => item.id?.includes("region"));

    if (hasRegionContext) {
      district = f.text ?? "";
    } else if (hasDistrictContext) {
      district = f.text ?? "";
    } else if (hasLocalityContext) {
      city = f.text ?? "";
    } else {
      district = f.text ?? "";
    }
  }

  // Context fallbacks
  for (const item of ctx) {
    const id = item.id || "";
    const txt = item.text || "";

    if (id.includes("region")) {
      province ||= txt;
    } else if (id.includes("place") && !id.includes("region")) {
      city ||= txt;
    } else if (id.includes("locality")) {
    } else if (id.includes("district")) {
      district ||= txt;
    } else if (id.includes("street") || id.includes("road")) {
      street ||= txt;
    } else if (id.includes("neighborhood")) {
      neighborhood ||= txt;
    } else if (id.includes("postcode")) {
      postalCode ||= txt;
    } else if (id.includes("country")) {
      country ||= txt;
    }
  }

  if (!district && f.place_name && placeType.includes("place")) {
    district = f.text ?? "";
  }

  if (!street && f.place_name) {
    const parts = f.place_name.split(",").map((s) => s.trim());
    if (placeType.some((t) => t === "address") && parts[0]) {
      street = parts[0];
    }
  }

  // Postal code extraction - try multiple strategies
  if (!postalCode) {
    // Strategy 1: Look for postcode in context IDs (most reliable)
    for (const item of ctx) {
      const id = item.id || "";
      const txt = item.text || "";
      if (id.includes("postcode")) {
        postalCode = txt;
        break;
      }
    }

    // Strategy 2: Extract from place_name (if available)
    if (!postalCode && f.place_name) {
      const regex = /\b(\d{4,6})\b/;
      const m = regex.exec(f.place_name);
      if (m) {
        postalCode = m[1] ?? "";
      }
    }

    // Strategy 3: Extract from context text
    if (!postalCode) {
      for (const item of ctx) {
        const txt = item.text || "";
        const regex = /\b(\d{4,6})\b/;
        const m = regex.exec(txt);
        if (m) {
          postalCode = m[1] ?? "";
          break;
        }
      }
    }

    // Strategy 4: Try different regex patterns
    if (!postalCode) {
      const patterns = [/\b(\d{5})\b/, /\b(\d{4})\b/, /\b(\d{6})\b/];

      for (const pattern of patterns) {
        if (f.place_name) {
          const m = pattern.exec(f.place_name);
          if (m) {
            postalCode = m[1] ?? "";
            break;
          }
        }

        // Also check context
        for (const item of ctx) {
          const txt = item.text || "";
          const m = pattern.exec(txt);
          if (m) {
            postalCode = m[1] ?? "";
            break;
          }
        }

        if (postalCode) break;
      }
    }
  }

  const result = {
    buildingNumber,
    street,
    district,
    city,
    province,
    country,
    postalCode,
    neighborhood,
  };

  return result;
}

export default function MapboxLocationSelector({
  form: _form,
  value,
  onChange,
  disabled = false,
  initialSearchValue,
  locationInfos = [],
  selectedLocationInfoId,
  loadingLocations = false,
  mode = "create",
  hasExistingLocation = false,
}: MapboxLocationSelectorProps) {
  const t = useTranslations();
  const [mapLocation, setMapLocation] = useState<LocationData | null>(
    value ?? null,
  );

  const [searchQuery, setSearchQuery] = useState(initialSearchValue ?? "");
  const [searchResults, setSearchResults] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const defaultCenter = {
    longitude: mapLocation?.longitude ?? 102.6333, // Laos center-ish
    latitude: mapLocation?.latitude ?? 17.9757,
    zoom: 10,
  };

  const [viewState, setViewState] = useState({
    longitude:
      mapLocation?.longitude && typeof mapLocation.longitude === "number"
        ? mapLocation.longitude
        : defaultCenter.longitude,
    latitude:
      mapLocation?.latitude && typeof mapLocation.latitude === "number"
        ? mapLocation.latitude
        : defaultCenter.latitude,
    zoom: mapLocation ? 15 : defaultCenter.zoom,
  });

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Function to search for nearby POIs/places for reference (Laos + Lao/EN)
  const searchNearbyPOIs = useCallback(
    async (lat: number, lng: number, _radius = 1000) => {
      if (!MAPBOX_TOKEN) return null;
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=place&limit=5`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = (await response.json()) as MapboxGeocodingResponse;
        return data.features ?? [];
      } catch (error) {
        console.error("Error searching nearby POIs:", error);
        return null;
      }
    },
    [MAPBOX_TOKEN],
  );

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize state from props
  useEffect(() => {
    if (initialSearchValue && initialSearchValue !== searchQuery) {
      setSearchQuery(initialSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLocationRequired =
    mode === "create" || (mode === "edit" && !hasExistingLocation);

  useEffect(() => {
    if (value && value !== mapLocation) {
      setMapLocation(value);
      if (
        typeof value.longitude === "number" &&
        typeof value.latitude === "number" &&
        !isNaN(value.longitude) &&
        !isNaN(value.latitude)
      ) {
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
        setSearchQuery(value.address);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, mapLocation]);

  // Sync selectedLocationInfoId → searchQuery
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

  // Reverse geocode with Laos-aware types & languages
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<LocationData | null> => {
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is not available for reverse geocoding");
        return null;
      }
      try {
        const common = `access_token=${MAPBOX_TOKEN}&language=en&country=la`;
        const typesAll =
          "&types=address,place,locality,neighborhood,district,region,postcode";
        const reverseStrategies = [
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?${common}&types=address&limit=10`,
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?${common}&types=place&limit=10`,
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?${common}${typesAll}`,
        ];

        let best: MapboxGeocodingResponse | null = null;
        for (let i = 0; i < reverseStrategies.length; i++) {
          const url = reverseStrategies[i];
          if (!url) continue;
          const resp = await fetch(url);
          if (!resp.ok) {
            continue;
          }
          const data = (await resp.json()) as MapboxGeocodingResponse;

          if (data.features?.length) {
            best = data;
            console.log(
              `Using strategy ${i + 1} with features:`,
              data.features.map((f) => ({
                text: f.text,
                place_type: f.place_type,
                place_name: f.place_name,
              })),
            );
            break;
          }
        }
        if (!best?.features?.length) return null;

        const f = best.features[0];
        if (!f) return null;

        const parsed = parseMapboxFeature(f);

        // If still no street/number, try nearby POI hint
        if (!parsed.street && !parsed.buildingNumber) {
          const nearby = await searchNearbyPOIs(lat, lng, 500);
          const firstNearby = nearby?.[0];
          if (firstNearby?.place_name) {
            const hint = firstNearby.place_name.split(",")[0];
            parsed.street = parsed.street || `Gần ${hint}`;
          }
        }

        const parts = [
          parsed.buildingNumber,
          parsed.street,
          parsed.district,
          parsed.city,
          parsed.province,
          parsed.postalCode,
          parsed.country,
        ].filter(Boolean);

        const fullAddress =
          parts.join(", ") ||
          f?.place_name ||
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        return {
          longitude: lng,
          latitude: lat,
          address: fullAddress,
          ...parsed,
        };
      } catch (err) {
        console.error("Error during reverse geocoding", err);
        return null;
      }
    },
    [MAPBOX_TOKEN, searchNearbyPOIs],
  );

  const handleMapClick = useCallback(
    (event: { lngLat: { lat: number; lng: number } }) => {
      const { lngLat } = event;
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

      void reverseGeocode(lngLat.lat, lngLat.lng).then((locationData) => {
        if (locationData) {
          setMapLocation(locationData);
          onChange?.(locationData);
        } else {
          setMapLocation(newLocation);
          onChange?.(newLocation);
        }
      });
    },
    [reverseGeocode, onChange],
  );

  // ---- Forward Search ----
  const performSearch = useCallback(
    async (query: string) => {
      if (!MAPBOX_TOKEN || !query.trim()) return;

      setIsSearching(true);
      try {
        const base = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json`;
        const params =
          `access_token=${MAPBOX_TOKEN}` +
          `&country=la` +
          `&language=en` +
          `&autocomplete=true` +
          `&limit=20` +
          `&types=address,place,locality,neighborhood,district,region,postcode`;
        const proximity = `&proximity=102.6333,17.9757`;

        const searchStrategies = [
          `${base}?${params}`,
          `${base}?${params}${proximity}`,
          `${base}?${params}&types=address,place${proximity}`,
        ];

        let data: MapboxGeocodingResponse | null = null;
        for (const url of searchStrategies) {
          const response = await fetch(url);
          if (!response.ok) continue;
          const tmp = (await response.json()) as MapboxGeocodingResponse;
          if (tmp.features?.length) {
            data = tmp;
            break;
          }
        }

        if (data?.features?.length) {
          setSearchResults(data.features);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setShowSearchResults(false);
      } finally {
        setIsSearching(false);
      }
    },
    [MAPBOX_TOKEN],
  );

  // Debounce search by 300ms
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    const t = setTimeout(() => {
      void performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, performSearch]);

  const handleSearchResultClick = (result: MapboxFeature) => {
    const [lng, lat] = result.center;
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      isNaN(lat) ||
      isNaN(lng)
    ) {
      console.error("Invalid coordinates from search result:", result);
      return;
    }

    // Parse fields (street, buildingNumber, district, city, etc.)
    const parsed = parseMapboxFeature(result);

    const addressParts = [
      parsed.buildingNumber,
      parsed.street,
      parsed.district,
      parsed.city,
      parsed.province,
      parsed.postalCode,
      parsed.country,
    ].filter(Boolean);

    const fullAddress =
      addressParts.join(", ") ||
      result.place_name ||
      `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    const location: LocationData = {
      latitude: lat,
      longitude: lng,
      address: fullAddress,
      city: parsed.city,
      country: parsed.country,
      buildingNumber: parsed.buildingNumber,
      street: parsed.street,
      district: parsed.district,
      province: parsed.province,
      postalCode: parsed.postalCode,
      neighborhood: parsed.neighborhood,
    };

    setMapLocation(location);
    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 15,
    });

    try {
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 15,
        duration: 1000,
      });
    } catch (error) {
      console.error("Error flying to location:", error);
    }

    setSearchResults([]);
    setSearchQuery("");
    setShowSearchResults(false);
    onChange?.(location);
  };

  const handleConfirm = () => {
    if (mapLocation) {
      onChange?.(mapLocation);
    }
    console.log("mapLocation", mapLocation);
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
            <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-4">
              <div
                className="relative col-span-1 lg:col-span-3"
                ref={searchContainerRef}
              >
                <Input
                  placeholder={t("map.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={() => performSearch(searchQuery)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchResults(true);
                    }
                  }}
                  prefix={<Search className="h-4 w-4 text-neutral-400" />}
                  className="w-full flex-1"
                  disabled={disabled}
                />

                {/* Enhanced Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="cursor-pointer border-b border-neutral-100 p-3 transition-colors last:border-b-0 hover:bg-blue-50"
                        onClick={() => handleSearchResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0">
                            <MapPin className="h-4 w-4 text-neutral-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Text className="truncate text-sm font-medium text-neutral-900">
                              {result.place_name}
                            </Text>
                            {result.context && result.context.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {result.context.slice(0, 3).map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600"
                                  >
                                    {item.text}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Loading State */}
                {showSearchResults && isSearching && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg">
                    <div className="flex items-center justify-center p-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-500"></div>
                        Đang tìm kiếm...
                      </div>
                    </div>
                  </div>
                )}

                {/* No Results State */}
                {showSearchResults &&
                  searchResults.length === 0 &&
                  !isSearching &&
                  searchQuery.trim() && (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-lg border border-neutral-200 bg-white shadow-lg">
                      <div className="p-4 text-center text-sm text-neutral-500">
                        Không tìm thấy kết quả cho &ldquo;{searchQuery}&rdquo;
                      </div>
                    </div>
                  )}
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
                      message: t("map.selectAreaMessage"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("map.selectArea")}
                    loading={loadingLocations}
                    showSearch
                    className="w-full"
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
                  onClick={() => performSearch(searchQuery)}
                  loading={isSearching}
                  icon={<Search className="h-4 w-4" />}
                  disabled={disabled}
                >
                  Tìm
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[50vh] w-full overflow-hidden rounded-lg border border-neutral-200">
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
                    <div className="max-w-[200px] p-3">
                      <Text className="text-sm font-medium">
                        {typeof mapLocation.address === "string"
                          ? mapLocation.address
                          : `${mapLocation.latitude?.toFixed(6) ?? "N/A"}, ${mapLocation.longitude?.toFixed(6) ?? "N/A"}`}
                      </Text>
                      {/* Enhanced location details display */}
                      <div className="mt-2 space-y-1">
                        {mapLocation.buildingNumber && (
                          <div className="text-xs text-neutral-600">
                            <strong>Số nhà:</strong>{" "}
                            {mapLocation.buildingNumber}
                          </div>
                        )}
                        {mapLocation.street && (
                          <div className="text-xs text-neutral-600">
                            <strong>Đường:</strong> {mapLocation.street}
                          </div>
                        )}
                        {mapLocation.neighborhood && (
                          <div className="text-xs text-neutral-600">
                            <strong>Khu phố:</strong> {mapLocation.neighborhood}
                          </div>
                        )}
                        {mapLocation.district && (
                          <div className="text-xs text-neutral-600">
                            <strong>Khu vực:</strong> {mapLocation.district}
                          </div>
                        )}
                        {mapLocation.city && (
                          <div className="text-xs text-neutral-600">
                            <strong>Thành phố:</strong> {mapLocation.city}
                          </div>
                        )}
                        {mapLocation.province && (
                          <div className="text-xs text-neutral-600">
                            <strong>Tỉnh:</strong> {mapLocation.province}
                          </div>
                        )}
                        {mapLocation.country && (
                          <div className="text-xs text-neutral-600">
                            <strong>Quốc gia:</strong> {mapLocation.country}
                          </div>
                        )}
                        {mapLocation.postalCode && (
                          <div className="text-xs text-neutral-600">
                            <strong>Mã bưu điện:</strong>{" "}
                            {mapLocation.postalCode}
                          </div>
                        )}
                        {!mapLocation.buildingNumber && !mapLocation.street && (
                          <div className="mt-2 rounded bg-blue-50 p-2">
                            <div className="text-xs text-blue-700">
                              <strong>💡 Lưu ý:</strong> Thông tin chi tiết về
                              đường và số nhà có thể không có sẵn cho khu vực
                              này. Vị trí đã được xác định chính xác theo tọa độ
                              GPS.
                            </div>
                            <div className="mt-1 text-xs text-blue-600">
                              <strong>💡 Gợi ý:</strong> Thử tìm kiếm với tên
                              đường cụ thể, tên tòa nhà, hoặc địa danh gần đó để
                              có thông tin chi tiết hơn.
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-neutral-500">
                        {mapLocation.latitude?.toFixed(6) ?? "N/A"},{" "}
                        {mapLocation.longitude?.toFixed(6) ?? "N/A"}
                      </div>
                    </div>
                  </Popup>
                )}
            </Map>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
            <Text className="text-sm text-neutral-600">
              💡 <strong>{t("map.instructions")}:</strong>{" "}
              {t("map.instructionsText")}
            </Text>
            <div className="flex justify-end gap-2">
              {mapLocation && (
                <Button onClick={handleClear} disabled={disabled}>
                  {t("common.clear")}
                </Button>
              )}
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!mapLocation || disabled}
                icon={<Check className="h-4 w-4" />}
              >
                {t("common.confirm")}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-primary-600 bg-primary-50 flex rounded-full p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <p className="text-sm text-neutral-600">
              {t("property.location")}:{" "}
              {mapLocation?.address ?? t("common.notUpdated")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
