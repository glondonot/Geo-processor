/**
 * Format a coordinate value with proper decimal places
 * @param value The coordinate value to format
 * @returns A string representation of the coordinate with 6 decimal places
 */
export function formatCoordinate(value: number): string {
  return value.toFixed(6);
}

/**
 * Format a timestamp to a human-readable date
 * @param timestamp The timestamp to format
 * @returns A formatted date string
 */
export function formatDate(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format a number as a distance in kilometers or meters
 * @param meters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format a number as an area in square kilometers or meters
 * @param squareMeters Area in square meters
 * @returns Formatted area string
 */
export function formatArea(squareMeters: number): string {
  if (squareMeters >= 1000000) {
    return `${(squareMeters / 1000000).toFixed(2)} km²`;
  }
  return `${Math.round(squareMeters)} m²`;
}
