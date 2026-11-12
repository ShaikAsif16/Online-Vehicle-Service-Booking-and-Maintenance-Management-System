import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, trend = 'neutral', subtitle }) => {
  return (
    <div className="bg-dark-900/80 border border-dark-750/70 hover:border-automotive-orange/40 rounded-2xl p-5 shadow-automotive transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700/80 flex items-center justify-center text-automotive-orange group-hover:scale-110 group-hover:border-automotive-orange/50 transition-all duration-300">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-black text-white tracking-tight">{value}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {change && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`text-xs font-semibold ${
                trend === 'up'
                  ? 'text-emerald-400'
                  : trend === 'down'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
