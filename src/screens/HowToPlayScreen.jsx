import React from 'react';
import { MenuPanel, GameButton } from '../components/ui/GameElements';

const HowToPlayScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative z-10 p-4 bg-slate-900">
      <div className="absolute inset-0 bg-game-table opacity-40"></div>
      
      <MenuPanel title="How to Play" className="w-full max-w-2xl pb-12">
        <div className="space-y-4 mb-10 text-white font-body">
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-game font-bold text-xl shrink-0">1</div>
            <div>
              <h3 className="font-bold text-lg text-blue-400 mb-1">Clear Your Stock</h3>
              <p className="text-slate-400 text-sm">Be the first to play all cards from your Stock Pile (bottom left) to win the game.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-game font-bold text-xl shrink-0">2</div>
            <div>
              <h3 className="font-bold text-lg text-green-400 mb-1">Build Up Center Piles</h3>
              <p className="text-slate-400 text-sm">Play cards in order (1 to 12). Wild cards can be any number. Use hand cards or discards!</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-game font-bold text-xl shrink-0">3</div>
            <div>
              <h3 className="font-bold text-lg text-red-400 mb-1">Discard to End Turn</h3>
              <p className="text-slate-400 text-sm">To finish your turn, you must move one card from your hand to a discard pile.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <GameButton onClick={onStart} className="w-full md:w-64 py-4 bg-gradient-to-b from-green-400 to-green-600 border-b-4 border-green-700">
            LET'S GO!
          </GameButton>
        </div>
      </MenuPanel>
    </div>
  );
};

export default HowToPlayScreen;