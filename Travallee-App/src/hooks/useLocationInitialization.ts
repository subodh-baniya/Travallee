import { useEffect, useRef } from "react";
import { showLocationPrompt, requestLocationPermission, checkLocationPermissionStatus } from "@/src/services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hook that handles location permission request on app startup
 * Should be called at the root level during app initialization
 */
export function useLocationInitialization() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    (async () => {
      try {
        // Check if we've already asked for location permission in this session
        const lastAskedTime = await AsyncStorage.getItem("locationPermissionAskedAt");
        const now = Date.now();
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

        // Check current permission status
        const hasPermission = await checkLocationPermissionStatus();

        // Only ask if:
        // 1. User hasn't already granted permission AND
        // 2. We haven't asked in the last 30 days
        if (!hasPermission && (!lastAskedTime || now - parseInt(lastAskedTime) > thirtyDaysMs)) {
          // Show location prompt
          showLocationPrompt(
            async () => {
              // User allowed
              await requestLocationPermission();
              await AsyncStorage.setItem("locationPermissionAskedAt", String(now));
            },
            async () => {
              // User denied
              await AsyncStorage.setItem("locationPermissionAskedAt", String(now));
            }
          );
        }
      } catch (error) {
        console.error("Error during location initialization:", error);
      }
    })();
  }, []);
}
