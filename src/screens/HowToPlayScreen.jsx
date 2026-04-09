import React from 'react';
import { MenuPanel, GameButton } from '../components/ui/GameElements';

const HowToPlayScreen = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative z-10 p-4 bg-game-pattern">
      <div className="absolute inset-0 bg-black/40 z-0 backdrop-blur-sm"></div>
      
      <MenuPanel title="How to Play" className="w-full max-w-2xl">
        <div className="space-y-6 mb-8 text-white font-body">
          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-game-blue flex items-center justify-center font-game font-bold text-xl shrink-0">1</div>
            <div>
              <h3 className="font-bold text-lg text-blue-300 mb-1">Clear Your Stock Pile</h3>
              <p className="text-slate-300">Your goal is to be the first to play all cards from your Stock Pile (left side). The AI is trying to do the same!</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-game-green flex items-center justify-center font-game font-bold text-xl shrink-0">2</div>
            <div>
              <h3 className="font-bold text-lg text-green-300 mb-1">Build in the Center</h3>
              <p className="text-slate-300">Play cards to the center 4 piles in ascending order (1 to 12). Piles must start with a 1 or a Wild card. Wilds (W) can represent any number!</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-10 h-10 rounded-full bg-game-red flex items-center justify-center font-game font-bold text-xl shrink-0">3</div>
            <div>
              <h3 className="font-bold text-lg text-red-300 mb-1">End Your Turn</h3>
              <p className="text-slate-300">You must discard exactly 1 card from your hand to one of your 4 discard piles to end your turn. Plan carefully!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <GameButton onClick={onStart} variant="primary" className="w-64 py-3">
            GOT IT, LET'S PLAY!
          </GameButton>
        </div>
      </MenuPanel>
    </div>
  );
};

export default HowToPlayScreen;