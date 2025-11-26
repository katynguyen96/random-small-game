import React from 'react';

interface StartOverlayProps {
    onStart: () => void;
}

const StartOverlay: React.FC<StartOverlayProps> = ({ onStart }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
        }}>
            <button
                onClick={onStart}
                style={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img
                    src="/start-icon.jpg"
                    alt="Start Game"
                    style={{ width: '100px', height: '100px', display: 'block', borderRadius: '8px' }}
                />
            </button>
        </div>
    );
};

export default StartOverlay;
