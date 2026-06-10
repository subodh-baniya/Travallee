import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import {
  getCurrentLocation,
  checkLocationPermissionStatus,
  getAddressFromCoords,
  LocationCoords,
  requestLocationPermission,
} from "@/src/services/locationService";

export interface UseLocationReturn {
  location: LocationCoords | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Check initial permission status
  useEffect(() => {
    (async () => {
      const hasPermission = await checkLocationPermissionStatus();
      setPermissionGranted(hasPermission);
      if (!hasPermission) {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch location when permission is granted
  useEffect(() => {
    if (!permissionGranted) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const loc = await getCurrentLocation();
        if (loc) {
          setLocation(loc.coords);
          // Get address from coordinates
          const addr = await getAddressFromCoords(loc.coords.latitude, loc.coords.longitude);
          setAddress(addr || "Unknown location");
        } else {
          setError("Could not get location");
        }
      } catch (err: any) {
        setError(err.message || "Failed to get location");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [permissionGranted]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const hasPermission = await requestLocationPermission();
      setPermissionGranted(hasPermission);
      if (!hasPermission) {
        setError("Location permission denied");
      }
      return hasPermission;
    } catch (err: any) {
      setError(err.message || "Failed to request permission");
      return false;
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!permissionGranted) return;
    setLoading(true);
    setError(null);
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        setLocation(loc.coords);
        const addr = await getAddressFromCoords(loc.coords.latitude, loc.coords.longitude);
        setAddress(addr || "Unknown location");
      } else {
        setError("Could not get location");
      }
    } catch (err: any) {
      setError(err.message || "Failed to get location");
    } finally {
      setLoading(false);
    }
  }, [permissionGranted]);

  return {
    location,
    address,
    loading,
    error,
    permissionGranted,
    requestPermission,
    refetch,
  };
}
