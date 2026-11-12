# Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro)

[![MERN Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-orange.svg)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Fully%20Functional%20%26%20Verified-emerald.svg)](https://github.com)
[![Tests](https://img.shields.io/badge/Tests-17%2F17%20Passed%20(100%25)-blue.svg)](https://github.com)
[![Design](https://img.shields.io/badge/Theme-Dark%20Automotive%20Aesthetic-black.svg)](https://github.com)
[![University](https://img.shields.io/badge/Institution-SR%20University-navy.svg)](https://sru.edu.in)

> **Major Project Submission — Bachelor of Technology (B.Tech) in Computer Science & Engineering (AI & ML)**  
> **Student:** Shaik Asif &nbsp;|&nbsp; **Roll Number:** 2403a52220  
> **Faculty Guide:** Dr. N. Sharmila Banu &nbsp;|&nbsp; **Academic Year:** 2026-27  
> **Department:** School of Computer Science & Artificial Intelligence, SR University, Warangal, Telangana  

---

## 🎯 Executive Overview

**AutoCare Pro** is an enterprise-grade full-stack automotive service booking and maintenance management platform engineered to resolve the scheduling friction, opacity, and bay disorganization prevalent in traditional automobile workshops. Built with modern full-stack technologies (React 18, Vite 5, Tailwind CSS, Node.js, Express, and MongoDB), the application seamlessly integrates three key user roles: **Vehicle Owners (Customers)**, **Workshop Administrators**, and **Master Technicians (Mechanics)** through an automated 8-stage repair telemetry pipeline.

---

## 📦 Presentation & Submission Package

All deliverables required for submission, presentation, and viva defense are consolidated in **`FINAL_PROJECT_PRESENTATION_PACKAGE/`** and archived as a single download:

* **Official 42-Page Academic PDF Report:** [`Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.pdf`](./FINAL_PROJECT_PRESENTATION_PACKAGE/Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.pdf)
* **Editable Microsoft Word Report:** [`Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.docx`](./FINAL_PROJECT_PRESENTATION_PACKAGE/Online_Vehicle_Service_Booking_Project_Report_Shaik_Asif.docx)
* **Presentation Slides & Viva Defense Cheatsheet:** [`PRESENTATION_AND_VIVA_GUIDE.md`](./FINAL_PROJECT_PRESENTATION_PACKAGE/PRESENTATION_AND_VIVA_GUIDE.md)
* **1-Click Live Demo Launcher (Windows):** [`START_PROJECT_DEMO.bat`](./FINAL_PROJECT_PRESENTATION_PACKAGE/START_PROJECT_DEMO.bat)
* **7 Vector Engineering Architecture Diagrams:** Located in [`Project_Diagrams/`](./Project_Diagrams/) (Three-Tier, DFD Level 0 & 1, UML Use Case, ER Diagram, Activity Swimlanes, 8-Stage State Machine)
* **15 High-Resolution Application Screenshots:** Located in [`Project_Screenshots/`](./Project_Screenshots/)
* **Complete Downloadable Zip Archive:** [`AutoCare_Pro_Complete_Presentation_Package_Shaik_Asif.zip`](./AutoCare_Pro_Complete_Presentation_Package_Shaik_Asif.zip)

---

## 🚀 Key Features

### 👤 1. Customer Portal
- **Account & Fleet Registration:** Register cars, motorcycles, and scooters with registration number, brand, model, year, fuel type, and odometer mileage.
- **Interactive Service Catalog:** Browse factory-calibrated service packages, task checklists, and transparent pricing.
- **Smart Booking Wizard:** 4-step wizard with real-time bay capacity check to prevent duplicate appointments or bay overcrowding.
- **Live Service Telemetry:** 6-stage visual progress stepper tracking vehicle status from inspection to completion.
- **Digital Maintenance Log:** Permanent odometer-linked maintenance history records with next-service recommendations.
- **Simulated Payment Gateway:** Itemized bills with 18% GST calculation and simulated sandbox payment channels (Card, UPI, Net Banking).

### 🛡️ 2. Workshop Administrator Operations
- **Executive Operations Console:** Real-time KPI cards for revenue, active bay utilization, and fleet size.
- **Interactive Financial Visualizations:** Monthly revenue area charts, status distribution pie charts, and top-requested service packages powered by Recharts.
- **Bookings Management:** Review reservations, approve/reject requests, and allocate lead technicians based on real-time shift workload.
- **Personnel & Fleet Control:** Full customer registry, vehicle fleet database, and certified technician roster.
- **Spare Parts Inventory:** Real-time stock counts, SKU management, unit economics, and automated low-stock threshold alerts.
- **Auditing & Reporting:** Master ledger with 1-click CSV export and print-ready summary sheets.

### 🔧 3. Lead Technician / Mechanic Console
- **Work Order Queue:** View jobs assigned directly to your bay shift with customer complaints and vehicle specs.
- **Diagnostic Workbench:** Input OBD-II telemetry scan findings, log repair actions, and adjust labor hours.
- **Parts Requisition:** Requisition spare parts from workshop inventory with automatic stock deduction and billing synchronization.
- **One-Click Sign-Off:** Transition jobs to "Completed" to automatically generate customer invoices, log maintenance history, and trigger pickup notifications.

---

## 🔑 Demo Login Credentials

The database comes pre-seeded with realistic records across all 3 user roles:

| Role | Email Address | Password | Profile Details |
| :--- | :--- | :--- | :--- |
| **Workshop Admin** | `admin@autocare.com` | `Admin@123` | Chief Operations Manager |
| **Lead Mechanic** | `marcus.mechanic@autocare.com` | `Mechanic@123` | Master Tech (ASE-A1), Bay 1 |
| **Diagnostics Lead** | `elena.mechanic@autocare.com` | `Mechanic@123` | Electrical & AC Specialist, Bay 4 |
| **Customer 1** | `alex.customer@example.com` | `Customer@123` | Owns Honda Civic & Yamaha R15 |
| **Customer 2** | `priya.customer@example.com` | `Customer@123` | Owns Hyundai Creta (Has Unpaid Bill) |
| **Customer 3** | `david.customer@example.com` | `Customer@123` | Owns BMW 330i M Sport |

> **Pro Tip:** The login page also features **1-Click Quick Demo Sign-In Buttons** for instant evaluation without typing credentials.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, React Router v6, Axios, Lucide React, Recharts
- **Backend:** Node.js v22, Express.js 4, RESTful Architecture
- **Database:** MongoDB, Mongoose 8 (Embedded `mongodb-memory-server` with auto-fallback for plug-and-play local execution)
- **Security:** JWT (JSON Web Tokens), Bcrypt.js (Password Hashing with 10 salt rounds), Role-Based Authorization Middleware

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Quick Start

Both frontend and backend are pre-configured to run concurrently:

```bash
# Clone or navigate to the project directory
cd "c:\3YR 1SEM\Software E\vehicle-service-management"

# 1. Start the Backend API Server (runs on Port 5000)
cd backend
npm start

# 2. In a separate terminal, start the Frontend (runs on Port 5173)
cd ../frontend
npm run dev
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

Backend API Health Check:
👉 **`http://localhost:5000/api/health`**

### 3. Re-seeding the Database (Optional)
If you wish to reset the database to its pristine sample state:
```bash
cd server
node seed/seeder.js
```

---

## 🧪 Automated End-to-End Test Suite

Run the comprehensive 17-point integration test suite verifying authentication, vehicle creation, booking conflict checks, admin approval, technician repair updates, automatic invoicing, and payment processing:

```bash
cd backend
node test/e2e-workflow.test.js
```

**Expected Result:**
```
=============================================================
 STARTING FULL-STACK AUTOMATED VERIFICATION TEST SUITE
=============================================================
 ✅ PASS: 1. Backend API Health Check
 ✅ PASS: 2. Customer Authentication & Role Assignment
 ✅ PASS: 3. Workshop Administrator Login
 ✅ PASS: 4. Lead Technician / Mechanic Login
 ✅ PASS: 5. RBAC Protection: Customer denied access to /api/analytics/dashboard
 ✅ PASS: 6. Customer Self-Registration & Immediate Token Issuance
 ✅ PASS: 7. Vehicle Registration to Fleet
 ✅ PASS: 8. Services Catalog Retrieval
 ✅ PASS: 9. Service Booking Creation with Reference & Pending Status
 ✅ PASS: 10. Double Booking Conflict Prevention (Same vehicle, date, and slot rejected)
 ✅ PASS: 11. Administrator Booking Confirmation & Approval
 ✅ PASS: 12. Technician Bay Assignment & Notification Dispatch
 ✅ PASS: 13. Technician Work Commencement & Telemetry Progress Logging
 ✅ PASS: 14. Service Completion with Automatic Invoice Generation
 ✅ PASS: 15. Simulated Payment Gateway Processing & Receipt Settlement
 ✅ PASS: 16. Automated Maintenance Record Persistence in Vehicle Logbook
 ✅ PASS: 17. Customer Lifecycle Notifications Generated (Booking, Progress, Payment)

 🎉 ALL 17 END-TO-END WORKFLOW INTEGRATION TESTS PASSED 100%!
```

---

## 📂 Project Structure

```
vehicle-service-management/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Sidebar, Modals, Badges, Loaders
│   │   │   └── ...
│   │   ├── context/            # AuthContext, NotificationContext
│   │   ├── hooks/              # useAuth, useNotifications
│   │   ├── layouts/            # PublicLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── public/         # Home, About, Services, Contact, Login, Register
│   │   │   ├── customer/       # Dashboard, Vehicles, Book, Track, History, Invoices
│   │   │   ├── admin/          # Dashboard, Bookings, Customers, Fleet, Mechanics, Inventory
│   │   │   └── mechanic/       # Dashboard, AssignedJobs, JobDetails, CompletedJobs
│   │   ├── services/           # Axios REST API client modules
│   │   └── utils/              # Formatters, currency, constants
├── backend/
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # 11 REST controllers
│   ├── middleware/             # authMiddleware, roleMiddleware, errorMiddleware
│   ├── models/                 # 10 Mongoose schemas
│   ├── routes/                 # 12 Express API route modules
│   ├── seed/                   # Realistic demo dataset & seeder scripts
│   ├── test/                   # Automated E2E verification test suite
│   ├── .env.example
│   └── server.js               # Entry point
├── docs/
│   └── PROJECT_REPORT.md       # Complete 30-Section B.Tech Final Project Report
└── README.md
```

---

## 🎓 Academic Report
A complete, 30-section **B.Tech CSE (AI & ML) Project Report** with UML diagrams, system architecture, database ER design, test cases, and academic certificate templates is available in:
📁 `docs/PROJECT_REPORT.md`
