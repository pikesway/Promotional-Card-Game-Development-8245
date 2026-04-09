import React from 'react';

const getCardColor = (value, type) => {
  if (type === 'wild') return 'text-game-purple';
  if (value >= 1 && value <= 4) return 'text-game-blue';
  if (value >= 5 && value <= 8) return 'text-green-600';
  if (value >= 9 && value <= 12) return 'text-game-red';
  return 'text-slate-800';
};

export const GameCard = ({ card, onClick, isSelected, isValidTarget, className = '', hidden = false, size = 'md' }) => {
  if (!card && !hidden) return <EmptySlot onClick={onClick} isValidTarget={isValidTarget} size={size} className={className} />;

  // Mapped specifically to fit 5 cards across on a mobile screen while remaining legible
  const sizeClasses = {
    xs: 'w-10 h-14 md:w-16 md:h-24 text-[10px] md:text-sm',      // AI Discards, Player Discards, Build Piles
    sm: 'w-12 h-16 md:w-20 md:h-28 text-xs md:text-base',        // Stocks, Draw Pile
    md: 'w-14 h-20 md:w-24 md:h-36 text-sm md:text-lg',          // Desktop standard
    lg: 'w-16 h-24 md:w-28 md:h-40 text-base md:text-xl',        // Desktop Hand
    xl: 'w-[4.5rem] h-[6.5rem] md:w-32 md:h-48 text-lg md:text-2xl' // Mobile Hand
  };

  if (hidden) {
    return (
      <div className={`${sizeClasses[size]} rounded-md md:rounded-xl border-2 border-blue-400/50 bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center justify-center relative overflow-hidden transition-transform ${className}`}>
        <div className="absolute inset-[2px] border border-white/20 rounded-sm md:rounded-md bg-white/10"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-white font-game font-bold text-[8px] md:text-xs uppercase tracking-widest drop-shadow-md">Stack</span>
        </div>
      </div>
    );
  }

  const isWild = card.type === 'wild';
  const displayValue = isWild ? 'W' : card.value;
  const colorClass = getCardColor(card.value, card.type);
  
  let interactionStyles = '';
  if (isSelected) {
    interactionStyles = 'ring-[3px] md:ring-4 ring-yellow-400 shadow-[0_10px_25px_rgba(0,0,0,0.6)] z-50';
  } else if (isValidTarget) {
    interactionStyles = 'ring-[3px] md:ring-4 ring-green-400 ring-opacity-80 animate-pulse z-20 shadow-[0_0_15px_rgba(74,222,128,0.5)]';
  } else {
    interactionStyles = 'shadow-[0_4px_8px_rgba(0,0,0,0.4)]';
  }

  return (
    <div 
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-md md:rounded-xl bg-slate-50 flex flex-col justify-between p-1 md:p-2 cursor-pointer transition-all duration-200 border border-slate-300 ${interactionStyles} ${className}`}
    >
      <div className={`font-game font-bold leading-none ${colorClass}`}>
        {displayValue}
      </div>
      <div className={`text-[1.25rem] md:text-4xl font-game font-bold text-center leading-none ${colorClass}`}>
        {displayValue}
      </div>
      <div className={`font-game font-bold leading-none self-end rotate-180 ${colorClass}`}>
        {displayValue}
      </div>
    </div>
  );
};

export const EmptySlot = ({ onClick, isValidTarget, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-10 h-14 md:w-16 md:h-24',
    sm: 'w-12 h-16 md:w-20 md:h-28',
    md: 'w-14 h-20 md:w-24 md:h-36',
    lg: 'w-16 h-24 md:w-28 md:h-40',
    xl: 'w-[4.5rem] h-[6.5rem] md:w-32 md:h-48'
  };

  return (
    <div 
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-md md:rounded-xl border-[1.5px] border-dashed border-slate-500/50 bg-slate-900/40 flex items-center justify-center transition-all duration-200 ${isValidTarget ? 'border-green-400 border-solid ring-2 ring-green-400 ring-opacity-50 bg-green-900/30 cursor-pointer animate-pulse' : ''} ${className}`}
    >
      {isValidTarget && <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-green-400/40 flex items-center justify-center">
        <svg className="w-3 h-3 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>}
    </div>
  );
};

export const CardStack = ({ cards = [], onClick, isSelected, isValidTarget, className = '', size = 'md', countPos = 'top-right' }) => {
  const count = cards.length;
  const topCard = cards[count - 1];

  const badgePosition = countPos === 'bottom-right' 
    ? '-bottom-2 -right-2' 
    : '-top-2 -right-2';

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative">
        <GameCard 
          card={topCard} 
          onClick={onClick}
          isSelected={isSelected}
          isValidTarget={isValidTarget}
          size={size}
        />
        {count > 1 && (
          <span className={`absolute ${badgePosition} bg-slate-700 border border-slate-400 text-white text-[9px] md:text-xs font-bold w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg z-20`}>
            {count}
          </span>
        )}
      </div>
    </div>
  );
};