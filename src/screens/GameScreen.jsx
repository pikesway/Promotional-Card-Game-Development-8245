import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../components/ui/GameElements';
import { GameCard, CardStack, EmptySlot } from '../components/game/Cards';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const GameScreen = ({ engine, onGameOver }) => {
  const { state, dispatch, PHASES } = engine;
  const { FiRefreshCw, FiMenu } = FiIcons;

  useEffect(() => {
    if (state.gameOver) {
      setTimeout(() => onGameOver(state), 1500);
    }
  }, [state.gameOver, onGameOver, state]);

  const handleDraw = () => dispatch({ type: 'DRAW_CARDS' });
  
  const handleSelectCard = (source, index, card) => {
    if (state.turn !== 'player' || state.phase === PHASES.DRAW) return;
    dispatch({ type: 'SELECT_CARD', payload: { source, index, card } });
  };

  const handleBuildPileClick = (pileIndex) => {
    if (state.selectedCard) {
      dispatch({ type: 'PLAY_TO_BUILD', payload: { pileIndex } });
    }
  };

  const handleDiscardClick = (pileIndex) => {
    if (state.selectedCard && state.selectedCard.source === 'hand') {
      dispatch({ type: 'DISCARD', payload: { pileIndex } });
    }
  };

  const isBuildValidTarget = (pileIndex) => {
    if (!state.selectedCard) return false;
    const card = state.selectedCard.card;
    const pile = state.buildPiles[pileIndex];
    const topValue = pile.length > 0 ? pile[pile.length - 1].value : 0;
    return card.type === 'wild' || card.value === topValue + 1;
  };

  const isDiscardValidTarget = () => state.selectedCard && state.selectedCard.source === 'hand';
  const canDraw = state.phase === PHASES.DRAW && state.turn === 'player';

  return (
    <div className="app-viewport bg-game-pattern flex flex-col">
      
      {/* 1. HUD (8%) */}
      <header className="shrink-0 h-[8%] md:h-16 min-h-[40px] bg-slate-900/80 border-b border-white/10 px-4 flex justify-between items-center z-50">
        <div className="w-1/4 flex justify-start">
           <Badge className="bg-slate-800 border border-slate-600 text-slate-200 text-[10px] md:text-sm shadow-inner">
             Score: {state.player.score}
           </Badge>
        </div>
        <div className="w-2/4 text-slate-300 font-body font-bold text-[10px] md:text-sm uppercase tracking-wider text-center truncate px-2">
          {state.message}
        </div>
        <div className="w-1/4 flex justify-end gap-3">
           <button onClick={() => dispatch({type: 'INIT_GAME'})} className="text-slate-400 hover:text-white transition-colors">
             <SafeIcon icon={FiRefreshCw} className="w-4 h-4 md:w-5 md:h-5" />
           </button>
           <button className="text-slate-400 hover:text-white transition-colors md:hidden">
             <SafeIcon icon={FiMenu} className="w-5 h-5" />
           </button>
        </div>
      </header>

      {/* 2. MAIN BOARD AREA (60%) - 3 Equal Panels */}
      <main className="flex-1 flex flex-col justify-evenly gap-2 p-2 md:p-6 w-full max-w-4xl mx-auto z-10">
        
        {/* PANEL 1: AI ZONE */}
        <section className="flex-1 min-h-0 bg-slate-800/40 border border-slate-600/30 rounded-[1.5rem] p-2 md:p-6 flex justify-between items-center shadow-inner">
          <div className="flex flex-col items-center w-1/4">
            <span className="text-slate-400 font-body font-bold text-[9px] md:text-xs mb-1 uppercase tracking-widest">AI</span>
            <CardStack cards={state.ai.stock} size="sm" className="md:scale-110" />
          </div>
          <div className="flex gap-1.5 md:gap-4 justify-end w-3/4 pr-1">
            {state.ai.discards.map((pile, i) => (
               <CardStack key={`ai-d-${i}`} cards={pile} size="xs" className="md:scale-110" />
            ))}
          </div>
        </section>

        {/* PANEL 2: CENTER PLAYFIELD */}
        <section className="flex-1 min-h-0 bg-slate-800/40 border border-slate-600/30 rounded-[1.5rem] p-2 md:p-6 flex justify-between items-center shadow-inner relative">
          <div className="flex flex-col items-center w-1/4 relative">
            <motion.div 
              animate={canDraw ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              onClick={canDraw ? handleDraw : undefined}
              className={`relative ${canDraw ? 'cursor-pointer ring-2 ring-green-400 rounded-md md:rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.5)]' : ''}`}
            >
              <GameCard hidden size="sm" className="md:scale-110" />
              <span className="absolute -bottom-2 -right-2 bg-slate-800 text-white text-[9px] md:text-sm font-bold w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center border border-slate-500 shadow-xl z-20">
                {state.deck.length}
              </span>
            </motion.div>
          </div>
          <div className="flex gap-1.5 md:gap-4 justify-end w-3/4 pr-1">
            {state.buildPiles.map((pile, i) => (
              <CardStack 
                key={`build-${i}`} 
                cards={pile} 
                onClick={() => handleBuildPileClick(i)}
                isValidTarget={isBuildValidTarget(i)}
                size="xs"
                className="md:scale-110"
              />
            ))}
          </div>
        </section>

        {/* PANEL 3: PLAYER ZONE */}
        <section className="flex-1 min-h-0 bg-slate-800/40 border border-slate-600/30 rounded-[1.5rem] flex flex-col justify-center p-2 md:p-6 shadow-inner relative">
          
          {/* Labels Row */}
          <div className="flex justify-between w-full px-2 md:px-6 mb-1">
             <div className="w-1/4 flex justify-center">
               <span className="text-slate-400 font-body font-bold text-[8px] md:text-xs uppercase tracking-widest leading-none">Your Stock</span>
             </div>
             <div className="w-3/4 flex justify-end gap-1.5 md:gap-4 pr-1">
               {['D1', 'D2', 'D3', 'D4'].map(lbl => (
                 <div key={lbl} className="w-10 md:w-16 flex justify-center">
                   <span className="text-slate-400 font-body font-bold text-[8px] md:text-xs uppercase tracking-widest leading-none">{lbl}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Cards Row */}
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col items-center w-1/4">
              <CardStack 
                cards={state.player.stock} 
                onClick={() => handleSelectCard('stock', 0, state.player.stock[state.player.stock.length - 1])}
                isSelected={state.selectedCard?.source === 'stock'}
                size="sm"
                className="md:scale-110"
              />
            </div>
            <div className="flex gap-1.5 md:gap-4 justify-end w-3/4 pr-1">
              {state.player.discards.map((pile, i) => (
                 <CardStack 
                    key={`p-d-${i}`} 
                    cards={pile} 
                    onClick={state.selectedCard?.source === 'hand' ? () => handleDiscardClick(i) : () => handleSelectCard('discard', i, pile[pile.length - 1])}
                    isSelected={state.selectedCard?.source === 'discard' && state.selectedCard?.index === i}
                    isValidTarget={isDiscardValidTarget()}
                    size="xs"
                    className="md:scale-110"
                 />
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 3. TURN BAR (8%) */}
      <section className="shrink-0 h-[8%] md:h-16 w-full flex items-center justify-center relative z-40 px-4">
        <div className="w-full h-[1px] absolute top-1/2 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"></div>
        <motion.button
          animate={{ scale: state.turn === 'player' ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`px-12 py-2 md:px-16 md:py-3 text-[12px] md:text-base font-body font-black tracking-widest shadow-[0_5px_15px_rgba(0,0,0,0.4)] uppercase rounded-full border ${state.turn === 'player' ? "bg-gradient-to-b from-green-400 to-green-600 text-white border-green-300" : "bg-gradient-to-b from-slate-700 to-slate-900 text-slate-400 border-slate-600"}`}
        >
          {state.turn === 'player' ? 'YOUR TURN' : 'AI IS THINKING'}
        </motion.button>
      </section>

      {/* 4. HAND TRAY (24%) - Fanned Layout */}
      <footer className="shrink-0 h-[24%] md:h-56 w-full bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent flex items-end justify-center pb-2 md:pb-6 relative z-50">
        <div className="w-full max-w-md md:max-w-4xl flex justify-center px-4 relative h-full">
          
          {/* Docking Base Graphic */}
          <div className="absolute bottom-2 md:bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/40 blur-md rounded-[100%]"></div>

          <AnimatePresence mode="popLayout">
            {state.player.hand.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-slate-400 font-body text-xs md:text-lg italic flex items-center justify-center h-full mb-4"
              >
                {canDraw ? "Tap the blue stack to draw." : "Waiting for turn..."}
              </motion.div>
            ) : (
              <div className="flex -space-x-5 md:-space-x-8 items-end justify-center pb-4 md:pb-8 w-full">
                {state.player.hand.map((card, i) => {
                  const isSelected = state.selectedCard?.source === 'hand' && state.selectedCard?.index === i;
                  
                  // Math for the fanned arc layout
                  const len = state.player.hand.length;
                  const mid = (len - 1) / 2;
                  const offset = i - mid;
                  const rotation = offset * 5; // Fan spread
                  const yOffsetArc = Math.abs(offset) * 8; // Edges dip down
                  
                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ 
                        y: isSelected ? -30 : yOffsetArc, 
                        rotate: isSelected ? 0 : rotation 
                      }}
                      exit={{ y: -100, opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className={`relative origin-bottom ${isSelected ? 'z-50' : 'z-10 hover:z-40'}`}
                      style={{ zIndex: isSelected ? 50 : i }}
                    >
                      <GameCard 
                        card={card} 
                        onClick={() => handleSelectCard('hand', i, card)}
                        isSelected={isSelected}
                        size="xl"
                        className="shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
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
        <div className="absolute inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
            className="font-game text-6xl md:text-9xl text-white mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            {state.winner === 'player' ? 'VICTORY!' : 'DEFEAT'}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;