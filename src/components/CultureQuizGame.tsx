import React, { useState, useEffect, useCallback, useRef } from 'react';
import './CultureQuizGame.css';

interface QuizItem {
    id: string;
    imageUrl: string;
    name: string; // For flags, this might be empty or "Flag of X"
    correctCountry: string;
    options: string[];
}

interface CountryData {
    name: {
        common: string;
    };
    flags: {
        png: string;
    };
}

const COUNTRY_MAP: Record<string, string> = {
    'American': 'Mỹ',
    'United States': 'Mỹ',
    'British': 'Anh',
    'United Kingdom': 'Anh',
    'Canadian': 'Canada',
    'Canada': 'Canada',
    'Chinese': 'Trung Quốc',
    'China': 'Trung Quốc',
    'Croatian': 'Croatia',
    'Croatia': 'Croatia',
    'Dutch': 'Hà Lan',
    'Netherlands': 'Hà Lan',
    'Egyptian': 'Ai Cập',
    'Egypt': 'Ai Cập',
    'French': 'Pháp',
    'France': 'Pháp',
    'Greek': 'Hy Lạp',
    'Greece': 'Hy Lạp',
    'Indian': 'Ấn Độ',
    'India': 'Ấn Độ',
    'Irish': 'Ireland',
    'Ireland': 'Ireland',
    'Italian': 'Ý',
    'Italy': 'Ý',
    'Jamaican': 'Jamaica',
    'Jamaica': 'Jamaica',
    'Japanese': 'Nhật Bản',
    'Japan': 'Nhật Bản',
    'Kenyan': 'Kenya',
    'Kenya': 'Kenya',
    'Malaysian': 'Malaysia',
    'Malaysia': 'Malaysia',
    'Mexican': 'Mexico',
    'Mexico': 'Mexico',
    'Moroccan': 'Ma-rốc',
    'Morocco': 'Ma-rốc',
    'Polish': 'Ba Lan',
    'Poland': 'Ba Lan',
    'Portuguese': 'Bồ Đào Nha',
    'Portugal': 'Bồ Đào Nha',
    'Russian': 'Nga',
    'Russia': 'Nga',
    'Spanish': 'Tây Ban Nha',
    'Spain': 'Tây Ban Nha',
    'Thai': 'Thái Lan',
    'Thailand': 'Thái Lan',
    'Tunisian': 'Tunisia',
    'Tunisia': 'Tunisia',
    'Turkish': 'Thổ Nhĩ Kỳ',
    'Turkey': 'Thổ Nhĩ Kỳ',
    'Vietnamese': 'Việt Nam',
    'Vietnam': 'Việt Nam',
    'Korean': 'Hàn Quốc',
    'South Korea': 'Hàn Quốc',
    'Brazilian': 'Brazil',
    'Brazil': 'Brazil',
    'Sri Lankan': 'Sri Lanka',
    'Sri Lanka': 'Sri Lanka',
    'Syrian': 'Syria',
    'Syria': 'Syria',
    'Seychellois': 'Seychelles',
    'Seychelles': 'Seychelles',
    'Vatican': 'Thành Vatican',
    'Vatican City': 'Thành Vatican',
    'Maltese': 'Malta',
    'Malta': 'Malta',
    'Germany': 'Đức',
    'Argentina': 'Argentina',
    'Australia': 'Úc',
    'Belgium': 'Bỉ',
    'Cambodia': 'Campuchia',
    'Laos': 'Lào',
    'Indonesia': 'Indonesia',
    'Singapore': 'Singapore',
    'Philippines': 'Philippines',
    'Myanmar': 'Myanmar',
    'Cuba': 'Cuba',
    'Sweden': 'Thụy Điển',
    'Switzerland': 'Thụy Sĩ',
    'Finland': 'Phần Lan',
    'Denmark': 'Đan Mạch',
    'Norway': 'Na Uy'
};

const COUNTRIES = Object.keys(COUNTRY_MAP);

interface CultureQuizGameProps {
    onBackToMenu: () => void;
}

type QuizTopic = 'food' | 'flag' | null;

