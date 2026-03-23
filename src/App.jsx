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
      [type]: Math.max(0, prev[type] + value) // Evita pontuações negativas
    }));
  };

  // Classes Dinâmicas de Estilo (Modo Claro vs Escuro)
  const themeClasses = {
    appBg: isDarkMode ? 'bg-black text-white' : 'bg-gray-200 text-gray-900',
    navBg: isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-300',
    cardBg: isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-300',
    header2Bg: isDarkMode ? 'bg-neutral-800' : 'bg-gray-800', // O lutador 2 sempre terá cabeçalho escuro para contraste da fonte
    pointsColor: isDarkMode ? 'text-white' : 'text-gray-900',
    labelColor: isDarkMode ? 'text-neutral-400' : 'text-gray-500',
    btnBg: isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    btnRedBg: isDarkMode ? 'bg-red-900/50 hover:bg-red-800/80 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700',
    advPenBg: isDarkMode ? 'bg-neutral-800/30 border-neutral-800' : 'bg-gray-50/50 border-gray-200',
    circleBtn: isDarkMode ? 'bg-neutral-800 hover:bg-neutral-700 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 shadow-sm',
    menuBg: isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-gray-300 text-gray-900',
    menuBtn: isDarkMode ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  };

  // Componente do Lutador
  const FighterCard = ({ num, data, isGreenBelt }) => {
    const bgHeaderColor = isGreenBelt ? 'bg-green-600' : themeClasses.header2Bg;
    
    return (
      <div className={`flex-1 flex flex-col border-2 rounded-2xl overflow-hidden m-2 shadow-2xl ${themeClasses.cardBg}`}>
        {/* Cabeçalho do Lutador */}
        <div className={`${bgHeaderColor} p-4 text-center relative flex flex-col justify-center gap-1`}>
          <input
            type="text"
            value={data.name}
            onChange={(e) => {
              const setFighter = num === 1 ? setFighter1 : setFighter2;
              setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }));
            }}
            className="bg-transparent text-white text-3xl md:text-5xl font-bold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2"
          />
          <input
            type="text"
            value={data.team}
            onChange={(e) => {
              const setFighter = num === 1 ? setFighter1 : setFighter2;
              setFighter(prev => ({ ...prev, team: e.target.value.toUpperCase() }));
            }}
            placeholder="NOME DA EQUIPE"
            className="bg-transparent text-white/90 text-lg md:text-2xl font-semibold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2 placeholder:text-white/50"
          />
          {isGreenBelt && (
             <div className="absolute top-0 right-0 bottom-0 w-4 bg-yellow-400"></div> // Detalhe da faixa verde/amarela
          )}
        </div>

        {/* Pontuação Principal */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <span className={`text-xl font-semibold uppercase tracking-widest mb-2 ${themeClasses.labelColor}`}>Pontos</span>
          <div className={`text-[12rem] leading-none font-black tabular-nums tracking-tighter ${themeClasses.pointsColor}`}>
            {data.points}
          </div>
          
          {/* Botões de Pontos */}
          <div className="flex gap-2 mt-8 w-full justify-center">
             <button onClick={() => updateScore(num, 'points', 2)} className={`flex-1 max-w-[80px] py-3 font-bold rounded-lg text-xl transition-colors ${themeClasses.btnBg}`}>+2</button>
             <button onClick={() => updateScore(num, 'points', 3)} className={`flex-1 max-w-[80px] py-3 font-bold rounded-lg text-xl transition-colors ${themeClasses.btnBg}`}>+3</button>
             <button onClick={() => updateScore(num, 'points', 4)} className={`flex-1 max-w-[80px] py-3 font-bold rounded-lg text-xl transition-colors ${themeClasses.btnBg}`}>+4</button>
             <button onClick={() => updateScore(num, 'points', -1)} className={`flex-1 max-w-[80px] py-3 font-bold rounded-lg text-xl transition-colors ${themeClasses.btnRedBg}`}>-1</button>
          </div>
        </div>

        {/* Vantagens e Punições */}
        <div className={`flex border-t h-48 ${isDarkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
          {/* Vantagens */}
          <div className={`flex-1 flex flex-col border-r ${themeClasses.advPenBg}`}>
            <div className="bg-yellow-500 text-black text-center py-2 font-bold uppercase tracking-wider">Vantagens</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'advantages', -1)} className={`p-4 rounded-full transition-transform active:scale-95 ${themeClasses.circleBtn}`}>
                <Minus size={32} />
              </button>
              <span className="text-6xl font-bold text-yellow-500 tabular-nums drop-shadow-sm">{data.advantages}</span>
              <button onClick={() => updateScore(num, 'advantages', 1)} className={`p-4 rounded-full transition-transform active:scale-95 ${themeClasses.circleBtn}`}>
                <Plus size={32} />
              </button>
            </div>
          </div>

          {/* Punições */}
          <div className={`flex-1 flex flex-col ${themeClasses.advPenBg.split(' ')[0]}`}>
            <div className="bg-red-600 text-white text-center py-2 font-bold uppercase tracking-wider">Punições</div>
            <div className="flex-1 flex items-center justify-between px-6">
              <button onClick={() => updateScore(num, 'penalties', -1)} className={`p-4 rounded-full transition-transform active:scale-95 ${themeClasses.circleBtn}`}>
                <Minus size={32} />
              </button>
              <span className="text-6xl font-bold text-red-500 tabular-nums drop-shadow-sm">{data.penalties}</span>
              <button onClick={() => updateScore(num, 'penalties', 1)} className={`p-4 rounded-full transition-transform active:scale-95 ${themeClasses.circleBtn}`}>
                <Plus size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none ${themeClasses.appBg}`}>
      
      {/* Modal de Confirmação para Zerar */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`max-w-md w-full p-8 rounded-3xl shadow-2xl text-center border ${themeClasses.menuBg}`}>
            <h2 className="text-3xl font-black mb-4">Zerar Placar?</h2>
            <p className={`mb-8 text-lg ${isDarkMode ? 'text-neutral-300' : 'text-gray-600'}`}>
              Tem a certeza que deseja repor o cronómetro, as pontuações e limpar os nomes das equipas?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowResetModal(false)}
                className={`flex-1 py-4 rounded-xl font-bold text-lg transition-colors ${themeClasses.menuBtn}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  executeReset();
                  setShowResetModal(false);
                }}
                className="flex-1 py-4 rounded-xl font-bold text-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-lg shadow-red-600/20"
              >
                Sim, Zerar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra Superior / Cronómetro */}
      <div className={`border-b p-4 flex items-center justify-between shadow-lg relative z-10 ${themeClasses.navBg}`}>
        
        {/* Logotipo ou Título */}
        <div className="hidden md:flex items-center gap-4 font-bold text-xl tracking-widest uppercase">
          <img 
            src="https://iili.io/qC543c7.png" 
            alt="Logo Tanque Team BJJ" 
            className="h-16 w-auto object-contain drop-shadow-md"
          />
          <span className="mt-1">Tanque Team BJJ</span>
        </div>

        {/* Zona Central: Tempo (Aumentado significativamente) */}
        <div className="flex-1 flex justify-center items-center gap-8">
          <div className={`text-[6rem] md:text-[10rem] leading-none font-black tabular-nums tracking-tighter drop-shadow-sm ${timeLeft === 0 ? 'text-red-500' : themeClasses.pointsColor}`}>
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={toggleTimer}
              className={`p-5 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg ${
                isRunning ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-green-500 hover:bg-green-400 text-black'
              }`}
            >
              {isRunning ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={() => setShowResetModal(true)}
              className={`p-5 rounded-full transition-all hover:scale-105 shadow-lg ${themeClasses.circleBtn}`}
              title="Zerar Luta"
            >
              <RotateCcw size={28} />
            </button>
          </div>
        </div>

        {/* Configurações e Tema */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-4 rounded-full transition-colors ${themeClasses.circleBtn}`}
            title="Alternar Modo Claro/Escuro"
          >
            {isDarkMode ? <Sun size={28} /> : <Moon size={28} />}
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-full transition-colors ${themeClasses.circleBtn}`}
            title="Configurações de Tempo"
          >
            <Settings size={28} />
          </button>
        </div>
      </div>

      {/* Menu de Configurações (Dropdown) */}
      {showSettings && (
        <div className={`absolute top-28 right-4 border p-5 rounded-2xl shadow-2xl z-20 w-80 ${themeClasses.menuBg}`}>
          <h3 className="font-bold mb-4 uppercase tracking-wider text-sm text-center">Definir Tempo de Luta</h3>
          <div className="grid grid-cols-3 gap-2">
            {[4, 5, 6, 7, 8, 9, 10].map(mins => (
              <button 
                key={mins}
                onClick={() => handleSetTime(mins)}
                className={`py-3 rounded-xl font-bold transition-colors ${
                  matchTime === mins * 60 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : themeClasses.menuBtn
                }`}
              >
                {mins} Min
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Área Principal dos Lutadores */}
      <div className="flex-1 flex flex-col lg:flex-row p-2 gap-2">
        <FighterCard num={1} data={fighter1} isGreenBelt={true} />
        <FighterCard num={2} data={fighter2} isGreenBelt={false} />
      </div>

    </div>
  );
};

export default App;