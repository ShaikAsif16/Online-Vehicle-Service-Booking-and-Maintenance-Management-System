import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import MyVehicles from './pages/customer/MyVehicles';
import BookService from './pages/customer/BookService';
import MyBookings from './pages/customer/MyBookings';
import TrackService from './pages/customer/TrackService';
import MaintenanceHistory from './pages/customer/MaintenanceHistory';
import Invoices from './pages/customer/Invoices';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerProfile from './pages/customer/CustomerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BookingManagement from './pages/admin/BookingManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import VehicleManagement from './pages/admin/VehicleManagement';
import MechanicManagement from './pages/admin/MechanicManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// Mechanic Pages
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import AssignedJobs from './pages/mechanic/AssignedJobs';
import JobDetails from './pages/mechanic/JobDetails';
import CompletedJobs from './pages/mechanic/CompletedJobs';
import MechanicProfile from './pages/mechanic/MechanicProfile';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Customer Protected Pages */}
      <Route element={<DashboardLayout allowedRoles={['customer']} />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/vehicles" element={<MyVehicles />} />
        <Route path="/customer/book" element={<BookService />} />
        <Route path="/customer/bookings" element={<MyBookings />} />
        <Route path="/customer/track" element={<TrackService />} />
        <Route path="/customer/history" element={<MaintenanceHistory />} />
        <Route path="/customer/invoices" element={<Invoices />} />
        <Route path="/customer/notifications" element={<CustomerNotifications />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
      </Route>

      {/* Admin Protected Pages */}
      <Route element={<DashboardLayout allowedRoles={['admin']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<BookingManagement />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/vehicles" element={<VehicleManagement />} />
        <Route path="/admin/mechanics" element={<MechanicManagement />} />
        <Route path="/admin/services" element={<ServiceManagement />} />
        <Route path="/admin/inventory" element={<InventoryManagement />} />
        <Route path="/admin/payments" element={<PaymentManagement />} />
        <Route path="/admin/reports" element={<ReportsAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Mechanic Protected Pages */}
      <Route element={<DashboardLayout allowedRoles={['mechanic']} />}>
        <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
        <Route path="/mechanic/assigned" element={<AssignedJobs />} />
        <Route path="/mechanic/job/:id" element={<JobDetails />} />
        <Route path="/mechanic/completed" element={<CompletedJobs />} />
        <Route path="/mechanic/profile" element={<MechanicProfile />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
