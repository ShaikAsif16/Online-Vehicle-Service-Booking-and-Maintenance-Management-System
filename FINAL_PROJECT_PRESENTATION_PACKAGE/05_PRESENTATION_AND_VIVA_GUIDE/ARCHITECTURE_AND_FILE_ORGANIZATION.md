# Project File Architecture & Directory Organization

**Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro)**  
**Student:** Shaik Asif (Roll Number: `2403a52220`)  
**Department:** School of Computer Science & Artificial Intelligence, SR University, Warangal  
**Academic Year:** 2026-27  

---

## 1. Top-Level Project Layout

```
vehicle-service-management/
│
├── client/                                 # Frontend SPA (React 18 + Vite 5 + Tailwind CSS)
├── server/                                 # Backend REST API (Node.js + Express + MongoDB)
├── FINAL_PROJECT_PRESENTATION_PACKAGE/     # Consolidated Academic & Presentation Package
├── Project_Diagrams/                       # 7 High-Resolution System Architecture Diagrams (PNG)
├── Project_Screenshots/                    # 15 Verified Application UI Screenshots (PNG & JPG)
├── docs/                                   # Architectural & Academic Project Documentation
├── scripts/                                # Automation & Report Generation Python Scripts
│
├── START_PROJECT_DEMO.bat                  # 1-Click Windows Launcher for Dev Servers & UI
├── PUSH_TO_GITHUB.bat                      # 1-Click Interactive GitHub Deployment Script
├── AutoCare_Pro_Complete_Presentation_Package_Shaik_Asif.zip # 28.2 MB Full Submission Archive
├── package.json                            # Root Orchestrator Package Configuration
├── README.md                               # Master Project Overview & Evaluation Guide
└── .gitignore                              # Git Exclusion Rules (node_modules, dist, env, cache)
```

---

## 2. Backend Architecture (`server/`)

The backend follows an enterprise-standard **Layered MVC/Service Architecture** built with **Node.js, Express.js, and MongoDB (Mongoose ODM)**.

