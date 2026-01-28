import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import contentData from '../data/content.json';
import { useLearning } from '../context/LearningContext';
import VocabularyQuiz from '../components/steps/VocabularyQuiz';
import AudioPractice from '../components/steps/AudioPractice';
import TranslationExercise from '../components/steps/TranslationExercise';

const LearningSession = () => {
    const { chapterId, sectionId } = useParams();
    const navigate = useNavigate();
    const { markSectionComplete } = useLearning();

    const [currentStep, setCurrentStep] = useState(1);
    const [sectionData, setSectionData] = useState(null);

    useEffect(() => {
        const chapter = contentData.chapters.find(c => c.id.toString() === chapterId);
        if (chapter) {
            const section = chapter.sections.find(s => s.id === sectionId);
            if (section) {
                setSectionData(section);
            } else {
                navigate('/'); // Section not found
            }
        } else {
            navigate('/'); // Chapter not found
        }
    }, [chapterId, sectionId, navigate]);

    if (!sectionData) return null;

    const handleNextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Completed all steps
            markSectionComplete(sectionId);
            navigate('/');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <VocabularyQuiz key="step1" data={sectionData.vocabulary} onComplete={handleNextStep} />;
            case 2:
                return <AudioPractice key="step2" data={sectionData} onNext={handleNextStep} />;
            case 3:
                return <TranslationExercise key="step3" data={sectionData} mode="decoding" onNext={handleNextStep} />;
            case 4:
                return <TranslationExercise key="step4" data={sectionData} mode="encoding" onNext={handleNextStep} />;
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Step 1: 単語・熟語';
            case 2: return 'Step 2: 音読練習';
            case 3: return 'Step 3: 英文和訳';
            case 4: return 'Step 4: 和文英訳';
            default: return '';
        }
    };

    return (
        <div className="session-container" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-background)',
            color: 'var(--color-text-main)'
        }}>
            {/* Header */}
            <header style={{
                padding: 'var(--spacing-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-surface)'
            }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-text-sub)' }}>
                    <X size={24} />
                </button>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    {getStepTitle()}
                </div>
                <div style={{ width: 24 }} /> {/* Spacer */}
            </header>

            {/* Interactive Progress Bar */}
            <div style={{
                display: 'flex',
                gap: '4px',
                padding: '0 var(--spacing-md)',
                marginTop: '-2px' // Overlap border
            }}>
                {[1, 2, 3, 4].map(step => (
                    <button
                        key={step}
                        onClick={() => setCurrentStep(step)}
                        style={{
                            height: '12px',
                            flex: 1,
                            background: step <= currentStep ? 'var(--color-primary)' : 'var(--color-surface)',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'background 0.3s ease',
                            borderRadius: '4px'
                        }}
                        aria-label={`Go to step ${step}`}
                    />
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                {renderStep()}
            </div>
        </div>
    );
};

export default LearningSession;
