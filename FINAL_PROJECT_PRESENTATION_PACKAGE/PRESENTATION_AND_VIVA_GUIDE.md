# AutoCare Pro - Project Presentation & Viva Defense Guide

**Project Title:** Online Vehicle Service Booking and Maintenance Management System  
**Student Name:** Shaik Asif  
**Roll Number:** 2403a52220  
**Department:** School of Computer Science & Artificial Intelligence (B.Tech CSE - AI & ML)  
**Faculty Guide:** Dr. N. Sharmila Banu  
**Institution:** SR University, Warangal – 506371, Telangana  
**Academic Year:** 2026-27  

---

## 1. 10-Minute Slide Presentation Outline

### Slide 1: Title & Introduction
- **Project Title:** Online Vehicle Service Booking and Maintenance Management System (AutoCare Pro)
- **Problem Context:** Automotive workshops struggle with paper job sheets, phone-based scheduling, lack of live repair tracking, uneven technician workloads, and billing discrepancies.
- **Solution:** A modern, cloud-ready full-stack MERN platform uniting vehicle owners, workshop managers, and mechanics.

### Slide 2: Problem Statement & Objectives
- **Key Bottlenecks:** Booking collisions, zero customer repair visibility, unoptimized bay dispatching, unrecorded spare parts, billing opacity.
- **Objectives:**
  1. Conflict-free slot booking engine with complaint capture.
  2. Real-time 8-stage repair telemetry stepper.
  3. Executive administrative dashboard with KPI charts and workload leveling.
  4. Mechanic job workstation with diagnosis logging and parts requisitioning.
  5. Automated invoicing aggregating labor rates, consumed parts (BOM), and statutory tax.

### Slide 3: Three-Tier System Architecture
- **Presentation Tier:** React 18, Vite 5, Tailwind CSS (dark automotive theme), React Router, Lucide Icons, Recharts.
- **Application Tier:** Node.js, Express.js REST API, JWT session security, salted bcrypt hashing, RBAC middleware.
- **Data Tier:** MongoDB, Mongoose ODM, with embedded `MongoMemoryServer` fallback engine.

### Slide 4: Key Functional Roles & Workflows
- **Customer:** Fleet garage registration (cars, motorcycles, scooters), transparent catalog browsing, slot booking, live bay tracking, historical repair dossier, invoice payments.
- **Admin:** Workshop Operations Center, revenue analytics, appointment moderation (approve/reject), mechanic workload assignment, parts inventory control, financial ledger.
- **Technician:** Work order retrieval, 8-stage status progression, diagnostic & road-test notes, spare parts requisitioning.

### Slide 5: Database Architecture & Design
- **10 Core Collections:** `User`, `Vehicle`, `Service`, `Mechanic`, `SparePart`, `Booking`, `Invoice`, `Payment`, `ServiceRecord`, `Notification`.
- **Referential Integrity & Indexing:** Indexed on unique email, registration numbers, booking references, and part SKUs for $O(1)$ lookups.

### Slide 6: Security & Data Protection
- Cryptographic bcrypt salted hashing (10 rounds).
- Stateless short-lived JSON Web Tokens (JWT).
- Role-Based Access Control (RBAC) middleware guards on every sensitive endpoint.
- Complete mitigation of NoSQL injection and parameter tampering.

### Slide 7: Live Demonstration & Key UI Modules
- **Login Portal:** 1-Click Evaluator Demo Sign-In (Admin, Mechanic, Customers).
- **Admin Operations Center:** Live KPI cards, inventory alert banners, 6-month revenue curve, status donut.
- **Bookings Management:** Queue moderation and technician assignment.
- **Technician Bay Console:** Diagnostic logging, road-test remarks, parts deductions.
- **Invoices Ledger:** Dynamic Bill of Materials (BOM) calculation and payment settlement.

### Slide 8: Verification & Testing Results
- Automated integration test suite (`server/test/e2e-workflow.test.js`):
  - **17 / 17 Test Scenarios Passed (100% Success Rate)**.
  - Zero data collisions under concurrent booking requests.
  - Sub-50ms REST API response latencies.

### Slide 9: Conclusion & Future Scope
- **Conclusion:** Replaces manual ledgers with a production-ready, transparent workshop platform.
- **Future Enhancements:**
  1. IoT OBD-II dongle telemetry for live engine DTC code capture.
  2. Machine learning predictive maintenance based on mileage patterns.
  3. React Native iOS/Android mobile applications.
  4. Real-time payment gateway webhooks (UPI QR / Stripe).

---

## 2. Common Viva Voce Questions & Model Answers

**Q1: Why did you choose the MERN stack instead of traditional SQL/PHP?**  
*Answer:* MERN stack provides an end-to-end JavaScript environment. React 18's virtual DOM enables reactive bay dashboards without full page reloads. Node.js's asynchronous non-blocking event loop handles high-concurrency scheduling requests efficiently, and MongoDB's BSON document model natively represents polymorphic vehicle parameters and variable checklist items without expensive multi-table joins.

**Q2: How do you prevent double-booking collisions when two customers choose the same slot?**  
*Answer:* The booking controller (`server/controllers/bookingController.js`) executes an atomic query check before saving. It searches for existing active bookings matching the same appointment date, time slot, and service bay with status other than 'Cancelled' or 'Rejected'. If found, it immediately rejects the second request with a 400 Bad Request error.

**Q3: How does the system handle spare parts inventory during repair?**  
*Answer:* When a technician requisitions parts in the bay, the system performs an atomic `$inc` decrement on the part's `stockQuantity` in the database. If stock drops below `minThreshold`, the part status automatically flags 'Low Stock', triggering real-time warning banners in the Admin Operations Center. Simultaneously, the part cost is dynamically added to the booking's Invoice Bill of Materials.

**Q4: How does authentication and role authorization work?**  
*Answer:* Passwords are encrypted using bcrypt with 10 salt rounds. On login, the server generates a signed JSON Web Token (JWT) containing the user's ID, role, and email. The client attaches this token as a `Bearer` token in HTTP headers. The backend `authMiddleware.js` decodes and verifies the signature and validates whether `req.user.role` matches the route's allowed roles.

**Q5: What happens if MongoDB is not installed on the evaluation machine?**  
*Answer:* AutoCare Pro includes an automated zero-dependency fallback engine using `mongodb-memory-server`. If an external MongoDB instance is not detected, the server automatically spins up an in-memory database and triggers the inline auto-seeder (`inlineSeeder.js`), pre-populating administrators, mechanics, customers, fleet vehicles, and inventory so the system runs out-of-the-box anywhere.

---

## 3. Evaluator Demo Sign-In Credentials

| Role | Email | Password | Quick Access |
| :--- | :--- | :--- | :--- |
| **Workshop Admin** | `admin@autocare.com` | `admin123` | Click **"Workshop Admin"** button on login screen |
| **Master Mechanic** | `marcus.mechanic@autocare.com` | `mechanic123` | Click **"Master Mechanic"** button on login screen |
| **Customer (Alex)** | `alex.customer@example.com` | `customer123` | Click **"Customer (Alex)"** button on login screen |
| **Customer (Priya)** | `priya.customer@example.com` | `customer123` | Click **"Customer (Priya)"** button on login screen |
