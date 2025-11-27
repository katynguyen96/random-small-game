import React from 'react';
import { PowerUp } from '../types';

interface PowerUpCardProps {
    powerUp: PowerUp;
    onSelect: (powerUp: PowerUp) => void;
}

const PowerUpCard: React.FC<PowerUpCardProps> = ({ powerUp, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(powerUp)}
            style={{
                background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
                borderRadius: '15px',
                padding: '20px',
                width: '200px',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                color: 'white',
                textAlign: 'center',
                border: '2px solid rgba(255,255,255,0.3)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
            }}
        >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>
                {powerUp.icon}
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {powerUp.name}
            </h3>
            <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>
                {powerUp.description}
            </p>
        </div>
    );
};

export default PowerUpCard;
