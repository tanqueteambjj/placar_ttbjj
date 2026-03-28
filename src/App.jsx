import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus, Sun, Moon, Printer, UserPlus, X, Trophy } from 'lucide-react';

// Componente do Lutador
const FighterCard = ({ num, data, setFighter, updateScore, isGreenBelt, isDarkMode, themeClasses }) => {
  const bgHeaderColor = isGreenBelt ? 'bg-green-600' : themeClasses.header2Bg;

  return (
    <div className={`flex-1 flex flex-col border-2 rounded-2xl overflow-hidden m-2 shadow-2xl transition-all duration-300 relative ${themeClasses.cardBg}`}>
      
      {/* Overlay de Desclassificação (DQ) */}
      {data.penalties >= 4 && (
        <div className="absolute inset-0 z-50 bg-red-600/95 flex flex-col items-center justify-center backdrop-blur-sm print:hidden">
          <span className="text-white text-[8rem] font-black tracking-tighter leading-none mb-2 drop-shadow-2xl">DQ</span>
          <span className="text-white text-3xl font-bold tracking-widest mb-8 drop-shadow-lg">DESCLASSIFICADO</span>
          <button 
            onClick={() => updateScore('penalties', -1)} 
            className="bg-black/40 text-white px-8 py-4 rounded-full font-black text-xl hover:bg-black/60 transition-all active:scale-95 border-2 border-white/20"
          >
            DESFAZER PUNIÇÃO
          </button>
        </div>
      )}

      <div className={`${bgHeaderColor} p-4 text-center relative flex flex-col justify-center gap-1 min-h-[140px]`}>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
          className="bg-transparent text-white text-3xl md:text-5xl font-black text-center w-full focus:outline-none focus:bg-white/10 rounded px-2"
          placeholder="NOME DO LUTADOR"
        />
        <input
          type="text"
          value={data.team}
          onChange={(e) => setFighter(prev => ({ ...prev, team: e.target.value.toUpperCase() }))}
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
        
        <div className="flex gap-2 mt-4 w-full justify-center print:hidden">
           {[2, 3, 4].map(val => (
             <button key={val} onClick={() => updateScore('points', val)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnBg}`}>+{val}</button>
           ))}
           <button onClick={() => updateScore('points', -1)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnRedBg}`}>-1</button>
        </div>
      </div>

      <div className={`flex border-t h-44 ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className={`flex-1 flex flex-col border-r ${themeClasses.advPenBg}`}>
          <div className="bg-yellow-500 text-black text-center py-2 font-black uppercase tracking-widest text-xs">Vantagens</div>
          <div className="flex-1 flex items-center justify-between px-6">
            <button onClick={() => updateScore('advantages', -1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Minus size={28} /></button>
            <span className="text-7xl font-black text-yellow-500 tabular-nums">{data.advantages}</span>
            <button onClick={() => updateScore('advantages', 1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Plus size={28} /></button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${themeClasses.advPenBg}`}>
          <div className="bg-red-600 text-white text-center py-2 font-black uppercase tracking-widest text-xs">Punições</div>
          <div className="flex-1 flex items-center justify-between px-6">
            <button onClick={() => updateScore('penalties', -1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Minus size={28} /></button>
            <span className="text-7xl font-black text-red-500 tabular-nums">{data.penalties}</span>
            <button onClick={() => updateScore('penalties', 1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn}`}><Plus size={28} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [matchTime, setMatchTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [category, setCategory] = useState('');

  const initialFighterState = { name: '', team: '', points: 0, advantages: 0, penalties: 0 };
  const [fighter1, setFighter1] = useState({ ...initialFighterState, name: 'LUTADOR 1' });
  const [fighter2, setFighter2] = useState({ ...initialFighterState, name: 'LUTADOR 2' });

  // Nova Lógica de Pontuação Centralizada (Com automação de punições)
  const updateFighterScore = useCallback((fighterNum, type, value) => {
    const isF1 = fighterNum === 1;
    const setFighter = isF1 ? setFighter1 : setFighter2;
    const setOpponent = isF1 ? setFighter2 : setFighter1;

    setFighter(prev => {
      const newValue = Math.max(0, prev[type] + value);
      
      // Regras automáticas de punição da IBJJF
      if (type === 'penalties') {
        if (value > 0) {
          // Adicionando punição
          if (newValue === 2) {
            // 2ª Punição = Vantagem para o oponente
            setOpponent(opp => ({ ...opp, advantages: opp.advantages + 1 }));
          } else if (newValue === 3) {
            // 3ª Punição = 2 Pontos para o oponente
            setOpponent(opp => ({ ...opp, points: opp.points + 2 }));
          }
          // A 4ª punição altera o estado local para 4, ativando a tela de DQ (Desclassificação)
        } else if (value < 0) {
          // Removendo punição (Desfazendo em caso de erro)
          if (prev.penalties === 2) {
            // Remove a vantagem que foi dada ao oponente
            setOpponent(opp => ({ ...opp, advantages: Math.max(0, opp.advantages - 1) }));
          } else if (prev.penalties === 3) {
            // Remove os 2 pontos que foram dados ao oponente
            setOpponent(opp => ({ ...opp, points: Math.max(0, opp.points - 2) }));
          }
        }
      }

      return { ...prev, [type]: newValue };
    });
  }, []);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
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
    setCategory('');
    setShowResetModal(false);
  }, [matchTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

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
    menuBtn: isDarkMode ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    inputBg: isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900',
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none transition-colors duration-500 ${themeClasses.appBg}`}>
      
      {/* Relatório de Impressão (Otimizado para 1 página e com Assinaturas no Rodapé) */}
      <div className="hidden print:flex flex-col p-4 text-black bg-white min-h-screen border-[8px] border-double border-zinc-300">
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
          <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-20 w-auto" />
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tighter mb-0">BOLETIM DE LUTA</h1>
            <p className="text-lg font-bold text-zinc-600">TANQUE TEAM BJJ</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-50 p-3 border-l-4 border-black">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">CATEGORIA</p>
            <p className="text-xl font-black">{category || 'GERAL / ABSOLUTO'}</p>
          </div>
          <div className="bg-zinc-50 p-3 border-r-4 border-black text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">DURAÇÃO</p>
            <p className="text-xl font-black">{matchTime / 60} MINUTOS</p>
          </div>
        </div>

        {/* Esta div com flex-1 empurra o rodapé para o fim da página */}
        <div className="flex-1 space-y-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
             <Trophy size={400} />
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            {/* Lutador 1 */}
            <div className="border-2 border-black p-4 rounded-2xl bg-white shadow-sm">
              <div className="border-b-2 border-green-600 mb-4 pb-1">
                <h2 className="text-2xl font-black leading-none">{fighter1.name || 'LUTADOR 1'}</h2>
                <p className="text-base font-bold text-zinc-500 mt-1 uppercase">{fighter1.team || 'EQUIPE'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end border-b border-zinc-100 pb-1">
                  <span className="text-sm font-bold text-zinc-400">PONTOS</span>
                  <span className="text-6xl font-black leading-none">{fighter1.points}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>VANTAGENS</span>
                  <span>{fighter1.advantages}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-red-600">
                  <span>PUNIÇÕES</span>
                  <span>{fighter1.penalties}</span>
                </div>
              </div>
              {fighter1.penalties >= 4 && <div className="mt-4 bg-red-600 text-white font-black text-center py-2 uppercase tracking-widest text-sm rounded">Desclassificado (DQ)</div>}
            </div>

            {/* Lutador 2 */}
            <div className="border-2 border-black p-4 rounded-2xl bg-white shadow-sm text-right">
              <div className="border-b-2 border-zinc-800 mb-4 pb-1">
                <h2 className="text-2xl font-black leading-none">{fighter2.name || 'LUTADOR 2'}</h2>
                <p className="text-base font-bold text-zinc-500 mt-1 uppercase">{fighter2.team || 'EQUIPE'}</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end border-b border-zinc-100 pb-1 flex-row-reverse">
                  <span className="text-sm font-bold text-zinc-400">PONTOS</span>
                  <span className="text-6xl font-black leading-none">{fighter2.points}</span>
                </div>
                <div className="flex justify-between text-lg font-bold flex-row-reverse">
                  <span>VANTAGENS</span>
                  <span>{fighter2.advantages}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-red-600 flex-row-reverse">
                  <span>PUNIÇÕES</span>
                  <span>{fighter2.penalties}</span>
                </div>
              </div>
              {fighter2.penalties >= 4 && <div className="mt-4 bg-red-600 text-white font-black text-center py-2 uppercase tracking-widest text-sm rounded">Desclassificado (DQ)</div>}
            </div>
          </div>
        </div>

        {/* Rodapé fixado em baixo com mt-auto */}
        <div className="mt-auto pt-20 pb-4 flex justify-between items-end">
          <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Assinatura Árbitro</div>
          <div className="text-center italic font-bold text-zinc-400 text-[10px]">
            Tanque Team BJJ - Sistema Oficial de Competição
          </div>
          <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Responsável Mesa</div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen print:hidden">
        {/* Modal Configuração */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className={`max-w-2xl w-full p-8 rounded-[2.5rem] shadow-2xl border-2 ${themeClasses.menuBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black tracking-tighter">CONFIGURAR COMBATE</h2>
                <button onClick={() => setShowConfigModal(false)} className="p-2 hover:bg-red-500/20 rounded-full transition-colors"><X size={32}/></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold opacity-50 mb-2 uppercase tracking-widest text-center">Categoria / Peso / Faixa</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value.toUpperCase())} placeholder="Ex: PESO LEVE - FAIXA AZUL" className={`w-full p-4 rounded-xl font-bold text-xl text-center outline-none ${themeClasses.inputBg}`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-green-500 font-black tracking-widest uppercase text-xs text-center">Lutador 1 (Verde)</h3>
                    <input type="text" placeholder="Nome" value={fighter1.name} onChange={(e) => setFighter1(prev => ({...prev, name: e.target.value.toUpperCase()}))} className={`w-full p-3 rounded-lg font-bold ${themeClasses.inputBg}`} />
                    <input type="text" placeholder="Equipe" value={fighter1.team} onChange={(e) => setFighter1(prev => ({...prev, team: e.target.value.toUpperCase()}))} className={`w-full p-3 rounded-lg font-bold ${themeClasses.inputBg}`} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-zinc-500 font-black tracking-widest uppercase text-xs text-center">Lutador 2</h3>
                    <input type="text" placeholder="Nome" value={fighter2.name} onChange={(e) => setFighter2(prev => ({...prev, name: e.target.value.toUpperCase()}))} className={`w-full p-3 rounded-lg font-bold ${themeClasses.inputBg}`} />
                    <input type="text" placeholder="Equipe" value={fighter2.team} onChange={(e) => setFighter2(prev => ({...prev, team: e.target.value.toUpperCase()}))} className={`w-full p-3 rounded-lg font-bold ${themeClasses.inputBg}`} />
                  </div>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl rounded-2xl transition-all shadow-xl active:scale-95">SALVAR E FECHAR</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Reset */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className={`max-w-lg w-full p-10 rounded-[2.5rem] shadow-2xl text-center border-2 ${themeClasses.menuBg}`}>
              <div className="flex justify-center mb-6">
                <RotateCcw size={64} className="text-red-500" />
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">ZERAR TUDO?</h2>
              <p className={`mb-10 text-xl font-medium ${isDarkMode ? 'text-zinc-300' : 'text-gray-600'}`}>Deseja imprimir o resultado antes de limpar o placar?</p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => { window.print(); executeReset(); }} 
                  className="w-full py-5 rounded-2xl font-black text-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Printer size={28} /> IMPRIMIR E ZERAR
                </button>
                
                <div className="flex gap-4">
                  <button onClick={() => setShowResetModal(false)} className={`flex-1 py-5 rounded-2xl font-bold text-xl ${themeClasses.menuBtn}`}>CANCELAR</button>
                  <button onClick={executeReset} className="flex-1 py-5 rounded-2xl font-bold text-xl bg-zinc-600 hover:bg-zinc-500 text-white shadow-xl">APENAS ZERAR</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navbar */}
        <div className={`border-b p-6 flex items-center justify-between shadow-2xl relative z-10 ${themeClasses.navBg}`}>
          <div className="hidden xl:flex items-center gap-5 font-black text-2xl tracking-tighter uppercase italic">
            <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-24 w-auto object-contain drop-shadow-2xl" />
            <div className="flex flex-col leading-none w-96">
              <span className="text-blue-600 text-3xl">Tanque Team</span>
              <input type="text" placeholder="CATEGORIA" value={category} onChange={(e) => setCategory(e.target.value.toUpperCase())} className="text-lg tracking-wider opacity-80 bg-transparent focus:outline-none border-b-2 border-transparent focus:border-blue-600 uppercase font-black w-full" />
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center gap-10 md:gap-20">
            <div className={`text-9xl md:text-[15rem] leading-none font-black tabular-nums tracking-tighter ${timeLeft === 0 ? 'text-red-500 animate-pulse' : themeClasses.pointsColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={toggleTimer} className={`p-7 rounded-full shadow-2xl transition-all active:scale-90 ${isRunning ? 'bg-amber-500 text-black' : 'bg-green-500 text-black'}`}>
                {isRunning ? <Pause size={52} fill="currentColor" /> : <Play size={52} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={() => setShowResetModal(true)} className={`p-6 rounded-full shadow-xl transition-all active:scale-90 ${themeClasses.circleBtn}`}><RotateCcw size={32} /></button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowConfigModal(true)} className={`p-6 rounded-full shadow-lg border-2 border-blue-600/30 ${themeClasses.circleBtn} text-blue-500`}><UserPlus size={32} /></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-6 rounded-full shadow-lg ${themeClasses.circleBtn}`}>{isDarkMode ? <Sun size={32} /> : <Moon size={32} />}</button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-6 rounded-full shadow-lg ${themeClasses.circleBtn}`}><Settings size={32} /></button>
          </div>
        </div>

        {/* Menu Settings */}
        {showSettings && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowSettings(false)}></div>
            <div className={`absolute top-36 right-8 border-2 p-10 rounded-[2.5rem] shadow-2xl z-20 w-96 ${themeClasses.menuBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-sm opacity-60">Configurações</h3>
                <button onClick={() => setShowSettings(false)} className="opacity-40 hover:opacity-100 transition-opacity"><X size={24}/></button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[4, 5, 6, 7, 8, 10].map(mins => (
                  <button key={mins} onClick={() => { setMatchTime(mins * 60); setTimeLeft(mins * 60); setShowSettings(false); }} className={`py-5 rounded-2xl font-black text-xl transition-all ${matchTime === mins * 60 ? 'bg-blue-600 text-white scale-110 shadow-xl' : themeClasses.menuBtn}`}>{mins}m</button>
                ))}
              </div>
              <button onClick={() => { window.print(); setShowSettings(false); }} className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all ${themeClasses.menuBtn} hover:bg-blue-600 hover:text-white`}>
                <Printer size={28} /> IMPRIMIR RESULTADO
              </button>
            </div>
          </>
        )}

        <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          <FighterCard 
            num={1} 
            data={fighter1} 
            setFighter={setFighter1} 
            updateScore={(type, val) => updateFighterScore(1, type, val)} 
            isGreenBelt={true} 
            isDarkMode={isDarkMode} 
            themeClasses={themeClasses} 
          />
          <FighterCard 
            num={2} 
            data={fighter2} 
            setFighter={setFighter2} 
            updateScore={(type, val) => updateFighterScore(2, type, val)} 
            isGreenBelt={false} 
            isDarkMode={isDarkMode} 
            themeClasses={themeClasses} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;