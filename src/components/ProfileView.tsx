import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  User, Shield, Lock, CheckCircle2, Upload, Eye, EyeOff, 
  MapPin, Phone, Mail, Award, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToCertificates: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigateToCertificates,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });
    setSaveSuccess('¡Datos personales actualizados correctamente para tus diplomas!');
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Por favor introduce tu contraseña actual.');
      return;
    }
    if (newPassword !== repeatPassword) {
      alert('La nueva contraseña y la confirmación no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSaveSuccess('¡Contraseña actualizada con éxito en el aula virtual!');
    setCurrentPassword('');
    setNewPassword('');
    setRepeatPassword('');
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const checklistItems = [
    { label: 'Foto para el diploma', sub: 'Lista para el certificado', checked: !!formData.photoUrl },
    { label: 'Primer nombre', sub: 'Tal como debe imprimirse', checked: !!formData.firstName },
    { label: 'Primer apellido', sub: 'Tal como debe imprimirse', checked: !!formData.firstLastName },
    { label: 'Tipo de documento', sub: 'DNI, cédula, pasaporte...', checked: !!formData.docType },
    { label: 'Número de documento', sub: 'Sin errores de tipeo', checked: !!formData.docNumber },
  ];

  const readyCount = checklistItems.filter(item => item.checked).length;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Hero matching image_f29cb282.png */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-950 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center border-2 border-emerald-500/40">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Perfil de Alumno"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-2xl font-bold text-emerald-400">
                    {formData.firstName[0]}{formData.firstLastName[0]}
                  </span>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-slate-950">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              PERFIL DEL ESTUDIANTE · SERTECEP
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-1">
              {formData.firstName} {formData.secondName} {formData.firstLastName} {formData.secondLastName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {formData.email}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {formData.city}, {formData.province} - {formData.country}
              </span>
              <span>·</span>
              <span className="text-emerald-400">Racha: {formData.streakDays} días activos</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateToCertificates}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <Award className="w-4 h-4" />
          Ver mis certificados
        </button>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Checklist Card matching screenshot */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              LISTO PARA CERTIFICADO
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Tu perfil está completo</h3>
            <p className="text-xs text-slate-400">Ya puedes descargar tus certificados con tu nombre, documento y foto oficial.</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
            {readyCount} de 5 listos
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(readyCount / 5) * 100}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{item.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Data for Certificate on Left, Password Change on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Datos para certificado (8 cols) */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Datos para certificado</h3>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Estos datos se imprimen en el diploma. Revisa bien tu nombre, documento y foto antes de guardar.
            </p>
          </div>

          {/* Photo Selector */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap sm:flex-nowrap items-center gap-5">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/40 overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Foto Alumno"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-slate-600" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Foto para el diploma oficial
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Elige una foto de frente con fondo claro o neutro para garantizar la nitidez en el PDF del certificado. Formato JPG, PNG o WEBP.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-lg transition inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Elegir foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Names section */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">1</span>
              Nombre del alumno (tal como saldrá impreso)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Primer Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  name="secondName"
                  value={formData.secondName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Primer Apellido
                </label>
                <input
                  type="text"
                  name="firstLastName"
                  value={formData.firstLastName}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  name="secondLastName"
                  value={formData.secondLastName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 uppercase font-mono font-medium"
                />
              </div>
            </div>
          </div>

          {/* Contact and Document section */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold">2</span>
              Contacto y Documento de Identificación
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nro. de WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+593 98 901 2515"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  País
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Ecuador">Ecuador (Sede Sertecep)</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Perú">Perú</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Otro">Otro país</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Tipo de Documento
                </label>
                <select
                  name="docType"
                  value={formData.docType}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cédula">Cédula de Identidad (Ecuador)</option>
                  <option value="Pasaporte">Pasaporte Internacional</option>
                  <option value="DNI">DNI</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nro. de Documento
                </label>
                <input
                  type="text"
                  name="docNumber"
                  value={formData.docNumber}
                  onChange={handleChange}
                  required
                  placeholder="2100404355"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Actualizar datos para certificado
            </button>
          </div>
        </form>

        {/* Right Form: Cambiar contraseña (4 cols) matching screenshot */}
        <form onSubmit={handleSavePassword} className="lg:col-span-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Cambiar contraseña</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Primero escribe la contraseña con la que entras al aula. Luego escribe la nueva dos veces. El ojito te deja ver lo que escribiste.
            </p>

            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Contraseña actual del aula
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Repite la nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showRepeatPass ? 'text' : 'password'}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPass(!showRepeatPass)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showRepeatPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition"
            >
              Actualizar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
