import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, Plus, Minus, Sun, Moon, Printer, X, Trophy, LogOut, ListOrdered, Trash2, ChevronLeft, LogIn, Crown, Lock, ImagePlus, History, CreditCard, Calendar, Zap, Loader2, User, CheckCircle, QrCode, FolderPlus, Folder, GitMerge, Edit2, Tag, Users, Package, Mail, GripVertical, ArrowRight, LayoutDashboard, MonitorPlay, Maximize, Minimize, Eye, EyeOff } from 'lucide-react';

// === CONFIGURAÇÃO DO FIREBASE ===
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  confirmPasswordReset
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

// === CONFIGURAÇÃO DE ADMINISTRADORES ===
const ADMIN_EMAILS = [
  "admin@tanqueteambjj.com", 
  "tanqueteambjj@gmail.com", 
  "cledson@tanqueteambjj.com" 
];

// === CREDENCIAIS MERCADO PAGO ===
const MP_PUBLIC_KEY = "APP_USR-7a886f17-7cd4-4800-953e-000538747fc3";
const MP_ACCESS_TOKEN = "APP_USR-5825120061754229-022016-ecb35610bbb69399336717aaf09d0539-89303803";

// Constantes de Faixas e Fases
const BELTS = ["BRANCA", "CINZA", "AMARELA", "LARANJA", "VERDE", "AZUL", "ROXA", "MARROM", "PRETA", "SUBMISSION - NOGI"];
const PHASES = ["LUTA LIVRE", "FASE DE GRUPOS", "OITAVAS DE FINAL", "QUARTAS DE FINAL", "SEMI-FINAL", "FINAL", "DISPUTA 3º LUGAR"];

const getCategoryHeaderStyle = (belt) => {
  switch(belt) {
    case 'BRANCA': return 'bg-zinc-100 text-black border-zinc-300';
    case 'CINZA': return 'bg-zinc-400 text-black border-zinc-500';
    case 'AMARELA': return 'bg-yellow-400 text-black border-yellow-500';
    case 'LARANJA': return 'bg-orange-500 text-black border-orange-600';
    case 'VERDE': return 'bg-green-600 text-white border-green-700';
    case 'AZUL': return 'bg-blue-600 text-white border-blue-700';
    case 'ROXA': return 'bg-purple-600 text-white border-purple-700';
    case 'MARROM': return 'bg-amber-800 text-white border-amber-900';
    case 'PRETA': return 'bg-zinc-900 text-white border-black';
    case 'SUBMISSION - NOGI': return 'bg-zinc-950 text-red-500 border-red-700 border-b-4';
    default: return 'bg-zinc-900 text-white border-zinc-800';
  }
};

// Função para determinar Vencedor
const getWinner = (res) => {
  if (!res) return 0;
  if (res.f1.penalties >= 4) return 2; // DQ F1
  if (res.f2.penalties >= 4) return 1; // DQ F2
  if (res.f1.points > res.f2.points) return 1;
  if (res.f2.points > res.f1.points) return 2;
  if (res.f1.advantages > res.f2.advantages) return 1;
  if (res.f2.advantages > res.f1.advantages) return 2;
  if (res.f1.penalties < res.f2.penalties) return 1;
  if (res.f2.penalties < res.f1.penalties) return 2;
  return 0; // Empate
};

// === COMPONENTES DA INTERFACE ===

