import { useReducer, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '../config';
import confetti from 'canvas-confetti';

// Constants
const PHASES = {
  DRAW: 'DRAW',
  PLAY: 'PLAY',
  DISCARD: 'DISCARD'
};

// Initial State Factory
export const createInitialState = () => ({
  deck: [],
  player: {
    stock: [],
    hand: [],
    discards: [[], [], [], []],
    score: 0
  },
  ai: {
    stock: [],
    hand: [],
    discards: [[], [], [], []]
  },
  buildPiles: [[], [], [], []],
  turn: 'player',
  phase: PHASES.DRAW,
  message: "Your turn! Tap the Draw Pile to start.",
  gameOver: false,
  winner: null,
  stats: {
    turnsTaken: 0,
    cardsPlayed: 0,
    pilesCleared: 0,
    startTime: Date.now(),
    duration: 0
  }
});

// Deck Generation
const generateDeck = () => {
  let cards = [];
  let id = 1;
  // 12 sets of 1-12
  for (let s = 0; s < 12; s++) {
    for (let v = 1; v <= 12; v++) {
      cards.push({ id: id++, type: 'number', value: v });
    }
  }
  // 18 wilds
  for (let w = 0; w < 18; w++) {
    cards.push({ id: id++, type: 'wild', value: null });
  }
  return cards.sort(() => Math.random() - 0.5);
};

// Reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_GAME': {
      const deck = generateDeck();
      const playerStock = deck.splice(0, GAME_CONFIG.STOCK_PILE_SIZE);
      const aiStock = deck.splice(0, GAME_CONFIG.STOCK_PILE_SIZE);
      return {
        ...createInitialState(),
        deck,
        player: { ...state.player, stock: playerStock, hand: [], discards: [[], [], [], []], score: 0 },
        ai: { ...state.ai, stock: aiStock, hand: [], discards: [[], [], [], []] },
        phase: PHASES.DRAW,
        message: "Your turn! Tap the Draw Pile to start.",
        stats: { ...createInitialState().stats, startTime: Date.now() }
      };
    }

    case 'DRAW_CARDS': {
      if (state.turn !== 'player' || state.phase !== PHASES.DRAW) return state;
      let newDeck = [...state.deck];
      let newHand = [...state.player.hand];
      while (newHand.length < GAME_CONFIG.HAND_SIZE && newDeck.length > 0) {
        newHand.push(newDeck.pop());
      }
      return {
        ...state,
        deck: newDeck,
        player: { ...state.player, hand: newHand },
        phase: PHASES.PLAY,
        message: "Drag cards to the center or discard to end turn."
      };
    }

    case 'PLAY_TO_BUILD': {
      const { pileIndex, card, source, sourceIndex } = action.payload;
      const pile = state.buildPiles[pileIndex];
      const topValue = pile.length > 0 ? pile[pile.length - 1].value : 0;

      // Validation
      let isValid = false;
      let effectiveValue = card.value;
      if (card.type === 'wild') {
        isValid = true;
        effectiveValue = topValue + 1;
      } else if (card.value === topValue + 1) {
        isValid = true;
      }

      if (!isValid) {
        return { ...state, message: "Invalid move!" };
      }

      // Execute Move
      let newPlayer = { ...state.player };
      if (source === 'hand') newPlayer.hand.splice(sourceIndex, 1);
      if (source === 'stock') newPlayer.stock.pop();
      if (source === 'discard') newPlayer.discards[sourceIndex].pop();

      newPlayer.score += GAME_CONFIG.SCORE_VALUES.PLAY_CARD;

      let newBuildPiles = [...state.buildPiles];
      let newPile = [...pile, { ...card, value: effectiveValue }];
      let newDeck = [...state.deck];
      let pilesCleared = state.stats.pilesCleared;

      // JUICE MECHANIC 2: Confetti Explosion on Pile Clear
      if (newPile.length === 12 || effectiveValue === 12) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#ef4444', '#eab308']
        });

        newDeck = [...newPile, ...newDeck].sort(() => Math.random() - 0.5);
        newPile = [];
        newPlayer.score += GAME_CONFIG.SCORE_VALUES.CLEAR_PILE;
        pilesCleared++;
      }

      newBuildPiles[pileIndex] = newPile;

      // Check Win
      if (newPlayer.stock.length === 0) {
        newPlayer.score += GAME_CONFIG.SCORE_VALUES.WIN;
        return {
          ...state,
          player: newPlayer,
          buildPiles: newBuildPiles,
          deck: newDeck,
          gameOver: true,
          winner: 'player',
          message: "You won!",
          stats: {
            ...state.stats,
            duration: Math.floor((Date.now() - state.stats.startTime) / 1000),
            pilesCleared
          }
        };
      }

      // If hand is empty, draw 5 immediately
      if (newPlayer.hand.length === 0 && source !== 'discard') {
        while (newPlayer.hand.length < GAME_CONFIG.HAND_SIZE && newDeck.length > 0) {
          newPlayer.hand.push(newDeck.pop());
        }
        return {
          ...state,
          player: newPlayer,
          buildPiles: newBuildPiles,
          deck: newDeck,
          message: "Hand empty! Drew 5 new cards.",
          stats: { ...state.stats, cardsPlayed: state.stats.cardsPlayed + 1, pilesCleared }
        };
      }

      return {
        ...state,
        player: newPlayer,
        buildPiles: newBuildPiles,
        deck: newDeck,
        message: "Good play!",
        stats: { ...state.stats, cardsPlayed: state.stats.cardsPlayed + 1, pilesCleared }
      };
    }

    case 'DISCARD': {
      const { pileIndex, sourceIndex } = action.payload;
      let newPlayer = { ...state.player };
      const card = newPlayer.hand[sourceIndex];
      if (!card) {
        return { ...state, message: "Invalid discard." };
      }
      newPlayer.hand.splice(sourceIndex, 1);
      newPlayer.discards[pileIndex].push(card);
      return {
        ...state,
        player: newPlayer,
        turn: 'ai',
        phase: PHASES.DRAW,
        message: "AI Turn...",
        stats: { ...state.stats, turnsTaken: state.stats.turnsTaken + 1 }
      };
    }

    case 'AI_ACTION': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};

