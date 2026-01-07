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
            backgroundColor: '#87CEEB', // Match sky color to hide game elements, or use a solid cover
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
        }}>
            <h1 style={{
                color: 'white',
                fontSize: '48px',
                marginBottom: '40px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold'
            }}>
                Trash Toss
            </h1>
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
                    src={`${process.env.PUBLIC_URL}/start-icon.jpg`}
                    alt="Start Game"
                    style={{ width: '100px', height: '100px', display: 'block', borderRadius: '8px' }}
                />
            </button>
        </div>
    );
};

export default StartOverlay;
