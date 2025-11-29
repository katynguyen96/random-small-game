import React, { useState } from 'react';
import './App.css';
import Game from './Game';
import GameSelectionScreen from './components/GameSelectionScreen';
import FoodQuizGame from './components/FoodQuizGame';

type Screen = 'menu' | 'trash-game' | 'food-quiz';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  const handleSelectGame = (gameId: string) => {
    if (gameId === 'trash-game') {
      setCurrentScreen('trash-game');
    } else if (gameId === 'food-quiz') {
      setCurrentScreen('food-quiz');
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
        <FoodQuizGame onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
}

export default App;
