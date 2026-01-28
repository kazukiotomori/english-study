import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const VocabularyQuiz = ({ data, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); // true, false, or null
    const [shaking, setShaking] = useState(false);

    const currentWord = data[currentIndex];

    useEffect(() => {
        generateOptions();
    }, [currentIndex]);

    const generateOptions = () => {
        // Correct answer
        const correct = currentWord.ja;

        // Dummy answers (picks random from other words in the same set)
        // In a real app with more data, we might pick from a global pool or same chapter
        const others = data.filter((_, idx) => idx !== currentIndex).map(w => w.ja);

        // If not enough dummies, just repeat (since data set is small in sample)
        // Ideally we want 3 dummies.
        let dummies = [];
        if (others.length >= 3) {
            dummies = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        } else {
            // repeat others to fill 3
            while (dummies.length < 3 && others.length > 0) {
                dummies.push(others[Math.floor(Math.random() * others.length)]);
            }
            // If still empty (only 1 word in set?), provide generic dummies (unlikely case for specs)
            if (dummies.length < 3) dummies.push("Dummy 1", "Dummy 2", "Dummy 3");
        }

        const allOptions = [correct, ...dummies];
        // Shuffle
        setOptions(allOptions.sort(() => 0.5 - Math.random()));
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleSelect = (option) => {
        if (selectedOption !== null) return; // Prevent double tap

        setSelectedOption(option);

        if (option === currentWord.ja) {
            setIsCorrect(true);
            // Auto advance after short delay
            setTimeout(() => {
                if (currentIndex < data.length - 1) {
                    setCurrentIndex(prev => prev + 1);
                } else {
                    onComplete();
                }
            }, 600); // "Explosively fast" - 600ms is quick enough to see Feedback
        } else {
            setIsCorrect(false);
            setShaking(true);
            setTimeout(() => setShaking(false), 500);
            // Stay on screen to let user learn
        }
    };

    const handleNextAfterMistake = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete();
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
            {/* Word Question */}
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
                    {currentWord.en}
                </h2>
                <p style={{ color: 'var(--color-text-sub)' }}>意味を選んでください</p>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gap: 'var(--spacing-md)', paddingBottom: 'var(--spacing-xl)' }}>
                {options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isAnswer = option === currentWord.ja;

                    let btnStyle = {
                        padding: 'var(--spacing-lg)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-main)',
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        border: '2px solid transparent'
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
                            key={`${currentIndex}-${idx}`}
                            onClick={() => handleSelect(option)}
                            style={btnStyle}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {/* Continue button if wrong */}
            {isCorrect === false && (
                <button
                    onClick={handleNextAfterMistake}
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

export default VocabularyQuiz;
