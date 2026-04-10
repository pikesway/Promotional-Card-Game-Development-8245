import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const getCardColor = (value, type) => {
  if (type === 'wild') return 'text-purple-500';
  if (value >= 1 && value <= 4) return 'text-blue-500';
  if (value >= 5 && value <= 8) return 'text-green-500';
  if (value >= 9 && value <= 12) return 'text-red-500';
  return 'text-slate-800';
};

const SIZE_CLASSES = {
  xs: 'w-[15vw] max-w-[65px] aspect-[2/3] flex-shrink-0',
  sm: 'w-[14vw] max-w-[50px] aspect-[2/3] flex-shrink-0',
  md: 'w-[16vw] max-w-[65px] aspect-[2/3] flex-shrink-0',
  lg: 'w-[15vw] max-w-[65px] aspect-[2/3] flex-shrink-0',
  xl: 'w-20 h-[7.5rem] md:w-32 md:h-48 flex-shrink-0'
};

const TEXT_CLASSES = {
  xs: 'text-xs md:text-sm',
  sm: 'text-xs md:text-sm',
  md: 'text-sm md:text-base',
  lg: 'text-base md:text-xl',
  xl: 'text-xl md:text-2xl'
};

export const GameCard = ({
  card,
  onClick,
  isSelected,
  isValidTarget,
  className = '',
  hidden = false,
  size = 'md',
  isDragging = false
}) => {
  if (!card && !hidden) return <EmptySlot onClick={onClick} isValidTarget={isValidTarget} className={className} size={size} />;

  const baseSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const textSize = TEXT_CLASSES[size] || TEXT_CLASSES.md;

  if (hidden) {
    return (
      <div
        className={`${baseSize} rounded-xl border-[3px] border-blue-700/50 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden transition-transform ${className}`}
      >
        <div className="absolute inset-[3px] border border-white/10 rounded-lg bg-gradient-to-b from-white/5 to-transparent"></div>
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

  const opacityStyle = isDragging ? 'opacity-30' : 'opacity-100';

  return (
    <div
      onClick={onClick}
      className={`${baseSize} ${textSize} rounded-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col justify-between p-1.5 md:p-2 cursor-pointer transition-all duration-200 border-[3px] border-white/90 ${interactionStyles} ${opacityStyle} ${className}`}
      style={{
        boxShadow: isSelected
          ? '0 20px 40px rgba(0,0,0,0.9),0 0 0 4px rgba(250,204,21,0.5),inset 0 2px 4px rgba(255,255,255,0.8),inset 0 -2px 4px rgba(0,0,0,0.1)'
          : isValidTarget
          ? '0 0 30px rgba(74,222,128,0.8),0 12px 24px rgba(0,0,0,0.6),inset 0 2px 4px rgba(255,255,255,0.8),inset 0 -2px 4px rgba(0,0,0,0.1)'
          : '0 10px 20px rgba(0,0,0,0.5),0 2px 4px rgba(0,0,0,0.3),inset 0 2px 4px rgba(255,255,255,0.8),inset 0 -2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className={`font-game font-bold leading-none ${colorClass} drop-shadow-sm`}>
        {displayValue}
      </div>
      <div className={`text-[1.5rem] md:text-3xl font-game font-black text-center leading-none ${colorClass} drop-shadow-md`}>
        {displayValue}
      </div>
      <div className={`font-game font-bold leading-none self-end rotate-180 ${colorClass} drop-shadow-sm`}>
        {displayValue}
      </div>
    </div>
  );
};

export const EmptySlot = ({ onClick, isValidTarget, className = '', size = 'md' }) => {
  const baseSize = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const baseClasses = `${baseSize} rounded-xl bg-slate-800/80 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] border-2 border-slate-700/50 flex-shrink-0`;
  const validTargetClasses = "ring-4 ring-green-400/70 bg-green-500/20 shadow-[inset_0_4px_12px_rgba(74,222,128,0.3),0_0_20px_rgba(74,222,128,0.6)] cursor-pointer animate-pulse border-green-500/80";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} flex items-center justify-center transition-all duration-200 ${isValidTarget ? validTargetClasses : ''} ${className}`}
    />
  );
};

export const CardStack = ({
  cards = [],
  onClick,
  isSelected,
  isValidTarget,
  className = '',
  size = 'md',
  draggableTopCard = false,
  dragId,
  dragData,
  isDragging = false
}) => {
  const count = cards.length;
  const topCard = cards[count - 1];

  const { attributes, listeners, setNodeRef: setDraggableRef, transform } = useDraggable({
    id: dragId || 'default-drag',
    data: dragData,
    disabled: !draggableTopCard || !topCard
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
  } : {
    touchAction: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none'
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative">
        {draggableTopCard && topCard ? (
          <div
            ref={setDraggableRef}
            style={style}
            {...listeners}
            {...attributes}
            className="touch-none select-none cursor-grab active:cursor-grabbing"
          >
            <GameCard
              card={topCard}
              onClick={onClick}
              isSelected={isSelected}
              isValidTarget={isValidTarget}
              size={size}
              isDragging={isDragging}
            />
          </div>
        ) : (
          topCard ? (
            <GameCard
              card={topCard}
              onClick={onClick}
              isSelected={isSelected}
              isValidTarget={isValidTarget}
              size={size}
            />
          ) : (
            <EmptySlot
              onClick={onClick}
              isValidTarget={isValidTarget}
              size={size}
            />
          )
        )}
        {count > 1 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-400/80 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] z-20 pointer-events-none">
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

export const DraggableHandCard = ({ card, index, offset, canDrag, dragId, dragData, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: dragId,
    data: dragData,
    disabled: !canDrag
  });

  const baseTransform = `translateY(${Math.abs(offset) * 8}px) rotate(${offset * 5}deg)`;
  const dragTransform = transform ? CSS.Translate.toString(transform) : '';

  const combinedTransform = dragTransform
    ? `${dragTransform} ${baseTransform}`
    : baseTransform;

  const style = {
    transform: combinedTransform,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    willChange: 'transform',
    WebkitTransform: 'translateZ(0)',
    zIndex: 100 + index,
    transition: transform ? 'none' : 'transform 0.3s ease-out, opacity 0.2s'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`relative origin-bottom touch-none select-none ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <GameCard
        card={card}
        size="xl"
        className="shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
        isDragging={isDragging}
      />
    </div>
  );
};