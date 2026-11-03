import React, { useState } from 'react';
import { AuthAccount, UserRole } from '../types';
import { defaultAdminAccount, defaultStudentAccount } from '../data/mockData';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle2, Key, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (account: AuthAccount) => void;
  currentAccount: AuthAccount;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentAccount,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    confetti({ particleCount: 30, spread: 60 });
    if (role === 'admin') {
      onLogin(defaultAdminAccount);
    } else {
      onLogin(defaultStudentAccount);
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate inputs
    if (selectedRole === 'admin') {
      if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('sertecep')) {
        onLogin({
          ...defaultAdminAccount,
          email: email.trim() || defaultAdminAccount.email,
        });
        onClose();
      } else {
        // Fallback admin login
        onLogin(defaultAdminAccount);
        onClose();
      }
    } else {
      // Student login
      onLogin({
        ...defaultStudentAccount,
        email: email.trim() || defaultStudentAccount.email,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Cerrar ventana de acceso"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            S
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Aula Virtual Sertecep
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Plataforma de Capacitación Profesional · Sucumbíos, Ecuador
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setEmail(defaultStudentAccount.email);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'student'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Estudiante</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setEmail(defaultAdminAccount.email);
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              selectedRole === 'admin'
                ? 'bg-amber-400 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrador</span>
          </button>
        </div>

        {/* Explanation Badge */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs mb-5">
          {selectedRole === 'admin' ? (
            <div className="text-amber-300">
              <span className="font-bold">Modo Administrador:</span> Podrás gestionar cursos, editar y crear lecciones, supervisar estudiantes y aprobar la emisión de certificados oficiales.
            </div>
          ) : (
            <div className="text-emerald-300">
              <span className="font-bold">Modo Estudiante:</span> Acceso para visualizar clases, reproducir videos, realizar apuntes, comprobar conocimientos y descargar tus diplomas aprobados.
            </div>
          )}
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="space-y-2 mb-6">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Acceso Rápido Instantáneo (1 Clic):
          </span>
          {selectedRole === 'admin' ? (
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="w-full p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <div className="text-left">
                  <div className="leading-tight">Ingresar como Director / Administrador</div>
                  <div className="text-[10px] font-mono text-slate-800 font-normal">admin@sertecep.edu.ec</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleQuickLogin('student')}
              className="w-full p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-900" />
                <div className="text-left">
                  <div className="leading-tight">Ingresar como Estudiante</div>
                  <div className="text-[10px] font-mono text-slate-800 font-normal">EDINSON FLORESMILO PILOZO MURILLO</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">O con credenciales</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'admin@sertecep.edu.ec' : 'miapilozo777@gmail.com'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 pl-9 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 pl-9 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition border border-slate-700"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Footer session info */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-500 font-mono">
          Sesión actual: <span className="text-slate-300 font-semibold">{currentAccount.fullName}</span> ({currentAccount.role === 'admin' ? 'Administrador' : 'Estudiante'})
        </div>
      </div>
    </div>
  );
};
