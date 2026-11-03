import React, { useState } from 'react';
import { CertificateRecord, UserProfile } from '../types';
import { CertificateDocument } from './CertificateDocument';
import { 
  Award, CheckCircle2, Download, Maximize2, ShieldCheck, 
  ExternalLink, Calendar, Clock, Hash, X, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificatesViewProps {
  certificates: CertificateRecord[];
  userProfile: UserProfile;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  userProfile
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateRecord | null>(null);
  const [verifyCertificate, setVerifyCertificate] = useState<CertificateRecord | null>(null);

  const handleDownload = (cert: CertificateRecord) => {
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (cert.digitalFileUrl) {
      const link = document.createElement('a');
      link.download = cert.digitalFileName || `Certificado_Oficial_${cert.code}.png`;
      link.href = cert.digitalFileUrl;
      link.target = '_blank';
      link.click();
      return;
    }

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

    // Outer border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#064e3b';
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(48, 48, 1504, 1034);

    // Text Header
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

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 56px sans-serif';
    ctx.fillText('CERTIFICADO', 800, 280);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('— DE APROBACIÓN —', 800, 320);

    ctx.fillStyle = '#475569';
    ctx.font = '20px sans-serif';
    ctx.fillText('Se otorga el presente reconocimiento oficial a:', 800, 385);

    // Student Name
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(cert.studentName, 800, 450);

    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Por haber aprobado con éxito el programa de capacitación especializada en:`, 800, 510);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`"${cert.courseTitle}"`, 800, 560);

    ctx.fillStyle = '#475569';
    ctx.font = '19px sans-serif';
    ctx.fillText(`Carga horaria acreditada: ${cert.academicHours} horas lectivas · Cédula: ${cert.studentDoc}`, 800, 610);
    ctx.fillText(`Emitido legalmente en Shushufindi, Ecuador el ${cert.issueDate}`, 800, 645);

    // Signatures
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(250, 850);
    ctx.lineTo(550, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(cert.instructorName, 400, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(cert.instructorTitle, 400, 905);

    ctx.beginPath();
    ctx.moveTo(1050, 850);
    ctx.lineTo(1350, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(cert.directorName, 1200, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText('Dirección Académica Regional · Sucumbíos', 1200, 905);

    // Seal
    ctx.beginPath();
    ctx.arc(800, 860, 55, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#d97706';
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('SERTECEP', 800, 852);
    ctx.fillText('OFICIAL', 800, 870);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`Código de Validación: ${cert.code}`, 800, 1020);

    const link = document.createElement('a');
    link.download = `Certificado_${cert.code}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5" />
          MIS CERTIFICACIONES OFICIALES
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Certificados habilitados para tu cuenta
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Cada programa aprobado cuenta con un diploma individual con validez institucional emitido por Academia Sertecep Amazónico S.A.S. (Shushufindi, Sucumbíos, Ecuador).
        </p>
      </div>

      {/* Profile Readiness Banner matching screenshot 6 */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Perfil listo para emitir certificados
              <span className="text-[11px] font-normal text-emerald-400 font-mono">5 de 5 listos</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tus nombres completos ({userProfile.firstName} {userProfile.firstLastName}), cédula ({userProfile.docNumber}) y fotografía están registrados para la impresión de diplomas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Verificación Oficial Habilitada</span>
          </div>
        </div>
      </div>

      {/* Certificate Cards Grid matching image_c17d36e0.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 shadow-xl group"
          >
            {/* Visual Certificate Preview Card */}
            <div className="relative p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-[#0a1017] to-slate-950 border-b border-slate-800/80">
              {cert.digitalFileUrl ? (
                /* Real Digital Certificate Scan (e.g. from image_8518c087.png or uploaded) */
                <div className="relative aspect-[16/10] w-full rounded-xl bg-black border-2 border-emerald-500/40 shadow-xl overflow-hidden group/thumb flex items-center justify-center">
                  <img
                    src={cert.digitalFileUrl}
                    alt={`Certificado Digital de ${cert.studentName}`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-mono text-[9px] font-bold flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3 h-3" />
                    <span>POLYGON BLOCKCHAIN · ZEYO ID</span>
                  </div>
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover/thumb:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs"
                  >
                    <Maximize2 className="w-5 h-5 text-emerald-400" />
                    <span>Ver documento y verificación completa</span>
                  </button>
                </div>
              ) : (
                /* Mini Certificate Render Simulation */
                <div className="relative aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-[#fdfbf7] via-white to-[#f7f3e8] text-slate-900 p-5 sm:p-7 border-4 border-emerald-900 shadow-inner flex flex-col justify-between overflow-hidden">
                  <div className="absolute inset-1.5 border border-amber-600/40 pointer-events-none rounded" />

                  {/* Top header of diploma */}
                  <div className="text-center">
                    <div className="text-[9px] sm:text-[11px] font-bold tracking-wider text-emerald-950 uppercase">
                      ACADEMIA SERTECEP AMAZÓNICO S.A.S.
                    </div>
                    <div className="text-[7px] sm:text-[9px] text-slate-500 tracking-wider">
                      SHUSHUFINDI · SUCUMBÍOS · ECUADOR
                    </div>
                    <div className="text-base sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                      CERTIFICADO DE APROBACIÓN
                    </div>
                    <div className="inline-block px-2 py-0.5 bg-emerald-900 text-amber-300 text-[8px] sm:text-[10px] font-bold rounded uppercase mt-0.5">
                      {cert.specialty}
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="text-center my-1 sm:my-2">
                    <div className="text-[8px] sm:text-[10px] text-slate-600">Se otorga a:</div>
                    <div className="text-xs sm:text-lg font-black text-emerald-950 uppercase tracking-tight font-display">
                      {cert.studentName}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-slate-500 font-mono">
                      Cédula: {cert.studentDoc} · {cert.academicHours} Horas Lectivas
                    </div>
                  </div>

                  {/* Bottom Signatures & Seal */}
                  <div className="flex items-center justify-between text-[7px] sm:text-[9px] text-slate-700 pt-1 border-t border-slate-200">
                    <div>
                      <div className="font-serif italic text-xs text-slate-900">A. de la Cruz</div>
                      <div className="font-bold text-slate-900">{cert.instructorName}</div>
                      <div className="text-slate-500">{cert.instructorTitle}</div>
                    </div>

                    {/* Golden seal */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-400 border border-amber-600 flex flex-col items-center justify-center text-amber-950 font-bold text-[6px] sm:text-[7px] shadow">
                      <span>SERTECEP</span>
                      <span className="text-[8px] sm:text-[9px]">OFICIAL</span>
                    </div>

                    <div className="text-right">
                      <div className="font-serif italic text-xs text-slate-900">E. Pilozo</div>
                      <div className="font-bold text-slate-900">{cert.directorName}</div>
                      <div className="text-slate-500">Dirección Ejecutiva</div>
                    </div>
                  </div>

                  {/* Hover overlay to expand */}
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs"
                  >
                    <Maximize2 className="w-5 h-5 text-emerald-400" />
                    <span>Clic para ver en pantalla completa</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Meta & Actions */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {cert.courseTitle}
                  </h3>
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{cert.specialty}</p>
              </div>

              {/* Data Grid matching screenshot */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">HORAS LECTIVAS</span>
                  <span className="text-white font-bold">{cert.academicHours} Horas</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">FECHA EMISIÓN</span>
                  <span className="text-white font-bold">{cert.issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">PERÍODO INICIO</span>
                  <span className="text-slate-300">{cert.startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">PERÍODO FIN</span>
                  <span className="text-slate-300">{cert.endDate}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">CÓDIGO DE VALIDACIÓN OFICIAL</span>
                  <span className="text-emerald-400 font-bold tracking-wider">{cert.code}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedCertificate(cert)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Ampliar
                </button>
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-md shadow-amber-400/20 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar PDF
                </button>
                <button
                  onClick={() => setVerifyCertificate(cert)}
                  title="Comprobar validez pública en registro Sertecep"
                  className="p-2 text-slate-400 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Certificate Inspection Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <CertificateDocument
              certificate={selectedCertificate}
              isModal={true}
              onClose={() => setSelectedCertificate(null)}
            />
          </div>
        </div>
      )}

      {/* Public Registry Verification Modal */}
      {verifyCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setVerifyCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-3">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Certificado Auténtico y Verificado</h3>
              <p className="text-xs text-slate-400 mt-1">
                Registro oficial en el sistema de validación de Academia Sertecep Amazónico S.A.S.
              </p>

              <div className="w-full bg-slate-950 rounded-xl p-4 mt-5 text-left text-xs font-mono space-y-2 border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">CÓDIGO:</span>
                  <span className="text-emerald-400 font-bold">{verifyCertificate.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ALUMNO:</span>
                  <span className="text-white">{verifyCertificate.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DOCUMENTO:</span>
                  <span className="text-white">{verifyCertificate.studentDoc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PROGRAMA:</span>
                  <span className="text-white">{verifyCertificate.courseTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">HORAS:</span>
                  <span className="text-white">{verifyCertificate.academicHours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SEDE:</span>
                  <span className="text-white">Shushufindi, Sucumbíos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ESTADO:</span>
                  <span className="text-emerald-400 font-bold">VIGENTE Y ACREDITADO</span>
                </div>
              </div>

              <button
                onClick={() => setVerifyCertificate(null)}
                className="w-full mt-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Cerrar comprobación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
