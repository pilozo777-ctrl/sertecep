import React, { useRef } from 'react';
import { CertificateRecord } from '../types';
import { CheckCircle2, Download, ExternalLink, Printer, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OFFICIAL_SERTECEP_LOGO } from '../data/mockData';

interface CertificateProps {
  certificate: CertificateRecord;
  onClose?: () => void;
  isModal?: boolean;
}

export const CertificateDocument: React.FC<CertificateProps> = ({ certificate, onClose, isModal = false }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Create a high resolution canvas rendering
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1600;
    canvas.height = 1130;

    // Background parchment
    const gradient = ctx.createLinearGradient(0, 0, 1600, 1130);
    gradient.addColorStop(0, '#fdfbf7');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#f9f6ef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1600, 1130);

    // Outer borders
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#064e3b'; // Deep emerald
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d97706'; // Gold
    ctx.strokeRect(48, 48, 1504, 1034);

    // Corner decorative ornaments
    ctx.fillStyle = '#064e3b';
    const corners = [
      [55, 55], [1545 - 55, 55], [55, 1075 - 55], [1545 - 55, 1075 - 55]
    ];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('ACADEMIA SERTECEP AMAZÓNICO S.A.S.', 800, 140);

    ctx.font = '500 18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('INSTITUCIÓN DE CAPACITACIÓN PROFESIONAL Y TECNOLÓGICA · SHUSHUFINDI, SUCUMBÍOS, ECUADOR', 800, 175);

    // Decorative line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 195);
    ctx.lineTo(1250, 195);
    ctx.stroke();

    // Big Certificate Heading
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 58px sans-serif';
    ctx.fillText('CERTIFICADO', 800, 280);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('— DE APROBACIÓN —', 800, 320);

    // Awarded text
    ctx.fillStyle = '#475569';
    ctx.font = '20px sans-serif';
    ctx.fillText('Se otorga el presente reconocimiento oficial a:', 800, 385);

    // Student Name
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(certificate.studentName, 800, 450);

    // Text detail
    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    const detailText = `Por haber aprobado satisfactoriamente con excelencia académica el programa de formación:`;
    ctx.fillText(detailText, 800, 510);

    // Course Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`"${certificate.courseTitle}"`, 800, 560);

    ctx.fillStyle = '#475569';
    ctx.font = '19px sans-serif';
    ctx.fillText(`Con una duración académica presencial y virtual intensiva de ${certificate.academicHours} horas lectivas.`, 800, 605);
    ctx.fillText(`Fecha de emisión: ${certificate.issueDate}  ·  Documento de Identidad: ${certificate.studentDoc}`, 800, 640);

    // Signatures
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    // Signature 1
    ctx.beginPath();
    ctx.moveTo(250, 850);
    ctx.lineTo(550, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(certificate.instructorName, 400, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(certificate.instructorTitle, 400, 905);
    ctx.fillText('Sertecep Amazónico', 400, 925);

    // Signature 2
    ctx.beginPath();
    ctx.moveTo(1050, 850);
    ctx.lineTo(1350, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(certificate.directorName, 1200, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText('Dirección Académica Regional', 1200, 905);
    ctx.fillText('RUC: 2191754820001', 1200, 925);

    // Golden Seal in center bottom
    ctx.beginPath();
    ctx.arc(800, 860, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('SERTECEP', 800, 850);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('OFICIAL', 800, 868);
    ctx.font = '9px sans-serif';
    ctx.fillText('ECUADOR', 800, 885);

    // Verification Code
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`Código de Validación Única: ${certificate.code}`, 800, 1020);
    ctx.fillText(`Valide este certificado en: sertecep-amazonico.edu.ec/verificar`, 800, 1042);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Certificado_${certificate.code}_${certificate.studentName.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`relative ${isModal ? 'max-w-5xl mx-auto' : 'w-full'}`}>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Certificado Oficial Sertecep Amazónico S.A.S.
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-emerald-400">{certificate.code}</span>
              <span aria-hidden="true">·</span>
              <span>{certificate.academicHours} Horas Académicas</span>
              <span aria-hidden="true">·</span>
              <span>Emisión: {certificate.issueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>
          <button
            onClick={handleDownloadImage}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
          >
            <Download className="w-4 h-4" />
            Descargar Certificado (PNG/PDF)
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* Diploma Canvas Container */}
      <div
        id="printable-certificate"
        ref={certRef}
        className="relative bg-gradient-to-br from-[#fcfbf7] via-white to-[#f7f3e8] text-slate-900 rounded-xl p-8 sm:p-12 border-8 border-emerald-900 shadow-2xl overflow-hidden select-none"
      >
        {/* Subtle Decorative Gold Border inside */}
        <div className="absolute inset-3 border-2 border-amber-600/60 pointer-events-none rounded-lg" />
        <div className="absolute inset-5 border border-emerald-700/20 pointer-events-none rounded-md" />

        {/* Watermark Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <span className="text-[12rem] font-extrabold tracking-widest text-emerald-950">SERTECEP</span>
        </div>

        {/* Diploma Header */}
        <div className="relative text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-emerald-900/20">
              <img
                src={OFFICIAL_SERTECEP_LOGO}
                alt="Logo Sertecep Amazónico"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 uppercase">
                Academia Sertecep Amazónico S.A.S.
              </h1>
              <p className="text-xs text-slate-600 tracking-wider uppercase font-medium">
                Institución de Formación y Certificación Profesional · Sucumbíos, Ecuador
              </p>
            </div>
          </div>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-3" />
        </div>

        {/* Certificate Title */}
        <div className="relative text-center my-6">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-amber-700 uppercase">
            Otorgado con Excelencia Académica
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-1 mb-2">
            CERTIFICADO DE APROBACIÓN
          </h2>
          <div className="inline-block px-4 py-1 bg-emerald-900 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider rounded uppercase">
            {certificate.specialty}
          </div>
        </div>

        {/* Recipient */}
        <div className="relative text-center my-8">
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Se otorga la presente distinción y constancia a:
          </p>
          <div className="mt-2 text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight font-display uppercase border-b-2 border-emerald-900/30 pb-2 inline-block min-w-[320px]">
            {certificate.studentName}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 mt-2 font-mono">
            <span>Cédula: <strong>{certificate.studentDoc}</strong></span>
            <span>·</span>
            <span>Shushufindi, Ecuador</span>
          </div>
        </div>

        {/* Body Text */}
        <div className="relative max-w-2xl mx-auto text-center text-xs sm:text-sm text-slate-700 leading-relaxed mb-8">
          <p>
            Por haber concluido y aprobado satisfactoriamente todos los módulos teórico-prácticos, talleres y proyectos correspondientes al programa de capacitación especializada en{' '}
            <strong className="text-slate-900 font-semibold">{certificate.courseTitle}</strong>, acreditando una carga horaria total de{' '}
            <strong className="text-emerald-900 font-bold">{certificate.academicHours} horas académicas</strong>.
          </p>
        </div>

        {/* Bottom Details & Signatures */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 mt-6 border-t border-slate-200">
          {/* Signature 1 */}
          <div className="text-center">
            <div className="h-14 flex items-center justify-center">
              <span className="font-serif italic text-2xl text-slate-800 opacity-90 select-none">
                Arturo de la Cruz
              </span>
            </div>
            <div className="w-44 h-px bg-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-900 uppercase">{certificate.instructorName}</p>
            <p className="text-[11px] text-slate-600">{certificate.instructorTitle}</p>
          </div>

          {/* Golden Seal & QR */}
          <div className="flex flex-col items-center justify-center order-first md:order-none">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 p-1 shadow-lg flex items-center justify-center border-2 border-amber-700">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center text-amber-950 font-bold text-center leading-tight">
                <span className="text-[8px] tracking-widest text-amber-800">ACADEMIA</span>
                <span className="text-[11px] font-black text-emerald-950">SERTECEP</span>
                <span className="text-[8px] text-amber-800">SELLO OFICIAL</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-900 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
              <span>Verificación Acreditada</span>
            </div>
          </div>

          {/* Signature 2 */}
          <div className="text-center">
            <div className="h-14 flex items-center justify-center">
              <span className="font-serif italic text-2xl text-slate-800 opacity-90 select-none">
                E. Pilozo M.
              </span>
            </div>
            <div className="w-44 h-px bg-slate-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-slate-900 uppercase">{certificate.directorName}</p>
            <p className="text-[11px] text-slate-600">Dirección Ejecutiva · Shushufindi</p>
          </div>
        </div>

        {/* Bottom Verification Strip */}
        <div className="relative mt-8 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
          <div>
            <span>REGISTRO: </span>
            <span className="text-emerald-900 font-semibold">{certificate.code}</span>
          </div>
          <div>
            <span>EMITIDO: {certificate.issueDate}</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-800">
            <ExternalLink className="w-3 h-3" />
            <span>Validez pública en sertecep-amazonico.edu.ec</span>
          </div>
        </div>
      </div>
    </div>
  );
};
