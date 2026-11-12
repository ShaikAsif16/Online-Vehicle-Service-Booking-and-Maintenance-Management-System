import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ShieldAlert, Menu, X } from 'lucide-react';

const DashboardLayout = ({ allowedRoles = ['customer', 'admin', 'mechanic'] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <LoadingSpinner text="Authenticating workshop access credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Your current account role (<strong className="text-automotive-orange">{user.role}</strong>)
            does not hold privileges to view this administrative sector.
          </p>
          <a
            href={
              user.role === 'admin'
                ? '/admin/dashboard'
                : user.role === 'mechanic'
                ? '/mechanic/dashboard'
                : '/customer/dashboard'
            }
            className="px-6 py-2.5 rounded-xl bg-automotive-orange text-white font-bold text-sm shadow-glow-orange hover:bg-automotive-darkOrange transition"
          >
            Return to Authorized Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100">
      <Navbar />

      {/* Mobile Sidebar Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-dark-900 border-b border-dark-800">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {user.role} Menu
        </span>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-dark-800 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>{mobileSidebarOpen ? 'Close Menu' : 'Dashboard Nav'}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 bg-dark-900 h-full overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-dark-950 overflow-x-hidden min-w-0">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
