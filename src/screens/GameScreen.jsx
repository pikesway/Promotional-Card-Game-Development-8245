import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/ui/GameElements';
import { GameCard, CardStack } from '../components/game/Cards';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const GameScreen = ({ engine, onGameOver }) => {
  const { state, dispatch, PHASES } = engine;
  const { FiRefreshCw } = FiIcons;

  // Refs for drop zones
  const buildPileRefs = useRef([]);
  const discardPileRefs = useRef([]);

  useEffect(() => {
    if (state.gameOver) {
      setTimeout(() => onGameOver(state), 1500);
    }
  }, [state.gameOver, onGameOver, state]);

  const handleDraw = () => dispatch({ type: 'DRAW_CARDS' });

  const handleDragEnd = (card, sourceType, sourceIndex) => (event, info) => {
    const dropPoint = { x: info.point.x, y: info.point.y };

    // Check build piles first
    for (let i = 0; i < buildPileRefs.current.length; i++) {
      const ref = buildPileRefs.current[i];
      if (!ref) continue;
      
      const rect = ref.getBoundingClientRect();
      if (
        dropPoint.x >= rect.left &&
        dropPoint.x <= rect.right &&
        dropPoint.y >= rect.top &&
        dropPoint.y <= rect.bottom
      ) {
        // Check if valid move
        const pile = state.buildPiles[i];
        const topValue = pile.length > 0 ? pile[pile.length - 1].value : 0;
        const isValid = card.type === 'wild' || card.value === topValue + 1;

        if (isValid) {
          dispatch({
            type: 'PLAY_TO_BUILD',
            payload: {
              pileIndex: i,
              card,
              source: sourceType,
              sourceIndex
            }
          });
          return;
        }
      }
    }

    // Check discard piles (only for hand cards)
    if (sourceType === 'hand') {
      for (let i = 0; i < discardPileRefs.current.length; i++) {
        const ref = discardPileRefs.current[i];
        if (!ref) continue;
        
        const rect = ref.getBoundingClientRect();
        if (
          dropPoint.x >= rect.left &&
          dropPoint.x <= rect.right &&
          dropPoint.y >= rect.top &&
          dropPoint.y <= rect.bottom
        ) {
          dispatch({
            type: 'DISCARD',
            payload: {
              pileIndex: i,
              card,
              sourceIndex
            }
          });
          return;
        }
      }
    }
  };

  const canDraw = state.phase === PHASES.DRAW && state.turn === 'player';
  const canDrag = state.turn === 'player' && state.phase === PHASES.PLAY;

  return (
    <div className="app-viewport bg-slate-900 flex flex-col">
      
      {/* 1. COMPACT HUD */}
      <header className="shrink-0 h-14 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-4 flex justify-between items-center z-50">
        <Badge className="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-xs font-bold px-3 py-1">
          Score: {state.player.score}
        </Badge>
        <div className="text-slate-400 font-body font-bold text-[10px] uppercase tracking-[0.2em] text-center truncate px-2 max-w-[50%]">
          {state.message}
        </div>
        <button 
          onClick={() => dispatch({ type: 'INIT_GAME' })} 
          className="text-slate-500 hover:text-white transition-colors"
        >
          <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
        </button>
      </header>

      {/* 2. MAIN BOARD AREA */}
      <main className="flex-1 flex flex-col justify-between py-4 px-4 w-full max-w-lg mx-auto z-10 relative pb-[28vh]">
        
        {/* ROW 1: AI ZONE */}
        <div className="flex justify-between items-start">
          <div className="relative flex flex-col items-center">
            <CardStack cards={state.ai.stock} size="sm" />
            <Badge className="absolute -bottom-3 bg-slate-800 border border-slate-600 rounded-full px-2.5 py-0.5 text-[9px] text-slate-400 uppercase font-bold shadow-lg">
              AI Stock
            </Badge>
          </div>
          <div className="flex gap-2 justify-center">
            {state.ai.discards.map((pile, i) => (
              <CardStack key={`ai-d-${i}`} cards={pile} size="xs" />
            ))}
          </div>
        </div>

        {/* ROW 2: BUILD PILES */}
        <div className="flex gap-2 justify-center">
          {state.buildPiles.map((pile, i) => (
            <div 
              key={`build-${i}`}
              ref={el => buildPileRefs.current[i] = el}
              className="relative"
            >
              <CardStack cards={pile} size="md" />
            </div>
          ))}
        </div>

        {/* ROW 3: DECK & TURN INDICATOR */}
        <div className="flex justify-between items-center relative h-20">
          <motion.div 
            onClick={canDraw ? handleDraw : undefined} 
            className={`relative shrink-0 ${canDraw ? 'cursor-pointer ring-4 ring-green-400/80 rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.6)]' : ''}`}
            whileTap={canDraw ? { scale: 0.95 } : {}}
          >
            <GameCard hidden size="md" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xl z-20">
              {state.deck.length}
            </span>
          </motion.div>
          
          <div className="absolute left-1/2 -translate-x-1/2 z-20">
            <motion.div
              animate={{ y: state.turn === 'player' ? [0, -5, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`px-8 py-2.5 text-xs font-game font-black tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.6)] uppercase rounded-full border-2 ${
                state.turn === 'player' 
                  ? "bg-gradient-to-b from-green-400 to-green-600 text-white border-green-300" 
                  : "bg-gradient-to-b from-slate-700 to-slate-900 text-slate-400 border-slate-600"
              }`}
            >
              {state.turn === 'player' ? 'YOUR TURN' : 'AI IS THINKING'}
            </motion.div>
          </div>
        </div>

        {/* ROW 4: PLAYER ZONE */}
        <div className="flex justify-between items-end">
          <div className="relative flex flex-col items-center">
            {state.player.stock.length > 0 && (
              <motion.div
                drag={canDrag}
                dragSnapToOrigin
                dragElastic={0.1}
                onDragEnd={handleDragEnd(
                  state.player.stock[state.player.stock.length - 1],
                  'stock',
                  0
                )}
                whileDrag={{ 
                  scale: 1.15,
                  rotate: 3,
                  zIndex: 300,
                  cursor: 'grabbing',
                  filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))'
                }}
                className={canDrag ? 'cursor-grab' : ''}
              >
                <CardStack cards={state.player.stock} size="sm" />
              </motion.div>
            )}
            {state.player.stock.length === 0 && (
              <CardStack cards={[]} size="sm" />
            )}
            <Badge className="absolute -bottom-3 bg-slate-800 border border-slate-600 rounded-full px-2.5 py-0.5 text-[9px] text-white uppercase font-bold shadow-lg">
              Your Stock
            </Badge>
          </div>
          
          <div className="flex gap-2 justify-center">
            {state.player.discards.map((pile, i) => (
              <div 
                key={`p-d-${i}`}
                ref={el => discardPileRefs.current[i] = el}
                className="relative"
              >
                <CardStack cards={pile} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 4. HAND TRAY (Frosted Glass Footer) */}
      <footer className="absolute bottom-0 left-0 w-full h-[26vh] min-h-[160px] bg-slate-800 border-t border-white/10 flex items-center justify-center pb-6 pointer-events-none">
        <div className="w-full max-w-md flex justify-center px-4 relative h-full">
          <AnimatePresence mode="popLayout">
            {state.player.hand.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-slate-500 font-body text-xs italic flex items-center justify-center h-full"
              >
                {canDraw ? "Tap deck to draw cards" : "Waiting..."}
              </motion.div>
            ) : (
              <div className="flex -space-x-8 items-end justify-center pb-4 w-full pointer-events-auto">
                {state.player.hand.map((card, i) => {
                  const offset = i - (state.player.hand.length - 1) / 2;
                  return (
                    <motion.div
                      key={card.id}
                      layoutId={card.id}
                      drag={canDrag}
                      dragSnapToOrigin
                      dragElastic={0.1}
                      onDragEnd={handleDragEnd(card, 'hand', i)}
                      initial={{ y: 200, opacity: 0 }}
                      animate={{ 
                        y: Math.abs(offset) * 8, 
                        rotate: offset * 5,
                        opacity: 1
                      }}
                      whileDrag={{ 
                        scale: 1.25,
                        rotate: offset * 3,
                        y: -70,
                        zIndex: 300,
                        cursor: 'grabbing',
                        filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))'
                      }}
                      className={`relative origin-bottom ${canDrag ? 'cursor-grab' : ''}`}
                      style={{ zIndex: 50 + i }}
                    >
                      <GameCard 
                        card={card} 
                        size="xl"
                        className="shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </footer>

      {/* GAME OVER OVERLAY */}
      {state.gameOver && (
        <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="font-game text-7xl text-white mb-8 drop-shadow-glow"
          >
            {state.winner === 'player' ? 'VICTORY!' : 'DEFEAT'}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;