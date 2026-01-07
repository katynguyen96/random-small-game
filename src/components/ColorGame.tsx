import React, { useState, useEffect, useCallback } from 'react';

interface ColorGameProps {
    onBackToMenu: () => void;
}

const ColorGame: React.FC<ColorGameProps> = ({ onBackToMenu }) => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);
    const [gridSize, setGridSize] = useState(2);
    const [colors, setColors] = useState<{ base: string, diff: string, targetIndex: number }>({ base: '', diff: '', targetIndex: 0 });

    // Generate colors based on level
    const generateLevelData = useCallback((currentLevel: number) => {
        // Grid size increases every few levels
        const newGridSize = Math.min(8, Math.max(2, Math.floor(Math.sqrt(currentLevel + 3))));

        // Difficulty (opacity difference) decreases as level increases
        // Starting with 0.5 difference, decreasing to very small
        // const difficulty = Math.max(0.02, 0.4 - (currentLevel * 0.01));

        // Random base color
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        const baseColor = `rgb(${r},${g},${b})`;

        // Create different color by lightening or darkening
        // We'll use HSL for better control or just simple RGB manipulation
        // Let's stick to a simple opacity trick or slight RGB shift
        // RGB shift is safer for all browsers

        const shift = Math.max(10, 100 - currentLevel * 2); // Shift amount gets smaller
        const sign = Math.random() > 0.5 ? 1 : -1;

        const r2 = Math.min(255, Math.max(0, r + shift * sign));
        const g2 = Math.min(255, Math.max(0, g + shift * sign));
        const b2 = Math.min(255, Math.max(0, b + shift * sign));

        const diffColor = `rgb(${r2},${g2},${b2})`;

        const totalSquares = newGridSize * newGridSize;
        const targetIndex = Math.floor(Math.random() * totalSquares);

        return {
            gridSize: newGridSize,
            base: baseColor,
            diff: diffColor,
            targetIndex
        };
    }, []);

    // Initialize game
    useEffect(() => {
        const data = generateLevelData(1);
        setGridSize(data.gridSize);
        setColors({ base: data.base, diff: data.diff, targetIndex: data.targetIndex });
    }, [generateLevelData]);

    // Timer
    useEffect(() => {
        if (gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0.1) {
                    setGameOver(true);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [gameOver]);

    const handleSquareClick = (index: number) => {
        if (gameOver) return;

        if (index === colors.targetIndex) {
            // Correct!
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setScore(score + 1);
            setTimeLeft(prev => Math.min(prev + 1, 15)); // Add time, max 15s

            const data = generateLevelData(nextLevel);
            setGridSize(data.gridSize);
            setColors({ base: data.base, diff: data.diff, targetIndex: data.targetIndex });
        } else {
            // Wrong!
            setTimeLeft(prev => Math.max(0, prev - 2)); // Penalty
        }
    };

    const handleRestart = () => {
        setLevel(1);
        setScore(0);
        setTimeLeft(15);
        setGameOver(false);
        const data = generateLevelData(1);
        setGridSize(data.gridSize);
        setColors({ base: data.base, diff: data.diff, targetIndex: data.targetIndex });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#2c3e50',
            color: 'white',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>Color Master</h1>
                <div style={{ display: 'flex', gap: '20px', fontSize: '20px' }}>
                    <div>Level: {level}</div>
                    <div>Score: {score}</div>
                    <div style={{ color: timeLeft < 5 ? '#e74c3c' : 'white' }}>
                        Time: {timeLeft.toFixed(1)}s
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                gap: '5px',
                width: 'min(90vw, 500px)',
                height: 'min(90vw, 500px)',
                backgroundColor: '#34495e',
                padding: '10px',
                borderRadius: '8px'
            }}>
                {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <div
                        key={i}
                        onClick={() => handleSquareClick(i)}
                        style={{
                            backgroundColor: i === colors.targetIndex ? colors.diff : colors.base,
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                ))}
            </div>

            {gameOver && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}>
                    <h2 style={{ fontSize: '48px', color: '#e74c3c' }}>Game Over</h2>
                    <p style={{ fontSize: '24px' }}>Final Score: {score}</p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                        <button
                            onClick={handleRestart}
                            style={{
                                padding: '15px 30px',
                                fontSize: '20px',
                                backgroundColor: '#2ecc71',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Play Again
                        </button>
                        <button
                            onClick={onBackToMenu}
                            style={{
                                padding: '15px 30px',
                                fontSize: '20px',
                                backgroundColor: '#95a5a6',
                                border: 'none',
                                borderRadius: '5px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Menu
                        </button>
                    </div>
                </div>
            )}

            {!gameOver && (
                <button
                    onClick={onBackToMenu}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'transparent',
                        border: '1px solid white',
                        borderRadius: '5px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Back to Menu
                </button>
            )}
        </div>
    );
};

export default ColorGame;
