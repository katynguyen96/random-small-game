// Game object interfaces
export interface Trash {
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    isThrown: boolean;
    rotation: number;
}

export interface Bin {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
    rotation: number;
    rotationSpeed: number;
}

export interface ScorePopup {
    x: number;
    y: number;
    text: string;
    life: number;
    color: string;
}

export interface GameState {
    trash: Trash;
    bin: Bin;
    angle: number;
    power: number;
    isCharging: boolean;
    chargingDirection: number;
    particles: Particle[];
    scorePopups: ScorePopup[];
    windDirection: number; // -1 (left) to 1 (right)
    windForce: number; // 0 to max wind force
    trashes: Trash[];
    bins: Bin[];
    activePowerUp: PowerUpType | null;
    hitsThisRound: number;
    windWarningDismissed: boolean;
}

export enum PowerUpType {
    BIG_BIN = 'BIG_BIN',
    TRIPLE_SHOT = 'TRIPLE_SHOT',
    NO_WIND = 'NO_WIND',
    DOUBLE_POINTS = 'DOUBLE_POINTS',
    DOUBLE_BIN = 'DOUBLE_BIN',
}

export interface PowerUp {
    id: PowerUpType;
    name: string;
    description: string;
    icon: string;
}
