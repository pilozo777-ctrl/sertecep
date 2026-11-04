import React, { useState } from 'react';
import { Course, UserProfile } from '../types';
import { 
  OFFICIAL_SERTECEP_LOGO, 
  OFFICIAL_SERTECEP_PORTADA_INNER, 
  COURSE_FALLBACK_IMAGES,
  SUPPORT_WHATSAPP_NUMBER 
} from '../data/mockData';
import { 
  Play, BookOpen, Clock, Award, CheckCircle2, 
  ArrowRight, Sparkles, Filter, Search, Layers, Zap, Lock, ShieldCheck
} from 'lucide-react';

interface DashboardViewProps {
  courses: Course[];
  userProfile: UserProfile;
  enrolledCourseIds?: string[];
  onSelectCourse: (course: Course, lessonId?: string) => void;
  onNavigateToCatalog: () => void;
  onNavigateToCertificates: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  userProfile,
  enrolledCourseIds,
  onSelectCourse,
  onNavigateToCatalog,
  onNavigateToCertificates,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeCourse = courses.find(c => c.id === 'course-flutter-ia') || courses[0];
  const nextLesson = activeCourse?.modules[0]?.lessons[1] || activeCourse?.modules[0]?.lessons[0];

  const filteredCourses = courses.filter(c => {
    const matchesFilter = filterCategory === 'todos' || c.category === filterCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8 w-full min-w-0 pb-24 sm:pb-12">
      {/* Official Inner Portada Banner (PORTADA-2) */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-950 group">
        <img
          src={OFFICIAL_SERTECEP_PORTADA_INNER}
          alt="Portada Oficial Sertecep Amazónico"
          referrerPolicy="no-referrer"
          className="w-full h-auto object-cover max-h-[380px]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/PORTADA-2_5250da16.png';
          }}
        />

        {/* Quick action strip overlay at bottom of banner */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/30 p-1 flex items-center justify-center">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Bienvenido al Campus Virtual, <span className="text-emerald-400">{userProfile.firstName} {userProfile.firstLastName}</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                {userProfile.city}, {userProfile.province} · Modo Estudiante Activo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectCourse(activeCourse, nextLesson?.id)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continuar última clase</span>
            </button>
            <button
              onClick={onNavigateToCertificates}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Mis Diplomas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Resume Bar matching image_77a9465a.png */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-950/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
              CONTINUAR DONDE TE QUEDASTE
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {nextLesson?.title || 'Introducción al Curso IA'}
            </h3>
            <p className="text-xs text-slate-400">
              {activeCourse.title} · Módulo {nextLesson?.moduleOrder || 1}
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectCourse(activeCourse, nextLesson?.id)}
          className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5"
        >
          <span>Ir a la clase</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Metric Strip matching screenshot stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CURSOS ACTIVOS
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
            {courses.length}
          </p>
          <p className="text-xs text-emerald-400">En tu aula virtual</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            HORAS ACADÉMICAS
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
            600<span className="text-base text-slate-400 font-sans font-normal ml-1">h</span>
          </p>
          <p className="text-xs text-slate-400">Carga total certificada</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            CERTIFICADOS
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
            2
          </p>
          <p className="text-xs text-slate-400">Listos para descargar</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            RACHA DE ESTUDIO
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
            {userProfile.streakDays} <span className="text-sm font-sans font-normal text-slate-400">días</span>
          </p>
          <p className="text-xs text-emerald-400">¡Excelente constancia!</p>
        </div>
      </div>

      {/* Courses Section Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Mis cursos activos
            </h2>
            <p className="text-xs text-slate-400">
              Accede a tus clases activas y continúa tu formación técnica profesional.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto min-w-0">
            <div className="w-full sm:w-auto overflow-x-auto min-w-0 max-w-full pb-1">
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
                {['todos', 'Desarrollo Móvil', 'Sistemas Web', 'Ofimática & BI'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat === 'todos' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onNavigateToCatalog}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/30 transition shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver catálogo</span>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
          {filteredCourses.map((course) => {
            const completedCount = course.modules.flatMap(m => m.lessons).filter(l => l.completed).length;
            const totalCount = course.modules.flatMap(m => m.lessons).length;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isEnrolled = 
              userProfile.role === 'admin' || 
              !enrolledCourseIds || 
              enrolledCourseIds.includes('ALL') || 
              enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className={`bg-slate-900/60 border ${
                  isEnrolled ? 'border-slate-800/80 hover:border-emerald-500/40' : 'border-amber-500/20 hover:border-amber-500/40'
                } rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group w-full min-w-0 max-w-full`}
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = COURSE_FALLBACK_IMAGES[course.id] || COURSE_FALLBACK_IMAGES.default;
                      }}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        !isEnrolled ? 'filter grayscale-[30%] opacity-85' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {isEnrolled ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ACTIVO</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 shadow-md flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>NO MATRICULADO</span>
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/60 backdrop-blur-md text-slate-300 border border-slate-700">
                        {course.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[11px] font-bold text-emerald-400 font-mono tracking-wider uppercase">
                        {course.badgeTitle}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {course.totalHours}h
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        {course.totalLessons} lecciones
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Avance</span>
                        <span className="text-emerald-400 font-bold tabular-nums">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {isEnrolled ? (
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span>Entrar al aula</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Solicitar Matrícula</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
