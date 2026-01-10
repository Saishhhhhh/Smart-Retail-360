import React from 'react';

const Card = ({ children, className = '', title = null, action = null }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 transition-all duration-200 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
