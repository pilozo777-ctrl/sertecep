import { Course, StudentEnrollment, CertificateRecord, AuthAccount, UserProfile } from '../types';
import { 
  sampleCourses, sampleStudentsList, sampleCertificates, 
  defaultStudentAccount, initialUserProfile 
} from '../data/mockData';

const STORAGE_KEYS = {
  COURSES: 'sertecep_courses_v3',
  STUDENTS: 'sertecep_students_v3',
  CERTIFICATES: 'sertecep_certificates_v3',
  AUTH_ACCOUNT: 'sertecep_account_v3',
  USER_PROFILE: 'sertecep_profile_v3',
  IS_AUTHENTICATED: 'sertecep_is_auth_v3',
  SELECTED_COURSE_ID: 'sertecep_selected_course_id_v3',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export const storage = {
  getCourses: (): Course[] => {
    return safeGet<Course[]>(STORAGE_KEYS.COURSES, sampleCourses);
  },
  setCourses: (courses: Course[]): void => {
    safeSet(STORAGE_KEYS.COURSES, courses);
  },

  getStudents: (): StudentEnrollment[] => {
    return safeGet<StudentEnrollment[]>(STORAGE_KEYS.STUDENTS, sampleStudentsList);
  },
  setStudents: (students: StudentEnrollment[]): void => {
    safeSet(STORAGE_KEYS.STUDENTS, students);
  },

  getCertificates: (): CertificateRecord[] => {
    return safeGet<CertificateRecord[]>(STORAGE_KEYS.CERTIFICATES, sampleCertificates);
  },
  setCertificates: (certs: CertificateRecord[]): void => {
    safeSet(STORAGE_KEYS.CERTIFICATES, certs);
  },

  getAccount: (): AuthAccount => {
    return safeGet<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT, defaultStudentAccount);
  },
  setAccount: (account: AuthAccount): void => {
    safeSet(STORAGE_KEYS.AUTH_ACCOUNT, account);
  },
  getAuthAccount: (): AuthAccount => {
    return safeGet<AuthAccount>(STORAGE_KEYS.AUTH_ACCOUNT, defaultStudentAccount);
  },
  setAuthAccount: (account: AuthAccount): void => {
    safeSet(STORAGE_KEYS.AUTH_ACCOUNT, account);
  },

  getUserProfile: (): UserProfile => {
    return safeGet<UserProfile>(STORAGE_KEYS.USER_PROFILE, initialUserProfile);
  },
  setUserProfile: (profile: UserProfile): void => {
    safeSet(STORAGE_KEYS.USER_PROFILE, profile);
  },

  getIsAuthenticated: (): boolean => {
    return safeGet<boolean>(STORAGE_KEYS.IS_AUTHENTICATED, false);
  },
  setIsAuthenticated: (isAuth: boolean): void => {
    safeSet(STORAGE_KEYS.IS_AUTHENTICATED, isAuth);
  },

  getSelectedCourseId: (): string => {
    return safeGet<string>(STORAGE_KEYS.SELECTED_COURSE_ID, 'course-flutter-ia');
  },
  setSelectedCourseId: (id: string): void => {
    safeSet(STORAGE_KEYS.SELECTED_COURSE_ID, id);
  },

  // Reset all to defaults if desired
  resetAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.COURSES);
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
      localStorage.removeItem(STORAGE_KEYS.AUTH_ACCOUNT);
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_COURSE_ID);
    } catch (e) {
      console.error(e);
    }
  }
};
