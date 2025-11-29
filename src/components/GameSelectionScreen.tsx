import React from 'react';
import './GameSelectionScreen.css';

interface GameSelectionScreenProps {
    onSelectGame: (gameId: string) => void;
}

const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({ onSelectGame }) => {
    return (
        <div className="game-selection-container">
            <h1 className="game-selection-title">Chọn Trò Chơi</h1>
            <div className="game-grid">
                <div className="game-card" onClick={() => onSelectGame('trash-game')}>
                    <span className="game-icon">🗑️</span>
                    <h3>Ném Rác</h3>
                    <p>Thử tài thiện xạ của bạn!</p>
                </div>
                <div className="game-card" onClick={() => onSelectGame('food-quiz')}>
                    <span className="game-icon">🍔</span>
                    <h3>Đố Vui Ẩm Thực</h3>
                    <p>Đoán tên quốc gia của món ăn!</p>
                </div>
            </div>
        </div>
    );
};

export default GameSelectionScreen;
