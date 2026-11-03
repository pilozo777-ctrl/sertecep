import React, { useState } from 'react';
import { AuthAccount, StudentEnrollment } from '../types';
import { 
  OFFICIAL_SERTECEP_LOGO, OFFICIAL_SERTECEP_PORTADA, 
  ADMIN_USERNAME, ADMIN_PASSWORD, defaultAdminAccount, defaultStudentAccount,
  SUPPORT_WHATSAPP_NUMBER 
} from '../data/mockData';
import { 
  User, Lock, ArrowRight, Eye, EyeOff, 
  AlertCircle, Phone, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginViewProps {
  onLoginSuccess: (account: AuthAccount) => void;
  studentsList: StudentEnrollment[];
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  studentsList,
}) => {
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Por favor ingresa tu usuario y contraseña.');
      return;
    }

    // 1. Check if user is Administrator:
    // User: 'admin' and Password: 'MIaPilozo1983#'
    if (
      (trimmedUser.toLowerCase() === ADMIN_USERNAME.toLowerCase() || 
       trimmedUser.toLowerCase() === 'admin@sertecep.edu.ec') &&
      trimmedPass === ADMIN_PASSWORD
    ) {
      confetti({ particleCount: 50, spread: 70 });
      onLoginSuccess(defaultAdminAccount);
      return;
    }

    // 2. Check if user is a registered student:
    const matchedStudent = studentsList.find(s => 
      (s.username.toLowerCase() === trimmedUser.toLowerCase() ||
       s.email.toLowerCase() === trimmedUser.toLowerCase() ||
       s.docNumber === trimmedUser) &&
      (!s.password || s.password === trimmedPass)
    );

    if (matchedStudent) {
      confetti({ particleCount: 40, spread: 60 });
      onLoginSuccess({
        id: matchedStudent.id,
        username: matchedStudent.username,
        email: matchedStudent.email,
        role: 'student',
        fullName: matchedStudent.studentName,
        avatarUrl: '/assets/aistudio/image_f29cb282.png',
        title: 'Estudiante Matriculado',
        docNumber: matchedStudent.docNumber,
        phone: matchedStudent.phone,
      });
      return;
    }

    // 3. Fallback for demo student account
    if (
      (trimmedUser.toLowerCase() === 'miapilozo777' || 
       trimmedUser.toLowerCase() === 'miapilozo777@gmail.com') &&
      (trimmedPass === '123' || trimmedPass === defaultStudentAccount.password)
    ) {
      confetti({ particleCount: 40, spread: 60 });
      onLoginSuccess(defaultStudentAccount);
      return;
    }

    // Invalid credentials
    setErrorMessage('Usuario o contraseña incorrectos. Revisa bien tus credenciales de acceso.');
  };

  const handleFillDemo = (type: 'admin' | 'student') => {
    setErrorMessage(null);
    if (type === 'admin') {
      setUsernameInput(ADMIN_USERNAME);
      setPasswordInput(ADMIN_PASSWORD);
    } else {
      setUsernameInput('miapilozo777');
      setPasswordInput('123');
    }
  };

  return (
    <div className="min-h-screen bg-[#060a0f] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      {/* Background Portada Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={OFFICIAL_SERTECEP_PORTADA}
          alt="Portada Sertecep"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060a0f] via-[#060a0f]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a0f] via-[#060a0f]/80 to-transparent" />
      </div>

      {/* Top Simple Brand Bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-900 border border-emerald-500/30 p-1 flex items-center justify-center shadow overflow-hidden">
            <img
              src={OFFICIAL_SERTECEP_LOGO}
              alt="Logo Sertecep Amazónico"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block">
              Sertecep Amazónico S.A.S.
            </span>
            <span className="text-[10px] text-emerald-400 font-mono block">
              Shushufindi, Sucumbíos · Aula Virtual
            </span>
          </div>
        </div>

        <a
          href={`https://wa.me/593989012515`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold transition"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Soporte: {SUPPORT_WHATSAPP_NUMBER}</span>
        </a>
      </header>

      {/* Main Single Gateway in Center */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left: Official Portada & Highlights (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950 group relative">
            <img
              src={OFFICIAL_SERTECEP_PORTADA}
              alt="Portada Oficial Sertecep Amazónico"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-700"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                OFIMÁTICA
              </span>
              <p className="text-slate-300 mt-0.5 font-medium leading-snug">
                Excel avanzado, macros y productividad.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block font-mono">
                DESARROLLO WEB
              </span>
              <p className="text-slate-300 mt-0.5 font-medium leading-snug">
                Diseño responsivo y sistemas cloud.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">
                MARKETING
              </span>
              <p className="text-slate-300 mt-0.5 font-medium leading-snug">
                Ventas y contenidos con IA.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block font-mono">
                MÍA ACADÉMICO
              </span>
              <p className="text-slate-300 mt-0.5 font-medium leading-snug">
                Acompañamiento y tutoría continua.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Unified Single Login Form Card (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-14 h-14 rounded-full bg-slate-950 border border-emerald-500/30 p-1 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                Acceso al Aula Virtual
              </h2>
              <p className="text-xs text-slate-400">
                Ingresa con tu usuario y contraseña
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Unified Single Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Ej: admin o tu usuario asignado"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 pl-9 font-mono font-medium"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 pl-9 font-mono pr-10"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs tracking-wide transition shadow-lg flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-98"
            >
              <span>Ingresar al Aula Virtual</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-click test helpers */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
              Acceso Rápido de Prueba:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-amber-300 font-mono text-left transition"
              >
                <span className="block font-bold">Admin</span>
                <span className="text-[10px] text-slate-400">admin / MIaPilozo1983#</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-emerald-300 font-mono text-left transition"
              >
                <span className="block font-bold">Estudiante</span>
                <span className="text-[10px] text-slate-400">miapilozo777 / 123</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Assistance */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>¿Requieres asistencia?</span>
            <a
              href={`https://wa.me/593989012515?text=${encodeURIComponent('Hola, necesito asistencia con mis claves de acceso a Academia Sertecep Amazónico.')}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              WhatsApp {SUPPORT_WHATSAPP_NUMBER}
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 text-center text-xs text-slate-500 font-mono">
        Academia Sertecep Amazónico S.A.S. · Shushufindi, Sucumbíos, Ecuador · © 2026
      </footer>
    </div>
  );
};
