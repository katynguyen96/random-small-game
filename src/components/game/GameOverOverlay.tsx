import React from 'react';

interface GameOverOverlayProps {
    score: number;
    onRestart: () => void;
}

const GameOverOverlay: React.FC<GameOverOverlayProps> = ({ score, onRestart }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            gap: '30px',
        }}>
            <img
                src={score < 3 ? "/loser.jpg" : "/time-out.png"}
                alt={score < 3 ? "You're a loser!" : "Time's Up!"}
                style={{ width: '200px', height: 'auto', display: 'block', borderRadius: '8px' }}
            />
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
                Final Score: {score}
            </div>
            <button
                onClick={onRestart}
                style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img
                    src="/restart-icon.png"
                    alt="Restart Game"
                    style={{ width: '80px', height: '80px', display: 'block' }}
                />
            </button>
        </div>
    );
};

export default GameOverOverlay;
