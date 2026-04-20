# Travallee Mobile App

React Native mobile application for the Travallee Hotel Management System. Built with Expo, TypeScript, and React Navigation for seamless hotel booking experience on iOS and Android.

## 🎯 Features

- 📱 **Native Mobile Experience** - iOS & Android support via Expo
- 🔐 **Secure Authentication** - JWT-based login
- 🏨 **Hotel Browsing** - Discover and filter hotels
- 🔍 **Room Search** - Advanced search with filters
- 📅 **Booking Management** - Create and manage reservations
- 💳 **Payment Processing** - Secure payment integration
- ⭐ **Reviews & Ratings** - Read and post reviews
- 🔔 **Push Notifications** - Stay updated on bookings
- 📍 **Location Services** - Find hotels nearby
- 🌙 **Dark Mode** - Beautiful dark theme support

## 💻 Technology Stack

- **React Native** - Cross-platform development
- **Expo** - Managed React Native framework
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **Expo Go** - Fast development preview

## 📁 Project Structure

```
src/
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen
│   ├── splash.tsx           # Splash screen
│   ├── (auth)/              # Auth flows
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (onboarding)/        # Onboarding flow
│   ├── (tabs)/              # Tab navigation
│   │   ├── explore.tsx
│   │   ├── bookings.tsx
│   │   └── profile.tsx
│   └── home/                # Home screens
├── components/              # Reusable components
│   ├── ui/
│   ├── onboarding/
│   └── realix/
├── constants/               # Global constants
│   ├── api.ts
│   ├── env.ts
│   ├── app/
│   └── screens/
├── context/                 # React Context
│   └── AuthContext.tsx
├── hooks/                   # Custom hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── schema/                  # Validation schemas
│   ├── loginschema.ts
│   └── registerschema.ts
├── services/                # API services
│   └── onboarding.service.ts
├── utils/                   # Utility functions
└── assets/                  # Images & icons
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0+
- **Expo CLI** - `npm install -g expo-cli`
- **Expo Go App** - Download from App Store / Google Play
- Same WiFi network as development computer

### Installation
```bash
npm install
```

### Development Setup

#### Option 1: Expo Go (Easiest - Recommended)
```bash
# Terminal 1: Ensure backend is running
cd ../Travallee-Backend
docker-compose up -d

# Terminal 2: Start Expo
cd ../Travallee-App
npm start

# When prompted, press 'w' for web preview, or:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'j' to open Expo DevTools
```

Then:
1. Open **Expo Go app** on your physical device
2. Scan the QR code from terminal
3. App loads in seconds!

#### Option 2: Development Build
```bash
npm install
npm run build:dev          # Build development version
npm start                   # Run on device
```

#### Option 3: Android Emulator
```bash
npm start
# When prompted, press 'a'
# Requires Android Studio & emulator setup
```

#### Option 4: iOS Simulator
```bash
npm start
# When prompted, press 'i'
# Requires macOS & Xcode
```

#### Option 5: Web Preview
```bash
npm start
# When prompted, press 'w'
# Opens in browser at http://localhost:19006
```

## 📝 Environment Variables

Create `.env` file in project root:

```env
# ===== API CONFIGURATION =====
API_BASE_URL=http://YOUR_COMPUTER_IP:4000/api/v1
AUTH_SERVICE_URL=http://YOUR_COMPUTER_IP:3000/api/v1
BOOKING_SERVICE_URL=http://YOUR_COMPUTER_IP:5002/api/v1
HOTEL_SERVICE_URL=http://YOUR_COMPUTER_IP:5003/api/v1

# ===== APP CONFIGURATION =====
APP_NAME=Travallee
APP_VERSION=0.1.0
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:4000/api/v1

# ===== FEATURE FLAGS =====
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_LOCATION_SERVICES=true
MOCK_API=false

# ===== ENVIRONMENT =====
ENVIRONMENT=development
```

**Important:** Replace `YOUR_COMPUTER_IP` with your actual IP address:

```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr "IPv4"
```

Example:
```env
API_BASE_URL=http://192.168.1.100:4000/api/v1
```

**For Expo Go on physical device:**
- Update `app.config.js` with your computer's IP
- Example: `API_URL: "http://192.168.1.100:4000"` (no https)

## 🛠️ Available Scripts

```bash
# Development
npm start               # Start Expo CLI
npm run android        # Launch Android emulator
npm run ios            # Launch iOS simulator
npm run web            # Preview in web browser