const LandingScreen = ({ onLogin, onRegister, onDemo, plans, logoUrl }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="h-12 md:h-16 w-auto object-contain drop-shadow-2xl" />
          <span className="font-black text-xl tracking-tighter uppercase hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Tanque Team BJJ</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogin} className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Entrar</button>
          <button onClick={onRegister} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95">Criar Conta</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sistema Oficial de Campeonatos</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-[1.1] text-white drop-shadow-2xl">
            Eleve o nível do seu <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-300">Jiu-Jitsu</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto font-medium">
            A plataforma definitiva para organizar chaves, gerir filas de lutas, controlar placares em tempo real e emitir boletins com a sua própria marca.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onRegister} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95 flex items-center justify-center gap-2">
              Começar Gratuitamente <ArrowRight size={16} />
            </button>
            <button onClick={onDemo} className="w-full sm:w-auto bg-zinc-900 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
              <MonitorPlay size={16} /> Experimentar Placar
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-black border-y border-zinc-900 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors group">
            <div className="w-14 h-14 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LayoutDashboard className="text-blue-500" size={28} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">Gestão de Chaves</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Crie categorias por faixa e peso. O sistema gera automaticamente as finais e as disputas de 3º lugar com base nos vencedores.</p>
          </div>
          
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl hover:border-yellow-500/50 transition-colors group">
            <div className="w-14 h-14 bg-yellow-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy className="text-yellow-500" size={28} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">Placar Profissional</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Controlo completo de Pontos, Vantagens e Punições. Design moderno, adaptável a qualquer ecrã e projetado para não falhar.</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors group">
            <div className="w-14 h-14 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Printer className="text-purple-500" size={28} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-3">Relatórios Oficiais</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">Imprima boletins de luta individuais ou relatórios completos do evento com a logo da sua própria academia.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-zinc-950 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">Planos e Preços</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">Comece a testar sem custos ou desbloqueie o poder total para o seu próximo campeonato.</p>
        </div>

        <div className={`grid md:grid-cols-${Math.min(plans.length + 1, 3)} gap-8 max-w-6xl mx-auto`}>
          {/* Free Plan */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col relative opacity-80 hover:opacity-100 transition-opacity">
            <div className="mb-4">
              <h3 className="text-2xl font-black uppercase text-zinc-300">Visitante</h3>
              <p className="text-zinc-500 font-bold text-sm uppercase">Acesso Imediato</p>
            </div>
            <div className="text-5xl font-black mb-8 text-zinc-300">Grátis</div>
            <ul className="space-y-4 text-sm text-zinc-400 font-medium mb-8 flex-1">
              <li className="flex items-center gap-3"><CheckCircle size={16} className="text-zinc-600"/> Testar Placar de Luta</li>
              <li className="flex items-center gap-3"><CheckCircle size={16} className="text-zinc-600"/> Regras Oficiais</li>
              <li className="flex items-center gap-3 text-zinc-600 line-through"><X size={16}/> Histórico e Filas</li>
              <li className="flex items-center gap-3 text-zinc-600 line-through"><X size={16}/> Impressão de Boletins</li>
            </ul>
            <button onClick={onDemo} className="w-full font-black py-4 rounded-xl border-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 uppercase tracking-widest transition-all">
              Testar Agora
            </button>
          </div>

          {/* Premium Plans from State */}
          {plans.map(plan => (
            <div key={plan.id} className={`bg-zinc-900 border-2 ${plan.isPopular ? 'border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.15)]' : 'border-zinc-800'} rounded-3xl p-8 flex flex-col relative scale-100 md:scale-105 z-10 bg-gradient-to-b from-zinc-900 to-black`}>
              {plan.isPopular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">O Mais Escolhido</div>}
              <div className="mb-4 mt-2">
                <h3 className={`text-2xl font-black uppercase ${plan.isPopular ? 'text-blue-400' : 'text-yellow-500'}`}>{plan.name}</h3>
                <p className="text-zinc-500 font-bold text-sm uppercase">Válido por {plan.durationDays} Dias</p>
              </div>
              <div className="text-5xl font-black mb-8 text-white">R$ {plan.price}<span className="text-2xl text-zinc-500">,00</span></div>
              <ul className="space-y-4 text-sm text-zinc-300 font-medium mb-8 flex-1">
                {plan.features.split(',').map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className={plan.isPopular ? 'text-blue-500 shrink-0' : 'text-yellow-500 shrink-0'}/> 
                    <span className="leading-tight">{feature.trim()}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onRegister} className={`w-full font-black py-4 rounded-xl shadow-lg uppercase tracking-widest transition-all active:scale-95 ${plan.isPopular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-yellow-500 hover:bg-yellow-400 text-black'}`}>
                Criar Conta Premium
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-8 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest border-t border-zinc-900 bg-black">
        &copy; {new Date().getFullYear()} Tanque Team BJJ. Todos os direitos reservados.
      </footer>
    </div>
  );
};

const PrintReceipt = ({ data, logoUrl, user }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-white text-black min-h-screen font-sans border-8 border-double border-zinc-300">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10 border-b-4 border-black pb-8">
          <img src={logoUrl} alt="Logo" className="h-32 w-auto mx-auto mb-6 object-contain" />
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Recibo de Pagamento</h1>
          <p className="text-lg font-bold text-zinc-500 uppercase tracking-widest">
            {new Date(data.date).toLocaleString()}
          </p>
        </div>

        <div className="space-y-6 text-xl mb-12">
          <div className="flex justify-between border-b-2 border-zinc-100 pb-2">
            <span className="font-bold text-zinc-500 uppercase tracking-widest">Cliente:</span>
            <span className="font-black uppercase">{user?.displayName || user?.email}</span>
          </div>
          <div className="flex justify-between border-b-2 border-zinc-100 pb-2">
            <span className="font-bold text-zinc-500 uppercase tracking-widest">Plano Assinado:</span>
            <span className="font-black uppercase text-blue-600">{data.planName}</span>
          </div>
          <div className="flex justify-between border-b-2 border-zinc-100 pb-2">
            <span className="font-bold text-zinc-500 uppercase tracking-widest">Valor Original:</span>
            <span className="font-black uppercase">R$ {data.price.toFixed(2)}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between border-b-2 border-zinc-100 pb-2 text-green-600">
              <span className="font-bold uppercase tracking-widest">Desconto (Cupom: {data.coupon}):</span>
              <span className="font-black uppercase">- R$ {data.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between bg-zinc-100 p-6 rounded-2xl mt-8 items-center border-2 border-black">
            <span className="font-black text-2xl uppercase tracking-tighter">Total Pago:</span>
            <span className="font-black text-4xl">R$ {data.finalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
            Este documento comprova o acesso aos recursos Premium.<br/>Obrigado pela preferência!
          </p>
        </div>
      </div>
    </div>
  );
};

const PrintBoletim = ({ data, logoUrl, user }) => {
  const displayName = user?.displayName || 'SISTEMA OFICIAL';
  
  return (
    <div className="w-full flex-1 flex flex-col relative text-black bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
        <img src={logoUrl} alt="Logo" className="h-24 w-auto max-w-[250px] object-contain" />
        <div className="text-right">
          <h1 className="text-3xl font-black tracking-tighter mb-0">BOLETIM DE LUTA</h1>
          <p className="text-lg font-bold text-zinc-600 uppercase">{displayName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-50 p-3 border-l-4 border-black">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">CATEGORIA / FAIXA / SEXO</p>
          <p className="text-xl font-black uppercase leading-tight">
            {[data?.category, data?.belt, data?.gender].filter(Boolean).join(' • ') || 'GERAL / ABSOLUTO'}
          </p>
          {data?.phase && <p className="text-sm font-bold text-blue-600 mt-1 uppercase">Fase: {data.phase}</p>}
        </div>
        <div className="bg-zinc-50 p-3 border-r-4 border-black text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0">DURAÇÃO</p>
          <p className="text-xl font-black uppercase">{data?.duration ? `${data.duration} MINUTOS` : 'N/A'}</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
           <Trophy size={400} />
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          <div className="border-2 border-black p-4 rounded-2xl bg-white shadow-sm">
            <div className="border-b-2 border-green-600 mb-4 pb-1">
              <h2 className="text-2xl font-black leading-none uppercase">{data?.f1?.name || 'LUTADOR 1'}</h2>
              <p className="text-base font-bold text-zinc-500 mt-1 uppercase">{data?.f1?.team || 'EQUIPE'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-1">
                <span className="text-sm font-bold text-zinc-400">PONTOS</span>
                <span className="text-6xl font-black leading-none">{data?.f1?.points || 0}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>VANTAGENS</span>
                <span>{data?.f1?.advantages || 0}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600">
                <span>PUNIÇÕES</span>
                <span>{data?.f1?.penalties || 0}</span>
              </div>
            </div>
            {(data?.f1?.penalties >= 4) && <div className="mt-4 bg-red-600 text-white font-black text-center py-2 uppercase tracking-widest text-sm rounded">Desclassificado (DQ)</div>}
          </div>

          <div className="border-2 border-black p-4 rounded-2xl bg-white shadow-sm text-right">
            <div className="border-b-2 border-zinc-800 mb-4 pb-1">
              <h2 className="text-2xl font-black leading-none uppercase">{data?.f2?.name || 'LUTADOR 2'}</h2>
              <p className="text-base font-bold text-zinc-500 mt-1 uppercase">{data?.f2?.team || 'EQUIPE'}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end border-b border-zinc-100 pb-1 flex-row-reverse">
                <span className="text-sm font-bold text-zinc-400">PONTOS</span>
                <span className="text-6xl font-black leading-none">{data?.f2?.points || 0}</span>
              </div>
              <div className="flex justify-between text-lg font-bold flex-row-reverse">
                <span>VANTAGENS</span>
                <span>{data?.f2?.advantages || 0}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600 flex-row-reverse">
                <span>PUNIÇÕES</span>
                <span>{data?.f2?.penalties || 0}</span>
              </div>
            </div>
            {(data?.f2?.penalties >= 4) && <div className="mt-4 bg-red-600 text-white font-black text-center py-2 uppercase tracking-widest text-sm rounded">Desclassificado (DQ)</div>}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-20 pb-4 flex justify-between items-end">
        <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Assinatura Árbitro</div>
        <div className="text-center italic font-bold text-zinc-400 text-[10px] uppercase">{displayName}</div>
        <div className="w-48 border-t border-black pt-1 text-center text-[10px] font-bold uppercase">Responsável Mesa</div>
      </div>
    </div>
  );
};

const FighterCard = ({ num, data, setFighter, updateScore, isGreenBelt, isDarkMode, themeClasses, cleanMode }) => {
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

      <div className="flex-1 flex flex-col items-center justify-center p-4 group/points">
        <span className={`text-xl font-bold uppercase tracking-[0.2em] mb-1 ${themeClasses.labelColor}`}>Pontos</span>
        <div className={`text-[12rem] md:text-[15rem] leading-none font-black tabular-nums tracking-tighter ${themeClasses.pointsColor}`}>{data.points}</div>
        <div className={`flex gap-2 mt-4 w-full justify-center print:hidden transition-opacity duration-300 ${cleanMode ? 'opacity-0 group-hover/points:opacity-100 focus-within:opacity-100' : 'opacity-100'}`}>
           {[2, 3, 4].map(val => (
             <button key={val} onClick={() => updateScore('points', val)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnBg}`}>+{val}</button>
           ))}
           <button onClick={() => updateScore('points', -1)} className={`flex-1 max-w-[90px] py-6 font-black rounded-xl text-3xl transition-all active:scale-95 shadow-md ${themeClasses.btnRedBg}`}>-1</button>
        </div>
      </div>

      <div className={`flex border-t h-44 ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
        <div className={`flex-1 flex flex-col border-r ${themeClasses.advPenBg} group/adv`}>
          <div className="bg-yellow-500 text-black text-center py-2 font-black uppercase tracking-widest text-xs">Vantagens</div>
          <div className="flex-1 flex items-center justify-between px-6">
            <button onClick={() => updateScore('advantages', -1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn} ${cleanMode ? 'opacity-0 group-hover/adv:opacity-100 focus-within:opacity-100' : 'opacity-100'}`}><Minus size={28} /></button>
            <span className="text-7xl font-black text-yellow-500 tabular-nums">{data.advantages}</span>
            <button onClick={() => updateScore('advantages', 1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn} ${cleanMode ? 'opacity-0 group-hover/adv:opacity-100 focus-within:opacity-100' : 'opacity-100'}`}><Plus size={28} /></button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${themeClasses.advPenBg} group/pen`}>
          <div className="bg-red-600 text-white text-center py-2 font-black uppercase tracking-widest text-xs">Punições</div>
          <div className="flex-1 flex items-center justify-between px-6">
            <button onClick={() => updateScore('penalties', -1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn} ${cleanMode ? 'opacity-0 group-hover/pen:opacity-100 focus-within:opacity-100' : 'opacity-100'}`}><Minus size={28} /></button>
            <span className="text-7xl font-black text-red-500 tabular-nums">{data.penalties}</span>
            <button onClick={() => updateScore('penalties', 1)} className={`print:hidden p-3 rounded-full transition-transform active:scale-90 shadow-sm ${themeClasses.circleBtn} ${cleanMode ? 'opacity-0 group-hover/pen:opacity-100 focus-within:opacity-100' : 'opacity-100'}`}><Plus size={28} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordScreen = ({ oobCode }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passReqs = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password)
  };
  const isPasswordValid = passReqs.length && passReqs.upper && passReqs.lower && passReqs.number;

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError("As senhas não coincidem."); return; }
    if (!isPasswordValid) { setError("A senha não cumpre todos os requisitos."); return; }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccessMsg('Senha redefinida com sucesso! A redirecionar para o login...');
      setTimeout(() => {
         window.location.href = window.location.origin + window.location.pathname;
      }, 3000);
    } catch (err) {
      if (err.code === 'auth/invalid-action-code') {
        setError('Este link expirou ou já foi usado. Por favor, solicite um novo na página de login.');
      } else {
        setError(err.message.replace('Firebase:', ''));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 text-center">Nova Senha</h2>
        <p className="text-zinc-400 text-sm text-center mb-6">Crie uma nova senha para a sua conta.</p>

        {error && <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded-2xl text-xs font-bold tracking-widest uppercase mb-6 text-center shadow-inner flex items-center justify-center gap-2"><X size={14}/> {error}</div>}
        {successMsg && <div className="bg-green-950/50 border border-green-900/50 text-green-400 p-4 rounded-2xl text-xs font-bold tracking-widest uppercase mb-6 text-center shadow-inner flex items-center justify-center gap-2"><CheckCircle size={14}/> {successMsg}</div>}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative group">
            <Lock className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-600" placeholder="NOVA SENHA" />

            <div className="mt-2 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 space-y-2">
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.length ? 'text-green-500' : 'text-zinc-500'}`}>
                {passReqs.length ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} Mínimo 8 caracteres
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.upper ? 'text-green-500' : 'text-zinc-500'}`}>
                {passReqs.upper ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Letra Maiúscula
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.lower ? 'text-green-500' : 'text-zinc-500'}`}>
                {passReqs.lower ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Letra Minúscula
              </div>
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.number ? 'text-green-500' : 'text-zinc-500'}`}>
                {passReqs.number ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Número
              </div>
            </div>
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-600" placeholder="CONFIRMAR NOVA SENHA" />
          </div>

          <button type="submit" disabled={isLoading || !isPasswordValid} className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-6 flex justify-center items-center gap-2 ${isLoading || !isPasswordValid ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white shadow-blue-900/20'}`}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginScreen = ({ onBack, initialIsRegistering = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setSuccessMsg('');
    setIsLoading(true);
    try {
      if (isResettingPassword) {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Email de recuperação enviado! Verifique a sua caixa de entrada.');
        setTimeout(() => setIsResettingPassword(false), 5000);
      } else if (isRegistering) {
        if (password !== confirmPassword) { setError("As senhas não coincidem."); setIsLoading(false); return; }
        if (!isPasswordValid) { setError("A senha não cumpre todos os requisitos."); setIsLoading(false); return; }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name.toUpperCase() });
        
        // Salva registro local para visualização do Admin
        const existingUsers = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        existingUsers.push({ 
            uid: userCredential.user.uid, 
            email, 
            name: name.toUpperCase(), 
            date: new Date().toISOString(),
            currentPlan: 'GRATUITO',
            premiumUntil: null,
            premiumSince: null
        });
        localStorage.setItem('app_registered_users', JSON.stringify(existingUsers));

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace('Firebase:', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4 relative overflow-hidden">
      
      <button onClick={onBack} className="absolute top-6 left-6 text-zinc-400 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest z-50 transition-colors">
        <ChevronLeft size={16}/> Voltar
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-full"></div>
        
        <div className="text-center mb-8 mt-4">
          <img src="https://iili.io/qC543c7.png" alt="Logo" className="h-28 w-auto mx-auto mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Tanque Team BJJ</h1>
          <p className="text-zinc-500 font-bold tracking-widest text-xs mt-2 uppercase">
            {isResettingPassword ? 'Recuperar Senha' : isRegistering ? 'Criar Nova Conta' : 'Acesso ao Sistema'}
          </p>
        </div>

        {error && <div className="bg-red-950/50 border border-red-900/50 text-red-400 p-4 rounded-2xl text-xs font-bold tracking-widest uppercase mb-6 text-center shadow-inner flex items-center justify-center gap-2"><X size={14}/> {error}</div>}
        {successMsg && <div className="bg-green-950/50 border border-green-900/50 text-green-400 p-4 rounded-2xl text-xs font-bold tracking-widest uppercase mb-6 text-center shadow-inner flex items-center justify-center gap-2"><CheckCircle size={14}/> {successMsg}</div>}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isRegistering && !isResettingPassword && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all uppercase text-sm font-medium placeholder:text-zinc-600" placeholder="NOME DE EXIBIÇÃO (ACADEMIA)" />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-600" placeholder="SEU E-MAIL" />
          </div>

          {!isResettingPassword && (
            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-600" placeholder="SENHA" />
              
              {isRegistering && (
                <div className="mt-2 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 space-y-2">
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.length ? 'text-green-500' : 'text-zinc-500'}`}>
                    {passReqs.length ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} Mínimo 8 caracteres
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.upper ? 'text-green-500' : 'text-zinc-500'}`}>
                    {passReqs.upper ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Letra Maiúscula
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.lower ? 'text-green-500' : 'text-zinc-500'}`}>
                    {passReqs.lower ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Letra Minúscula
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${passReqs.number ? 'text-green-500' : 'text-zinc-500'}`}>
                    {passReqs.number ? <CheckCircle size={12} /> : <div className="w-3 h-3 border-2 border-zinc-700 rounded-full" />} 1 Número
                  </div>
                </div>
              )}
            </div>
          )}

          {isRegistering && !isResettingPassword && (
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-600" placeholder="CONFIRMAR SENHA" />
            </div>
          )}

          {!isRegistering && !isResettingPassword && (
            <div className="flex justify-end">
              <button type="button" onClick={() => { setIsResettingPassword(true); setError(''); setSuccessMsg(''); }} className="text-[10px] font-bold text-zinc-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
                Esqueceu a senha?
              </button>
            </div>
          )}

          <button type="submit" disabled={isLoading || (isRegistering && !isResettingPassword && !isPasswordValid)} className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-6 flex justify-center items-center gap-2 ${isLoading || (isRegistering && !isResettingPassword && !isPasswordValid) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white shadow-blue-900/20'}`}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : isResettingPassword ? 'Enviar Link' : isRegistering ? 'Criar Conta' : 'Entrar no Sistema'}
          </button>

          {isResettingPassword && (
            <button type="button" onClick={() => { setIsResettingPassword(false); setError(''); setSuccessMsg(''); }} className="w-full py-4 rounded-2xl text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-widest transition-colors border border-zinc-800 mt-2 hover:bg-zinc-800 flex justify-center items-center gap-2">
              <ChevronLeft size={14} /> Voltar ao Login
            </button>
          )}
        </form>

        {!isResettingPassword && (
          <div className="mt-8 text-center">
            <button onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }} disabled={isLoading} className="text-zinc-400 hover:text-blue-400 text-xs font-black uppercase tracking-widest transition-colors">
              {isRegistering ? 'Já tenho conta. Fazer Login' : 'Não tem conta? Registre-se'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Tela de Gestão do Evento (Dashboard)
const DashboardScreen = ({ activeTab, setActiveTab, queue, setQueue, categories, setCategories, fightHistory, onStartFight, onLogout, user, isPremium, logoUrl, setLogoUrl, onClearAll, onShowReceipt }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [printMode, setPrintMode] = useState(null); 

  const isAdmin = ADMIN_EMAILS.includes(user?.email);
  const [adminSubTab, setAdminSubTab] = useState('plans'); // 'users' | 'plans' | 'coupons'

  // Modais de Criação
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFightModal, setShowFightModal] = useState(false);
  
  // Form States
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCat, setNewCat] = useState({ name: '', belt: '', gender: '' });
  
  const [editingFight, setEditingFight] = useState(null);
  const [addingFightToCat, setAddingFightToCat] = useState(null);
  const [newFight, setNewFight] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    category: '', belt: '', gender: '', phase: 'LUTA LIVRE', f1Name: '', f1Team: '', f2Name: '', f2Team: '' 
  });

  // Admin: Planos
  const defaultPlans = [
    { id: 1, name: 'Passe Torneio', durationDays: 3, price: 15, isPopular: false, features: 'Ideal para Campeonatos de Fim de Semana,Todas as funções desbloqueadas,Sem renovação automática' },
    { id: 2, name: 'Plano Mensal', durationDays: 30, price: 30, isPopular: true, features: 'Perfeito para Academias e Treinos Diários,Histórico ilimitado guardado no sistema,Sua própria Logo no Placar e PDFs' }
  ];
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('app_plans');
    return saved ? JSON.parse(saved) : defaultPlans;
  });

  const [newPlan, setNewPlan] = useState({ name: '', durationDays: 30, price: 0, isPopular: false, features: '' });

  // Admin: Cupons
  const defaultCoupons = { 
    'OSS20': { discount: 0.20, uses: 100, plan: 'TODOS' }, 
    'TANQUE50': { discount: 0.50, uses: 50, plan: 'TODOS' }, 
    'TESTE100': { discount: 1.0, uses: 10, plan: 'TODOS' } 
  };
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('app_coupons');
    return saved ? JSON.parse(saved) : defaultCoupons;
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });
  
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponUses, setNewCouponUses] = useState('');
  const [newCouponPlan, setNewCouponPlan] = useState('TODOS');

  // Admin: Usuários
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [editingAdminUser, setEditingAdminUser] = useState(null);
  const [editUserPlan, setEditUserPlan] = useState('');
  const [editUserDays, setEditUserDays] = useState(30);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('app_coupons', JSON.stringify(coupons));
      localStorage.setItem('app_plans', JSON.stringify(plans));
      setRegisteredUsers(JSON.parse(localStorage.getItem('app_registered_users') || '[]'));
    }
  }, [coupons, plans, isAdmin]);

  // Drag and Drop Lógica
  const handleDropFight = (e, targetFightId, catId = null) => {
    e.preventDefault();
    const sourceIdStr = e.dataTransfer.getData('text/plain');
    if(!sourceIdStr) return;
    const sourceId = Number(sourceIdStr);
    
    if (sourceId === targetFightId) return; // Dropou no mesmo lugar

    if (!catId) {
      // Reordenar Fila Livre
      const newQueue = [...queue];
      const sourceIdx = newQueue.findIndex(f => f.id === sourceId);
      const targetIdx = newQueue.findIndex(f => f.id === targetFightId);
      
      if(sourceIdx !== -1 && targetIdx !== -1) {
        const [removed] = newQueue.splice(sourceIdx, 1);
        newQueue.splice(targetIdx, 0, removed);
        setQueue(newQueue);
      }
    } else {
      // Reordenar dentro da categoria
      const newCats = [...categories];
      const catIdx = newCats.findIndex(c => c.id === catId);
      if (catIdx !== -1) {
        const newFights = [...newCats[catIdx].fights];
        const sourceIdx = newFights.findIndex(f => f.id === sourceId);
        const targetIdx = newFights.findIndex(f => f.id === targetFightId);
        
        if (sourceIdx !== -1 && targetIdx !== -1) {
           const [removed] = newFights.splice(sourceIdx, 1);
           newFights.splice(targetIdx, 0, removed);
           newCats[catIdx].fights = newFights;
           setCategories(newCats);
        }
      }
    }
  };

  // Funções Admin - Cupons e Planos
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if(!newCouponCode || !newCouponDiscount || !newCouponUses) return;
    const code = newCouponCode.toUpperCase().trim();
    const discount = parseFloat(newCouponDiscount) / 100;
    const uses = parseInt(newCouponUses, 10);
    
    if(isNaN(discount) || discount <= 0 || discount > 1) return alert('Desconto inválido. Use um valor entre 1 e 100.');
    if(isNaN(uses) || uses <= 0) return alert('Quantidade de usos inválida.');

    setCoupons(prev => ({...prev, [code]: { discount, uses, plan: newCouponPlan }}));
    setNewCouponCode(''); setNewCouponDiscount(''); setNewCouponUses(''); setNewCouponPlan('TODOS');
  };
  
  const removeCoupon = (code) => { 
    if(window.confirm(`Remover o cupom ${code}?`)) {
      setCoupons(prev => { const updated = {...prev}; delete updated[code]; return updated; }); 
    }
  };

  const handleAddPlan = (e) => {
    e.preventDefault();
    if(!newPlan.name || newPlan.price <= 0) return;
    setPlans(prev => [...prev, { ...newPlan, id: Date.now() }]);
    setNewPlan({ name: '', durationDays: 30, price: 0, isPopular: false, features: '' });
  };
  
  const removePlan = (id) => { 
    if(window.confirm('Remover este plano?')) setPlans(plans.filter(p => p.id !== id)); 
  };

  // Funções Admin - Usuários
  const openAdminUserEdit = (u) => {
    setEditingAdminUser(u);
    setEditUserPlan(u.currentPlan || 'GRATUITO');
    setEditUserDays(30);
  };

  const handleAdminSaveUser = (e) => {
    e.preventDefault();
    
    let newPremiumUntil = null;
    let newPremiumSince = editingAdminUser.premiumSince;

    if(editUserPlan !== 'GRATUITO') {
        const ms = Date.now() + (editUserDays * 24 * 60 * 60 * 1000);
        newPremiumUntil = ms;
        newPremiumSince = newPremiumSince || Date.now();
        localStorage.setItem(`premiumUntil_${editingAdminUser.uid}`, ms);
        localStorage.setItem(`premiumSince_${editingAdminUser.uid}`, newPremiumSince);
        localStorage.setItem(`premiumPlan_${editingAdminUser.uid}`, editUserPlan);
    } else {
        localStorage.removeItem(`premiumUntil_${editingAdminUser.uid}`);
        localStorage.removeItem(`premiumSince_${editingAdminUser.uid}`);
        localStorage.removeItem(`premiumPlan_${editingAdminUser.uid}`);
        newPremiumSince = null;
    }

    const updated = registeredUsers.map(u => {
        if(u.uid === editingAdminUser.uid) {
            return {...u, currentPlan: editUserPlan, premiumUntil: newPremiumUntil, premiumSince: newPremiumSince};
        }
        return u;
    });
    
    setRegisteredUsers(updated);
    localStorage.setItem('app_registered_users', JSON.stringify(updated));
    setEditingAdminUser(null);
    alert("Usuário atualizado com sucesso no dispositivo!");
  };

  const handleAdminResetPassword = async () => {
    if(!editingAdminUser) return;
    try {
        await sendPasswordResetEmail(auth, editingAdminUser.email);
        alert(`Email oficial de redefinição enviado para ${editingAdminUser.email}!`);
    } catch (err) {
        alert("Erro ao enviar email: " + err.message);
    }
  };

  const removeUserLocal = (uid) => {
    if(window.confirm('Isto removerá o registo apenas desta lista local (Não apaga a conta real no Firebase). Prosseguir?')) {
      const updated = registeredUsers.filter(u => u.uid !== uid);
      setRegisteredUsers(updated);
      localStorage.setItem('app_registered_users', JSON.stringify(updated));
    }
  };

  // Perfil Usuário Comum
  const [fullName, setFullName] = useState(localStorage.getItem(`fullName_${user?.uid}`) || '');
  const [profileName, setProfileName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  const triggerPremiumModal = (e) => {
    if (e) e.preventDefault();
    setShowPaymentModal(true);
  };

  // CATEGORY CRUD
  const openCategoryModal = (cat = null) => {
    if (!isPremium) return triggerPremiumModal();
    if (cat) {
      setEditingCategory(cat);
      setNewCat({ name: cat.name, belt: cat.belt || '', gender: cat.gender || '' });
    } else {
      setEditingCategory(null);
      setNewCat({ name: '', belt: '', gender: '' });
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const catData = { ...newCat, name: newCat.name.toUpperCase() || 'CATEGORIA GERAL' };
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, ...catData } : c));
    } else {
      setCategories([...categories, { ...catData, id: Date.now(), fights: [] }]);
    }
    setShowCategoryModal(false);
  };

  const removeCategory = (catId) => {
    if(window.confirm("Tem certeza que deseja remover esta categoria inteira e todas as suas lutas?")) {
      setCategories(categories.filter(c => c.id !== catId));
    }
  };

  // FIGHT CRUD
  const openFightModal = (mode, data = null, catId = null) => {
    if (!isPremium) return triggerPremiumModal();
    setAddingFightToCat(catId); 
    if (mode === 'edit' && data) {
      setEditingFight(data);
      setNewFight({
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || '', belt: data.belt || '', gender: data.gender || '', phase: data.phase || 'LUTA LIVRE',
        f1Name: data.f1Name || '', f1Team: data.f1Team || '', f2Name: data.f2Name || '', f2Team: data.f2Team || ''
      });
    } else {
      setEditingFight(null);
      setNewFight({ 
        date: new Date().toISOString().split('T')[0], 
        category: '', belt: '', gender: '', phase: catId ? 'FASE DE GRUPOS' : 'LUTA LIVRE', f1Name: '', f1Team: '', f2Name: '', f2Team: '' 
      });
    }
    setShowFightModal(true);
  };

  const handleSaveFight = (e) => {
    e.preventDefault();
    
    const fightData = { 
      ...newFight, 
      f1Name: newFight.f1Name.toUpperCase(), f1Team: newFight.f1Team.toUpperCase(),
      f2Name: newFight.f2Name.toUpperCase(), f2Team: newFight.f2Team.toUpperCase()
    };

    if (!editingFight) {
      const selectedDate = newFight.date;
      const fightsTodayQueue = queue.filter(f => f.date === selectedDate).length;
      const fightsTodayCats = categories.reduce((sum, cat) => sum + cat.fights.filter(f => f.date === selectedDate).length, 0);
      if (fightsTodayQueue + fightsTodayCats >= 100) return alert("Limite de 100 lutas alcançado para a data selecionada.");
    }

    if (editingFight) {
      if (addingFightToCat) {
        setCategories(categories.map(c => c.id === addingFightToCat ? { ...c, fights: c.fights.map(f => f.id === editingFight.id ? { ...f, ...fightData } : f) } : c));
      } else {
        setQueue(queue.map(f => f.id === editingFight.id ? { ...f, ...fightData } : f));
      }
    } else {
      const newF = { ...fightData, id: Date.now(), status: 'pending' };
      if (addingFightToCat) {
        setCategories(categories.map(c => c.id === addingFightToCat ? { ...c, fights: [...c.fights, newF] } : c));
      } else {
        setQueue([...queue, newF]);
      }
    }
    setShowFightModal(false);
  };

  const removeFight = (id, catId = null) => {
    if(window.confirm("Tem certeza que deseja remover esta luta?")) {
      if (catId) setCategories(categories.map(c => c.id === catId ? { ...c, fights: c.fights.filter(f => f.id !== id) } : c));
      else setQueue(queue.filter(f => f.id !== id));
    }
  };

  const handleStartFightInternal = (fight, category) => {
    onStartFight({
      ...fight, catId: category.id, category: category.name, belt: category.belt, gender: category.gender
    });
  };

  const triggerPrintLocal = (mode, fight = null) => {
    if (!isPremium) return triggerPremiumModal();
    setPrintMode({ type: mode, data: fight });
    setTimeout(() => { window.print(); setPrintMode(null); }, 100);
  };

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
    setProfileMessage({ text: '', type: '' });
    try {
      localStorage.setItem(`fullName_${user?.uid}`, fullName);
      if (profileName !== user.displayName) await updateProfile(auth.currentUser, { displayName: profileName.toUpperCase() });

      if (newPassword) {
        if (newPassword !== confirmNewPassword) { setProfileMessage({ text: 'As novas senhas não coincidem.', type: 'error' }); return; }
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!strongRegex.test(newPassword)) { setProfileMessage({ text: 'Senha fraca.', type: 'error' }); return; }
        await updatePassword(auth.currentUser, newPassword);
      }
      setProfileMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      setNewPassword(''); setConfirmNewPassword('');
      setTimeout(() => setShowProfileModal(false), 2000);
    } catch (error) {
      setProfileMessage({ text: 'Erro ao atualizar perfil. Faça logout e entre novamente.', type: 'error' });
    }
  };

  const handlePayment = async (planName, price, durationDays) => {
    let finalPrice = price;
    let appliedDiscount = 0;
    setCouponMessage({ text: '', type: '' });

    if (couponCode.trim() !== '') {
      const code = couponCode.trim().toUpperCase();
      const couponData = coupons[code];
      
      if (couponData && couponData.uses > 0) {
        if (couponData.plan !== 'TODOS' && couponData.plan !== planName) {
            setCouponMessage({ text: `Este cupom só é válido para o plano: ${couponData.plan}`, type: 'error' });
            return;
        }
        appliedDiscount = price * couponData.discount;
        finalPrice = Number((price - appliedDiscount).toFixed(2));
      } else if (couponData && couponData.uses <= 0) {
        setCouponMessage({ text: 'Este cupom já atingiu o limite de usos.', type: 'error' });
        return;
      } else {
        setCouponMessage({ text: 'Cupom inválido ou expirado.', type: 'error' });
        return;
      }
    }

    setIsProcessingPayment(true);
    sessionStorage.setItem('pendingPlanDays', durationDays);
    sessionStorage.setItem('pendingPlanName', planName);
    
    const receiptData = {
        planName,
        price,
        discount: appliedDiscount,
        finalPrice,
        date: Date.now(),
        coupon: couponCode.trim().toUpperCase() || 'Nenhum'
    };
    sessionStorage.setItem('pendingReceipt', JSON.stringify(receiptData));

    if (couponCode.trim() !== '') {
      sessionStorage.setItem('pendingUsedCoupon', couponCode.trim().toUpperCase());
    }

    if (finalPrice <= 0) {
        alert("Cupom de 100% aplicado! Assinatura ativada.");
        if (couponCode.trim() !== '') {
          const code = couponCode.trim().toUpperCase();
          const updatedCoupons = { ...coupons, [code]: { ...coupons[code], uses: coupons[code].uses - 1 } };
          setCoupons(updatedCoupons);
          localStorage.setItem('app_coupons', JSON.stringify(updatedCoupons));
        }
        window.location.href = window.location.origin + window.location.pathname + '?payment=success';
        return;
    }

    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ 
            title: planName, 
            description: `Acesso Premium - ${planName} ${couponCode ? `(Cupom: ${couponCode.toUpperCase()})` : ''}`, 
            quantity: 1, 
            currency_id: 'BRL', 
            unit_price: finalPrice 
          }],
          back_urls: {
            success: window.location.origin + window.location.pathname + '?payment=success',
            failure: window.location.origin + window.location.pathname + '?payment=failure',
            pending: window.location.origin + window.location.pathname + '?payment=pending'
          },
          auto_return: 'approved'
        })
      });
      
      const data = await response.json();
      
      if (data.init_point) {
        window.location.href = data.init_point; 
      }
      else throw new Error("Falha no link.");
    } catch (error) {
      alert("Erro ao conectar com o Mercado Pago.");
      setIsProcessingPayment(false);
    }
  };

  const renderFightList = (fightsList, catId = null) => {
    const grouped = fightsList.reduce((acc, f) => {
      const d = f.date || new Date(f.id).toISOString().split('T')[0];
      if (!acc[d]) acc[d] = [];
      acc[d].push(f);
      return acc;
    }, {});

    return Object.keys(grouped).sort().map(dateStr => (
      <div key={dateStr} className="mb-6 last:mb-0">
        <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
          <Calendar size={14} className="text-blue-500" />
          <h4 className="text-blue-400 font-black uppercase tracking-widest text-[10px]">
            Data do Evento: {new Date(dateStr + 'T12:00:00').toLocaleDateString()}
          </h4>
        </div>
        <div className="space-y-4">
          {grouped[dateStr].map((fight, index) => {
            const winner = fight.status === 'finished' ? getWinner(fight.result) : 0;
            return (
              <div 
                key={fight.id} 
                draggable={fight.status !== 'finished'}
                onDragStart={(e) => {
                   e.dataTransfer.setData('text/plain', fight.id.toString());
                   e.currentTarget.classList.add('opacity-40', 'border-blue-500');
                }}
                onDragEnd={(e) => {
                   e.currentTarget.classList.remove('opacity-40', 'border-blue-500');
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropFight(e, fight.id, catId)}
                className={`border rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 transition-all ${fight.status === 'finished' ? 'border-green-900/50 bg-green-900/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
              >
                {/* Drag Handle */}
                <div className={`hidden md:flex shrink-0 pr-2 ${fight.status === 'finished' ? 'opacity-0 cursor-default' : 'cursor-grab hover:text-white text-zinc-600 active:cursor-grabbing'}`}>
                   <GripVertical size={20} />
                </div>

                <div className="hidden md:flex flex-col items-center justify-center px-4 border-r border-zinc-800/50 shrink-0">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{fight.phase}</span>
                  <span className="text-zinc-400 font-black text-xl">#{index + 1}</span>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-3 items-center gap-2">
                  <div className="text-right pr-4 border-r border-zinc-800/50">
                    <p className={`font-black text-sm uppercase truncate ${winner === 1 ? 'text-yellow-400' : 'text-white'}`}>{fight.f1Name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{fight.f1Team}</p>
                  </div>
                  <div className="text-center flex justify-center">
                     {fight.status === 'finished' ? (
                        <div className="font-black text-lg text-green-500 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">{fight.result.f1.points} x {fight.result.f2.points}</div>
                     ) : <span className="font-black text-zinc-600 italic text-xs">VS</span>}
                  </div>
                  <div className="text-left pl-4 border-l border-zinc-800/50">
                    <p className={`font-black text-sm uppercase truncate ${winner === 2 ? 'text-yellow-400' : 'text-white'}`}>{fight.f2Name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase truncate">{fight.f2Team}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                  <button onClick={() => openFightModal('edit', fight, catId)} className="p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => removeFight(fight.id, catId)} className="p-3 bg-zinc-900 hover:bg-red-900/40 text-red-500 rounded-xl transition-colors"><Trash2 size={16} /></button>
                  {fight.status === 'finished' && (
                    <button onClick={() => triggerPrintLocal('single', catId ? { ...fight, category: categories.find(c => c.id===catId)?.name, belt: categories.find(c => c.id===catId)?.belt, gender: categories.find(c => c.id===catId)?.gender } : fight)} className="p-3 bg-zinc-900 hover:bg-blue-900/40 text-blue-500 rounded-xl transition-colors"><Printer size={16} /></button>
                  )}
                  <button onClick={() => catId ? handleStartFightInternal(fight, categories.find(c=>c.id===catId)) : onStartFight(fight)} className={`px-4 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${fight.status === 'finished' ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-green-600 hover:bg-green-500 text-white'}`}>
                    {fight.status === 'finished' ? 'Reabrir' : <><Play size={14} fill="currentColor" /> Iniciar</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-white font-sans relative ${printMode ? 'print:bg-white print:text-black' : ''}`}>
      
      {/* SECÇÃO IMPRESSÃO */}
      {printMode && (
        <div className="hidden print:flex flex-col p-4 w-full min-h-screen">
          {printMode.type === 'single' && (
            <div className="border-[8px] border-double border-zinc-300 p-4 flex-1 flex flex-col">
              <PrintBoletim data={{...printMode.data, ...printMode.data.result}} logoUrl={logoUrl} user={user} />
            </div>
          )}
          {printMode.type === 'receipt' && (
            <PrintReceipt data={printMode.data} logoUrl={logoUrl} user={user} />
          )}
          {printMode.type === 'all' && (
            <div className="w-full">
              <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                <div className="text-right">
                  <h1 className="text-2xl font-black tracking-tighter mb-0">RELATÓRIO GERAL</h1>
                  <p className="text-sm font-bold text-zinc-600 uppercase">{user?.displayName || 'SISTEMA OFICIAL'}</p>
                </div>
              </div>
              <table className="w-full text-sm text-left border-collapse border border-zinc-300">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border border-zinc-300 p-2 font-black uppercase">Data/Hora</th>
                    <th className="border border-zinc-300 p-2 font-black uppercase">Categoria / Faixa / Sexo</th>
                    <th className="border border-zinc-300 p-2 font-black uppercase text-right">Lutador 1</th>
                    <th className="border border-zinc-300 p-2 font-black uppercase text-center">Placar</th>
                    <th className="border border-zinc-300 p-2 font-black uppercase">Lutador 2</th>
                  </tr>
                </thead>
                <tbody>
                  {fightHistory.map(record => {
                    const winner = getWinner(record);
                    return (
                      <tr key={record.id}>
                        <td className="border border-zinc-300 p-2 font-mono text-xs">
                          {new Date(record.timestamp).toLocaleDateString()} <br/>
                          {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="border border-zinc-300 p-2 font-bold text-xs uppercase">{[record.category, record.belt, record.gender].filter(Boolean).join(' • ') || '-'}</td>
                        <td className="border border-zinc-300 p-2 text-right">
                          <div className={`font-bold uppercase text-xs ${winner === 1 ? 'underline' : ''}`}>{record.f1.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase">V:{record.f1.advantages} P:{record.f1.penalties}</div>
                        </td>
                        <td className="border border-zinc-300 p-2 text-center font-black text-lg bg-zinc-50">{record.f1.points} x {record.f2.points}</td>
                        <td className="border border-zinc-300 p-2 text-left">
                          <div className={`font-bold uppercase text-xs ${winner === 2 ? 'underline' : ''}`}>{record.f2.name}</div>
                          <div className="text-[10px] text-zinc-500 uppercase">V:{record.f2.advantages} P:{record.f2.penalties}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAIS APLICAÇÃO */}
      <div className="print:hidden">
        
        {/* Modal Perfil e Admin User Edit*/}
        {editingAdminUser && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="max-w-md w-full bg-zinc-900 border border-purple-500/50 rounded-3xl p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setEditingAdminUser(null)} className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-400 hover:text-white"><X size={24}/></button>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-2"><User size={24} className="text-purple-500"/> Editar Usuário</h2>
              <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">{editingAdminUser.name}</p>
              <p className="text-zinc-500 text-xs mb-6">{editingAdminUser.email}</p>
              
              <form onSubmit={handleAdminSaveUser} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Plano Atual</label>
                  <select value={editUserPlan} onChange={e => setEditUserPlan(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-purple-500 outline-none uppercase text-sm text-zinc-300 cursor-pointer">
                    <option value="GRATUITO">GRATUITO (Sem Acesso)</option>
                    {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                
                {editUserPlan !== 'GRATUITO' && (
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Adicionar Dias de Acesso</label>
                    <input type="number" min="1" value={editUserDays} onChange={e => setEditUserDays(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-purple-500 outline-none uppercase text-sm text-zinc-300" />
                  </div>
                )}

                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl uppercase tracking-widest mt-4 shadow-lg active:scale-95 transition-all">Salvar Alterações</button>
              </form>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                 <button type="button" onClick={handleAdminResetPassword} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <Mail size={14}/> Enviar Redefinição de Senha
                 </button>
              </div>
            </div>
          </div>
        )}

        {showProfileModal && !editingAdminUser && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-400 hover:text-white"><X size={24}/></button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} className="text-white" /></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">O Meu Perfil</h2>
                <p className="text-zinc-400 text-sm mt-1">{user?.email}</p>
              </div>
              {user?.email === 'Conta Gratuita' ? (
                <p className="text-center text-zinc-500 text-sm">Modo de visitante temporário.</p>
              ) : (
                <>
                  {/* DETALHES DO PLANO PREMIUM DO USUÁRIO */}
                  {isPremium && (
                    <div className="mb-6 p-5 bg-zinc-950 border border-yellow-500/30 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full pointer-events-none"></div>
                      <h3 className="text-yellow-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                        <Crown size={16}/> Sua Assinatura
                      </h3>
                      <div className="space-y-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span>Plano Atual:</span>
                          <span className="text-white text-xs">{localStorage.getItem(`premiumPlan_${user.uid}`) || 'Premium'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span>Data de Ativação:</span>
                          <span className="text-white">{localStorage.getItem(`premiumSince_${user.uid}`) ? new Date(parseInt(localStorage.getItem(`premiumSince_${user.uid}`))).toLocaleDateString() : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Válido Até:</span>
                          <span className="text-yellow-500">{localStorage.getItem(`premiumUntil_${user.uid}`) ? new Date(parseInt(localStorage.getItem(`premiumUntil_${user.uid}`))).toLocaleDateString() : '-'}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => {
                        const receiptStr = localStorage.getItem(`lastReceipt_${user.uid}`);
                        if (receiptStr) {
                           setShowProfileModal(false);
                           onShowReceipt(JSON.parse(receiptStr));
                        } else {
                           alert('Nenhum recibo encontrado no histórico deste dispositivo.');
                        }
                      }} className="w-full mt-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-zinc-700 font-black shadow-sm">
                        <Printer size={14}/> Visualizar Recibo
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    {profileMessage.text && <div className={`p-3 rounded-lg text-sm text-center font-bold ${profileMessage.type === 'error' ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>{profileMessage.text}</div>}
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Nome Completo</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value.toUpperCase())} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Nome de Exibição (Placar / Impressão)</label>
                      <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value.toUpperCase())} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase text-sm" />
                    </div>
                    <div className="pt-4 border-t border-zinc-800 mt-2">
                      <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Alterar Senha</h3>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm mb-3" placeholder="Nova Senha Forte" />
                      <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" placeholder="Confirmar Nova Senha" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-4">Salvar</button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal Pagamento */}
        {showPaymentModal && !isPremium && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="max-w-6xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8">
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-400 hover:text-white"><X size={32}/></button>
              <div className="text-center mb-8">
                <Crown size={48} className="text-yellow-500 mx-auto mb-4" />
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Desbloquear Premium</h2>
                <p className="text-zinc-400 mt-2">Ative um plano para libertar a Fila de Lutas, Histórico, Impressão PDF e Logo Customizada.</p>
              </div>

              {/* CAMPO DE CUPOM */}
              <div className="max-w-sm mx-auto mb-10">
                <input
                  type="text"
                  placeholder="TEM UM CUPOM DE DESCONTO?"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase text-center font-bold tracking-widest text-sm transition-colors focus:bg-zinc-900"
                />
                {couponMessage.text && (
                  <p className={`mt-2 text-xs font-bold text-center uppercase tracking-widest ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              <div className={`grid md:grid-cols-${Math.min(plans.length, 3)} gap-8`}>
                {plans.map(plan => (
                  <div key={plan.id} className={`bg-zinc-950 border-2 ${plan.isPopular ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-zinc-800 hover:border-blue-500'} transition-all rounded-2xl p-6 relative flex flex-col`}>
                    {plan.isPopular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Mais Popular</div>}
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div><h3 className={`text-2xl font-black uppercase ${plan.isPopular ? 'text-yellow-500' : 'text-blue-400'}`}>{plan.name}</h3><p className="text-zinc-500 font-bold text-sm uppercase">Acesso por {plan.durationDays} Dias</p></div>
                      {plan.isPopular ? <Calendar size={32} className="text-yellow-500" /> : <Zap size={32} className="text-blue-500" />}
                    </div>
                    <div className="text-5xl font-black mb-6">R$ {plan.price}<span className="text-xl text-zinc-500">,00</span></div>
                    <ul className="space-y-3 text-sm text-zinc-300 font-medium mb-8 flex-1">
                      {plan.features.split(',').map((feature, i) => (
                        <li key={i} className="flex items-start gap-2"><div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${plan.isPopular ? 'bg-yellow-500' : 'bg-blue-500'}`}></div> {feature.trim()}</li>
                      ))}
                    </ul>
                    <button onClick={() => handlePayment(plan.name, plan.price, plan.durationDays)} disabled={isProcessingPayment} className={`w-full mt-auto font-black py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 ${plan.isPopular ? 'bg-yellow-500 hover:bg-yellow-400 text-black disabled:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-800'}`}>
                      {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={20} /> Pagar com PIX/Cartão</>}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal CRUD Categoria */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowCategoryModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-400 hover:text-white"><X size={24}/></button>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2"><FolderPlus size={24}/> {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <input value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value.toUpperCase()})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-sm" placeholder="NOME DA CATEGORIA (EX: ADULTO LEVE)" required />
                </div>
                <div>
                  <select value={newCat.belt} onChange={e => setNewCat({...newCat, belt: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-sm text-zinc-400 cursor-pointer">
                    <option value="">FAIXA (OPCIONAL)</option>
                    {BELTS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <select value={newCat.gender} onChange={e => setNewCat({...newCat, gender: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-sm text-zinc-400 cursor-pointer">
                    <option value="">SEXO (OPCIONAL)</option>
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMININO">FEMININO</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-widest mt-4">Salvar Categoria</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal CRUD Luta */}
        {showFightModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">
              <button onClick={() => setShowFightModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-zinc-400 hover:text-white"><X size={24}/></button>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2"><GitMerge size={24}/> {editingFight ? 'Editar Luta' : 'Adicionar Luta'}</h2>
              <form onSubmit={handleSaveFight} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Data da Luta</label>
                    <input type="date" required value={newFight.date} onChange={e => setNewFight({...newFight, date: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-xs text-zinc-300" />
                  </div>
                  
                  {addingFightToCat === null ? (
                    <>
                      <div className="col-span-2">
                        <input value={newFight.category} onChange={e => setNewFight({...newFight, category: e.target.value.toUpperCase()})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-xs" placeholder="CATEGORIA / PESO (OPCIONAL)" />
                      </div>
                      <select value={newFight.belt} onChange={e => setNewFight({...newFight, belt: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-xs text-zinc-400">
                        <option value="">FAIXA...</option>
                        {BELTS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <select value={newFight.gender} onChange={e => setNewFight({...newFight, gender: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-xs text-zinc-400">
                        <option value="">SEXO...</option><option value="MASCULINO">MASCULINO</option><option value="FEMININO">FEMININO</option>
                      </select>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Fase da Luta</label>
                      <select value={newFight.phase} onChange={e => setNewFight({...newFight, phase: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 focus:border-blue-500 outline-none uppercase text-sm text-blue-400 font-bold cursor-pointer">
                        {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-green-600 space-y-2 mt-4">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Lutador 1 (Verde)</span>
                  <input required value={newFight.f1Name} onChange={e => setNewFight({...newFight, f1Name: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="NOME DO ATLETA" />
                  <input required value={newFight.f1Team} onChange={e => setNewFight({...newFight, f1Team: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="EQUIPE" />
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border-l-4 border-zinc-600 space-y-2">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lutador 2 (Branco)</span>
                  <input required value={newFight.f2Name} onChange={e => setNewFight({...newFight, f2Name: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="NOME DO ATLETA" />
                  <input required value={newFight.f2Team} onChange={e => setNewFight({...newFight, f2Team: e.target.value.toUpperCase()})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm outline-none uppercase" placeholder="EQUIPE" />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-widest mt-4 shadow-lg active:scale-95">Salvar Luta</button>
              </form>
            </div>
          </div>
        )}

        {/* HEADER GERAL */}
        <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-6 pt-4 md:pt-8 px-4 md:px-0">
          <div className="flex items-center gap-4">
            <label onClick={(e) => { if(!isPremium) triggerPremiumModal(e); }} className="relative group cursor-pointer block">
              <img src={logoUrl} alt="Logo" className="h-12 md:h-16 w-auto drop-shadow-lg object-contain bg-white/10 rounded" />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded transition-opacity"><ImagePlus className="text-white" size={24} /></div>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={!isPremium} />
              {!isPremium && <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-1 rounded-full"><Lock size={10} /></div>}
            </label>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase flex items-center gap-2">Painel de Evento {isPremium ? <Crown size={20} className="text-yellow-500" /> : <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 rounded-full">GRATUITO</span>}</h1>
              <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setShowProfileModal(true)} className="text-zinc-400 hover:text-white font-bold text-[10px] md:text-xs uppercase transition-colors flex items-center gap-2">
              <User size={16} /> <span className="hidden md:inline">A Minha Conta</span>
            </button>
            <button onClick={onLogout} className="text-zinc-500 hover:text-red-500 font-bold text-[10px] md:text-xs uppercase transition-colors flex items-center gap-2 border-l border-zinc-800 pl-4 md:pl-6">
              <LogOut size={16} /> <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT DO DASHBOARD */}
        <main className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
          
          <nav className="flex flex-wrap gap-4 md:gap-6 mb-8 border-b border-zinc-800">
            <button onClick={() => setActiveTab('queue')} className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'queue' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Fila Livre</button>
            <button onClick={() => setActiveTab('categories')} className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'categories' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Categorias e Chaves</button>
            <button onClick={() => setActiveTab('plans')} className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'plans' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Planos</button>
            {isAdmin && <button onClick={() => setActiveTab('admin')} className={`pb-3 font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'admin' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-zinc-600 hover:text-zinc-400'}`}>Administração</button>}
          </nav>

          {/* TAB: PLANOS (Público) */}
          {activeTab === 'plans' && (
            <div className="space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative overflow-hidden">
                <div className="text-center mb-8">
                  <Crown size={48} className="text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Planos Premium</h2>
                  <p className="text-zinc-400 mt-2 text-sm md:text-base">Escolha o plano ideal para as suas necessidades e libere todos os recursos do sistema.</p>
                </div>
                
                {isPremium && (
                  <div className="mb-8 p-4 bg-green-900/20 border border-green-500/50 rounded-2xl text-center max-w-2xl mx-auto">
                    <p className="text-green-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle size={18} /> Você já possui uma assinatura Premium ativa!
                    </p>
                  </div>
                )}

                {/* CAMPO DE CUPOM */}
                <div className="max-w-sm mx-auto mb-10">
                  <input
                    type="text"
                    placeholder="TEM UM CUPOM DE DESCONTO?"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none uppercase text-center font-bold tracking-widest text-sm transition-colors focus:bg-zinc-900"
                  />
                  {couponMessage.text && (
                    <p className={`mt-2 text-xs font-bold text-center uppercase tracking-widest ${couponMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                <div className={`grid md:grid-cols-${Math.min(plans.length, 3)} gap-8 max-w-5xl mx-auto`}>
                  {plans.map(plan => (
                    <div key={plan.id} className={`bg-zinc-950 border-2 ${plan.isPopular ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-zinc-800 hover:border-blue-500'} transition-all rounded-2xl p-6 relative flex flex-col`}>
                      {plan.isPopular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Mais Popular</div>}
                      <div className="flex justify-between items-start mb-4 mt-2">
                        <div><h3 className={`text-2xl font-black uppercase ${plan.isPopular ? 'text-yellow-500' : 'text-blue-400'}`}>{plan.name}</h3><p className="text-zinc-500 font-bold text-sm uppercase">Acesso por {plan.durationDays} Dias</p></div>
                        {plan.isPopular ? <Calendar size={32} className="text-yellow-500" /> : <Zap size={32} className="text-blue-500" />}
                      </div>
                      <div className="text-5xl font-black mb-6">R$ {plan.price}<span className="text-xl text-zinc-500">,00</span></div>
                      <ul className="space-y-3 text-sm text-zinc-300 font-medium mb-8 flex-1">
                        {plan.features.split(',').map((feature, i) => (
                          <li key={i} className="flex items-start gap-2"><div className={`w-1.5 h-1.5 mt-1.5 rounded-full shrink-0 ${plan.isPopular ? 'bg-yellow-500' : 'bg-blue-500'}`}></div> {feature.trim()}</li>
                        ))}
                      </ul>
                      <button onClick={() => handlePayment(plan.name, plan.price, plan.durationDays)} disabled={isProcessingPayment} className={`w-full mt-auto font-black py-4 rounded-xl shadow-lg flex justify-center items-center gap-2 ${plan.isPopular ? 'bg-yellow-500 hover:bg-yellow-400 text-black disabled:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-500 text-white disabled:bg-blue-800'}`}>
                        {isProcessingPayment ? <Loader2 className="animate-spin" /> : <><QrCode size={20} /> Pagar com PIX/Cartão</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ADMIN */}
          {activeTab === 'admin' && isAdmin && (
            <div className="space-y-6">
              {/* SubNavegação Admin */}
              <div className="flex flex-wrap gap-4 border-b border-zinc-800/50 mb-6">
                 <button onClick={() => setAdminSubTab('plans')} className={`pb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${adminSubTab === 'plans' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}>Planos Premium</button>
                 <button onClick={() => setAdminSubTab('users')} className={`pb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${adminSubTab === 'users' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}>Usuários</button>
                 <button onClick={() => setAdminSubTab('coupons')} className={`pb-2 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${adminSubTab === 'coupons' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-600 hover:text-zinc-400'}`}>Cupons</button>
              </div>

              {adminSubTab === 'plans' && (
                <div className="bg-zinc-900 border border-purple-500/30 p-4 md:p-8 rounded-3xl relative overflow-hidden">
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-purple-400"><Package size={24}/> Gerir Planos de Subscrição</h2>
                  <form onSubmit={handleAddPlan} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div>
                         <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Nome do Plano</label>
                         <input type="text" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 text-sm" placeholder="Ex: Passe Fim de Semana" required />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Duração (Dias)</label>
                         <input type="number" min="1" value={newPlan.durationDays} onChange={e => setNewPlan({...newPlan, durationDays: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 text-sm" required />
                       </div>
                       <div>
                         <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Preço (R$)</label>
                         <input type="number" min="1" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 text-sm" required />
                       </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Funcionalidades (Separadas por vírgula)</label>
                        <input type="text" value={newPlan.features} onChange={e => setNewPlan({...newPlan, features: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-purple-500 text-sm" placeholder="Ex: Acesso total, Suporte prioritário" required />
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="checkbox" id="isPopular" checked={newPlan.isPopular} onChange={e => setNewPlan({...newPlan, isPopular: e.target.checked})} className="w-4 h-4 accent-purple-600 cursor-pointer" />
                        <label htmlFor="isPopular" className="text-sm font-bold text-zinc-400 cursor-pointer">Destacar como "Mais Popular"</label>
                     </div>
                     <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-black py-3 px-8 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest mt-2">Adicionar Plano</button>
                  </form>

                  <div className="mt-8 space-y-4">
                    {plans.map(plan => (
                      <div key={plan.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800 gap-4">
                         <div>
                           <div className="flex items-center gap-3">
                              <span className="font-black text-white text-lg tracking-widest uppercase">{plan.name}</span>
                              {plan.isPopular && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-[10px] font-black uppercase">Popular</span>}
                           </div>
                           <p className="text-xs text-zinc-500 mt-1">{plan.durationDays} Dias • R$ {plan.price},00</p>
                         </div>
                         <button onClick={() => removePlan(plan.id)} className="p-3 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-900 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminSubTab === 'users' && (
                <div className="bg-zinc-900 border border-purple-500/30 p-4 md:p-8 rounded-3xl relative overflow-hidden">
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2 text-purple-400"><Users size={24}/> Gestão de Usuários (Local)</h2>
                  <p className="text-xs text-zinc-500 mb-6">Esta lista mostra as contas e planos ativos. O sistema envia links oficiais de recuperação pelo Firebase.</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800">
                          <th className="p-3 font-black uppercase text-zinc-500">Cadastro</th>
                          <th className="p-3 font-black uppercase text-zinc-500">Nome (Academia)</th>
                          <th className="p-3 font-black uppercase text-zinc-500">Plano / Validade</th>
                          <th className="p-3 font-black uppercase text-zinc-500 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.length === 0 ? (
                          <tr><td colSpan="4" className="text-center p-6 text-zinc-600 font-bold uppercase">Nenhum registo local encontrado.</td></tr>
                        ) : (
                          registeredUsers.map(u => {
                            const isPremiumActive = u.premiumUntil && u.premiumUntil > Date.now();
                            return (
                              <tr key={u.uid} className="border-b border-zinc-800/50 hover:bg-zinc-950/50">
                                <td className="p-3 font-mono text-xs text-zinc-400">{new Date(u.date).toLocaleDateString()}</td>
                                <td className="p-3 font-bold uppercase">
                                  {u.name} <br/><span className="text-[10px] text-zinc-500 font-normal normal-case">{u.email}</span>
                                </td>
                                <td className="p-3 text-zinc-300 font-bold text-xs uppercase">
                                  {isPremiumActive ? (
                                    <>
                                      <div className="text-yellow-500 mb-1">{u.currentPlan}</div>
                                      <div className="text-[9px] text-zinc-500">Ativo: {u.premiumSince ? new Date(u.premiumSince).toLocaleDateString() : '-'}</div>
                                      <div className="text-[9px] text-zinc-500">Expira: {new Date(u.premiumUntil).toLocaleDateString()}</div>
                                    </>
                                  ) : <span className="text-zinc-500 mt-2 block">GRATUITO</span>}
                                </td>
                                <td className="p-3 text-right">
                                  <button onClick={() => openAdminUserEdit(u)} className="p-2 bg-zinc-800 hover:bg-purple-600 hover:text-white rounded-lg transition-colors mr-2"><Edit2 size={14}/></button>
                                  <button onClick={() => removeUserLocal(u.uid)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors"><X size={14}/></button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSubTab === 'coupons' && (
                <div className="bg-zinc-900 border border-purple-500/30 p-4 md:p-8 rounded-3xl relative overflow-hidden">
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 text-purple-400"><Tag size={24}/> Gestão de Cupons de Desconto (Admin)</h2>
                  <form onSubmit={handleAddCoupon} className="flex flex-col md:flex-row gap-4 items-end bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                     <div className="flex-1 w-full md:w-auto">
                       <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Código do Cupom</label>
                       <input type="text" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none uppercase text-sm" placeholder="EX: OSS20" required />
                     </div>
                     <div className="w-full md:w-24">
                       <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Desconto (%)</label>
                       <input type="number" min="1" max="100" value={newCouponDiscount} onChange={(e) => setNewCouponDiscount(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm" placeholder="EX: 20" required />
                     </div>
                     <div className="w-full md:w-24">
                       <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Usos Limite</label>
                       <input type="number" min="1" value={newCouponUses} onChange={(e) => setNewCouponUses(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm" placeholder="EX: 10" required />
                     </div>
                     <div className="w-full md:w-48">
                       <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Plano Válido</label>
                       <select value={newCouponPlan} onChange={(e) => setNewCouponPlan(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm">
                         <option value="TODOS">Todos os Planos</option>
                         {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                       </select>
                     </div>
                     <button type="submit" className="w-full md:w-auto bg-purple-600 hover:bg-purple-500 text-white font-black py-3 px-6 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest h-[46px]">
                       Criar
                     </button>
                  </form>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(coupons).map(([code, data]) => (
                      <div key={code} className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                         <div>
                           <span className="font-black text-white text-lg tracking-widest">{code}</span>
                           <div className="flex gap-2 mt-1 flex-wrap">
                             <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold">{(data.discount * 100).toFixed(0)}% OFF</span>
                             <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold">Restam: {data.uses}</span>
                             <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-bold">{data.plan === 'TODOS' ? 'Todos os Planos' : data.plan}</span>
                           </div>
                         </div>
                         <button onClick={() => removeCoupon(code)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors bg-zinc-900 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    {Object.keys(coupons).length === 0 && (
                       <div className="col-span-full text-center text-zinc-500 text-sm py-4">Nenhum cupom ativo no sistema.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: FILA DE LUTAS GERAL */}
          {activeTab === 'queue' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-900 border border-zinc-800 p-6 rounded-3xl gap-4">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-100"><ListOrdered size={24} className="text-blue-500"/> Fila Livre (Lutas Individuais)</h2>
                  <p className="text-sm text-zinc-500 mt-1">Adicione lutas rápidas fora de uma chave estruturada.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => onStartFight(null)} className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all">
                    Placar Avulso {!isPremium && <span className="bg-black/20 px-2 py-0.5 rounded text-[9px] ml-1">GRÁTIS</span>}
                  </button>
                  <button onClick={() => openFightModal('add')} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all">
                    <Plus size={16}/> Luta
                  </button>
                </div>
              </div>

              <div className="lg:col-span-3">
                {queue.length === 0 ? (
                  <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center text-zinc-500 font-medium">Nenhuma luta na fila geral.</div>
                ) : (
                  <div>{renderFightList(queue)}</div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIAS E CHAVES */}
          {activeTab === 'categories' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-100"><Folder size={24} className="text-blue-500"/> Gestão de Categorias e Chaves</h2>
                  <p className="text-sm text-zinc-500 mt-1">Crie as categorias uma vez e organize as chaves (quartas, semi, final).</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => onStartFight(null)} className="md:hidden flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl shadow-lg transition-all">
                    Placar Avulso
                  </button>
                  <button onClick={() => openCategoryModal()} className="flex-1 md:w-auto bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                    <Plus size={16}/> Nova Categoria
                  </button>
                </div>
              </div>

              {categories.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-16 text-center text-zinc-500 font-medium">
                  <FolderPlus size={48} className="mx-auto mb-4 text-zinc-700" />
                  Nenhuma categoria criada. Comece por organizar a sua primeira chave.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
                      {/* Header da Categoria Customizado por Cor da Faixa */}
                      <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${getCategoryHeaderStyle(cat.belt)}`}>
                        <div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2">{cat.name}</h3>
                          <div className="flex flex-wrap gap-2">
                            {cat.belt && <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{cat.belt}</span>}
                            {cat.gender && <span className="bg-black/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{cat.gender}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => openCategoryModal(cat)} className="p-3 bg-black/20 hover:bg-black/40 rounded-xl transition-colors"><Edit2 size={16}/></button>
                          <button onClick={() => removeCategory(cat.id)} className="p-3 bg-black/20 hover:bg-black/40 text-red-400 rounded-xl transition-colors"><Trash2 size={16}/></button>
                          <button onClick={() => openFightModal('add', null, cat.id)} className="flex-1 md:w-auto bg-black/20 hover:bg-black/40 text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                            <Plus size={14}/> Luta na Chave
                          </button>
                        </div>
                      </div>

                      {/* Lista de Lutas da Categoria */}
                      <div className="p-6">
                        {cat.fights.length === 0 ? (
                          <div className="text-center text-zinc-600 text-sm font-bold uppercase tracking-widest py-8">Chave Vazia</div>
                        ) : (
                          <div>{renderFightList(cat.fights, cat.id)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Secção Limpeza e Relatório Geral */}
          {(activeTab === 'queue' || activeTab === 'categories') && (
            <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-2 text-zinc-300">
                  <Printer size={20}/> Relatórios e Limpeza
                  {!isPremium && <Lock size={16} className="text-yellow-500 ml-2" />}
                </h2>
                <p className="text-xs text-zinc-500 font-bold uppercase mt-1">Aviso: Os dados são limpos automaticamente após 5 dias.</p>
              </div>
              
              <div className="flex gap-3">
                 <button onClick={onClearAll} className="text-xs font-bold uppercase tracking-widest bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors border border-red-900/50 px-4 py-3 rounded-xl flex items-center gap-2">
                    <Trash2 size={14} /> Limpar Tudo
                 </button>
                 {fightHistory.length > 0 && isPremium && (
                   <button onClick={() => triggerPrintLocal('all')} className="text-xs font-bold uppercase tracking-widest bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-zinc-700 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg">
                     <Printer size={14} /> Imprimir Geral
                   </button>
                 )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ScoreboardScreen = ({ initialFightData, onBackToQueue, isPremium, logoUrl, onFinishFight, user, onRegisterRequest }) => {
  const [zoom, setZoom] = useState(1);
  const [matchTime, setMatchTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(matchTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Novos estados para Fullscreen e Modo Limpo
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cleanMode, setCleanMode] = useState(false);
  
  const [category, setCategory] = useState(initialFightData?.category || '');
  const [belt, setBelt] = useState(initialFightData?.belt || '');
  const [gender, setGender] = useState(initialFightData?.gender || '');
  const [phase, setPhase] = useState(initialFightData?.phase || '');

  const initialFighter1 = { name: initialFightData?.f1Name || '', team: initialFightData?.f1Team || '', points: 0, advantages: 0, penalties: 0 };
  const initialFighter2 = { name: initialFightData?.f2Name || '', team: initialFightData?.f2Team || '', points: 0, advantages: 0, penalties: 0 };
  
  const [fighter1, setFighter1] = useState(initialFighter1);
  const [fighter2, setFighter2] = useState(initialFighter2);

  const isDemo = user?.isDemo === true;

  useEffect(() => {
    if(initialFightData) {
      setCategory(initialFightData.category || '');
      setBelt(initialFightData.belt || '');
      setGender(initialFightData.gender || '');
      setPhase(initialFightData.phase || '');
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

  // Gestão da Tela Cheia
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleTimer = () => setIsRunning(!isRunning);

  const handleCompleteFight = (action) => {
    if (isDemo) {
      setShowFinishModal(false);
      setShowDemoAlert(true);
      return;
    }
    const scoreData = { category, belt, gender, phase, duration: matchTime / 60, f1: { ...fighter1 }, f2: { ...fighter2 } };
    onFinishFight(initialFightData?.catId, initialFightData?.id, scoreData, action);
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
      
      {/* Modal de Aviso Demo */}
      {showDemoAlert && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md print:hidden">
          <div className="max-w-md w-full bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl relative border border-zinc-800 text-center">
            <button onClick={() => setShowDemoAlert(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={24}/></button>
            <Crown size={48} className="mx-auto text-yellow-500 mb-4" />
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Desbloqueie o Placar</h2>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              Está a usar o modo de teste. Crie uma conta gratuita agora mesmo para alterar as configurações de tempo, imprimir boletins e gerir o seu campeonato completo!
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={onRegisterRequest} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest transition-all">
                Criar Conta Gratuita
              </button>
              <button onClick={() => setShowDemoAlert(false)} className="w-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl uppercase tracking-widest text-xs transition-all">
                Continuar a Testar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden print:flex flex-col p-4 w-full min-h-screen">
         <div className="border-[8px] border-double border-zinc-300 p-4 flex-1 flex flex-col">
           <PrintBoletim data={{ category, belt, gender, phase, duration: matchTime / 60, f1: fighter1, f2: fighter2 }} logoUrl={user?.logoUrl || logoUrl} user={user} />
         </div>
      </div>

      <div className="flex flex-col min-h-screen print:hidden" style={{ zoom: zoom }}>
        
        <div className={`p-4 md:p-6 flex items-center justify-between shadow-xl relative z-10 ${themeClasses.navBg}`}>
          
          <div className="hidden xl:flex items-center gap-6 w-1/3">
            {!cleanMode && (
              <button onClick={onBackToQueue} className="p-3 rounded-xl flex items-center gap-2 font-bold tracking-widest text-xs uppercase transition-all text-zinc-500 hover:text-white hover:bg-zinc-800 shrink-0">
                <ChevronLeft size={16} /> {isDemo ? 'Sair' : 'Fila'}
              </button>
            )}
            <div className={`flex items-center ${!cleanMode ? 'border-l border-zinc-800 pl-6' : ''} py-1 transition-all`}>
               <img src={logoUrl} alt="Logo" className="h-20 md:h-24 w-auto object-contain mr-6 drop-shadow-lg" />
               <div className="flex flex-col gap-1 w-full">
                 <input type="text" placeholder="CATEGORIA / PESO" value={category} onChange={(e) => setCategory(e.target.value.toUpperCase())} className="text-2xl lg:text-3xl bg-transparent focus:outline-none border-b-2 border-transparent focus:border-blue-600 uppercase font-black w-full tracking-tighter leading-none" />
                 {(belt || gender || phase) && (
                   <div className="flex items-center gap-2 mt-1 text-zinc-500 font-bold text-xs tracking-widest uppercase">
                      {[phase, belt, gender].filter(Boolean).join(' • ')}
                   </div>
                 )}
               </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center gap-8 md:gap-16 relative group/timer">
            {isDemo && <div className="absolute -top-6 bg-yellow-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Modo Demonstração</div>}
            <div className={`text-9xl md:text-[14rem] leading-none font-black tabular-nums tracking-tighter ${timeLeft === 0 ? 'text-blue-500 animate-pulse' : themeClasses.pointsColor}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`flex flex-col gap-4 transition-opacity duration-300 ${cleanMode ? 'opacity-0 group-hover/timer:opacity-100' : 'opacity-100'}`}>
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

          <div className="flex items-center justify-end gap-1 w-1/3">
            {!cleanMode && (
              <>
                {/* Botões de Zoom Discretos */}
                <div className="hidden md:flex items-center opacity-30 hover:opacity-100 transition-opacity mr-2 bg-black/10 rounded-full px-2">
                   <button onClick={() => setZoom(z => Math.max(0.5, z - 0.05))} className={`p-2 rounded-full hover:scale-110 transition-transform ${themeClasses.labelColor}`} title="Diminuir Tela"><Minus size={14} /></button>
                   <span className={`text-[10px] font-black w-9 text-center cursor-pointer ${themeClasses.pointsColor}`} onClick={() => setZoom(1)} title="Restaurar">{Math.round(zoom * 100)}%</span>
                   <button onClick={() => setZoom(z => Math.min(1.5, z + 0.05))} className={`p-2 rounded-full hover:scale-110 transition-transform ${themeClasses.labelColor}`} title="Aumentar Tela"><Plus size={14} /></button>
                </div>
                
                <button onClick={() => { if (isDemo) { setShowDemoAlert(true); return; } if (isPremium) { window.print() } else { alert("A impressão é um recurso Premium. Acesse a aba 'Minha Conta' para adquirir um plano.") } }} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn} ${!isPremium && !isDemo ? 'opacity-50' : ''}`} title="Imprimir Resultado">
                  <Printer size={24} />
                </button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn}`} title="Tema"><Sun size={24} className={isDarkMode ? 'hidden' : 'block'} /><Moon size={24} className={isDarkMode ? 'block' : 'hidden'} /></button>
                <button onClick={() => { if (isDemo) { setShowDemoAlert(true); return; } setShowSettings(!showSettings) }} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn}`} title="Ajustes de Tempo"><Settings size={24} /></button>
              </>
            )}
            
            <button onClick={() => setCleanMode(!cleanMode)} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn}`} title={cleanMode ? "Mostrar Controlos" : "Ocultar Controlos (Modo Limpo)"}>
              {cleanMode ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>

            <button onClick={toggleFullscreen} className={`p-4 rounded-full shadow-sm ${themeClasses.circleBtn} hidden md:block`} title="Tela Cheia">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </div>

        {showSettings && !isDemo && (
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

        {showFinishModal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className={`max-w-lg w-full p-10 rounded-3xl shadow-2xl text-center border border-zinc-800 ${themeClasses.menuBg}`}>
              <div className="flex justify-center mb-6"><CheckCircle size={64} className="text-blue-500" /></div>
              <h2 className="text-3xl font-black mb-2 tracking-tighter uppercase">Luta Encerrada</h2>
              
              {isDemo ? (
                 <>
                   <p className="text-zinc-400 mb-8 text-sm uppercase tracking-widest font-bold">Crie uma conta para salvar no histórico.</p>
                   <div className="flex flex-col gap-3">
                     <button onClick={onRegisterRequest} className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white transition-all">
                        Criar Conta Gratuita
                     </button>
                     <button onClick={() => {setShowFinishModal(false); executeLocalReset();}} className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-transparent border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all mt-2">
                        Testar Novamente
                     </button>
                   </div>
                 </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
          <FighterCard num={1} data={fighter1} setFighter={setFighter1} updateScore={(type, val) => updateFighterScore(1, type, val)} isGreenBelt={true} isDarkMode={isDarkMode} themeClasses={themeClasses} cleanMode={cleanMode} />
          <FighterCard num={2} data={fighter2} setFighter={setFighter2} updateScore={(type, val) => updateFighterScore(2, type, val)} isGreenBelt={false} isDarkMode={isDarkMode} themeClasses={themeClasses} cleanMode={cleanMode} />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  
  // Padrão de view alterado para 'landing' em vez de 'login'
  const [currentView, setCurrentView] = useState('landing'); 
  const [loginInitialRegister, setLoginInitialRegister] = useState(false);
  
  const [dashboardTab, setDashboardTab] = useState('queue'); 
  const [isLoading, setIsLoading] = useState(true);
  const [resetCode, setResetCode] = useState(null);
  const [pendingReceipt, setPendingReceipt] = useState(null);

  const defaultPlans = [
    { id: 1, name: 'Passe Torneio', durationDays: 3, price: 15, isPopular: false, features: 'Ideal para Campeonatos de Fim de Semana,Todas as funções desbloqueadas,Sem renovação automática' },
    { id: 2, name: 'Plano Mensal', durationDays: 30, price: 30, isPopular: true, features: 'Perfeito para Academias e Treinos Diários,Histórico ilimitado guardado no sistema,Sua própria Logo no Placar e PDFs' }
  ];
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('app_plans');
    return saved ? JSON.parse(saved) : defaultPlans;
  });

  const loadPremiumState = (uid) => {
    if (!uid) return false;
    const premiumUntil = localStorage.getItem(`premiumUntil_${uid}`);
    if (premiumUntil && parseInt(premiumUntil) > Date.now()) return true;
    return false;
  };

  const [isPremium, setIsPremium] = useState(false); 
  const [logoUrl, setLogoUrl] = useState("https://iili.io/qC543c7.png"); 
  
  const cleanOldData = (dataArray) => {
    const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
    return dataArray.filter(item => item.id > fiveDaysAgo);
  };

  const loadCategories = (uid) => {
    const saved = localStorage.getItem(`categories_${uid}`);
    if(!saved) return [];
    return JSON.parse(saved).map(cat => ({...cat, fights: cleanOldData(cat.fights)}));
  };
  
  const loadQueue = (uid) => {
    const saved = localStorage.getItem(`queue_${uid}`);
    return saved ? cleanOldData(JSON.parse(saved)) : [];
  };

  const loadHistory = (uid) => {
    const saved = localStorage.getItem(`history_${uid}`);
    return saved ? cleanOldData(JSON.parse(saved)) : [];
  };

  const [categories, setCategories] = useState([]);
  const [queue, setQueue] = useState([]);
  const [fightHistory, setFightHistory] = useState([]);
  const [activeFight, setActiveFight] = useState(null);

  useEffect(() => {
    if(user?.uid && isPremium) {
      localStorage.setItem(`categories_${user.uid}`, JSON.stringify(categories));
      localStorage.setItem(`queue_${user.uid}`, JSON.stringify(queue));
      localStorage.setItem(`history_${user.uid}`, JSON.stringify(fightHistory));
    }
  }, [categories, queue, fightHistory, user, isPremium]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const actionCode = urlParams.get('oobCode');

    if (mode === 'resetPassword' && actionCode) {
       setResetCode(actionCode);
       setCurrentView('resetPassword');
       setIsLoading(false);
       return; 
    }

    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      if (user) {
        setIsPremium(true);
        const pendingDays = parseInt(sessionStorage.getItem('pendingPlanDays')) || 30;
        const pendingPlanName = sessionStorage.getItem('pendingPlanName') || 'Premium';
        const now = Date.now();
        const until = now + (pendingDays * 24 * 60 * 60 * 1000);
        
        localStorage.setItem(`premiumUntil_${user.uid}`, until);
        
        const usersList = JSON.parse(localStorage.getItem('app_registered_users') || '[]');
        const updatedUsersList = usersList.map(u => {
            if(u.uid === user.uid) {
                return {...u, currentPlan: pendingPlanName, premiumUntil: until, premiumSince: now};
            }
            return u;
        });
        localStorage.setItem('app_registered_users', JSON.stringify(updatedUsersList));

        const receiptStr = sessionStorage.getItem('pendingReceipt');
        if (receiptStr) {
           setPendingReceipt(JSON.parse(receiptStr));
        }

        const usedCoupon = sessionStorage.getItem('pendingUsedCoupon');
        if(usedCoupon) sessionStorage.removeItem('pendingUsedCoupon');
        sessionStorage.removeItem('pendingPlanDays');
        sessionStorage.removeItem('pendingPlanName');
        sessionStorage.removeItem('pendingReceipt');
        
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (paymentStatus === 'failure') {
      alert("Houve um problema com o pagamento. Tente novamente.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        let premium = false;
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          premium = true;
        } else {
          premium = loadPremiumState(currentUser.uid);
        }
        
        setIsPremium(premium);
        
        if (premium) {
          setCategories(loadCategories(currentUser.uid));
          setQueue(loadQueue(currentUser.uid));
          setFightHistory(loadHistory(currentUser.uid));
        } else {
          setCategories([]);
          setQueue([]);
          setFightHistory([]);
        }
        
        setCurrentView(prev => prev === 'login' || prev === 'resetPassword' || prev === 'landing' ? 'queue' : prev);
      } else {
        // Se já estava no modo demo, não o força a voltar para a landing (permite continuar a testar)
        if (user?.isDemo !== true) {
           setUser(null);
           setCurrentView('landing');
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsPremium(false); 
    setCategories([]);
    setQueue([]);
    setFightHistory([]);
    setCurrentView('landing');
  };

  const startFight = (fightData) => {
    setActiveFight(fightData);
    setCurrentView('scoreboard');
  };

  const handleClearAll = () => {
    if (window.confirm("ATENÇÃO! Tem certeza que deseja apagar todas as categorias, lutas na fila e relatórios? Esta ação não pode ser desfeita.")) {
      setCategories([]);
      setQueue([]);
      setFightHistory([]);
      alert("Todos os dados do evento foram apagados com sucesso.");
    }
  };

  const handleFinishFight = (catId, fightId, scoreData, action) => {
    setFightHistory(prev => [{ id: Date.now(), timestamp: Date.now(), ...scoreData }, ...prev]);
    
    if (catId && fightId) {
      setCategories(prevCats => {
        const newCats = [...prevCats];
        const catIdx = newCats.findIndex(c => c.id === catId);
        if (catIdx !== -1) {
          const fIdx = newCats[catIdx].fights.findIndex(f => f.id === fightId);
          if (fIdx !== -1) {
            newCats[catIdx].fights[fIdx] = { ...newCats[catIdx].fights[fIdx], status: 'finished', result: scoreData };

            // --- Lógica de Final Automática ---
            const finishedFight = newCats[catIdx].fights[fIdx];
            if (finishedFight.phase === 'SEMI-FINAL') {
              const semiFinals = newCats[catIdx].fights.filter(f => f.phase === 'SEMI-FINAL' && f.status === 'finished');
              const hasFinal = newCats[catIdx].fights.some(f => f.phase === 'FINAL');
              
              if (semiFinals.length === 2 && !hasFinal) {
                const sf1 = semiFinals[0];
                const sf2 = semiFinals[1];
                const w1Code = getWinner(sf1.result);
                const w2Code = getWinner(sf2.result);
                
                if (w1Code !== 0 && w2Code !== 0) {
                  const getWinnerDetails = (f, code) => code === 1 ? { name: f.f1Name, team: f.f1Team } : { name: f.f2Name, team: f.f2Team };
                  const getLoserDetails = (f, code) => code === 1 ? { name: f.f2Name, team: f.f2Team } : { name: f.f1Name, team: f.f1Team };
                  
                  const w1 = getWinnerDetails(sf1, w1Code);
                  const w2 = getWinnerDetails(sf2, w2Code);
                  const l1 = getLoserDetails(sf1, w1Code);
                  const l2 = getLoserDetails(sf2, w2Code);

                  const baseProps = {
                    date: sf1.date || new Date().toISOString().split('T')[0],
                    category: sf1.category,
                    belt: sf1.belt,
                    gender: sf1.gender,
                    status: 'pending'
                  };
                  
                  // 1. Gerar Disputa do 3º Lugar (Perdedores)
                  newCats[catIdx].fights.push({
                    ...baseProps,
                    id: Date.now() + 1,
                    phase: 'DISPUTA 3º LUGAR',
                    f1Name: l1.name,
                    f1Team: l1.team,
                    f2Name: l2.name,
                    f2Team: l2.team
                  });

                  // 2. Gerar Grande Final (Vencedores)
                  newCats[catIdx].fights.push({
                    ...baseProps,
                    id: Date.now() + 2,
                    phase: 'FINAL',
                    f1Name: w1.name,
                    f1Team: w1.team,
                    f2Name: w2.name,
                    f2Team: w2.team
                  });

                  setTimeout(() => alert("A Grande Final e a Disputa do 3º Lugar foram geradas automaticamente!"), 300);
                }
              }
            }
            // --- Fim Lógica ---
          }
        }
        return newCats;
      });
    } else if (fightId) {
      setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const fIdx = newQueue.findIndex(f => f.id === fightId);
        if (fIdx !== -1) newQueue[fIdx] = { ...newQueue[fIdx], status: 'finished', result: scoreData };
        return newQueue;
      });
    }

    setTimeout(() => {
      if (action === 'next') {
        if (catId) {
          setCategories(currentCats => {
            const cat = currentCats.find(c => c.id === catId);
            if (cat) {
              const currentFightIdx = cat.fights.findIndex(f => f.id === fightId);
              const nextFight = cat.fights.find((f, i) => i > currentFightIdx && f.status === 'pending');
              if (nextFight) setActiveFight({ ...nextFight, catId: cat.id, category: cat.name, belt: cat.belt, gender: cat.gender });
              else { alert("Não há mais lutas pendentes nesta categoria."); setCurrentView('queue'); }
            }
            return currentCats;
          });
        } else {
          setQueue(currentQueue => {
            const currentFightIdx = currentQueue.findIndex(f => f.id === fightId);
            const nextFight = currentQueue.find((f, i) => i > currentFightIdx && f.status === 'pending');
            if (nextFight) setActiveFight(nextFight);
            else { alert("Não há mais lutas pendentes na fila geral."); setCurrentView('queue'); }
            return currentQueue;
          });
        }
      } else {
        setCurrentView('queue');
      }
    }, 100);
  };

  const triggerPrintReceipt = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center font-black text-2xl tracking-widest uppercase">Carregando...</div>;
  }

  return (
    <>
      {/* Modal de Recibo (Pós-Pagamento) */}
      {pendingReceipt && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md print:bg-white print:p-0 print:block">
          <div className="print:hidden max-w-lg w-full bg-white text-black p-8 rounded-3xl shadow-2xl relative border-4 border-zinc-200">
             <button onClick={() => setPendingReceipt(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-black"><X size={24}/></button>
             <div className="text-center mb-6">
                <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Pagamento Aprovado!</h2>
                <p className="text-sm font-bold text-zinc-500 mt-1 uppercase">O seu recibo está pronto</p>
             </div>
             <div className="bg-zinc-50 p-4 rounded-xl mb-6 font-bold text-sm space-y-2 border border-zinc-200">
                <div className="flex justify-between"><span className="text-zinc-500">Plano:</span> <span className="uppercase">{pendingReceipt.planName}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Valor Final:</span> <span>R$ {pendingReceipt.finalPrice.toFixed(2)}</span></div>
             </div>
             <div className="flex gap-3">
                <button onClick={triggerPrintReceipt} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all">
                  <Printer size={16}/> Imprimir Recibo
                </button>
                <button onClick={() => setPendingReceipt(null)} className="px-6 border border-zinc-300 hover:bg-zinc-100 text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all">
                  Fechar
                </button>
             </div>
          </div>
          
          {/* Versão Real de Impressão */}
          <div className="hidden print:block w-full min-h-screen">
             <PrintReceipt data={pendingReceipt} logoUrl={logoUrl} user={user} />
          </div>
        </div>
      )}

      {currentView === 'landing' && (
        <LandingScreen 
           logoUrl={logoUrl}
           plans={plans}
           onLogin={() => { setLoginInitialRegister(false); setCurrentView('login'); }}
           onRegister={() => { setLoginInitialRegister(true); setCurrentView('login'); }}
           onDemo={() => {
              setUser({ email: 'Demo Mode', isDemo: true });
              setActiveFight(null);
              setCurrentView('scoreboard');
           }}
        />
      )}

      {currentView === 'resetPassword' && (
        <ResetPasswordScreen oobCode={resetCode} />
      )}

      {currentView === 'login' && (
        <LoginScreen 
           initialIsRegistering={loginInitialRegister}
           onBack={() => setCurrentView('landing')}
           onGuestLogin={() => { setUser({ email: 'Conta Gratuita' }); setCurrentView('queue'); }} 
        />
      )}
      
      {currentView === 'queue' && (
        <DashboardScreen 
          activeTab={dashboardTab} setActiveTab={setDashboardTab}
          user={user} queue={queue} setQueue={setQueue} categories={categories} setCategories={setCategories} 
          onStartFight={startFight} onLogout={handleLogout} onClearAll={handleClearAll}
          isPremium={isPremium} logoUrl={logoUrl} setLogoUrl={setLogoUrl} fightHistory={fightHistory}
          onShowReceipt={(receipt) => setPendingReceipt(receipt)} plans={plans} setPlans={setPlans}
        />
      )}
      
      {currentView === 'scoreboard' && (
        <ScoreboardScreen 
          initialFightData={activeFight} 
          onBackToQueue={() => {
            if (user?.isDemo) {
               setUser(null);
               setCurrentView('landing');
            } else {
               setCurrentView('queue');
            }
          }} 
          isPremium={isPremium} 
          logoUrl={logoUrl} 
          onFinishFight={handleFinishFight} 
          user={user}
          onRegisterRequest={() => {
            setUser(null);
            setLoginInitialRegister(true);
            setCurrentView('login');
          }}
        />
      )}
    </>
  );
}
