import React, { useEffect, useRef, useState } from 'react';
import ScoreDisplay from './components/game/ScoreDisplay';
import StartOverlay from './components/game/StartOverlay';
import GameOverOverlay from './components/game/GameOverOverlay';
import Instructions from './components/game/Instructions';
import PowerUpOverlay from './components/game/PowerUpOverlay';
import type { Trash, Bin, Particle, ScorePopup, GameState, PowerUp } from './components/types';
import { PowerUpType } from './components/types';
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
    const [showPowerUpOverlay, setShowPowerUpOverlay] = useState(false);

    // Game state in ref to avoid re-renders during game loop
    const gameState = useRef<GameState>({
        trashes: [{ x: 50, y: 0, vx: 0, vy: 0, width: PAPER_SIZE, height: PAPER_SIZE, isThrown: false, rotation: 0 }],
        trash: { x: 50, y: 0, vx: 0, vy: 0, width: PAPER_SIZE, height: PAPER_SIZE, isThrown: false, rotation: 0 }, // Keep for compatibility if needed, but we should use trashes
        bin: { x: 600, y: 0, width: 80, height: 100 },
        bins: [{ x: 600, y: 0, width: 80, height: 100 }],
        angle: 45,
        power: 0,
        isCharging: false,
        chargingDirection: 1,
        particles: [],
        scorePopups: [],
        windDirection: 0,
        windForce: 0,
        activePowerUp: null,
        hitsThisRound: 0,
        windWarningDismissed: false,
    });

    const binImageRef = useRef<HTMLImageElement | null>(null);
    const paperImageRef = useRef<HTMLImageElement | null>(null);
    const windImageRef = useRef<HTMLImageElement | null>(null);
    const bigWindImageRef = useRef<HTMLImageElement | null>(null);

    // Load images
    useEffect(() => {
        const binImg = new Image();
        binImg.src = '/recycle-bin-icon.png';
        binImg.onload = () => {
            binImageRef.current = binImg;
        };

        const paperImg = new Image();
        paperImg.src = '/axe.png';
        paperImg.onload = () => {
            // Create a temporary canvas to remove the background
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (tempCtx) {
                tempCanvas.width = paperImg.width;
                tempCanvas.height = paperImg.height;
                tempCtx.drawImage(paperImg, 0, 0);

                const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imageData.data;

                // Assume top-left pixel is the background color
                const bgR = data[0];
                const bgG = data[1];
                const bgB = data[2];
                const threshold = 20; // Tolerance for color matching

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    // If pixel matches background color, make it transparent
                    if (Math.abs(r - bgR) < threshold &&
                        Math.abs(g - bgG) < threshold &&
                        Math.abs(b - bgB) < threshold) {
                        data[i + 3] = 0;
                    }
                }

                tempCtx.putImageData(imageData, 0, 0);

                const processedImg = new Image();
                processedImg.src = tempCanvas.toDataURL();
                processedImg.onload = () => {
                    paperImageRef.current = processedImg;
                };
            } else {
                paperImageRef.current = paperImg;
            }
        };

        const windImg = new Image();
        windImg.src = '/win-icon.png'; // Assuming this is the wind icon
        windImg.onload = () => {
            windImageRef.current = windImg;
        };

        const bigWindImg = new Image();
        bigWindImg.src = '/big-wind.png';
        bigWindImg.onload = () => {
            bigWindImageRef.current = bigWindImg;
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const timer = setInterval(() => {
            // Pause timer only while charging
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
        gameState.current.trashes = [{
            x: 50,
            y: canvasHeight - 10 - PAPER_SIZE / 2,
            vx: 0,
            vy: 0,
            width: PAPER_SIZE,
            height: PAPER_SIZE,
            isThrown: false,
            rotation: 0
        }];
        gameState.current.power = 0;
        gameState.current.isCharging = false;
        gameState.current.hitsThisRound = 0;

        const previousWindForce = gameState.current.windForce;
        randomizeWind(); // Randomize wind when resetting trash

        // Only reset warning if wind changed from weak to strong
        if (previousWindForce < 0.25 && gameState.current.windForce >= 0.25) {
            gameState.current.windWarningDismissed = false;
        }
    };

    const moveBin = (canvasWidth: number, canvasHeight: number, count: number = 1) => {
        const minX = 200;
        const maxX = canvasWidth - 100;

        const newBins: Bin[] = [];
        for (let i = 0; i < count; i++) {
            // Simple logic to avoid overlap if count > 1, or just random
            // For 2 bins, let's try to space them out a bit
            let x;
            if (count === 2) {
                // Split range in two halves
                if (i === 0) {
                    x = Math.random() * ((maxX - minX) / 2) + minX;
                } else {
                    x = Math.random() * ((maxX - minX) / 2) + minX + (maxX - minX) / 2;
                }
            } else {
                x = Math.random() * (maxX - minX) + minX;
            }

            newBins.push({
                x,
                y: canvasHeight - 100,
                width: gameState.current.bin.width, // Use current bin width setting
                height: 100
            });
        }

        gameState.current.bins = newBins;
        // Update legacy bin for compatibility if needed, or just use first one
        if (newBins.length > 0) {
            gameState.current.bin = newBins[0];
        }
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
        moveBin(canvas.width, canvas.height, gameState.current.activePowerUp === PowerUpType.DOUBLE_BIN ? 2 : 1);

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const { trashes, bins, angle, power, isCharging } = gameState.current;

            // Only update game logic if game is not over
            if (!gameOver) {
                // Update Physics for all trashes
                let allStopped = true;
                let anyThrown = false;

                trashes.forEach(trash => {
                    if (trash.isThrown) {
                        anyThrown = true;
                        trash.vy += GRAVITY;
                        if (gameState.current.activePowerUp !== PowerUpType.NO_WIND) {
                            trash.vx += gameState.current.windDirection * gameState.current.windForce; // Apply wind
                        }
                        trash.vx *= FRICTION;
                        trash.vy *= FRICTION;

                        trash.x += trash.vx;
                        trash.y += trash.vy;
                        trash.rotation += 0.2; // Rotate while moving

                        // Floor collision
                        if (trash.y + trash.height / 2 > canvas.height) {
                            trash.y = canvas.height - trash.height / 2;
                            trash.vy *= -BOUNCE;
                            trash.vx *= FLOOR_FRICTION;

                            if (Math.abs(trash.vy) < 1 && Math.abs(trash.vx) < 1) {
                                // Stop the trash
                                trash.isThrown = false;
                                createMissParticles(trash.x, trash.y);
                            } else {
                                allStopped = false;
                            }
                        } else {
                            allStopped = false;
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
                        // Check against ALL bins
                        let hitBin = false;

                        bins.forEach(bin => {
                            if (hitBin) return; // Already hit one bin this frame/loop

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
                                trash.isThrown = false; // Stop this trash
                                // Move it out of view
                                trash.y = canvas.height + 100;

                                gameState.current.hitsThisRound++;
                                const currentHits = gameState.current.hitsThisRound;

                                let points = 1;
                                if (gameState.current.activePowerUp === PowerUpType.TRIPLE_SHOT) {
                                    if (currentHits === 2) points = 3;
                                    if (currentHits === 3) points = 2;
                                } else if (gameState.current.activePowerUp === PowerUpType.DOUBLE_POINTS) {
                                    points = 2;
                                }

                                createScorePopup(trash.x, trash.y, points);
                                setScore(s => s + points);
                                hitBin = true;
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
                        });
                    }
                });

                // Reset if all trashes are stopped or scored
                if (anyThrown && allStopped) {
                    // Check if all are effectively stopped or out of bounds
                    const allDone = trashes.every(t => !t.isThrown || t.y > canvas.height);
                    if (allDone) {
                        resetTrash(canvas.height);
                        moveBin(canvas.width, canvas.height, gameState.current.activePowerUp === PowerUpType.DOUBLE_BIN ? 2 : 1);
                    }
                } else if (!anyThrown && trashes.length > 0 && trashes[0].y > canvas.height) {
                    // Handle case where they are removed/scored
                    resetTrash(canvas.height);
                    moveBin(canvas.width, canvas.height, gameState.current.activePowerUp === PowerUpType.DOUBLE_BIN ? 2 : 1);
                }


                // Charging
                if (isCharging) {
                    gameState.current.power += 0.5 * gameState.current.chargingDirection;
                    if (gameState.current.power > MAX_POWER || gameState.current.power < 0) {
                        gameState.current.chargingDirection *= -1;
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
            // Draw Bins
            if (binImageRef.current) {
                bins.forEach(b => {
                    ctx.drawImage(binImageRef.current!, b.x, b.y, b.width, b.height);
                });
            } else {
                bins.forEach(b => {
                    ctx.fillStyle = '#4CAF50';
                    ctx.fillRect(b.x, b.y, b.width, b.height);
                    ctx.fillStyle = 'white';
                    ctx.font = '16px Arial';
                    ctx.fillText('TRASH', b.x + 15, b.y + 20);
                });
            }

            // Draw Aiming Arrow (only if not thrown)
            if (!trashes[0].isThrown) {
                const radian = (angle * Math.PI) / 180;
                const arrowLen = 50 + power * 2;
                const endX = trashes[0].x + Math.cos(radian) * arrowLen;
                const endY = trashes[0].y - Math.sin(radian) * arrowLen;

                ctx.save();

                // Draw glow effect
                ctx.shadowColor = `rgba(255, ${255 - (power / MAX_POWER) * 255}, 0, 0.8)`;
                ctx.shadowBlur = 15;

                // Draw main arrow line with gradient
                const gradient = ctx.createLinearGradient(trashes[0].x, trashes[0].y, endX, endY);
                gradient.addColorStop(0, `rgba(255, ${255 - (power / MAX_POWER) * 255}, 0, 0.9)`);
                gradient.addColorStop(1, `rgba(255, ${255 - (power / MAX_POWER) * 200}, 50, 0.5)`);

                ctx.beginPath();
                ctx.moveTo(trashes[0].x, trashes[0].y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Draw arrowhead
                const arrowHeadLen = 20;
                const arrowHeadAngle = Math.PI / 6; // 30 degrees

                const leftX = endX - arrowHeadLen * Math.cos(radian - arrowHeadAngle);
                const leftY = endY + arrowHeadLen * Math.sin(radian - arrowHeadAngle);
                const rightX = endX - arrowHeadLen * Math.cos(radian + arrowHeadAngle);
                const rightY = endY + arrowHeadLen * Math.sin(radian + arrowHeadAngle);

                ctx.beginPath();
                ctx.moveTo(endX, endY);
                ctx.lineTo(leftX, leftY);
                ctx.lineTo(rightX, rightY);
                ctx.closePath();
                ctx.fillStyle = `rgba(255, ${255 - (power / MAX_POWER) * 200}, 0, 0.9)`;
                ctx.fill();


                ctx.restore();
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

            // Draw Big Wind Warning
            if (windForce >= 0.25 && !gameState.current.windWarningDismissed) {
                ctx.save();

                // Pulsing effect using sine wave
                const time = Date.now() / 1000;
                const pulse = Math.sin(time * 3) * 0.3 + 0.7; // Oscillates between 0.4 and 1.0
                const shake = Math.sin(time * 10) * 3; // Small shake effect

                // Color transition between red and yellow
                const colorPhase = (Math.sin(time * 2) + 1) / 2; // 0 to 1
                const red = 255;
                const green = Math.floor(colorPhase * 100); // 0 to 100

                ctx.globalAlpha = pulse;
                ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
                ctx.font = 'bold 28px Arial';
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText('⚠️ WARNING: HIGH WIND! ⚠️', CANVAS_WIDTH / 2 - 180 + shake, 50);
                ctx.shadowBlur = 0;

                if (bigWindImageRef.current) {
                    // Draw centered below text with pulsing scale
                    const imgSize = 100 + pulse * 20; // Size varies between 100-120
                    ctx.globalAlpha = pulse;
                    ctx.drawImage(
                        bigWindImageRef.current,
                        CANVAS_WIDTH / 2 - imgSize / 2 + shake,
                        70,
                        imgSize,
                        imgSize
                    );
                }
                ctx.restore();
            }

            // Draw Trashes
            // Draw Trashes
            trashes.forEach(trash => {
                ctx.save();
                ctx.translate(trash.x, trash.y);
                ctx.rotate(trash.rotation);
                if (paperImageRef.current) {
                    ctx.drawImage(
                        paperImageRef.current,
                        -trash.width / 2,
                        -trash.height / 2,
                        trash.width,
                        trash.height
                    );
                } else {
                    ctx.fillStyle = '#5D4037';
                    ctx.fillRect(
                        -trash.width / 2,
                        -trash.height / 2,
                        trash.width,
                        trash.height
                    );
                }
                ctx.restore();
            });

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
            if (!gameStarted) return;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                gameState.current.angle = Math.min(gameState.current.angle + 2, 90);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                gameState.current.angle = Math.max(gameState.current.angle - 2, 0);
            } else if (e.key === ' ' && !gameState.current.trashes[0].isThrown && !gameState.current.isCharging) {
                e.preventDefault();
                gameState.current.isCharging = true;
                gameState.current.windWarningDismissed = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!gameStarted) return;

            if (e.key === ' ' && gameState.current.isCharging) {
                e.preventDefault();
                gameState.current.isCharging = false;
                const { angle, power, activePowerUp } = gameState.current;

                if (activePowerUp === PowerUpType.TRIPLE_SHOT) {
                    const angles = [angle - 5, angle, angle + 5];
                    gameState.current.trashes = angles.map(a => {
                        const radian = (a * Math.PI) / 180;
                        return {
                            x: 50,
                            y: gameState.current.trashes[0].y,
                            vx: Math.cos(radian) * power,
                            vy: -Math.sin(radian) * power,
                            width: PAPER_SIZE,
                            height: PAPER_SIZE,
                            isThrown: true,
                            rotation: 0
                        };
                    });
                } else {
                    const radian = (angle * Math.PI) / 180;
                    gameState.current.trashes[0].vx = Math.cos(radian) * power;
                    gameState.current.trashes[0].vy = -Math.sin(radian) * power;
                    gameState.current.trashes[0].isThrown = true;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameStarted]);

    // Game control handlers
    const handleStartGame = () => {
        // Reset bin size to default
        gameState.current.bin.width = 80;
        setShowPowerUpOverlay(true);
    };

    const handlePowerUpSelect = (powerUp: PowerUp) => {
        gameState.current.activePowerUp = powerUp.id;
        if (powerUp.id === PowerUpType.BIG_BIN) {
            gameState.current.bin.width = 120;
        } else {
            gameState.current.bin.width = 80;
        }

        // Handle Double Bin
        if (powerUp.id === PowerUpType.DOUBLE_BIN) {
            // Will be handled in next moveBin call or we can force it now if game starts immediately
        }

        setShowPowerUpOverlay(false);
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTimeLeft(GAME_TIME);

        // Initial setup
        if (canvasRef.current) {
            moveBin(CANVAS_WIDTH, CANVAS_HEIGHT, powerUp.id === PowerUpType.DOUBLE_BIN ? 2 : 1);
        }
    };

    const handleRestart = () => {
        setGameOver(false);
        setGameStarted(false);
        setShowPowerUpOverlay(false);
        setScore(0);
        setTimeLeft(GAME_TIME);
        setScore(0);
        setTimeLeft(GAME_TIME);
        setTimeLeft(GAME_TIME);
        gameState.current.bin.width = 80;
        gameState.current.bins = [{ x: 600, y: 0, width: 80, height: 100 }];
        gameState.current.activePowerUp = null;
    };

    return (
        <div className="game-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <ScoreDisplay score={score} timeLeft={timeLeft} />
            <div style={{ position: 'relative' }}>
                <canvas
                    ref={canvasRef}
                    style={{ border: '2px solid #333', borderRadius: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                {!gameStarted && !gameOver && !showPowerUpOverlay && <StartOverlay onStart={handleStartGame} />}
                {showPowerUpOverlay && <PowerUpOverlay onSelect={handlePowerUpSelect} />}
                {gameOver && <GameOverOverlay score={score} onRestart={handleRestart} />}
            </div>
            <Instructions />
        </div>
    );
};

export default Game;