# Building
npm run build          # Build app
npm run build:dev      # Development build
npm run build:preview  # Preview build

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix linting issues
npm run type-check     # TypeScript validation

# Database
npm run reset-project  # Reset to clean state

# Others
npm run eject          # Eject from Expo (not reversible)
```

## 🔐 Authentication Flow

### Login
```typescript
1. User enters email/password
2. Request sent to Auth Service (port 3000)
3. JWT token received and stored in AsyncStorage
4. User redirected to home screen
5. Token sent with subsequent API requests
```

### Automatic Token Refresh
```typescript
// Token stored in secure storage
await AsyncStorage.setItem('authToken', token);

// Token attached to requests
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
```

## 🌐 Connecting to Backend

### Docker Backend
```bash
# Start backend services
cd ../Travallee-Backend
docker-compose up -d

# Check services are running
docker-compose ps

# Get your computer's IP
ifconfig  # macOS/Linux
ipconfig  # Windows

# Update .env with IP
API_BASE_URL=http://192.168.X.X:4000/api/v1
```

### Manual Backend Services
```bash
# Terminal 1: Auth Service
cd Travallee-Backend/Services/Auth
npm install && npm run dev

# Terminal 2: Hotel Service
cd Travallee-Backend/Services/Hotel
npm install && npm run dev

# Terminal 3: Booking Service
cd Travallee-Backend/Services/booking
npm install && npm run dev

# Terminal 4: Admin Service
cd Travallee-Backend/Services/admin
npm install && npm run dev
```

## ⚙️ Expo Configuration

Key settings in `app.config.js`:

```javascript
{
  "expo": {
    "name": "Travallee",
    "slug": "travallee",
    "version": "0.1.0",
    "assetBundlePatterns": ["**/*"],
    "ios": { "supportsTabletMode": true },
    "android": {
      "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" },
      "package": "com.travallee.app"
    },
    "orientation": "portrait",
    "backgroundColor": "#ffffff"
  }
}
```

## 📦 Key Dependencies

```json
{
  "expo": "^52.0.0",
  "react-native": "^0.76.0",
  "typescript": "^5.3.0",
  "expo-router": "^3.5.0",
  "@react-navigation/native": "^6.0.0",
  "@expo-google-fonts/plus-jakarta-sans": "^0.2.3",
  "expo-constants": "^16.0.0",
  "expo-splash-screen": "^0.27.0"
}
```

## 🎨 Styling

- **No external UI library** - Everything built from scratch
- **Responsive design** - Works on phones and tablets
- **Dark mode support** - Via system preference detection
- **Custom components** - Fully customizable

## 🐛 Troubleshooting

### Issue: Can't Connect to Backend
**Solution:**
```bash
# 1. Verify backend is running
docker-compose ps

# 2. Get your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# 3. Update .env with correct IP
API_BASE_URL=http://YOUR_IP:4000/api/v1

# 4. Reload app with 'r' in Expo CLI
```

### Issue: AsyncStorage Read Stalls Navigation
**Solution:** Ensure AsyncStorage reads use proper async/await:
```typescript
// ❌ Wrong
const token = AsyncStorage.getItem('token');
if (!token) navigate('login');

// ✅ Correct
useEffect(() => {
  (async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) navigate('login');
  })();
}, []);
```

### Issue: Expo Go App Crashes
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules .expo
npm install
npm start

# Then press: c (clear cache)
```

### Issue: Changes Not Reflected
**Solution:**
```bash
# Hard reload
npm start
# Press 'r' twice for hard reload
# Or close and reopen Expo Go
```

### Issue: Dependencies Conflict
**Solution:**
```bash
npm install
npm start
# If still issues: npm install --legacy-peer-deps
```

## 📱 Device Testing

### Physical Device (Recommended)
1. Ensure phone & computer on same WiFi
2. Open **Expo Go** app
3. Scan QR code from terminal
4. App launches instantly!

### Emulator/Simulator
```bash
npm start
# Press 'i' (iOS) or 'a' (Android)
# Requires Xcode or Android Studio
```

### Web Preview
```bash
npm start
# Press 'w'
# Tests on browser, not native functionality
```

## 🚀 Building for Release

### Android APK
```bash
eas build --platform android
```

### iOS App
```bash
eas build --platform ios
```

### Both Platforms
```bash
eas build --platform all
```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Expo Router Guide](https://docs.expo.dev/routing/introduction/)
- [AsyncStorage API](https://react-native-async-storage.github.io/async-storage/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License
