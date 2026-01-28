import React, { useState, useEffect } from 'react';
import { Eye, ChevronRight, RefreshCw, AudioLines } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

const TranslationExercise = ({ data, mode, onNext }) => {
    // mode: 'decoding' (En -> Ja) or 'encoding' (Ja -> En)
    const [showAnswer, setShowAnswer] = useState(false);
    const { settings, updateSettings } = useLearning();

    // Local state for toggle, initially sync with props/settings
    const [isReverse, setIsReverse] = useState(
        mode === 'decoding' ? false : true
    );

    useEffect(() => {
        // Reset state when data changes (e.g. moving next)
        setShowAnswer(false);
    }, [data]);

    const handleToggleMode = () => {
        // Toggle between Decoding <-> Encoding
        // Note: This component is reused for Step 3 and 4, but the parent passes explicit 'mode'.
        // If we toggle here, we are just changing the view temporarily? 
        // SPEC says: "Step 3 and 4 are toggle switch for 'default' to 'reverse'".
        // So likely one step with a toggle, OR separate steps.
        // My Implementation Plan has them as separate steps (3 and 4).
        // But Step 4 is just "Reverse" of Step 3?
        // Let's allow visual toggle which overrides the default "Step 3" behavior if desired,
        // but typically Step 3 is En->Ja.
        setIsReverse(!isReverse);
    };

    const questionText = isReverse ? data.sentence_ja : data.sentence_en;
    const answerText = isReverse ? data.sentence_en : data.sentence_ja;
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
                        onClick={onNext}
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
                        次へ <ChevronRight size={20} />
                    </button>
                )}

                <button
                    onClick={handleToggleMode}
                    style={{
                        padding: 'var(--spacing-md)',
                        background: 'transparent',
                        color: 'var(--color-text-sub)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)',
                        fontSize: '0.9rem'
                    }}
                >
                    <RefreshCw size={16} /> モード切替 ({isReverse ? '日→英' : '英→日'})
                </button>
            </div>
        </div>
    );
};

export default TranslationExercise;
