import React from 'react';

const getCardColor = (value, type) => {
  if (type === 'wild') return 'text-purple-500';
  if (value >= 1 && value <= 4) return 'text-blue-500';
  if (value >= 5 && value <= 8) return 'text-green-500';
  if (value >= 9 && value <= 12) return 'text-red-500';
  return 'text-slate-800';
};

export const GameCard = ({ 
  card, 
  onClick, 
  isSelected, 
  isValidTarget, 
  className = '', 
  hidden = false, 
  size = 'md' 
}) => {
  if (!card && !hidden) 
    return <EmptySlot onClick={onClick} isValidTarget={isValidTarget} size={size} className={className} />;

  const sizeClasses = {
    xs: 'w-12 h-16 md:w-16 md:h-24 text-xs md:text-sm',
    sm: 'w-16 h-24 md:w-20 md:h-28 text-sm md:text-base',
    md: 'w-16 h-24 md:w-24 md:h-36 text-sm md:text-lg',
    lg: 'w-16 h-24 md:w-28 md:h-40 text-base md:text-xl',
    xl: 'w-20 h-[7.5rem] md:w-32 md:h-48 text-xl md:text-2xl'
  };

  if (hidden) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-xl border-[3px] border-blue-700/50 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden transition-transform ${className}`}
      >
        {/* Inner bevel highlight */}
        <div className="absolute inset-[3px] border border-white/10 rounded-lg bg-gradient-to-b from-white/5 to-transparent"></div>
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] bg-[length:12px_12px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center">
          <span className="text-white/80 font-game font-bold text-[8px] md:text-xs uppercase tracking-widest drop-shadow-md">
            DECK
          </span>
        </div>
      </div>
    );
  }

  const isWild = card.type === 'wild';
  const displayValue = isWild ? 'W' : card.value;
  const colorClass = getCardColor(card.value, card.type);

  let interactionStyles = '';
  if (isSelected) {
    interactionStyles = 'ring-[4px] ring-yellow-400 shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_0_4px_rgba(250,204,21,0.5)] z-50 -translate-y-6 rotate-2';
  } else if (isValidTarget) {
    interactionStyles = 'ring-[4px] ring-green-400 ring-opacity-90 animate-pulse z-20 shadow-[0_0_30px_rgba(74,222,128,0.8),0_12px_24px_rgba(0,0,0,0.6)]';
  } else {
    interactionStyles = 'shadow-[0_10px_20px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]';
  }

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col justify-between p-1.5 md:p-2 cursor-pointer transition-all duration-200 border-[3px] border-white/90 ${interactionStyles} ${className}`}
      style={{
        boxShadow: isSelected 
          ? '0 20px 40px rgba(0,0,0,0.9), 0 0 0 4px rgba(250,204,21,0.5), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1)'
          : isValidTarget
          ? '0 0 30px rgba(74,222,128,0.8), 0 12px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1)'
          : '0 10px 20px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* Top-left value */}
      <div className={`font-game font-bold leading-none ${colorClass} drop-shadow-sm`}>
        {displayValue}
      </div>
      
      {/* Center value */}
      <div className={`text-[1.5rem] md:text-4xl font-game font-black text-center leading-none ${colorClass} drop-shadow-md`}>
        {displayValue}
      </div>
      
      {/* Bottom-right value (rotated) */}
      <div className={`font-game font-bold leading-none self-end rotate-180 ${colorClass} drop-shadow-sm`}>
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
      className={`${sizeClasses[size]} rounded-xl bg-slate-800/60 shadow-inner flex items-center justify-center transition-all duration-200 ${
        isValidTarget 
          ? 'ring-4 ring-green-400/70 bg-green-500/20 shadow-[inset_0_4px_12px_rgba(74,222,128,0.3),0_0_20px_rgba(74,222,128,0.6)] cursor-pointer animate-pulse' 
          : ''
      } ${className}`}
    >
      {/* Subtle inner highlight for depth */}
      {!isValidTarget && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};

export const CardStack = ({ 
  cards = [], 
  onClick, 
  isSelected, 
  isValidTarget, 
  className = '', 
  size = 'md' 
}) => {
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
          <span className="absolute -top-2 -right-2 bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-400/80 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] z-20">
            {count}
          </span>
        )}
      </div>
    </div>
  );
};