const CultureQuizGame: React.FC<CultureQuizGameProps> = ({ onBackToMenu }) => {
    const [topic, setTopic] = useState<QuizTopic>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished' | 'error'>('loading');
    const [currentItem, setCurrentItem] = useState<QuizItem | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const usedQuestionIds = useRef<Set<string>>(new Set());
    const [allCountries, setAllCountries] = useState<CountryData[]>([]);

    // Fetch Countries from RestCountries API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setAllCountries(data);
                }
            } catch (error) {
                console.error('Failed to fetch countries data:', error);
            }
        };

        fetchCountries();
    }, []);

    const fetchNewQuestion = useCallback(async () => {
        if (!topic) return;

        setGameState('loading');
        setSelectedOption(null);
        setIsCorrect(null);

        try {
            if (topic === 'food') {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
                const data = await response.json();
                const meal = data.meals[0];

                const correctCountry = meal.strArea;
                // Filter distractors to be distinct from correct answer
                const distractors = COUNTRIES
                    .filter(c => c !== correctCountry && COUNTRY_MAP[c]) // Ensure we have translation
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                const options = [...distractors, correctCountry].sort(() => 0.5 - Math.random());

                setCurrentItem({
                    id: meal.idMeal,
                    imageUrl: meal.strMealThumb,
                    name: meal.strMeal,
                    correctCountry: correctCountry,
                    options: options
                });
                setGameState('playing');
            } else if (topic === 'flag' && allCountries.length > 0) {
                // Filter countries that we have translations for, to ensure good UX
                const validCountries = allCountries.filter(c => COUNTRY_MAP[c.name.common]);

                const availableCountries = validCountries.filter(c =>
                    !usedQuestionIds.current.has(c.name.common)
                );

                const countriesToUse = availableCountries.length > 0 ? availableCountries : validCountries;
                if (availableCountries.length === 0) {
                    usedQuestionIds.current = new Set();
                }

                const randomCountry = countriesToUse[Math.floor(Math.random() * countriesToUse.length)];
                usedQuestionIds.current.add(randomCountry.name.common);

                const correctCountryName = randomCountry.name.common;

                // Get distractors from the SAME valid list
                const distractors = validCountries
                    .filter(c => c.name.common !== correctCountryName)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(c => c.name.common);

                const options = [...distractors, correctCountryName].sort(() => 0.5 - Math.random());

                setCurrentItem({
                    id: correctCountryName,
                    imageUrl: randomCountry.flags.png,
                    name: "",
                    correctCountry: correctCountryName,
                    options: options
                });
                setGameState('playing');
            }
        } catch (error) {
            console.error("Failed to fetch question:", error);
            setGameState('error');
        }
    }, [topic, allCountries]);

    // Initial fetch when topic changes
    useEffect(() => {
        if (topic) {
            fetchNewQuestion();
        }
    }, [topic, fetchNewQuestion]);

    const handleOptionClick = (option: string) => {
        if (selectedOption || !currentItem) return;

        setSelectedOption(option);
        const correct = option === currentItem.correctCountry;
        setIsCorrect(correct);

        if (correct) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < 9) {
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
        usedQuestionIds.current = new Set();
        fetchNewQuestion();
    };

    const handleBackToTopics = () => {
        setTopic(null);
        setScore(0);
        setCurrentQuestionIndex(0);
        usedQuestionIds.current = new Set();
        setGameState('loading');
    };

    if (!topic) {
        return (
            <div className="food-quiz-container">
                <h1 className="quiz-header-title">Chọn Chủ Đề</h1>
                <div className="options-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div className="game-card" onClick={() => setTopic('food')}>
                        <span className="game-icon">🍲</span>
                        <h3>Ẩm Thực</h3>
                        <p>Đoán món ăn các nước</p>
                    </div>
                    <div className="game-card" onClick={() => setTopic('flag')}>
                        <span className="game-icon">🚩</span>
                        <h3>Vua Cờ</h3>
                        <p>Đoán tên quốc gia qua lá cờ</p>
                    </div>
                </div>
                <button className="action-btn menu-btn" onClick={onBackToMenu} style={{ marginTop: '2rem', maxWidth: '200px' }}>Quay lại Menu</button>
            </div>
        );
    }

    if (gameState === 'loading') {
        return (
            <div className="food-quiz-container">
                <div className="loading-spinner">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (gameState === 'error') {
        return (
            <div className="food-quiz-container">
                <div className="error-message">
                    <h2>Rất tiếc! Đã có lỗi xảy ra.</h2>
                    <button className="action-btn play-again-btn" onClick={fetchNewQuestion}>Thử lại</button>
                    <button className="action-btn menu-btn" onClick={handleBackToTopics}>Chọn chủ đề khác</button>
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
                    <button className="action-btn menu-btn" onClick={handleBackToTopics}>Chọn chủ đề khác</button>
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
                        <img src={currentItem.imageUrl} alt="Quiz item" className="food-image" />
                        <div className="food-name">{currentItem.name}</div>
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

export default CultureQuizGame;
