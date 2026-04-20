import React from 'react';

interface BadgeProps {
  status: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'confirmed':
      case 'completed':
      case 'available':
        return 'bg-green-900 text-green-200';
      case 'pending':
      case 'maintenance':
        return 'bg-yellow-900 text-yellow-200';
      case 'inactive':
      case 'cancelled':
      case 'booked':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default Badge;
