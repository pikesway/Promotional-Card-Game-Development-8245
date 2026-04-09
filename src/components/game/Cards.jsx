import React from 'react';

const getCardColor = (value, type) => {
  if (type === 'wild') return 'text-purple-500';
  if (value >= 1 && value <= 4) return 'text-blue-500';
  if (value >= 5 && value <= 8) return 'text-green-500';
  if (value >= 9 && value <= 12) return 'text-red-500';
  return 'text-slate-800';
};

export const GameCard = ({ card, onClick, isSelected, isValidTarget, className = '', hidden = false, size = 'md' }) => {
  if (!card && !hidden) return <EmptySlot onClick={onClick} isValidTarget={isValidTarget} size={size} className={className} />;

  const sizeClasses = {
    xs: 'w-12 h-16 md:w-16 md:h-24 text-xs md:text-sm',
    sm: 'w-16 h-24 md:w-20 md:h-28 text-sm md:text-base',
    md: 'w-16 h-24 md:w-24 md:h-36 text-sm md:text-lg',
    lg: 'w-16 h-24 md:w-28 md:h-40 text-base md:text-xl',
    xl: 'w-20 h-[7.5rem] md:w-32 md:h-48 text-xl md:text-2xl'
  };

  if (hidden) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl border-[3px] border-white/20 bg-gradient-to-br from-blue-600 to-blue-800 shadow-[0_8px_15px_rgba(0,0,0,0.5)] flex items-center justify-center relative overflow-hidden transition-transform ${className}`}>
        <div className="absolute inset-[3px] border border-white/10 rounded-lg bg-white/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-white/80 font-game font-bold text-[8px] md:text-xs uppercase tracking-widest">DECK</span>
        </div>
      </div>
    );
  }

  const isWild = card.type === 'wild';
  const displayValue = isWild ? 'W' : card.value;
  const colorClass = getCardColor(card.value, card.type);
  
  let interactionStyles = '';
  if (isSelected) {
    interactionStyles = 'ring-[4px] ring-yellow-400 shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-50 -translate-y-4';
  } else if (isValidTarget) {
    interactionStyles = 'ring-[4px] ring-green-400 ring-opacity-90 animate-pulse z-20 shadow-[0_0_25px_rgba(74,222,128,0.7)]';
  } else {
    interactionStyles = 'shadow-[0_8px_15px_rgba(0,0,0,0.5)]';
  }

  return (
    <div 
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-xl bg-white flex flex-col justify-between p-1.5 md:p-2 cursor-pointer transition-all duration-200 border-[3px] border-white ${interactionStyles} ${className}`}
    >
      <div className={`font-game font-bold leading-none ${colorClass}`}>
        {displayValue}
      </div>
      <div className={`text-[1.5rem] md:text-4xl font-game font-black text-center leading-none ${colorClass}`}>
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
    xs: 'w-12 h-16 md:w-16 md:h-24',
    sm: 'w-16 h-24 md:w-20 md:h-28',
    md: 'w-16 h-24 md:w-24 md:h-36',
    lg: 'w-16 h-24 md:w-28 md:h-40',
    xl: 'w-20 h-[7.5rem] md:w-32 md:h-48'
  };

  return (
    <div 
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-xl border-2 border-dashed border-white/20 bg-transparent flex items-center justify-center transition-all duration-200 ${isValidTarget ? 'border-green-400 border-solid ring-2 ring-green-400 ring-opacity-50 bg-green-500/10 cursor-pointer animate-pulse' : ''} ${className}`}
    ></div>
  );
};

export const CardStack = ({ cards = [], onClick, isSelected, isValidTarget, className = '', size = 'md' }) => {
  const count = cards.length;
  const topCard = cards[count - 1];

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
          <span className="absolute -top-2 -right-2 bg-slate-800 border-2 border-slate-400 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-20">
            {count}
          </span>
        )}
      </div>
    </div>
  );
};