import React, { useState } from "react";
import { SEDES_MOCK } from "../data";
import { MapPin, Phone, Clock, Mail, CheckCircle, ExternalLink, Sparkles, Smile } from "lucide-react";

export default function SedesExplorer() {
  const [activeSedeIdx, setActiveSedeIdx] = useState(0);
  const activeSede = SEDES_MOCK[activeSedeIdx];

  // Sede Quiz state
  const [quizDistrito, setQuizDistrito] = useState("");
  const [quizResult, setQuizResult] = useState<typeof SEDES_MOCK[0] | null>(null);

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizDistrito) return;

    if (quizDistrito === "sjl-jardines") {
      setQuizResult(SEDES_MOCK[0]);
    } else if (quizDistrito === "sjl-proceres") {
      setQuizResult(SEDES_MOCK[1]);
    } else {
      setQuizResult(SEDES_MOCK[2]);
    }
  };

  return (
    <div className="py-12 bg-slate-50/5 font-sans" id="sedes-explorer-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            📍 Clínicas Equipadas y Cómodas en Lima
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Nuestras Clínicas Dentales
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Encuentra la sucursal de Mundo Dental ideal para ti. Ofrecemos la máxima bioseguridad y acceso vial con zonas de estacionamiento libre.
          </p>
        </div>

        {/* Master Selector Layout */}
        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          
          {/* Left Column list */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Selecciona una Sede:</p>
            {SEDES_MOCK.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveSedeIdx(idx);
                  setQuizResult(null); // Clear quiz result if user clicks on tabs
                }}
                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start space-x-3.5 cursor-pointer ${
                  activeSedeIdx === idx && !quizResult
                    ? "bg-white border-sky-400 shadow-md shadow-sky-50"
                    : "bg-white border-slate-100 hover:border-slate-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl flex items-center justify-center ${activeSedeIdx === idx && !quizResult ? 'bg-sky-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{s.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{s.address}</p>
                  <p className="text-[10px] font-bold text-sky-600 uppercase mt-1.5">{s.distrito}</p>
                </div>
              </button>
            ))}

            {/* Little Quick Quiz finder inside left column */}
            <div className="bg-gradient-to-br from-indigo-900 to-[#0077B6] rounded-2xl p-5 text-white shadow-md shadow-sky-50">
              <Sparkles className="h-5 w-5 text-yellow-300 mb-2" />
              <h4 className="text-sm font-extrabold text-[#FFA500]">¿Qué Sede te queda más cerca?</h4>
              <p className="text-[11px] text-sky-100 mt-1 font-medium leading-relaxed">
                Resuelve este test rápido para encontrar la sede óptima según tu distrito residencial habitual en Lima.
              </p>
              
              <form onSubmit={handleQuizSubmit} className="mt-4 space-y-2.5">
                <select
                  value={quizDistrito}
                  required
                  onChange={(e) => setQuizDistrito(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-sky-200 text-xs rounded-xl px-3 py-2.5 outline-none"
                >
                  <option className="text-slate-800" value="">¿Dónde te ubicas?</option>
                  <option className="text-slate-800" value="sjl-jardines">SJL (Cerca a Zárate, Mangomarca, Las Flores)</option>
                  <option className="text-slate-800" value="sjl-proceres">SJL (Cerca a Huáscar, Canto Grande, Motupe)</option>
                  <option className="text-slate-800" value="miraflores">Miraflores, San Isidro, Surco, San Borja</option>
                </select>

                <button
                  type="submit"
                  className="w-full text-center bg-[#FFA500] hover:bg-yellow-400 text-slate-950 font-black text-[10px] uppercase py-2 rounded-xl transition-all shadow-sm"
                >
                  Descubrir Sede Óptima
                </button>
              </form>
            </div>
          </div>

          {/* Right Column details */}
          <div className="mt-8 lg:mt-0 lg:col-span-8">
            {/* Show search results if any */}
            {(quizResult || activeSede) && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" id="sede-selected-details-container">
                {quizResult && (
                  <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-pulse">
                    <span>💡 ¡Recomendación personalizada para ti! Sede recomendada:</span>
                    <button onClick={() => setQuizResult(null)} className="underline hover:text-emerald-950">Ver seleccionada</button>
                  </div>
                )}

                {/* Sede image container and address */}
                <div className="relative h-[220px] bg-slate-900">
                  <img
                    src={quizResult ? quizResult.image : activeSede.image}
                    alt={quizResult ? quizResult.name : activeSede.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2.5 py-1 rounded-md uppercase border border-sky-500/20 mr-2">
                      {(quizResult ? quizResult : activeSede).distrito}
                    </span>
                    <h2 className="text-2xl font-black mt-2 leading-none">{(quizResult ? quizResult : activeSede).name}</h2>
                  </div>
                </div>

                {/* Specific coordinates details block */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Overview points */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-sky-600 mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dirección:</p>
                        <p className="text-xs text-slate-700 font-bold mt-1">{(quizResult ? quizResult : activeSede).address}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-[#0077B6] mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Teléfono Directo:</p>
                        <p className="text-xs text-slate-700 font-bold mt-1">{(quizResult ? quizResult : activeSede).phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-emerald-500 mr-2.5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Horarios de Atención:</p>
                        <p className="text-xs text-slate-700 font-bold mt-1">Lunes a Sábado:</p>
                        <p className="text-[11px] text-slate-500 font-semibold">9:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Iframe Map */}
                  <div className="border border-slate-100 rounded-2xl h-[280px] overflow-hidden bg-slate-50 relative">
                    <iframe
                      title={`Mapa particular ${(quizResult ? quizResult : activeSede).name}`}
                      src={(quizResult ? quizResult : activeSede).mapEmbedUrl}
                      className="absolute inset-0 w-full h-full border-0"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  {/* Assigned Specialists */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                      🦷 Cirujanos Dentistas Asignados a la Sede:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(quizResult ? quizResult : activeSede).specialists.map((esp) => (
                        <div key={esp.id} className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
                          <img src={esp.photo} alt={esp.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-tight">{esp.name}</p>
                            <p className="text-[10px] font-semibold text-sky-600 mt-0.5">{esp.specialty}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5">{esp.cop} / Colegiado Activo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3 items-center">
                    <a
                      href={(quizResult ? quizResult : activeSede).googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Cómo Llegar en Waze/Google Maps
                    </a>
                    
                    <a
                      href={`https://wa.me/51970165171?text=Hola%20Mundo%20Dental%2C%20deseo%20agendar%20mi%20cita%20con%20diagnóstico%20gratuito%20en%20la%20sede%20*${encodeURIComponent((quizResult ? quizResult : activeSede).name)}*.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto text-center bg-sky-600 text-white font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-sky-700 shadow-md shadow-sky-50 transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      Escribir a Sede vía WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
