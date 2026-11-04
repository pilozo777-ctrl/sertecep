import { UserProfile, AuthAccount, StudentEnrollment } from '../types';
import { OFFICIAL_SERTECEP_LOGO } from '../data/mockData';

/**
 * Builds a clean, individualized UserProfile based on the authenticated student
 * Ensures students like "Dayana" see their own name, credentials, and enrolled courses
 */
export function buildProfileFromAccountAndStudents(
  account: AuthAccount,
  students: StudentEnrollment[]
): UserProfile {
  if (account.role === 'admin') {
    return {
      id: account.id,
      role: 'admin',
      username: account.username,
      firstName: 'ARTURO',
      secondName: '',
      firstLastName: 'DE LA CRUZ',
      secondLastName: '',
      email: account.email,
      phone: account.phone || '+593989012515',
      country: 'Ecuador',
      docType: 'Cédula',
      docNumber: account.docNumber || '2100348911',
      photoUrl: account.avatarUrl || OFFICIAL_SERTECEP_LOGO,
      city: 'Shushufindi',
      province: 'Sucumbíos',
      academicLevel: 'Dirección General & Docencia',
      streakDays: 30,
    };
  }

  // Find student in registered students list
  const matchedStudent = students.find(
    s => s.id === account.id ||
         s.username.toLowerCase() === account.username.toLowerCase() ||
         (account.docNumber && s.docNumber === account.docNumber)
  );

  const fullName = matchedStudent?.studentName || account.fullName || account.username;
  const parts = fullName.trim().split(/\s+/);

  let firstName = '';
  let secondName = '';
  let firstLastName = '';
  let secondLastName = '';

  if (parts.length === 1) {
    firstName = parts[0];
  } else if (parts.length === 2) {
    firstName = parts[0];
    firstLastName = parts[1];
  } else if (parts.length === 3) {
    firstName = parts[0];
    secondName = parts[1];
    firstLastName = parts[2];
  } else {
    firstName = parts[0];
    secondName = parts[1];
    firstLastName = parts[2];
    secondLastName = parts.slice(3).join(' ');
  }

  return {
    id: matchedStudent?.id || account.id,
    role: 'student',
    username: matchedStudent?.username || account.username,
    firstName: firstName.toUpperCase(),
    secondName: secondName.toUpperCase(),
    firstLastName: firstLastName.toUpperCase(),
    secondLastName: secondLastName.toUpperCase(),
    email: matchedStudent?.email || account.email,
    phone: matchedStudent?.phone || account.phone || '+593989012515',
    country: 'Ecuador',
    docType: 'Cédula',
    docNumber: matchedStudent?.docNumber || account.docNumber || '2100404355',
    photoUrl: account.avatarUrl || '/assets/aistudio/image_f29cb282.png',
    city: 'Shushufindi',
    province: 'Sucumbíos',
    academicLevel: 'Estudiante Matriculado Sertecep Amazónico',
    streakDays: 7,
  };
}

/**
 * Checks if a student is enrolled in a specific course
 * Supports:
 * - Admin (access to all)
 * - 'ALL' in enrolledCourseIds (purchased all courses)
 * - Array of specific course IDs
 * - Single courseId fallback
 */
export function isStudentEnrolled(
  student: StudentEnrollment | undefined,
  courseId: string,
  isAdmin: boolean
): boolean {
  if (isAdmin) return true;
  if (!student) return true; // default demo student has general access

  if (student.enrolledCourseIds && student.enrolledCourseIds.length > 0) {
    if (student.enrolledCourseIds.includes('ALL')) return true;
    return student.enrolledCourseIds.includes(courseId);
  }

  return student.courseId === courseId;
}
