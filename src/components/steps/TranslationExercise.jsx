import React, { useState, useEffect } from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

const TranslationExercise = ({ data, mode, onNext }) => {
    // mode: 'decoding' (En -> Ja) or 'encoding' (Ja -> En)
    const [showAnswer, setShowAnswer] = useState(false);
    const { settings, updateSettings } = useLearning();
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

    // Strictly use mode prop
    const isReverse = mode === 'encoding';

    const sentences = Array.isArray(data.sentences)
        ? data.sentences
        : [{ en: data.sentence_en, ja: data.sentence_ja }];

    const currentSentence = sentences[currentSentenceIndex];

    useEffect(() => {
        // Reset state when data changes (e.g. moving next)
        setShowAnswer(false);
        setCurrentSentenceIndex(0); // Reset sentence index when new data arrives
    }, [data]);

    useEffect(() => {
        setShowAnswer(false);
    }, [currentSentenceIndex]);

    const handleNextBtn = () => {
        if (showAnswer) {
            // Move to next sentence or finish
            if (currentSentenceIndex < sentences.length - 1) {
                setCurrentSentenceIndex(prev => prev + 1);
                setShowAnswer(false);
            } else {
                onNext();
            }
        } else {
            if (currentSentenceIndex < sentences.length - 1) {
                setCurrentSentenceIndex(prev => prev + 1);
            } else {
                onNext();
            }
        }
    };

    const questionText = isReverse ? currentSentence.ja : currentSentence.en;
    const answerText = isReverse ? currentSentence.en : currentSentence.ja;
    const label = isReverse ? "英語に直してください" : "日本語に直してください";

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--spacing-lg)',
            justifyContent: 'space-between'
        }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{
                    marginBottom: 'var(--spacing-lg)',
                    fontSize: '0.9rem',
                    color: 'var(--color-primary)',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {label}
                </div>

                <p style={{
                    fontSize: '1.4rem',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    color: 'var(--color-text-main)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    {questionText}
                </p>

                {showAnswer && (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: '4px solid var(--color-secondary)',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <p style={{
                            fontSize: '1.2rem',
                            lineHeight: '1.5',
                            color: 'var(--color-text-main)'
                        }}>
                            {answerText}
                        </p>
                    </div>
                )}

                {/* Sentence progress indicator */}
                <div style={{ marginTop: 'auto', fontSize: '0.8rem', color: 'var(--color-text-sub)', textAlign: 'center' }}>
                    {currentSentenceIndex + 1} / {sentences.length}
                </div>
            </div>

            <div className="controls" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        style={{
                            padding: 'var(--spacing-lg)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-sm)',
                            width: '100%'
                        }}
                    >
                        <Eye size={20} /> 答えを表示
                    </button>
                ) : (
                    <button
                        onClick={handleNextBtn}
                        style={{
                            padding: 'var(--spacing-lg)',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-sm)',
                            width: '100%'
                        }}
                    >
                        {currentSentenceIndex < sentences.length - 1 ? '次の文へ' : '次へ'} <ChevronRight size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default TranslationExercise;
