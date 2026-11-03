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
import { MapPin } from 'lucide-react';

export default function App() {
  // Authentication State: opens directly on the public exterior portal
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<AuthAccount>(defaultStudentAccount);

  const [currentView, setCurrentView] = useState<'dashboard' | 'classroom' | 'certificates' | 'catalog' | 'profile' | 'admin'>('dashboard');

  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [students, setStudents] = useState<StudentEnrollment[]>(sampleStudentsList);
  const [certificates, setCertificates] = useState<CertificateRecord[]>(sampleCertificates);
  const [selectedCourse, setSelectedCourse] = useState<Course>(sampleCourses[0]);
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);

  const isAdmin = currentAccount.role === 'admin';

  // Dynamic certificate records mapped with student profile name if student is logged in
  const displayedCertificates: CertificateRecord[] = certificates.map(cert => {
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
    setSelectedCourse(course);
    setTargetLessonId(lessonId);
    setCurrentView('classroom');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCourseProgress = (courseId: string, lessonId: string, completed: boolean) => {
    setCourses(prevCourses =>
      prevCourses.map(course => {
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
      })
    );

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
  };

  const handleLoginSuccess = (account: AuthAccount) => {
    setCurrentAccount(account);
    setIsAuthenticated(true);
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
  };

  const handleAddCertificate = (newCert: CertificateRecord) => {
    setCertificates(prev => [newCert, ...prev]);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
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
            onUpdateCourses={setCourses}
            onUpdateStudents={setStudents}
            onAddCertificate={handleAddCertificate}
            onUpdateCertificates={setCertificates}
            onAddCourse={handleAddCourse}
          />
        )}
      </main>

      {/* Footer with round logo and institution details */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 px-4 sm:px-8 mt-16 text-slate-500 text-xs">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900 border border-emerald-500/30 p-0.5 shrink-0">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep Amazónico"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-300">Academia Sertecep Amazónico S.A.S.</span>
              <span className="mx-2">·</span>
              <span>RUC: 2191754820001</span>
              <span className="mx-2">·</span>
              <span className="text-slate-400">Shushufindi, Sucumbíos - Ecuador</span>
              <span className="mx-2">·</span>
              <span className="font-mono text-emerald-400">WhatsApp Oficial: {SUPPORT_WHATSAPP_NUMBER}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 Aula Virtual Sertecep</span>
            <span>·</span>
            <span>Tecnología, educación y oportunidad</span>
          </div>
        </div>
      </footer>

      {/* Persistent WhatsApp Floating Widget with verified number +593989012515 */}
      <WhatsAppWidget />
    </div>
  );
}
