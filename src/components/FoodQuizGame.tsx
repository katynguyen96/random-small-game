import React, { useState, useEffect, useCallback } from 'react';
import './FoodQuizGame.css';

interface FoodItem {
    id: string;
    imageUrl: string;
    foodName: string;
    correctCountry: string;
    options: string[];
}

const COUNTRY_MAP: Record<string, string> = {
    'American': 'Mỹ',
    'British': 'Anh',
    'Canadian': 'Canada',
    'Chinese': 'Trung Quốc',
    'Croatian': 'Croatia',
    'Dutch': 'Hà Lan',
    'Egyptian': 'Ai Cập',
    'French': 'Pháp',
    'Greek': 'Hy Lạp',
    'Indian': 'Ấn Độ',
    'Irish': 'Ireland',
    'Italian': 'Ý',
    'Jamaican': 'Jamaica',
    'Japanese': 'Nhật Bản',
    'Kenyan': 'Kenya',
    'Malaysian': 'Malaysia',
    'Mexican': 'Mexico',
    'Moroccan': 'Ma-rốc',
    'Polish': 'Ba Lan',
    'Portuguese': 'Bồ Đào Nha',
    'Russian': 'Nga',
    'Spanish': 'Tây Ban Nha',
    'Thai': 'Thái Lan',
    'Tunisian': 'Tunisia',
    'Turkish': 'Thổ Nhĩ Kỳ',
    'Vietnamese': 'Việt Nam'
};

const COUNTRIES = Object.keys(COUNTRY_MAP);

interface FoodQuizGameProps {
    onBackToMenu: () => void;
}

const FoodQuizGame: React.FC<FoodQuizGameProps> = ({ onBackToMenu }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished' | 'error'>('loading');
    const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const fetchNewQuestion = useCallback(async () => {
        setGameState('loading');
        setSelectedOption(null);
        setIsCorrect(null);

        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
            const data = await response.json();
            const meal = data.meals[0];

            const correctCountry = meal.strArea;

            // Generate distractors
            const distractors = COUNTRIES
                .filter(c => c !== correctCountry)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const options = [...distractors, correctCountry].sort(() => 0.5 - Math.random());

            setCurrentItem({
                id: meal.idMeal,
                imageUrl: meal.strMealThumb,
                foodName: meal.strMeal,
                correctCountry: correctCountry,
                options: options
            });
            setGameState('playing');
        } catch (error) {
            console.error("Failed to fetch question:", error);
            setGameState('error');
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchNewQuestion();
    }, [fetchNewQuestion]);

    const handleOptionClick = (option: string) => {
        if (selectedOption || !currentItem) return;

        setSelectedOption(option);
        const correct = option === currentItem.correctCountry;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }

        // Auto advance
        setTimeout(() => {
            if (currentQuestionIndex < 9) { // Play 10 rounds
                setCurrentQuestionIndex(prev => prev + 1);
                fetchNewQuestion();
            } else {
                setGameState('finished');
            }
        }, 1500);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        fetchNewQuestion();
    };

    if (gameState === 'loading') {
        return (
            <div className="food-quiz-container">
                <div className="loading-spinner">Đang tải món ăn ngon...</div>
            </div>
        );
    }

    if (gameState === 'error') {
        return (
            <div className="food-quiz-container">
                <div className="error-message">
                    <h2>Rất tiếc! Đã có lỗi xảy ra.</h2>
                    <button className="action-btn play-again-btn" onClick={fetchNewQuestion}>Thử lại</button>
                    <button className="action-btn menu-btn" onClick={onBackToMenu}>Quay lại Menu</button>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="food-quiz-container">
                <div className="game-over-card">
                    <h2>Trò chơi kết thúc!</h2>
                    <p className="final-score">Bạn đạt {score} trên 10 điểm</p>
                    <button className="action-btn play-again-btn" onClick={handleRestart}>Chơi lại</button>
                    <button className="action-btn menu-btn" onClick={onBackToMenu}>Quay lại Menu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="food-quiz-container">
            <div className="quiz-header">
                <span>Câu hỏi {currentQuestionIndex + 1}/10</span>
                <span>Điểm: {score}</span>
            </div>

            {currentItem && (
                <>
                    <div className="food-display">
                        <img src={currentItem.imageUrl} alt="Food to guess" className="food-image" />
                        <div className="food-name">{currentItem.foodName}</div>
                    </div>

                    <div className="options-grid">
                        {currentItem.options.map((option) => {
                            let btnClass = 'option-btn';
                            if (selectedOption === option) {
                                btnClass += isCorrect ? ' correct' : ' wrong';
                            } else if (selectedOption && option === currentItem.correctCountry) {
                                btnClass += ' correct';
                            }

                            return (
                                <button
                                    key={option}
                                    className={btnClass}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={selectedOption !== null}
                                >
                                    {COUNTRY_MAP[option] || option}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default FoodQuizGame;
