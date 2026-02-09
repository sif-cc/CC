
import React, { useState, useEffect } from 'react';
import { EDUCATIONAL_MODULES } from '../constants';
import { soundEngine } from '../services/soundService';

interface LandingPageProps {
  onNavigate: (id: string) => void;
  onPlaylists: () => void;
  onTutor: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onPlaylists, onTutor }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxStyle = (factor: number) => ({
    transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
  });

  const handleModuleClick = (id: string) => {
    soundEngine.play('TAP');
    onNavigate(id);
  };

  const handleTechAction = (action: () => void) => {
    soundEngine.play('DIGITAL_BLIP');
    action();
  };

  return (
    <div className="relative h-screen w-screen bg-[#020617] overflow-hidden flex items-center justify-center font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] lamp-glow rounded-full"></div>
      </div>

      <div className="relative w-full max-w-7xl h-full flex flex-col lg:flex-row items-center justify-between px-4 md:px-12 z-10">
        
        <div className="relative flex-1 h-full hidden lg:flex items-center justify-center perspective-[2000px]">
          <div className="relative w-full h-[600px]">
            <div className="absolute top-20 left-10 animate-float-slow group cursor-pointer" style={parallaxStyle(0.4)} onClick={() => handleTechAction(onTutor)}>
              <div className="w-[340px] h-[230px] bg-slate-900 rounded-2xl p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-slate-700/50 group-hover:border-amber-400/40 transition-all duration-500">
                <div className="w-full h-full bg-[#0a0f1e] rounded-xl flex flex-col p-6 overflow-hidden relative">
                   <div className="text-[9px] font-mono text-amber-400/50 tracking-widest">AI_CORE_LINKED</div>
                   <div className="mt-4 space-y-2">
                     <div className="w-full h-1 bg-slate-800 rounded"></div>
                     <div className="w-2/3 h-1 bg-slate-800 rounded"></div>
                   </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-24 right-40 animate-float-fast group cursor-pointer" style={parallaxStyle(0.7)} onClick={() => handleTechAction(onPlaylists)}>
              <div className="flex flex-col-reverse items-center">
                <div className="w-52 h-11 bg-indigo-950 rounded-sm shadow-2xl border-l-4 border-amber-400/40 group-hover:border-amber-400 transition-all flex items-center px-4">
                  <span className="text-[9px] font-bold text-indigo-300/60 uppercase">CC_Finder</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[480px] flex flex-col items-center lg:items-end text-center lg:text-right py-12 h-full justify-center">
          <header className="mb-8 w-full">
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-2 uppercase">CC<span className="text-amber-400">.</span></h1>
             <p className="text-slate-500 text-xs md:text-sm">Select a section to explore its sub-modules.</p>
          </header>

          <div className="grid grid-cols-1 gap-3 w-full max-w-md max-h-[45vh] lg:max-h-[55vh] overflow-y-auto px-1 custom-scrollbar">
            {EDUCATIONAL_MODULES.map((module) => (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module.id)}
                className="w-full flex items-center justify-between px-6 py-4 md:py-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-[24px] md:rounded-[30px] transition-all duration-300 group hover:border-amber-400/30 active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl md:text-2xl grayscale group-hover:grayscale-0 transition-all">{module.icon}</span>
                  <span className="text-slate-300 font-bold group-hover:text-white transition-colors text-xs md:text-sm uppercase tracking-wide">
                    {module.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-amber-400 opacity-60">
                      {module.subSections.length} Subs
                   </span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 w-full max-w-md">
             <button onClick={() => handleTechAction(onPlaylists)} className="px-8 py-5 md:py-6 bg-amber-500 text-slate-950 rounded-full font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-xl shadow-amber-500/10">
               CC Finder
             </button>
             <button onClick={() => handleTechAction(onTutor)} className="px-8 py-5 md:py-6 bg-white/5 text-white border border-white/10 rounded-full font-black text-[11px] md:text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
               Neural Tutor Uplink
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
