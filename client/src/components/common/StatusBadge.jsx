import React from 'react';
import { getStatusColor } from '../../utils/formatters';

const StatusBadge = ({ status }) => {
  const colorClass = getStatusColor(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
