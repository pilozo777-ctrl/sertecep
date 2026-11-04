import React, { useState } from 'react';
import { 
  FileText, Download, ExternalLink, Maximize2, ShieldCheck, 
  Printer, AlertCircle, Eye, CheckCircle2, Award 
} from 'lucide-react';
import { isPdfDocument, getCertificateDownloadFilename } from '../utils/documentUtils';
import { CertificateRecord } from '../types';

interface CertificateMediaViewerProps {
  certificate: CertificateRecord;
  isThumbnail?: boolean;
  onExpand?: () => void;
  className?: string;
  maxHeightClass?: string;
}

export const CertificateMediaViewer: React.FC<CertificateMediaViewerProps> = ({
  certificate,
  isThumbnail = false,
  onExpand,
  className = '',
  maxHeightClass = 'max-h-[75vh]',
}) => {
  const [loadError, setLoadError] = useState(false);
  const fileUrl = certificate.digitalFileUrl;
  const isPdf = isPdfDocument(fileUrl, certificate.digitalFileType, certificate.digitalFileName);

  const handleDownload = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = getCertificateDownloadFilename(certificate);
    link.target = '_blank';
    link.click();
  };

  // Thumbnail mode (used in certificate grid cards)
  if (isThumbnail) {
    if (isPdf) {
      return (
        <div 
          onClick={onExpand}
          className={`relative aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-slate-950 via-[#0a121d] to-[#071018] border-2 border-emerald-500/40 shadow-xl overflow-hidden group/thumb cursor-pointer flex flex-col justify-between p-4 sm:p-5 ${className}`}
        >
          {/* Subtle PDF iframe preview or clean container */}
          {fileUrl && !loadError ? (
            <div className="absolute inset-0 transition-opacity pointer-events-none overflow-hidden bg-slate-900">
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                title={`Certificado PDF de ${certificate.studentName}`}
                className="w-full h-full border-0 pointer-events-none"
                onError={() => setLoadError(true)}
              />
            </div>
          ) : (
            <div className="relative z-10 text-center my-auto py-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 mb-2 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-1">
                {certificate.studentName}
              </h4>
              <p className="text-[11px] text-emerald-400 font-medium line-clamp-1 mt-0.5">
                {certificate.courseTitle}
              </p>
            </div>
          )}

          {/* Top badges - subtle bar */}
          <div className="relative z-10 flex items-center justify-between gap-2 pointer-events-none">
            <div className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold flex items-center gap-1 shadow backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>BLOCKCHAIN VERIFICADO</span>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-red-500 text-white font-mono font-bold text-[9px] tracking-wider flex items-center gap-1 shadow">
              <FileText className="w-2.5 h-2.5" />
              <span>PDF OFICIAL</span>
            </span>
          </div>

          {/* Bottom helper */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="truncate max-w-[180px] font-mono text-slate-400">
              {certificate.digitalFileName || 'Certificado_Digital.pdf'}
            </span>
            <span className="text-emerald-400 font-semibold group-hover/thumb:underline flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Ver PDF
            </span>
          </div>

          {/* Hover overlay button */}
          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs z-20">
            <Maximize2 className="w-5 h-5 text-emerald-400" />
            <span>Clic para abrir PDF y verificación completa</span>
          </div>
        </div>
      );
    }

    // Image thumbnail
    return (
      <div 
        onClick={onExpand}
        className={`relative aspect-[16/10] w-full rounded-xl bg-black border-2 border-emerald-500/40 shadow-xl overflow-hidden group/thumb cursor-pointer flex items-center justify-center ${className}`}
      >
        {fileUrl && !loadError ? (
          <img
            src={fileUrl}
            alt={`Certificado Digital de ${certificate.studentName}`}
            onError={() => setLoadError(true)}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Award className="w-10 h-10 text-amber-400 mb-2" />
            <span className="text-xs font-bold text-white">{certificate.studentName}</span>
            <span className="text-[10px] text-slate-400">{certificate.courseTitle}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold flex items-center gap-1 shadow z-10">
          <ShieldCheck className="w-3 h-3" />
          <span>POLYGON BLOCKCHAIN · ZEYO ID</span>
        </div>

        <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs z-10">
          <Maximize2 className="w-5 h-5 text-emerald-400" />
          <span>Ver documento y verificación completa</span>
        </div>
      </div>
    );
  }

  // Fullsize Document Viewer (Modal or Detailed View)
  if (isPdf) {
    return (
      <div className={`w-full flex flex-col rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl ${className}`}>
        {/* PDF Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-slate-900 via-[#0d1522] to-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2.5 py-0.5 rounded bg-red-500 text-white font-mono font-bold text-[10px] shadow">
              PDF OFICIAL
            </span>
            <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
              {certificate.digitalFileName || `Certificado_Oficial_${certificate.studentName}.pdf`}
            </span>
            <span className="hidden sm:inline-block text-emerald-400 font-mono text-[11px]">
              · {certificate.academicHours} Horas
            </span>
          </div>

          <div className="flex items-center gap-2">
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 font-medium transition text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Abrir en</span> pestaña nueva
              </a>
            )}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow transition text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Embedded PDF Object / iFrame */}
        <div className="relative w-full h-[65vh] min-h-[480px] bg-slate-950 flex flex-col">
          {fileUrl ? (
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full rounded-b-xl"
            >
              <iframe
                src={`${fileUrl}#toolbar=1`}
                title={`Certificado PDF de ${certificate.studentName}`}
                className="w-full h-full border-0 rounded-b-xl"
              >
                {/* Fallback if browser blocks inline iframe */}
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-300">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white">Certificado PDF Listo para Descargar</h4>
                  <p className="text-xs text-slate-400 max-w-md mt-1 mb-4">
                    El documento oficial está almacenado correctamente. Puedes abrirlo directamente o guardarlo en tu dispositivo.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
                    >
                      Abrir PDF en pantalla completa
                    </a>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
                    >
                      Descargar PDF
                    </button>
                  </div>
                </div>
              </iframe>
            </object>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
              <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-white">Documento no disponible</p>
              <p className="text-xs text-slate-500 mt-1">El archivo no pudo ser cargado.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fullsize Image Mode
  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/80 bg-black/70 shadow-inner flex items-center justify-center p-1 sm:p-2">
        {fileUrl && !loadError ? (
          <img
            src={fileUrl}
            alt={`Certificado Oficial de ${certificate.studentName}`}
            onError={() => setLoadError(true)}
            className={`w-full h-auto ${maxHeightClass} object-contain rounded-lg shadow-2xl`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-300">
            <Award className="w-14 h-14 text-amber-400 mb-3" />
            <h4 className="text-base font-bold text-white">{certificate.studentName}</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Certificado emitido para el programa {certificate.courseTitle}.
            </p>
            <button
              onClick={handleDownload}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Archivo Oficial</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
