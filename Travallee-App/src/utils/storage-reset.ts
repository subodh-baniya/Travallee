import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Keep this list aligned with auth/session keys used across the app.
const SECURE_STORE_KEYS = ["userToken", "userData", "token", "hasOnboarded"];

export async function resetAppData(): Promise<void> {
  await AsyncStorage.clear();

  await Promise.all(
    SECURE_STORE_KEYS.map(async (key) => {
      try {
        await SecureStore.deleteItemAsync(key);
        await SecureStore.deleteItemAsync("token");
        await AsyncStorage.setItem('token', "");

      } catch {
        // Ignore key-level failures so reset can continue.
      }
    }),
  );
}

export async function getAsyncStorageSnapshot(): Promise<Record<string, string | null>> {
  const keys = await AsyncStorage.getAllKeys();
  const entries = await AsyncStorage.multiGet(keys);
  return Object.fromEntries(entries);
}
