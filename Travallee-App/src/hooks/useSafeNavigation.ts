import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook to safely navigate back in the app.
 * Only allows going back if there's a previous screen in the navigation stack.
 */
export function useSafeNavigation() {
  const router = useRouter();
  const navigation = useNavigation();

  const canGoBack = navigation?.canGoBack?.() ?? false;

  return {
    canGoBack,
    goBack: () => {
      if (canGoBack) {
        router.back();
      }
    },
  };
}
