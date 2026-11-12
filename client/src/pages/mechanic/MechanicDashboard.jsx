import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { bookingService } from '../../services/bookingService';
import { mechanicService } from '../../services/mechanicService';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Wrench,
  ClipboardList,
  CheckCircle2,
  Clock,
  Car,
  Star,
  ArrowRight,
  HardHat,
  AlertTriangle,
  Play,
} from 'lucide-react';

const MechanicDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, profileRes] = await Promise.all([
          bookingService.getMechanicAssignedJobs(),
          mechanicService.getMyMechanicProfile(),
        ]);
        setJobs(jobsRes.jobs || []);
        setProfile(profileRes.mechanic || null);
      } catch (err) {
        console.error('Failed to load mechanic data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Connecting to technician bay console..." />;
  }

  const activeJobs = jobs.filter((j) =>
    ['Mechanic Assigned', 'In Progress', 'Waiting for Parts'].includes(j.status)
  );

  const completedJobs = jobs.filter((j) => j.status === 'Completed');
  const currentSpotlightJob = activeJobs[0] || null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-dark-750 shadow-automotive">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Technician Bay Console: {user?.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Active Shift
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Specialization: {profile?.specialization?.join(', ') || 'Lead Vehicle Diagnostics'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/mechanic/assigned"
            className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Assigned Work Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned in Bays"
          value={activeJobs.length}
          icon={Wrench}
          subtitle="Work orders requiring action"
        />
        <StatCard
          title="Completed Jobs"
          value={completedJobs.length}
          icon={CheckCircle2}
          subtitle="Road-tested & certified"
        />
        <StatCard
          title="Customer Satisfaction"
          value={`${profile?.rating || 4.9} ★`}
          icon={Star}
          subtitle="Master technician rating"
        />
        <StatCard
          title="Shift Status"
          value={profile?.status?.replace('_', ' ')?.toUpperCase() || 'AVAILABLE'}
          icon={HardHat}
          subtitle={`${profile?.experienceYears || 5} Years Certified Experience`}
        />
      </div>

      {/* Spotlight Job In Bay */}
      {currentSpotlightJob ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-automotive-orange/50 shadow-automotive relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-dark-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-automotive-orange bg-automotive-orange/15 px-2.5 py-0.5 rounded border border-automotive-orange/30">
                Current Active Service Order
              </span>
              <h2 className="text-xl font-bold text-white mt-2">
                {currentSpotlightJob.vehicle?.brand} {currentSpotlightJob.vehicle?.model} (
                {currentSpotlightJob.vehicle?.registrationNumber})
              </h2>
              <p className="text-xs text-slate-400">
                Service: <strong className="text-white">{currentSpotlightJob.service?.name}</strong>{' '}
                • Scheduled for {formatDate(currentSpotlightJob.bookingDate)} at{' '}
                {currentSpotlightJob.timeSlot}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={currentSpotlightJob.status} />
              <Link
                to={`/mechanic/job/${currentSpotlightJob._id}`}
                className="px-5 py-2.5 rounded-xl bg-automotive-orange text-white text-xs font-bold shadow-glow-orange hover:bg-automotive-darkOrange transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Workbench</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Customer / Contact</span>
              <span className="text-white font-bold text-sm">
                {currentSpotlightJob.customer?.name}
              </span>
              <span className="text-slate-400 block mt-0.5">
                {currentSpotlightJob.customer?.phone}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Customer Complaints</span>
              <span className="text-slate-200 italic line-clamp-2">
                "{currentSpotlightJob.complaints || 'Standard scheduled service checklist.'}"
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-dark-850 border border-dark-750">
              <span className="text-slate-400 block mb-1">Diagnosis Notes</span>
              <span className="text-slate-200 line-clamp-2">
                {currentSpotlightJob.diagnosis || 'Initial visual & telemetry scan pending.'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-dark-900 border border-dark-800 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">All Assigned Bay Jobs Clear</h3>
          <p className="text-xs text-slate-400">
            You do not currently have any pending jobs assigned to your shift.
          </p>
        </div>
      )}

      {/* Active Work Queue */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-800">
          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Assigned Job Queue
            </h3>
            <p className="text-xs text-slate-400">Orders allocated to your bay shift</p>
          </div>
          <Link
            to="/mechanic/assigned"
            className="text-xs font-bold text-automotive-orange hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeJobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No active service jobs.</p>
        ) : (
          <div className="space-y-3">
            {activeJobs.map((j) => (
              <div
                key={j._id}
                className="p-4 rounded-2xl bg-dark-850 border border-dark-750 hover:border-dark-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-automotive-orange">
                      {j.bookingReference}
                    </span>
                    <StatusBadge status={j.status} />
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {j.vehicle?.brand} {j.vehicle?.model} ({j.vehicle?.registrationNumber}) •{' '}
                    {j.service?.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Slot: {formatDate(j.bookingDate)} at {j.timeSlot} • Client: {j.customer?.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/mechanic/job/${j._id}`}
                    className="px-4 py-2 rounded-xl bg-automotive-orange text-white font-bold text-xs shadow-glow-orange hover:bg-automotive-darkOrange transition"
                  >
                    Work on Job
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
