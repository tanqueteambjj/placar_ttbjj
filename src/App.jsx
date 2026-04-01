import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus, Sun, Moon, Printer, UserPlus, X, Trophy, LogOut, ListOrdered, Trash2, ChevronLeft, LogIn } from 'lucide-react';

// === CONFIGURAÇÃO DO FIREBASE ===
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWlrrfNn6q4GhhL2H7goHjQMd3MsprxOE",
  authDomain: "tanqueteambjj.firebaseapp.com",
  projectId: "tanqueteambjj",
  storageBucket: "tanqueteambjj.firebasestorage.app",
  messagingSenderId: "410605992451",
  appId: "1:410605992451:web:f0f341f4594fe75f376c36",
  measurementId: "G-SW8PP8X7WM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// === COMPONENTES DA INTERFACE ===

// 1. Componente do Lutador (Placar)
const FighterCard = ({ num, data, setFighter, updateScore, isGreenBelt, isDarkMode, themeClasses }) => {
  const bgHeaderColor = isGreenBelt ? 'bg-green-600' : themeClasses.header2Bg;

  return (
    <div className={`flex-1 flex flex-col border-2 rounded-2xl overflow-hidden m-2 shadow-2xl transition-all duration-300 relative ${themeClasses.cardBg}`}>
      {data.penalties >= 4 && (
        <div className="absolute inset-0 z-50 bg-red-600/95 flex flex-col items-center justify-center backdrop-blur-sm print:hidden">
          <span className="text-white text-[8rem] font-black tracking-tighter leading-none mb-2 drop-shadow-2xl">DQ</span>
          <span className="text-white text-3xl font-bold tracking-widest mb-8 drop-shadow-lg">DESCLASSIFICADO</span>
          <button onClick={() => updateScore('penalties', -1)} className="bg-black/40 text-white px-8 py-4 rounded-full font-black text-xl hover:bg-black/60 transition-all active:scale-95 border-2 border-white/20">
            DESFAZER PUNIÇÃO
          </button>
        </div>
      )}

      <div className={`${bgHeaderColor} p-4 text-center relative flex flex-col justify-center gap-1 min-h-[140px]`}>
        <input type="text" value={data.name} onChange={(e) => setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }))} className="bg-transparent text-white text-3xl md:text-5xl font-black text-center w-full focus:outline-none focus:bg-white/10 rounded px-2" placeholder="NOME DO LUTADOR" />
        <input type="text" value={data.team} onChange={(e) => setFighter(prev => ({ ...prev, team: e.target.value.toUpperCase() }))} placeholder="NOME DA EQUIPE" className="bg-transparent text-white/90 text-xl md:text-2xl font-bold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2 placeholder:text-white/20" />
        {isGreenBelt && <div className="absolute top-0 right-0 bottom-0 w-4 bg-yellow-400"></div>}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <span className={`text-xl font-bold uppercase tracking-[0.2em] mb-1 ${themeClasses.labelColor}`}>Pontos</span>
        <div className={`text-[12rem] md:text-[15rem] leading-none font-black tabular-nums tracking-tighter ${themeClasses.pointsColor}`}>{data.points}</div>
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

