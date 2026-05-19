# 🏢 Superadmin Dashboard

A comprehensive **Admin Dashboard** for system administrators to manage hotels, guests, rooms, bookings, payments, analytics, and system configuration.

## 📋 Overview

The Superadmin Dashboard provides complete control over the Travallee Hotel Management System with real-time analytics, user management, room inventory tracking, and payment monitoring.

### Key Features
- 📊 Real-time analytics and KPIs dashboard
- 👥 User/Guest management
- 🏨 Hotel and room inventory management
- 📅 Booking and reservation tracking
- 💳 Payment and revenue analytics
- ⭐ Customer reviews and feedback
- 🎯 Deal & promotion management
- 🔧 System settings and configuration
- 📊 Advanced reporting

---

## 🛠️ Tech Stack

| Aspect | Technology |
|--------|-----------|
| **Framework** | React 18.2 |
| **Language** | TypeScript 5.9 |
| **Build Tool** | Vite 5+ |
| **Styling** | Tailwind CSS 4.2 |
| **Navigation** | React Router v7 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **HTTP Client** | Axios |
| **Form Handling** | React Hook Form |
| **State Management** | React Context API |

---

## 📂 Project Structure

```
Superadmin/
├── public/                     # Static assets
├── src/
│   ├── app.jsx                 # Root app component
│   ├── index.css               # Global styles
│   ├── main.jsx                # Entry point
│   ├── theme.js                # Theme configuration
│   │
│   ├── components/             # Reusable UI components
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── Toggle.jsx          # Theme toggle
│   │   └── Topbar.jsx          # Header/topbar
│   │
│   └── pages/                  # Page components
│       ├── Dashboard.jsx       # Main dashboard
│       ├── Analytics.jsx       # Analytics page
│       ├── Users.jsx           # User management
│       ├── Ads.jsx             # Advertisements
│       ├── AppPage.jsx         # App management
│       ├── Website.jsx         # Website management
│       ├── Settings.jsx        # System settings
│       └── ComingSoon.jsx      # Placeholder page
│
├── package.json                # Dependencies
├── vite.config.js             # Vite configuration
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Navigate to directory
cd Superadmin

# Install dependencies
npm install

# Create environment file (if needed)
cp .env.example .env

# Start development server
npm run dev
```

### Development Server

```bash
npm run dev
```

Runs on: **http://localhost:5173**

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Component Details

### Core Components

#### **Sidebar.jsx**
- Main navigation menu
- Route links for all admin pages
- Responsive design
- Collapsible on mobile

**Location:** [src/components/Sidebar.jsx](src/components/Sidebar.jsx)

#### **Topbar.jsx**
- Header with title and user info
- System notifications
- User profile menu
- Logout functionality

**Location:** [src/components/Topbar.jsx](src/components/Topbar.jsx)

#### **Toggle.jsx**
- Theme switcher (light/dark mode)
- Persists theme preference

**Location:** [src/components/Toggle.jsx](src/components/Toggle.jsx)

---

## 📄 Pages

### Dashboard
- **File:** [pages/Dashboard.jsx](src/pages/Dashboard.jsx)
- **Purpose:** Main overview with KPIs and metrics
- **Data:** Real-time hotel statistics, guest count, revenue

### Analytics
- **File:** [pages/Analytics.jsx](src/pages/Analytics.jsx)
- **Purpose:** Advanced analytics with charts and trends
- **Features:** Revenue trends, occupancy rates, guest demographics

### Users
- **File:** [pages/Users.jsx](src/pages/Users.jsx)
- **Purpose:** Manage guests and staff
- **Features:** User list, search, edit, delete, roles

### Bookings
- **File:** [pages/Bookings.jsx](src/pages/Bookings.jsx)
- **Purpose:** Track all reservations
- **Features:** Booking list, status, check-in/out

### Settings
- **File:** [pages/Settings.jsx](src/pages/Settings.jsx)
- **Purpose:** System configuration
- **Features:** Email config, payment settings, hotel settings

---

## 🔌 API Integration

The dashboard communicates with backend services via REST APIs:

```javascript
// Example API calls
const APIs = {
  auth: 'http://localhost:3000/api/auth',
  hotel: 'http://localhost:3001/api/hotels',
  booking: 'http://localhost:5002/api/bookings',
  admin: 'http://localhost:4001/api/admin'
}
```

### Typical Flow
1. User logs in via Auth Service
2. JWT token stored in localStorage
3. Token included in all API requests
4. Services return data for dashboard display

---

## 🎨 Theming

Theme configuration is in [src/theme.js](src/theme.js):
- Color schemes (light/dark)
- Tailwind CSS configuration
- Custom color palette

### Using Theme
```jsx
import { useTheme } from './context/ThemeContext';

export default function Component() {
  const { isDark, toggleTheme } = useTheme();
  return <div className={isDark ? 'bg-gray-900' : 'bg-white'}>...</div>;
}
```

---

## 📦 Dependencies

### Core
- **react** (18.2) - UI library
- **react-dom** (18.2) - React DOM rendering
- **react-router-dom** (7.0) - Routing

### Styling & UI
- **tailwindcss** (4.2) - CSS framework
- **framer-motion** (11.0) - Animations
- **recharts** (2.5) - Charts library

### HTTP & State
- **axios** (1.6) - HTTP client
- **react-hook-form** - Form handling

### Development
- **typescript** (5.9) - Type safety
- **vite** (5.0) - Build tool
- **@vitejs/plugin-react** - React plugin for Vite

---

## 🔐 Security

- ✅ Protected routes (authentication required)
- ✅ JWT token validation
- ✅ XSS protection via React's built-in sanitization
- ✅ CSRF protection
- ✅ Role-based access control

---

## 📱 Responsive Design

Dashboard is fully responsive:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

Uses Tailwind CSS breakpoints:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Cards that stack on mobile */}
</div>
```

---

## 🐛 Debugging

Enable debug mode:
```bash
DEBUG=travallee:* npm run dev
```

Check browser console for logs and network requests.

---

## 📚 Related Documentation

- [Root README](../README.md) - Project overview
- [Setup Guide](../docs/SETUP.md) - Installation guide
- [Architecture](../docs/ARCHITECTURE.md) - System architecture

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy 'dist' folder to Vercel
```

### Docker
```bash
docker build -t superadmin:latest .
docker run -p 5173:5173 superadmin:latest
```

### Manual
```bash
npm run build
npm run preview  # Local preview
# Upload dist/ to your server
```

---

## 💡 Tips & Best Practices

- Use `React DevTools` for debugging
- Keep components modular and reusable
- Use TypeScript for type safety
- Test thoroughly before deployment
- Monitor performance with DevTools
- Use environment variables for API URLs

---

## 📞 Support & Issues

For issues or improvements:
1. Check [docs](../docs/)
2. Review existing issues/PRs
3. Create new issue with details
4. Follow project contribution guidelines

---

**Maintained as part of the Travallee Hotel Management System**
