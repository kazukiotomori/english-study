import React, { createContext, useContext, useState, useEffect } from 'react';

const LearningContext = createContext();

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};

export const LearningProvider = ({ children }) => {
  // Settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : {
      translationMode: 'en-ja', // 'en-ja' or 'ja-en'
      audioSpeed: 1.0,
      autoAdvance: true
    };
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  // Progress Tracking (e.g., { '8-1': { completed: true, timestamp: ... } })
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('app-progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist progress
  useEffect(() => {
    localStorage.setItem('app-progress', JSON.stringify(progress));
  }, [progress]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markSectionComplete = (sectionId) => {
    setProgress(prev => ({
      ...prev,
      [sectionId]: { completed: true, timestamp: Date.now() }
    }));
  };

  const value = {
    settings,
    updateSettings,
    progress,
    markSectionComplete
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};
