import React, { useRef, useState } from 'react';
import { CertificateRecord } from '../types';
import { CertificateMediaViewer } from './CertificateMediaViewer';
import { getCertificateDownloadFilename, isPdfDocument } from '../utils/documentUtils';
import { 
  CheckCircle2, Download, ExternalLink, Printer, ShieldCheck, 
  FileText, Image as ImageIcon, Link2, Copy, Check, Sparkles, X, Share2, Award, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  OFFICIAL_SERTECEP_LOGO, 
  OFFICIAL_CERTIFICATE_SCAN, 
  OFFICIAL_ZEYO_BLOCKCHAIN_URL,
  OFFICIAL_BLOCKCHAIN_TX,
  OFFICIAL_BLOCKCHAIN_PUBKEY,
  OFFICIAL_RUC,
  OFFICIAL_EXPEDIENTE,
  OFFICIAL_SIGNER_NAME
} from '../data/mockData';

interface CertificateProps {
  certificate: CertificateRecord;
  onClose?: () => void;
  isModal?: boolean;
}

export const CertificateDocument: React.FC<CertificateProps> = ({ certificate, onClose, isModal = false }) => {
  const certRef = useRef<HTMLDivElement>(null);
  
  // Active viewing mode
  const [activeMode, setActiveMode] = useState<'digital_scan' | 'blockchain_zeyo' | 'diploma_canvas'>('digital_scan');
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const blockchainUrl = certificate.blockchainUrl || OFFICIAL_ZEYO_BLOCKCHAIN_URL;
  const blockchainTx = certificate.blockchainTxHash || OFFICIAL_BLOCKCHAIN_TX;
  const blockchainKey = certificate.blockchainIssuerKey || OFFICIAL_BLOCKCHAIN_PUBKEY;
  const digitalFile = certificate.digitalFileUrl || OFFICIAL_CERTIFICATE_SCAN;
  const officialRuc = certificate.officialRuc || OFFICIAL_RUC;
  const expediente = certificate.expedienteNum || OFFICIAL_EXPEDIENTE;
  const signer = certificate.signerName || OFFICIAL_SIGNER_NAME;
  const isPdf = isPdfDocument(digitalFile, certificate.digitalFileType, certificate.digitalFileName);

  const handleCopy = (text: string, type: 'tx' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'tx') {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleDownloadDigitalFile = () => {
    confetti({ particleCount: 60, spread: 60 });
    const link = document.createElement('a');
    link.href = digitalFile;
    link.download = getCertificateDownloadFilename(certificate);
    link.target = '_blank';
    link.click();
  };

  const handleDownloadCanvasImage = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

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

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('ACADEMIA DE ENSEÑANZA TÉCNICA Y PROFESIONAL SERTECEP AMAZÓNICO', 800, 135);

    ctx.font = '500 17px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`RUC: ${officialRuc} · EXPEDIENTE: ${expediente} · SHUSHUFINDI, SUCUMBÍOS, ECUADOR`, 800, 170);

    // Decorative line
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 190);
    ctx.lineTo(1250, 190);
    ctx.stroke();

    // Big Heading
    ctx.fillStyle = '#0f172a';
    ctx.font = '800 56px sans-serif';
    ctx.fillText('CERTIFICADO', 800, 275);

    ctx.fillStyle = '#d97706';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('— DE APROBACIÓN Y VALIDEZ INSTITUCIONAL —', 800, 315);

    ctx.fillStyle = '#475569';
    ctx.font = '20px sans-serif';
    ctx.fillText('Confiere el presente certificado oficial a:', 800, 380);

    // Student Name
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(certificate.studentName, 800, 445);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(certificate.studentDoc, 800, 485);

    ctx.fillStyle = '#334155';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Ha finalizado y aprobado con éxito el programa académico de formación en:`, 800, 535);

    // Course Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`"${certificate.courseTitle}"`, 800, 580);

    ctx.fillStyle = '#475569';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Por haber concluido de manera satisfactoria el curso, con todos los requisitos, obteniendo una destacada participación,`, 800, 625);
    ctx.fillText(`con una duración de ${certificate.academicHours} horas de trabajo autónomo y práctico acreditado.`, 800, 655);

    // Signatures
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(250, 850);
    ctx.lineTo(550, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(certificate.instructorName || signer, 400, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText(certificate.instructorTitle || 'Docente Instructor', 400, 905);

    ctx.beginPath();
    ctx.moveTo(1050, 850);
    ctx.lineTo(1350, 850);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(signer, 1200, 880);
    ctx.fillStyle = '#64748b';
    ctx.font = '15px sans-serif';
    ctx.fillText('Dirección Académica & Representante Legal', 1200, 905);

    // Seal in center bottom
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
    ctx.fillText('POLYGON', 800, 885);

    // Verification Code
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`Validación Blockchain (Polygon Zeyo ID): ${certificate.code}`, 800, 1010);
    ctx.fillText(`Fecha de emisión: ${certificate.issueDate} · RUC: ${officialRuc}`, 800, 1035);

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
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white tracking-wide truncate">
              Certificado Oficial Sertecep Amazónico
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">{certificate.code}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{certificate.academicHours} Horas Acreditadas</span>
              <span aria-hidden="true">·</span>
              <span>Emisión: {certificate.issueDate}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {activeMode === 'digital_scan' && (
            <button
              onClick={handleDownloadDigitalFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isPdf ? 'Descargar Certificado PDF' : 'Descargar Foto / Archivo'}</span>
            </button>
          )}

          {activeMode === 'diploma_canvas' && (
            <button
              onClick={handleDownloadCanvasImage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Diploma (PNG)</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800 mb-5 overflow-x-auto">
        <button
          onClick={() => setActiveMode('digital_scan')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeMode === 'digital_scan'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          {isPdf ? <FileText className="w-4 h-4 text-red-400" /> : <ImageIcon className="w-4 h-4" />}
          <span>Certificado Digital Oficial ({isPdf ? 'Documento PDF' : 'Foto / Scan'})</span>
        </button>

        <button
          onClick={() => setActiveMode('blockchain_zeyo')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeMode === 'blockchain_zeyo'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Link2 className="w-4 h-4" />
          <span>Verificación Blockchain (Zeyo ID / Polygon)</span>
        </button>

        <button
          onClick={() => setActiveMode('diploma_canvas')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
            activeMode === 'diploma_canvas'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Diploma Acreditado en Alta Resolución</span>
        </button>
      </div>

      {/* MODE 1: DIGITAL PHOTO / PDF SCAN OF THE CERTIFICATE */}
      {activeMode === 'digital_scan' && (
        <div className="space-y-4">
          <div className="bg-[#0b1018] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
            {/* Top quick banner */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold font-mono uppercase">
                  DOCUMENTO DIGITAL VERIFICADO · SERTECEP AMAZÓNICO
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={blockchainUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 font-mono transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enlace Blockchain</span>
                </a>
                <button
                  onClick={handleDownloadDigitalFile}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Archivo</span>
                </button>
              </div>
            </div>

            {/* Certificate Media Viewer (Image or PDF) */}
            <CertificateMediaViewer
              certificate={certificate}
              isThumbnail={false}
              className="w-full"
            />

            {/* Metadata Footer */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <div>
                <span className="block text-slate-500 text-[10px] uppercase font-mono">ESTUDIANTE ACREDITADO</span>
                <span className="text-white font-bold">{certificate.studentName}</span>
                <span className="block text-emerald-400 font-mono">CI: {certificate.studentDoc}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] uppercase font-mono">PROGRAMA & HORAS</span>
                <span className="text-white font-semibold">{certificate.courseTitle}</span>
                <span className="block text-amber-400 font-mono">{certificate.academicHours} Horas</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px] uppercase font-mono">FIRMANTE OFICIAL</span>
                <span className="text-white font-semibold">{signer}</span>
                <span className="block text-slate-500 font-mono">RUC: {officialRuc} · Exp: {expediente}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: BLOCKCHAIN VALIDATION VIEWER (REPLICATING ZEYO ID / POLYGON SCREENSHOT) */}
      {activeMode === 'blockchain_zeyo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#090d14] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
          {/* Left Panel: Transaction & Verification Metadata */}
          <div className="lg:col-span-5 space-y-4">
            {/* Green Verified Box */}
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-300">Verificado</h4>
                <p className="text-xs text-emerald-400/90 mt-0.5">
                  Este es un certificado válido registrado en la red Polygon Blockchain.
                </p>
                <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span>Smart Contract Válido</span>
                  <span>·</span>
                  <span>Zeyo ID</span>
                </div>
              </div>
            </div>

            {/* Transaction Data Cards */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Información de la Transacción Blockchain
              </h5>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block uppercase">FECHA DE EMISIÓN</span>
                <span className="text-white font-semibold">{certificate.issueDate}</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block uppercase">EMISOR INSTITUCIONAL</span>
                <span className="text-emerald-400 font-bold">sertecep (Academia Sertecep Amazónico S.A.S.)</span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase">LLAVE PÚBLICA DEL EMISOR</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 break-all select-all">
                  {blockchainKey}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase">ID DE TRANSACCIÓN (TX HASH)</span>
                  <button
                    onClick={() => handleCopy(blockchainTx, 'tx')}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    {copiedTx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTx ? 'Copiado' : 'Copiar Hash'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-amber-300 break-all select-all">
                  {blockchainTx}
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block uppercase">METADATA DEL REGISTRO</span>
                <span className="text-white font-semibold">TÍTULO: {certificate.courseTitle}</span>
                <span className="block text-slate-400 text-[11px]">RECEPTOR: {certificate.studentName} ({certificate.studentDoc})</span>
              </div>

              {/* Direct External Link to Zeyo ID */}
              <a
                href={blockchainUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir en Explorer Blockchain Zeyo ID</span>
              </a>
            </div>
          </div>

          {/* Right Panel: Official Certificate Preview & Sharing */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Certificación Blockchain Oficial</span>
                <span className="text-[10px] text-slate-400">Servicio convalidado por Zeyo BusinessBlockchain & Polygon</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(blockchainUrl, 'link')}
                  className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Enlace copiado' : 'Compartir'}</span>
                </button>
              </div>
            </div>

            {/* Embedded image or PDF preview */}
            <CertificateMediaViewer
              certificate={certificate}
              isThumbnail={false}
              maxHeightClass="max-h-[55vh]"
              className="w-full"
            />

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>RUC Oficial: <strong className="text-white">{officialRuc}</strong></span>
              <span>Expediente: <strong className="text-white">{expediente}</strong></span>
              <span>Firma: <strong className="text-emerald-400">{signer}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: HIGH-RESOLUTION GENERATED DIPLOMA (PARCHMENT CANVAS) */}
      {activeMode === 'diploma_canvas' && (
        <div
          id="printable-certificate"
          ref={certRef}
          className="relative bg-gradient-to-br from-[#fcfbf7] via-white to-[#f7f3e8] text-slate-900 rounded-xl p-6 sm:p-12 border-8 border-emerald-900 shadow-2xl overflow-hidden select-none"
        >
          {/* Subtle Decorative Gold Border inside */}
          <div className="absolute inset-3 border-2 border-amber-600/60 pointer-events-none rounded-lg" />
          <div className="absolute inset-5 border border-emerald-700/20 pointer-events-none rounded-md" />

          {/* Watermark Logo in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-[12rem] font-extrabold tracking-widest text-emerald-950">SERTECEP</span>
          </div>

          {/* Diploma Header */}
          <div className="relative text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-emerald-900/20">
                <img
                  src={OFFICIAL_SERTECEP_LOGO}
                  alt="Logo Sertecep Amazónico"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-emerald-950 uppercase">
                  Academia de Enseñanza Técnica y Profesional SERTECEP Amazónico
                </h1>
                <p className="text-xs text-slate-600 tracking-wider uppercase font-medium">
                  RUC: {officialRuc} · Superintendencia de Compañías · Expediente: {expediente}
                </p>
              </div>
            </div>
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
          </div>

          {/* Certificate Title */}
          <div className="relative text-center my-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-1">
              CERTIFICADO
            </h2>
            <div className="inline-block px-4 py-1 bg-emerald-900 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider rounded uppercase">
              {certificate.specialty}
            </div>
          </div>

          {/* Recipient */}
          <div className="relative text-center my-6">
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Confiere el presente certificado a:
            </p>
            <div className="mt-1 text-2xl sm:text-4xl font-black text-emerald-950 tracking-tight font-display uppercase border-b-2 border-emerald-900/30 pb-2 inline-block min-w-[320px]">
              {certificate.studentName}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 mt-1 font-mono">
              <span>Identificación: <strong>{certificate.studentDoc}</strong></span>
              <span>·</span>
              <span>Shushufindi, Sucumbíos, Ecuador</span>
            </div>
          </div>

          {/* Body Text */}
          <div className="relative max-w-2xl mx-auto text-center text-xs sm:text-sm text-slate-700 leading-relaxed mb-6">
            <p>
              Ha finalizado y aprobado con éxito el programa académico en{' '}
              <strong className="text-slate-900 font-bold">{certificate.courseTitle}</strong>.
              Por haber concluido de manera satisfactoria el curso, con todos los requisitos, obteniendo una destacada participación,
              con una duración de <strong className="text-emerald-900 font-bold">{certificate.academicHours} horas</strong> de trabajo autónomo y práctico.
            </p>
          </div>

          {/* Bottom Details & Signatures */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 mt-4 border-t border-slate-200">
            {/* Signature 1 */}
            <div className="text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic text-xl text-slate-800 opacity-90 select-none">
                  {certificate.instructorName || 'Arturo de la Cruz'}
                </span>
              </div>
              <div className="w-40 h-px bg-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-900 uppercase">{certificate.instructorName || 'Ing. Arturo de la Cruz'}</p>
              <p className="text-[11px] text-slate-600">{certificate.instructorTitle || 'Docente Instructor'}</p>
            </div>

            {/* Golden Seal */}
            <div className="flex flex-col items-center justify-center order-first md:order-none">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 p-1 shadow-lg flex items-center justify-center border-2 border-amber-700">
                <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center text-amber-950 font-bold text-center leading-tight">
                  <span className="text-[7px] tracking-widest text-amber-800">SERTECEP</span>
                  <span className="text-[10px] font-black text-emerald-950">OFICIAL</span>
                  <span className="text-[7px] text-amber-800">POLYGON</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-900 font-semibold font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>Certificado en Blockchain</span>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic text-2xl text-slate-800 opacity-90 select-none">
                  Mgtr. Edinson Pilozo
                </span>
              </div>
              <div className="w-40 h-px bg-slate-400 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-900 uppercase">{signer}</p>
              <p className="text-[11px] text-slate-600">Dirección General & Representante Legal</p>
            </div>
          </div>

          {/* Bottom Verification Strip */}
          <div className="relative mt-6 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono">
            <div>
              <span>REGISTRO: </span>
              <span className="text-emerald-900 font-semibold">{certificate.code}</span>
            </div>
            <div>
              <span>EMITIDO: {certificate.issueDate}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-800">
              <ExternalLink className="w-3 h-3" />
              <span>Validez en Polygon: id.zeyo.io</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
