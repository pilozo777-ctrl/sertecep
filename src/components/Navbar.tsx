import React from 'react';
import { AuthAccount, UserProfile } from '../types';
import { OFFICIAL_SERTECEP_LOGO } from '../data/mockData';
import { Award, BookOpen, Layers, User, Play, LogOut, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'classroom' | 'certificates' | 'catalog' | 'profile' | 'admin';
  onNavigate: (view: 'dashboard' | 'classroom' | 'certificates' | 'catalog' | 'profile' | 'admin') => void;
  userProfile: UserProfile;
  currentAccount: AuthAccount;
  onLogout: () => void;
  onGoToPortada?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  userProfile,
  currentAccount,
  onLogout,
  onGoToPortada,
}) => {
  const isAdmin = currentAccount.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#080c12]/95 backdrop-blur-md border-b border-slate-800/80 w-full">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark with elegant round logo (NO badge 'estudiante') */}
        <button
          onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
          className="flex items-center gap-2 sm:gap-3 text-left whitespace-nowrap min-w-0 group focus:outline-none"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950 border border-emerald-500/30 p-1 flex items-center justify-center shrink-0 shadow overflow-hidden group-hover:scale-105 transition-transform">
            <img
              src={OFFICIAL_SERTECEP_LOGO}
              alt="Logo Sertecep Amazónico"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors truncate">
            Sertecep Amazónico
          </span>
        </button>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'dashboard'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Mis Cursos
          </button>

          <button
            onClick={() => onNavigate('classroom')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'classroom'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Aula Virtual
          </button>

          <button
            onClick={() => onNavigate('certificates')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'certificates'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Certificaciones
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentView === 'catalog'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Catálogo
          </button>

          {isAdmin ? (
            <button
              onClick={() => onNavigate('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                  : 'text-amber-400/90 hover:text-amber-300 font-semibold'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('profile')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                currentView === 'profile'
                  ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                  : 'hover:text-white'
              }`}
            >
              Mi Perfil
            </button>
          )}
        </nav>

        {/* Zone 3: Actions matching image_8aca1858.png (Portada, Mi perfil, Certificaciones, Cerrar sesión) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onGoToPortada && (
            <button
              onClick={onGoToPortada}
              title="Ver portada pública"
              className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap shadow-sm"
            >
              Portada
            </button>
          )}

          <button
            onClick={() => onNavigate(isAdmin ? 'admin' : 'profile')}
            title="Ir a mi perfil"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition text-left whitespace-nowrap shrink-0 group"
          >
            {/* Elegant Round Photo (rounded-full) */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-emerald-500/40 overflow-hidden bg-slate-950 flex items-center justify-center shrink-0 shadow-sm">
              {isAdmin ? (
                <img
                  src={OFFICIAL_SERTECEP_LOGO}
                  alt="Admin"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-0.5"
                />
              ) : userProfile.photoUrl ? (
                <img
                  src={userProfile.photoUrl}
                  alt={userProfile.firstName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-emerald-400">{userProfile.firstName[0]}</span>
              )}
            </div>

            <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors hidden sm:inline">
              Mi perfil
            </span>
          </button>

          <button
            onClick={() => onNavigate('certificates')}
            title="Ver certificados"
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition text-xs font-medium text-slate-300 hover:text-emerald-400 whitespace-nowrap"
          >
            Certificaciones
          </button>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition text-xs text-slate-300 hover:text-red-400 whitespace-nowrap shrink-0"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
