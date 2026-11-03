import React, { useState } from 'react';
import { X, Send, ExternalLink } from 'lucide-react';
import { SUPPORT_WHATSAPP_CLEAN, OFFICIAL_SERTECEP_LOGO } from '../data/mockData';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  // The exact 4 questions requested by user from image_8434def6.png
  const quickQuestions = [
    {
      icon: '🎁',
      text: '¡Hola! ¿Qué promociones y descuentos tienen disponibles?',
    },
    {
      icon: '🎓',
      text: '¿Qué cursos ofrecen y cuáles son sus beneficios?',
    },
    {
      icon: '💰',
      text: '¿Cuánto cuesta matricularme y qué facilidades de pago tienen?',
    },
    {
      icon: '🚀',
      text: '¡Quiero inscribirme! ¿Cómo puedo reservar mi cupo?',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || userMsg || '¡Hola! Deseo más información sobre los cursos de Academia Sertecep Amazónico.').trim();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${SUPPORT_WHATSAPP_CLEAN}?text=${encoded}`, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 select-none max-w-[calc(100vw-1.5rem)]">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-2 sm:mb-3 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 bg-[#0c1322] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden animate-fade-in text-slate-100 backdrop-blur-xl">
          {/* Header styled with authentic WhatsApp Dark aesthetic */}
          <div className="bg-[#0b141b] border-b border-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-950 border border-emerald-500/40 p-1 flex items-center justify-center shadow overflow-hidden">
                  <img
                    src={OFFICIAL_SERTECEP_LOGO}
                    alt="Logo Sertecep Amazónico"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Live Online Badge */}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#0b141b]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                  <span>Academia Sertecep Amazónico</span>
                </h4>
                <p className="text-[11px] text-[#25D366] font-medium flex items-center gap-1">
                  <span>En línea</span>
                  <span className="text-slate-400">· Respuesta inmediata</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition p-1.5 rounded-full hover:bg-slate-800"
              aria-label="Cerrar ventana de WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3.5 bg-slate-950/80 max-h-[75vh] overflow-y-auto">
            {/* Institution Greeting Bubble */}
            <div className="p-3 bg-[#111b21] rounded-2xl border border-slate-800/90 text-xs text-slate-200 leading-relaxed shadow-sm">
              <p className="font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                <span>👋 ¡Hola! Te atiende el equipo oficial</span>
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Selecciona una consulta rápida o escribe tu mensaje para ser redirigido directamente a nuestro WhatsApp oficial:
              </p>
            </div>

            {/* Quick Questions matching image_8434def6.png */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-xs">🚀</span>
                <span className="text-[10px] font-black tracking-wider text-slate-300 uppercase font-mono">
                  CONSULTAS RÁPIDAS CON UN CLIC
                </span>
              </div>

              <div className="space-y-1.5">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className="w-full text-left p-3 rounded-xl bg-[#111b21] hover:bg-[#1a2730] border border-slate-800/90 hover:border-[#25D366]/50 text-xs text-slate-200 transition-all duration-200 flex items-center justify-between group shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 pr-2">
                      <span className="text-sm shrink-0">{q.icon}</span>
                      <span className="text-[11px] sm:text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition-colors leading-snug">
                        {q.text.replace(q.icon, '').trim()}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#25D366] shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder="Escribe tu consulta o requerimiento..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-[#111b21] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#25D366] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-slate-950 font-bold rounded-xl transition shadow-lg flex items-center gap-1.5 text-xs cursor-pointer"
                  title="Enviar a WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center font-mono pt-1">
              ⚡ Al enviar se abrirá directamente tu chat de WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Floating Elegant WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat de WhatsApp"
        className="group relative flex items-center gap-1.5 sm:gap-2.5 px-3 py-2 sm:px-5 sm:py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.4)] sm:shadow-[0_10px_35px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Pulsing ring aura */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-25 animate-ping pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-950 text-[#25D366] flex items-center justify-center shrink-0 shadow">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2C6.495 2 2 6.495 2 12.031c0 1.97.57 3.805 1.558 5.356L2 22l4.747-1.523c1.488.92 3.23 1.454 5.284 1.454 5.536 0 10.031-4.495 10.031-10.031S17.567 2 12.031 2zm0 18.232c-1.848 0-3.418-.518-4.748-1.428l-.34-.23-2.82.905.92-2.748-.222-.354c-.988-1.57-1.512-3.233-1.512-5.176 0-4.57 3.717-8.287 8.287-8.287 4.57 0 8.287 3.717 8.287 8.287 0 4.57-3.717 8.287-8.287 8.287zm4.537-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.395-.125-.56.125-.166.25-.644.81-.789.977-.145.166-.29.187-.54.062-.25-.125-1.053-.388-2.006-1.238-.742-.662-1.243-1.48-1.388-1.73-.146-.25-.016-.385.11-.51.112-.112.25-.29.374-.436.125-.145.166-.25.25-.415.083-.166.042-.312-.02-.436-.063-.125-.56-1.35-.769-1.85-.203-.487-.41-.42-.56-.428l-.478-.008c-.166 0-.436.062-.664.312-.228.25-.872.852-.872 2.078 0 1.226.893 2.41 1.018 2.577.125.166 1.756 2.682 4.254 3.762.595.257 1.06.41 1.422.525.597.19 1.14.163 1.57.099.478-.071 1.472-.602 1.68-1.183.208-.581.208-1.08.145-1.183-.062-.104-.228-.166-.477-.291z" />
          </svg>
        </div>

        {/* Elegant typography without displaying raw phone number */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] sm:text-sm font-black text-slate-950 tracking-tight">
            WhatsApp
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-950/20 text-slate-900 border border-slate-950/20 font-mono hidden sm:inline-block">
            En línea
          </span>
        </div>
      </button>
    </div>
  );
};
