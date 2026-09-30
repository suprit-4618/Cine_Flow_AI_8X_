import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { BottomNav } from './components/layout/BottomNav';
import { StudioPage } from './pages/StudioPage';
import { StoryboardPage } from './pages/StoryboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ExplorePage } from './pages/ExplorePage';

export const App: React.FC = () => {
  return (
    <StudioProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-obsidian text-text-primary selection:bg-cine-amber selection:text-obsidian">
          {/* Top App Header */}
          <Header />

          {/* Main Content Area */}
          <main
            id="main-content"
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 focus:outline-none"
            tabIndex={-1}
          >
            <Routes>
              <Route path="/" element={<StudioPage />} />
              <Route path="/storyboard" element={<StoryboardPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Bottom Tab Navigation */}
          <BottomNav />
        </div>
      </BrowserRouter>
    </StudioProvider>
  );
};

export default App;
