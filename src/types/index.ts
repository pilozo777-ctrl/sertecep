export type UserRole = 'admin' | 'student';

export interface AuthAccount {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  fullName: string;
  avatarUrl: string;
  title?: string;
  docNumber?: string;
  phone?: string;
}

export interface UserProfile {
  id: string;
  role: UserRole;
  username: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
  phone: string;
  country: string;
  docType: 'Cédula' | 'Pasaporte' | 'DNI';
  docNumber: string;
  photoUrl: string;
  city: string;
  province: string;
  academicLevel: string;
  streakDays: number;
}

export interface StudentEnrollment {
  id: string;
  username: string;
  password?: string;
  studentName: string;
  email: string;
  docNumber: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  certificateApproved: boolean;
  registrationDate: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'code' | 'doc';
  size: string;
  downloadUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonNote {
  id: string;
  lessonId: string;
  timestamp: number;
  formattedTime: string;
  text: string;
  createdAt: string;
}

export interface LessonComment {
  id: string;
  lessonId: string;
  authorName: string;
  authorAvatar: string;
  isInstructor: boolean;
  timeAgo: string;
  text: string;
  likes: number;
}

export interface Lesson {
  id: string;
  moduleOrder: number;
  lessonNumber: number;
  title: string;
  duration: string;
  durationSeconds: number;
  videoUrl: string;
  youtubeUrl?: string;
  summary: string;
  keyPoints: string[];
  completed: boolean;
  codeSnippet?: {
    language: string;
    code: string;
  };
  promptSnippet?: string;
  resources: LessonResource[];
  quiz: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  badgeTitle: string;
  tagline: string;
  description: string;
  category: 'Desarrollo Móvil' | 'Sistemas Web' | 'Ofimática & BI' | 'Inteligencia Artificial';
  level: 'Principiante a Avanzado' | 'Intermedio' | 'Avanzado';
  coverImage: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  totalHours: number;
  totalModules: number;
  totalLessons: number;
  progressPercent: number;
  startDate: string;
  endDate: string;
  hasCertificate: boolean;
  certificateCode?: string;
  modules: CourseModule[];
}

export interface CertificateRecord {
  id: string;
  code: string;
  courseId: string;
  courseTitle: string;
  specialty: string;
  academicHours: number;
  issueDate: string;
  startDate: string;
  endDate: string;
  studentName: string;
  studentDoc: string;
  studentPhoto: string;
  institution: string;
  institutionCity: string;
  verificationUrl: string;
  qrPayload: string;
  instructorName: string;
  instructorTitle: string;
  directorName: string;
  directorTitle: string;
  // Blockchain & Digital Upload fields (Zeyo ID / Polygon / PDF / Foto)
  blockchainUrl?: string;
  blockchainNetwork?: string;
  blockchainTxHash?: string;
  blockchainIssuerKey?: string;
  digitalFileUrl?: string;
  digitalFileType?: 'image' | 'pdf' | 'blockchain_embed';
  digitalFileName?: string;
  officialRuc?: string;
  expedienteNum?: string;
  signerName?: string;
  signerTitle?: string;
}
