import React, { useState, useEffect, useRef } from 'react';
import './FindDifferencesGame.css';

interface Difference {
    id: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    emoji: string;
    size: number; // px
    presentInLeft: boolean; // If true, shows in left, missing in right. If false, vice versa.
}

const DIFFERENCE_EMOJIS = ['🐱', '⚽', '🧢', '🦋', '⏰', '🍕', '🍔', '🦄', '🌈', '🎸', '👑', '💎', '🔔', '🚲', '🚀'];

interface Distraction {
    id: number;
    x: number;
    y: number;
    emoji: string;
    size: number;
    rotation: number;
}

const DISTRACTION_EMOJIS = ['🎈', '🧸', '🎁', '📷', '📚', '✏️', '🍎', '🌵', '🚗', '🎸', '🍦', '🍩', '🚲', '⚓', '🚀', '🛸', '🦖', '🦕', '🐢', '🐙'];

interface FindDifferencesGameProps {
    onBackToMenu: () => void;
}

const FindDifferencesGame: React.FC<FindDifferencesGameProps> = ({ onBackToMenu }) => {
    const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
    const [mistakes, setMistakes] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [clickFeedback, setClickFeedback] = useState<{ x: number; y: number; type: 'success' | 'error' } | null>(null);
    const [distractions, setDistractions] = useState<Distraction[]>([]);
    const [currentDifferences, setCurrentDifferences] = useState<Difference[]>([]);

    const imageRef = useRef<HTMLDivElement>(null);

    const generateLevel = () => {
        // Generate Distractions
        const newDistractions: Distraction[] = [];
        for (let i = 0; i < 200; i++) {
            newDistractions.push({
                id: i,
                x: Math.random() * 90 + 5, // 5% to 95%
                y: Math.random() * 90 + 5,
                emoji: DISTRACTION_EMOJIS[Math.floor(Math.random() * DISTRACTION_EMOJIS.length)],
                size: Math.random() * 20 + 15, // 15px to 35px
                rotation: Math.random() * 360,
            });
        }
        setDistractions(newDistractions);

        // Generate Differences
        const newDifferences: Difference[] = [];
        const usedEmojis = new Set<string>();

        while (newDifferences.length < 6) {
            const emoji = DIFFERENCE_EMOJIS[Math.floor(Math.random() * DIFFERENCE_EMOJIS.length)];
            if (usedEmojis.has(emoji)) continue;
            usedEmojis.add(emoji);

            newDifferences.push({
                id: 1000 + newDifferences.length, // Offset ID to avoid conflict with distractions
                x: Math.random() * 80 + 10, // Keep away from extreme edges
                y: Math.random() * 80 + 10,
                emoji: emoji,
                size: Math.random() * 15 + 25, // 25-40px
                presentInLeft: Math.random() > 0.5
            });
        }
        setCurrentDifferences(newDifferences);
    };

    useEffect(() => {
        generateLevel();
    }, []);

    useEffect(() => {
        if (mistakes >= 3) {
            setGameOver(true);
        }
        if (foundDifferences.length >= 6) {
            setGameWon(true);
        }
    }, [mistakes, foundDifferences]);

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, isLeft: boolean) => {
        if (gameOver || gameWon) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Check if clicked near any difference
        let found = false;
        currentDifferences.forEach((diff) => {
            if (foundDifferences.includes(diff.id)) return;

            // Simple distance check (approx 5% tolerance)
            const dist = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
            if (dist < 5) {
                found = true;
                setFoundDifferences([...foundDifferences, diff.id]);
                showFeedback(e.clientX, e.clientY, 'success');
            }
        });

        if (!found) {
            setMistakes(mistakes + 1);
            showFeedback(e.clientX, e.clientY, 'error');
        }
    };

    const showFeedback = (x: number, y: number, type: 'success' | 'error') => {
        setClickFeedback({ x, y, type });
        setTimeout(() => setClickFeedback(null), 1000);
    };

    const resetGame = () => {
        setFoundDifferences([]);
        setMistakes(0);
        setGameOver(false);
        setGameWon(false);
        generateLevel();
    };

    return (
        <div className="find-diff-game">
            <header className="game-header">
                <button className="back-button" onClick={onBackToMenu}>⬅ Menu</button>
                <h1>Tìm Điểm Khác Nhau</h1>
                <div className="stats">
                    <span className="stat-item">✅ Đã tìm: {foundDifferences.length}/6</span>
                    <span className="stat-item">❌ Sai: {mistakes}/3</span>
                </div>
            </header>

            <div className="game-area">
                {/* Left Image */}
                <div className="image-container" onClick={(e) => handleImageClick(e, true)}>
                    <img src="/assets/find_differences_bg.png" alt="Find Differences Left" className="game-bg" />

                    {/* Distractions */}
                    {distractions.map((d) => (
                        <div
                            key={`distraction-left-${d.id}`}
                            className="distraction-item"
                            style={{
                                left: `${d.x}%`,
                                top: `${d.y}%`,
                                fontSize: `${d.size}px`,
                                transform: `translate(-50%, -50%) rotate(${d.rotation}deg)`,
                                position: 'absolute',
                                pointerEvents: 'none',
                                opacity: 0.8
                            }}
                        >
                            {d.emoji}
                        </div>
                    ))}
                    {currentDifferences.map((diff) => (
                        <div
                            key={`left-${diff.id}`}
                            className={`difference-item ${foundDifferences.includes(diff.id) ? 'found' : ''}`}
                            style={{
                                left: `${diff.x}%`,
                                top: `${diff.y}%`,
                                fontSize: `${diff.size}px`,
                                opacity: diff.presentInLeft ? 1 : 0, // Hide if not present, but keep layout? No, just hide.
                                display: diff.presentInLeft || foundDifferences.includes(diff.id) ? 'block' : 'none',
                                zIndex: 10
                            }}
                        >
                            {foundDifferences.includes(diff.id) ? '⭕' : diff.emoji}
                        </div>
                    ))}
                    {/* Show circles for found items even if they were "missing" on this side, to confirm match */}
                    {currentDifferences.map((diff) => (
                        foundDifferences.includes(diff.id) && !diff.presentInLeft && (
                            <div
                                key={`left-found-${diff.id}`}
                                className="difference-marker"
                                style={{
                                    left: `${diff.x}%`,
                                    top: `${diff.y}%`,
                                    fontSize: `${diff.size}px`,
                                    zIndex: 11
                                }}
                            >
                                ⭕
                            </div>
                        )
                    ))}
                </div>

                {/* Right Image */}
                <div className="image-container" onClick={(e) => handleImageClick(e, false)}>
                    <img src="/assets/find_differences_bg.png" alt="Find Differences Right" className="game-bg" />

                    {/* Distractions */}
                    {distractions.map((d) => (
                        <div
                            key={`distraction-right-${d.id}`}
                            className="distraction-item"
                            style={{
                                left: `${d.x}%`,
                                top: `${d.y}%`,
                                fontSize: `${d.size}px`,
                                transform: `translate(-50%, -50%) rotate(${d.rotation}deg)`,
                                position: 'absolute',
                                pointerEvents: 'none',
                                opacity: 0.8
                            }}
                        >
                            {d.emoji}
                        </div>
                    ))}
                    {currentDifferences.map((diff) => (
                        <div
                            key={`right-${diff.id}`}
                            className={`difference-item ${foundDifferences.includes(diff.id) ? 'found' : ''}`}
                            style={{
                                left: `${diff.x}%`,
                                top: `${diff.y}%`,
                                fontSize: `${diff.size}px`,
                                display: !diff.presentInLeft || foundDifferences.includes(diff.id) ? 'block' : 'none',
                                zIndex: 10
                            }}
                        >
                            {foundDifferences.includes(diff.id) ? '⭕' : diff.emoji}
                        </div>
                    ))}
                    {/* Show circles for found items even if they were "missing" on this side */}
                    {currentDifferences.map((diff) => (
                        foundDifferences.includes(diff.id) && diff.presentInLeft && (
                            <div
                                key={`right-found-${diff.id}`}
                                className="difference-marker"
                                style={{
                                    left: `${diff.x}%`,
                                    top: `${diff.y}%`,
                                    fontSize: `${diff.size}px`,
                                    zIndex: 11
                                }}
                            >
                                ⭕
                            </div>
                        )
                    ))}
                </div>
            </div>

            {clickFeedback && (
                <div
                    className={`click-feedback ${clickFeedback.type}`}
                    style={{ left: clickFeedback.x, top: clickFeedback.y }}
                >
                    {clickFeedback.type === 'success' ? '✨' : '❌'}
                </div>
            )}

            {(gameOver || gameWon) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{gameWon ? '🎉 Chúc Mừng! 🎉' : '😢 Thua Cuộc!'}</h2>
                        <p>{gameWon ? 'Bạn đã tìm thấy tất cả điểm khác biệt!' : 'Bạn đã chọn sai 3 lần.'}</p>
                        <div className="modal-actions">
                            <button onClick={resetGame}>Chơi Lại</button>
                            <button onClick={onBackToMenu}>Về Menu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindDifferencesGame;
