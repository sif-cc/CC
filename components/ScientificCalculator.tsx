
import React, { useState, useEffect } from 'react';
import { soundEngine } from '../services/soundService';

interface ScientificCalculatorProps {
  onBack: () => void;
}

type CalcTheme = 'classic' | 'classic-2';

const ScientificCalculator: React.FC<ScientificCalculatorProps> = ({ onBack }) => {
  const [theme, setTheme] = useState<CalcTheme>('classic-2');
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isError, setIsError] = useState(false);
  const [shift, setShift] = useState(false);
  const [alpha, setAlpha] = useState(false);

  const playClick = () => soundEngine.play('TAP', 0.1);
  const playClear = () => soundEngine.play('BACK', 0.2);
  const playResult = () => soundEngine.play('SUCCESS', 0.3);

  const handleNumber = (num: string) => {
    playClick();
    if (isError) {
      setDisplay(num);
      setIsError(false);
      return;
    }
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    playClick();
    if (isError) return;
    setExpression(prev => prev + display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleFunction = (func: string) => {
    playClick();
    try {
      const val = parseFloat(display);
      let result = 0;
      switch (func) {
        case 'sin': result = Math.sin(val * Math.PI / 180); break;
        case 'cos': result = Math.cos(val * Math.PI / 180); break;
        case 'tan': result = Math.tan(val * Math.PI / 180); break;
        case 'sqrt': result = Math.sqrt(val); break;
        case 'log': result = Math.log10(val); break;
        case 'ln': result = Math.log(val); break;
        case 'exp': result = Math.exp(val); break;
        case 'square': result = val * val; break;
        case 'pi': result = Math.PI; break;
        case 'e': result = Math.E; break;
        default: return;
      }
      setDisplay(result.toString().substring(0, 12));
    } catch (e) {
      setIsError(true);
      setDisplay('Error');
    }
  };

  const calculate = () => {
    playResult();
    try {
      const finalExpr = expression + display;
      const result = new Function(`return ${finalExpr.replace(/×/g, '*').replace(/÷/g, '/')}`)();
      setDisplay(result.toString().substring(0, 12));
      setExpression('');
      setIsError(false);
    } catch (e) {
      setIsError(true);
      setDisplay('Error');
    }
  };

  const clear = () => {
    playClear();
    setDisplay('0');
    setExpression('');
    setIsError(false);
    setShift(false);
    setAlpha(false);
  };

  const deleteLast = () => {
    playClick();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const toggleTheme = (t: CalcTheme) => {
    soundEngine.play('DIGITAL_BLIP');
    setTheme(t);
  };

  const casioBtnBase = "flex flex-col items-center justify-center rounded shadow-sm active:shadow-inner active:translate-y-0.5 transition-all select-none border-b-[1.5px] md:border-b-[2px]";
  
  const renderCasio = (isSecondGen: boolean) => {
    const bgColor = isSecondGen ? 'bg-[#1a1a1e]' : 'bg-[#d0d3d4]';
    const bodyBorder = isSecondGen ? 'border-[#333]' : 'border-[#b0b3b4]';
    const lcdColor = isSecondGen ? 'bg-[#ced7bc]' : 'bg-[#dae4d6]';
    const numKeyColor = isSecondGen ? 'bg-[#3a3a3e] border-[#222]' : 'bg-[#f4f4f4] border-[#ccc]';
    const numKeyText = isSecondGen ? 'text-white' : 'text-slate-800';
    const opKeyColor = isSecondGen ? 'bg-[#2a2a2e] border-[#111]' : 'bg-[#333b47] border-[#1a1f26]';
    const acKeyColor = isSecondGen ? 'bg-[#7ba65e] border-[#4e6b3b]' : 'bg-[#e67e22] border-[#a05818]';
    const delKeyColor = isSecondGen ? 'bg-[#7ba65e] border-[#4e6b3b]' : 'bg-[#e67e22] border-[#a05818]';
    const topKeyColor = isSecondGen ? 'bg-[#222] border-[#000]' : 'bg-[#7f8c8d] border-[#666]';

    return (
      <div className={`${bgColor} ${bodyBorder} border-[4px] md:border-[5px] rounded-[22px] md:rounded-[28px] p-2 md:p-3 shadow-2xl relative w-full max-w-[210px] md:max-w-[250px] mx-auto transition-transform origin-top border-double flex flex-col items-stretch`}>
        {/* Casio Branding - More compact */}
        <div className="flex justify-between items-start mb-1.5 px-0.5">
          <div className="mt-0.5">
            <div className={`font-black text-[10px] md:text-xs italic tracking-tighter ${isSecondGen ? 'text-white' : 'text-slate-800'}`}>CASIO</div>
            <div className={`text-[4px] md:text-[5px] font-bold ${isSecondGen ? 'text-slate-500' : 'text-slate-600'}`}>fx-991ES {isSecondGen && 'V2'}</div>
          </div>
          {/* Solar Panel - Ultra Slim */}
          <div className="w-6 h-3 md:w-10 md:h-5 bg-[#251010] rounded-sm flex items-center justify-center gap-0.5 p-0.5 border border-black shadow-inner">
            <div className="flex-1 h-full bg-[#322] opacity-30"></div>
          </div>
        </div>

        {/* LCD Screen - Narrower and Slimmer */}
        <div className={`${lcdColor} border-[1.5px] border-slate-900 rounded-sm h-12 md:h-16 mb-2.5 p-1 md:p-2 shadow-inner relative overflow-hidden flex flex-col items-end justify-between font-mono`}>
          <div className="absolute top-0.5 left-1 text-[4.5px] md:text-[6px] text-slate-800/80 flex gap-1">
            <span className={shift ? 'opacity-100 font-bold' : 'opacity-10'}>S</span>
            <span className={alpha ? 'opacity-100 font-bold' : 'opacity-10'}>A</span>
          </div>
          <div className="w-full text-left text-slate-800 text-[7px] md:text-[10px] opacity-60 truncate">
            {expression || ' '}
          </div>
          <div className="text-slate-900 text-sm md:text-lg font-bold tracking-tight">
            {display}
          </div>
        </div>

        {/* Top Controls - Very compact */}
        <div className="grid grid-cols-5 gap-1 mb-2 px-0.5">
          <button onClick={() => { playClick(); setShift(!shift); setAlpha(false); }} className={`${topKeyColor} ${casioBtnBase} h-3 md:h-4 text-[4px] md:text-[5px] text-amber-400 font-bold`}>S</button>
          <button onClick={() => { playClick(); setAlpha(!alpha); setShift(false); }} className={`${topKeyColor} ${casioBtnBase} h-3 md:h-4 text-[4px] md:text-[5px] text-rose-400 font-bold`}>A</button>
          <div className="col-span-1"></div>
          <button onClick={onBack} className={`${topKeyColor} ${casioBtnBase} h-3 md:h-4 text-[3px] md:text-[4px] text-white font-bold`}>MOD</button>
          <button onClick={clear} className={`${topKeyColor} ${casioBtnBase} h-3 md:h-4 text-[3px] md:text-[4px] text-white font-bold`}>ON</button>
        </div>

        {/* Replay Button - Ultra Narrow */}
        <div className="flex justify-center mb-2">
          <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full ${isSecondGen ? 'bg-[#111]' : 'bg-[#95a5a6]'} border-[1.5px] ${isSecondGen ? 'border-[#222]' : 'border-slate-400'} shadow-md flex items-center justify-center relative`}>
             <div className="absolute top-0 text-[3.5px] md:text-[4.5px] text-white/40">▲</div>
             <div className="absolute bottom-0 text-[3.5px] md:text-[4.5px] text-white/40">▼</div>
          </div>
        </div>

        {/* Scientific Functions Grid - Smaller text */}
        <div className="grid grid-cols-6 gap-0.5 mb-2 px-0.5">
          {[
            { label: 'sin', func: () => handleFunction('sin') },
            { label: 'cos', func: () => handleFunction('cos') },
            { label: 'tan', func: () => handleFunction('tan') },
            { label: 'log', func: () => handleFunction('log') },
            { label: 'ln', func: () => handleFunction('ln') },
            { label: '√', func: () => handleFunction('sqrt') },
            { label: 'x²', func: () => handleFunction('square') },
            { label: 'xⁿ', func: () => playClick() },
            { label: 'x⁻¹', func: () => playClick() },
            { label: 'π', func: () => handleFunction('pi') },
            { label: 'e', func: () => handleFunction('e') },
            { label: 'exp', func: () => handleFunction('exp') },
            { label: '(', func: () => playClick() },
            { label: ')', func: () => playClick() },
            { label: 'hyp', func: () => playClick() },
            { label: '°\'"', func: () => playClick() },
            { label: 'S⇔D', func: () => playClick() },
            { label: 'RCL', func: () => playClick() }
          ].map(item => (
            <button key={item.label} onClick={item.func} className={`${isSecondGen ? 'bg-[#222]' : 'bg-[#34495e]'} ${casioBtnBase} h-3.5 md:h-4.5 text-[3px] md:text-[4px] text-white border-[#111]`}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Basic Ops Grid - Narrow columns */}
        <div className="grid grid-cols-5 gap-0.5 md:gap-1 px-0.5">
          {[7, 8, 9].map(n => <button key={n} onClick={() => handleNumber(n.toString())} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[10px] md:text-xs ${numKeyText} font-bold`}>{n}</button>)}
          <button onClick={deleteLast} className={`${delKeyColor} ${casioBtnBase} h-6 md:h-8 text-[5px] md:text-[6px] text-white font-bold`}>DEL</button>
          <button onClick={clear} className={`${acKeyColor} ${casioBtnBase} h-6 md:h-8 text-[5px] md:text-[6px] text-white font-bold`}>AC</button>

          {[4, 5, 6].map(n => <button key={n} onClick={() => handleNumber(n.toString())} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[10px] md:text-xs ${numKeyText} font-bold`}>{n}</button>)}
          <button onClick={() => handleOperator('*')} className={`${opKeyColor} ${casioBtnBase} h-6 md:h-8 text-xs md:text-sm text-white`}>×</button>
          <button onClick={() => handleOperator('/')} className={`${opKeyColor} ${casioBtnBase} h-6 md:h-8 text-xs md:text-sm text-white`}>÷</button>

          {[1, 2, 3].map(n => <button key={n} onClick={() => handleNumber(n.toString())} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[10px] md:text-xs ${numKeyText} font-bold`}>{n}</button>)}
          <button onClick={() => handleOperator('+')} className={`${opKeyColor} ${casioBtnBase} h-6 md:h-8 text-xs md:text-sm text-white`}>+</button>
          <button onClick={() => handleOperator('-')} className={`${opKeyColor} ${casioBtnBase} h-6 md:h-8 text-xs md:text-sm text-white`}>−</button>

          <button onClick={() => handleNumber('0')} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[10px] md:text-xs ${numKeyText} font-bold`}>0</button>
          <button onClick={() => handleNumber('.')} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[10px] md:text-xs ${numKeyText} font-bold`}>.</button>
          <button onClick={() => handleFunction('exp')} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[3px] md:text-[4px] ${numKeyText} font-bold`}>x10ˣ</button>
          <button onClick={() => handleFunction('pi')} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-[6px] md:text-[8px] ${numKeyText} font-bold`}>Ans</button>
          <button onClick={calculate} className={`${numKeyColor} ${casioBtnBase} h-6 md:h-8 text-xs md:text-sm ${numKeyText} font-bold`}>=</button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-transition min-h-screen w-full bg-[#020617] flex flex-col items-center justify-start p-2 md:p-6 overflow-y-auto custom-scrollbar">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[300px] h-[200px] md:h-[300px] blur-[60px] md:blur-[80px] rounded-full transition-colors duration-1000 ${
          theme === 'classic' ? 'bg-amber-500/[0.015]' : 'bg-slate-500/[0.03]'
        }`}></div>
      </div>

      <div className="w-full max-w-[220px] md:max-w-[270px] z-10 flex flex-col gap-2">
        {/* Navigation & Theme Selector - Slimmer */}
        <div className="flex items-center justify-between py-1 px-1">
          <button 
            onClick={onBack} 
            className="text-amber-500/80 font-mono text-[6px] md:text-[8px] uppercase tracking-[1px] flex items-center gap-1 hover:text-white transition-all group py-1"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
          </button>
          
          <div className="flex bg-white/5 p-0.5 rounded border border-white/10">
            <button 
              onClick={() => toggleTheme('classic')}
              className={`px-1.5 py-0.5 rounded text-[5px] md:text-[6px] uppercase font-bold transition-all ${theme === 'classic' ? 'bg-slate-400 text-slate-900' : 'text-slate-500'}`}
            >
              Ag
            </button>
            <button 
              onClick={() => toggleTheme('classic-2')}
              className={`px-1.5 py-0.5 rounded text-[5px] md:text-[6px] uppercase font-bold transition-all ${theme === 'classic-2' ? 'bg-amber-500 text-slate-900' : 'text-slate-500'}`}
            >
              V2
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-1">
          {renderCasio(theme === 'classic-2')}
        </div>

        <div className="mt-1 text-center opacity-10">
          <p className="text-[4px] md:text-[6px] font-mono text-slate-600 uppercase tracking-[1px]">Slim_Unit_HPE</p>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;
