import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mechanicService } from '../../services/mechanicService';
import { useNotifications } from '../../hooks/useNotifications';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { User, Phone, Mail, Award, Star, HardHat, CheckCircle2 } from 'lucide-react';

const MechanicProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await mechanicService.getMyMechanicProfile();
        setProfile(data.mechanic || null);
      } catch (err) {
        addToast('Failed to load mechanic profile.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!profile) return;
    setUpdating(true);
    try {
      await mechanicService.updateMechanic(profile._id, { status: newStatus });
      setProfile((prev) => ({ ...prev, status: newStatus }));
      addToast(`Shift status changed to ${newStatus}.`, 'success');
    } catch (err) {
      addToast('Failed to update shift status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !profile) {
    return <LoadingSpinner text="Retrieving technician profile..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Technician Station Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Professional certifications, shift availability, and workshop specialties.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 shadow-automotive space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-automotive-orange to-automotive-darkOrange flex items-center justify-center text-white text-2xl font-bold shadow-glow-orange">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase bg-dark-850 px-2 py-0.5 rounded text-amber-400 border border-dark-750">
                  Master Technician
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  {profile.experienceYears} Years Certified Experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20 self-start sm:self-center">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold">{profile.rating || 4.9} Customer Rating</span>
          </div>
        </div>

        {/* Shift Availability Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Set Current Workshop Shift Status
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['available', 'busy', 'on_leave'].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                disabled={updating}
                className={`p-3.5 rounded-2xl border text-center capitalize font-bold text-xs transition ${
                  profile.status === st
                    ? 'bg-automotive-orange text-white border-automotive-orange shadow-glow-orange'
                    : 'bg-dark-850 border-dark-750 text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Specializations & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-800 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-automotive-orange" />
              <span>Skill Specializations</span>
            </h4>
            <div className="space-y-2">
              {profile.specialization?.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-850 border border-dark-750 text-white font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Certifications & Accreditations</span>
            </h4>
            <div className="space-y-2">
              {profile.certifications?.map((cert, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-850 border border-dark-750 text-white font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-automotive-orange shrink-0" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicProfile;
