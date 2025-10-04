"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, Button, Typography, Select, Input } from "antd";
import { MapPin, Check, Search } from "lucide-react";
import Map from "react-map-gl/mapbox";
import { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTranslations } from "next-intl";
import { useRequest } from "ahooks";
import locationInfoService from "@/share/service/location-info.service";
import { getLangByLocale, getValidLocale } from "@/share/helper/locale.helper";
import { useUrlLocale } from "@/utils/locale";
import type { LocationDto } from "@/@types/gentype-axios";

const { Text } = Typography;

interface MapboxLocationSelectorValue {
  locationInfoId?: string;
  location?: LocationDto | null;
}

interface MapboxLocationSelectorProps {
  value?: MapboxLocationSelectorValue | null;
  onChange?: (value: MapboxLocationSelectorValue | null) => void;
  disabled?: boolean;
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
  value,
  onChange,
  disabled = false,
}: MapboxLocationSelectorProps) {
  const t = useTranslations();
  const locale = useUrlLocale();

  // Separate state for locationInfoId and location
  const [selectedLocationInfoId, setSelectedLocationInfoId] = useState<
    string | undefined
  >(value?.locationInfoId);

  const [selectedStrict, setSelectedStrict] = useState<string | undefined>(
    value?.location?.district,
  );

  const [address, setAddress] = useState<string>(
    value?.location?.address ?? "",
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [mapLocation, setMapLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    value?.location
      ? {
          latitude: value.location.latitude ?? 0,
          longitude: value.location.longitude ?? 0,
        }
      : null,
  );

  const [locationDetails, setLocationDetails] = useState<LocationDto | null>(
    value?.location ?? null,
  );

  const mapRef = useRef<MapRef>(null);

  const defaultCenter = {
    longitude: mapLocation?.longitude ?? 102.6333, // Laos center
    latitude: mapLocation?.latitude ?? 17.9757,
    zoom: 10,
  };

  const [viewState, setViewState] = useState({
    longitude: mapLocation?.longitude ?? defaultCenter.longitude,
    latitude: mapLocation?.latitude ?? defaultCenter.latitude,
    zoom: mapLocation ? 15 : defaultCenter.zoom,
  });

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Fetch all location info for dropdown
  const { data: locationInfoData, loading: loadingLocations } = useRequest(
    async () => {
      const response = await locationInfoService.getAllLocationInfo({
        lang: getLangByLocale(getValidLocale(locale)),
      });
      return response.data;
    },
  );

  // Update state from props
  useEffect(() => {
    if (value) {
      if (value.locationInfoId !== selectedLocationInfoId) {
        setSelectedLocationInfoId(value.locationInfoId);
      }
      if (value.location) {
        const newMapLocation = {
          latitude: value.location.latitude ?? 0,
          longitude: value.location.longitude ?? 0,
        };
        setMapLocation(newMapLocation);
        setLocationDetails(value.location);
        setSelectedStrict(value.location.district);
        setAddress(value.location.address ?? "");
        setViewState({
          longitude: newMapLocation.longitude,
          latitude: newMapLocation.latitude,
          zoom: 15,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Forward geocode to search for locations
  const forwardGeocode = useCallback(
    async (query: string): Promise<MapboxFeature[]> => {
      if (!MAPBOX_TOKEN || !query.trim()) {
        return [];
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query,
          )}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=LA`,
        );

        if (!response.ok) {
          console.error("Geocoding API error:", response.status);
          return [];
        }

        const data = (await response.json()) as MapboxGeocodingResponse;
        return data.features || [];
      } catch (error) {
        console.error("Geocoding error:", error);
        return [];
      }
    },
    [MAPBOX_TOKEN],
  );

  // Reverse geocode to get address details from lat/lng
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<LocationDto | null> => {
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is not available");
        return null;
      }
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=address,place,locality,neighborhood,district,region,postcode&limit=1`;

        const response = await fetch(url);
        if (!response.ok) return null;

        const data = (await response.json()) as MapboxGeocodingResponse;
        if (!data.features?.length) return null;

        const feature = data.features[0];
        if (!feature) return null;

        // Parse context for location details
        let city = "";
        let country = "";
        let district = "";
        let province = "";
        let postalCode = "";
        let neighborhood = "";

        for (const item of feature.context ?? []) {
          const id = item.id || "";
          const text = item.text || "";

          if (id.includes("place")) {
            city = text;
          } else if (id.includes("country")) {
            country = text;
          } else if (id.includes("district")) {
            district = text;
          } else if (id.includes("region")) {
            province = text;
          } else if (id.includes("postcode")) {
            postalCode = text;
          } else if (id.includes("neighborhood") || id.includes("locality")) {
            neighborhood = text;
          }
        }

        // Use the full place name as the primary address
        const address = feature.place_name;

        return {
          latitude: lat,
          longitude: lng,
          address: address,
          city: city || undefined,
          country: country || undefined,
          district: district || undefined,
          province: province || undefined,
          postalCode: postalCode || undefined,
          neighborhood: neighborhood || undefined,
        };
      } catch (err) {
        console.error("Error during reverse geocoding", err);
        return null;
      }
    },
    [MAPBOX_TOKEN],
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

      const newLocation = {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      };

      setMapLocation(newLocation);
      setViewState({
        longitude: lngLat.lng,
        latitude: lngLat.lat,
        zoom: 15,
      });

      // Get address details from reverse geocoding and sync with city/district
      void reverseGeocode(lngLat.lat, lngLat.lng).then((locationData) => {
        if (locationData) {
          // Only update coordinates and city/district, keep manual address input
          const updatedLocation = {
            ...locationData,
            district: selectedStrict ?? locationData.district,
            address: address, // Keep manual address input
          };
          setLocationDetails(updatedLocation);
          // Auto-update parent with new location
          onChange?.({
            locationInfoId: selectedLocationInfoId,
            location: updatedLocation,
          });
        } else {
          // Fallback if reverse geocoding fails
          const fallbackLocation: LocationDto = {
            latitude: lngLat.lat,
            longitude: lngLat.lng,
            address: address, // Keep manual address input
            district: selectedStrict,
          };
          setLocationDetails(fallbackLocation);
          onChange?.({
            locationInfoId: selectedLocationInfoId,
            location: fallbackLocation,
          });
        }
      });
    },
    [reverseGeocode, onChange, selectedLocationInfoId, selectedStrict, address],
  );

  const handleLocationInfoChange = (newLocationInfoId: string) => {
    setSelectedLocationInfoId(newLocationInfoId);
    // Reset strict selection when location info changes
    setSelectedStrict(undefined);

    // Auto-fill search input with selected area name
    const selectedLocation = locationInfoData?.find(
      (loc) => loc.id === newLocationInfoId,
    );
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
      // Auto-search for this location
      void handleSearch(selectedLocation.name);
    }

    // Update parent immediately
    onChange?.({
      locationInfoId: newLocationInfoId,
      location: locationDetails
        ? { ...locationDetails, district: undefined }
        : null,
    });
  };

  const handleStrictChange = (newStrict: string) => {
    setSelectedStrict(newStrict);

    // Auto-fill search input with area + district combination
    const selectedLocation = locationInfoData?.find(
      (loc) => loc.id === selectedLocationInfoId,
    );
    if (selectedLocation) {
      const searchQuery = `${selectedLocation.name}, ${newStrict}`;
      setSearchQuery(searchQuery);
      // Auto-search for this location combination
      void handleSearch(searchQuery);
    }

    // Update location details with the selected district
    const updatedLocation = locationDetails
      ? {
          ...locationDetails,
          district: newStrict,
          address: locationDetails.address, // Keep existing address
        }
      : null;
    setLocationDetails(updatedLocation);
    // Update parent immediately
    onChange?.({
      locationInfoId: selectedLocationInfoId,
      location: updatedLocation,
    });
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    // Update location details
    const updatedLocation = locationDetails
      ? {
          ...locationDetails,
          address: value || undefined,
        }
      : null;
    setLocationDetails(updatedLocation);
    onChange?.({
      locationInfoId: selectedLocationInfoId,
      location: updatedLocation,
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await forwardGeocode(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultSelect = (feature: MapboxFeature) => {
    const [lng, lat] = feature.center;
    const newLocation = { latitude: lat, longitude: lng };

    setMapLocation(newLocation);
    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 15,
    });

    // Get address details from reverse geocoding and sync with city/district
    void reverseGeocode(lat, lng).then((locationData) => {
      if (locationData) {
        // Only update coordinates and city/district, keep manual address input
        const updatedLocation = {
          ...locationData,
          district: selectedStrict ?? locationData.district,
          address: address, // Keep manual address input
        };
        setLocationDetails(updatedLocation);
        onChange?.({
          locationInfoId: selectedLocationInfoId,
          location: updatedLocation,
        });
      } else {
        // Fallback if reverse geocoding fails
        const fallbackLocation: LocationDto = {
          latitude: lat,
          longitude: lng,
          address: address, // Keep manual address input
          district: selectedStrict ?? undefined,
          country: "Laos",
        };
        setLocationDetails(fallbackLocation);
        onChange?.({
          locationInfoId: selectedLocationInfoId,
          location: fallbackLocation,
        });
      }
    });

    // Clear search results
    setSearchResults([]);
    setSearchQuery("");
  };

  // Get selected location info to access strict array
  const selectedLocationInfo = locationInfoData?.find(
    (loc) => loc.id === selectedLocationInfoId,
  );

  const handleConfirm = () => {
    if (selectedLocationInfoId && locationDetails) {
      onChange?.({
        locationInfoId: selectedLocationInfoId,
        location: locationDetails,
      });
    }
  };

  const handleClear = () => {
    setMapLocation(null);
    setLocationDetails(null);
    setSelectedLocationInfoId(undefined);
    setSelectedStrict(undefined);
    setAddress("");
    onChange?.(null);
  };

  return (
    <div className="w-full space-y-4">
      <Card className="border border-neutral-200">
        <div className="space-y-4">
          {/* Location Info Dropdown */}
          <div>
            <Text className="mb-2 block text-sm font-medium text-neutral-700">
              {t("map.area")} <span className="text-red-500">*</span>
            </Text>
            <Select
              placeholder={
                loadingLocations
                  ? t("common.loading") + "..."
                  : t("map.selectArea")
              }
              value={selectedLocationInfoId}
              onChange={handleLocationInfoChange}
              disabled={disabled || loadingLocations}
              loading={loadingLocations}
              className="w-full"
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={locationInfoData?.map((location) => ({
                value: location.id,
                label: location.name,
              }))}
              notFoundContent={
                loadingLocations ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-500"></div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-neutral-500">
                    {t("map.noResultsFound", { query: "" })}
                  </div>
                )
              }
            />
            {locationInfoData && (
              <Text className="mt-1 text-xs text-neutral-500">
                {locationInfoData.length} {t("map.area").toLowerCase()}{" "}
              </Text>
            )}
          </div>

          {/* District/Strict Dropdown - Only show when LocationInfo is selected */}
          {selectedLocationInfoId && selectedLocationInfo?.strict && (
            <div>
              <Text className="mb-2 block text-sm font-medium text-neutral-700">
                {t("map.district")} <span className="text-red-500">*</span>
              </Text>
              <Select
                placeholder={t("map.selectArea")}
                value={selectedStrict}
                onChange={handleStrictChange}
                disabled={disabled}
                className="w-full"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={selectedLocationInfo.strict.map((strict) => ({
                  value: strict,
                  label: strict,
                }))}
              />
              {selectedLocationInfo.strict && (
                <Text className="mt-1 text-xs text-neutral-500">
                  {selectedLocationInfo.strict.length}{" "}
                  {t("map.district").toLowerCase()}
                </Text>
              )}
            </div>
          )}

          {/* Address Input - Manual entry */}
          {selectedLocationInfoId && selectedStrict && (
            <div>
              <Text className="mb-2 block text-sm font-medium text-neutral-700">
                {t("common.address")} <span className="text-red-500">*</span>
              </Text>
              <Input
                placeholder={t("common.enterAddress")}
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                disabled={disabled}
                size="large"
              />
              <Text className="mt-1 text-xs text-neutral-500">
                {t("map.enterAddressManually")}
              </Text>
            </div>
          )}

          {/* Map with Search */}
          <div>
            <Text className="mb-2 block text-sm font-medium text-neutral-700">
              {t("map.selectLocationOnMap")} ({t("map.coordinates")}){" "}
              <span className="text-red-500">*</span>
            </Text>
            <div className="relative">
              {/* Search Input - Absolute positioned on top of map */}
              <div className="absolute top-4 left-4 z-10 w-80 max-w-[calc(100%-2rem)]">
                <Input
                  placeholder={t("map.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onPressEnter={() => handleSearch(searchQuery)}
                  disabled={disabled}
                  size="large"
                  prefix={<Search className="h-4 w-4 text-neutral-400" />}
                  suffix={
                    <Button
                      type="text"
                      size="small"
                      loading={isSearching}
                      onClick={() => handleSearch(searchQuery)}
                      className="text-primary-500 hover:text-primary-600"
                    >
                      {t("map.search")}
                    </Button>
                  }
                />

                {/* Search Results - Absolute positioned below input */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full right-0 left-0 z-20 mt-2 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="cursor-pointer border-b border-neutral-100 p-3 last:border-b-0 hover:bg-neutral-50"
                        onClick={() => handleSearchResultSelect(result)}
                      >
                        <div className="text-sm font-medium text-neutral-900">
                          {result.place_name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {result.center[1].toFixed(6)},{" "}
                          {result.center[0].toFixed(6)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="h-[50vh] w-full overflow-hidden rounded-lg border border-neutral-200">
                <Map
                  ref={mapRef}
                  {...viewState}
                  onMove={(evt: { viewState: typeof viewState }) =>
                    setViewState(evt.viewState)
                  }
                  onClick={disabled ? undefined : handleMapClick}
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
                      <div className="bg-primary-500 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg">
                        <MapPin className="h-4 w-4" />
                      </div>
                    </Marker>
                  )}

                  {mapLocation && locationDetails && (
                    <Popup
                      longitude={mapLocation.longitude}
                      latitude={mapLocation.latitude}
                      anchor="top"
                      closeButton={false}
                      closeOnClick={false}
                    >
                      <div className="max-w-[250px] p-3">
                        <Text className="text-sm font-medium">
                          {address ||
                            `${mapLocation.latitude.toFixed(6)}, ${mapLocation.longitude.toFixed(6)}`}
                        </Text>
                        <div className="mt-2 space-y-1">
                          {locationDetails.district && (
                            <div className="text-xs text-neutral-600">
                              <strong>{t("map.district")}:</strong>{" "}
                              {locationDetails.district}
                            </div>
                          )}
                          {locationDetails.city && (
                            <div className="text-xs text-neutral-600">
                              <strong>{t("map.city")}:</strong>{" "}
                              {locationDetails.city}
                            </div>
                          )}
                          {locationDetails.province && (
                            <div className="text-xs text-neutral-600">
                              <strong>{t("map.province")}:</strong>{" "}
                              {locationDetails.province}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">
                          {mapLocation.latitude.toFixed(6)},{" "}
                          {mapLocation.longitude.toFixed(6)}
                        </div>
                      </div>
                    </Popup>
                  )}
                </Map>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
            <Text className="text-sm text-neutral-600">
              💡 <strong>{t("map.instructions")}:</strong> {t("map.selectArea")}{" "}
              → {t("map.district")} → {t("common.address")} →{" "}
              {t("map.searchOrClickMap")} → {t("map.coordinates")}
            </Text>
            <div className="flex justify-end gap-2">
              {(mapLocation ?? selectedLocationInfoId) && (
                <Button onClick={handleClear} disabled={disabled}>
                  {t("common.clear")}
                </Button>
              )}
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={
                  !mapLocation ||
                  !selectedLocationInfoId ||
                  !selectedStrict ||
                  !address ||
                  disabled
                }
                icon={<Check className="h-4 w-4" />}
              >
                {t("common.confirm")}
              </Button>
            </div>
          </div>

          {/* Selected Location Display */}
          {(selectedLocationInfoId ?? locationDetails) && (
            <div className="space-y-2 rounded-lg bg-neutral-50 p-4">
              {selectedLocationInfoId && (
                <div className="flex items-center gap-2">
                  <div className="text-primary-600 bg-primary-50 flex rounded-full p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500">{t("map.area")}:</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {locationInfoData?.find(
                        (l) => l.id === selectedLocationInfoId,
                      )?.name ?? selectedLocationInfoId}
                    </p>
                  </div>
                </div>
              )}
              {selectedStrict && (
                <div className="flex items-center gap-2">
                  <div className="text-primary-600 bg-primary-50 flex rounded-full p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500">
                      {t("map.district")}:
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {selectedStrict}
                    </p>
                  </div>
                </div>
              )}
              {locationDetails && (
                <div className="flex items-center gap-2">
                  <div className="text-primary-600 bg-primary-50 flex rounded-full p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-500">
                      {t("map.address")}:
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {locationDetails?.address}
                    </p>
                    <div className="mt-2 space-y-1 border-t border-neutral-200 pt-2">
                      {mapLocation && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.coordinates")}:{" "}
                          {mapLocation.latitude.toFixed(6)},{" "}
                          {mapLocation.longitude.toFixed(6)}
                        </p>
                      )}
                      {locationDetails?.neighborhood && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.neighborhood")}:{" "}
                          {locationDetails.neighborhood}
                        </p>
                      )}
                      {locationDetails?.city && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.city")}: {locationDetails.city}
                        </p>
                      )}
                      {locationDetails?.province && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.province")}: {locationDetails.province}
                        </p>
                      )}
                      {locationDetails?.country && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.country")}: {locationDetails.country}
                        </p>
                      )}
                      {locationDetails?.postalCode && (
                        <p className="text-xs text-neutral-500">
                          📍 {t("map.postalCode")}: {locationDetails.postalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