export const useGameEngine = () => {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  const getValidMove = useCallback((card, buildPiles) => {
    if (!card) return -1;
    for (let i = 0; i < buildPiles.length; i++) {
      const pile = buildPiles[i];
      const topVal = pile.length > 0 ? pile[pile.length - 1].value : 0;
      if (card.type === 'wild' || card.value === topVal + 1) {
        return i;
      }
    }
    return -1;
  }, []);

  useEffect(() => {
    if (state.turn !== 'ai' || state.gameOver) return;

    let timeout;
    const executeAiTurn = () => {
      let aiState = { ...state.ai };
      let newBuildPiles = [...state.buildPiles];
      let newDeck = [...state.deck];

      // 1. Draw cards
      if (aiState.hand.length < GAME_CONFIG.HAND_SIZE) {
        while (aiState.hand.length < GAME_CONFIG.HAND_SIZE && newDeck.length > 0) {
          aiState.hand.push(newDeck.pop());
        }
      }

      const tryPlay = () => {
        // Priority 1: Stock
        const stockTop = aiState.stock[aiState.stock.length - 1];
        let targetPile = getValidMove(stockTop, newBuildPiles);
        if (targetPile !== -1) {
          applyMove(stockTop, targetPile, 'stock', 0);
          return true;
        }

        // Priority 2: Hand
        for (let i = 0; i < aiState.hand.length; i++) {
          targetPile = getValidMove(aiState.hand[i], newBuildPiles);
          if (targetPile !== -1) {
            applyMove(aiState.hand[i], targetPile, 'hand', i);
            return true;
          }
        }

        // Priority 3: Discards
        for (let i = 0; i < aiState.discards.length; i++) {
          const discTop = aiState.discards[i][aiState.discards[i].length - 1];
          targetPile = getValidMove(discTop, newBuildPiles);
          if (targetPile !== -1) {
            applyMove(discTop, targetPile, 'discard', i);
            return true;
          }
        }
        return false;
      };

      const applyMove = (card, pileIndex, source, sourceIndex) => {
        const topVal = newBuildPiles[pileIndex].length > 0 ? newBuildPiles[pileIndex][newBuildPiles[pileIndex].length - 1].value : 0;
        const effectiveVal = card.type === 'wild' ? topVal + 1 : card.value;

        if (source === 'stock') aiState.stock.pop();
        if (source === 'hand') aiState.hand.splice(sourceIndex, 1);
        if (source === 'discard') aiState.discards[sourceIndex].pop();

        let newPile = [...newBuildPiles[pileIndex], { ...card, value: effectiveVal }];

        if (newPile.length === 12 || effectiveVal === 12) {
          newDeck = [...newPile, ...newDeck].sort(() => Math.random() - 0.5);
          newPile = [];
        }

        newBuildPiles[pileIndex] = newPile;
      };

      let movesThisTurn = 0;
      while (tryPlay() && movesThisTurn < 10) {
        movesThisTurn++;
        if (aiState.stock.length === 0) {
          dispatch({
            type: 'AI_ACTION',
            payload: {
              ai: aiState,
              buildPiles: newBuildPiles,
              deck: newDeck,
              gameOver: true,
              winner: 'ai',
              message: "AI Wins!",
              stats: { ...state.stats, duration: Math.floor((Date.now() - state.stats.startTime) / 1000) }
            }
          });
          return;
        }
        if (aiState.hand.length === 0) {
          while (aiState.hand.length < GAME_CONFIG.HAND_SIZE && newDeck.length > 0) {
            aiState.hand.push(newDeck.pop());
          }
        }
      }

      // End Turn: Discard
      if (aiState.hand.length > 0) {
        let minIdx = 0;
        for (let i = 1; i < 4; i++) {
          if (aiState.discards[i].length < aiState.discards[minIdx].length) minIdx = i;
        }
        aiState.discards[minIdx].push(aiState.hand.pop());
      }

      dispatch({
        type: 'AI_ACTION',
        payload: {
          ai: aiState,
          buildPiles: newBuildPiles,
          deck: newDeck,
          turn: 'player',
          phase: PHASES.DRAW,
          message: "Your turn! Tap the Draw Pile to start.",
          stats: { ...state.stats, turnsTaken: state.stats.turnsTaken + 1 }
        }
      });
    };

    timeout = setTimeout(executeAiTurn, 1200);
    return () => clearTimeout(timeout);
  }, [state.turn, state.gameOver, getValidMove]);

  return { state, dispatch, PHASES };
};