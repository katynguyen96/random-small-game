import React from 'react';
import { PowerUp, PowerUpType } from '../types';
import PowerUpCard from './PowerUpCard';

interface PowerUpOverlayProps {
    onSelect: (powerUp: PowerUp) => void;
}

const AVAILABLE_POWERUPS: PowerUp[] = [
    {
        id: PowerUpType.BIG_BIN,
        name: 'Big Bin',
        description: 'Increases the size of the trash bin!',
        icon: '🗑️'
    },
    {
        id: PowerUpType.TRIPLE_SHOT,
        name: 'Triple Shot',
        description: 'Splits trash into 3 pieces! Hit more for bonus points!',
        icon: '☄️'
    }
];

const PowerUpOverlay: React.FC<PowerUpOverlayProps> = ({ onSelect }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
        }}>
            <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '40px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Choose a Power Up!
            </h2>
            <div style={{ display: 'flex', gap: '30px' }}>
                {AVAILABLE_POWERUPS.map(powerUp => (
                    <PowerUpCard key={powerUp.id} powerUp={powerUp} onSelect={onSelect} />
                ))}
            </div>
        </div>
    );
};

export default PowerUpOverlay;
