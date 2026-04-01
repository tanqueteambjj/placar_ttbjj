import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus, Sun, Moon, Printer, X, Trophy, LogOut, ListOrdered, Trash2, ChevronLeft, LogIn, Crown, Lock, ImagePlus, History, CreditCard, Calendar, Zap, Loader2, User, CheckCircle, QrCode } from 'lucide-react';

// === CONFIGURAÇÃO DO FIREBASE ===
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword
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

// === CONFIGURAÇÃO DE ADMINISTRADORES ===
const ADMIN_EMAILS = [
  "admin@tanqueteambjj.com", 
  "tanqueteambjj@gmail.com", 
  "cledson@tanqueteambjj.com" 
];

// === CONFIGURAÇÃO MERCADO PAGO ===
const MP_ACCESS_TOKEN = "APP_USR-1453261259159538-031413-5e6302200ef4532780a4d37d4f0975c3-3264813133";

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
        <input type="text" value={data.name} onChange={(e) => setFighter(prev => ({ ...prev, name: e.target.value.toUpperCase() }))} className="bg-transparent text-white text-3xl md:text-5xl font-black text-center w-full focus:outline-none focus:bg-white/10 rounded px-2 uppercase" placeholder="NOME DO LUTADOR" />
        <input type="text" value={data.team} onChange={(e) => setFighter(prev => ({ ...prev, team: e.target.value.toUpperCase() }))} placeholder="NOME DA EQUIPE" className="bg-transparent text-white/90 text-xl md:text-2xl font-bold text-center w-full focus:outline-none focus:bg-white/10 rounded px-2 placeholder:text-white/20 uppercase" />
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
const LoginScreen = ({ onGuestLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  // Requisitos de Senha Forte
  const passReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  };

  const isPasswordValid = passReqs.length && passReqs.upper && passReqs.lower && passReqs.number;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError("As senhas não coincidem.");
          return;
        }
        if (!isPasswordValid) {
          setError("A senha não cumpre todos os requisitos de segurança.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name.toUpperCase() });
        
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
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Nome / Academia</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 uppercase" placeholder="O SEU NOME" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="••••••••" />
            
            {/* Visualização de Requisitos da Senha em Tempo Real */}
            {isRegistering && (
              <div className="mt-3 p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Requisitos de Segurança:</p>
                <div className={`text-xs flex items-center gap-2 ${passReqs.length ? 'text-green-500' : 'text-zinc-500'}`}>
                  {passReqs.length ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border border-zinc-600 rounded-full" />} Mínimo 8 caracteres
                </div>
                <div className={`text-xs flex items-center gap-2 ${passReqs.upper ? 'text-green-500' : 'text-zinc-500'}`}>
                  {passReqs.upper ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border border-zinc-600 rounded-full" />} Pelo menos 1 Maiúscula
                </div>
                <div className={`text-xs flex items-center gap-2 ${passReqs.lower ? 'text-green-500' : 'text-zinc-500'}`}>
                  {passReqs.lower ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border border-zinc-600 rounded-full" />} Pelo menos 1 Minúscula
                </div>
                <div className={`text-xs flex items-center gap-2 ${passReqs.number ? 'text-green-500' : 'text-zinc-500'}`}>
                  {passReqs.number ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 border border-zinc-600 rounded-full" />} Pelo menos 1 Número
                </div>
              </div>
            )}
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Confirmar Senha</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="••••••••" />
            </div>
          )}

          <button type="submit" className={`w-full font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-2 ${isRegistering && !isPasswordValid ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`} disabled={isRegistering && !isPasswordValid}>
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-zinc-500 border-b border-zinc-800 w-1/4"></span>
          <span className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Ou</span>
          <span className="text-zinc-500 border-b border-zinc-800 w-1/4"></span>
        </div>

        <button onClick={handleGoogleLogin} className="w-full mt-6 bg-white hover:bg-gray-100 text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 uppercase tracking-widest">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>

        <div className="mt-8 flex flex-col gap-3">
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            {isRegistering ? 'Já tenho conta. Fazer Login' : 'Não tem conta? Registre-se'}
          </button>
          
          <button onClick={onGuestLogin} className="text-zinc-600 hover:text-zinc-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-4">
            <LogIn size={14} /> Entrar no Modo Gratuito
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Tela de Fila / Lutas (Dashboard)
const QueueScreen = ({ queue, setQueue, onStartFight, onLogout, user, isPremium, logoUrl, setLogoUrl, fightHistory }) => {
  const [activeTab, setActiveTab] = useState('fights'); 
  const [newFight, setNewFight] = useState({ category: '', f1Name: '', f1Team: '', f2Name: '', f2Team: '' });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Estados do Perfil
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  // Força abertura do Modal Premium para usuários gratuitos
  const triggerPremiumModal = (e) => {
    if (e) e.preventDefault();
    setShowPaymentModal(true);
  };

  const handleAddFight = (e) => {
    e.preventDefault();
    if (!isPremium) return triggerPremiumModal();

    if (queue.length >= 10) return alert("Limite de 10 lutas atingido na fila.");
    setQueue([...queue, { ...newFight, id: Date.now(), status: 'pending' }]);
    setNewFight({ category: '', f1Name: '', f1Team: '', f2Name: '', f2Team: '' });
  };

  const removeFight = (id) => setQueue(queue.filter(f => f.id !== id));

  const handleLogoUpload = (e) => {
    if (!isPremium) return triggerPremiumModal(e);

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!isPremium) return triggerPremiumModal();

    setProfileMessage({ text: '', type: '' });

    try {
      if (profileName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: profileName.toUpperCase() });
      }

      if (newPassword) {
        if (newPassword !== confirmNewPassword) {
          setProfileMessage({ text: 'As novas senhas não coincidem.', type: 'error' });
          return;
        }
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
          setProfileMessage({ text: 'A senha deve ter pelo menos 8 caracteres, maiúsculas, minúsculas e números.', type: 'error' });
          return;
        }
        await updatePassword(auth.currentUser, newPassword);
      }

      setProfileMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setProfileMessage({ text: 'Por segurança, faça logout e entre novamente para mudar a senha.', type: 'error' });
      } else {
        setProfileMessage({ text: 'Erro ao atualizar o perfil.', type: 'error' });
      }
    }
  };

  // Integração Mercado Pago
  const handlePayment = async (planName, price) => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ title: planName, description: `Acesso Premium - ${planName}`, quantity: 1, currency_id: 'BRL', unit_price: price }],
          back_urls: {
            success: window.location.origin + window.location.pathname + '?payment=success',
            failure: window.location.origin + window.location.pathname + '?payment=failure',
            pending: window.location.origin + window.location.pathname + '?payment=pending'
          },
          auto_return: 'approved'
        })
      });

      const data = await response.json();
      if (data.init_point) window.location.href = data.init_point; 
      else throw new Error("Falha no link.");
    } catch (error) {
      alert("Erro ao conectar com o Mercado Pago.");
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 font-sans relative">
      
      {/* MODAL DE PAGAMENTO (MERCADO PAGO) */}
      {showPaymentModal && !isPremium && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative">
            <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-zinc-400 hover:text-white"><X size={32}/></button>
            
            <div className="text-center mb-10">
              <Crown size={48} className="text-yellow-500 mx-auto mb-4" />
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Desbloquear Premium</h2>
              <p className="text-zinc-400 mt-2">Ative um plano para libertar a Fila de Lutas, Histórico, Impressão PDF e Logo Customizada.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plano Campeonato */}
              <div className="bg-zinc-950 border-2 border-zinc-800 hover:border-blue-500 transition-all rounded-2xl p-6 relative flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-blue-400">Passe Torneio</h3>
                    <p className="text-zinc-500 font-bold text-sm uppercase">Acesso por 3 Dias</p>
                  </div>
                  <Zap size={32} className="text-blue-500" />
                </div>
                <div className="text-5xl font-black mb-6">R$ 15<span className="text-xl text-zinc-500">,00</span></div>
                <ul className="space-y-3 text-sm text-zinc-300 font-medium mb-8 flex-1">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Ideal para Campeonatos de Fim de Semana</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Todas as funções desbloqueadas</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Sem renovação automática</li>
                </ul>
                <button 
                  onClick={() => handlePayment("Plano Campeonato (3 Dias)", 15)}
                  disabled={isProcessingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={20} /> Pagar com PIX ou Cartão</>}
                </button>
              </div>

              {/* Plano Mensal */}
              <div className="bg-zinc-950 border-2 border-yellow-500 rounded-2xl p-6 relative flex flex-col shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Mais Popular
                </div>
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-yellow-500">Plano Mensal</h3>
                    <p className="text-zinc-500 font-bold text-sm uppercase">Acesso por 30 Dias</p>
                  </div>
                  <Calendar size={32} className="text-yellow-500" />
                </div>
                <div className="text-5xl font-black mb-6">R$ 30<span className="text-xl text-zinc-500">,00</span></div>
                <ul className="space-y-3 text-sm text-zinc-300 font-medium mb-8 flex-1">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> Perfeito para Academias e Treinos Diários</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> Histórico ilimitado guardado no sistema</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div> Sua própria Logo no Placar e PDFs</li>
                </ul>
                <button 
                  onClick={() => handlePayment("Plano Mensal (30 Dias)", 30)}
                  disabled={isProcessingPayment}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black font-black py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={20} /> Pagar com PIX ou Cartão</>}
                </button>
              </div>
            </div>
            
            <div className="text-center mt-6 text-xs text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Lock size={12} /> Pagamento Seguro Processado pelo Mercado Pago
            </div>
          </div>
        </div>
      )}

      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <label onClick={(e) => { if(!isPremium) triggerPremiumModal(e); }} className="relative group cursor-pointer block">
            <img src={logoUrl} alt="Logo" className="h-16 w-auto drop-shadow-lg object-contain bg-white/10 rounded" />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded transition-opacity" title="Alterar Logo">
              <ImagePlus className="text-white" size={24} />
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={!isPremium} />
            {!isPremium && <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-1 rounded-full"><Lock size={10} /></div>}
          </label>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
              Painel de Evento
              {isPremium ? <Crown size={20} className="text-yellow-500" /> : <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 rounded-full">GRATUITO</span>}
            </h1>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">{user?.displayName || user?.email || 'Convidado'}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-zinc-500 hover:text-red-500 font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2">
          <LogOut size={16} /> <span className="hidden md:inline">Sair</span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        
        {/* ABAS DE NAVEGAÇÃO */}
        <div className="flex gap-6 mb-8 border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('fights')} 
            className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'fights' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Fila de Lutas
          </button>
          <button 
            onClick={() => setActiveTab('account')} 
            className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'account' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            A Minha Conta
          </button>
        </div>

        {/* CONTEÚDO DA ABA: MINHA CONTA */}
        {activeTab === 'account' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Gestão de Perfil */}
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
              <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-zinc-300">
                <User size={24}/> Detalhes do Perfil
              </h2>
              
              {user?.email === 'Conta Gratuita' ? (
                <p className="text-zinc-500 text-sm">Está num modo de visitante temporário. Crie uma conta real para gerenciar o perfil.</p>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  {profileMessage.text && (
                    <div className={`p-3 rounded-lg text-sm mb-4 text-center font-bold ${profileMessage.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-500' : 'bg-green-900/50 text-green-200 border border-green-500'}`}>
                      {profileMessage.text}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Nome de Exibição</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value.toUpperCase())} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase" placeholder="O SEU NOME" />
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-800 mt-4">
                    <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Alterar Senha de Acesso</h3>
                    <div className="space-y-4">
                      <div>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" placeholder="Nova Senha Forte" />
                      </div>
                      <div>
                        <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" placeholder="Confirmar Nova Senha" />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className={`w-full font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-6 flex justify-center items-center gap-2 ${isPremium ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}>
                    {!isPremium && <Lock size={16}/>}
                    Salvar Alterações
                  </button>
                </form>
              )}
            </div>

            {/* Gestão de Plano */}
            <div>
               {isPremium ? (
                  <div className="bg-zinc-900 border border-yellow-500/30 p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                      Ativo
                    </div>
                    <Crown size={48} className="text-yellow-500 mb-4" />
                    <h2 className="text-3xl font-black text-white uppercase mb-2 tracking-tighter">Plano Premium</h2>
                    <p className="text-zinc-400 mb-6 font-medium">Todas as funcionalidades profissionais estão desbloqueadas para a sua conta.</p>
                    
                    <ul className="space-y-3 text-sm text-zinc-300 font-bold mb-8">
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Fila de Lutas Ilimitada</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Histórico de Lutas Salvo</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Logo Personalizada no Placar</li>
                      <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Impressão de Boletim (PDF)</li>
                    </ul>
                  </div>
               ) : (
                 <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                    <h2 className="text-2xl font-black text-white uppercase mb-6 tracking-tighter text-center border-b border-zinc-800 pb-4">Faça Upgrade para Premium</h2>
                    
                    <div className="space-y-6">
                      {/* Plano Campeonato */}
                      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-black uppercase text-blue-400">Passe Torneio</h3>
                            <p className="text-zinc-500 font-bold text-[10px] uppercase">Acesso por 3 Dias</p>
                          </div>
                          <div className="text-2xl font-black">R$ 15</div>
                        </div>
                        <button onClick={() => handlePayment("Plano Campeonato", 15)} disabled={isProcessingPayment} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-black py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 text-sm mt-4 uppercase tracking-widest">
                          {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={18} /> Pagar com PIX/Cartão</>}
                        </button>
                      </div>

                      {/* Plano Mensal */}
                      <div className="bg-zinc-950 border border-yellow-500/50 rounded-2xl p-6 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest">
                          Mais Popular
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-black uppercase text-yellow-500">Plano Mensal</h3>
                            <p className="text-zinc-500 font-bold text-[10px] uppercase">Acesso por 30 Dias</p>
                          </div>
                          <div className="text-2xl font-black">R$ 30</div>
                        </div>
                        <button onClick={() => handlePayment("Plano Mensal", 30)} disabled={isProcessingPayment} className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-700 text-black font-black py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 text-sm mt-4 uppercase tracking-widest">
                          {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={18} /> Pagar com PIX/Cartão</>}
                        </button>
                      </div>
                    </div>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: FILA DE LUTAS */}
        {activeTab === 'fights' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário de Adição */}
            <div className="lg:col-span-1 bg-zinc-900 p-6 rounded-3xl border border-zinc-800 h-fit">
              <h2 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-blue-500">
                <Plus size={20}/> Preparar Luta ({queue.length}/10)
              </h2>
              
              <form onSubmit={handleAddFight} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Categoria / Peso / Faixa</label>
                  <input required value={newFight.category} onChange={e => setNewFight({...newFight, category: e.target.value.toUpperCase()})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase" placeholder="Ex: ADULTO AZUL" />
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-green-600 space-y-3">
                  <span className="text-xs font-black text-green-600 uppercase tracking-widest">Lutador 1 (Verde)</span>
                  <input required value={newFight.f1Name} onChange={e => setNewFight({...newFight, f1Name: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="NOME" />
                  <input required value={newFight.f1Team} onChange={e => setNewFight({...newFight, f1Team: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="EQUIPE" />
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-zinc-600 space-y-3">
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Lutador 2 (Branco)</span>
                  <input required value={newFight.f2Name} onChange={e => setNewFight({...newFight, f2Name: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="NOME" />
                  <input required value={newFight.f2Team} onChange={e => setNewFight({...newFight, f2Team: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="EQUIPE" />
                </div>

                <button type="submit" className={`w-full font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-4 flex justify-center items-center gap-2 ${isPremium ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}>
                  {!isPremium && <Lock size={16}/>}
                  Adicionar à Fila
                </button>
              </form>
            </div>

            {/* Fila de Lutas */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-300">
                  <ListOrdered size={20}/> Cronograma
                </h2>
                <button onClick={() => onStartFight(null)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-3 py-1.5 rounded-lg">
                  Placar Avulso (Livre)
                </button>
              </div>
              
              {queue.length === 0 ? (
                <div className="bg-zinc-900/50 border border-dashed border-zinc-700 rounded-3xl p-12 text-center text-zinc-500 font-medium text-sm">
                  A fila de lutas está vazia.<br/>Preencha o formulário ao lado.
                </div>
              ) : (
                <div className="space-y-4">
                  {queue.map((fight, index) => (
                    <div key={fight.id} className={`bg-zinc-900 border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 transition-colors ${fight.status === 'finished' ? 'border-green-900/50 opacity-80' : 'border-zinc-800 hover:border-zinc-700 shadow-lg'}`}>
                      
                      <div className={`text-zinc-600 font-black text-xl w-10 h-10 flex items-center justify-center rounded-xl shrink-0 ${fight.status === 'finished' ? 'bg-green-900/20 text-green-500' : 'bg-zinc-950'}`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 w-full text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                        <div className="md:col-span-3 pb-2 border-b border-zinc-800/50 mb-1">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{fight.category}</span>
                        </div>
                        
                        <div className="text-right pr-4 border-r-0 md:border-r border-zinc-800">
                          <p className="font-black text-sm text-white uppercase truncate">{fight.f1Name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{fight.f1Team}</p>
                        </div>
                        
                        {/* Mostra VS ou Placar se Finalizada */}
                        <div className="flex justify-center">
                           {fight.status === 'finished' ? (
                              <div className="font-black text-lg text-green-500 bg-green-500/10 px-3 py-1 rounded-lg">
                                {fight.result.f1.points} x {fight.result.f2.points}
                              </div>
                           ) : (
                              <div className="font-black text-zinc-700 italic text-sm">VS</div>
                           )}
                        </div>
                        
                        <div className="text-left pl-0 md:pl-4">
                          <p className="font-black text-sm text-white uppercase truncate">{fight.f2Name}</p>
                          <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{fight.f2Team}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 shrink-0">
                        <button onClick={() => removeFight(fight.id)} className="p-3 bg-zinc-950 hover:bg-red-900/40 text-red-500 rounded-xl transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => onStartFight(fight)} 
                          className={`flex-1 md:w-auto px-5 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 ${fight.status === 'finished' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95'}`}
                        >
                          {fight.status === 'finished' ? 'Reabrir' : <><Play size={16} fill="currentColor" /> Iniciar</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secção de Histórico - Visível na aba Fila */}
        {activeTab === 'fights' && (
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <h2 className="text-lg font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-zinc-300">
              <History size={20}/> Histórico Guardado
              {!isPremium && <Lock size={16} className="text-yellow-500 ml-2" />}
            </h2>
            
            {fightHistory.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
                {!isPremium ? "O histórico requer plano Premium." : "Nenhum resultado processado ainda."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fightHistory.map(record => (
                  <div key={record.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="text-[10px] text-zinc-500 font-black tracking-widest uppercase mb-2 border-b border-zinc-800 pb-2 flex justify-between">
                      <span className="truncate pr-2">{record.category || 'SEM CATEGORIA'}</span>
                      <span className="shrink-0">{new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-green-500 text-xs truncate w-24 uppercase">{record.f1.name}</span>
                      <span className="font-black text-lg shrink-0">{record.f1.points} x {record.f2.points}</span>
                      <span className="font-bold text-zinc-400 text-xs truncate w-24 text-right uppercase">{record.f2.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// 4. Ecrã Principal do Placar
const ScoreboardScreen = ({ initialFightData, onBackToQueue, isPremium, logoUrl, onFinishFight }) => {
  const [matchTime, setMatchTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [category, setCategory] = useState(initialFightData?.category || '');

  const initialFighter1 = { name: initialFightData?.f1Name || '', team: initialFightData?.f1Team || '', points: 0, advantages: 0, penalties: 0 };
  const initialFighter2 = { name: initialFightData?.f2Name || '', team: initialFightData?.f2Team || '', points: 0, advantages: 0, penalties: 0 };
  
  const [fighter1, setFighter1] = useState(initialFighter1);
  const [fighter2, setFighter2] = useState(initialFighter2);

  useEffect(() => {
    if(initialFightData) {
      setCategory(initialFightData.category);
      setFighter1({ ...initialFighter1, name: initialFightData.f1Name, team: initialFightData.f1Team });
      setFighter2({ ...initialFighter2, name: initialFightData.f2Name, team: initialFightData.f2Team });
      
      if(initialFightData.result) {
         setFighter1({ ...initialFighter1, name: initialFightData.f1Name, team: initialFightData.f1Team, ...initialFightData.result.f1 });
         setFighter2({ ...initialFighter2, name: initialFightData.f2Name, team: initialFightData.f2Team, ...initialFightData.result.f2 });
         setTimeLeft(0);
      } else {
         setTimeLeft(matchTime);
      }
      setIsRunning(false);
    }
  }, [initialFightData]);

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

  const handleCompleteFight = (action) => {
    const scoreData = {
      category,
      f1: { ...fighter1 },
      f2: { ...fighter2 }
    };
    onFinishFight(initialFightData?.id, scoreData, action);
    setShowFinishModal(false);
  };

  const executeLocalReset = () => {
    setIsRunning(false);
    setTimeLeft(matchTime);
    setFighter1({ ...fighter1, points: 0, advantages: 0, penalties: 0 });
    setFighter2({ ...fighter2, points: 0, advantages: 0, penalties: 0 });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const themeClasses = {
    appBg: isDarkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900',
    navBg: isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-gray-300',
    cardBg: isDarkMode ? 'bg-zinc-900 border-zinc-900' : 'bg-white border-gray-300',
    header2Bg: isDarkMode ? 'bg-zinc-800' : 'bg-gray-800', 
    pointsColor: isDarkMode ? 'text-white' : 'text-gray-900',
    labelColor: isDarkMode ? 'text-zinc-500' : 'text-gray-500',
    btnBg: isDarkMode ? 'bg-zinc-800/80 hover:bg-zinc-700 text-white border border-zinc-700/50' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    btnRedBg: isDarkMode ? 'bg-red-900/20 hover:bg-red-800/40 text-red-400 border border-red-900/30' : 'bg-red-100 hover:bg-red-200 text-red-700',
    advPenBg: isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50/50 border-gray-200',
    circleBtn: isDarkMode ? 'bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-white border border-transparent' : 'bg-white border border-gray-300 hover:bg-gray-100 text-gray-900',
    menuBg: isDarkMode ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-gray-300 text-gray-900',
    menuBtn: isDarkMode ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none transition-colors duration-500 ${themeClasses.appBg}`}>
      
      {/* Relatório de Impressão */}
      <div className="hidden print:flex flex-col p-4 text-black bg-white min-h-screen border-[8px] border-double border-zinc-300">
        <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
          <img src={logoUrl} alt="Logo" className="h-24 w-auto max-w-[250px] object-contain" />
          <div className="text-right">
            <h1 className="text-3xl font-black tracking-tighter mb-0">BOLETIM DE LUTA</h1>
            <p className="text-lg font-bold text-zinc-600">SISTEMA OFICIAL</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-50 p-3 border-l-4 border-black">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">CATEGORIA</p>
            <p className="text-xl font-black uppercase">{category || 'GERAL / ABSOLUTO'}</p>
          </div>
          <div className="bg-zinc-50 p-3 border-r-4 border-black text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">DURAÇÃO</p>
            <p className="text-xl font-black uppercase">{matchTime / 60} MINUTOS</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
             <Trophy size={400} />
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="border-2 border-black p-4 rounded-2xl bg-white shadow-sm">
              <div className="border-b-2 border-green-600 mb-4 pb-1">
                <h2 className="text-2xl font-black leading-none uppercase">{fighter1.name || 'LUTADOR 1'}</h2>
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
                <h2 className="text-2xl font-black leading-none uppercase">{fighter2.name || 'LUTADOR 2'}</h2>
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
          <div className="text-center italic font-bold text-zinc-400 text-[10px]">Gestão de Placar Desportivo</div>
          <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Responsável Mesa</div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen print:hidden">
        
        {/* Navbar Ajustada */}
        <div className={`p-4 md:p-6 flex items-center justify-between shadow-xl relative z-10 ${themeClasses.navBg}`}>
          
          <div className="hidden xl:flex items-center gap-6 w-1/3">
            <button onClick={onBackToQueue} className="p-3 rounded-xl flex items-center gap-2 font-bold tracking-widest text-xs uppercase transition-all text-zinc-500 hover:text-white hover:bg-zinc-800">
              <ChevronLeft size={16} /> Fila
            </button>
            <div className="flex items-center border-l border-zinc-800 pl-6 py-1">
               <img src={logoUrl} alt="Logo" className="h-20 md:h-24 w-auto object-contain mr-6 drop-shadow-lg" />
               <div className="flex flex-col">
                 <span className="text-blue-500 font-black text-xs uppercase tracking-widest mb-1">Categoria em Disputa</span>
                 <input type="text" placeholder="CATEGORIA" value={category} onChange={(e) => setCategory(e.target.value.toUpperCase())} className="text-3xl lg:text-4xl bg-transparent focus:outline-none border-b-2 border-transparent focus:border-blue-600 uppercase font-black w-full tracking-tighter" />
               </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center gap-8 md:gap-16">
            <div className={`text-9xl md:text-[14rem] leading-none font-black tabular-nums tracking-tighter ${timeLeft === 0 ? 'text-blue-500 animate-pulse' : themeClasses.pointsColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex flex-col gap-4">
              {timeLeft === 0 ? (
                <button onClick={() => setShowFinishModal(true)} className="bg-blue-600 text-white p-6 rounded-2xl font-black uppercase shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 transition-all flex flex-col items-center justify-center gap-1">
                  <CheckCircle size={40} />
                  <span className="text-xs tracking-widest mt-1">Concluir</span>
                </button>
              ) : (
                <button onClick={toggleTimer} className={`p-6 rounded-2xl shadow-lg transition-all active:scale-95 ${isRunning ? 'bg-amber-500 text-black' : 'bg-green-600 text-white'}`}>
                  {isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-1" />}
                </button>
              )}
              <button onClick={executeLocalReset} className={`p-4 rounded-xl shadow-sm transition-all active:scale-90 ${themeClasses.circleBtn}`} title="Resetar Timer/Placar Local"><RotateCcw size={24} /></button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 w-1/3">
            <button onClick={() => { if (isPremium) { window.print() } else { alert("A impressão é um recurso Premium. Acesse a aba 'Minha Conta' para adquirir um plano.") } }} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn} ${!isPremium ? 'opacity-50' : ''}`} title="Imprimir Resultado">
              <Printer size={24} />
            </button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn}`} title="Tema"><Sun size={24} className={isDarkMode ? 'hidden' : 'block'} /><Moon size={24} className={isDarkMode ? 'block' : 'hidden'} /></button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn}`} title="Ajustes de Tempo"><Settings size={24} /></button>
          </div>
        </div>

        {/* Menu Settings Overlay */}
        {showSettings && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowSettings(false)}></div>
            <div className={`absolute top-36 right-8 border border-zinc-800 p-8 rounded-3xl shadow-2xl z-20 w-80 ${themeClasses.menuBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-xs tracking-widest text-zinc-500">Ajuste de Tempo</h3>
                <button onClick={() => setShowSettings(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[4, 5, 6, 7, 8, 10].map(mins => (
                  <button key={mins} onClick={() => { setMatchTime(mins * 60); setTimeLeft(mins * 60); setShowSettings(false); }} className={`py-4 rounded-xl font-black text-sm transition-all ${matchTime === mins * 60 ? 'bg-blue-600 text-white' : themeClasses.menuBtn}`}>{mins}m</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Modal de Conclusão da Luta */}
        {showFinishModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className={`max-w-lg w-full p-10 rounded-3xl shadow-2xl text-center border border-zinc-800 ${themeClasses.menuBg}`}>
              <div className="flex justify-center mb-6"><CheckCircle size={64} className="text-blue-500" /></div>
              <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase">Luta Encerrada</h2>
              <p className="text-zinc-400 mb-8 text-sm uppercase tracking-widest font-bold">O que deseja fazer com o resultado?</p>
              
              <div className="flex flex-col gap-3">
                {isPremium ? (
                  <>
                    <button onClick={() => handleCompleteFight('next')} className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white transition-all">
                      Salvar e Puxar Próxima Luta
                    </button>
                    <button onClick={() => handleCompleteFight('queue')} className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${themeClasses.menuBtn}`}>
                      Salvar e Voltar à Fila
                    </button>
                  </>
                ) : (
                  <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-500 mb-4">
                    O salvamento no histórico e passagem automática de fila são recursos <span className="text-yellow-500">Premium</span>.
                  </div>
                )}
                <button onClick={() => {setShowFinishModal(false); onBackToQueue();}} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-transparent border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all mt-2">
                  Sair sem Salvar
                </button>
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

// === COMPONENTE PRINCIPAL (Roteador e Estado Global) ===
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); 
  const [isLoading, setIsLoading] = useState(true);

  // Estados Globais de Monetização e Gestão
  const [isPremium, setIsPremium] = useState(false); 
  const [logoUrl, setLogoUrl] = useState("https://iili.io/qC543c7.png"); 
  const [queue, setQueue] = useState([]);
  const [fightHistory, setFightHistory] = useState([]);
  const [activeFight, setActiveFight] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      setIsPremium(true);
      alert("Pagamento aprovado! Bem-vindo ao Modo Premium.");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === 'failure') {
      alert("Houve um problema com o pagamento. Tente novamente.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsPremium(true);
      } else if (currentUser && !ADMIN_EMAILS.includes(currentUser.email)) {
        setIsPremium(false);
      }

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
    setIsPremium(false); 
    setCurrentView('login');
  };

  const startFight = (fightData) => {
    setActiveFight(fightData);
    setCurrentView('scoreboard');
  };

  const handleFinishFight = (fightId, scoreData, action) => {
    // 1. Salvar no histórico local
    setFightHistory(prev => [{ id: Date.now(), timestamp: Date.now(), ...scoreData }, ...prev]);
    
    // 2. Atualizar fila
    let nextPendingFight = null;

    if (fightId) {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const idx = newQueue.findIndex(f => f.id === fightId);
        if (idx !== -1) {
          // Marca luta como finalizada com resultado
          newQueue[idx] = { ...newQueue[idx], status: 'finished', result: scoreData };
          // Encontra a próxima
          nextPendingFight = newQueue.find((f, i) => i > idx && f.status === 'pending');
        }
        return newQueue;
      });
    }

    // 3. Ação baseada na escolha do usuário
    setTimeout(() => {
      if (action === 'next') {
        // Pega a fila mais recente
        const updatedQueue = queue.map(f => f.id === fightId ? { ...f, status: 'finished', result: scoreData } : f);
        const currentIndex = updatedQueue.findIndex(f => f.id === fightId);
        const nextFight = updatedQueue.find((f, i) => i > currentIndex && f.status === 'pending');
        
        if (nextFight) {
          setActiveFight(nextFight);
        } else {
          alert("Não há mais lutas programadas na fila.");
          setCurrentView('queue');
        }
      } else {
        setCurrentView('queue');
      }
    }, 50); // Timeout leve para garantir sync de state
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black text-2xl tracking-widest uppercase">Carregando...</div>;
  }

  return (
    <>
      {currentView === 'login' && (
        <LoginScreen onGuestLogin={() => { setUser({ email: 'Conta Gratuita' }); setCurrentView('queue'); }} />
      )}
      
      {currentView === 'queue' && (
        <QueueScreen 
          user={user} queue={queue} setQueue={setQueue} 
          onStartFight={startFight} onLogout={handleLogout} 
          isPremium={isPremium} logoUrl={logoUrl} setLogoUrl={setLogoUrl} fightHistory={fightHistory}
        />
      )}
      
      {currentView === 'scoreboard' && (
        <ScoreboardScreen 
          initialFightData={activeFight} onBackToQueue={() => setCurrentView('queue')} 
          isPremium={isPremium} logoUrl={logoUrl} onFinishFight={handleFinishFight}
        />
      )}
    </>
  );
}