import type { Property, LocationDto } from "@/@types/types";

/**
 * Format location for display
 * Returns: "LocationInfo > District > Address"
 * @param property - Property object with location and locationInfo
 * @param fallback - Fallback text if no location available
 * @returns Formatted location string
 */
export function formatLocation(property: Property, fallback = "N/A"): string {
  const parts: string[] = [];

  // Add LocationInfo name (main area/province)
  if (property.locationInfo?.name) {
    parts.push(property.locationInfo.name);
  }

  // Add District (from location.district)
  if (property.location?.district) {
    parts.push(property.location.district);
  }

  // Add Address (primary field - manually entered by user)
  if (property.location?.address) {
    parts.push(property.location.address);
  }

  return parts.length > 0 ? parts.join(" > ") : fallback;
}

/**
 * Format short location for cards (just area and address)
 * Returns: "LocationInfo - Address"
 */
export function formatShortLocation(
  property: Property,
  fallback = "N/A",
): string {
  const parts: string[] = [];

  if (property.location?.address) {
    parts.push(property.location.address);
  }

  if (property.location?.district) {
    parts.push(property.location.district);
  }

  if (property.locationInfo?.name) {
    parts.push(property.locationInfo.name);
  }

  return parts.length > 0 ? parts.join(" - ") : fallback;
}

/**
 * Format full location with all details
 * Returns full address including district, city, province, country
 */
export function formatFullLocation(
  property: Property,
  fallback = "N/A",
): string {
  const parts: string[] = [];

  // Address (primary field - manually entered by user)
  if (property.location?.address) {
    parts.push(property.location.address);
  }

  // District
  if (property.location?.district) {
    parts.push(property.location.district);
  }

  // LocationInfo (main area/province)
  if (property.locationInfo?.name) {
    parts.push(property.locationInfo.name);
  }

  // City
  if (property.location?.city) {
    parts.push(property.location.city);
  }

  // Province
  if (property.location?.province) {
    parts.push(property.location.province);
  }

  // Country
  if (property.location?.country) {
    parts.push(property.location.country);
  }

  return parts.length > 0 ? parts.join(", ") : fallback;
}

/**
 * Format location data directly (without Property object)
 * Returns: "Address, District, City, Country"
 * @param location - LocationDto object
 * @param fallback - Fallback text if no location available
 * @returns Formatted location string
 */
export function formatLocationData(
  location: LocationDto | null,
  fallback = "N/A",
): string {
  if (!location) return fallback;

  const parts: string[] = [];

  // Address (primary field - manually entered by user)
  if (location.address) {
    parts.push(location.address);
  }

  // District
  if (location.district) {
    parts.push(location.district);
  }

  // City
  if (location.city) {
    parts.push(location.city);
  }

  // Province
  if (location.province) {
    parts.push(location.province);
  }

  // Country
  if (location.country) {
    parts.push(location.country);
  }

  return parts.length > 0 ? parts.join(", ") : fallback;
}

/**
 * Format short location data (address and district only)
 * Returns: "Address, District"
 * @param location - LocationDto object
 * @param fallback - Fallback text if no location available
 * @returns Formatted location string
 */
export function formatShortLocationData(
  location: LocationDto | null,
  fallback = "N/A",
): string {
  if (!location) return fallback;

  const parts: string[] = [];

  // Address (primary field - manually entered by user)
  if (location.address) {
    parts.push(location.address);
  }

  // District
  if (location.district) {
    parts.push(location.district);
  }

  return parts.length > 0 ? parts.join(", ") : fallback;
}
