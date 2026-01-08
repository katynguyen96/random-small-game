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
                <div className="game-card" onClick={() => onSelectGame('culture-quiz')}>
                    <span className="game-icon">🌍</span>
                    <h3>Đố Vui Văn Hóa</h3>
                    <p>Khám phá ẩm thực và trang phục!</p>
                </div>
                <div className="game-card" onClick={() => onSelectGame('color-game')}>
                    <span className="game-icon">🎨</span>
                    <h3>Tinh Mắt</h3>
                    <p>Tìm ô màu khác biệt!</p>
                </div>
                <div className="game-card" onClick={() => onSelectGame('find-differences')}>
                    <span className="game-icon">🔍</span>
                    <h3>Tìm Điểm Khác</h3>
                    <p>Soi 2 bức tranh!</p>
                </div>
            </div>
        </div>
    );
};

export default GameSelectionScreen;
