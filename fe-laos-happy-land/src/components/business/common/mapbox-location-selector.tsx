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

export default function MapboxLocationSelector({
  form: _form,
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

  const [searchQuery, setSearchQuery] = useState(initialSearchValue ?? "");
  const [searchResults, setSearchResults] = useState<MapboxFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const mapRef = useRef<MapRef>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const defaultCenter = {
    longitude: mapLocation?.longitude ?? 102.6333,
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

  // Function to search for nearby POIs and landmarks to get more detailed location info
  const searchNearbyPOIs = useCallback(
    async (lat: number, lng: number, _radius = 1000) => {
      if (!MAPBOX_TOKEN) return null;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=place&limit=5&radius=${_radius}`,
        );

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

  // Handle clicking outside search container to hide dropdown
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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
    if (value && value !== mapLocation) {
      setMapLocation(value);

      // Only update view state if coordinates are valid numbers
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
    async (lat: number, lng: number): Promise<LocationData | null> => {
      if (!MAPBOX_TOKEN) {
        console.error("Mapbox token is not available for reverse geocoding");
        return null;
      }

      try {
        // Try multiple reverse geocoding strategies with single types (required for limit parameter)
        const reverseStrategies = [
          // Strategy 1: Try to get address-level data (Laos only)
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=address&limit=5`,

          // Strategy 2: Try to get place data
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=place&limit=5`,

          // Strategy 3: Try to get postcode data
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=postcode&limit=5`,

          // Strategy 4: Broader search without limit (fallback)
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=en&country=la&types=address,place,locality,neighborhood,district,region,postcode`,
        ];

        let response;
        let data;

        // Try each strategy until we get results
        for (const url of reverseStrategies) {
          response = await fetch(url);

          if (!response.ok) {
            continue; // Try next strategy
          }

          data = (await response.json()) as MapboxGeocodingResponse;

          // If we have results, break
          if (data.features && data.features.length > 0) {
            break;
          }
        }

        if (!response?.ok) {
          throw new Error(
            `HTTP error! status: ${response?.status ?? "Unknown"}`,
          );
        }

        if (data?.features && data.features.length > 0) {
          const feature = data.features[0];
          const context = feature?.context ?? [];

          // Extract detailed information from context based on Mapbox feature types
          let buildingNumber = "";
          let street = "";
          let district = "";
          let province = "";
          let postalCode = "";
          let city = "";
          let country = "";
          let neighborhood = "";

          context.forEach((item) => {
            const id = item.id;
            const text = item.text || "";

            // Address-level information (most specific)
            if (id.includes("address")) {
              // Individual residential or business addresses
              buildingNumber = text;
            } else if (id.includes("secondary_address")) {
              // Sub-unit, suite, or lot (US only, but check anyway)
              buildingNumber = text;
            } else if (id.includes("street")) {
              // Street features which host one or more addresses
              street = text;
            } else if (id.includes("block")) {
              // Special feature type reserved for Japanese addresses
              street = text;
            }
            // Administrative levels (less specific)
            else if (id.includes("neighborhood")) {
              // Colloquial sub-city features (may lack official boundaries)
              neighborhood = text;
            } else if (id.includes("locality")) {
              // Official sub-city features (city districts, arrondissements)
              district = text;
            } else if (id.includes("district")) {
              // Features smaller than top-level but larger than cities
              district = text;
            } else if (id.includes("place")) {
              // Cities, villages, municipalities (postal addressing)
              city = text;
            } else if (id.includes("region")) {
              // Top-level sub-national features (states, provinces)
              province = text;
            } else if (id.includes("country")) {
              // Generally recognized countries
              country = text;
            } else if (id.includes("postcode")) {
              // Postal codes
              postalCode = text;
            }
          });

          // Try to extract postal code from place_name if not found in context
          if (!postalCode && feature?.place_name) {
            // Look for postal code patterns in place_name
            const postalCodePatterns = [
              /\b(\d{5})\b/, // 5-digit postal code
              /\b(\d{4})\b/, // 4-digit postal code
              /\b(\d{6})\b/, // 6-digit postal code
            ];

            for (const pattern of postalCodePatterns) {
              const match = feature.place_name.match(pattern);
              if (match?.[1]) {
                postalCode = match[1];

                break;
              }
            }
          }

          // If no detailed context, try to parse from place_name
          if (!buildingNumber && !street && !district) {
            const placeNameParts = feature?.place_name?.split(", ") ?? [];

            // Enhanced parsing for Laos address format
            if (placeNameParts.length > 0) {
              const firstPart = placeNameParts[0];
              if (firstPart) {
                // Check if it looks like a building number or street
                if (
                  /^\d+/.test(firstPart) ||
                  firstPart.includes("Street") ||
                  firstPart.includes("Road") ||
                  firstPart.includes("Avenue") ||
                  firstPart.includes("Lane") ||
                  firstPart.includes("Boulevard")
                ) {
                  street = firstPart;
                } else if (
                  firstPart.includes("District") ||
                  firstPart.includes("Ward") ||
                  firstPart.includes("Village") ||
                  firstPart.includes("Ban") ||
                  firstPart.includes("Mueng")
                ) {
                  district = firstPart;
                } else {
                  // For Laos, the first part is often a district/neighborhood
                  district = firstPart;
                }
              }
            }

            // Try to identify city from middle parts
            if (placeNameParts.length > 1) {
              const cityPart = placeNameParts[1];
              if (cityPart && !city) {
                city = cityPart;
              }
            }

            // Try to identify province/country from last parts
            if (placeNameParts.length > 2) {
              const provincePart = placeNameParts[placeNameParts.length - 2];
              const countryPart = placeNameParts[placeNameParts.length - 1];
              if (provincePart && !province) {
                province = provincePart;
              }
              if (countryPart && !country) {
                country = countryPart;
              }
            }
          }

          // Additional parsing for Laos-specific patterns
          if (!street && feature?.place_name) {
            const placeName = feature.place_name;
            // Look for common Laos street patterns
            const streetPatterns = [
              /(\d+\s+[A-Za-z\s]+(?:Street|Road|Avenue|Boulevard|Lane))/i,
              /([A-Za-z\s]+(?:Street|Road|Avenue|Boulevard|Lane))/i,
              /(\d+\s+[A-Za-z\s]+)/i, // Number followed by text
            ];

            for (const pattern of streetPatterns) {
              const match = placeName.match(pattern);
              if (match?.[1]) {
                street = match[1].trim();
                break;
              }
            }
          }

          // If still no detailed info, try to find nearby POIs for reference
          if (!street && !buildingNumber) {
            const nearbyPOIs = await searchNearbyPOIs(lat, lng, 500);
            if (nearbyPOIs && nearbyPOIs.length > 0) {
              // Use the closest POI as a reference point
              const closestPOI = nearbyPOIs[0];
              if (closestPOI?.place_name) {
                // Add POI reference to the address
                const poiName = closestPOI.place_name.split(",")[0];
                street = `Gần ${poiName}`;
              }
            }
          }

          // Construct detailed address
          const addressParts = [];
          if (buildingNumber) addressParts.push(buildingNumber);
          if (street) addressParts.push(street);
          if (district) addressParts.push(district);
          if (city) addressParts.push(city);
          if (province) addressParts.push(province);
          if (postalCode) addressParts.push(postalCode);
          if (country) addressParts.push(country);

          const fullAddress = addressParts.join(", ");

          return {
            latitude: lat,
            longitude: lng,
            address: fullAddress ?? feature?.place_name ?? "",
            city,
            country,
            buildingNumber,
            street,
            district,
            province,
            postalCode,
            neighborhood,
          };
        }
        return null;
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
      }
    },
    [MAPBOX_TOKEN, searchNearbyPOIs],
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

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Laos-only search with autocomplete
      const searchStrategies = [
        // Strategy 1: Laos-only search with autocomplete
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${MAPBOX_TOKEN}&country=la&autocomplete=true&limit=40`,

        // Strategy 2: Laos-only with proximity bias
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${MAPBOX_TOKEN}&country=la&autocomplete=true&proximity=102.6333,17.9757&limit=40`,

        // Strategy 3: Laos-only with language preference
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${MAPBOX_TOKEN}&country=la&autocomplete=true&language=en&limit=40`,
      ];

      let response;
      let data;
      let success = false;

      // Try each strategy until we get results
      for (let i = 0; i < searchStrategies.length; i++) {
        const searchUrl = searchStrategies[i];

        try {
          if (!searchUrl) {
            console.error(`Strategy ${i + 1} - Invalid search URL`);
            continue;
          }
          response = await fetch(searchUrl);

          if (response.ok) {
            data = (await response.json()) as MapboxGeocodingResponse;

            if (data?.features && data.features.length > 0) {
              success = true;

              break;
            }
          } else {
            const errorText = await response.text();
            console.error(`Strategy ${i + 1} failed:`, errorText);
          }
        } catch (strategyError) {
          console.error(`Strategy ${i + 1} error:`, strategyError);
        }
      }

      if (success && data?.features) {
        setSearchResults(data.features);
        setShowSearchResults(true);
      } else {
        console.warn("All search strategies failed or returned no results");
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      void performSearch(searchQuery);
    }, 300); // 300ms delay

    setSearchTimeout(timeout);
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

    // Extract detailed information from search result
    const context = result.context ?? [];
    let buildingNumber = "";
    let street = "";
    let district = "";
    let province = "";
    let postalCode = "";
    let city = "";
    let country = "";
    let neighborhood = "";

    // Parse context information based on Mapbox feature types
    context.forEach((item) => {
      const id = item.id;
      const text = item.text || "";

      // Address-level information (most specific)
      if (id.includes("address")) {
        // Individual residential or business addresses
        buildingNumber = text;
      } else if (id.includes("secondary_address")) {
        // Sub-unit, suite, or lot (US only, but check anyway)
        buildingNumber = text;
      } else if (id.includes("street")) {
        // Street features which host one or more addresses
        street = text;
      } else if (id.includes("block")) {
        // Special feature type reserved for Japanese addresses
        street = text;
      }
      // Administrative levels (less specific)
      else if (id.includes("neighborhood")) {
        // Colloquial sub-city features (may lack official boundaries)
        neighborhood = text;
      } else if (id.includes("locality")) {
        // Official sub-city features (city districts, arrondissements)
        district = text;
      } else if (id.includes("district")) {
        // Features smaller than top-level but larger than cities
        district = text;
      } else if (id.includes("place")) {
        // Cities, villages, municipalities (postal addressing)
        city = text;
      } else if (id.includes("region")) {
        // Top-level sub-national features (states, provinces)
        province = text;
      } else if (id.includes("country")) {
        // Generally recognized countries
        country = text;
      } else if (id.includes("postcode")) {
        // Postal codes
        postalCode = text;
      }
    });

    // Try to extract postal code from place_name if not found in context
    if (!postalCode && result.place_name) {
      // Look for postal code patterns in place_name
      const postalCodePatterns = [
        /\b(\d{5})\b/, // 5-digit postal code
        /\b(\d{4})\b/, // 4-digit postal code
        /\b(\d{6})\b/, // 6-digit postal code
      ];

      for (const pattern of postalCodePatterns) {
        const match = result.place_name.match(pattern);
        if (match?.[1]) {
          postalCode = match[1];
          break;
        }
      }
    }

    // If no detailed context, try to parse from place_name
    if (!buildingNumber && !street && !district) {
      const placeNameParts = result.place_name?.split(", ") ?? [];

      // Enhanced parsing for Laos address format
      if (placeNameParts.length > 0) {
        const firstPart = placeNameParts[0];
        if (firstPart) {
          // Check if it looks like a building number or street
          if (
            /^\d+/.test(firstPart) ||
            firstPart.includes("Street") ||
            firstPart.includes("Road") ||
            firstPart.includes("Avenue") ||
            firstPart.includes("Lane") ||
            firstPart.includes("Boulevard")
          ) {
            street = firstPart;
          } else if (
            firstPart.includes("District") ||
            firstPart.includes("Ward") ||
            firstPart.includes("Village") ||
            firstPart.includes("Ban") ||
            firstPart.includes("Mueng")
          ) {
            district = firstPart;
          } else {
            // If it's a named place, it might be a district or neighborhood
            district = firstPart;
          }
        }
      }

      // Try to identify city from middle parts
      if (placeNameParts.length > 1) {
        const cityPart = placeNameParts[1];
        if (cityPart && !city) {
          city = cityPart;
        }
      }

      // Try to identify province/country from last parts
      if (placeNameParts.length > 2) {
        const provincePart = placeNameParts[placeNameParts.length - 2];
        const countryPart = placeNameParts[placeNameParts.length - 1];
        if (provincePart && !province) {
          province = provincePart;
        }
        if (countryPart && !country) {
          country = countryPart;
        }
      }
    }

    // Additional parsing for Laos-specific patterns
    if (!street && result.place_name) {
      const placeName = result.place_name;
      // Look for common Laos street patterns
      const streetPatterns = [
        /(\d+\s+[A-Za-z\s]+(?:Street|Road|Avenue|Boulevard|Lane))/i,
        /([A-Za-z\s]+(?:Street|Road|Avenue|Boulevard|Lane))/i,
        /(\d+\s+[A-Za-z\s]+)/i, // Number followed by text
      ];

      for (const pattern of streetPatterns) {
        const match = placeName.match(pattern);
        if (match?.[1]) {
          street = match[1].trim();
          break;
        }
      }
    }

    // Construct detailed address
    const addressParts = [];
    if (buildingNumber) addressParts.push(buildingNumber);
    if (street) addressParts.push(street);
    if (district) addressParts.push(district);
    if (city) addressParts.push(city);
    if (province) addressParts.push(province);
    if (postalCode) addressParts.push(postalCode);
    if (country) addressParts.push(country);

    const fullAddress =
      addressParts.join(", ") ??
      result.place_name ??
      `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    const location: LocationData = {
      latitude: lat,
      longitude: lng,
      address: fullAddress,
      city,
      country,
      buildingNumber,
      street,
      district,
      province,
      postalCode,
      neighborhood,
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

    // Clear search results and hide dropdown
    setSearchResults([]);
    setSearchQuery("");
    setShowSearchResults(false);
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
            <div className="grid w-full grid-cols-1 gap-2 lg:grid-cols-4">
              <div
                className="relative col-span-1 lg:col-span-3"
                ref={searchContainerRef}
              >
                <Input
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch();
                  }}
                  onPressEnter={handleSearch}
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
                        onClick={() => {
                          handleSearchResultClick(result);
                        }}
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
                        {/* Show available detailed information */}
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

                        {/* Show helpful message when detailed info is limited */}
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
              💡 <strong>Hướng dẫn:</strong> Nhấp vào bản đồ để chọn vị trí hoặc
              sử dụng thanh tìm kiếm để tìm địa điểm cụ thể. Thử tìm kiếm với
              tên tòa nhà, địa chỉ cụ thể để có thông tin chi tiết hơn.
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
