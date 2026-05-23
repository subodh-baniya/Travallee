import 'dotenv/config';

export default {
  expo: {
    owner: "kcprabin",

    name: "Travallee",
    slug: "travallee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Logo.png",
    scheme: "app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow Travallee to access your location to provide better services nearby.",
        },
      ],
    ],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.travallee",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "We need your location to provide better services nearby.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "We need your location to show nearby places and improve your experience.",
      },
    },

    android: {
      package: "com.anonymous.travallee",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
      },
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
      ],
    },

    web: {
      output: "static",
    },

    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: "6b1fbe09-3646-460b-a47e-5f5b5989fabf",
      },
    },

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};