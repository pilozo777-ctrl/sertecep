import React, { useState } from 'react';
import { Course } from '../types';
import { 
  Sparkles, CheckCircle2, BookOpen, Clock, Award, 
  Search, ShieldCheck, ChevronRight, X, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  courses,
  onSelectCourse,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(['course-flutter-ia', 'course-sistemas-web', 'course-excel-bi']);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['todos', 'Desarrollo Móvil', 'Sistemas Web', 'Ofimática & BI'];

  const filtered = courses.filter(c => {
    const matchesCat = selectedCategory === 'todos' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      confetti({ particleCount: 50, spread: 60 });
      setToastMessage('¡Matrícula activada con éxito! Ya puedes acceder a todas las lecciones.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 w-full min-w-0 pb-24 sm:pb-12">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          OFERTA ACADÉMICA OFICIAL 2026
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Catálogo de Cursos & Especializaciones
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Programas intensivos presenciales y virtuales con certificación legal emitida por Academia Sertecep Amazónico S.A.S. en Sucumbíos, Ecuador.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 w-full min-w-0">
        <div className="w-full sm:w-auto overflow-x-auto min-w-0 max-w-full pb-1">
          <div className="flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'todos' ? 'Todos los programas' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por curso o tecnología..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
        {filtered.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl group w-full min-w-0 max-w-full"
            >
              <div>
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {course.totalHours} horas
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {course.totalLessons} lecciones
                    </span>
                  </div>

                  <div className="pt-2 text-xs text-slate-400">
                    <span>Docente: </span>
                    <span className="text-white font-medium">{course.instructor.name}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setDetailCourse(course)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  Ver temario
                </button>
                {isEnrolled ? (
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1"
                  >
                    <span>Entrar al aula</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1"
                  >
                    Inscribirme
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {detailCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setDetailCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-emerald-400 font-mono uppercase">
                {detailCourse.category} · {detailCourse.totalHours} HORAS ACADÉMICAS
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                {detailCourse.title}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {detailCourse.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Módulos y Contenido Programático
              </h4>
              <div className="space-y-3">
                {detailCourse.modules.map((m) => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        MÓDULO {m.moduleNumber}: {m.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{m.lessons.length} clases</span>
                    </div>
                    <p className="text-xs text-slate-400">{m.description}</p>
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
                onClick={() => setDetailCourse(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  onSelectCourse(detailCourse);
                  setDetailCourse(null);
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Ingresar al curso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
