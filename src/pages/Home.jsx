import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import contentData from '../data/content.json';
import { useLearning } from '../context/LearningContext';

const Home = () => {
    const { progress } = useLearning();

    return (
        <div className="home-container" style={{ padding: 'var(--spacing-md)', paddingBottom: '80px' }}>
            <header style={{ marginBottom: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)' }}>
                <h1 className="text-gradient" style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    英語学習アプリ
                </h1>
            </header>

            <div className="chapter-list">
                {contentData.chapters.map(chapter => (
                    <div key={chapter.id} className="chapter-group" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h2 style={{
                            fontSize: '1.25rem',
                            color: 'var(--color-text-main)',
                            marginBottom: 'var(--spacing-md)',
                            borderLeft: '4px solid var(--color-primary)',
                            paddingLeft: 'var(--spacing-sm)'
                        }}>
                            {chapter.title}
                        </h2>

                        <div className="section-list" style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            {chapter.sections.map(section => {
                                const isCompleted = progress[section.id]?.completed;

                                return (
                                    <Link
                                        key={section.id}
                                        to={`/learn/${chapter.id}/${section.id}`}
                                        className="glass-panel"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-md)',
                                            borderRadius: 'var(--radius-lg)',
                                            transition: 'transform 0.2s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: 'var(--radius-md)',
                                                background: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: 'var(--spacing-md)',
                                                color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)'
                                            }}>
                                                {isCompleted ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-primary)',
                                                    fontWeight: '600',
                                                    marginBottom: '2px'
                                                }}>
                                                    SECTION {section.id}
                                                </div>
                                                <div style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '500',
                                                    color: 'var(--color-text-main)'
                                                }}>
                                                    {section.title}
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} color="var(--color-text-sub)" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
