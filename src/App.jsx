import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LearningProvider } from './context/LearningContext';
import Home from './pages/Home';
import LearningSession from './pages/LearningSession';

function App() {
  return (
    <LearningProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <div className="app-layout" style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:chapterId/:sectionId" element={<LearningSession />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </LearningProvider>
  );
}

export default App;
