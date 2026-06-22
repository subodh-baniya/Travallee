# **Travallee — Hotel Management System**

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-0.1.0-green?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)
![Status](https://img.shields.io/badge/status-In%20Development-yellow?style=flat-square)

A modern, full-stack **Hotel Management System** built with React, TypeScript, React Native, and Node.js microservices. Manage guests, rooms, bookings, payments, and more with a beautiful and intuitive interface.

## **Features**

### **Admin Dashboard**

* Real-time analytics and KPIs
* Guest management with detailed profiles
* Room inventory and occupancy tracking
* Revenue analytics and payment management
* Customer reviews and feedback
* Booking management and reservations
* Deal and promotion management

### **Mobile App (Travallee)**

* User authentication (coming soon)
* Browse available rooms
* Make bookings
* View booking history
* Payment integration
* Push notifications

### **Backend Services**

* Auth service (JWT-based)
* Guest management API
* Room booking system
* Payment processing
* Email notifications
* Admin management

---

## **Tech Stack**

### **Frontend**

* **React 19.2** with TypeScript 5.9
* **Vite 8.0** for fast builds
* **React Router v6** for navigation
* **Tailwind CSS 3.4** for styling
* **Zustand** for state management (optional)

### **Mobile**

* **React Native** with Expo
* **TypeScript** for type safety
* **React Navigation** for routing

### **Backend**

* **Node.js** with Express
* **TypeScript** for type safety
* **MongoDB/SQL** (configurable)
* **Docker** containerization
* **Microservices** architecture

---

## **Project Structure**

```text
Travallee/
├── Admin-Frontend/          # React admin dashboard
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── Travallee-App/           # React Native mobile app
├── Travallee-Backend/       # Backend microservices
│   ├── Packages/            # Shared utilities
│   └── Services/            # Individual microservices
├── User-Frontend/           # Public website (coming soon)
└── docker-compose.yml       # Docker setup
```

---

## **Quick Start**

### **Prerequisites**

* Node.js 18.0.0 or higher
* npm or yarn
* Docker (for backend services)

### **Quick Commands**

#### **Option 1: Full Stack with Docker (Recommended for Production)**

```bash
# Start all services at once
docker-compose up -d

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f auth
docker-compose logs -f admin
docker-compose logs -f bookings

# Stop all services
docker-compose down

# Rebuild images (after code changes)
docker-compose up -d --build
```

#### **Option 2: Individual Services (Development)**

```bash
# Terminal 1: Admin Frontend
cd Admin-Frontend && npm install && npm run dev

# Terminal 2: Mobile App
cd Travallee-App && npm install && npm start

# Terminal 3: Backend Auth Service
cd Travallee-Backend/Services/Auth && npm install && npm run dev

# Terminal 4: Backend Admin Service
cd Travallee-Backend/Services/admin && npm install && npm run dev

# Terminal 5: Backend Booking Service
cd Travallee-Backend/Services/booking && npm install && npm run dev

# Terminal 6: Backend Hotel Service
cd Travallee-Backend/Services/Hotel && npm install && npm run dev
```

#### **Option 3: Parallel NPM Scripts (All Frontends at Once)**

```bash
npm install

npm run dev:all

# Or manually
npm run dev:admin & npm run dev:user & npm run dev:app
```

#### **Option 4: Docker Compose + Manual Frontend (Hybrid)**

```bash
# Terminal 1: Start backend services only
docker-compose up -d

# Terminal 2: Run Admin Frontend locally
cd Admin-Frontend && npm install && npm run dev

# Terminal 3: Run Mobile App locally
cd Travallee-App && npm install && npm start
```

### **Standard Setup**

#### **Admin Frontend**

```bash
cd Admin-Frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

**Credentials**

```text
Email: admin@travallee.com
Password: admin123
```

#### **Mobile App**

```bash
cd Travallee-App
npm install
npm start
```

Scan the QR code with Expo Go.

#### **Backend Services**

```bash
docker-compose up -d
```

**Available Services**

* Auth: http://localhost:3000
* Admin: http://localhost:4001
* Bookings: http://localhost:5002
* Hotel: http://localhost:5003

---

## **Documentation**

* Admin Frontend Setup
* Mobile App Setup
* Backend API Documentation
* Contributing Guidelines
* Changelog
* Security Policy

---

## **Demo Credentials**

### **Admin Dashboard**

```text
Email: admin@travallee.com
Password: admin123
```

### **Additional Test Accounts**

```text
manager@travallee.com / manager123
test@example.com / test123
```

---

## **Sample Data**

The application includes pre-loaded sample data:

1. 10 Guests with various booking statuses
2. 8 Rooms across 5 floors
3. 4 Active Deals and promotions
4. 6 Vendors for payments
5. 5 Customer Reviews with ratings

All data is managed through mock API services for demonstration purposes.

---

## **Development**

### **Running Tests**

```bash
npm run test
```

### **Building for Production**

```bash
npm run build
```

### **Linting & Formatting**

```bash
npm run lint
npm run format
```

---

## **Reporting Issues**

Found a bug? Open an issue using the project's bug report template.

---

## **Feature Requests**

Have an idea? Submit a feature request with detailed requirements and use cases.

---

## **Contributing**

We welcome contributions.

1. Read the contribution guidelines.
2. Create a branch for your feature.
3. Follow code style guidelines.
4. Submit a pull request with implementation details.

---

## **License**

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## **Acknowledgments**

1. Built for hotel management professionals.
2. Special thanks to contributors and testers.
3. Icons and graphics sourced from open-source libraries.

---

## **Support**

* Email: [kcprabin2063@gmail.com](mailto:kcprabin2063@gmail.com)
* GitHub Discussions
* GitHub Issues

---

**Made with care by Prabin K.C.**
