import React, { useEffect, useRef, useState } from 'react';
import ScoreDisplay from './components/game/ScoreDisplay';
import StartOverlay from './components/game/StartOverlay';
import GameOverOverlay from './components/game/GameOverOverlay';
import Instructions from './components/game/Instructions';
import type { Trash, Bin, Particle, ScorePopup, GameState } from './components/types';
import {
    GRAVITY,
    FRICTION,
    BOUNCE,
    FLOOR_FRICTION,
    MAX_POWER,
    MAX_WIND_FORCE,
    BIN_COLLISION_PADDING_X,
    BIN_COLLISION_PADDING_Y,
    PAPER_SIZE,
    GAME_TIME,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
} from './components/constants';

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Game state in ref to avoid re-renders during game loop
    const gameState = useRef<GameState>({
        trash: { x: 50, y: 0, vx: 0, vy: 0, width: PAPER_SIZE, height: PAPER_SIZE, isThrown: false },
        bin: { x: 600, y: 0, width: 80, height: 100 },
        angle: 45,
        power: 0,
        isCharging: false,
        chargingDirection: 1,
        particles: [],
        scorePopups: [],
        windDirection: 0,
        windForce: 0,
    });

    const binImageRef = useRef<HTMLImageElement | null>(null);
    const paperImageRef = useRef<HTMLImageElement | null>(null);
    const windImageRef = useRef<HTMLImageElement | null>(null);

    // Load images
    useEffect(() => {
        const binImg = new Image();
        binImg.src = '/recycle-bin-icon.png';
        binImg.onload = () => {
            binImageRef.current = binImg;
        };

        const paperImg = new Image();
        paperImg.src = '/paper.jpg';
        paperImg.onload = () => {
            paperImageRef.current = paperImg;
        };

        const windImg = new Image();
        windImg.src = '/win-icon.png'; // Assuming this is the wind icon
        windImg.onload = () => {
            windImageRef.current = windImg;
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const timer = setInterval(() => {
            // Pause timer while charging
            if (gameState.current.isCharging) return;

            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameStarted(false);
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameOver]);

    // Particle creation functions
    const createSuccessParticles = (x: number, y: number) => {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        for (let i = 0; i < 30; i++) {
            gameState.current.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                size: Math.random() * 8 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
            });
        }
    };

    const createMissParticles = (x: number, y: number) => {
        const colors = ['#95A5A6', '#7F8C8D', '#BDC3C7'];
        for (let i = 0; i < 15; i++) {
            gameState.current.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2,
                size: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
            });
        }
    };

    const createScorePopup = (x: number, y: number, points: number) => {
        gameState.current.scorePopups.push({
            x, y: y - 30,
            text: `+${points}`,
            life: 1,
            color: '#FFD700',
        });
    };

    // Game helper functions
    const randomizeWind = () => {
        // Random direction: -1 (left) to 1 (right)
        gameState.current.windDirection = (Math.random() - 0.5) * 2;
        // Random force: 0 to MAX_WIND_FORCE
        gameState.current.windForce = Math.random() * MAX_WIND_FORCE;
    };

    const resetTrash = (canvasHeight: number) => {
        gameState.current.trash.x = 50;
        gameState.current.trash.y = canvasHeight - 10 - gameState.current.trash.height / 2;
        gameState.current.trash.vx = 0;
        gameState.current.trash.vy = 0;
        gameState.current.trash.isThrown = false;
        gameState.current.power = 0;
        gameState.current.isCharging = false;
        randomizeWind(); // Randomize wind when resetting trash
    };

    const moveBin = (canvasWidth: number, canvasHeight: number) => {
        const minX = 200;
        const maxX = canvasWidth - 100;
        gameState.current.bin.x = Math.random() * (maxX - minX) + minX;
        gameState.current.bin.y = canvasHeight - 100;
    };

    // Main game loop - Canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        resetTrash(canvas.height);
        moveBin(canvas.width, canvas.height);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { trash, bin, angle, power, isCharging } = gameState.current;

            // Only update game logic if game is not over
            if (!gameOver) {
                // Update Physics
                if (trash.isThrown) {
                    trash.vy += GRAVITY;
                    trash.vx += gameState.current.windDirection * gameState.current.windForce; // Apply wind
                    trash.vx *= FRICTION;
                    trash.vy *= FRICTION;

                    trash.x += trash.vx;
                    trash.y += trash.vy;

                    // Floor collision
                    if (trash.y + trash.height / 2 > canvas.height) {
                        trash.y = canvas.height - trash.height / 2;
                        trash.vy *= -BOUNCE;
                        trash.vx *= FLOOR_FRICTION;

                        if (Math.abs(trash.vy) < 1 && Math.abs(trash.vx) < 1) {
                            createMissParticles(trash.x, trash.y);
                            trash.isThrown = false;
                            setTimeout(() => resetTrash(canvas.height), 500);
                        }
                    }

                    // Wall collision
                    if (trash.x + trash.width / 2 > canvas.width) {
                        trash.x = canvas.width - trash.width / 2;
                        trash.vx *= -BOUNCE;
                    }
                    if (trash.x - trash.width / 2 < 0) {
                        trash.x = trash.width / 2;
                        trash.vx *= -BOUNCE;
                    }

                    // Bin collision and Physics
                    const prevY = trash.y - trash.vy;
                    const collisionX = bin.x + BIN_COLLISION_PADDING_X;
                    const collisionY = bin.y + BIN_COLLISION_PADDING_Y;
                    const collisionWidth = bin.width - BIN_COLLISION_PADDING_X * 2;

                    // Check for Scoring
                    if (
                        trash.vy > 0 &&
                        prevY <= collisionY &&
                        trash.y > collisionY &&
                        trash.x > collisionX &&
                        trash.x < collisionX + collisionWidth
                    ) {
                        createSuccessParticles(trash.x, trash.y);
                        createScorePopup(trash.x, trash.y, 1);
                        setScore(s => s + 1);
                        resetTrash(canvas.height);
                        moveBin(canvas.width, canvas.height);
                    }
                    // Side Wall Collisions
                    else if (trash.y > collisionY) {
                        if (trash.x + trash.width / 2 > collisionX && trash.x < collisionX) {
                            trash.x = collisionX - trash.width / 2;
                            trash.vx *= -BOUNCE;
                        }
                        else if (trash.x - trash.width / 2 < collisionX + collisionWidth && trash.x > collisionX + collisionWidth) {
                            trash.x = collisionX + collisionWidth + trash.width / 2;
                            trash.vx *= -BOUNCE;
                        }
                    }
                } else {
                    // Charging
                    if (isCharging) {
                        gameState.current.power += 0.2 * gameState.current.chargingDirection;
                        if (gameState.current.power > MAX_POWER || gameState.current.power < 0) {
                            gameState.current.chargingDirection *= -1;
                        }
                    }
                }

                // Update particles
                gameState.current.particles = gameState.current.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.vy += 0.3;
                    particle.vx *= 0.98;
                    particle.rotation += particle.rotationSpeed;
                    particle.life -= 0.02;
                    return particle.life > 0;
                });

                // Update score popups
                gameState.current.scorePopups = gameState.current.scorePopups.filter(popup => {
                    popup.y -= 2;
                    popup.life -= 0.015;
                    return popup.life > 0;
                });
            }

            // Draw Sky
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Floor
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

            // Draw Bin
            if (binImageRef.current) {
                ctx.drawImage(binImageRef.current, bin.x, bin.y, bin.width, bin.height);
            } else {
                ctx.fillStyle = '#4CAF50';
                ctx.fillRect(bin.x, bin.y, bin.width, bin.height);
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText('TRASH', bin.x + 15, bin.y + 20);
            }

            // Draw Aiming Arrow
            if (!trash.isThrown) {
                const radian = (angle * Math.PI) / 180;
                const arrowLen = 50 + power * 2;
                const endX = trash.x + Math.cos(radian) * arrowLen;
                const endY = trash.y - Math.sin(radian) * arrowLen;

                ctx.beginPath();
                ctx.moveTo(trash.x, trash.y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(255, ${255 - (power / MAX_POWER) * 255}, 0, 0.8)`;
                ctx.lineWidth = 4;
                ctx.stroke();
            }

            // Draw Power Bar
            ctx.fillStyle = 'black';
            ctx.fillRect(10, 10, 200, 20);
            ctx.fillStyle = `rgb(${255 * (power / MAX_POWER)}, ${255 * (1 - power / MAX_POWER)}, 0)`;
            ctx.fillRect(10, 10, 200 * (power / MAX_POWER), 20);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(10, 10, 200, 20);

            // Draw Ticks
            ctx.fillStyle = 'white';
            for (let i = 1; i < 4; i++) {
                ctx.fillRect(10 + i * 50, 10, 2, 20);
            }
            ctx.fillStyle = 'white';
            ctx.fillText(`Angle: ${Math.round(angle)}°`, 10, 50);
            // Draw Wind Indicator
            const { windDirection, windForce } = gameState.current;
            const windBarX = 10;
            const windBarY = 70;

            // Draw Wind Icon (Flipped based on direction)
            if (windImageRef.current) {
                ctx.save();
                if (windDirection < 0) {
                    // Flip horizontally if wind is blowing left
                    ctx.translate(windBarX + 30, windBarY); // Move origin to right edge of icon
                    ctx.scale(-1, 1); // Flip
                    ctx.drawImage(windImageRef.current, 0, 0, 30, 30);
                } else {
                    ctx.drawImage(windImageRef.current, windBarX, windBarY, 30, 30);
                }
                ctx.restore();
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '14px Arial';
                ctx.fillText(`Wind:`, windBarX, windBarY + 20);
            }

            // Draw Wind Speed Text
            const windSpeed = (windForce * 10).toFixed(1); // Simulate m/s
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`${windSpeed} m/s`, windBarX + 40, windBarY + 20);

            // Draw Trash (Paper)
            if (paperImageRef.current) {
                ctx.drawImage(
                    paperImageRef.current,
                    trash.x - trash.width / 2,
                    trash.y - trash.height / 2,
                    trash.width,
                    trash.height
                );
            } else {
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(
                    trash.x - trash.width / 2,
                    trash.y - trash.height / 2,
                    trash.width,
                    trash.height
                );
            }

            // Draw Particles
            gameState.current.particles.forEach(particle => {
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
            });

            // Draw Score Popups
            gameState.current.scorePopups.forEach(popup => {
                ctx.save();
                ctx.globalAlpha = popup.life;
                ctx.font = 'bold 32px Arial';
                ctx.fillStyle = popup.color;
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 3;
                ctx.textAlign = 'center';
                ctx.strokeText(popup.text, popup.x, popup.y);
                ctx.fillText(popup.text, popup.x, popup.y);
                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [gameOver]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                gameState.current.angle = Math.min(gameState.current.angle + 2, 90);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                gameState.current.angle = Math.max(gameState.current.angle - 2, 0);
            } else if (e.key === ' ' && !gameState.current.trash.isThrown && !gameState.current.isCharging) {
                e.preventDefault();
                gameState.current.isCharging = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === ' ' && gameState.current.isCharging) {
                e.preventDefault();
                gameState.current.isCharging = false;
                const { angle, power } = gameState.current;
                const radian = (angle * Math.PI) / 180;
                gameState.current.trash.vx = Math.cos(radian) * power;
                gameState.current.trash.vy = -Math.sin(radian) * power;
                gameState.current.trash.isThrown = true;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Game control handlers
    const handleStartGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTimeLeft(GAME_TIME);
    };

    const handleRestart = () => {
        setGameOver(false);
        setGameStarted(true);
        setScore(0);
        setTimeLeft(GAME_TIME);
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <ScoreDisplay score={score} timeLeft={timeLeft} />
            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    style={{ border: '2px solid #333', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                {!gameStarted && !gameOver && <StartOverlay onStart={handleStartGame} />}
                {gameOver && <GameOverOverlay score={score} onRestart={handleRestart} />}
            </div>
            <Instructions />
        </div>
    );
};

export default Game;