```
server/
├── config/
│   └── db.js                       # MongoDB connection orchestrator with automatic fallback to
│                                   # in-memory database (mongodb-memory-server) for zero-setup execution.
│
├── models/                         # Mongoose Data Schemas & Model Definitions (10 Models)
│   ├── User.js                     # User schema (roles: customer, admin, mechanic, bcrypt hash)
│   ├── Vehicle.js                  # Fleet registry (cars, motorcycles, scooters, regNo, odometer)
│   ├── Service.js                  # Service catalog (category, base price, duration, task checklist)
│   ├── Mechanic.js                 # Technician roster (specialization, bay number, active jobs)
│   ├── Booking.js                  # Service appointments (8-stage status machine, bay slot locks)
│   ├── SparePart.js                # Inventory tracking (SKU, unit cost, selling price, stock, threshold)
│   ├── Invoice.js                  # Financial billing (labor charge, spare parts BOM, GST, status)
│   ├── Payment.js                  # Settlement transactions (methods: card, upi, netbanking, cash)
│   ├── ServiceRecord.js            # Permanent vehicle maintenance history & digital logbook
│   └── Notification.js             # User lifecycle alerts (booking, bay progress, billing alerts)
│
├── controllers/                    # Business Logic & Request Handlers (12 REST Controllers)
│   ├── authController.js           # Registration, login, password encryption, JWT issuance
│   ├── userController.js           # User profile updates, customer directories
│   ├── vehicleController.js        # Vehicle CRUD operations, fleet filtering by fuel/type
│   ├── serviceController.js        # Service package creation, pricing adjustments, deletions
│   ├── mechanicController.js       # Technician assignment, bay workload balancing, ratings
│   ├── bookingController.js        # Slot collision checks, appointment approvals, cancellations
│   ├── inventoryController.js      # Stock adjustments, parts requisitions, threshold alerts
│   ├── invoiceController.js        # Automated BOM calculations, tax computations, bill retrieval
│   ├── paymentController.js        # Simulated payment processing, invoice status settlement
│   ├── maintenanceController.js    # Permanent service history logging and retrieval
│   ├── notificationController.js   # Notification polling, mark-as-read mutations
│   └── analyticsController.js      # Executive KPI telemetry, monthly revenue, bay distributions
│
├── middleware/                     # Express Interceptor & Security Pipelines
│   ├── authMiddleware.js           # JWT Bearer token verification and req.user attachment
│   ├── roleMiddleware.js           # Role-Based Access Control (RBAC) guards (admin, mechanic)
│   └── errorMiddleware.js          # Centralized error handler and JSON response standardizer
│
├── routes/                         # Express Route Definitions (Mounted under /api/...)
│   ├── authRoutes.js               # /api/auth (register, login, me)
│   ├── userRoutes.js               # /api/users (customer profiles, admin directories)
│   ├── vehicleRoutes.js            # /api/vehicles (fleet garage operations)
│   ├── serviceRoutes.js            # /api/services (catalog retrieval and admin mutations)
│   ├── mechanicRoutes.js           # /api/mechanics (technician profiles and bay assignments)
│   ├── bookingRoutes.js            # /api/bookings (booking creation, approvals, status updates)
│   ├── inventoryRoutes.js          # /api/inventory (spare parts CRUD and stock alerts)
│   ├── invoiceRoutes.js            # /api/invoices (billing generation, ledger inspections)
│   ├── paymentRoutes.js            # /api/payments (payment submissions and verification)
│   ├── maintenanceRoutes.js        # /api/maintenance (vehicle logbooks and service records)
│   ├── notificationRoutes.js       # /api/notifications (alerts and unread counters)
│   └── analyticsRoutes.js          # /api/analytics (dashboard charts and revenue trends)
│
├── seed/                           # Realistic Initial Data Generation
│   ├── seedData.js                 # Complete dataset: 3 admins, 3 mechanics, 4 customers, 6 vehicles,
│   │                               # 8 service packages, 10 spare parts, bookings, invoices
│   ├── inlineSeeder.js             # Automatic auto-seeder called on database connection
│   └── seeder.js                   # Standalone manual seeding CLI script (npm run seed)
│
├── test/                           # Automated Verification & Quality Assurance
│   ├── e2e-workflow.test.js        # 17-point integration test suite validating full workflow
│   └── test-login.js               # Fast auth sanity check script
│
├── .env.example                    # Template environment variables (PORT, JWT_SECRET, MONGODB_URI)
├── package.json                    # Backend dependencies and execution scripts
└── server.js                       # Primary server entrypoint: Express app initialization & route mounting
```

---

## 3. Frontend Architecture (`client/`)

The frontend is a reactive **Single Page Application (SPA)** developed with **React 18, Vite 5, Tailwind CSS, Lucide React icons, and Recharts**.

