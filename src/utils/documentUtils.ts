/**
 * Utility functions for detecting and handling digital documents (PDFs and Images)
 * in Academia Sertecep Amazónico.
 */
import { CertificateRecord } from '../types';

export const isPdfDocument = (
  url?: string | null,
  fileType?: string | null,
  fileName?: string | null
): boolean => {
  if (fileType === 'pdf') return true;
  if (fileType === 'image') return false;

  const targetUrl = (url || '').trim().toLowerCase();
  const targetName = (fileName || '').trim().toLowerCase();

  if (targetName.endsWith('.pdf')) return true;
  if (targetUrl.startsWith('data:application/pdf')) return true;
  if (targetUrl.includes('application/pdf')) return true;
  if (targetUrl.includes('.pdf?') || targetUrl.includes('.pdf#') || targetUrl.endsWith('.pdf')) return true;

  return false;
};

export const getCertificateDownloadFilename = (cert: CertificateRecord): string => {
  const isPdf = isPdfDocument(cert.digitalFileUrl, cert.digitalFileType, cert.digitalFileName);
  const ext = isPdf ? 'pdf' : 'png';
  
  if (cert.digitalFileName) {
    if (isPdf && !cert.digitalFileName.toLowerCase().endsWith('.pdf')) {
      return `${cert.digitalFileName}.pdf`;
    }
    return cert.digitalFileName;
  }

  const cleanName = cert.studentName ? cert.studentName.trim().replace(/\s+/g, '_') : 'Sertecep';
  return `Certificado_Oficial_${cert.code || 'Valido'}_${cleanName}.${ext}`;
};
