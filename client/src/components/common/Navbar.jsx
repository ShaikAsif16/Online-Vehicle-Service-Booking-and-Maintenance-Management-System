import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import {
  Wrench,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  Shield,
  Hammer,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'mechanic') return '/mechanic/dashboard';
    return '/customer/dashboard';
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-automotive-orange to-automotive-darkOrange flex items-center justify-center text-white shadow-glow-orange group-hover:scale-105 transition-transform duration-300">
              <Wrench className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5 font-['Space_Grotesk']">
                AUTOCARE <span className="text-automotive-orange">PRO</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Precision Automotive Service
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition ${
                isActiveLink('/') ? 'text-automotive-orange' : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`text-sm font-semibold transition ${
                isActiveLink('/services') ? 'text-automotive-orange' : 'text-slate-300 hover:text-white'
              }`}
            >
              Services Catalog
            </Link>
            <Link
              to="/about"
              className={`text-sm font-semibold transition ${
                isActiveLink('/about') ? 'text-automotive-orange' : 'text-slate-300 hover:text-white'
              }`}
            >
              About Workshop
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-semibold transition ${
                isActiveLink('/contact') ? 'text-automotive-orange' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Right Action Icons / Profile */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />

                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-slate-200 text-sm font-semibold transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-automotive-orange" />
                  <span>Dashboard</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-750 transition"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-white line-clamp-1">{user.name}</span>
                      <span className="text-[10px] font-bold text-automotive-orange uppercase tracking-wider">
                        {user.role}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-dark-750 border border-dark-600 flex items-center justify-center text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-dark-900 border border-dark-750 shadow-automotive-lg py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-dark-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-dark-800 hover:text-white transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-automotive-orange" />
                        Dashboard
                      </Link>

                      {user.role === 'customer' && (
                        <Link
                          to="/customer/book"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:bg-dark-800 hover:text-white transition"
                        >
                          <CalendarCheck className="w-4 h-4 text-emerald-400" />
                          Book Service
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition mt-1 border-t border-dark-800"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-dark-850 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-automotive-orange to-automotive-darkOrange hover:opacity-95 shadow-glow-orange transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-dark-850 border border-dark-750 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-dark-800 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-dark-800 rounded-lg"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-dark-800 rounded-lg"
          >
            Services Catalog
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-dark-800 rounded-lg"
          >
            About Workshop
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-200 hover:bg-dark-800 rounded-lg"
          >
            Contact Us
          </Link>

          <div className="pt-4 border-t border-dark-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-dark-800 text-center font-bold text-white border border-dark-700"
                >
                  Open Dashboard ({user.role})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-400 text-center font-bold"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-dark-800 text-center font-bold text-white border border-dark-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-automotive-orange text-center font-bold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
