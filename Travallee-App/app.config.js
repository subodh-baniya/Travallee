import 'dotenv/config';

export default {
  expo: {
    name: "Travallee",
    slug: "travallee",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "app",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Travallee to access your location to provide better services nearby.",
        },
      ],
    ],
    
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "We need your location to provide better services nearby.",
        NSLocationAlwaysAndWhenInUseUsageDescription: "We need your location to show nearby places and improve your experience.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
      ],
    },
    web: {
      output: "static",
      
    },
    extra : {
      eas: {
        projectId: "d1b8c9e7-5a3c-4f0b-9c8e-2a1b2c3d4e5f"
      },
      apiBaseUrl: process.env.API_BASE_URL 
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    }
  }
};
