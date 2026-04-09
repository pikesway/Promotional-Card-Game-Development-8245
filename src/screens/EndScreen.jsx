import React, { useEffect, useState } from 'react';
import { MenuPanel, GameButton } from '../components/ui/GameElements';
import { GAME_CONFIG } from '../config';
import { motion } from 'framer-motion';

const EndScreen = ({ gameState, leadData, onRestart }) => {
  const [webhookStatus, setWebhookStatus] = useState('sending');

  useEffect(() => {
    const sendWebhook = async () => {
      const payload = {
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        phone: leadData.phone,
        marketing_consent: leadData.consent,
        score: gameState.player.score,
        result: gameState.winner === 'player' ? 'win' : 'loss',
        game_name: GAME_CONFIG.GAME_NAME,
        played_at: new Date().toISOString(),
        duration: gameState.stats.duration
      };
      
      try {
        const response = await fetch(GAME_CONFIG.WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setWebhookStatus(response.ok ? 'success' : 'error');
      } catch (err) {
        setWebhookStatus('error');
      }
    };
    sendWebhook();
  }, [gameState, leadData]);

  const isWin = gameState.winner === 'player';

  return (
    <div className="app-viewport bg-game-pattern flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm z-10"
      >
        <MenuPanel title={isWin ? "VICTORY!" : "GAME OVER"} className={isWin ? 'border-yellow-400' : 'border-slate-500'}>
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-slate-800/80 w-full rounded-2xl p-6 border border-slate-600 text-center">
              <span className="text-slate-400 font-body text-xs uppercase tracking-widest">Final Score</span>
              <div className="font-game text-6xl text-yellow-400 font-bold my-2">
                {gameState.player.score}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 text-xs font-body uppercase tracking-tighter">
                <div className="bg-slate-900/50 p-2 rounded-lg">
                  <span className="text-slate-500 block">Duration</span>
                  <span className="text-white font-bold">{gameState.stats.duration}s</span>
                </div>
                <div className="bg-slate-900/50 p-2 rounded-lg">
                  <span className="text-slate-500 block">Cleared</span>
                  <span className="text-white font-bold">{gameState.stats.pilesCleared}</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <GameButton onClick={onRestart} variant="primary" className="w-full py-4">
                PLAY AGAIN
              </GameButton>
              <GameButton onClick={() => window.location.reload()} variant="outline" className="w-full text-sm">
                EXIT GAME
              </GameButton>
            </div>
          </div>
        </MenuPanel>
      </motion.div>
    </div>
  );
};

export default EndScreen;