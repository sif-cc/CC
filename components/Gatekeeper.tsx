
import React, { useState } from 'react';
import { soundEngine } from '../services/soundService';

interface GatekeeperProps {
  onUnlock: () => void;
}

const Gatekeeper: React.FC<GatekeeperProps> = ({ onUnlock }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInserted, setIsInserted] = useState(false);
  const [isTurning, setIsTurning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleStart = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    soundEngine.play('KEY_START', 0.6);
    
    setTimeout(() => {
      setIsInserted(true);
      soundEngine.play('KEY_INSERT', 0.5);
    }, 1200);

    setTimeout(() => {
      setIsTurning(true);
      soundEngine.play('KEY_TURN', 0.7);
    }, 1800);
    
    setTimeout(() => {
      soundEngine.play('UNLOCK_REVEAL', 0.4);
      setIsComplete(true);
      setTimeout(onUnlock, 1000);
    }, 4000);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-[#010413] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] rounded-full transition-all duration-2000 ${isTurning ? 'bg-amber-500/[0.1] blur-[100px] scale-125' : 'bg-amber-500/[0.03] blur-[80px] animate-pulse'}`}></div>
      </div>

      <div className={`relative flex flex-col items-center gap-4 md:gap-8 transition-transform duration-1000 perspective-[1500px] ${isTurning ? 'scale-105' : 'scale-100'}`}>
        
        {/* Responsive Book Sizing */}
        <div className={`relative w-40 h-[240px] md:w-64 md:h-[340px] transition-all duration-700 transform-gpu ${isAnimating && !isTurning ? 'animate-shake-haptic' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 bg-[#0a1122] rounded-r-[1rem] md:rounded-r-[1.5rem] border-y border-r border-white/10 shadow-[10px_20px_40px_rgba(0,0,0,0.8)] flex flex-col items-center p-4 md:p-8 overflow-hidden">
             
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-2 border-amber-500/40 rounded-full pointer-events-none ${isInserted ? 'animate-ripple-out' : 'opacity-0'}`}></div>
             
             <div className="w-full h-full flex flex-col items-center py-2 md:py-6 relative z-10">
                <div className="text-amber-500/10 text-[5px] md:text-[6px] font-mono tracking-[4px] md:tracking-[10px] uppercase mb-4 md:mb-10 select-none opacity-40">nexus.protocol</div>
                
                <div className="flex flex-col items-center gap-1 md:gap-3 mb-auto">
                   <h2 className="text-amber-500/90 font-black text-3xl md:text-6xl tracking-tighter uppercase leading-none text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                     C<span className="text-amber-400">C</span>
                   </h2>
                   <div className={`h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent transition-all duration-1000 ${isTurning ? 'w-20 md:w-32' : 'w-8 md:w-12'}`}></div>
                </div>
                
                <div className="relative mt-4 md:mt-8 group">
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-full border border-white/5 bg-black/70 flex items-center justify-center transition-all duration-1000 ${isInserted ? 'border-amber-400/30 shadow-[0_0_40px_rgba(251,191,36,0.3)] scale-110' : ''}`}>
                     <div className="w-3 h-6 md:w-6 md:h-12 bg-[#010413] rounded-full relative shadow-[inset_0_4px_10px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                        <div className={`absolute inset-0 bg-amber-400 blur-lg transition-opacity duration-700 ${isTurning ? 'opacity-40 animate-pulse' : 'opacity-0'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full border border-white/10 absolute bottom-1 transition-transform duration-[1500ms] ${isTurning ? 'rotate-180 scale-125' : ''}`}></div>
                     </div>
                  </div>
                </div>
             </div>
             
             <div className="absolute top-0 left-0 w-4 md:w-10 h-full bg-[#131a29] border-r border-white/10 rounded-l-lg -translate-x-full shadow-2xl flex flex-col items-center justify-center gap-4 md:gap-10">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="w-2 md:w-5 h-[1px] bg-amber-500/10"></div>
               ))}
             </div>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={isAnimating}
          className={`group relative z-50 transition-all duration-1000 cursor-pointer ${
            isAnimating 
              ? 'animate-key-path-mobile md:animate-key-path-desktop' 
              : 'animate-key-float-soft hover:scale-105 active:scale-95'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {!isAnimating && (
              <div className="absolute -inset-6 bg-amber-500/[0.03] blur-[20px] rounded-full animate-pulse pointer-events-none transition-all"></div>
            )}
            
            <div className={`text-amber-500 transition-all duration-1000 ${isInserted ? 'opacity-20 blur-[2px] scale-50' : 'drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]'}`}>
               <svg width="35" height="70" md-width="55" md-height="110" viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                  <defs>
                    <linearGradient id="key-shine-lux" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#92400e" />
                    </linearGradient>
                  </defs>
                  <circle cx="30" cy="30" r="23" stroke="url(#key-shine-lux)" strokeWidth="5"/>
                  <circle cx="30" cy="30" r="10" fill="url(#key-shine-lux)"/>
                  <circle cx="30" cy="30" r="3" fill="#010413"/>
                  <rect x="27" y="53" width="6" height="52" rx="3" fill="url(#key-shine-lux)"/>
                  <rect x="33" y="85" width="15" height="7" rx="2" fill="url(#key-shine-lux)"/>
                  <rect x="33" y="97" width="18" height="7" rx="2" fill="url(#key-shine-lux)"/>
               </svg>
            </div>

            {!isAnimating && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="text-amber-400 font-mono text-[8px] md:text-[10px] uppercase tracking-[4px] md:tracking-[6px] mb-1 whitespace-nowrap animate-glow-pulse">
                  Touch the key
                </span>
                <div className="h-4 md:h-6 w-px bg-gradient-to-b from-amber-500/40 to-transparent"></div>
              </div>
            )}
          </div>
        </button>

      </div>

      <div className={`fixed inset-0 z-[110] bg-white transition-all duration-[1200ms] pointer-events-none ${isComplete ? 'opacity-100' : 'opacity-0 scale-110'}`}></div>

      <style>{`
        @keyframes key-path-mobile {
          0% { transform: translateY(0) scale(1) translateZ(0); }
          30% { transform: translateY(-160px) scale(0.6) translateZ(0); }
          50% { transform: translateY(-160px) scale(0.35) translateZ(-100px); opacity: 0.9; }
          75% { transform: translateY(-160px) scale(0.35) rotate(90deg) translateZ(-100px); opacity: 0.5; }
          100% { transform: translateY(-160px) scale(0.1) rotate(90deg) translateZ(-300px); opacity: 0; }
        }
        @keyframes key-path-desktop {
          0% { transform: translateY(0) scale(1) translateZ(0); }
          30% { transform: translateY(-240px) scale(0.6) translateZ(0); }
          50% { transform: translateY(-240px) scale(0.35) translateZ(-200px); opacity: 0.9; }
          75% { transform: translateY(-240px) scale(0.35) rotate(90deg) translateZ(-200px); opacity: 0.5; }
          100% { transform: translateY(-240px) scale(0.1) rotate(90deg) translateZ(-500px); opacity: 0; }
        }
        .animate-key-path-mobile { animation: key-path-mobile 4s cubic-bezier(0.6, 0, 0.3, 1) forwards; }
        .animate-key-path-desktop { animation: key-path-desktop 4s cubic-bezier(0.6, 0, 0.3, 1) forwards; }
        @keyframes key-float-soft {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-key-float-soft { animation: key-float-soft 5s ease-in-out infinite; }
        @keyframes ripple-out {
          0% { width: 0; height: 0; opacity: 1; border-width: 4px; }
          100% { width: 350px; height: 350px; opacity: 0; border-width: 0.5px; }
        }
        .animate-ripple-out { animation: ripple-out 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes shake-haptic {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-1px) translateY(1px); }
          40% { transform: translateX(1px) translateY(-1px); }
          60% { transform: translateX(-1px) translateY(-1px); }
          80% { transform: translateX(1px) translateY(1px); }
        }
        .animate-shake-haptic { animation: shake-haptic 0.15s linear infinite; }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 5px rgba(251, 191, 36, 0); }
          50% { opacity: 1; text-shadow: 0 0 12px rgba(251, 191, 36, 0.9), 0 0 24px rgba(251, 191, 36, 0.4); }
        }
        .animate-glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Gatekeeper;
