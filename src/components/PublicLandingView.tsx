import React, { useState, useRef } from 'react';
import { Course, AuthAccount, StudentEnrollment } from '../types';
import { 
  OFFICIAL_SERTECEP_LOGO, OFFICIAL_SERTECEP_PORTADA, 
  ADMIN_USERNAME, ADMIN_PASSWORD, defaultAdminAccount, defaultStudentAccount,
  SUPPORT_WHATSAPP_NUMBER,
  COURSE_FALLBACK_IMAGES
} from '../data/mockData';
import { 
  Search, Lock, Mail, User, Eye, EyeOff, ArrowRight, 
  Clock, BookOpen, CheckCircle2, ShieldCheck, Phone, Sparkles, ExternalLink, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PublicLandingViewProps {
  courses: Course[];
  studentsList: StudentEnrollment[];
  onLoginSuccess: (account: AuthAccount) => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({
  courses,
  studentsList,
  onLoginSuccess,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Catalog Filter
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [syllabusModalCourse, setSyllabusModalCourse] = useState<Course | null>(null);
  const [showColibriBannerModal, setShowColibriBannerModal] = useState<boolean>(false);

  const catalogRef = useRef<HTMLDivElement>(null);
  const loginCardRef = useRef<HTMLDivElement>(null);

  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToLogin = () => {
    loginCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    const inputEl = document.getElementById('public-login-username');
    if (inputEl) inputEl.focus();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Por favor introduce tu usuario o correo y tu contraseña.');
      return;
    }

    // 1. Administrator Detection
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

    // 2. Student Detection against registered roster
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

    // 3. Fallback demo student
    if (
      (trimmedUser.toLowerCase() === 'miapilozo777' || 
       trimmedUser.toLowerCase() === 'miapilozo777@gmail.com') &&
      (trimmedPass === '123' || trimmedPass === defaultStudentAccount.password)
    ) {
      confetti({ particleCount: 40, spread: 60 });
      onLoginSuccess(defaultStudentAccount);
      return;
    }

    setErrorMessage('Credenciales no válidas. Revisa tu usuario y contraseña.');
  };

  const handleDemoFill = (role: 'admin' | 'student') => {
    setErrorMessage(null);
    if (role === 'admin') {
      setUsernameInput(ADMIN_USERNAME);
      setPasswordInput(ADMIN_PASSWORD);
    } else {
      setUsernameInput('miapilozo777');
      setPasswordInput('123');
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesCat = selectedCategory === 'todos' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          c.tagline.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070b11] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black w-full max-w-full overflow-x-hidden">
      {/* 1. TOP NAVBAR matching image_8559f919.png */}
      <header className="sticky top-0 z-40 bg-[#070b11]/90 backdrop-blur-md border-b border-slate-800/80 w-full">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-emerald-500/30 p-1 flex items-center justify-center shadow overflow-hidden shrink-0">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep Amazónico"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-lg font-black tracking-tight text-white block uppercase truncate">
                Sertecep Amazónico
              </span>
              <span className="text-[8px] sm:text-[10px] text-emerald-400 font-mono tracking-wider block truncate">
                ACADEMIA DE FORMACIÓN TÉCNICA · SHUSHUFINDI
              </span>
            </div>
          </div>

          {/* Navigation items: Inicio, Cursos, Soporte, Login (responsive for mobile) */}
          <nav className="flex items-center gap-2 sm:gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-slate-300 shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hidden md:inline-block hover:text-amber-400 transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={handleScrollToCatalog}
              className="px-2 py-1 hover:text-amber-400 transition-colors"
            >
              Cursos
            </button>
            <a
              href={`https://wa.me/593989012515`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex hover:text-emerald-400 transition-colors items-center gap-1 font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Soporte ({SUPPORT_WHATSAPP_NUMBER})</span>
            </a>
            <button
              onClick={handleScrollToLogin}
              className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 hover:border-amber-400/50 transition-colors shadow-sm"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* 2. HERO EXTERNO CON FONDO ARQUITECTÓNICO DEL COLIBRÍ AMAZÓNICO */}
      <section className="relative overflow-hidden py-10 lg:py-20 border-b border-slate-800/80 w-full">
        {/* Background Portada Backdrop con Colibrí Amazónico Visible y Elegante */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Main Colibrí artwork layer: aligned to highlight the Colibrí monument */}
          <img
            src={OFFICIAL_SERTECEP_PORTADA}
            alt="Monumento Colibrí de Shushufindi - Sertecep Amazónico"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[75%_center] lg:object-[82%_center] opacity-75 lg:opacity-85 filter contrast-110 brightness-95 scale-100 transition-transform duration-1000"
          />

          {/* Architectural Left gradient mask to ensure pristine readability for headline, text & search */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[62%] bg-gradient-to-r from-[#070b11] via-[#070b11]/95 to-transparent pointer-events-none" />

          {/* Top subtle vignette */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#070b11] via-[#070b11]/75 to-transparent pointer-events-none" />

          {/* Bottom vignette blending seamlessly into catalog section */}
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#070b11] via-[#070b11]/85 to-transparent pointer-events-none" />

          {/* Ambient Glowing Halos matching the Colibrí plumage (Emerald & Sunset Amber) */}
          <div className="absolute right-[10%] top-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute right-[25%] bottom-[5%] w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Headline, Subtitle, Search bar, Quick badges (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AULA VIRTUAL PREMIUM</span>
              </div>

              {/* Colibrí Architectural Badge */}
              <button
                type="button"
                onClick={() => setShowColibriBannerModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 hover:bg-slate-800 border border-amber-400/30 hover:border-amber-400 text-[11px] text-amber-300 transition-all shadow-sm group"
                title="Ver mural panorámico del Colibrí de Shushufindi"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Fondo: Monumento al Colibrí</span>
                <span className="text-[10px] text-slate-400 font-mono">(Ver mural)</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-[1.15] break-words">
              Aprende, avanza y encuentra tus clases <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">sin perderte.</span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              Una experiencia académica moderna para entrar rápido a tus cursos, continuar lecciones y revisar tus recursos desde un solo lugar. Con respaldo institucional y certificación con validación Blockchain.
            </p>

            {/* Explore bar with "Ver cursos" button */}
            <div className="p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl backdrop-blur-sm min-w-0">
              <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 sm:py-0 flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Explora nuestra ruta de aprendizaje..."
                  className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                onClick={handleScrollToCatalog}
                className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-1.5 active:scale-98"
              >
                <span>Ver cursos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick feature pill tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {['Clases', 'Recursos', 'Comunidad', 'Certificados Blockchain'].map((tag) => (
                <button
                  key={tag}
                  onClick={handleScrollToCatalog}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Iniciar sesión card (Compact & responsive) */}
          <div ref={loginCardRef} className="lg:col-span-5 flex justify-center lg:justify-end w-full min-w-0 max-w-full">
            <div className="w-full max-w-full sm:max-w-md bg-[#0c1320]/95 backdrop-blur-2xl border border-slate-700/60 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-4">
              {/* Sleek top glowing border accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-90" />

              {/* Card Header */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10 overflow-hidden">
                  <img
                    src={OFFICIAL_SERTECEP_LOGO}
                    alt="Logo Sertecep Amazónico"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="leading-tight min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate">
                    Sertecep Amazónico
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Plataforma Académica Oficial
                  </p>
                </div>
              </div>

              {/* Title & Badges */}
              <div className="border-b border-slate-800/80 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Iniciar sesión
                  </h2>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700 font-mono tracking-wider">
                      ALUMNO
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono tracking-wider">
                      ADMIN
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Ingresa con tu usuario o correo y contraseña para acceder al aula.
                </p>
              </div>

              {/* Error banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
                  <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Usuario o Correo
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="public-login-username"
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin o tu usuario registrado"
                      required
                      className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all font-sans pr-10"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all font-sans pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-white transition-colors"
                      title={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox and Restablecer contraseña */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-300">Recordar sesión</span>
                  </label>
                  <a
                    href={`https://wa.me/593989012515?text=${encodeURIComponent('Hola, necesito ayuda para restablecer mi contraseña del Aula Virtual Sertecep.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline transition-colors"
                  >
                    ¿Olvidaste tu clave?
                  </a>
                </div>

                {/* Golden Gradient Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 active:scale-[0.99] text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Ingresar al aula virtual</span>
                </button>
              </form>

              {/* Fast test pills */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-mono">Accesos de prueba:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDemoFill('admin')}
                    className="px-2.5 py-1 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 rounded-lg text-[10px] font-bold font-mono transition-colors"
                    title="Cargar usuario admin (MIaPilozo1983#)"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoFill('student')}
                    className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold font-mono transition-colors"
                    title="Cargar usuario estudiante (miapilozo777 / 123)"
                  >
                    Alumno
                  </button>
                </div>
              </div>

              {/* Bottom links */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <a
                  href={`https://wa.me/593989012515?text=${encodeURIComponent('Hola Academia Sertecep, deseo matricularme en un curso.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Solicitar matrícula
                </a>
                <a
                  href={`https://wa.me/593989012515`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors font-mono text-emerald-400 flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp Soporte</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATÁLOGO DE CURSOS EN LA PARTE EXTERNA (Requested by user) */}
      <section ref={catalogRef} className="py-10 sm:py-16 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 w-full min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 w-full min-w-0">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>CATÁLOGO OFICIAL DE CAPACITACIÓN 2026</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight break-words">
              Cursos Disponibles en Sertecep Amazónico
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Programas con certificación legal aprobada por la Superintendencia de Compañías en Sucumbíos, Ecuador.
            </p>
          </div>

          {/* Category Tabs with safe mobile horizontal scrolling */}
          <div className="w-full lg:w-auto max-w-full overflow-x-auto pb-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 shrink-0">
              {['todos', 'Ofimática & BI', 'Sistemas Web', 'Inteligencia Artificial'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'todos' ? 'Todos los programas' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Official Courses Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full min-w-0">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-amber-400/40 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-400/10 group w-full max-w-[340px] sm:max-w-none mx-auto sm:mx-0 min-w-0"
            >
              <div className="min-w-0">
                {/* Course Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = COURSE_FALLBACK_IMAGES[course.id] || COURSE_FALLBACK_IMAGES.default;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 max-w-[85%] truncate">
                    <span className="px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] font-bold bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30 truncate inline-block">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2 sm:space-y-3 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors break-words">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed break-words">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-400 pt-1 font-mono flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {course.totalHours}h lectivas
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {course.totalLessons} clases
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 pt-0 space-y-2 w-full">
                <button
                  onClick={() => setSyllabusModalCourse(course)}
                  className="w-full py-2.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1 active:scale-98 cursor-pointer"
                >
                  Ver temario y contenidos
                </button>
                <button
                  onClick={handleScrollToLogin}
                  className="w-full py-2.5 sm:py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1 active:scale-98 cursor-pointer"
                >
                  <span>Ingresar a este curso</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER OFICIAL DE SERTECEP AMAZÓNICO - 100% RESPONSIVE EN MÓVILES */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95 py-6 sm:py-8 px-4 sm:px-8 text-slate-400 text-xs w-full max-w-full overflow-hidden pb-28 sm:pb-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          {/* Brand info & legal details */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-900 border border-emerald-500/30 p-0.5 shrink-0 shadow">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep Amazónico"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-1 sm:gap-2 text-center sm:text-left">
              <span className="font-bold text-white tracking-tight">
                © 2026 Academia Sertecep Amazónico S.A.S.
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-slate-400 text-[11px] sm:text-xs">
                RUC: 2191754820001
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-slate-400 text-[11px] sm:text-xs">
                Shushufindi, Sucumbíos - Ecuador
              </span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <a
                href={`https://wa.me/593989012515`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-emerald-400 hover:underline text-[11px] sm:text-xs inline-flex items-center gap-1"
              >
                <span>WhatsApp: {SUPPORT_WHATSAPP_NUMBER}</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 w-full md:w-auto pt-2 md:pt-0 border-t border-slate-800/60 md:border-t-0">
            <a
              href={`https://wa.me/593989012515`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 transition py-1"
            >
              Soporte académico
            </a>
            <span className="text-slate-700">·</span>
            <button
              onClick={handleScrollToLogin}
              className="hover:text-amber-400 transition py-1 font-medium"
            >
              Acceso al aula
            </button>
          </div>
        </div>
      </footer>

      {/* Course Syllabus Modal */}
      {syllabusModalCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            <button
              onClick={() => setSyllabusModalCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-amber-400 font-mono uppercase">
                {syllabusModalCourse.category} · {syllabusModalCourse.totalHours} HORAS ACADÉMICAS
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {syllabusModalCourse.title}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {syllabusModalCourse.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Módulos y Lecciones Programadas
              </h4>
              <div className="space-y-3">
                {syllabusModalCourse.modules.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        MÓDULO {m.moduleNumber}: {m.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{m.lessons.length} clases</span>
                    </div>
                    <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 pt-1">
                      {m.lessons.map(l => (
                        <li key={l.id} className="text-slate-300">
                          {l.title} <span className="text-slate-500 font-mono">({l.duration})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSyllabusModalCourse(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setSyllabusModalCourse(null);
                  handleScrollToLogin();
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Iniciar sesión para ver clases
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Colibrí Mural Panoramic Modal */}
      {showColibriBannerModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-500/40 p-1 flex items-center justify-center">
                  <img
                    src={OFFICIAL_SERTECEP_LOGO}
                    alt="Logo Sertecep"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Mural Oficial: Monumento al Colibrí · Sertecep Amazónico
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">Shushufindi</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    "Nuestra tierra también innova · Domina la Inteligencia Artificial · Shushufindi Tierra de Gente Grande"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowColibriBannerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2 sm:p-4 bg-black flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={OFFICIAL_SERTECEP_PORTADA}
                alt="Mural Panorámico Sertecep Amazónico y Colibrí"
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>

            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Arte y visión institucional de formación tecnológica y profesional para la Amazonía.
              </span>
              <button
                onClick={() => setShowColibriBannerModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition shadow"
              >
                Cerrar vista
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