// 2. Tela de Login
const LoginScreen = ({ onLoginSuccess, onGuestLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("Erro no Google Login. Verifique domínios autorizados no Firebase.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        
        <div className="text-center mb-8">
          <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-24 w-auto mx-auto mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Tanque Team BJJ</h1>
          <p className="text-zinc-400 font-medium tracking-widest text-sm mt-1 uppercase">Acesso ao Sistema</p>
        </div>

        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-zinc-500 border-b border-zinc-800 w-1/4"></span>
          <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Ou</span>
          <span className="text-zinc-500 border-b border-zinc-800 w-1/4"></span>
        </div>

        <button onClick={handleGoogleLogin} className="w-full mt-6 bg-white hover:bg-gray-100 text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>

        <div className="mt-8 flex flex-col gap-3">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            {isRegistering ? 'Já tenho conta. Fazer Login' : 'Não tem conta? Registre-se'}
          </button>
          
          <button onClick={onGuestLogin} className="text-zinc-600 hover:text-zinc-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4">
            <LogIn size={14} /> Entrar sem Cadastro (Teste)
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Tela de Fila / Lutas (Dashboard)
const QueueScreen = ({ queue, setQueue, onStartFight, onLogout, user }) => {
  const [newFight, setNewFight] = useState({ category: '', f1Name: '', f1Team: '', f2Name: '', f2Team: '' });

  const handleAddFight = (e) => {
    e.preventDefault();
    if (queue.length >= 10) return alert("Limite de 10 lutas atingido na fila.");
    
    setQueue([...queue, { ...newFight, id: Date.now(), status: 'pending' }]);
    setNewFight({ category: '', f1Name: '', f1Team: '', f2Name: '', f2Team: '' }); // Reset
  };

  const removeFight = (id) => setQueue(queue.filter(f => f.id !== id));

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-16 w-auto drop-shadow-lg" />
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">Painel de Lutas</h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{user?.email || 'Convidado'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 p-3 rounded-xl transition-all flex items-center gap-2 text-red-500 font-bold">
          <LogOut size={20} /> <span className="hidden md:inline">Sair</span>
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Adição */}
        <div className="lg:col-span-1 bg-zinc-900 p-6 rounded-3xl border border-zinc-800 h-fit">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-blue-500">
            <Plus size={24}/> Adicionar Luta ({queue.length}/10)
          </h2>
          
          <form onSubmit={handleAddFight} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Categoria / Peso / Faixa</label>
              <input required value={newFight.category} onChange={e => setNewFight({...newFight, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase" placeholder="Ex: ADULTO AZUL" />
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-green-600 space-y-3">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest">Lutador 1 (Verde)</span>
              <input required value={newFight.f1Name} onChange={e => setNewFight({...newFight, f1Name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="Nome" />
              <input required value={newFight.f1Team} onChange={e => setNewFight({...newFight, f1Team: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="Equipe" />
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-zinc-600 space-y-3">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Lutador 2 (Branco)</span>
              <input required value={newFight.f2Name} onChange={e => setNewFight({...newFight, f2Name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="Nome" />
              <input required value={newFight.f2Team} onChange={e => setNewFight({...newFight, f2Team: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="Equipe" />
            </div>

            <button disabled={queue.length >= 10} type="submit" className="w-full bg-blue-600 disabled:bg-zinc-800 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-4">
              Salvar na Fila
            </button>
          </form>
        </div>

        {/* Fila de Lutas */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-zinc-300">
            <ListOrdered size={24}/> Lutas Programadas
          </h2>
          
          {queue.length === 0 ? (
            <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl p-12 text-center text-zinc-500 font-medium">
              Nenhuma luta adicionada ainda.<br/>Use o painel ao lado para preparar o evento.
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((fight, index) => (
                <div key={fight.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg hover:border-zinc-700 transition-colors">
                  <div className="bg-zinc-950 text-zinc-600 font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 w-full text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                    <div className="md:col-span-3 pb-2 border-b border-zinc-800/50 mb-1">
                      <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{fight.category}</span>
                    </div>
                    
                    <div className="text-right pr-4 border-r-0 md:border-r border-zinc-800">
                      <p className="font-black text-lg text-white uppercase truncate">{fight.f1Name}</p>
                      <p className="text-xs text-zinc-500 font-bold uppercase truncate">{fight.f1Team}</p>
                    </div>
                    
                    <div className="text-center font-black text-zinc-700 italic">VS</div>
                    
                    <div className="text-left pl-0 md:pl-4">
                      <p className="font-black text-lg text-white uppercase truncate">{fight.f2Name}</p>
                      <p className="text-xs text-zinc-500 font-bold uppercase truncate">{fight.f2Team}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <button onClick={() => removeFight(fight.id)} className="p-4 bg-zinc-950 hover:bg-red-900/40 text-red-500 rounded-xl transition-colors shrink-0">
                      <Trash2 size={20} />
                    </button>
                    <button onClick={() => onStartFight(fight)} className="flex-1 md:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                      <Play size={20} fill="currentColor" /> Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// 4. Ecrã Principal do Placar (Atualizado para receber dados)
const ScoreboardScreen = ({ initialFightData, onBackToQueue }) => {
  const [matchTime, setMatchTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [category, setCategory] = useState(initialFightData?.category || '');

  // Inicializa com dados da fila ou vazio
  const initialFighter1 = { name: initialFightData?.f1Name || 'LUTADOR 1', team: initialFightData?.f1Team || 'EQUIPE', points: 0, advantages: 0, penalties: 0 };
  const initialFighter2 = { name: initialFightData?.f2Name || 'LUTADOR 2', team: initialFightData?.f2Team || 'EQUIPE', points: 0, advantages: 0, penalties: 0 };
  
  const [fighter1, setFighter1] = useState(initialFighter1);
  const [fighter2, setFighter2] = useState(initialFighter2);

  // Reinicia os estados se a luta inicial mudar
  useEffect(() => {
    if(initialFightData) {
      setCategory(initialFightData.category);
      setFighter1({ ...initialFighter1, name: initialFightData.f1Name, team: initialFightData.f1Team });
      setFighter2({ ...initialFighter2, name: initialFightData.f2Name, team: initialFightData.f2Team });
      setTimeLeft(matchTime);
      setIsRunning(false);
    }
  }, [initialFightData]);

  // Lógica de Pontuação e Punições IBJJF
  const updateFighterScore = useCallback((fighterNum, type, value) => {
    const isF1 = fighterNum === 1;
    const setFighter = isF1 ? setFighter1 : setFighter2;
    const setOpponent = isF1 ? setFighter2 : setFighter1;

    setFighter(prev => {
      const newValue = Math.max(0, prev[type] + value);
      
      if (type === 'penalties') {
        if (value > 0) {
          if (newValue === 2) setOpponent(opp => ({ ...opp, advantages: opp.advantages + 1 }));
          else if (newValue === 3) setOpponent(opp => ({ ...opp, points: opp.points + 2 }));
        } else if (value < 0) {
          if (prev.penalties === 2) setOpponent(opp => ({ ...opp, advantages: Math.max(0, opp.advantages - 1) }));
          else if (prev.penalties === 3) setOpponent(opp => ({ ...opp, points: Math.max(0, opp.points - 2) }));
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
    setFighter1({ ...initialFighter1, points: 0, advantages: 0, penalties: 0 });
    setFighter2({ ...initialFighter2, points: 0, advantages: 0, penalties: 0 });
    setShowResetModal(false);
  }, [matchTime, initialFighter1, initialFighter2]);

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
      
      {/* Relatório de Impressão (Oculto em tela) */}
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

        <div className="flex-1 space-y-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
             <Trophy size={400} />
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
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

        <div className="mt-auto pt-20 pb-4 flex justify-between items-end">
          <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Assinatura Árbitro</div>
          <div className="text-center italic font-bold text-zinc-400 text-[10px]">Tanque Team BJJ - Competição</div>
          <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Responsável Mesa</div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen print:hidden">
        
        {/* Navbar */}
        <div className={`border-b p-6 flex items-center justify-between shadow-2xl relative z-10 ${themeClasses.navBg}`}>
          
          <div className="hidden xl:flex items-center gap-5">
            <button onClick={onBackToQueue} className={`p-4 rounded-xl flex items-center gap-2 font-black tracking-widest text-xs uppercase transition-all shadow-md hover:scale-105 ${themeClasses.btnBg}`}>
              <ChevronLeft size={18} /> Voltar à Fila
            </button>
            <div className="flex flex-col ml-4">
              <span className="text-blue-500 font-black text-sm uppercase tracking-widest">Categoria Atual</span>
              <input type="text" placeholder="CATEGORIA" value={category} onChange={(e) => setCategory(e.target.value.toUpperCase())} className="text-2xl bg-transparent focus:outline-none border-b-2 border-transparent focus:border-blue-600 uppercase font-black w-full" />
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

        {/* Menu Settings Overlay */}
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

        {/* Modal de Reset */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className={`max-w-lg w-full p-10 rounded-[2.5rem] shadow-2xl text-center border-2 ${themeClasses.menuBg}`}>
              <div className="flex justify-center mb-6"><RotateCcw size={64} className="text-red-500" /></div>
              <h2 className="text-4xl font-black mb-4 tracking-tighter">ZERAR TUDO?</h2>
              <div className="flex flex-col gap-4">
                <button onClick={() => { window.print(); executeReset(); onBackToQueue(); }} className="w-full py-5 rounded-2xl font-black text-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-3"><Printer size={28} /> IMPRIMIR E VOLTAR À FILA</button>
                <div className="flex gap-4">
                  <button onClick={() => setShowResetModal(false)} className={`flex-1 py-5 rounded-2xl font-bold text-xl ${themeClasses.menuBtn}`}>CANCELAR</button>
                  <button onClick={executeReset} className="flex-1 py-5 rounded-2xl font-bold text-xl bg-zinc-600 hover:bg-zinc-500 text-white">APENAS ZERAR</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          <FighterCard num={1} data={fighter1} setFighter={setFighter1} updateScore={(type, val) => updateFighterScore(1, type, val)} isGreenBelt={true} isDarkMode={isDarkMode} themeClasses={themeClasses} />
          <FighterCard num={2} data={fighter2} setFighter={setFighter2} updateScore={(type, val) => updateFighterScore(2, type, val)} isGreenBelt={false} isDarkMode={isDarkMode} themeClasses={themeClasses} />
        </div>
      </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL (Roteador de Telas) ===
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'queue' | 'scoreboard'
  const [queue, setQueue] = useState([]);
  const [activeFight, setActiveFight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentView === 'login') {
        setCurrentView('queue');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [currentView]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentView('login');
  };

  const startFight = (fightData) => {
    setActiveFight(fightData);
    setCurrentView('scoreboard');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black text-2xl tracking-widest uppercase">Carregando...</div>;
  }

  return (
    <>
      {currentView === 'login' && (
        <LoginScreen 
          onGuestLogin={() => { setUser({ email: 'Convidado Teste' }); setCurrentView('queue'); }} 
        />
      )}
      
      {currentView === 'queue' && (
        <QueueScreen 
          user={user}
          queue={queue} 
          setQueue={setQueue} 
          onStartFight={startFight} 
          onLogout={handleLogout} 
        />
      )}
      
      {currentView === 'scoreboard' && (
        <ScoreboardScreen 
          initialFightData={activeFight} 
          onBackToQueue={() => setCurrentView('queue')} 
        />
      )}
    </>
  );
}