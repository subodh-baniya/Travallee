# User Frontend - Travallee Hotel Management System

The public-facing website for Travallee hotel management platform. Browse hotels, search availability, and manage bookings with a modern, responsive React TypeScript interface.

## 🎯 Features

- 🏨 **Hotel Browsing** - Discover available hotels and rooms
- 🔍 **Search & Filter** - Find perfect rooms by date, location, and amenities
- 📅 **Booking System** - Easy reservation management
- 👤 **User Accounts** - Sign up, login, and manage bookings
- 💳 **Payment Integration** - Secure payment processing
- ⭐ **Reviews & Ratings** - See guest reviews and ratings
- 📱 **Responsive Design** - Mobile-optimized interface

## 💻 Technology Stack

- **React 19.2** with TypeScript 5.9
- **Vite 8.0** for fast builds
- **Tailwind CSS 3.4** for styling
- **React Router v6** for navigation
- **Zustand** for state management (optional)

## 📁 Project Structure

```
src/
├── Pages/               # Page components
│   ├── InitialHome.tsx
│   ├── AboutUs.tsx
│   ├── Services.tsx
│   ├── ContactUs.tsx
│   └── Loginpage.tsx
├── Components/          # Reusable components
│   ├── InitialNav.tsx
│   ├── Herosection.tsx
│   └── Footer.tsx
├── Contexts/            # React Context
│   └── Authcontext.tsx
├── Routes/              # Routing configuration
│   └── Route.tsx
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
App opens at **http://localhost:5173**

### Production Build
```bash
npm run build
npm run preview
```

## 📝 Environment Variables

Create `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_AUTH_SERVICE_URL=http://localhost:3000/api/v1

# App Settings
VITE_APP_NAME=Travallee
VITE_MOCK_API=true
```

## 🎨 Styling

- **Tailwind CSS** for utility styles
- **Global styles** in `src/App.css`
- **Responsive design** with mobile-first approach
- **Plus Jakarta Sans** font family

## 🔗 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run linting
npm run format       # Format code
```

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License
