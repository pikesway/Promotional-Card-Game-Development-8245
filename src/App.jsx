import React, { useState, useEffect } from 'react';
import TitleScreen from './screens/TitleScreen';
import LeadCaptureScreen from './screens/LeadCaptureScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import GameScreen from './screens/GameScreen';
import EndScreen from './screens/EndScreen';
import { useGameEngine } from './hooks/useGameEngine';

const SCREENS = { TITLE: 'TITLE', LEAD: 'LEAD', HOWTO: 'HOWTO', GAME: 'GAME', END: 'END' };

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.TITLE);
  const [leadData, setLeadData] = useState(null);
  const [finalGameState, setFinalGameState] = useState(null);
  const gameEngine = useGameEngine();

  // Lock screen scrolling on touch devices (especially Safari)
  useEffect(() => {
    const preventScroll = (e) => {
      e.preventDefault();
    };

    // Add event listener with { passive: false } to enable preventDefault
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // Cleanup function to remove the event listener on component unmount
    return () => {
      document.removeEventListener('touchmove', preventScroll, { passive: false });
    };
  }, []); // Empty dependency array ensures this effect runs only once

  const handlePlayClick = () => {
    setCurrentScreen(SCREENS.LEAD);
  };

  const handleLeadSubmit = (data) => {
    setLeadData(data);
    setCurrentScreen(SCREENS.HOWTO);
  };

  const handleStartGame = () => {
    gameEngine.dispatch({ type: 'INIT_GAME' });
    setCurrentScreen(SCREENS.GAME);
  };

  const handleGameOver = (state) => {
    setFinalGameState(state);
    setCurrentScreen(SCREENS.END);
  };

  const handleRestart = () => {
    gameEngine.dispatch({ type: 'INIT_GAME' });
    setCurrentScreen(SCREENS.GAME);
  };

  return (
    <div className="app-viewport bg-slate-900">
      {currentScreen === SCREENS.TITLE && (
        <TitleScreen onPlay={handlePlayClick} />
      )}
      {currentScreen === SCREENS.LEAD && (
        <LeadCaptureScreen
          onSubmit={handleLeadSubmit}
          onBack={() => setCurrentScreen(SCREENS.TITLE)}
        />
      )}
      {currentScreen === SCREENS.HOWTO && (
        <HowToPlayScreen onStart={handleStartGame} />
      )}
      {currentScreen === SCREENS.GAME && (
        <GameScreen engine={gameEngine} onGameOver={handleGameOver} />
      )}
      {currentScreen === SCREENS.END && (
        <EndScreen
          gameState={finalGameState}
          leadData={leadData}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;