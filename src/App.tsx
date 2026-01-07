import React, { useState } from 'react';
import './App.css';
import Game from './Game';
import GameSelectionScreen from './components/GameSelectionScreen';
import CultureQuizGame from './components/CultureQuizGame';
import ColorGame from './components/ColorGame';

type Screen = 'menu' | 'trash-game' | 'culture-quiz' | 'color-game';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'trash-game') {
      setCurrentScreen('trash-game');
    } else if (gameId === 'culture-quiz') {
      setCurrentScreen('culture-quiz');
    } else if (gameId === 'color-game') {
      setCurrentScreen('color-game');
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
      ) : (
        <ColorGame onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
