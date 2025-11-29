import React from 'react';
import './GameSelectionScreen.css';

interface GameSelectionScreenProps {
    onSelectGame: (gameId: string) => void;
}

const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({ onSelectGame }) => {
    return (
        <div className="game-selection-container">
            <h1 className="game-selection-title">Choose Your Game</h1>
            <div className="game-grid">
                <div className="game-card" onClick={() => onSelectGame('trash-game')}>
                    <span className="game-icon">🗑️</span>
                    <h3>Trash Game</h3>
                    <p>Test your aim and toss the trash!</p>
                </div>
                <div className="game-card" onClick={() => onSelectGame('food-quiz')}>
                    <span className="game-icon">🍔</span>
                    <h3>Food Quiz</h3>
                    <p>Guess the country of origin!</p>
                </div>
            </div>
        </div>
    );
};

export default GameSelectionScreen;
