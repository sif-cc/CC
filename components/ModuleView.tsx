
import React, { useState } from 'react';
import { Module, SubSection, Section, Chapter, SubSectionItem } from '../types';

interface ModuleViewProps {
  module: Module;
  onBack: () => void;
}

const ModuleView: React.FC<ModuleViewProps> = ({ module, onBack }) => {
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [activeNoteItem, setActiveNoteItem] = useState<SubSectionItem | null>(null);

  const activeSub = module.subSections.find(s => s.id === activeSubId);
  const activeSection = activeSub?.sections.find(sec => sec.id === activeSectionId);
  const activeChapter = activeSection?.chapters.find(ch => ch.id === activeChapterId);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'quiz': return '📝';
      case 'lab': return '🧪';
      default: return '📄';
    }
  };

  const handleBack = () => {
    if (activeNoteItem) {
      setActiveNoteItem(null);
    } else if (activeChapterId) {
      setActiveChapterId(null);
    } else if (activeSectionId) {
      setActiveSectionId(null);
    } else if (activeSubId) {
      setActiveSubId(null);
    } else {
      onBack();
    }
  };

  const handleItemClick = (item: SubSectionItem) => {
    if (item.status === 'Locked') return;
    if (item.content) {
      setActiveNoteItem(item);
    } else if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page-transition h-screen w-screen bg-[#020617] overflow-y-auto overflow-x-hidden text-slate-300 custom-scrollbar pb-32">
      <div className={`fixed inset-0 opacity-5 pointer-events-none blur-[100px] md:blur-[150px] transition-all duration-1000 ${module.color}`}></div>

      {/* Optimized Header for Mobile */}
      <div className="relative min-h-[140px] md:min-h-[260px] w-full flex items-center justify-center overflow-hidden px-4 py-8">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/30"></div>
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 md:top-8 md:left-8 glass p-2.5 md:p-4 rounded-full text-white hover:bg-white/10 active:scale-90 transition-all z-[60] group shadow-2xl"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center z-20 space-y-2 md:space-y-4 animate-page-in px-2 mt-4">
          <div className="text-2xl md:text-5xl opacity-80">
            {activeNoteItem ? '📜' : activeChapterId ? '📑' : activeSectionId ? '📂' : activeSubId ? getTypeIcon(activeSub?.type || 'reading') : module.icon}
          </div>
          <h1 className="text-lg md:text-4xl font-black tracking-tight text-white uppercase break-words drop-shadow-2xl leading-tight max-w-xl mx-auto">
            {activeNoteItem ? activeNoteItem.title : activeChapterId ? activeChapter?.title : activeSectionId ? activeSection?.title : activeSubId ? activeSub?.title : module.title}
          </h1>
          <div className="flex items-center justify-center gap-2">
             <div className="h-[1px] w-4 md:w-10 bg-amber-400/20"></div>
             <p className="text-amber-400 font-mono text-[7px] md:text-[9px] uppercase tracking-[4px] md:tracking-[8px]">
               {activeNoteItem ? 'Note Intel' : activeChapterId ? 'Chapter' : activeSectionId ? 'Section' : activeSubId ? 'Unit' : 'Module Index'}
             </p>
             <div className="h-[1px] w-4 md:w-10 bg-amber-400/20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {activeNoteItem ? (
          <div className="animate-page-in bg-[#fdfcf5] text-slate-900 p-8 md:p-16 rounded-[40px] shadow-2xl border border-amber-900/5 min-h-[60vh]">
            <div className="max-w-3xl mx-auto prose prose-slate prose-lg">
               <pre className="whitespace-pre-wrap font-sans text-base md:text-lg leading-relaxed text-slate-800">
                 {activeNoteItem.content}
               </pre>
               <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center opacity-40">
                  <span className="text-[10px] font-mono uppercase tracking-widest">EduNexus Intellectual Property</span>
                  <span className="text-[10px] font-mono">CC_SYSTEM_v4.2</span>
               </div>
            </div>
          </div>
        ) : (
          <>
            {(activeSubId || activeSectionId || activeChapterId) && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide text-[8px] md:text-[10px] font-mono uppercase tracking-widest border-b border-white/5">
                <button onClick={() => {setActiveSubId(null); setActiveSectionId(null); setActiveChapterId(null);}} className="text-slate-500 hover:text-white transition-colors whitespace-nowrap">Home</button>
                {activeSubId && <span className="text-slate-700">/</span>}
                {activeSubId && <button onClick={() => {setActiveSectionId(null); setActiveChapterId(null);}} className={`hover:text-white transition-colors whitespace-nowrap ${!activeSectionId ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{activeSub?.title}</button>}
                {activeSectionId && <span className="text-slate-700">/</span>}
                {activeSectionId && <button onClick={() => setActiveChapterId(null)} className={`hover:text-white transition-colors whitespace-nowrap ${!activeChapterId ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>{activeSection?.title}</button>}
              </div>
            )}

            {!activeSubId ? (
              <div className="animate-page-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {module.subSections.map((sub) => (
                  <button 
                    key={sub.id}
                    onClick={() => setActiveSubId(sub.id)}
                    className="glass p-6 md:p-8 rounded-[28px] md:rounded-[36px] border border-white/5 hover:border-amber-400/30 active:scale-[0.97] transition-all duration-300 group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl mb-4">{getTypeIcon(sub.type)}</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-amber-400">{sub.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{sub.difficulty}</span>
                      <span className="text-[9px] font-mono text-amber-500/60 uppercase">{sub.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : !activeSectionId ? (
              <div className="animate-page-in space-y-3">
                 {activeSub?.sections.map((sec, i) => (
                   <button 
                      key={sec.id}
                      onClick={() => setActiveSectionId(sec.id)}
                      className="w-full flex items-center justify-between glass p-5 md:p-6 rounded-[24px] border border-white/5 hover:border-amber-400/20 active:bg-white/[0.08] transition-all text-left group"
                   >
                     <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-mono text-amber-400/40 text-xs">0{i+1}</div>
                       <h4 className="text-base md:text-lg font-bold text-slate-200 group-hover:text-white">{sec.title}</h4>
                     </div>
                     <span className="text-[9px] md:text-[10px] text-slate-500 mr-2">{sec.chapters.length} Ch</span>
                   </button>
                 ))}
              </div>
            ) : !activeChapterId ? (
              <div className="animate-page-in space-y-2">
                 {activeSection?.chapters.map((ch, i) => (
                   <button 
                      key={ch.id}
                      onClick={() => setActiveChapterId(ch.id)}
                      className="w-full flex items-center justify-between glass p-4 md:p-5 rounded-[20px] border border-white/5 hover:border-amber-400/20 active:bg-white/[0.08] transition-all text-left group"
                   >
                     <div className="flex items-center gap-4">
                       <div className="text-slate-700 font-mono text-[10px]">CH_{i+1}</div>
                       <h4 className="text-sm md:text-lg font-bold text-slate-300 group-hover:text-white truncate pr-2">{ch.title}</h4>
                     </div>
                     <span className="text-[8px] font-mono text-slate-600 uppercase whitespace-nowrap">{ch.items.length} Nodes</span>
                   </button>
                 ))}
              </div>
            ) : (
              <div className="animate-page-in grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {activeChapter?.items.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`group glass p-5 md:p-6 rounded-[28px] border transition-all flex flex-col justify-between min-h-[120px] md:min-h-[140px] ${
                      item.status === 'Locked' ? 'border-white/5 opacity-40 grayscale cursor-not-allowed' : 'border-white/10 active:bg-white/[0.08] cursor-pointer hover:border-amber-400/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg">{getTypeIcon(item.type || 'reading')}</div>
                      <span className="text-[7px] md:text-[8px] font-mono text-slate-600 uppercase border border-white/10 px-2 py-0.5 rounded-full">{item.status}</span>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-slate-300 group-hover:text-white leading-tight">{item.title}</h4>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <span className="text-[7px] font-mono text-slate-700 uppercase">{item.content ? 'Intel' : item.url ? 'Link' : 'Archive'}</span>
                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[8px] group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">→</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleView;