```
client/
├── public/                         # Static web assets
├── src/
│   ├── components/                 # Reusable UI Components
│   │   └── common/
│   │       ├── Navbar.jsx          # Public & authenticated header with navigation & user avatar
│   │       ├── Footer.jsx          # Automotive-themed footer with quick links and hotline
│   │       ├── Sidebar.jsx         # Collapsible responsive dashboard navigation with role filtering
│   │       ├── StatCard.jsx        # Premium KPI telemetry card with delta trend indicators
│   │       ├── StatusBadge.jsx     # Semantic color-coded badges for 8 service booking statuses
│   │       ├── Modal.jsx           # Accessible dialog window wrapper with backdrop blur
│   │       ├── ConfirmationModal.jsx # Destructive action confirmation dialog
│   │       ├── LoadingSpinner.jsx  # Automotive-themed loading indicator
│   │       └── NotificationBell.jsx # Interactive notification dropdown with live unread badge
│   │
│   ├── context/                    # React Context State Providers
│   │   ├── AuthContext.jsx         # Global user session state, login/logout, token storage
│   │   └── NotificationContext.jsx # Real-time notification polling and dismiss actions
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useAuth.js              # Easy consumer hook for AuthContext
│   │   └── useNotifications.js     # Easy consumer hook for NotificationContext
│   │
│   ├── layouts/                    # Application Shell Layouts
│   │   ├── PublicLayout.jsx        # Public pages wrapper (Navbar + Page Content + Footer)
│   │   └── DashboardLayout.jsx     # Authenticated console wrapper (Sidebar + Header + Page Content)
│   │
│   ├── pages/                      # Page Components Grouped by Access Role
│   │   ├── public/                 # Unauthenticated Guest Views
│   │   │   ├── Home.jsx            # Automotive landing page (Hero, Services, Why Us, Testimonials)
│   │   │   ├── About.jsx           # Workshop philosophy, certifications, ASE master techs
│   │   │   ├── Services.jsx        # Interactive customer service pricing and package catalog
│   │   │   ├── Contact.jsx         # Workshop hotline, bay address, operational hours, form
│   │   │   ├── Login.jsx           # Authentication portal with 1-Click Evaluator Demo Sign-In
│   │   │   ├── Register.jsx        # Customer account creation form
│   │   │   └── ForgotPassword.jsx  # Self-service password recovery flow
│   │   │
│   │   ├── customer/               # Customer Portal Views
│   │   │   ├── CustomerDashboard.jsx # Overview of registered fleet, recent bookings, quick actions
│   │   │   ├── MyVehicles.jsx      # Garage registry (add, edit, delete cars, bikes, scooters)
│   │   │   ├── BookService.jsx     # 4-step wizard: select vehicle -> package -> date/time -> complaints
│   │   │   ├── MyBookings.jsx      # Historical and active bookings with cancellation eligibility
│   │   │   ├── TrackService.jsx    # Real-time 8-stage repair telemetry progress stepper
│   │   │   ├── MaintenanceHistory.jsx # Permanent vehicle maintenance dossier and service logs
│   │   │   ├── Invoices.jsx        # Invoice browser, itemized BOM breakdown, simulated payment
│   │   │   ├── CustomerNotifications.jsx # Alerts center for booking & repair milestones
│   │   │   └── CustomerProfile.jsx # Personal profile and contact information editor
│   │   │
│   │   ├── admin/                  # Workshop Operations Center (Admin Console)
│   │   │   ├── AdminDashboard.jsx  # KPI cards, Recharts revenue curve, status distribution donut
│   │   │   ├── BookingManagement.jsx # Appointment moderation queue, technician assignment modal
│   │   │   ├── CustomerManagement.jsx # Directory of registered customers with vehicle inspection modal
│   │   │   ├── VehicleManagement.jsx # Fleet-wide registry with filters by vehicle type and fuel
│   │   │   ├── MechanicManagement.jsx # Technician roster, bay assignment, experience, status updates
│   │   │   ├── ServiceManagement.jsx # Dynamic service catalog editor (prices, checklists, duration)
│   │   │   ├── InventoryManagement.jsx # Spare parts stock control, SKU cataloging, low-stock warnings
│   │   │   ├── PaymentManagement.jsx # Billing master ledger, payment status tracking, invoice inspect
│   │   │   ├── ReportsAnalytics.jsx# Financial and operational analytics with CSV export capability
│   │   │   └── AdminSettings.jsx   # Workshop operational hours and system preferences
│   │   │
│   │   └── mechanic/               # Master Technician Bay Console
│   │       ├── MechanicDashboard.jsx # Active bay work orders, today's schedule, pending tasks
│   │       ├── AssignedJobs.jsx    # Queue of assigned vehicles with customer complaints
│   │       ├── JobDetails.jsx      # 8-stage progress updater, OBD-II notes, spare parts requisition
│   │       ├── CompletedJobs.jsx   # Historical log of completed service work orders
│   │       └── MechanicProfile.jsx # Technician credentials, certifications, active bay status
│   │
│   ├── services/                   # Axios REST API Client Modules
│   │   ├── api.js                  # Axios instance with request/response interceptors & JWT bearer
│   │   ├── authService.js          # Authentication API calls (login, register, getMe)
│   │   ├── vehicleService.js       # Fleet garage API calls
│   │   ├── serviceService.js       # Service package catalog API calls
│   │   ├── bookingService.js       # Booking creation, update, and technician assignment API calls
│   │   ├── mechanicService.js      # Technician roster and active bay query API calls
│   │   ├── inventoryService.js     # Spare parts stock and requisition API calls
│   │   ├── invoiceService.js       # Invoice generation and retrieval API calls
│   │   ├── paymentService.js       # Payment gateway simulation API calls
│   │   ├── maintenanceService.js   # Maintenance history log API calls
│   │   ├── notificationService.js  # Notifications query and mark-read API calls
│   │   └── analyticsService.js     # Admin KPI telemetry and chart aggregation API calls
│   │
│   ├── utils/
│   │   └── formatters.js           # Currency (₹ INR), date, odometer mileage, phone formatters
│   │
│   ├── App.jsx                     # Root router component defining public and role-protected routes
│   ├── main.jsx                    # React 18 DOM mount point with Auth & Notification providers
│   └── index.css                   # Global Tailwind CSS definitions and custom automotive scrollbars
│
├── index.html                      # HTML5 root template with automotive dark metadata
├── package.json                    # Frontend dependencies and Vite build scripts
├── postcss.config.js               # PostCSS configuration for Tailwind CSS
├── tailwind.config.js              # Custom Tailwind theme: charcoal backgrounds, automotive amber accents
├── vite.config.js                  # Vite bundler configuration with /api reverse proxy to port 5000
└── .env.example                    # Frontend environment template (VITE_API_URL)
```

