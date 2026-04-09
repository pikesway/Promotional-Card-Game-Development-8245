import React from 'react';
import { GameButton } from '../components/ui/GameElements';
import { GAME_CONFIG } from '../config';
import { motion } from 'framer-motion';

const TitleScreen = ({ onPlay }) => {
  return (
    <div className="app-viewport bg-game-pattern flex items-center justify-center p-6">
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Animated Card scatter */}
        <div className="relative w-full h-40 mb-8">
          <motion.div 
            initial={{ x: -100, rotate: -45, opacity: 0 }}
            animate={{ x: -48, rotate: -15, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute left-1/2 top-4 w-20 h-28 bg-white rounded-lg shadow-xl border border-slate-200 flex items-center justify-center"
          >
             <span className="text-4xl font-game font-bold text-game-blue">7</span>
          </motion.div>
          
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 16, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-32 bg-white rounded-lg shadow-2xl border border-slate-200 z-10 flex items-center justify-center"
          >
             <span className="text-5xl font-game font-bold text-game-purple">W</span>
          </motion.div>

          <motion.div 
            initial={{ x: 100, rotate: 45, opacity: 0 }}
            animate={{ x: 16, rotate: 20, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute left-1/2 top-6 w-20 h-28 bg-white rounded-lg shadow-xl border border-slate-200 flex items-center justify-center"
          >
             <span className="text-4xl font-game font-bold text-game-red">12</span>
          </motion.div>
        </div>

        <h1 className="text-6xl font-game font-black text-white text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-2 leading-tight">
          {GAME_CONFIG.TITLE_TEXT}
        </h1>
        <p className="text-xl font-body text-green-100 font-bold mb-12 text-center opacity-90 tracking-wide">
          {GAME_CONFIG.SUBTITLE_TEXT}
        </p>

        <GameButton onClick={onPlay} variant="primary" className="w-full py-5 text-3xl shadow-2xl animate-bounce-slow">
          PLAY NOW
        </GameButton>
        
        <div className="mt-16 text-white/40 text-xs font-body uppercase tracking-[0.2em] animate-pulse">
          Tap to start
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;