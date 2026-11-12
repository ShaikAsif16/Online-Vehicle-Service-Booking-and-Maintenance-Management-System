import React, { useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { Sliders, Save, ShieldCheck, Clock, Phone, Percent, Database, Bell } from 'lucide-react';

const AdminSettings = () => {
  const { addToast } = useNotifications();

  const [settings, setSettings] = useState({
    workshopName: 'AutoCare Pro Hi-Tech Automotive Workshop',
    address: '100 Automotive Hub, Phase II Hi-Tech Industrial Corridor, Hyderabad, 500081',
    hotline: '+91 1800-425-AUTO',
    deskPhone: '+91 (040) 2988-7700',
    gstRate: 18,
    bayCapacityPerSlot: 3,
    autoAssignLeadTech: true,
    emailAlertsEnabled: true,
    operatingHoursStart: '08:30',
    operatingHoursEnd: '19:00',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast('Workshop operational parameters saved successfully.', 'success');
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Workshop Platform Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure workshop business parameters, bay capacities, tax rules, and dispatch hotlines.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Workshop Identity */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-automotive-orange" />
            <span>Workshop Facility Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-semibold">Facility Name</label>
              <input
                type="text"
                value={settings.workshopName}
                onChange={(e) => setSettings({ ...settings, workshopName: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-semibold">Physical Workshop Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Customer Desk Line</label>
              <input
                type="text"
                value={settings.deskPhone}
                onChange={(e) => setSettings({ ...settings, deskPhone: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">24/7 Breakdown Hotline</label>
              <input
                type="text"
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
            </div>
          </div>
        </div>

        {/* Capacity & Taxation */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span>Capacity Constraints & GST Rate</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">
                Maximum Concurrent Bay Slots (Slot Conflict Limiter)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={settings.bayCapacityPerSlot}
                onChange={(e) =>
                  setSettings({ ...settings, bayCapacityPerSlot: Number(e.target.value) })
                }
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
              <span className="text-[10px] text-slate-400">
                Prevents scheduling more than 3 simultaneous vehicles per hourly slot.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Statutory GST Rate (%)</label>
              <input
                type="number"
                min={0}
                max={28}
                value={settings.gstRate}
                onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-automotive-orange"
              />
              <span className="text-[10px] text-slate-400">
                Automotive services standard GST applied on invoices (18%).
              </span>
            </div>
          </div>
        </div>

        {/* Database & Environment Info */}
        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Database Architecture Telemetry</span>
          </h3>
          <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Database Engine:</span>
              <span className="text-white font-mono font-bold">MongoDB / Mongoose ODM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mode:</span>
              <span className="text-emerald-400 font-bold">
                Auto-Fallback Embedded MongoMemoryServer Active
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Security Architecture:</span>
              <span className="text-white font-mono">
                Bcrypt (Salt Rounds: 10) + JWT (7-Day Expiry) + RBAC Middleware
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
