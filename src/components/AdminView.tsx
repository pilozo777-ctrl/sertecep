import React, { useState } from 'react';
import { Course, CourseModule, Lesson, StudentEnrollment, CertificateRecord } from '../types';
import { 
  OFFICIAL_SERTECEP_LOGO, 
  OFFICIAL_SERTECEP_PORTADA, 
  SUPPORT_WHATSAPP_NUMBER,
  OFFICIAL_CERTIFICATE_SCAN,
  OFFICIAL_ZEYO_BLOCKCHAIN_URL,
  OFFICIAL_BLOCKCHAIN_TX,
  OFFICIAL_BLOCKCHAIN_PUBKEY,
  OFFICIAL_RUC,
  OFFICIAL_EXPEDIENTE,
  OFFICIAL_SIGNER_NAME
} from '../data/mockData';
import { 
  ShieldCheck, BookOpen, Users, Award, Settings, Plus, 
  Trash2, Edit3, CheckCircle2, Search, ArrowRight, Video, 
  Download, FileText, Phone, Mail, Check, X, Key, Copy, UserPlus, Layers, Eye, Play,
  Link2, Upload, FileUp, Sparkles, Image as ImageIcon, FolderPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CertificateDocument } from './CertificateDocument';
import { parseVideoSource, extractYouTubeId } from './VideoPlayer';
import { isPdfDocument } from '../utils/documentUtils';
import { storage } from '../utils/storage';

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
  const [newCourseCategory, setNewCourseCategory] = useState<string>('Inteligencia Artificial');
  const [newCourseHours, setNewCourseHours] = useState(120);
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseCoverImage, setNewCourseCoverImage] = useState<string>('/assets/courses/desarrollo_web.jpg');

  // States for Editing existing Course
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseBadge, setEditCourseBadge] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState<string>('Inteligencia Artificial');
  const [editCourseHours, setEditCourseHours] = useState(120);
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editCourseTagline, setEditCourseTagline] = useState('');
  const [editCourseInstructorName, setEditCourseInstructorName] = useState('');
  const [editCourseCoverImage, setEditCourseCoverImage] = useState<string>('');

  // States for Adding and Editing Course Modules (Módulo 1, Módulo 2, etc.)
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDescription, setNewModuleDescription] = useState('');
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState('');
  const [editModuleDescription, setEditModuleDescription] = useState('');

  // Certificate Modals & Management (Linking and Uploading)
  const [previewingCertificate, setPreviewingCertificate] = useState<CertificateRecord | null>(null);
  const [isCreatingManualCert, setIsCreatingManualCert] = useState(false);
  const [manualCertStudentId, setManualCertStudentId] = useState(students[0]?.id || '');
  const [manualCertCourseId, setManualCertCourseId] = useState(courses[0]?.id || '');
  const [manualCertHours, setManualCertHours] = useState(120);
  const [manualCertSpecialty, setManualCertSpecialty] = useState('Capacitación Profesional y Tecnológica Acreditada');
  const [manualCertInstructor, setManualCertInstructor] = useState('Ing. Arturo de la Cruz');
  const [manualCertSigner, setManualCertSigner] = useState(OFFICIAL_SIGNER_NAME);
  const [manualCertBlockchainUrl, setManualCertBlockchainUrl] = useState(OFFICIAL_ZEYO_BLOCKCHAIN_URL);
  const [manualCertTxHash, setManualCertTxHash] = useState(OFFICIAL_BLOCKCHAIN_TX);
  const [manualCertDigitalFile, setManualCertDigitalFile] = useState(OFFICIAL_CERTIFICATE_SCAN);
  const [manualCertFileName, setManualCertFileName] = useState('Certificado_Oficial_Sertecep_Scan.png');
  const [manualCertActiveTab, setManualCertActiveTab] = useState<'link' | 'upload'>('link');

  // Form for creating a new student profile and credentials
  const [studentFullName, setStudentFullName] = useState('');
  const [studentDocNumber, setStudentDocNumber] = useState('');
  const [studentPhone, setStudentPhone] = useState('+593');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentPassword, setStudentPassword] = useState('Sertecep2026*');
  const [studentCourseId, setStudentCourseId] = useState(courses[0]?.id || '');
  const [studentEnrollmentMode, setStudentEnrollmentMode] = useState<'single' | 'all' | 'custom'>('single');
  const [studentSelectedCourseIds, setStudentSelectedCourseIds] = useState<string[]>([courses[0]?.id || '']);
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    name: string;
    username: string;
    password: string;
    phone: string;
    coursesSummary: string;
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

    let finalCourseId = studentCourseId;
    let finalCourseTitle = courses.find(c => c.id === studentCourseId)?.title || 'Curso Sertecep';
    let finalEnrolledIds: string[] = [studentCourseId];

    if (studentEnrollmentMode === 'all') {
      finalEnrolledIds = ['ALL'];
      finalCourseTitle = `Acceso Total a Todos los Cursos (${courses.length} Cursos)`;
    } else if (studentEnrollmentMode === 'custom') {
      finalEnrolledIds = studentSelectedCourseIds.length > 0 ? studentSelectedCourseIds : [studentCourseId];
      finalCourseId = finalEnrolledIds[0];
      const selectedNames = courses.filter(c => finalEnrolledIds.includes(c.id)).map(c => c.badgeTitle || c.title);
      finalCourseTitle = `${selectedNames.length} Cursos (${selectedNames.slice(0, 2).join(', ')}${selectedNames.length > 2 ? '...' : ''})`;
    }

    const matchedCourse = courses.find(c => c.id === finalCourseId) || courses[0];

    const newStudent: StudentEnrollment = {
      id: `st-${Date.now()}`,
      username: studentUsername.trim().toLowerCase(),
      password: studentPassword.trim(),
      studentName: studentFullName.trim().toUpperCase(),
      email: studentEmail.trim() || `${studentUsername.trim().toLowerCase()}@sertecep.edu.ec`,
      docNumber: studentDocNumber.trim(),
      phone: studentPhone.trim(),
      courseId: finalCourseId,
      courseTitle: finalCourseTitle,
      enrolledCourseIds: finalEnrolledIds,
      progressPercent: 0,
      completedLessons: 0,
      totalLessons: matchedCourse.totalLessons,
      certificateApproved: false,
      registrationDate: new Date().toLocaleDateString('es-EC'),
    };

    onUpdateStudents([newStudent, ...students]);
    storage.setStudents([newStudent, ...students]);
    setLastCreatedCredentials({
      name: newStudent.studentName,
      username: newStudent.username,
      password: newStudent.password || '123',
      phone: newStudent.phone,
      coursesSummary: finalCourseTitle,
    });

    confetti({ particleCount: 50, spread: 70 });
    triggerToast(`¡Perfil creado! La estudiante ${newStudent.studentName} ya puede ingresar con su usuario.`);

    // Reset inputs
    setStudentFullName('');
    setStudentDocNumber('');
    setStudentUsername('');
    setStudentEmail('');
  };

  const handleCopyCredentials = () => {
    if (!lastCreatedCredentials) return;
    const msg = `🎓 *Academia Sertecep Amazónico* (Shushufindi, Ecuador)\n¡Hola ${lastCreatedCredentials.name}! Tu acceso al Aula Virtual ha sido habilitado:\n\n🌐 *Portal:* https://sertecep-amazonico.edu.ec\n👤 *Usuario:* ${lastCreatedCredentials.username}\n🔑 *Contraseña:* ${lastCreatedCredentials.password}\n📚 *Matrícula:* ${lastCreatedCredentials.coursesSummary}\n\n¡Bienvenido y mucho éxito en tus estudios!`;
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
      category: newCourseCategory.trim() || 'Inteligencia Artificial',
      level: 'Principiante a Avanzado',
      coverImage: newCourseCoverImage.trim() || '/assets/courses/desarrollo_web.jpg',
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

    const nextCourses = [newCourseObj, ...courses];
    onAddCourse(newCourseObj);
    storage.setCourses(nextCourses);
    setIsAddingCourse(false);
    setNewCourseTitle('');
    setNewCourseBadge('');
    setNewCourseDescription('');
    setNewCourseCoverImage('/assets/courses/desarrollo_web.jpg');
    confetti({ particleCount: 40, spread: 60 });
    triggerToast('¡Nuevo curso creado y guardado permanentemente!');
  };

  // Module Management Handlers
  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModuleNumber = selectedCourse.modules.length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}-${newModuleNumber}`,
      moduleNumber: newModuleNumber,
      title: newModuleTitle.trim(),
      description: newModuleDescription.trim() || `Contenido temático del Módulo ${newModuleNumber}`,
      lessons: []
    };

    const updatedCourses = courses.map(c => {
      if (c.id !== selectedCourse.id) return c;
      const updatedModules = [...c.modules, newMod];
      return {
        ...c,
        totalModules: updatedModules.length,
        modules: updatedModules
      };
    });

    onUpdateCourses(updatedCourses);
    storage.setCourses(updatedCourses);
    setIsAddingModule(false);
    setNewModuleTitle('');
    setNewModuleDescription('');
    confetti({ particleCount: 35, spread: 60 });
    triggerToast(`¡Módulo "${newMod.title}" creado exitosamente!`);
  };

  const handleStartEditModule = (mod: CourseModule) => {
    setEditingModule(mod);
    setEditModuleTitle(mod.title);
    setEditModuleDescription(mod.description || '');
  };

  const handleSaveEditModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editModuleTitle.trim()) return;

    const updatedCourses = courses.map(c => {
      if (c.id !== selectedCourse.id) return c;
      return {
        ...c,
        modules: c.modules.map(m => m.id === editingModule.id ? {
          ...m,
          title: editModuleTitle.trim(),
          description: editModuleDescription.trim()
        } : m)
      };
    });

    onUpdateCourses(updatedCourses);
    storage.setCourses(updatedCourses);
    setEditingModule(null);
    triggerToast('Módulo actualizado exitosamente.');
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este módulo y todas sus lecciones?')) return;

    const updatedCourses = courses.map(c => {
      if (c.id !== selectedCourse.id) return c;
      const filtered = c.modules
        .filter(m => m.id !== moduleId)
        .map((m, idx) => ({ ...m, moduleNumber: idx + 1 }));
      const allLessons = filtered.flatMap(m => m.lessons);
      return {
        ...c,
        totalModules: filtered.length,
        totalLessons: allLessons.length,
        modules: filtered
      };
    });

    onUpdateCourses(updatedCourses);
    storage.setCourses(updatedCourses);
    triggerToast('Módulo eliminado del curso.');
  };

  const handleAddLessonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;

    // Detect YouTube URL in either field
    const candidateUrl = newLessonVideoUrl.trim() || newLessonYoutubeUrl.trim();
    const ytId = extractYouTubeId(candidateUrl) || extractYouTubeId(newLessonYoutubeUrl.trim()) || extractYouTubeId(newLessonVideoUrl.trim());
    let finalVideoUrl = newLessonVideoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    let finalYoutubeUrl = newLessonYoutubeUrl.trim();

    if (ytId) {
      finalYoutubeUrl = `https://www.youtube.com/watch?v=${ytId}`;
      finalVideoUrl = `https://www.youtube.com/watch?v=${ytId}`;
    }

    const newLesson: Lesson = {
      id: `les-custom-${Date.now()}`,
      moduleOrder: lessonModuleIndex + 1,
      lessonNumber: selectedCourse.modules.flatMap(m => m.lessons).length + 1,
      title: newLessonTitle.trim(),
      duration: newLessonDuration.trim() || '15:00',
      durationSeconds: 900,
      videoUrl: finalVideoUrl,
      youtubeUrl: finalYoutubeUrl,
      summary: newLessonSummary.trim() || 'Contenido técnico administrado por Academia Sertecep Amazónico.',
      keyPoints: ['Configuración y arquitectura inicial', 'Buenas prácticas en desarrollo móvil y web'],
      completed: false,
      resources: [],
      quiz: []
    };

    const updatedCourses = courses.map(course => {
      if (course.id !== selectedCourse.id) return course;
      const updatedModules = [...course.modules];
      const targetModIdx = lessonModuleIndex < updatedModules.length ? lessonModuleIndex : 0;
      if (updatedModules[targetModIdx]) {
        updatedModules[targetModIdx] = {
          ...updatedModules[targetModIdx],
          lessons: [...updatedModules[targetModIdx].lessons, newLesson]
        };
      }
      return {
        ...course,
        totalLessons: course.totalLessons + 1,
        modules: updatedModules
      };
    });

    onUpdateCourses(updatedCourses);
    storage.setCourses(updatedCourses);
    setIsAddingLesson(false);
    setNewLessonTitle('');
    setNewLessonSummary('');
    setNewLessonVideoUrl('');
    setNewLessonYoutubeUrl('');
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
    storage.setCourses(updatedCourses);
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

    // Detect YouTube URL in either field
    const candidateUrl = editLessonVideoUrl.trim() || editLessonYoutubeUrl.trim();
    const ytId = extractYouTubeId(candidateUrl) || extractYouTubeId(editLessonYoutubeUrl.trim()) || extractYouTubeId(editLessonVideoUrl.trim());

    let finalVideoUrl = editLessonVideoUrl.trim() || lesson.videoUrl;
    let finalYoutubeUrl = editLessonYoutubeUrl.trim() || lesson.youtubeUrl;

    if (ytId) {
      finalYoutubeUrl = `https://www.youtube.com/watch?v=${ytId}`;
      finalVideoUrl = `https://www.youtube.com/watch?v=${ytId}`;
    }

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
              videoUrl: finalVideoUrl,
              youtubeUrl: finalYoutubeUrl,
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
    storage.setCourses(updatedCourses);
    setEditingLessonInfo(null);
    confetti({ particleCount: 40, spread: 60 });
    triggerToast('¡Video y contenido de la clase guardados permanentemente!');
  };

  // Handler for editing course details
  const handleStartEditCourse = () => {
    setEditCourseTitle(selectedCourse.title);
    setEditCourseBadge(selectedCourse.badgeTitle);
    setEditCourseCategory(selectedCourse.category);
    setEditCourseHours(selectedCourse.totalHours);
    setEditCourseDescription(selectedCourse.description);
    setEditCourseTagline(selectedCourse.tagline);
    setEditCourseInstructorName(selectedCourse.instructor.name);
    setEditCourseCoverImage(selectedCourse.coverImage || '/assets/courses/desarrollo_web.jpg');
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
        category: editCourseCategory.trim() || course.category,
        totalHours: Number(editCourseHours) || course.totalHours,
        description: editCourseDescription.trim(),
        tagline: editCourseTagline.trim() || editCourseDescription.trim().substring(0, 90),
        coverImage: editCourseCoverImage.trim() || course.coverImage,
        instructor: {
          ...course.instructor,
          name: editCourseInstructorName.trim() || course.instructor.name
        }
      };
    });

    onUpdateCourses(updatedCourses);
    storage.setCourses(updatedCourses);
    setIsEditingCourse(false);
    confetti({ particleCount: 45, spread: 65 });
    triggerToast('¡Información y portada del curso guardadas permanentemente!');
  };

  const handleCourseImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEdit) {
          setEditCourseCoverImage(reader.result);
        } else {
          setNewCourseCoverImage(reader.result);
        }
        triggerToast('¡Foto del curso cargada con éxito!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = isPdfDocument(undefined, undefined, file.name) || file.type === 'application/pdf';
    setManualCertFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setManualCertDigitalFile(reader.result);
        triggerToast(`Archivo digital ${isPdf ? 'PDF' : 'de imagen'} "${file.name}" cargado y reconocido exitosamente.`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handler for manual certificate issuance (Supporting Linking and File Upload)
  const handleEmitManualCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === manualCertStudentId) || students[0];
    const course = courses.find(c => c.id === manualCertCourseId) || courses[0];
    if (!student || !course) return;

    const newCertCode = `ECN-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const isPdf = isPdfDocument(manualCertDigitalFile, undefined, manualCertFileName);

    const newRecord: CertificateRecord = {
      id: `cert-manual-${Date.now()}`,
      code: newCertCode,
      courseId: course.id,
      courseTitle: course.title,
      specialty: manualCertSpecialty.trim() || 'Capacitación Profesional y Tecnológica Acreditada',
      academicHours: Number(manualCertHours) || 120,
      issueDate: new Date().toLocaleDateString('es-EC'),
      startDate: student.registrationDate || '2026-04-01',
      endDate: 'Aprobado y Convalidado',
      studentName: student.studentName,
      studentDoc: student.docNumber,
      studentPhoto: '/assets/aistudio/image_f29cb282.png',
      institution: 'Academia de Enseñanza Técnica y Profesional SERTECEP Amazónico',
      institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
      verificationUrl: manualCertBlockchainUrl.trim() || `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
      qrPayload: manualCertBlockchainUrl.trim() || `https://sertecep-amazonico.edu.ec/verificar/${newCertCode}`,
      instructorName: manualCertInstructor.trim() || 'Ing. Arturo de la Cruz',
      instructorTitle: 'Docente Especialista',
      directorName: manualCertSigner.trim() || OFFICIAL_SIGNER_NAME,
      directorTitle: `Dirección Académica Regional · RUC ${OFFICIAL_RUC}`,
      blockchainUrl: manualCertBlockchainUrl.trim() || OFFICIAL_ZEYO_BLOCKCHAIN_URL,
      blockchainNetwork: 'Polygon (POS Blockchain)',
      blockchainTxHash: manualCertTxHash.trim() || OFFICIAL_BLOCKCHAIN_TX,
      blockchainIssuerKey: OFFICIAL_BLOCKCHAIN_PUBKEY,
      digitalFileUrl: manualCertDigitalFile || OFFICIAL_CERTIFICATE_SCAN,
      digitalFileType: isPdf ? 'pdf' : 'image',
      digitalFileName: manualCertFileName,
      officialRuc: OFFICIAL_RUC,
      expedienteNum: OFFICIAL_EXPEDIENTE,
      signerName: manualCertSigner.trim() || OFFICIAL_SIGNER_NAME,
    };

    onAddCertificate(newRecord);

    // Also update student status to approved certificate
    const updatedStudents = students.map(s => s.id === student.id ? { ...s, certificateApproved: true } : s);
    onUpdateStudents(updatedStudents);

    setIsCreatingManualCert(false);
    confetti({ particleCount: 65, spread: 75 });
    triggerToast(`¡Diploma y certificación oficial emitida con código ${newCertCode}!`);
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
    storage.setStudents(updated);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar a este estudiante del aula virtual?')) return;
    const updated = students.filter(s => s.id !== studentId);
    onUpdateStudents(updated);
    storage.setStudents(updated);
    triggerToast('Estudiante eliminado.');
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

              {/* Asignación y Matrícula de Cursos */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase font-mono">
                    Plan de Matrícula y Acceso a Cursos:
                  </label>
                  <span className="text-[10px] text-emerald-400 font-mono">Control de permisos</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentEnrollmentMode('single')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      studentEnrollmentMode === 'single'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    1 Curso Específico
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentEnrollmentMode('all')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      studentEnrollmentMode === 'all'
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    ⭐ Todos los Cursos
                  </button>

                  <button
                    type="button"
                    onClick={() => setStudentEnrollmentMode('custom')}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      studentEnrollmentMode === 'custom'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Varios Cursos
                  </button>
                </div>

                {studentEnrollmentMode === 'single' && (
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                      Seleccionar curso asignado:
                    </label>
                    <select
                      value={studentCourseId}
                      onChange={(e) => setStudentCourseId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} ({c.totalHours} horas)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {studentEnrollmentMode === 'all' && (
                  <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Acceso Total Habilitado:</strong> El alumno tendrá acceso a los {courses.length} cursos activos de la Academia.
                    </span>
                  </div>
                )}

                {studentEnrollmentMode === 'custom' && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                      Marca los cursos permitidos para este alumno:
                    </label>
                    {courses.map(c => {
                      const isChecked = studentSelectedCourseIds.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition text-xs ${
                            isChecked
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-medium'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setStudentSelectedCourseIds([...studentSelectedCourseIds, c.id]);
                              } else {
                                setStudentSelectedCourseIds(studentSelectedCourseIds.filter(id => id !== c.id));
                              }
                            }}
                            className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="truncate">{c.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-auto">{c.totalHours}h</span>
                        </label>
                      );
                    })}
                  </div>
                )}
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleStartEditCourse}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 border border-slate-700"
                title="Editar título, descripción, horas, categoría o instructor de este curso"
              >
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Editar Curso</span>
              </button>
              <button
                onClick={() => setIsAddingModule(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                title="Crear un nuevo módulo (Módulo 1, Módulo 2, etc.)"
              >
                <FolderPlus className="w-4 h-4" />
                <span>+ Añadir Módulo</span>
              </button>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Colocar Nuevo Curso</span>
              </button>
              <button
                onClick={() => {
                  setLessonModuleIndex(0);
                  setIsAddingLesson(true);
                }}
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

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">MÓDULOS ACTIVOS</span>
                  <span className="text-xl font-black text-indigo-400">
                    {selectedCourse.modules.length}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">TOTAL LECCIONES</span>
                  <span className="text-xl font-black text-white">
                    {selectedCourse.modules.flatMap(m => m.lessons).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Modules and Lessons List */}
            <div className="space-y-6">
              {selectedCourse.modules.map((mod, modIdx) => (
                <div key={mod.id} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                        MÓDULO {mod.moduleNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                        {mod.description && (
                          <p className="text-[11px] text-slate-400">{mod.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setLessonModuleIndex(modIdx);
                          setIsAddingLesson(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                        title="Añadir lección directamente a este módulo"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir Lección a este Módulo</span>
                      </button>

                      <button
                        onClick={() => handleStartEditModule(mod)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                        title="Editar nombre y descripción de este módulo"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {selectedCourse.modules.length > 1 && (
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Eliminar este módulo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {mod.lessons.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-900/30 border border-dashed border-slate-800 text-center text-xs text-slate-400">
                      <p>Este módulo aún no tiene lecciones asignadas.</p>
                      <button
                        onClick={() => {
                          setLessonModuleIndex(modIdx);
                          setIsAddingLesson(true);
                        }}
                        className="mt-2 text-emerald-400 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir la primera clase a {mod.title}</span>
                      </button>
                    </div>
                  ) : (
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
                  )}
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
                      <div className="flex items-center justify-end gap-1.5">
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
                        <button
                          onClick={() => handleDeleteStudent(st.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          title="Eliminar este estudiante"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
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
              <p className="text-slate-400 text-xs mt-0.5">
                Configura el nombre, categoría libre, horas y sube la foto de portada real.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nombre Oficial del Curso *
                </label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="Ej: Automatización con Python & Agentes de IA"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Categoría libremente editable con chips de sugerencia */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase">
                    Categoría del Curso (Editable)
                  </label>
                  <span className="text-[10px] text-amber-400">Puedes escribir la tuya o elegir</span>
                </div>
                <input
                  type="text"
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  placeholder="Ej: Inteligencia Artificial, Robótica, Marketing Digital..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Inteligencia Artificial', 'Desarrollo Móvil', 'Sistemas Web', 'Ofimática & BI', 'Marketing Digital', 'Robótica & IoT', 'Diseño Gráfico'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCourseCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                        newCourseCategory === cat
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Horas Acreditadas
                  </label>
                  <input
                    type="number"
                    value={newCourseHours}
                    onChange={(e) => setNewCourseHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Insignia Corta (Badge)
                  </label>
                  <input
                    type="text"
                    value={newCourseBadge}
                    onChange={(e) => setNewCourseBadge(e.target.value)}
                    placeholder="Ej: PYTHON IA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Foto de Portada del Curso: Subida desde el dispositivo o URL */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto de Portada del Curso (Personalizable)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Subir foto o link</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0 flex items-center justify-center">
                    {newCourseCoverImage ? (
                      <img
                        src={newCourseCoverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/courses/desarrollo_web.jpg';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir foto desde este dispositivo / celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCourseImageUpload(e, false)}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Sube cualquier archivo JPG o PNG de tus cursos.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    O escribe la URL / enlace directo de la imagen:
                  </label>
                  <input
                    type="text"
                    value={newCourseCoverImage}
                    onChange={(e) => setNewCourseCoverImage(e.target.value)}
                    placeholder="https://... o /assets/courses/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
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
                  placeholder="Detalla las competencias prácticas que adquirirá el estudiante..."
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
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Curso</span>
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
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reproducción directa en plataforma</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTestVideoPlaying(!testVideoPlaying)}
                    className="text-[10px] text-amber-400 font-bold hover:underline"
                  >
                    {testVideoPlaying ? 'Ocultar prueba' : 'Probar reproductor integrado'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  ✓ El estudiante verá y reproducirá el video directamente dentro del Aula Virtual sin ser redirigido a YouTube.
                </p>

                {testVideoPlaying && (() => {
                  const testParsed = parseVideoSource(editLessonVideoUrl, editLessonYoutubeUrl);
                  return (
                    <div className="aspect-video w-full rounded-xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center">
                      {testParsed.type === 'youtube' || testParsed.type === 'vimeo' || testParsed.type === 'embed' ? (
                        <iframe
                          src={testParsed.src}
                          title="Prueba de video dentro del aula"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={testParsed.src}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  );
                })()}
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
              <p className="text-slate-400 text-xs mt-0.5">
                Modifica el nombre, categoría, horas y sube la foto real del curso sin perder datos.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Nombre Oficial del Curso *
                </label>
                <input
                  type="text"
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Categoría editable con chips de sugerencia */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase">
                    Categoría (Completamente Editable)
                  </label>
                  <span className="text-[10px] text-amber-400">Escribe libremente o selecciona</span>
                </div>
                <input
                  type="text"
                  value={editCourseCategory}
                  onChange={(e) => setEditCourseCategory(e.target.value)}
                  placeholder="Ej: Inteligencia Artificial, Robótica, Marketing Digital..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Inteligencia Artificial', 'Desarrollo Móvil', 'Sistemas Web', 'Ofimática & BI', 'Marketing Digital', 'Robótica & IoT', 'Diseño Gráfico'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setEditCourseCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                        editCourseCategory === cat
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Insignia Corta (Badge)
                  </label>
                  <input
                    type="text"
                    value={editCourseBadge}
                    onChange={(e) => setEditCourseBadge(e.target.value)}
                    placeholder="Ej: OFIMÁTICA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Foto de Portada del Curso: Subir foto propia del celular/PC */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Foto de Portada del Curso (Editable)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Sube tu propia foto</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0 flex items-center justify-center">
                    {editCourseCoverImage ? (
                      <img
                        src={editCourseCoverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/courses/desarrollo_web.jpg';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir foto desde este dispositivo / celular</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleCourseImageUpload(e, true)}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Sube una foto real sin depender de imágenes de IA.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">
                    O escribe la URL / enlace directo de la imagen:
                  </label>
                  <input
                    type="text"
                    value={editCourseCoverImage}
                    onChange={(e) => setEditCourseCoverImage(e.target.value)}
                    placeholder="https://... o /assets/courses/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
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

      {/* Modal: Crear Nuevo Módulo Temático (Módulo 1, Módulo 2, etc.) */}
      {isAddingModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddModule}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setIsAddingModule(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                ESTRUCTURA DE MÓDULOS
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Crear Nuevo Módulo en el Curso
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Curso: <span className="text-amber-300 font-semibold">{selectedCourse.title}</span>
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Título del Módulo *
                </label>
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder={`Ej: Módulo ${selectedCourse.modules.length + 1}: Automatización de Procesos`}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Descripción o Temas Clave del Módulo
                </label>
                <textarea
                  value={newModuleDescription}
                  onChange={(e) => setNewModuleDescription(e.target.value)}
                  rows={3}
                  placeholder="Explica qué aprenderán en este módulo temático..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-400 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingModule(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Crear Módulo</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Editar Módulo Temático */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditModule}
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setEditingModule(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                EDITAR ESTRUCTURA
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Modificar Nombre del Módulo
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Título del Módulo *
                </label>
                <input
                  type="text"
                  value={editModuleTitle}
                  onChange={(e) => setEditModuleTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Descripción del Módulo
                </label>
                <textarea
                  value={editModuleDescription}
                  onChange={(e) => setEditModuleDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
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

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Firmante Oficial & Representante Legal
                </label>
                <input
                  type="text"
                  value={manualCertSigner}
                  onChange={(e) => setManualCertSigner(e.target.value)}
                  placeholder="Mgtr. Edinson Pilozo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              {/* DUAL METHOD: ENLAZAR POR BLOCKCHAIN O SUBIR DIGITALMENTE (FOTO / PDF) */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    ¿CÓMO DESEAS ASIGNAR EL CERTIFICADO?
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {manualCertActiveTab === 'link' ? 'Modo Enlace' : 'Modo Archivo'}
                  </span>
                </div>

                {/* Tab switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setManualCertActiveTab('link')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      manualCertActiveTab === 'link'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Enlazar Blockchain (Zeyo ID)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setManualCertActiveTab('upload')}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      manualCertActiveTab === 'upload'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Subir Foto o PDF</span>
                  </button>
                </div>

                {/* OPTION 1: LINK BLOCKCHAIN */}
                {manualCertActiveTab === 'link' && (
                  <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          URL de Verificación Blockchain (Zeyo ID / Polygon)
                        </label>
                        <button
                          type="button"
                          onClick={() => setManualCertBlockchainUrl(OFFICIAL_ZEYO_BLOCKCHAIN_URL)}
                          className="text-[10px] text-emerald-400 hover:underline"
                        >
                          Cargar enlace oficial de prueba
                        </button>
                      </div>
                      <input
                        type="url"
                        value={manualCertBlockchainUrl}
                        onChange={(e) => setManualCertBlockchainUrl(e.target.value)}
                        placeholder="https://id.zeyo.io/certificates/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                        Hash de Transacción Blockchain (Polygon)
                      </label>
                      <input
                        type="text"
                        value={manualCertTxHash}
                        onChange={(e) => setManualCertTxHash(e.target.value)}
                        placeholder="0x7aa..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* OPTION 2: UPLOAD DIGITAL CERTIFICATE (PHOTO OR PDF) */}
                {manualCertActiveTab === 'upload' && (
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                        Seleccionar Archivo Digital (.png, .jpg, .jpeg, .pdf)
                      </label>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.webp"
                        onChange={handleFileUpload}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400 truncate max-w-xs font-mono">
                        Archivo activo: <strong className="text-white">{manualCertFileName}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setManualCertDigitalFile(OFFICIAL_CERTIFICATE_SCAN);
                          setManualCertFileName('Certificado_Oficial_Sertecep_Scan.png');
                          triggerToast('Cargado certificado oficial escaneado.');
                        }}
                        className="text-[11px] text-amber-400 hover:underline font-medium"
                      >
                        Usar certificado escaneado de muestra
                      </button>
                    </div>

                    {manualCertDigitalFile && (
                      isPdfDocument(manualCertDigitalFile, undefined, manualCertFileName) ? (
                        <div className="relative w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-red-500/30 text-red-300 font-mono font-bold text-[9px]">
                                  DOCUMENTO PDF
                                </span>
                                <span className="text-white text-xs font-bold truncate max-w-[200px]">
                                  {manualCertFileName}
                                </span>
                              </div>
                              <p className="text-[10px] text-emerald-400 font-medium mt-0.5">
                                Documento PDF reconocido y listo para emitir con visor integrado
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                            Reconocido
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-24 rounded-lg bg-black border border-slate-800 overflow-hidden flex items-center justify-center">
                          <img
                            src={manualCertDigitalFile}
                            alt="Previsualización"
                            className="h-full object-contain"
                          />
                          <span className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-emerald-400 font-mono">
                            Vista previa lista
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
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
