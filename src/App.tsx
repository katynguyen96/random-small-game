import React, { useState } from 'react';
import './App.css';
import Game from './Game';
import GameSelectionScreen from './components/GameSelectionScreen';
import CultureQuizGame from './components/CultureQuizGame';
import ColorGame from './components/ColorGame';
import FindDifferencesGame from './components/FindDifferencesGame';

type Screen = 'menu' | 'trash-game' | 'culture-quiz' | 'color-game' | 'find-differences';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'trash-game') {
      setCurrentScreen('trash-game');
    } else if (gameId === 'culture-quiz') {
      setCurrentScreen('culture-quiz');
    } else if (gameId === 'color-game') {
      setCurrentScreen('color-game');
    } else if (gameId === 'find-differences') {
      setCurrentScreen('find-differences');
    }
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="App">
      {currentScreen === 'menu' ? (
        <GameSelectionScreen onSelectGame={handleSelectGame} />
      ) : currentScreen === 'trash-game' ? (
        <Game />
      ) : currentScreen === 'culture-quiz' ? (
        <CultureQuizGame onBackToMenu={handleBackToMenu} />
      ) : currentScreen === 'color-game' ? (
        <ColorGame onBackToMenu={handleBackToMenu} />
      ) : (
        <FindDifferencesGame onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
