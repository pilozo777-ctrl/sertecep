import React, { useState } from 'react';
import { 
  initialUserProfile, sampleCourses, sampleCertificates, 
  defaultAdminAccount, defaultStudentAccount, sampleStudentsList,
  SUPPORT_WHATSAPP_NUMBER, OFFICIAL_SERTECEP_LOGO
} from './data/mockData';
import { Course, UserProfile, CertificateRecord, AuthAccount, StudentEnrollment } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ClassroomView } from './components/ClassroomView';
import { CertificatesView } from './components/CertificatesView';
import { CatalogView } from './components/CatalogView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { LoginView } from './components/LoginView';
import { PublicLandingView } from './components/PublicLandingView';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { storage } from './utils/storage';
import { buildProfileFromAccountAndStudents, isStudentEnrolled } from './utils/studentProfile';
import { MapPin, Lock, X } from 'lucide-react';

export default function App() {
  // Authentication State: persistent in storage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storage.getIsAuthenticated());
  const [currentAccount, setCurrentAccount] = useState<AuthAccount>(() => storage.getAuthAccount());

  const [currentView, setCurrentView] = useState<'dashboard' | 'classroom' | 'certificates' | 'catalog' | 'profile' | 'admin'>(
    storage.getAuthAccount().role === 'admin' ? 'admin' : 'dashboard'
  );

  const [userProfile, setUserProfile] = useState<UserProfile>(() => storage.getUserProfile());
  const [courses, setCourses] = useState<Course[]>(() => storage.getCourses());
  const [students, setStudents] = useState<StudentEnrollment[]>(() => storage.getStudents());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(() => storage.getCertificates());
  const [selectedCourse, setSelectedCourse] = useState<Course>(() => {
    const savedId = storage.getSelectedCourseId();
    const allCourses = storage.getCourses();
    return allCourses.find(c => c.id === savedId) || allCourses[0];
  });
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);
  const [blockedCourse, setBlockedCourse] = useState<Course | null>(null);

  const isAdmin = currentAccount.role === 'admin';

  // Find the enrolled student record if logged in as student
  const currentStudent = students.find(
    s => s.id === currentAccount.id ||
         s.username.toLowerCase() === currentAccount.username.toLowerCase() ||
         (currentAccount.docNumber && s.docNumber === currentAccount.docNumber)
  );

  const enrolledCourseIds = isAdmin 
    ? ['ALL'] 
    : (currentStudent?.enrolledCourseIds || [currentStudent?.courseId || '']);

  // Dynamic certificate records mapped with student profile name if student is logged in
  const displayedCertificates: CertificateRecord[] = certificates
    .filter(cert => {
      if (isAdmin) return true;
      // If student has a matching document or is enrolled in all courses or this course
      if (currentStudent) {
        if (cert.studentDoc && currentStudent.docNumber && cert.studentDoc === currentStudent.docNumber) return true;
        if (currentStudent.enrolledCourseIds?.includes('ALL') || currentStudent.enrolledCourseIds?.includes(cert.courseId) || currentStudent.courseId === cert.courseId) return true;
        return false;
      }
      return true;
    })
    .map(cert => {
      if (!isAdmin) {
        return {
          ...cert,
          studentName: `${userProfile.firstName} ${userProfile.secondName ? userProfile.secondName + ' ' : ''}${userProfile.firstLastName} ${userProfile.secondLastName}`.trim(),
          studentDoc: userProfile.docNumber,
          studentPhoto: userProfile.photoUrl
        };
      }
      return cert;
    });

  const handleSelectCourse = (course: Course, lessonId?: string) => {
    const enrolled = isStudentEnrolled(currentStudent, course.id, isAdmin);
    if (!enrolled) {
      setBlockedCourse(course);
      return;
    }

    setSelectedCourse(course);
    storage.setSelectedCourseId(course.id);
    setTargetLessonId(lessonId);
    setCurrentView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCourseProgress = (courseId: string, lessonId: string, completed: boolean) => {
    setCourses(prevCourses => {
      const updatedCourses = prevCourses.map(course => {
        if (course.id !== courseId) return course;

        const updatedModules = course.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed } : lesson
          )
        }));

        const allLessons = updatedModules.flatMap(m => m.lessons);
        const completedCount = allLessons.filter(l => l.completed).length;
        const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

        return {
          ...course,
          modules: updatedModules,
          progressPercent
        };
      });

      storage.setCourses(updatedCourses);
      return updatedCourses;
    });

    setSelectedCourse(prev => {
      if (prev.id !== courseId) return prev;
      const updatedModules = prev.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed } : lesson
        )
      }));
      const allLessons = updatedModules.flatMap(m => m.lessons);
      const completedCount = allLessons.filter(l => l.completed).length;
      return {
        ...prev,
        modules: updatedModules,
        progressPercent: allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0
      };
    });
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    storage.setUserProfile(updated);
  };

  const handleLoginSuccess = (account: AuthAccount) => {
    setCurrentAccount(account);
    setIsAuthenticated(true);
    storage.setIsAuthenticated(true);
    storage.setAuthAccount(account);

    // Build specific student or admin profile
    const profile = buildProfileFromAccountAndStudents(account, students);
    setUserProfile(profile);
    storage.setUserProfile(profile);

    // Automatically routes according to role recognized by credentials
    if (account.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    storage.setIsAuthenticated(false);
  };

  const handleAddCertificate = (newCert: CertificateRecord) => {
    setCertificates(prev => {
      const updated = [newCert, ...prev];
      storage.setCertificates(updated);
      return updated;
    });
  };

  const handleUpdateCertificates = (newCerts: CertificateRecord[]) => {
    setCertificates(newCerts);
    storage.setCertificates(newCerts);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => {
      const updated = [newCourse, ...prev];
      storage.setCourses(updated);
      return updated;
    });
  };

  const handleUpdateCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    storage.setCourses(newCourses);
  };

  const handleUpdateStudents = (newStudents: StudentEnrollment[]) => {
    setStudents(newStudents);
    storage.setStudents(newStudents);
  };

  // If user is not authenticated, show the official exterior public portal (image_8559f919.png)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b11] text-slate-100 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
        <PublicLandingView
          courses={courses}
          studentsList={students}
          onLoginSuccess={handleLoginSuccess}
        />
        {/* Persistent WhatsApp Floating Widget with verified number +593989012515 */}
        <WhatsAppWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c12] text-slate-100 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Bar Navigation (Clean, without awkward badges) */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userProfile={userProfile}
        currentAccount={currentAccount}
        onLogout={handleLogout}
        onGoToPortada={() => {
          setIsAuthenticated(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            courses={courses}
            userProfile={userProfile}
            enrolledCourseIds={enrolledCourseIds}
            onSelectCourse={handleSelectCourse}
            onNavigateToCatalog={() => setCurrentView('catalog')}
            onNavigateToCertificates={() => setCurrentView('certificates')}
          />
        )}

        {currentView === 'classroom' && (
          <ClassroomView
            course={selectedCourse}
            initialLessonId={targetLessonId}
            userProfile={userProfile}
            certificate={displayedCertificates.find(c => c.courseId === selectedCourse.id) || displayedCertificates[0]}
            onBackToDashboard={() => setCurrentView(isAdmin ? 'admin' : 'dashboard')}
            onUpdateCourseProgress={handleUpdateCourseProgress}
          />
        )}

        {currentView === 'certificates' && (
          <CertificatesView
            certificates={displayedCertificates}
            userProfile={userProfile}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogView
            courses={courses}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToCertificates={() => setCurrentView('certificates')}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            courses={courses}
            students={students}
            certificates={certificates}
            onUpdateCourses={handleUpdateCourses}
            onUpdateStudents={handleUpdateStudents}
            onAddCertificate={handleAddCertificate}
            onUpdateCertificates={handleUpdateCertificates}
            onAddCourse={handleAddCourse}
          />
        )}
      </main>

      {/* Modal: Curso No Asignado a la Matrícula del Estudiante */}
      {blockedCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 text-center relative">
            <button
              onClick={() => setBlockedCourse(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                MATRÍCULA INDIVIDUAL
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Curso No Asignado a tu Cuenta
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Hola <strong className="text-emerald-400">{userProfile.firstName} {userProfile.firstLastName}</strong>, actualmente este curso (<span className="text-amber-300 font-semibold">{blockedCourse.title}</span>) no forma parte de tu plan de matrícula asignado.
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Para solicitar la activación de esta especialidad o adquirir el paquete completo con acceso total, comunícate con Coordinación Académica Sertecep por WhatsApp.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://wa.me/593989012515?text=${encodeURIComponent(`Hola Academia Sertecep, soy el estudiante ${userProfile.firstName} ${userProfile.firstLastName} (Cédula: ${userProfile.docNumber}) y deseo solicitar la activación en el curso: ${blockedCourse.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Activar Curso vía WhatsApp (+593 98 901 2515)</span>
              </a>
              <button
                onClick={() => setBlockedCourse(null)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Volver a mis cursos habilitados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with round logo and institution details */}
      {/* Footer with round logo and institution details - 100% responsive */}
      <footer className="border-t border-slate-800/80 bg-slate-950/95 py-6 sm:py-8 px-4 sm:px-8 mt-16 text-slate-400 text-xs w-full max-w-full overflow-hidden pb-28 sm:pb-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-emerald-500/30 p-0.5 shrink-0 shadow">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep Amazónico"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-1 sm:gap-2 text-[11px] sm:text-xs">
              <span className="font-bold text-white">Academia Sertecep Amazónico S.A.S.</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span>RUC: 2191754820001</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="text-slate-400">Shushufindi, Sucumbíos - Ecuador</span>
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="font-mono text-emerald-400">WhatsApp Oficial: {SUPPORT_WHATSAPP_NUMBER}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-slate-400 text-[11px] sm:text-xs pt-2 md:pt-0 border-t border-slate-800/60 md:border-t-0">
            <span>© 2026 Aula Virtual Sertecep</span>
            <span className="text-slate-700">·</span>
            <span>Tecnología, educación y oportunidad</span>
          </div>
        </div>
      </footer>

      {/* Persistent WhatsApp Floating Widget with verified number +593989012515 */}
      <WhatsAppWidget />
    </div>
  );
}
