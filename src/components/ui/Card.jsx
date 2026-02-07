import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-bg-surface border border-border rounded-2xl shadow-sm overflow-hidden ${className}`} style={{ backgroundColor: 'var(--surface)' }}>
      {children}
    </div>
  );
};

export default Card;