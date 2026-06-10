import * as Location from "expo-location";
import { Alert } from "react-native";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export interface LocationResult {
  coords: LocationCoords;
  timestamp: number;
}

/**
 * Request location permission with user-friendly prompts
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
}

/**
 * Get current user location
 */
export async function getCurrentLocation(): Promise<LocationResult | null> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      },
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error("Error getting current location:", error);
    return null;
  }
}

/**
 * Check if location permission is granted
 */
export async function checkLocationPermissionStatus(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking location permission:", error);
    return false;
  }
}

/**
 * Get reverse geocoding (convert coordinates to address)
 */
export async function getAddressFromCoords(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (results.length > 0) {
      const address = results[0];
      const parts = [address.city, address.region, address.country].filter(Boolean);
      return parts.join(", ");
    }
    return null;
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    return null;
  }
}

/**
 * Get coordinates from address
 */
export async function getCoordsFromAddress(address: string): Promise<LocationCoords | null> {
  try {
    const results = await Location.geocodeAsync(address);

    if (results.length > 0) {
      return {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
        accuracy: null,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting coordinates from address:", error);
    return null;
  }
}

/**
 * Show location permission prompt with custom message
 */
export function showLocationPrompt(onAllow: () => void, onDeny: () => void) {
  Alert.alert(
    "📍 Location Access",
    "We need your location to provide better services nearby.\n\nAllow location access to find nearby places and improve your experience.",
    [
      {
        text: "Not Now",
        onPress: onDeny,
        style: "cancel",
      },
      {
        text: "Allow",
        onPress: onAllow,
        style: "default",
      },
    ],
    { cancelable: false }
  );
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
