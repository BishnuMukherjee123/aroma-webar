import React from 'react';

const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-container/10 rounded-full blur-[100px] animate-pulse-glow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-container/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-tertiary-container/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default AmbientGlow;
