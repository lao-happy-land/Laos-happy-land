import type { Property } from "@/@types/types";

/**
 * Format location for display
 * Returns: "LocationInfo > District > Street"
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

  // Add District (from location.district or strict)
  if (property.location?.district) {
    parts.push(property.location.district);
  }

  // Add Street/Address
  if (property.location?.address) {
    parts.push(property.location.address);
  } else if (property.location?.street) {
    parts.push(property.location.street);
  }

  return parts.length > 0 ? parts.join(" > ") : fallback;
}

/**
 * Format short location for cards (just area and street)
 * Returns: "LocationInfo - Street"
 */
export function formatShortLocation(
  property: Property,
  fallback = "N/A",
): string {
  const parts: string[] = [];

  // Add LocationInfo name
  if (property.locationInfo?.name) {
    parts.push(property.locationInfo.name);
  }

  // Add Street
  if (property.location?.address) {
    parts.push(property.location.address);
  } else if (property.location?.street) {
    parts.push(property.location.street);
  }

  return parts.length > 0 ? parts.join(" - ") : fallback;
}

/**
 * Format full location with all details
 * Returns full address including city, province, country
 */
export function formatFullLocation(
  property: Property,
  fallback = "N/A",
): string {
  const parts: string[] = [];

  // Building number + Street
  const streetParts: string[] = [];
  if (property.location?.buildingNumber) {
    streetParts.push(property.location.buildingNumber);
  }
  if (property.location?.street || property.location?.address) {
    streetParts.push(
      property.location.street ?? property.location.address ?? "",
    );
  }
  if (streetParts.length > 0) {
    parts.push(streetParts.join(" "));
  }

  // District
  if (property.location?.district) {
    parts.push(property.location.district);
  }

  // LocationInfo (main area)
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
