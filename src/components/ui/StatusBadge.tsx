import { CheckCircle2, XCircle, Clock, AlertCircle, Circle } from 'lucide-react';

type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'approved' | 'rejected';

interface StatusBadgeProps {
  status: Status;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
  inactive: {
    label: 'Inactive',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Circle,
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
  approved: {
    label: 'Approved',
    color: 'bg-primary-100 text-primary-700 border-primary-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
};

export default function StatusBadge({
  status,
  showIcon = true,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.color} ${sizeStyles[size]} ${className}`}
    >
      {showIcon && <Icon className={iconSize} />}
      {config.label}
    </span>
  );
}
