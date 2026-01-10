import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    OVERSTOCKED: {
      label: 'OVERSTOCKED',
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    UNDERSTOCKED: {
      label: 'UNDERSTOCKED',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    HEALTHY: {
      label: 'HEALTHY',
      className: 'bg-green-100 text-green-800 border-green-200'
    }
  };

  const config = statusConfig[status] || statusConfig.HEALTHY;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
