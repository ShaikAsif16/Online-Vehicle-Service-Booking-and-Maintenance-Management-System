import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  ClipboardList,
  Activity,
  History,
  Receipt,
  Bell,
  User,
  Users,
  Wrench,
  Package,
  CreditCard,
  BarChart3,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const customerLinks = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Vehicles', path: '/customer/vehicles', icon: Car },
    { name: 'Book Service', path: '/customer/book', icon: CalendarCheck, badge: 'Book' },
    { name: 'My Bookings', path: '/customer/bookings', icon: ClipboardList },
    { name: 'Track Service', path: '/customer/track', icon: Activity },
    { name: 'Maintenance Log', path: '/customer/history', icon: History },
    { name: 'Invoices & Pay', path: '/customer/invoices', icon: Receipt },
    {
      name: 'Notifications',
      path: '/customer/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: 'My Profile', path: '/customer/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings Manager', path: '/admin/bookings', icon: ClipboardList },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Vehicles Fleet', path: '/admin/vehicles', icon: Car },
    { name: 'Technicians', path: '/admin/mechanics', icon: Wrench },
    { name: 'Services Catalog', path: '/admin/services', icon: Sliders },
    { name: 'Spare Parts Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Invoices & Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Workshop Settings', path: '/admin/settings', icon: Sliders },
  ];

  const mechanicLinks = [
    { name: 'Mechanic Hub', path: '/mechanic/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Jobs', path: '/mechanic/assigned', icon: ClipboardList },
    { name: 'Completed Work', path: '/mechanic/completed', icon: CheckCircle2 },
    { name: 'Technician Profile', path: '/mechanic/profile', icon: User },
  ];

  const links =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'mechanic'
      ? mechanicLinks
      : customerLinks;

  const roleTitle =
    user.role === 'admin'
      ? 'ADMINISTRATION'
      : user.role === 'mechanic'
      ? 'LEAD TECHNICIAN'
      : 'CUSTOMER PORTAL';

  return (
    <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
      {/* Role Heading */}
      <div className="px-6 py-5 border-b border-dark-800">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
          {roleTitle}
        </span>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-9 h-9 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center text-automotive-orange font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-white truncate">{user.name}</span>
            <span className="text-xs text-slate-400 truncate">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-automotive-orange/20 to-transparent text-white border-l-4 border-automotive-orange font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-dark-850'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-automotive-orange'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                        isActive
                          ? 'bg-automotive-orange text-white'
                          : 'bg-dark-800 text-automotive-orange'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Workshop Assistance Box */}
      <div className="p-4 m-3 rounded-xl bg-dark-850 border border-dark-800 text-xs">
        <div className="flex items-center gap-2 text-automotive-orange font-bold mb-1">
          <AlertCircle className="w-4 h-4" />
          <span>Workshop Hotline</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-tight">
          Emergency service support is active 24/7.
        </p>
        <p className="text-white font-mono text-xs mt-2 font-bold">+91 1800-425-AUTO</p>
      </div>
    </aside>
  );
};

export default Sidebar;
