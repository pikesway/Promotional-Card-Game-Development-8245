import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import { Badge } from '../components/ui/GameElements';
import { GameCard, CardStack, DraggableHandCard } from '../components/game/Cards';
import DroppableZone from '../components/game/DroppableZone';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const GameScreen = ({ engine, onGameOver }) => {
  const { state, dispatch, PHASES } = engine;
  const { FiRefreshCw } = FiIcons;

  const [activeDrag, setActiveDrag] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [prevScore, setPrevScore] = useState(state.player.score);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    if (state.gameOver) {
      setTimeout(() => onGameOver(state), 1500);
    }
  }, [state.gameOver, onGameOver, state]);

  useEffect(() => {
    if (state.player.score > prevScore) {
      const scoreDiff = state.player.score - prevScore;
      const newText = {
        id: Date.now(),
        value: `+${scoreDiff}`,
        x: 50,
        y: 50
      };
      setFloatingTexts((prev) => [...prev, newText]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== newText.id));
      }, 1000);
    }
    setPrevScore(state.player.score);
  }, [state.player.score, prevScore]);

  const handleDraw = () => dispatch({ type: 'DRAW_CARDS' });

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDrag(active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || !activeDrag) {
      setActiveDrag(null);
      return;
    }

    const { card, sourceType, sourceIndex } = activeDrag;
    const targetId = over.id;

    if (targetId.startsWith('build-')) {
      const pileIndex = parseInt(targetId.split('-')[1]);
      const pile = state.buildPiles[pileIndex];
      const topValue = pile.length > 0 ? pile[pile.length - 1].value : 0;
      const isValid = card.type === 'wild' || card.value === topValue + 1;

      if (isValid) {
        dispatch({
          type: 'PLAY_TO_BUILD',
          payload: {
            pileIndex,
            card,
            source: sourceType,
            sourceIndex
          }
        });
      }
    }

    if (targetId.startsWith('discard-p-') && sourceType === 'hand') {
      const pileIndex = parseInt(targetId.split('-')[2]);
      dispatch({
        type: 'DISCARD',
        payload: {
          pileIndex,
          card,
          sourceIndex
        }
      });
    }

    setActiveDrag(null);
  };

  const handleDragCancel = () => {
    setActiveDrag(null);
  };

  const canDraw = state.phase === PHASES.DRAW && state.turn === 'player';
  const canDrag = state.turn === 'player' && state.phase === PHASES.PLAY;
  const isPlayerTurn = state.turn === 'player';

  const headerTheme = isPlayerTurn
    ? 'bg-green-900/40 border-b border-green-500 shadow-[0_4px_20px_rgba(34,197,94,0.3)]'
    : 'bg-slate-900/90 border-b border-slate-700';

  const DragOverlayPortal = activeDrag ? createPortal(
    <DragOverlay dropAnimation={null}>
      <div
        style={{
          cursor: 'grabbing',
          transform: 'rotate(3deg) scale(1.15)',
          filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
          pointerEvents: 'none'
        }}
      >
        <GameCard
          card={activeDrag.card}
          size={activeDrag.sourceType === 'hand' ? 'xl' : 'sm'}
        />
      </div>
    </DragOverlay>,
    document.body
  ) : null;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
      sensors={sensors}
    >
      <div className="app-viewport bg-slate-900 w-full h-full absolute inset-0 flex flex-col overflow-hidden">

        <header className={`shrink-0 h-14 backdrop-blur-md px-4 flex justify-between items-center z-50 transition-all duration-300 ${headerTheme}`}>
          <Badge className="bg-slate-800/80 border border-slate-600/50 text-slate-200 text-xs font-bold px-3 py-1">
            Score: {state.player.score}
          </Badge>
          <div className={`font-body font-bold text-xs uppercase tracking-[0.2em] text-center truncate px-2 ${isPlayerTurn ? 'text-green-400' : 'text-slate-400'}`}>
            {isPlayerTurn ? 'YOUR TURN' : 'AI IS THINKING'}
          </div>
          <button
            onClick={() => dispatch({ type: 'INIT_GAME' })}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 w-full max-w-[420px] mx-auto flex flex-col justify-between px-4 md:px-6 pt-6 pb-[10vh] relative z-10">

          <div className="grid grid-cols-5 gap-2 w-full opacity-75 pointer-events-none">
            <div className="flex flex-col items-center justify-start">
              <CardStack cards={state.ai.stock} size="sm" />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest text-center mt-1 w-full block">Stock</span>
            </div>
            {state.ai.discards.map((pile, i) => (
              <div key={`ai-d-${i}`} className="flex flex-col items-center justify-start">
                <CardStack cards={pile} size="sm" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2 w-[92%] mx-auto scale-105 origin-center my-4 relative">
            <div
              onClick={canDraw ? handleDraw : undefined}
              className={`relative flex flex-col items-center justify-start transition-transform ${canDraw ? 'cursor-pointer ring-4 ring-green-400/80 rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.6)] active:scale-95' : ''}`}
            >
              <GameCard hidden size="md" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-xl z-20 pointer-events-none">
                {state.deck.length}
              </span>
            </div>

            {state.buildPiles.map((pile, i) => (
              <DroppableZone
                key={`build-${i}`}
                id={`build-${i}`}
              >
                <CardStack
                  cards={pile}
                  size="md"
                />
              </DroppableZone>
            ))}

            <AnimatePresence>
              {floatingTexts.map((text) => (
                <motion.div
                  key={text.id}
                  initial={{ y: 0, opacity: 1, scale: 0.5 }}
                  animate={{ y: -50, opacity: 0, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute pointer-events-none z-50"
                  style={{
                    left: `${text.x}%`,
                    top: `${text.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="font-game text-4xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,1)] pointer-events-none">
                    {text.value}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-5 gap-2 w-full">
            <div className="flex flex-col items-center justify-start">
              <CardStack
                cards={state.player.stock}
                size="sm"
                draggableTopCard={canDrag && state.player.stock.length > 0}
                dragId="stock-0"
                dragData={{
                  card: state.player.stock[state.player.stock.length - 1],
                  sourceType: 'stock',
                  sourceIndex: 0
                }}
                isDragging={activeDrag?.sourceType === 'stock'}
              />
              <span className="text-[9px] text-slate-400 uppercase tracking-widest text-center mt-1 w-full block">Stock</span>
            </div>

            {state.player.discards.map((pile, i) => (
              <DroppableZone
                key={`p-d-${i}`}
                id={`discard-p-${i}`}
              >
                <CardStack
                  cards={pile}
                  size="sm"
                  draggableTopCard={canDrag && pile.length > 0}
                  dragId={`discard-p-${i}`}
                  dragData={{
                    card: pile[pile.length - 1],
                    sourceType: 'discard',
                    sourceIndex: i
                  }}
                  isDragging={activeDrag?.sourceType === 'discard' && activeDrag?.sourceIndex === i}
                />
              </DroppableZone>
            ))}
          </div>
        </main>

        <footer className="shrink-0 w-full h-[16vh] min-h-[110px] bg-slate-800 border-t-2 border-slate-700 flex items-center justify-center pb-4 pointer-events-none">
          <div className="w-full max-w-md flex justify-center px-4 relative h-full">
            <AnimatePresence mode="popLayout">
              {state.player.hand.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 font-body text-xs italic flex items-center justify-center h-full pointer-events-none"
                >
                  {canDraw ? "Tap deck to draw cards" : "Waiting..."}
                </motion.div>
              ) : (
                <div className="flex -space-x-8 items-end justify-center pb-4 w-full pointer-events-auto">
                  {state.player.hand.map((card, i) => {
                    const offset = i - (state.player.hand.length - 1) / 2;
                    const isDragging = activeDrag?.sourceType === 'hand' && activeDrag?.sourceIndex === i;

                    return (
                      <DraggableHandCard
                        key={card.id}
                        card={card}
                        index={i}
                        offset={offset}
                        canDrag={canDrag}
                        dragId={`hand-${i}`}
                        dragData={{
                          card,
                          sourceType: 'hand',
                          sourceIndex: i
                        }}
                        isDragging={isDragging}
                      />
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </footer>

        {DragOverlayPortal}

        {state.gameOver && (
          <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-game text-7xl text-white mb-8 drop-shadow-glow pointer-events-none"
            >
              {state.winner === 'player' ? 'VICTORY!' : 'DEFEAT'}
            </motion.div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default GameScreen;