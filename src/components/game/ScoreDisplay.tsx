import React from 'react';

interface ScoreDisplayProps {
    score: number;
    timeLeft: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, timeLeft }) => {
    return (
        <div style={{
            display: 'flex',
            gap: '30px',
            marginBottom: '10px',
            fontSize: '24px',
            fontWeight: 'bold'
        }}>
            <div className="score-board">Score: {score}</div>
            <div
                className="timer-board"
                style={{ color: timeLeft <= 10 ? '#ff0000' : '#000' }}
            >
                Time: {timeLeft}s
            </div>
        </div>
    );
};

export default ScoreDisplay;
