import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronRight, Settings } from 'lucide-react';
import { useLearning } from '../../context/LearningContext';

const AudioPractice = ({ data, onNext }) => {
    const { settings, updateSettings } = useLearning();
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(settings.audioSpeed || 1.0);
    const audioRef = useRef(null);

    const audioSrc = `/${data.audio_file}`; // Assuming files are in public root

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleSpeed = () => {
        const newRate = playbackRate === 1.0 ? 0.8 : 1.0;
        setPlaybackRate(newRate);
        updateSettings({ audioSpeed: newRate });
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--spacing-lg)',
            justifyContent: 'space-between'
        }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.6',
                    fontWeight: '500',
                    textAlign: 'left',
                    color: 'var(--color-text-main)'
                }}>
                    {data.sentence_en}
                </p>
            </div>

            <div className="controls" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-lg)'
            }}>
                {/* Audio Controls */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <button onClick={toggleSpeed} style={{
                        fontSize: '0.9rem',
                        color: 'var(--color-text-sub)',
                        background: 'none',
                        fontWeight: '600'
                    }}>
                        {playbackRate.toFixed(1)}x
                    </button>

                    <button onClick={togglePlay} style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                    }}>
                        {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                    </button>

                    <div style={{ width: '30px' }}></div> {/* Spacer for center alignment */}
                </div>

                <button
                    onClick={onNext}
                    style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-surface)', // Secondary action
                        color: 'var(--color-text-main)',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)'
                    }}
                >
                    次のステップへ <ChevronRight size={18} />
                </button>
            </div>

            <audio
                ref={audioRef}
                src={audioSrc}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => console.log("Audio load error", e)}
            />
        </div>
    );
};

export default AudioPractice;
