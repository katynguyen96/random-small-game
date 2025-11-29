import React, { useState } from 'react';
import './App.css';
import Game from './Game';
import GameSelectionScreen from './components/GameSelectionScreen';
import CultureQuizGame from './components/CultureQuizGame';

type Screen = 'menu' | 'trash-game' | 'culture-quiz';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'trash-game') {
      setCurrentScreen('trash-game');
    } else if (gameId === 'culture-quiz') {
      setCurrentScreen('culture-quiz');
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
      ) : (
        <CultureQuizGame onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
