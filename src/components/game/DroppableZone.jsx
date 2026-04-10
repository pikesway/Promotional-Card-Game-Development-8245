import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableZone = ({ id, children, className = '' }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: !id
  });

  const magneticStyle = isOver 
    ? 'bg-green-500/20 ring-4 ring-green-400 ring-opacity-100 shadow-[0_0_30px_rgba(74,222,128,0.8)] transition-all duration-150 rounded-xl' 
    : '';

  return (
    <div 
      ref={setNodeRef} 
      className={`relative w-full h-full flex justify-center items-center ${magneticStyle} ${className}`}
    >
      {children}
    </div>
  );
};

export default DroppableZone;