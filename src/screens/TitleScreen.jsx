import React from 'react';
import { GameButton } from '../components/ui/GameElements';
import { GAME_CONFIG } from '../config';
import { motion } from 'framer-motion';

const TitleScreen = ({ onPlay }) => {
  return (
    <div className="app-viewport bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-game-table opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full pb-12">
        {/* Animated Card scatter */}
        <div className="relative w-full h-44 mb-10">
          <motion.div 
            initial={{ x: -100, rotate: -45, opacity: 0 }} 
            animate={{ x: -55, rotate: -15, opacity: 1 }} 
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute left-1/2 top-4 w-20 h-28 bg-white rounded-xl shadow-2xl border-[3px] border-white flex items-center justify-center"
          >
            <span className="text-4xl font-game font-bold text-blue-500">7</span>
          </motion.div>
          
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 16, opacity: 1 }} 
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-32 bg-white rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-[4px] border-white z-10 flex items-center justify-center"
          >
            <span className="text-5xl font-game font-black text-purple-600">W</span>
          </motion.div>
          
          <motion.div 
            initial={{ x: 100, rotate: 45, opacity: 0 }} 
            animate={{ x: 20, rotate: 20, opacity: 1 }} 
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute left-1/2 top-6 w-20 h-28 bg-white rounded-xl shadow-2xl border-[3px] border-white flex items-center justify-center"
          >
            <span className="text-4xl font-game font-bold text-red-500">12</span>
          </motion.div>
        </div>

        <h1 className="text-6xl font-game font-black text-white text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-2 leading-tight tracking-tight">
          {GAME_CONFIG.TITLE_TEXT}
        </h1>
        
        <p className="text-xl font-body text-green-400 font-bold mb-16 text-center tracking-wide">
          {GAME_CONFIG.SUBTITLE_TEXT}
        </p>

        <GameButton 
          onClick={onPlay} 
          className="w-full py-5 text-3xl shadow-2xl bg-gradient-to-b from-green-400 to-green-600 border-b-4 border-green-700 hover:from-green-300 hover:to-green-500 transition-all transform active:scale-95"
        >
          PLAY NOW
        </GameButton>

        <div className="mt-12 text-white/30 text-[10px] font-body uppercase tracking-[0.3em] animate-pulse">
          Tap to start your journey
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;