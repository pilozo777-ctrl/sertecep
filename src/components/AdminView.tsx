import React, { useState } from 'react';
import { Course, CourseModule, Lesson, StudentEnrollment, CertificateRecord } from '../types';
import { OFFICIAL_SERTECEP_LOGO, OFFICIAL_SERTECEP_PORTADA, SUPPORT_WHATSAPP_NUMBER } from '../data/mockData';
import { 
  ShieldCheck, BookOpen, Users, Award, Settings, Plus, 
  Trash2, Edit3, CheckCircle2, Search, ArrowRight, Video, 
  Download, FileText, Phone, Mail, Check, X, Key, Copy, UserPlus, Layers, Eye, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateDocument } from './CertificateDocument';

interface AdminViewProps {
  courses: Course[];
  students: StudentEnrollment[];
  certificates: CertificateRecord[];
  onUpdateCourses: (courses: Course[]) => void;
  onUpdateStudents: (students: StudentEnrollment[]) => void;
  onAddCertificate: (newCert: CertificateRecord) => void;
  onUpdateCertificates?: (certificates: CertificateRecord[]) => void;
  onAddCourse: (newCourse: Course) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  courses,
  students,
  certificates,
  onUpdateCourses,
  onUpdateStudents,
  onAddCertificate,
  onUpdateCertificates,
  onAddCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'create_student' | 'certificates' | 'settings'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');

