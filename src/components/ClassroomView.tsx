import React, { useState } from 'react';
import { Course, Lesson, LessonNote, LessonComment, UserProfile, CertificateRecord } from '../types';
import { VideoPlayer } from './VideoPlayer';
import { CertificateDocument } from './CertificateDocument';
import { 
  FileText, Code, CheckSquare, Download, MessageSquare, 
  ChevronRight, ArrowLeft, Plus, Trash2, Clock, Sparkles, Send, CheckCircle2,
  FileCode, PlayCircle, BookOpen, ThumbsUp, Award, ShieldCheck, ExternalLink, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  OFFICIAL_CERTIFICATE_SCAN, 
  OFFICIAL_ZEYO_BLOCKCHAIN_URL, 
  OFFICIAL_BLOCKCHAIN_TX, 
  OFFICIAL_BLOCKCHAIN_PUBKEY,
  OFFICIAL_RUC,
  OFFICIAL_EXPEDIENTE,
  OFFICIAL_SIGNER_NAME 
} from '../data/mockData';

interface ClassroomViewProps {
  course: Course;
  initialLessonId?: string;
  userProfile: UserProfile;
  certificate?: CertificateRecord;
  onBackToDashboard: () => void;
  onUpdateCourseProgress: (courseId: string, lessonId: string, completed: boolean) => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  course,
  initialLessonId,
  userProfile,
  certificate,
  onBackToDashboard,
  onUpdateCourseProgress,
}) => {
  // Find current lesson or default to first
  const allLessons = course.modules.flatMap(m => m.lessons);
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || allLessons[0]?.id || ''
  );

  const currentLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'resumen' | 'notas' | 'lab' | 'quiz' | 'recursos' | 'comunidad'>('resumen');
  
  // Certificate view states upon course completion
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showCompletionCelebration, setShowCompletionCelebration] = useState<boolean>(false);

  // Interactive Notes State
  const [notes, setNotes] = useState<LessonNote[]>([
    {
      id: 'n-1',
      lessonId: 'les-1-1',
      timestamp: 145,
      formattedTime: '02:25',
      text: 'Importante: Para Flutter en Android, configurar los permisos de INTERNET en el AndroidManifest.xml.',
      createdAt: 'Hoy'
    },
    {
      id: 'n-2',
      lessonId: 'les-1-1',
      timestamp: 412,
      formattedTime: '06:52',
      text: 'Gemini 1.5 Flash responde en streaming con model.generateContentStream([]) para renderizar texto fluido.',
      createdAt: 'Hoy'
    }
  ]);
  const [newNoteText, setNewNoteText] = useState<string>('');

  // Interactive Lab Code State
  const [editableCode, setEditableCode] = useState<string>(
    currentLesson?.codeSnippet?.code || `// Escribe tu código Flutter / Dart aquí
void main() {
  print("¡Hola desde Academia Sertecep Amazónico!");
}`
  );
  const [codeConsoleOutput, setCodeConsoleOutput] = useState<string>('Presiona "Ejecutar Código" para compilar...');
  const [isExecutingCode, setIsExecutingCode] = useState<boolean>(false);

  // Interactive Prompt Lab State
  const [editablePrompt, setEditablePrompt] = useState<string>(
    currentLesson?.promptSnippet || 'Eres un asistente experto en Flutter para Sertecep. Responde con un widget de login moderno.'
  );
  const [promptOutput, setPromptOutput] = useState<string>('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Comments State
  const [comments, setComments] = useState<LessonComment[]>([
    {
      id: 'cm-1',
      lessonId: currentLesson?.id || '',
      authorName: 'Edinson Pilozo',
      authorAvatar: userProfile.photoUrl,
      isInstructor: false,
      timeAgo: 'Hace 30 min',
      text: 'Profesor, ¿la clave de API de Gemini la colocamos en .env o con variables de compilación --dart-define?',
      likes: 3
    },
    {
      id: 'cm-2',
      lessonId: currentLesson?.id || '',
      authorName: 'Ing. Arturo de la Cruz',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      isInstructor: true,
      timeAgo: 'Hace 15 min',
      text: 'Excelente pregunta Edinson. Se recomienda usar --dart-define=GEMINI_API_KEY=xxx para que quede embebido de manera segura durante el build sin subirlo a Git.',
      likes: 6
    }
  ]);
  const [newCommentText, setNewCommentText] = useState<string>('');

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote: LessonNote = {
      id: `note-${Date.now()}`,
      lessonId: activeLessonId,
      timestamp: Math.floor(currentVideoTime),
      formattedTime: formatSeconds(currentVideoTime),
      text: newNoteText.trim(),
      createdAt: 'Ahora mismo'
    };

    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setCodeConsoleOutput('Compilando código Dart...');
    setTimeout(() => {
      setIsExecutingCode(false);
      setCodeConsoleOutput(`=== EJECUCIÓN EXITOSA [FLUTTER RUNTIME - SERTECEP AMBIENTE] ===
✓ GenerativeModel inicializado con Gemini 1.5 Flash.
✓ Prompt procesado: "Diseña un plan de viaje para la Amazonía ecuatoriana"
✓ Salida del modelo:
1. Día 1: Llegada a Shushufindi, visita a senderos ecológicos y biodiversidad amazónica.
2. Día 2: Taller de desarrollo tecnológico y conectividad comunitaria.
3. Día 3: Navegación por la cuenca fluvial de Sucumbíos y cata de café amazónico.

Código ejecutado con código de salida 0 (Sin errores).`);
    }, 800);
  };

  const handleTestPrompt = () => {
    setIsGeneratingPrompt(true);
    setPromptOutput('Generando respuesta del modelo de IA...');
    setTimeout(() => {
      setIsGeneratingPrompt(false);
      setPromptOutput(`Respuesta generada por la IA para Sertecep Amazónico:
\`\`\`dart
class SertecepCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFF090E17),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Color(0xFF10B981).withOpacity(0.3)),
      ),
      padding: EdgeInsets.all(20),
      child: Text('Bienvenido al Campus Sertecep', style: TextStyle(color: Colors.white)),
    );
  }
}
\`\`\``);
    }, 900);
  };

  const handleQuizSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: LessonComment = {
      id: `c-${Date.now()}`,
      lessonId: activeLessonId,
      authorName: `${userProfile.firstName} ${userProfile.firstLastName}`,
      authorAvatar: userProfile.photoUrl,
      isInstructor: false,
      timeAgo: 'Justo ahora',
      text: newCommentText.trim(),
      likes: 0
    };

    setComments([...comments, newComment]);
    setNewCommentText('');
  };

  const completedCount = allLessons.filter(l => l.completed).length;
  const isCourseCompleted = allLessons.length > 0 && completedCount === allLessons.length;

  const activeCertificate: CertificateRecord = certificate || {
    id: `cert-${course.id}`,
    code: course.certificateCode || `ECN-CERT-2026-${course.id.toUpperCase()}`,
    courseId: course.id,
    courseTitle: course.title,
    specialty: course.tagline || 'Capacitación Profesional y Tecnológica Acreditada',
    academicHours: course.totalHours,
    issueDate: new Date().toLocaleDateString('es-EC'),
    startDate: course.startDate || '01/04/2026',
    endDate: 'Aprobado y Convalidado',
    studentName: `${userProfile.firstName} ${userProfile.secondName ? userProfile.secondName + ' ' : ''}${userProfile.firstLastName} ${userProfile.secondLastName}`.trim(),
    studentDoc: userProfile.docNumber,
    studentPhoto: userProfile.photoUrl,
    institution: 'Academia de Enseñanza Técnica y Profesional SERTECEP Amazónico',
    institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
    verificationUrl: OFFICIAL_ZEYO_BLOCKCHAIN_URL,
    qrPayload: OFFICIAL_ZEYO_BLOCKCHAIN_URL,
    instructorName: course.instructor.name,
    instructorTitle: course.instructor.role,
    directorName: OFFICIAL_SIGNER_NAME,
    directorTitle: 'Dirección Académica Regional',
    blockchainUrl: OFFICIAL_ZEYO_BLOCKCHAIN_URL,
    blockchainNetwork: 'Polygon (POS Blockchain)',
    blockchainTxHash: OFFICIAL_BLOCKCHAIN_TX,
    blockchainIssuerKey: OFFICIAL_BLOCKCHAIN_PUBKEY,
    digitalFileUrl: OFFICIAL_CERTIFICATE_SCAN,
    digitalFileType: 'image',
    digitalFileName: 'Certificado_Oficial_Sertecep_Blockchain.png',
    officialRuc: OFFICIAL_RUC,
    expedienteNum: OFFICIAL_EXPEDIENTE,
    signerName: OFFICIAL_SIGNER_NAME,
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    const lesson = allLessons.find(l => l.id === lessonId);
    if (!lesson) return;
    const willBeCompleted = !lesson.completed;
    onUpdateCourseProgress(course.id, lessonId, willBeCompleted);

    const remainingCount = allLessons.filter(l => l.id !== lessonId && !l.completed).length;
    if (willBeCompleted && remainingCount === 0) {
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.5 } });
      setShowCompletionCelebration(true);
    }
  };

  const handleCompleteAllLessons = () => {
    allLessons.forEach(l => {
      if (!l.completed) {
        onUpdateCourseProgress(course.id, l.id, true);
      }
    });
    confetti({ particleCount: 130, spread: 90, origin: { y: 0.5 } });
    setShowCompletionCelebration(true);
  };

  return (
    <div className="min-h-screen bg-[#080c12] text-slate-100 flex flex-col">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver a mis cursos</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>{course.title}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-emerald-400 font-medium truncate max-w-xs">{currentLesson.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Certificate Action Button in Header */}
          {isCourseCompleted ? (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-lg shadow-amber-400/25 active:scale-95 animate-pulse"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>Ver mi Certificado Oficial</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition"
              title="Previsualizar formato del certificado de este curso"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Certificado</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">Progreso del Alumno</p>
            <p className="text-[11px] text-emerald-400 font-mono">
              Lección {currentLesson.lessonNumber} de {allLessons.length} ({Math.round((completedCount / allLessons.length) * 100)}% completado)
            </p>
          </div>
          <div className="w-10 h-10 rounded-full border border-emerald-500/30 overflow-hidden bg-slate-900 flex items-center justify-center text-xs font-bold text-emerald-400">
            {userProfile.firstName[0]}{userProfile.firstLastName[0]}
          </div>
        </div>
      </div>

      {/* Main Grid: Player & Details on Left, Course Syllabus Roadmap on Right */}
      <div className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-w-0 pb-24 sm:pb-12">
        {/* Left Column: Video & Tabs (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full min-w-0">
          {/* Video Player */}
          <VideoPlayer
            title={currentLesson.title}
            videoUrl={currentLesson.videoUrl}
            youtubeUrl={currentLesson.youtubeUrl}
            currentTime={currentVideoTime}
            onTimeUpdate={setCurrentVideoTime}
            onSeek={setCurrentVideoTime}
            isCompleted={currentLesson.completed}
            onToggleComplete={() => handleToggleLessonComplete(currentLesson.id)}
            onSaveProgress={() => {}}
          />

          {/* Lesson Header Title & Meta */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium">
                  MÓDULO {currentLesson.moduleOrder} · LECCIÓN {currentLesson.lessonNumber}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-mono text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentLesson.duration}
                </span>
              </div>

              {currentLesson.completed && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Clase Aprobada
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentLesson.title}
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              {currentLesson.summary}
            </p>
          </div>

          {/* Interactive Lesson Tabs */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
            {/* Tab Headers */}
            <div className="flex items-center overflow-x-auto border-b border-slate-800 p-2 gap-1 bg-slate-950/40">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'resumen' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Resumen & Claves
              </button>

              <button
                onClick={() => setActiveTab('notas')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'notas' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Apuntes con Tiempo ({notes.length})
              </button>

              <button
                onClick={() => setActiveTab('lab')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'lab' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Code className="w-4 h-4" />
                Laboratorio Código & IA
              </button>

              {currentLesson.quiz && currentLesson.quiz.length > 0 && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'quiz' 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Quiz de Evaluación
                </button>
              )}

              <button
                onClick={() => setActiveTab('recursos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'recursos' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Download className="w-4 h-4" />
                Recursos ({currentLesson.resources.length})
              </button>

              <button
                onClick={() => setActiveTab('comunidad')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'comunidad' 
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Comunidad ({comments.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {/* TAB: Resumen */}
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                      Puntos Clave de la Lección
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {currentLesson.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            {idx + 1}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentLesson.codeSnippet && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Fragmento de Código de la Clase ({currentLesson.codeSnippet.language})
                        </span>
                        <button
                          onClick={() => setActiveTab('lab')}
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Abrir en Laboratorio Interactivo →
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                        {currentLesson.codeSnippet.code}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Notas con Tiempo */}
              {activeTab === 'notas' && (
                <div className="space-y-6">
                  {/* Note Creator synced with video time */}
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Escribe un apunte sincronizado con el video actual:</span>
                      <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Marca de tiempo: {formatSeconds(currentVideoTime)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder={`Ej: "Aquí el profesor explica cómo configurar el SDK de Flutter..."`}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Añadir Apunte
                      </button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3 pt-2">
                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        Aún no tienes notas en esta clase. Añade una arriba para repasarla luego.
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => setCurrentVideoTime(note.timestamp)}
                              title="Saltar a este segundo en el video"
                              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-mono text-xs rounded-md font-semibold transition-colors flex items-center gap-1 shrink-0"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              {note.formattedTime}
                            </button>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-0.5">
                              {note.text}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition"
                            title="Eliminar apunte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: Laboratorio de Código & IA */}
              {activeTab === 'lab' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">
                          Editor de Código Dart / Flutter
                        </span>
                      </div>
                      <button
                        onClick={handleRunCode}
                        disabled={isExecutingCode}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-transform active:scale-95 flex items-center gap-1.5"
                      >
                        <Code className="w-3.5 h-3.5" />
                        {isExecutingCode ? 'Ejecutando...' : 'Ejecutar Código'}
                      </button>
                    </div>
                    <textarea
                      value={editableCode}
                      onChange={(e) => setEditableCode(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                    />
                    {/* Console Output */}
                    <div className="mt-3 p-3.5 bg-black rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                      <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-1 font-sans font-semibold">
                        Terminal & Consola de Salida
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed text-emerald-400">
                        {codeConsoleOutput}
                      </pre>
                    </div>
                  </div>

                  {/* AI Prompting Sandbox */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-white uppercase tracking-wider">
                          Probador de Prompts para Flutter con IA
                        </span>
                      </div>
                      <button
                        onClick={handleTestPrompt}
                        disabled={isGeneratingPrompt}
                        className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {isGeneratingPrompt ? 'Generando...' : 'Enviar Prompt a la IA'}
                      </button>
                    </div>
                    <textarea
                      value={editablePrompt}
                      onChange={(e) => setEditablePrompt(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                    />
                    {promptOutput && (
                      <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap">
                        {promptOutput}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: Quiz de Evaluación */}
              {activeTab === 'quiz' && currentLesson.quiz && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">Comprobación de Conocimientos</h4>
                      <p className="text-xs text-slate-400">Responde las preguntas para verificar tu aprendizaje en esta lección.</p>
                    </div>
                    {quizSubmitted && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30">
                        Evaluación Revisada
                      </span>
                    )}
                  </div>

                  <div className="space-y-6">
                    {currentLesson.quiz.map((q, qIndex) => {
                      const selected = quizAnswers[q.id];
                      const isCorrect = selected === q.correctIndex;

                      return (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                          <p className="text-xs sm:text-sm font-semibold text-white">
                            {qIndex + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options.map((opt, optIndex) => {
                              const isThisSelected = selected === optIndex;
                              let borderClass = 'border-slate-800 hover:border-slate-700';
                              if (quizSubmitted) {
                                if (optIndex === q.correctIndex) {
                                  borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-300';
                                } else if (isThisSelected && !isCorrect) {
                                  borderClass = 'border-red-500 bg-red-500/10 text-red-300';
                                }
                              } else if (isThisSelected) {
                                borderClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  type="button"
                                  onClick={() => !quizSubmitted && handleQuizSelect(q.id, optIndex)}
                                  className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-between ${borderClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIndex === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <p className="text-xs text-slate-400 pt-1 italic">
                              Explicación: {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < currentLesson.quiz.length}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                      Entregar Respuestas
                    </button>
                  ) : (
                    <button
                      onClick={() => setQuizSubmitted(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
                    >
                      Intentar de nuevo
                    </button>
                  )}
                </div>
              )}

              {/* TAB: Recursos */}
              {activeTab === 'recursos' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Archivos Descargables del Docente
                  </h4>

                  {currentLesson.resources.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center">
                      No hay recursos adjuntos para esta clase específica.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentLesson.resources.map((res) => (
                        <div
                          key={res.id}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                              {res.type.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{res.title}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{res.size}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              confetti({ particleCount: 20 });
                              alert(`Iniciando descarga simulada de: ${res.title}`);
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                            title="Descargar archivo"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Comunidad */}
              {activeTab === 'comunidad' && (
                <div className="space-y-6">
                  {/* New comment input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Deja tu duda o aporte para el docente y compañeros..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </button>
                  </form>

                  {/* Comments thread */}
                  <div className="space-y-4">
                    {comments.map((cm) => (
                      <div key={cm.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-emerald-400 overflow-hidden">
                              {cm.authorName[0]}
                            </div>
                            <span className="text-xs font-semibold text-white">{cm.authorName}</span>
                            {cm.isInstructor && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                                DOCENTE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{cm.timeAgo}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-9">
                          {cm.text}
                        </p>
                        <div className="pl-9 pt-1 flex items-center gap-3 text-xs text-slate-400">
                          <button
                            onClick={() => {
                              setComments(comments.map(c => c.id === cm.id ? { ...c, likes: c.likes + 1 } : c));
                            }}
                            className="flex items-center gap-1 hover:text-emerald-400 transition"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{cm.likes} me gusta</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Course Roadmap / Temario / Hoja de Ruta (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Summary Card as seen in Screenshot 2 */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              PANEL DEL ALUMNO
            </h3>
            <h2 className="text-lg font-bold text-white tracking-tight">Tu hoja de ruta</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Acceso, progreso y continuidad del curso en una vista clara y ordenada.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Progreso actual:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Math.round((allLessons.filter(l => l.completed).length / allLessons.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(allLessons.filter(l => l.completed).length / allLessons.length) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400 font-mono">
                <div>
                  <span>COMPLETADAS: </span>
                  <span className="text-white font-bold">{allLessons.filter(l => l.completed).length}/{allLessons.length}</span>
                </div>
                <div>
                  <span>DURACIÓN: </span>
                  <span className="text-white font-bold">{course.totalHours}h</span>
                </div>
              </div>

              {/* Certificate Status & Quick Actions in Roadmap */}
              {isCourseCompleted ? (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-500/20 via-slate-900 to-amber-500/15 border border-emerald-500/40 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        ¡Curso 100% Finalizado!
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Has completado todas las clases y talleres. Tu certificado oficial con validación Blockchain en Polygon (Zeyo ID) y respaldo legal está listo.
                    </p>
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-98"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Ver y Descargar mi Certificado Oficial</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <button
                    onClick={handleCompleteAllLessons}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5"
                    title="Simular finalización completa para emitir el certificado inmediatamente"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completar todo el curso (Ver Certificado)</span>
                  </button>

                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-1.5 px-3 bg-transparent hover:bg-slate-800/80 text-slate-400 hover:text-amber-400 text-[11px] font-medium rounded-lg transition flex items-center justify-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Previsualizar modelo de certificado</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Syllabus Accordion / Class List matching image_d018d2ed.png */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Ruta del curso</h3>
                <p className="text-xs text-slate-400">Sigue la ruta numerada de clases</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {allLessons.length} lecciones
              </span>
            </div>

            <div className="space-y-6 max-h-[650px] overflow-y-auto pr-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                      MÓDULO {mod.moduleNumber}:
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {mod.title}
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    {mod.lessons.map((les) => {
                      const isActive = les.id === activeLessonId;

                      return (
                        <button
                          key={les.id}
                          onClick={() => setActiveLessonId(les.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 border ${
                            isActive
                              ? 'bg-emerald-500/15 border-emerald-500/50 shadow-sm'
                              : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {/* Number Bubble */}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isActive
                                ? 'bg-emerald-500 text-slate-950'
                                : les.completed
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {les.completed && !isActive ? '✓' : les.lessonNumber}
                            </div>

                            <div className="truncate text-left">
                              <p className={`text-xs font-medium truncate ${isActive ? 'text-emerald-300 font-semibold' : 'text-slate-300'}`}>
                                {les.title}
                              </p>
                              {isActive ? (
                                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                                  ▶ Viendo ahora
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-500">
                                  {les.duration}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            {les.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Completion Celebration Modal */}
      {showCompletionCelebration && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShowCompletionCelebration(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Award className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-400 font-mono tracking-widest uppercase">
                ACREDITACIÓN ACADÉMICA OFICIAL · SERTECEP AMAZÓNICO
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                ¡Felicitaciones! Has completado el curso
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Has finalizado con éxito el 100% del programa en <strong>"{course.title}"</strong> con {course.totalHours} horas académicas. Tu certificado ha sido emitido con validación Blockchain en Polygon (Zeyo ID).
              </p>
            </div>

            {/* Mini preview card */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">ESTUDIANTE:</span>
                <span className="text-white font-bold">{userProfile.firstName} {userProfile.firstLastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CÉDULA:</span>
                <span className="text-white">{userProfile.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VALIDACIÓN:</span>
                <span className="text-emerald-400 font-bold">Polygon Blockchain (Zeyo ID)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => {
                  setShowCompletionCelebration(false);
                  setShowCertificateModal(true);
                }}
                className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Ver y Descargar mi Certificado</span>
              </button>
              <a
                href={activeCertificate.blockchainUrl || OFFICIAL_ZEYO_BLOCKCHAIN_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Blockchain</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Certificate Inspection & Download Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <CertificateDocument
              certificate={activeCertificate}
              isModal={true}
              onClose={() => setShowCertificateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