---

## 4. End-to-End Data Flow & Communication Lifecycle

```
[ User Browser / Client SPA ]
           │
           ▼
[ React Component (e.g. BookService.jsx) ]
           │  (Calls bookingService.createBooking)
           ▼
[ Axios API Client (client/src/services/api.js) ]
           │  (Injects Bearer JWT Token via Request Interceptor)
           ▼
[ Vite Dev Proxy (Port 5173 -> Port 5000) ]
           │
           ▼
[ Express Server (server/server.js) ]
           │
           ▼
[ Auth & RBAC Middleware (authMiddleware.js, roleMiddleware.js) ]
           │  (Verifies JWT signature and checks user role permissions)
           ▼
[ Controller Logic (bookingController.js) ]
           │  (Validates time slot, checks bay collision, calculates totals)
           ▼
[ Mongoose ODM Layer (models/Booking.js, models/Vehicle.js) ]
           │
           ▼
[ MongoDB Database (Embedded MongoMemoryServer or External URI) ]
           │
           ▼
[ JSON HTTP Response -> React State Update -> Reactive DOM Rerender ]
```

---

## 5. Summary of Key Files

| Module | Location | Primary Role |
| :--- | :--- | :--- |
| **System Launcher** | `START_PROJECT_DEMO.bat` | Starts both backend and frontend servers in 1 click |
| **GitHub Deployment** | `PUSH_TO_GITHUB.bat` | Automates remote setup and git push to GitHub |
| **Backend Entry** | `server/server.js` | Initializes Express, mounts 12 routers, connects DB |
| **Database Config** | `server/config/db.js` | Auto-switching between MongoDB URI and MongoMemoryServer |
| **Frontend Entry** | `client/src/main.jsx` | Mounts React app, wraps providers |
| **Router & Guards** | `client/src/App.jsx` | Configures 25+ routes with RBAC role protection |
| **Master Test Suite** | `server/test/e2e-workflow.test.js` | 17 automated end-to-end integration tests (100% pass) |
| **Academic Report (PDF)** | `FINAL_PROJECT_PRESENTATION_PACKAGE/Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.pdf` | 42-page formatted report ready for submission |
| **Academic Report (Word)**| `FINAL_PROJECT_PRESENTATION_PACKAGE/Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.docx` | Fully editable submission document |
| **Viva Defense Guide** | `FINAL_PROJECT_PRESENTATION_PACKAGE/PRESENTATION_AND_VIVA_GUIDE.md` | Slide presentation outline and model answers |
