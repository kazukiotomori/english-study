import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

// Sub-component for individual question capability
// Using key={currentIndex} in parent will force full re-mount of this component per word
const QuizQuestion = ({ word, allWords, onComplete }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        // Generate options on mount
        const correct = word.ja;
        // Mock dummy generation from other words
        const others = allWords.filter(w => w.ja !== correct).map(w => w.ja);

        let dummies = [];
        if (others.length >= 3) {
            dummies = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        } else {
            while (dummies.length < 3 && others.length > 0) {
                dummies.push(others[Math.floor(Math.random() * others.length)]);
            }
            if (dummies.length < 3) dummies.push("Dummy 1", "Dummy 2", "Dummy 3");
        }

        const allOptions = [correct, ...dummies].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    }, [word, allWords]);

    const handleSelect = (option) => {
        if (selectedOption !== null) return;

        setSelectedOption(option);

        if (option === word.ja) {
            setIsCorrect(true);
            setTimeout(() => {
                onComplete();
            }, 600);
        } else {
            setIsCorrect(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
        }
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--spacing-lg)',
            justifyContent: 'center'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: 'auto',
                marginTop: 'var(--spacing-xl)'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-primary)'
                }}>
                    {word.en}
                </h2>
                <p style={{ color: 'var(--color-text-sub)' }}>意味を選んでください</p>
            </div>

            <div style={{ display: 'grid', gap: 'var(--spacing-md)', paddingBottom: 'var(--spacing-xl)' }}>
                {options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isAnswer = option === word.ja;

                    let btnStyle = {
                        padding: 'var(--spacing-lg)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        border: '2px solid transparent',
                        outline: 'none',
                        cursor: 'pointer'
                    };

                    if (selectedOption !== null) {
                        if (isAnswer) {
                            btnStyle.background = 'rgba(34, 197, 94, 0.2)';
                            btnStyle.borderColor = 'var(--color-success)';
                            btnStyle.color = 'var(--color-success)';
                        } else if (isSelected) {
                            btnStyle.background = 'rgba(239, 68, 68, 0.2)';
                            btnStyle.borderColor = 'var(--color-error)';
                            btnStyle.color = 'var(--color-error)';
                        } else {
                            btnStyle.opacity = 0.5;
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(option)}
                            style={btnStyle}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {isCorrect === false && (
                <button
                    onClick={onComplete}
                    style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '600'
                    }}
                >
                    次へ <Check size={16} style={{ verticalAlign: 'middle' }} />
                </button>
            )}
        </div>
    );
};

const VocabularyQuiz = ({ data, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    // key={currentIndex} ensures QuizQuestion is destroyed and recreated for every word
    return (
        <QuizQuestion
            key={currentIndex}
            word={data[currentIndex]}
            allWords={data}
            onComplete={handleNext}
        />
    );
};

export default VocabularyQuiz;
