import React, { useState } from 'react';
import './FoodQuizGame.css';

interface FoodItem {
    id: number;
    emoji: string;
    foodName: string;
    correctCountry: string;
    options: string[];
}

const FOOD_ITEMS: FoodItem[] = [
    {
        id: 1,
        emoji: '🍣',
        foodName: 'Sushi',
        correctCountry: 'Japan',
        options: ['China', 'Japan', 'Korea', 'Thailand']
    },
    {
        id: 2,
        emoji: '🍕',
        foodName: 'Pizza',
        correctCountry: 'Italy',
        options: ['France', 'Italy', 'USA', 'Spain']
    },
    {
        id: 3,
        emoji: '🌮',
        foodName: 'Tacos',
        correctCountry: 'Mexico',
        options: ['Brazil', 'Spain', 'Mexico', 'Argentina']
    },
    {
        id: 4,
        emoji: '🍔',
        foodName: 'Hamburger',
        correctCountry: 'USA',
        options: ['Germany', 'UK', 'USA', 'Australia']
    },
    {
        id: 5,
        emoji: '🥐',
        foodName: 'Croissant',
        correctCountry: 'France',
        options: ['Italy', 'France', 'Belgium', 'Switzerland']
    },
    {
        id: 6,
        emoji: '🍛',
        foodName: 'Curry',
        correctCountry: 'India',
        options: ['India', 'Thailand', 'Japan', 'Vietnam']
    },
    {
        id: 7,
        emoji: '🍜',
        foodName: 'Pho',
        correctCountry: 'Vietnam',
        options: ['China', 'Thailand', 'Vietnam', 'Japan']
    },
    {
        id: 8,
        emoji: '🥨',
        foodName: 'Pretzel',
        correctCountry: 'Germany',
        options: ['Austria', 'Germany', 'Poland', 'Netherlands']
    }
];

interface FoodQuizGameProps {
    onBackToMenu: () => void;
}

const FoodQuizGame: React.FC<FoodQuizGameProps> = ({ onBackToMenu }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const currentItem = FOOD_ITEMS[currentQuestionIndex];

    const handleOptionClick = (option: string) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option === currentItem.correctCountry;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }

        // Auto advance after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < FOOD_ITEMS.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setGameState('finished');
            }
        }, 1500);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState('playing');
        setSelectedOption(null);
        setIsCorrect(null);
    };

    if (gameState === 'finished') {
        return (
            <div className="food-quiz-container">
                <div className="game-over-card">
                    <h2>Quiz Finished!</h2>
                    <p className="final-score">You scored {score} out of {FOOD_ITEMS.length}</p>
                    <button className="action-btn play-again-btn" onClick={handleRestart}>Play Again</button>
                    <button className="action-btn menu-btn" onClick={onBackToMenu}>Back to Menu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="food-quiz-container">
            <div className="quiz-header">
                <span>Question {currentQuestionIndex + 1}/{FOOD_ITEMS.length}</span>
                <span>Score: {score}</span>
            </div>

            <div className="food-display">
                <div className="food-emoji">{currentItem.emoji}</div>
                <div className="food-name">{currentItem.foodName}</div>
            </div>

            <div className="options-grid">
                {currentItem.options.map((option) => {
                    let btnClass = 'option-btn';
                    if (selectedOption === option) {
                        btnClass += isCorrect ? ' correct' : ' wrong';
                    } else if (selectedOption && option === currentItem.correctCountry) {
                        btnClass += ' correct'; // Show correct answer if wrong one was selected
                    }

                    return (
                        <button
                            key={option}
                            className={btnClass}
                            onClick={() => handleOptionClick(option)}
                            disabled={selectedOption !== null}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FoodQuizGame;
