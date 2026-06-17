# Architecture Guide

## Overview
Travellee is a distributed hotel management system with three main layers:

```
┌─────────────────────────────────────────────────────┐
│         Frontend Layer                              │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │  Admin Dashboard │      │  Mobile App      │    │
│  │  (React)         │      │  (React Native)  │    │
│  └──────────────────┘      └──────────────────┘    │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│         API Layer                                   │
│  (REST APIs from Node.js Microservices)            │
└─────────────────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────────────────┐
│         Data Layer                                  │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │  Database        │      │  Cache (Redis)   │    │
│  │  (MongoDB/SQL)   │      │  (Optional)      │    │
│  └──────────────────┘      └──────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Microservices Architecture

Each service handles a specific domain:

### Auth Service
- User registration and login
- JWT token generation
- Password management
- Role-based access control

### Hotel Service
- Room management
- Hotel inventory
- Room types and pricing
- Floor management

### Booking Service
- Create and manage bookings
- Check-in/check-out
- Availability management
- Booking history

### Payment Service
- Payment processing
- Invoice generation
- Refund management
- Payment history

### Admin Service
- User management
- Analytics and reports
- System configuration
- Audit logs

### Notifications Service
- Email notifications
- SMS alerts
- Push notifications
- Message templates

## Frontend Architecture

### Admin Dashboard (React)

```
src/
├── components/
│   ├── ui/              # Base UI components
│   │   ├── Button
│   │   ├── Card
│   │   ├── Modal
│   │   └── ...
│   └── layout/          # Layout components
│       ├── Sidebar
│       ├── Topbar
│       └── PageWrapper
├── pages/               # Page components
│   ├── DashboardPage
│   ├── GuestPage
│   ├── RoomPage
│   └── ...
├── hooks/               # Custom hooks
│   ├── useAuth
│   ├── useModal
│   └── usePagination
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
└── data/                # Mock data
    └── mock.ts
```

### Component Hierarchy

```
<App>
  <Router>
    <AppRoutes>
      {/* Public Route */}
      <LoginPage>

      {/* Protected Routes */}
      <AuthenticatedLayout>
        <Sidebar>
        <Topbar>
        <PageWrapper>
          <DashboardPage />
          <GuestPage />
          <RoomPage />
          ...
        </PageWrapper>
```

## Data Flow

### Authentication Flow
1. User enters credentials on LoginPage
2. Credentials sent to API
3. Backend validates and returns JWT token
4. Token stored in localStorage
5. Token sent with all subsequent API requests

### Page Navigation Flow
1. User clicks navigation link in Sidebar
2. React Router updates URL
3. Corresponding page component renders
4. useEffect fetches data from API
5. Component state updates and re-renders

### Modal/Drawer Flow
1. User clicks trigger button
2. useModal hook opens modal/drawer
3. Form input captured
4. Submit calls API function
5. Modal closes on success
6. Page data refreshes

## Styling

Using **Tailwind CSS** for all styles:
- No custom CSS files for components
- Utility-first approach
- Responsive design with breakpoints
- Color palette: Blues (#4285F4), Greens, Grays

## State Management

Current approach:
- React hooks for local state
- localStorage for authentication
- API calls with Promises

Future:
- Consider Zustand or Redux for global state

## Error Handling

- TypeScript for type safety
- Try-catch blocks in async functions
- User-friendly error messages
- Logging for debugging

## Performance Considerations

- Code splitting with React Router
- Lazy loading of components (add splitting)
- Memoization of expensive computations
- Pagination for large data lists

## Testing Strategy

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API flows
- E2E tests for critical user paths

## Deployment

### Admin Frontend
- Build: `npm run build`
- Static hosting (Vercel, Netlify, S3)
- Environment variables for API URL

### Backend Services
- Docker containerization
- Kubernetes orchestration (optional)
- CI/CD pipeline for automated deployment
- Database migrations

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_ENV=development
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DB_URL=mongodb://localhost:27017/travallee
JWT_SECRET=your-secret-key
```

---

For more details, see the individual README files in each service folder.