  // Modal for new lesson
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonModuleIndex, setLessonModuleIndex] = useState(0);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('15:00');
  const [newLessonVideoUrl, setNewLessonVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const [newLessonYoutubeUrl, setNewLessonYoutubeUrl] = useState('https://youtube.com');
  const [newLessonSummary, setNewLessonSummary] = useState('');

  // States for Editing existing Lesson & Video URL
  const [editingLessonInfo, setEditingLessonInfo] = useState<{
    moduleId: string;
    lesson: Lesson;
  } | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonDuration, setEditLessonDuration] = useState('');
  const [editLessonVideoUrl, setEditLessonVideoUrl] = useState('');
  const [editLessonYoutubeUrl, setEditLessonYoutubeUrl] = useState('');
  const [editLessonSummary, setEditLessonSummary] = useState('');
  const [testVideoPlaying, setTestVideoPlaying] = useState(false);

  // Modal for new course
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseBadge, setNewCourseBadge] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<'Desarrollo Móvil' | 'Sistemas Web' | 'Ofimática & BI' | 'Inteligencia Artificial'>('Inteligencia Artificial');
  const [newCourseHours, setNewCourseHours] = useState(120);
  const [newCourseDescription, setNewCourseDescription] = useState('');

  // States for Editing existing Course
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseBadge, setEditCourseBadge] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState<'Desarrollo Móvil' | 'Sistemas Web' | 'Ofimática & BI' | 'Inteligencia Artificial'>('Inteligencia Artificial');
  const [editCourseHours, setEditCourseHours] = useState(120);
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editCourseTagline, setEditCourseTagline] = useState('');
  const [editCourseInstructorName, setEditCourseInstructorName] = useState('');

  // Certificate Modals & Management
  const [previewingCertificate, setPreviewingCertificate] = useState<CertificateRecord | null>(null);
  const [isCreatingManualCert, setIsCreatingManualCert] = useState(false);
  const [manualCertStudentId, setManualCertStudentId] = useState(students[0]?.id || '');
  const [manualCertCourseId, setManualCertCourseId] = useState(courses[0]?.id || '');
  const [manualCertHours, setManualCertHours] = useState(120);
  const [manualCertSpecialty, setManualCertSpecialty] = useState('Capacitación Profesional y Tecnológica Acreditada');
  const [manualCertInstructor, setManualCertInstructor] = useState('Ing. Arturo de la Cruz');

  // Form for creating a new student profile and credentials
  const [studentFullName, setStudentFullName] = useState('');
  const [studentDocNumber, setStudentDocNumber] = useState('');
  const [studentPhone, setStudentPhone] = useState('+593');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('Sertecep2026*');
  const [studentCourseId, setStudentCourseId] = useState(courses[0]?.id || '');
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    name: string;
    username: string;
    password: string;
    phone: string;
  } | null>(null);

  // Search in students
  const [studentSearch, setStudentSearch] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFullName.trim() || !studentUsername.trim()) return;

    const matchedCourse = courses.find(c => c.id === studentCourseId) || courses[0];

    const newStudent: StudentEnrollment = {
      id: `st-${Date.now()}`,
      username: studentUsername.trim().toLowerCase(),
      password: studentPassword.trim(),
      studentName: studentFullName.trim().toUpperCase(),
      email: studentEmail.trim() || `${studentUsername.trim()}@sertecep.edu.ec`,
      docNumber: studentDocNumber.trim(),
      phone: studentPhone.trim(),
      courseId: matchedCourse.id,
      courseTitle: matchedCourse.title,
      progressPercent: 0,
      completedLessons: 0,
      totalLessons: matchedCourse.totalLessons,
      certificateApproved: false,
      registrationDate: new Date().toLocaleDateString('es-EC'),
    };

    onUpdateStudents([newStudent, ...students]);
    setLastCreatedCredentials({
      name: newStudent.studentName,
      username: newStudent.username,
      password: newStudent.password || '123',
      phone: newStudent.phone,
    });

    confetti({ particleCount: 50, spread: 70 });
    triggerToast(`¡Perfil creado! El estudiante ${newStudent.studentName} ya puede ingresar con su usuario.`);

    // Reset inputs
    setStudentFullName('');
    setStudentDocNumber('');
    setStudentUsername('');
    setStudentEmail('');
  };

  const handleCopyCredentials = () => {
    if (!lastCreatedCredentials) return;
    const msg = `🎓 *Academia Sertecep Amazónico* (Shushufindi, Ecuador)\n¡Hola ${lastCreatedCredentials.name}! Tu acceso al Aula Virtual ha sido habilitado:\n\n🌐 *Portal:* https://sertecep-amazonico.edu.ec\n👤 *Usuario:* ${lastCreatedCredentials.username}\n🔑 *Contraseña:* ${lastCreatedCredentials.password}\n\n¡Bienvenido y mucho éxito en tus estudios!`;
    navigator.clipboard.writeText(msg);
    triggerToast('¡Credenciales copiadas al portapapeles para WhatsApp!');
  };

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: newCourseTitle.trim(),
      badgeTitle: newCourseBadge.trim() || newCourseTitle.trim().toUpperCase(),
      tagline: newCourseDescription.trim().substring(0, 100) || 'Formación técnica especializada con Academia Sertecep.',
      description: newCourseDescription.trim(),
      category: newCourseCategory,
      level: 'Principiante a Avanzado',
      coverImage: '/src/assets/images/course_flutter_ai_1793675124066.jpg',
      instructor: {
        name: 'Ing. Arturo de la Cruz',
        role: 'Director Académico Sertecep Amazónico',
        avatar: OFFICIAL_SERTECEP_LOGO,
      },
      totalHours: Number(newCourseHours) || 120,
      totalModules: 1,
      totalLessons: 1,
      progressPercent: 0,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: 'Indefinido',
      hasCertificate: true,
      modules: [
        {
          id: `mod-${Date.now()}-1`,
          moduleNumber: 1,
          title: 'Introducción y Fundamentos Prácticos',
          description: 'Módulo inicial de ambientación y conceptos clave.',
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              moduleOrder: 1,
              lessonNumber: 1,
              title: 'Bienvenida e Instalación de Herramientas',
              duration: '15:00',
              durationSeconds: 900,
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              youtubeUrl: 'https://youtube.com',
              summary: 'Clase de inducción a la especialidad técnica.',
              keyPoints: ['Objetivos de aprendizaje', 'Entorno de trabajo'],
              completed: false,
              resources: [],
              quiz: []
            }
          ]
        }
      ]
    };

    onAddCourse(newCourseObj);
    setIsAddingCourse(false);
    setNewCourseTitle('');
    setNewCourseBadge('');
    setNewCourseDescription('');
    confetti({ particleCount: 40, spread: 60 });
    triggerToast('¡Nuevo curso creado y colocado en el aula!');
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    const newLesson: Lesson = {
      id: `les-custom-${Date.now()}`,
      moduleOrder: lessonModuleIndex + 1,
      lessonNumber: selectedCourse.modules.flatMap(m => m.lessons).length + 1,
      title: newLessonTitle.trim(),
      duration: newLessonDuration.trim() || '15:00',
      durationSeconds: 900,
      videoUrl: newLessonVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      youtubeUrl: newLessonYoutubeUrl.trim(),
      summary: newLessonSummary.trim() || 'Contenido técnico administrado por Academia Sertecep Amazónico.',
      keyPoints: ['Configuración y arquitectura inicial', 'Buenas prácticas en desarrollo móvil y web'],
      completed: false,
      resources: [],
      quiz: []
    };

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourse.id) return course;
      const updatedModules = [...course.modules];
      if (updatedModules[lessonModuleIndex]) {
        updatedModules[lessonModuleIndex] = {
          ...updatedModules[lessonModuleIndex],
          lessons: [...updatedModules[lessonModuleIndex].lessons, newLesson]
        };
      }
      return {
        ...course,
        totalLessons: course.totalLessons + 1,
        modules: updatedModules
      };
    });

    onUpdateCourses(updatedCourses);
    setIsAddingLesson(false);
    setNewLessonTitle('');
    setNewLessonSummary('');
    confetti({ particleCount: 35, spread: 60 });
    triggerToast('¡Nueva lección agregada exitosamente al curso!');
  };

  const handleDeleteLesson = (moduleId: string, lessonId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta lección del temario?')) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourse.id) return course;
      const updatedModules = course.modules.map(mod => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.filter(l => l.id !== lessonId)
        };
      });
      return {
        ...course,
        totalLessons: Math.max(course.totalLessons - 1, 0),
        modules: updatedModules
      };
    });

    onUpdateCourses(updatedCourses);
    triggerToast('Lección eliminada del curso.');
  };

  // Handler for editing an existing lesson and its video URL
  const handleStartEditLesson = (moduleId: string, lesson: Lesson) => {
    setEditingLessonInfo({ moduleId, lesson });
    setEditLessonTitle(lesson.title);
    setEditLessonDuration(lesson.duration || '20:00');
    setEditLessonVideoUrl(lesson.videoUrl || '');
    setEditLessonYoutubeUrl(lesson.youtubeUrl || '');
    setEditLessonSummary(lesson.summary || '');
    setTestVideoPlaying(false);
  };

  const handleSaveEditLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLessonInfo || !editLessonTitle.trim()) return;

    const { moduleId, lesson } = editingLessonInfo;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourse.id) return course;
      const updatedModules = course.modules.map(mod => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.map(l => {
            if (l.id !== lesson.id) return l;
            return {
              ...l,
              title: editLessonTitle.trim(),
              duration: editLessonDuration.trim() || '15:00',
              videoUrl: editLessonVideoUrl.trim() || l.videoUrl,
              youtubeUrl: editLessonYoutubeUrl.trim(),
              summary: editLessonSummary.trim(),
            };
          })
        };
      });
      return {
        ...course,
        modules: updatedModules
      };
    });

    onUpdateCourses(updatedCourses);
    setEditingLessonInfo(null);
    confetti({ particleCount: 40, spread: 60 });
    triggerToast('¡Video y contenido de la clase guardados con éxito!');
  };

  // Handler for editing course details
  const handleStartEditCourse = () => {
    setEditCourseTitle(selectedCourse.title);
    setEditCourseBadge(selectedCourse.badgeTitle);
    setEditCourseCategory(selectedCourse.category as any);
    setEditCourseHours(selectedCourse.totalHours);
    setEditCourseDescription(selectedCourse.description);
    setEditCourseTagline(selectedCourse.tagline);
    setEditCourseInstructorName(selectedCourse.instructor.name);
    setIsEditingCourse(true);
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseTitle.trim()) return;

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourse.id) return course;
      return {
        ...course,
        title: editCourseTitle.trim(),
        badgeTitle: editCourseBadge.trim() || editCourseTitle.trim().toUpperCase(),
        category: editCourseCategory,
        totalHours: Number(editCourseHours) || course.totalHours,
        description: editCourseDescription.trim(),
        tagline: editCourseTagline.trim() || editCourseDescription.trim().substring(0, 90),
        instructor: {
          ...course.instructor,
          name: editCourseInstructorName.trim() || course.instructor.name
        }
      };
    });

    onUpdateCourses(updatedCourses);
    setIsEditingCourse(false);
    confetti({ particleCount: 45, spread: 65 });
    triggerToast('¡Información del curso actualizada exitosamente!');
  };

  // Handler for manual certificate issuance
  const handleEmitManualCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === manualCertStudentId) || students[0];
    const course = courses.find(c => c.id === manualCertCourseId) || courses[0];
    if (!student || !course) return;

    const newCertCode = `ECN-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newRecord: CertificateRecord = {
      id: `cert-manual-${Date.now()}`,
      code: newCertCode,
      courseId: course.id,
      courseTitle: course.title,
      specialty: manualCertSpecialty.trim() || 'Capacitación Profesional y Tecnológica Acreditada',
      academicHours: Number(manualCertHours) || 120,
      issueDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      startDate: student.registrationDate || '2026-04-01',
      endDate: 'Aprobado y Convalidado',
      studentName: student.studentName,
      studentDoc: student.docNumber,
      studentPhoto: '/assets/aistudio/image_f29cb282.png',
      institution: 'Academia Sertecep Amazónico S.A.S.',
      institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
      verificationUrl: `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
      qrPayload: `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
      instructorName: manualCertInstructor.trim() || 'Ing. Arturo de la Cruz',
      instructorTitle: 'Docente Especialista',
      directorName: 'Gerencia General Sertecep',
      directorTitle: 'Dirección Académica Regional'
    };

    onAddCertificate(newRecord);
    setIsCreatingManualCert(false);
    confetti({ particleCount: 50, spread: 70 });
    triggerToast(`¡Diploma oficial emitido con código ${newCertCode}!`);
  };

  const handleDeleteCertificate = (certId: string) => {
    if (!window.confirm('¿Seguro que deseas revocar/eliminar este diploma?')) return;
    if (onUpdateCertificates) {
      onUpdateCertificates(certificates.filter(c => c.id !== certId));
    }
    triggerToast('Diploma retirado del registro.');
  };

  const handleToggleCertificateApproval = (studentId: string) => {
    const updated = students.map(s => {
      if (s.id !== studentId) return s;
      const newState = !s.certificateApproved;

      if (newState) {
        const newCertCode = `ECN-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const newRecord: CertificateRecord = {
          id: `cert-gen-${Date.now()}`,
          code: newCertCode,
          courseId: s.courseId,
          courseTitle: s.courseTitle,
          specialty: 'Capacitación Profesional y Tecnológica Acreditada',
          academicHours: 240,
          issueDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
          startDate: s.registrationDate,
          endDate: 'En curso / Aprobado',
          studentName: s.studentName,
          studentDoc: s.docNumber,
          studentPhoto: '/assets/aistudio/image_f29cb282.png',
          institution: 'Academia Sertecep Amazónico S.A.S.',
          institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
          verificationUrl: `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
          qrPayload: `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
          instructorName: 'Ing. Arturo de la Cruz',
          instructorTitle: 'Docente Especialista',
          directorName: 'Gerencia General Sertecep',
          directorTitle: 'Dirección Académica Regional'
        };
        onAddCertificate(newRecord);
        confetti({ particleCount: 50, spread: 70 });
        triggerToast(`¡Certificado ${newCertCode} emitido para ${s.studentName}!`);
      } else {
        triggerToast(`Certificado revocado para ${s.studentName}.`);
      }

      return {
        ...s,
        certificateApproved: newState
      };
    });

    onUpdateStudents(updated);
  };

  const filteredStudents = students.filter(s =>
    s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.docNumber.includes(studentSearch) ||
    s.courseTitle.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-300">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Header Banner with Official Logo */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-emerald-500/40 p-1.5 flex items-center justify-center shadow-lg shadow-amber-400/10">
            <img
              src={OFFICIAL_SERTECEP_LOGO}
              alt="Logo Sertecep Amazónico"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1 font-mono">
              PANEL ADMINISTRATIVO · CLAVE ACTIVA: MIaPilozo1983#
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Gestión Integral Sertecep Amazónico
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Crea cursos, administra lecciones y genera usuarios y contraseñas de ingreso para tus alumnos.
            </p>
          </div>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cursos ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('create_student')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'create_student'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Alumno & Clave</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lista Alumnos ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'certificates'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Diplomas ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Ajustes Sede</span>
          </button>
        </div>
      </div>

      {/* TAB: CREAR ESTUDIANTE Y USUARIO DE INGRESO (Requested by user) */}
      {activeTab === 'create_student' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Creation Form (7 cols) */}
          <form
            onSubmit={handleCreateStudent}
            className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                REGISTRO OFICIAL DE ALUMNO
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Crear Perfil y Dar Usuario de Ingreso
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Asigna un usuario y contraseña para que el estudiante pueda iniciar sesión y visualizar sus cursos en el aula.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nombres y Apellidos Completos (para el diploma)
                </label>
                <input
                  type="text"
                  value={studentFullName}
                  onChange={(e) => setStudentFullName(e.target.value)}
                  placeholder="Ej: KEVIN ANDRÉS MACÍAS ZAMBRANO"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 uppercase font-mono font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Cédula / Documento de Identidad
                  </label>
                  <input
                    type="text"
                    value={studentDocNumber}
                    onChange={(e) => setStudentDocNumber(e.target.value)}
                    placeholder="2100897654"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    WhatsApp del Alumno
                  </label>
                  <input
                    type="text"
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    placeholder="+593 98 123 4567"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Curso en el que se Matricula
                </label>
                <select
                  value={studentCourseId}
                  onChange={(e) => setStudentCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.totalHours} horas)
                    </option>
                  ))}
                </select>
              </div>

              {/* Login Credentials Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                  CREDENCIALES DE INGRESO PARA EL ESTUDIANTE:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">
                      Usuario de Ingreso
                    </label>
                    <input
                      type="text"
                      value={studentUsername}
                      onChange={(e) => setStudentUsername(e.target.value)}
                      placeholder="Ej: kmacias2026"
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono">
                      Contraseña Asignada
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Sertecep2026*"
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setStudentPassword(`Sertecep${Math.floor(100 + Math.random() * 900)}*`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono shrink-0"
                        title="Generar clave aleatoria"
                      >
                        Generar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Crear Perfil y Activar Acceso del Alumno</span>
              </button>
            </div>
          </form>

          {/* Right: Last Created Credentials Card / WhatsApp Sender (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>Último Acceso Generado</span>
              </h3>

              {lastCreatedCredentials ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">ALUMNO:</span>
                    <span className="text-white font-bold">{lastCreatedCredentials.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">USUARIO:</span>
                    <span className="text-emerald-400 font-bold">{lastCreatedCredentials.username}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">CLAVE:</span>
                    <span className="text-white font-bold">{lastCreatedCredentials.password}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">WHATSAPP:</span>
                    <span className="text-slate-300">{lastCreatedCredentials.phone}</span>
                  </div>

                  <div className="pt-3 flex gap-2 font-sans">
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Credenciales</span>
                    </button>
                    <a
                      href={`https://wa.me/${lastCreatedCredentials.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `🎓 *Academia Sertecep Amazónico*\n¡Hola ${lastCreatedCredentials.name}! Tu acceso al Aula Virtual está listo:\n👤 Usuario: ${lastCreatedCredentials.username}\n🔑 Clave: ${lastCreatedCredentials.password}\n¡Bienvenido!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition flex items-center justify-center"
                      title="Enviar por WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500 leading-relaxed">
                  Completa el formulario de la izquierda para registrar a un nuevo estudiante y generar sus credenciales de ingreso para WhatsApp.
                </div>
              )}
            </div>

            {/* Quick list of registered student accounts */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Accesos de Estudiantes ({students.length})
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Solo Visualización</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {students.map((st) => (
                  <div
                    key={st.id}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white text-[11px]">{st.studentName}</p>
                      <p className="text-[10px] font-mono text-emerald-400">
                        Usuario: {st.username} · Clave: {st.password || '123'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {st.progressPercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CURSOS & LECCIONES (Colocar cursos y lecciones) */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Top Actions: Place/Create Course & Add Lesson */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                Seleccionar Curso:
              </span>
              {courses.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCourse.id === c.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {c.badgeTitle || c.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleStartEditCourse}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 border border-slate-700"
                title="Editar título, descripción, horas o instructor de este curso"
              >
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Editar Curso</span>
              </button>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Colocar Nuevo Curso</span>
              </button>
              <button
                onClick={() => setIsAddingLesson(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Lección</span>
              </button>
            </div>
          </div>

          {/* Selected Course Detail */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {selectedCourse.category} · {selectedCourse.totalHours} HORAS ACADÉMICAS
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                  {selectedCourse.title}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedCourse.tagline}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Docente: {selectedCourse.instructor.name}</p>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="text-slate-400 block">TOTAL LECCIONES ACTIVAS</span>
                <span className="text-xl font-black text-white">
                  {selectedCourse.modules.flatMap(m => m.lessons).length}
                </span>
              </div>
            </div>

            {/* Modules and Lessons List */}
            <div className="space-y-6">
              {selectedCourse.modules.map((mod) => (
                <div key={mod.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        MÓDULO {mod.moduleNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {mod.lessons.length} lecciones
                    </span>
                  </div>

                  <div className="space-y-2">
                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {les.lessonNumber}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">{les.title}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <span>Duración: {les.duration}</span>
                              <span>·</span>
                              <span className="text-emerald-400">Video Activo</span>
                              {les.youtubeUrl && (
                                <>
                                  <span>·</span>
                                  <span className="text-red-400">YouTube</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEditLesson(mod.id, les)}
                            className="px-2.5 py-1.5 text-xs text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-lg transition flex items-center gap-1 font-semibold"
                            title="Editar lección y colocar/cambiar el video"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Editar Video</span>
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(mod.id, les.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                            title="Eliminar lección"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: LISTA DE ESTUDIANTES */}
      {activeTab === 'students' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Estudiantes Matriculados</h2>
              <p className="text-xs text-slate-400">Control de avance, usuarios de ingreso y habilitación de diplomas.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Buscar por nombre, cédula o curso..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-9"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3.5">Estudiante & Usuario</th>
                  <th className="p-3.5">Cédula</th>
                  <th className="p-3.5">WhatsApp</th>
                  <th className="p-3.5">Curso Matriculado</th>
                  <th className="p-3.5">Progreso</th>
                  <th className="p-3.5">Estado Diploma</th>
                  <th className="p-3.5 text-right">Acción Administrativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3.5 font-bold text-white">
                      <div>{st.studentName}</div>
                      <div className="text-[11px] text-emerald-400 font-mono font-normal">
                        Usuario: {st.username} | Clave: {st.password || '123'}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-300 font-medium">
                      {st.docNumber}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400">
                      <a
                        href={`https://wa.me/${st.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        {st.phone}
                      </a>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-[200px] truncate">
                      {st.courseTitle}
                    </td>
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{st.progressPercent}%</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${st.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {st.certificateApproved ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Habilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                          En revisión
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleToggleCertificateApproval(st.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                          st.certificateApproved
                            ? 'bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        }`}
                      >
                        {st.certificateApproved ? 'Revocar Diploma' : 'Aprobar Diploma'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: CERTIFICADOS EMITIDOS */}
      {activeTab === 'certificates' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Registro de Diplomas y Certificaciones</h2>
              <p className="text-xs text-slate-400">
                Certificados con código de validación institucional registrado ante Academia Sertecep Amazónico S.A.S.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingManualCert(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Emitir Nuevo Diploma</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map(c => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    {c.code}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Emitido: {c.issueDate}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{c.studentName}</h4>
                  <p className="text-xs text-slate-300 font-medium">{c.courseTitle}</p>
                  <p className="text-[11px] text-slate-500">Cédula: {c.studentDoc} · {c.academicHours} horas lectivas</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400 font-mono">Firma: {c.instructorName}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewingCertificate(c)}
                      className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded text-xs font-semibold flex items-center gap-1 transition"
                      title="Ver diploma oficial y descargar"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Diploma</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(c.id)}
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition"
                      title="Eliminar diploma"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AJUSTES INSTITUCIONALES */}
      {activeTab === 'settings' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Configuración Institucional de la Academia</h2>
            <p className="text-xs text-slate-400">Datos mostrados en el portal, botones de soporte y diplomas oficiales.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Línea Directa de WhatsApp de Soporte
              </label>
              <input
                type="text"
                defaultValue={SUPPORT_WHATSAPP_NUMBER}
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-emerald-400 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Razón Social & Registro
              </label>
              <input
                type="text"
                defaultValue="Academia Sertecep Amazónico S.A.S. - RUC: 2191754820001"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Sede Principal
              </label>
              <input
                type="text"
                defaultValue="Cantón Shushufindi, Provincia de Sucumbíos, Ecuador"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Credenciales Maestras de Administrador
              </label>
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-400/30 text-amber-300 font-mono">
                <div>Usuario: <strong>admin</strong></div>
                <div>Contraseña: <strong>MIaPilozo1983#</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Colocar Nuevo Curso */}
      {isAddingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCourseSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddingCourse(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                ADMINISTRACIÓN DE CONTENIDOS
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Colocar Nuevo Curso en el Aula Virtual
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nombre del Curso
                </label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Ej: Automatización con Python & Agentes de IA"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                    <option value="Desarrollo Móvil">Desarrollo Móvil</option>
                    <option value="Sistemas Web">Sistemas Web</option>
                    <option value="Ofimática & BI">Ofimática & BI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Horas Académicas
                  </label>
                  <input
                    type="number"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Descripción del Curso
                </label>
                <textarea
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalla las competencias que adquirirá el estudiante..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingCourse(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Publicar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Añadir Lección */}
      {isAddingLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddLessonSubmit}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddingLesson(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                ADMINISTRADOR · {selectedCourse.badgeTitle}
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Añadir Nueva Lección al Curso
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Módulo Destino
                </label>
                <select
                  value={lessonModuleIndex}
                  onChange={(e) => setLessonModuleIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {selectedCourse.modules.map((m, idx) => (
                    <option key={m.id} value={idx}>
                      Módulo {m.moduleNumber}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Título de la Lección
                </label>
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Ej: Implementación de SQLite y Cache Local en Flutter"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    value={newLessonDuration}
                    onChange={(e) => setNewLessonDuration(e.target.value)}
                    placeholder="25:30"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Enlace de YouTube (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newLessonYoutubeUrl}
                    onChange={(e) => setNewLessonYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Resumen o Descripción de la Clase
                </label>
                <textarea
                  value={newLessonSummary}
                  onChange={(e) => setNewLessonSummary(e.target.value)}
                  rows={3}
                  placeholder="Explica brevemente los conceptos y objetivos que aprenderá el alumno..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingLesson(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Guardar Lección
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Lección y Video de la Clase (Requested by user) */}
      {editingLessonInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditLesson}
            className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingLessonInfo(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                EDITAR VIDEO Y CLASE · {selectedCourse.badgeTitle}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Editar Lección y Video de la Clase
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Actualiza el video de la clase (directo o YouTube) y los contenidos que verá el estudiante.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Título de la Clase
                </label>
                <input
                  type="text"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
                  required
                  placeholder="Ej: Análisis de Tablas Dinámicas y Fórmulas Lógicas"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Duración Estimada
                  </label>
                  <input
                    type="text"
                    value={editLessonDuration}
                    onChange={(e) => setEditLessonDuration(e.target.value)}
                    placeholder="25:00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Enlace de YouTube (Recomendado)
                  </label>
                  <input
                    type="text"
                    value={editLessonYoutubeUrl}
                    onChange={(e) => setEditLessonYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-red-300 focus:outline-none focus:border-red-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  URL del Video (MP4 directo o bucket)
                </label>
                <input
                  type="text"
                  value={editLessonVideoUrl}
                  onChange={(e) => setEditLessonVideoUrl(e.target.value)}
                  placeholder="https://.../video.mp4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Video Live Preview */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vista previa del reproductor</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTestVideoPlaying(!testVideoPlaying)}
                    className="text-[10px] text-amber-400 font-bold hover:underline"
                  >
                    {testVideoPlaying ? 'Ocultar prueba' : 'Probar reproductor'}
                  </button>
                </div>

                {testVideoPlaying && (
                  <div className="aspect-video w-full rounded-xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
                    {editLessonYoutubeUrl && (editLessonYoutubeUrl.includes('youtube.com') || editLessonYoutubeUrl.includes('youtu.be')) ? (
                      <iframe
                        src={
                          editLessonYoutubeUrl.includes('watch?v=')
                            ? editLessonYoutubeUrl.replace('watch?v=', 'embed/')
                            : editLessonYoutubeUrl.includes('youtu.be/')
                            ? editLessonYoutubeUrl.replace('youtu.be/', 'youtube.com/embed/')
                            : editLessonYoutubeUrl
                        }
                        title="Prueba de video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={editLessonVideoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Resumen de la Clase
                </label>
                <textarea
                  value={editLessonSummary}
                  onChange={(e) => setEditLessonSummary(e.target.value)}
                  rows={3}
                  placeholder="Detalla lo que el estudiante aprenderá en esta clase..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingLessonInfo(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios de Video</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Datos del Curso (Requested by user) */}
      {isEditingCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditCourse}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsEditingCourse(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                ADMINISTRACIÓN ACADÉMICA
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Editar Información del Curso
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nombre Oficial del Curso
                </label>
                <input
                  type="text"
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Categoría
                  </label>
                  <select
                    value={editCourseCategory}
                    onChange={(e) => setEditCourseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Ofimática & BI">Ofimática & BI</option>
                    <option value="Sistemas Web">Sistemas Web</option>
                    <option value="Desarrollo Móvil">Desarrollo Móvil</option>
                    <option value="Inteligencia Artificial">Inteligencia Artificial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Horas Acreditadas
                  </label>
                  <input
                    type="number"
                    value={editCourseHours}
                    onChange={(e) => setEditCourseHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nombre del Docente Especialista
                </label>
                <input
                  type="text"
                  value={editCourseInstructorName}
                  onChange={(e) => setEditCourseInstructorName(e.target.value)}
                  placeholder="Ej: Lic. Mónica Benalcázar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  value={editCourseDescription}
                  onChange={(e) => setEditCourseDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditingCourse(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
              >
                Actualizar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Emitir Nuevo Diploma Oficial (Requested by user) */}
      {isCreatingManualCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleEmitManualCertificate}
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsCreatingManualCert(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                SECRETARÍA GENERAL · REGISTRO OFICIAL
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Emitir Diploma y Certificado Legal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Genera el documento oficial con código QR y validación ante la Superintendencia.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Estudiante Beneficiario
                </label>
                <select
                  value={manualCertStudentId}
                  onChange={(e) => setManualCertStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.studentName} (C.I: {st.docNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Curso Acreditado
                </label>
                <select
                  value={manualCertCourseId}
                  onChange={(e) => setManualCertCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.totalHours} Horas)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Horas Certificadas
                  </label>
                  <input
                    type="number"
                    value={manualCertHours}
                    onChange={(e) => setManualCertHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Firma del Instructor
                  </label>
                  <input
                    type="text"
                    value={manualCertInstructor}
                    onChange={(e) => setManualCertInstructor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Mención o Especialidad
                </label>
                <input
                  type="text"
                  value={manualCertSpecialty}
                  onChange={(e) => setManualCertSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreatingManualCert(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Emitir Diploma Oficial</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Vista Previa y Descarga de Diploma Oficial (Requested by user) */}
      {previewingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-4">
            <button
              onClick={() => setPreviewingCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-500/40 p-1 flex items-center justify-center shrink-0">
                <img
                  src={OFFICIAL_SERTECEP_LOGO}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Visualizador y Emisión de Diplomas</h3>
                <p className="text-xs text-emerald-400 font-mono">Código de Validación: {previewingCertificate.code}</p>
              </div>
            </div>

            <CertificateDocument
              certificate={previewingCertificate}
              onClose={() => setPreviewingCertificate(null)}
              isModal={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
