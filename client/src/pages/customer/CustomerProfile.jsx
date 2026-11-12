import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { authService } from '../../services/authService';
import { User, Mail, Phone, MapPin, Lock, Save, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    postalCode: user?.address?.postalCode || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          postalCode: profileData.postalCode,
        },
      });
      updateUser(res.user);
      addToast('Profile updated successfully.', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('New passwords do not match.', 'warning');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'warning');
      return;
    }

    setSavingPassword(true);
    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      addToast('Password changed successfully.', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update password.', 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Account Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage contact coordinates, workshop communication address, and access credentials.
        </p>
      </div>

      {/* Account Info Pill Card */}
      <div className="p-6 rounded-3xl bg-dark-900 border border-dark-800 shadow-automotive flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-automotive-orange to-automotive-darkOrange flex items-center justify-center text-white text-xl font-bold shadow-glow-orange">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-dark-800 text-automotive-orange px-2 py-0.5 rounded border border-dark-700">
                {user?.role} Account
              </span>
              <span className="text-[11px] text-slate-400">
                Registered {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 self-start sm:self-center">
          <ShieldCheck className="w-4 h-4" />
          <span>Active Authenticated Session</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Personal Details Form */}
        <div className="md:col-span-7 bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Contact & Address Details
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address (Fixed)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-dark-850/50 border border-dark-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Contact Phone</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-dark-800">
              <label className="text-xs font-semibold text-slate-300">Street Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 42 Greenwood Residency, Jubilee Hills"
                  value={profileData.street}
                  onChange={(e) => setProfileData({ ...profileData, street: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Postal Code</label>
                <input
                  type="text"
                  value={profileData.postalCode}
                  onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2 mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-5 bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Security & Password
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Re-type new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full bg-dark-850 border border-dark-750 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-automotive-orange"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center justify-center gap-2 mt-4"
            >
              <Lock className="w-4 h-4 text-automotive-orange" />
              <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
