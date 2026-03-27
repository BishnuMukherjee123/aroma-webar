import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  blur?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = "", 
  opacity = 0.6, 
  blur = "20px" 
}) => {
  return (
    <div 
      className={`relative backdrop-blur-xl border border-outline-variant/10 shadow-[0_-12px_48px_rgba(0,0,0,0.6)] ${className}`}
      style={{ 
        backgroundColor: `rgba(28, 27, 27, ${opacity})`,
        backdropFilter: `blur(${blur})`,
        WebkitBackdropFilter: `blur(${blur})`
      }}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
