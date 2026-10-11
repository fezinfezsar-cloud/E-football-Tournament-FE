import React from 'react';
import { Clock, CheckCircle2, XCircle, FileEdit } from 'lucide-react';

const StatusBadge = ({ status, type = 'registration' }) => {
  let config = {
    bg: 'bg-zinc-800',
    border: 'border-zinc-700',
    text: 'text-zinc-300',
    icon: Clock,
    label: status || 'UNKNOWN'
  };

  switch (status) {
    case 'PENDING_VERIFICATION':
    case 'PENDING':
      config = {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        icon: Clock,
        label: type === 'payment' ? 'Pending Verification' : 'Pending Verification'
      };
      break;

    case 'APPROVED':
    case 'VERIFIED':
      config = {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        icon: CheckCircle2,
        label: type === 'payment' ? 'Payment Verified' : 'Registration Confirmed'
      };
      break;

    case 'REJECTED':
      config = {
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        text: 'text-red-400',
        icon: XCircle,
        label: type === 'payment' ? 'Payment Rejected' : 'Registration Rejected'
      };
      break;

    case 'DRAFT':
    case 'NOT_SUBMITTED':
      config = {
        bg: 'bg-zinc-800/80',
        border: 'border-zinc-700',
        text: 'text-zinc-400',
        icon: FileEdit,
        label: type === 'payment' ? 'Screenshot Required' : 'Draft'
      };
      break;

    default:
      break;
  }

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text} backdrop-blur-md transition-all`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
