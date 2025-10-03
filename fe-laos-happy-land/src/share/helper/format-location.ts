import type { Property } from "@/@types/types";

/**
 * Format location for display
 * Returns: "LocationInfo > District > Building# Street"
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

  // Add Building Number + Street/Address
  const addressParts: string[] = [];
  if (property.location?.buildingNumber) {
    addressParts.push(property.location.buildingNumber);
  }
  if (property.location?.street) {
    addressParts.push(property.location.street);
  } else if (property.location?.address) {
    addressParts.push(property.location.address);
  }
  if (addressParts.length > 0) {
    parts.push(addressParts.join(" "));
  }

  return parts.length > 0 ? parts.join(" > ") : fallback;
}

/**
 * Format short location for cards (just area and street)
 * Returns: "LocationInfo - Building# Street"
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

  // Add Building Number + Street
  const addressParts: string[] = [];
  if (property.location?.buildingNumber) {
    addressParts.push(property.location.buildingNumber);
  }
  if (property.location?.street) {
    addressParts.push(property.location.street);
  } else if (property.location?.address) {
    addressParts.push(property.location.address);
  }
  if (addressParts.length > 0) {
    parts.push(addressParts.join(" "));
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
