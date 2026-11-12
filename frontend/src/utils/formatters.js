export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Confirmed':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'Mechanic Assigned':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'In Progress':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse';
    case 'Waiting for Parts':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Cancelled':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    case 'Rejected':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'Paid':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Unpaid':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    default:
      return 'bg-slate-700/20 text-slate-300 border-slate-600/30';
  }
};
