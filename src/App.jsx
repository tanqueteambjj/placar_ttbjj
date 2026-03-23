import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus } from 'lucide-react';

const App = () => {
  // Configurações Iniciais
  const [matchTime, setMatchTime] = useState(300); // 5 minutos padrão
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Estados dos Lutadores
  const initialFighterState = {
    name: 'LUTADOR',
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
  
  const resetMatch = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(matchTime);
    setFighter1({ ...initialFighterState, name: fighter1.name });
    setFighter2({ ...initialFighterState, name: fighter2.name });
  }, [matchTime, fighter1.name, fighter2.name]);

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
      [type]: Math.max(0, prev[type] + value) // Evita pontuações negativas
    }));
  };

  // Componente do Lutador
  const FighterCard = ({ num, data, isGreenBelt }) => {
    const bgHeaderColor = isGreenBelt ? 'bg-green-600' : 'bg-neutral-800';
    
    return (
      <div className="flex-1 flex flex-col bg-neutral-900 border-2 border-neutral-800 rounded-2xl overflow-hidden m-2 shadow-2xl">
        {/* Cabeçalho do Lutador */}
        <div className={`${bgHeaderColor} p-4 text-center relative`}>
          <input
            type="text"
            value={data.name}
            onChange={(e) => {
              const setFighter = num === 1 ? setFighter1 : setFighter2;
              setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }));
            }}
            className="bg-transparent text-white text-3xl md:text-5xl font-bold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2"
          />
          {isGreenBelt && (
             <div className="absolute top-0 right-0 bottom-0 w-4 bg-yellow-400"></div> // Detalhe da faixa verde/amarela
          )}
        </div>

        {/* Pontuação Principal */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <span className="text-neutral-400 text-xl font-semibold uppercase tracking-widest mb-2">Pontos</span>
          <div className="text-[12rem] leading-none font-black text-white tabular-nums tracking-tighter">
            {data.points}
          </div>
          
          {/* Botões de Pontos */}
          <div className="flex gap-2 mt-8 w-full justify-center">
             <button onClick={() => updateScore(num, 'points', 2)} className="flex-1 max-w-[80px] py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xl transition-colors">+2</button>
             <button onClick={() => updateScore(num, 'points', 3)} className="flex-1 max-w-[80px] py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xl transition-colors">+3</button>
             <button onClick={() => updateScore(num, 'points', 4)} className="flex-1 max-w-[80px] py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xl transition-colors">+4</button>
             <button onClick={() => updateScore(num, 'points', -1)} className="flex-1 max-w-[80px] py-3 bg-red-900/50 hover:bg-red-800/80 text-red-200 font-bold rounded-lg text-xl transition-colors">-1</button>
          </div>
        </div>

        {/* Vantagens e Punições */}
        <div className="flex border-t border-neutral-800 h-48">
          {/* Vantagens */}
          <div className="flex-1 flex flex-col border-r border-neutral-800 bg-neutral-800/30">
            <div className="bg-yellow-500 text-black text-center py-2 font-bold uppercase tracking-wider">Vantagens</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'advantages', -1)} className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95 transition-transform">
                <Minus size={32} />
              </button>
              <span className="text-6xl font-bold text-yellow-500 tabular-nums">{data.advantages}</span>
              <button onClick={() => updateScore(num, 'advantages', 1)} className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95 transition-transform">
                <Plus size={32} />
              </button>
            </div>
          </div>

          {/* Punições */}
          <div className="flex-1 flex flex-col bg-neutral-800/30">
            <div className="bg-red-600 text-white text-center py-2 font-bold uppercase tracking-wider">Punições</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'penalties', -1)} className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95 transition-transform">
                <Minus size={32} />
              </button>
              <span className="text-6xl font-bold text-red-500 tabular-nums">{data.penalties}</span>
              <button onClick={() => updateScore(num, 'penalties', 1)} className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white active:scale-95 transition-transform">
                <Plus size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      {/* Barra Superior / Cronómetro */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between shadow-lg relative z-10">
        
        {/* Logotipo ou Título */}
        <div className="hidden md:flex items-center gap-4 text-white font-bold text-xl tracking-widest uppercase">
          <img 
            src="https://iili.io/qC543c7.png" 
            alt="Logo Tanque Team BJJ" 
            className="h-14 w-auto object-contain drop-shadow-md"
          />
          <span className="mt-1">Tanque Team BJJ</span>
        </div>

        {/* Zona Central: Tempo */}
        <div className="flex-1 flex justify-center items-center gap-6">
          <div className={`text-7xl md:text-8xl font-black tabular-nums tracking-tight ${timeLeft === 0 ? 'text-red-500' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={toggleTimer}
              className={`p-4 rounded-full flex items-center justify-center transition-colors ${
                isRunning ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'
              }`}
            >
              {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={resetMatch}
              className="p-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              title="Reiniciar Luta"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        {/* Configurações */}
        <div className="hidden md:block">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
          >
            <Settings size={28} />
          </button>
        </div>
      </div>

      {/* Menu de Configurações (Dropdown) */}
      {showSettings && (
        <div className="absolute top-24 right-4 bg-neutral-800 border border-neutral-700 p-4 rounded-xl shadow-2xl z-20 w-64">
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Tempo de Luta</h3>
          <div className="grid grid-cols-2 gap-2">
            {[5, 6, 7, 10].map(mins => (
              <button 
                key={mins}
                onClick={() => handleSetTime(mins)}
                className={`py-2 rounded-lg font-bold ${matchTime === mins * 60 ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'}`}
              >
                {mins} Min
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Área Principal dos Lutadores */}
      <div className="flex-1 flex flex-col lg:flex-row p-2 bg-black gap-2">
        <FighterCard num={1} data={fighter1} isGreenBelt={true} />
        <FighterCard num={2} data={fighter2} isGreenBelt={false} />
      </div>

    </div>
  );
};

export default App;