import React from 'react';

interface StitchTopBarProps {
  title?: string;
  showMenu?: boolean;
  showBag?: boolean;
}

const StitchTopBar: React.FC<StitchTopBarProps> = ({ 
  title = "AROMA AR", 
  showMenu = true, 
  showBag = true 
}) => {
  return (
    <header className="absolute top-0 left-0 w-full z-60 px-8 py-8 flex justify-between items-center pointer-events-none">
      {showMenu && (
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-90 pointer-events-auto">
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
      )}
      <h1 className="font-heading font-extrabold tracking-logo text-base text-primary-container uppercase">
        {title}
      </h1>
      {showBag && (
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-90 pointer-events-auto relative">
          <span className="material-symbols-outlined text-xl">shopping_bag</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full shadow-[0_0_12px_rgba(255,181,156,0.6)]"></span>
        </button>
      )}
    </header>
  );
};

export default StitchTopBar;
