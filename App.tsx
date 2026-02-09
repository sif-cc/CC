
import React, { useState } from 'react';
import { EDUCATIONAL_MODULES } from './constants';
import LandingPage from './components/LandingPage';
import ModuleView from './components/ModuleView';
import AITutor from './components/AITutor';
import PlaylistSection from './components/PlaylistSection';
import Gatekeeper from './components/Gatekeeper';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'module' | 'playlists' | 'tutor'>('home');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const activeModule = EDUCATIONAL_MODULES.find(m => m.id === activeModuleId);

  const navigateToModule = (id: string) => {
    setActiveModuleId(id);
    setCurrentPage('module');
  };

  const goHome = () => {
    setCurrentPage('home');
    setActiveModuleId(null);
  };

  if (!isStarted) {
    return <Gatekeeper onUnlock={() => setIsStarted(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020617] selection:bg-amber-400/30 animate-page-in">
      {currentPage === 'home' && (
        <LandingPage 
          onNavigate={navigateToModule} 
          onPlaylists={() => setCurrentPage('playlists')}
          onTutor={() => setCurrentPage('tutor')}
        />
      )}

      {currentPage === 'module' && activeModule && (
        <ModuleView module={activeModule} onBack={goHome} />
      )}

      {currentPage === 'playlists' && (
        <div className="h-screen w-screen overflow-y-auto bg-[#020617] p-4 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 md:mb-12">
            <button onClick={goHome} className="text-amber-400 font-mono text-[9px] md:text-xs uppercase tracking-[3px] md:tracking-[4px] flex items-center gap-2 md:gap-3 hover:text-white transition-colors group px-2 py-1">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return
            </button>
            <div className="text-slate-700 font-mono text-[7px] md:text-[9px] uppercase tracking-[3px] md:tracking-[4px]">CC Finder System</div>
          </div>
          <PlaylistSection onNavigateModule={navigateToModule} />
        </div>
      )}

      {currentPage === 'tutor' && (
        <div className="h-screen w-screen overflow-y-auto bg-[#020617] p-4 md:p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto flex items-center justify-between mb-4 md:mb-8">
            <button onClick={goHome} className="text-amber-400 font-mono text-[9px] md:text-xs uppercase tracking-[3px] md:tracking-[4px] flex items-center gap-2 md:gap-3 hover:text-white transition-colors group px-2 py-1">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Disconnect
            </button>
            <div className="text-slate-700 font-mono text-[7px] md:text-[9px] uppercase tracking-[3px] md:tracking-[4px]">Link: Secure</div>
          </div>
          <AITutor />
        </div>
      )}
    </div>
  );
};

export default App;
