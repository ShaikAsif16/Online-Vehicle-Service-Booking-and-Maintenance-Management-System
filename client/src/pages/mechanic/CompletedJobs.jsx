import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { useNotifications } from '../../hooks/useNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle2, Car, User, Clock, Package, Eye, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompletedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useNotifications();

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const data = await bookingService.getMechanicAssignedJobs({ status: 'Completed' });
        setJobs(data.jobs || []);
      } catch (err) {
        addToast('Failed to load completed jobs history.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving completed work logs..." />;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
          Completed Service Jobs History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Archived vehicles road-tested, signed off, and certified by your station.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-3xl p-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Completed Jobs Yet</h3>
          <p className="text-xs text-slate-400">
            Work orders marked as 'Completed' will appear in your permanent technician service log.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((j) => (
            <div
              key={j._id}
              className="bg-dark-900 border border-dark-800 rounded-3xl p-6 shadow-automotive space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-dark-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-automotive-orange bg-dark-850 px-2.5 py-1 rounded-lg border border-dark-750">
                    {j.bookingReference}
                  </span>
                  <StatusBadge status="Completed" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Finished on {formatDate(j.actualCompletionDate || j.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {j.vehicle?.brand} {j.vehicle?.model} ({j.vehicle?.registrationNumber})
                  </h3>
                  <p className="text-xs text-slate-300 font-semibold">{j.service?.name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Customer: {j.customer?.name} ({j.customer?.phone})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Total Billed
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    {formatCurrency(j.totalCost || j.estimatedCost)}
                  </span>
                </div>
              </div>

              {j.diagnosis && (
                <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 text-xs">
                  <p className="text-slate-300">
                    <strong className="text-white">Diagnosis:</strong> {j.diagnosis}
                  </p>
                  {j.repairNotes && (
                    <p className="text-slate-400 italic mt-1">
                      <strong className="text-slate-300">Repair Notes:</strong> {j.repairNotes}
                    </p>
                  )}
                </div>
              )}

              {j.partsUsed && j.partsUsed.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Installed Parts:
                  </span>
                  {j.partsUsed.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-dark-850 text-slate-300 text-[10px] border border-dark-750"
                    >
                      {p.partName} ({p.quantity}x)
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/mechanic/job/${j._id}`}
                  className="px-4 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-bold border border-dark-700 transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Job Sheet</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedJobs;
