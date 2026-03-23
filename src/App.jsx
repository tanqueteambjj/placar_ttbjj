import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus, Sun, Moon } from 'lucide-react';

const App = () => {
  // Configurações Iniciais
  const [matchTime, setMatchTime] = useState(300); // 5 minutos padrão
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Estados dos Lutadores
  const initialFighterState = {
    name: 'LUTADOR',
    team: '',
    points: 0,
    advantages: 0,
    penalties: 0,
  };

  const [fighter1, setFighter1] = useState({ ...initialFighterState, name: 'LUTADOR 1' });
  const [fighter2, setFighter2] = useState({ ...initialFighterState, name: 'LUTADOR 2' });

  // Lógica do Cronómetro
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const executeReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(matchTime);
    setFighter1({ ...initialFighterState, name: 'LUTADOR 1' });
    setFighter2({ ...initialFighterState, name: 'LUTADOR 2' });
  }, [matchTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSetTime = (minutes) => {
    const newTime = minutes * 60;
    setMatchTime(newTime);
    setTimeLeft(newTime);
    setIsRunning(false);
    setShowSettings(false);
  };

  // Funções de Pontuação
  const updateScore = (fighterNum, type, value) => {
    const setFighter = fighterNum === 1 ? setFighter1 : setFighter2;
    setFighter(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value)
    }));
  };

  // Classes Dinâmicas de Estilo (Uso de Zinc para melhor compatibilidade com CDN)
  const themeClasses = {
    appBg: isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900',
    navBg: isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-300',
    cardBg: isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-300',
    header2Bg: isDarkMode ? 'bg-zinc-800' : 'bg-gray-800', 
    pointsColor: isDarkMode ? 'text-white' : 'text-gray-900',
    labelColor: isDarkMode ? 'text-zinc-400' : 'text-gray-500',
    btnBg: isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    btnRedBg: isDarkMode ? 'bg-red-900/40 hover:bg-red-800/60 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700',
    advPenBg: isDarkMode ? 'bg-zinc-800/40 border-zinc-800' : 'bg-gray-50/50 border-gray-200',
    circleBtn: isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 shadow-sm',
    menuBg: isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900',
    menuBtn: isDarkMode ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };

  const FighterCard = ({ num, data, isGreenBelt }) => {
    const bgHeaderColor = isGreenBelt ? 'bg-green-600' : themeClasses.header2Bg;
    
    return (
      <div className={`flex-1 flex flex-col border-2 rounded-2xl overflow-hidden m-2 shadow-2xl transition-all duration-300 ${themeClasses.cardBg}`}>
        <div className={`${bgHeaderColor} p-4 text-center relative flex flex-col justify-center gap-1 min-h-[140px]`}>
          <input
            type="text"
            value={data.name}
            onChange={(e) => {
              const setFighter = num === 1 ? setFighter1 : setFighter2;
              setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }));
            }}
            className="bg-transparent text-white text-3xl md:text-5xl font-black text-center w-full focus:outline-none focus:bg-white/10 rounded px-2"
          />
          <input
            type="text"
            value={data.team}
            onChange={(e) => {
              const setFighter = num === 1 ? setFighter1 : setFighter2;
              setFighter(prev => ({ ...prev, team: e.target.value.toUpperCase() }));
            }}
            placeholder="NOME DA EQUIPE"
            className="bg-transparent text-white/90 text-xl md:text-2xl font-bold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2 placeholder:text-white/20"
          />
          {isGreenBelt && <div className="absolute top-0 right-0 bottom-0 w-4 bg-yellow-400"></div>}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <span className={`text-xl font-bold uppercase tracking-[0.2em] mb-1 ${themeClasses.labelColor}`}>Pontos</span>
          <div className={`text-[12rem] md:text-[15rem] leading-none font-black tabular-nums tracking-tighter ${themeClasses.pointsColor}`}>
            {data.points}
          </div>
          
          <div className="flex gap-2 mt-4 w-full justify-center">
             {[2, 3, 4].map(val => (
               <button key={val} onClick={() => updateScore(num, 'points', val)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnBg}`}>+{val}</button>
             ))}
             <button onClick={() => updateScore(num, 'points', -1)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnRedBg}`}>-1</button>
          </div>
        </div>

        <div className={`flex border-t h-44 ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
          <div className={`flex-1 flex flex-col border-r ${themeClasses.advPenBg}`}>
            <div className="bg-yellow-500 text-black text-center py-2 font-black uppercase tracking-widest text-xs">Vantagens</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'advantages', -1)} className={`p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Minus size={28} /></button>
              <span className="text-7xl font-black text-yellow-500 tabular-nums">{data.advantages}</span>
              <button onClick={() => updateScore(num, 'advantages', 1)} className={`p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Plus size={28} /></button>
            </div>
          </div>

          <div className={`flex-1 flex flex-col ${themeClasses.advPenBg}`}>
            <div className="bg-red-600 text-white text-center py-2 font-black uppercase tracking-widest text-xs">Punições</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'penalties', -1)} className={`p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Minus size={28} /></button>
              <span className="text-7xl font-black text-red-500 tabular-nums">{data.penalties}</span>
              <button onClick={() => updateScore(num, 'penalties', 1)} className={`p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Plus size={28} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none transition-colors duration-500 ${themeClasses.appBg}`}>
      
      {showResetModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className={`max-w-md w-full p-10 rounded-[2.5rem] shadow-2xl text-center border-2 ${themeClasses.menuBg}`}>
            <h2 className="text-4xl font-black mb-4 tracking-tighter">ZERAR PLACAR?</h2>
            <p className={`mb-10 text-xl font-medium ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>
              Todos os dados da luta atual serão perdidos.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowResetModal(false)} className={`flex-1 py-5 rounded-2xl font-bold text-xl ${themeClasses.menuBtn}`}>Cancelar</button>
              <button onClick={() => { executeReset(); setShowResetModal(false); }} className="flex-1 py-5 rounded-2xl font-bold text-xl bg-red-600 hover:bg-red-500 text-white shadow-xl">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      <div className={`border-b p-6 flex items-center justify-between shadow-2xl relative z-10 transition-colors ${themeClasses.navBg}`}>
        <div className="hidden xl:flex items-center gap-5 font-black text-2xl tracking-tighter uppercase italic">
          <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-24 w-auto object-contain drop-shadow-2xl" />
          <div className="flex flex-col leading-none">
            <span className="text-blue-600 text-3xl">Tanque Team</span>
            <span className="text-sm tracking-[0.4em] opacity-40">Jiu-Jitsu Profissional</span>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center gap-10 md:gap-20">
          <div className={`text-9xl md:text-[15rem] leading-none font-black tabular-nums tracking-tighter drop-shadow-sm ${timeLeft === 0 ? 'text-red-500 animate-pulse' : themeClasses.pointsColor}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex flex-col gap-4">
            <button onClick={toggleTimer} className={`p-7 rounded-full shadow-2xl transition-all active:scale-90 hover:scale-105 ${isRunning ? 'bg-amber-500 text-black' : 'bg-green-500 text-black'}`}>
              {isRunning ? <Pause size={52} fill="currentColor" /> : <Play size={52} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={() => setShowResetModal(true)} className={`p-6 rounded-full shadow-xl transition-all active:scale-90 hover:scale-105 ${themeClasses.circleBtn}`}>
              <RotateCcw size={32} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-6 rounded-full shadow-lg ${themeClasses.circleBtn}`}>{isDarkMode ? <Sun size={32} /> : <Moon size={32} />}</button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-6 rounded-full shadow-lg ${themeClasses.circleBtn}`}><Settings size={32} /></button>
        </div>
      </div>

      {showSettings && (
        <div className={`absolute top-36 right-8 border-2 p-10 rounded-[2.5rem] shadow-2xl z-20 w-[24rem] ${themeClasses.menuBg}`}>
          <h3 className="font-black mb-8 uppercase text-center text-sm tracking-[0.3em] opacity-60">Duração do Combate</h3>
          <div className="grid grid-cols-3 gap-4">
            {[4, 5, 6, 7, 8, 10].map(mins => (
              <button key={mins} onClick={() => handleSetTime(mins)} className={`py-5 rounded-2xl font-black text-xl transition-all ${matchTime === mins * 60 ? 'bg-blue-600 text-white scale-110 shadow-xl' : themeClasses.menuBtn}`}>{mins}m</button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        <FighterCard num={1} data={fighter1} isGreenBelt={true} />
        <FighterCard num={2} data={fighter2} isGreenBelt={false} />
      </div>

    </div>
  );
};

export default App;