import React, { useState, useEffect } from "react";
import { Smile, Baby, Sparkles, Activity, ShieldAlert, Zap, Crown, MapPin, Phone, ArrowRight, ShieldCheck, Clock, Award, Star, ExternalLink, Calendar, Gift } from "lucide-react";
import { Sede, Promocion } from "../types";
import { SEDES_MOCK, PROMOCIONES_MOCK } from "../data";

interface LandingHomeProps {
  promociones: Promocion[];
  changeTab: (tab: string) => void;
  addAppointment: (cita: any) => any;
}

export default function LandingHome({ promociones, changeTab, addAppointment }: LandingHomeProps) {
  const [selectedSede, setSelectedSede] = useState<Sede>(SEDES_MOCK[0]);
  const [timeLeft, setTimeLeft] = useState({ horas: 8, minutos: 47, segundos: 12 });

  // Lead Form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSede, setLeadSede] = useState("sede-sjl-jardines");
  const [leadService, setLeadService] = useState("srv-limpieza");
  const [leadMsg, setLeadMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Countdown simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.segundos > 0) {
          return { ...prev, segundos: prev.segundos - 1 };
        } else if (prev.minutos > 0) {
          return { ...prev, minutos: prev.minutos - 1, segundos: 59 };
        } else if (prev.horas > 0) {
          return { horas: prev.horas - 1, minutos: 59, segundos: 59 };
        } else {
          return { horas: 12, minutos: 0, segundos: 0 }; // Loop back
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    // Log appointment or lead in local CRM
    const serviceName = leadService === "srv-limpieza" ? "Limpieza S/50" :
                        leadService === "srv-ortodoncia" ? "Brackets/Ortodoncia" :
                        leadService === "srv-odontopediatria" ? "Odontopediatría" :
                        leadService === "srv-blanqueamiento" ? "Blanqueamiento" : "Especialidades";
    
    addAppointment({
      patientName: leadName,
      patientPhone: leadPhone,
      patientDni: "N/A",
      sedeId: leadSede,
      serviceId: leadService,
      specialistId: "esp-1", // default Carlos
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      status: "pendiente",
      notes: `Lead Web: ${leadMsg || "Interesado en cita coordinada por recepción."}`,
      cost: leadService === "srv-limpieza" ? 50 : 0,
      promoApplied: leadService === "srv-limpieza" ? "promo-limpieza-50" : undefined,
    });

    setIsSuccess(true);

    // Create custom prefilled message URL for WhatsApp:
    const targetSedeInfo = SEDES_MOCK.find(s => s.id === leadSede);
    const textMsg = encodeURIComponent(
      `¡Hola Mundo Dental! Mi nombre es ${leadName}. Acabo de solicitar una consulta en el sitio web para la sede *${targetSedeInfo?.name}* para el servicio de *${serviceName}*. Mi número telefónico de contacto es ${leadPhone}. Deseo coordinar la hora tentativa del diagnóstico gratuito. ¡Muchas gracias!`
    );
    const whatsappUrl = `https://wa.me/51970165171?text=${textMsg}`;
    
    // Open in new window or redirect user
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      // Reset
      setLeadName("");
      setLeadPhone("");
      setLeadMsg("");
      setIsSuccess(false);
    }, 1500);
  };

  const servicesHighlights = [
    { id: "srv-ortodoncia", title: "Ortodoncia (Brackets)", icon: Smile, desc: "Alineación perfecta con brackets estéticos y metálicos.", color: "bg-blue-50 text-blue-600" },
    { id: "srv-odontopediatria", title: "Odontopediatría (niños)", icon: Baby, desc: "Tratamientos divertidos y amigables para proteger sonrisas infantiles.", color: "bg-teal-50 text-teal-600" },
    { id: "srv-blanqueamiento", title: "Blanqueamiento Dental", icon: Sparkles, desc: "Dientes blancos y radiantes en una sesión LED indolora.", color: "bg-emerald-50 text-emerald-600" },
    { id: "srv-implantes", title: "Implantes Dentales", icon: Zap, desc: "Reemplazo de dientes perdidos con materiales estables de titanio.", color: "bg-indigo-50 text-indigo-600" },
    { id: "srv-curaciones", title: "Emergencias Dentales", icon: ShieldAlert, desc: "Atención inmediata para dolor dental e infecciones activas.", color: "bg-rose-50 text-rose-600" },
    { id: "srv-estetica", title: "Estética Dental", icon: Crown, desc: "Carillas y diseño de sonrisa adaptados a tus facciones.", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="font-sans" id="landing-home-page">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white py-16 sm:py-24 border-b border-sky-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center rounded-full bg-sky-100 px-3.5 py-1 text-xs font-semibold text-sky-800 tracking-wider uppercase mb-5 animate-pulse">
                ⚕️ Odontología de Confianza
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-none">
                Nuestra Misión es <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-600 to-[#00B4D8] bg-clip-text text-transparent">
                  tu Sonrisa
                </span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Contamos con todas las especialidades dentales en nuestras 3 sedes de SJL y Miraflores. 
                Equipos modernos y precios accesibles con promociones excepcionales. 
                <span className="block font-bold text-sky-700 mt-2">¡Limpiezas Dentales completas desde S/50 soles!</span>
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
                <a
                  href="https://wa.me/51970165171?text=Hola%20Mundo%20Dental%2C%20deseo%20agendar%20una%20cita%20de%20evaluación%20gratuita."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-sm font-extrabold rounded-2xl text-white bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 transition-all transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Agenda tu Cita por WhatsApp
                </a>
                <button
                  onClick={() => changeTab("promociones")}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-200 text-sm font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all"
                >
                  Ver Promociones
                  <ArrowRight className="h-4 w-4 ml-2 text-sky-500" />
                </button>
              </div>

              {/* Minimalist Trust Badges */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center font-medium">
                  <ShieldCheck className="h-4 w-4 mr-1.5 text-sky-600" />
                  Especialistas Colegiados
                </div>
                <div className="flex items-center font-medium">
                  <Clock className="h-4 w-4 mr-1.5 text-sky-600" />
                  Atención de Emergencias
                </div>
                <div className="flex items-center font-medium">
                  <Award className="h-4 w-4 mr-1.5 text-sky-600" />
                  Materiales Certificados
                </div>
              </div>
            </div>

            {/* Right Images Carousel Mock Column */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Visual Decoration shapes */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-72 h-72 rounded-full bg-sky-200/40 blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-72 h-72 rounded-full bg-[#00B4D8]/20 blur-3xl -z-10"></div>

                <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform">
                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800"
                    alt="Sonrisa de paciente feliz en sillón dental"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-sky-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        <span className="w-8 h-8 rounded-full bg-[#40E0D0] text-white text-[9px] font-bold flex items-center justify-center border border-white">M</span>
                        <span className="w-8 h-8 rounded-full bg-sky-600 text-white text-[9px] font-bold flex items-center justify-center border border-white">S</span>
                        <span className="w-8 h-8 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">L</span>
                      </div>
                      <div>
                        <div className="flex items-center text-amber-500 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                          ))}
                          <span className="ml-1 text-[11px] font-bold text-slate-700">4.9/5 de confianza</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">¡Más de 5,000 sonrisas transformadas en Lima!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICIOS DESTACADOS DE MUNDO DENTAL (Iconos) */}
      <section className="py-16 sm:py-24 bg-white" id="servicios-highlights-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
              Nuestros Servicios Especializados
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Ofrecemos soluciones integrales bajo estrictos protocolos de bioseguridad para garantizar el bienestar de toda tu familia.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesHighlights.map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => changeTab("servicios")}
                  className="group relative cursor-pointer bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:border-sky-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3.5 rounded-2xl ${s.color} transition-colors group-hover:scale-105`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Mundo Dental Sede SJL & Miraflores</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-4">
                    {s.desc}
                  </p>
                  <span className="text-[10px] font-bold text-sky-600 group-hover:underline mt-4 block inline-flex items-center">
                    Ver más información <ArrowRight className="h-3 w-3 ml-1" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. PROMOCIONES DE MUNDO DENTAL (DESTACADOS DEL BRIEF) */}
      <section className="py-16 bg-[#0077B6] text-white relative overflow-hidden" id="promociones-home-section">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B4D8]/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Promo descriptions */}
            <div className="lg:col-span-5">
              <span className="inline-flex items-center rounded-md bg-[#FFA500] text-slate-950 px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                🔥 ¡Pocas Horas! Ofertas Sincronizadas
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
                Promociones Increíbles de esta Semana
              </h2>
              <p className="mt-4 text-sky-100 text-sm leading-relaxed">
                Nuestra premisa es la salud dental accesible para todos los presupuestos. Aprovecha estos cupones especiales y asiste con tus familiares cercanos hoy mismo.
              </p>

              {/* Clock widget countdown */}
              <div className="mt-8 bg-sky-950/40 p-5 rounded-3xl border border-sky-400/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-sky-300">Reserva antes de:</h4>
                  <p className="text-[11px] text-sky-100 mt-1">Sedes: SJL y Miraflores</p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-center min-w-[50px]">
                    <span className="block text-lg font-black text-[#FFA500]">{String(timeLeft.horas).padStart(2, "0")}</span>
                    <span className="text-[8px] text-slate-400 uppercase font-medium">Horas</span>
                  </div>
                  <span className="text-xl text-sky-300 self-center font-bold animate-pulse">:</span>
                  <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-center min-w-[50px]">
                    <span className="block text-lg font-black text-[#FFA500]">{String(timeLeft.minutos).padStart(2, "0")}</span>
                    <span className="text-[8px] text-slate-400 uppercase font-medium">Min</span>
                  </div>
                  <span className="text-xl text-sky-300 self-center font-bold animate-pulse">:</span>
                  <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-center min-w-[50px]">
                    <span className="block text-lg font-black text-[#FFA500]">{String(timeLeft.segundos).padStart(2, "0")}</span>
                    <span className="text-[8px] text-slate-400 uppercase font-medium">Seg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of 4 promotions cards */}
            <div className="mt-12 lg:mt-0 lg:col-span-7 grid gap-4 grid-cols-1 sm:grid-cols-2">
              {promociones.map((p) => {
                const discount = p.oldPrice > 0 ? Math.round(((p.oldPrice - p.newPrice) / p.oldPrice) * 100) : 0;
                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl p-5 text-slate-800 shadow-xl border border-slate-100 relative overflow-hidden flex flex-col justify-between group transform hover:-translate-y-0.5 transition-transform"
                  >
                    {/* Badge */}
                    {discount > 0 && (
                      <span className="absolute top-0 right-0 bg-[#FFA500] text-slate-950 font-black text-[9px] px-3.5 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                        -{discount}% Dcto
                      </span>
                    )}

                    <div>
                      <h3 className="text-md font-extrabold text-[#0077B6] leading-tight pr-14 group-hover:text-sky-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between">
                      <div>
                        {p.oldPrice > 0 ? (
                          <span className="text-[10px] text-slate-400 line-through font-semibold">
                            S/ {p.oldPrice}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold">Costo Regular</span>
                        )}
                        <p className="text-xl font-black text-slate-800">
                          {p.newPrice === 0 ? "¡GRATIS!" : `S/ ${p.newPrice}`}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="block text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md mb-1.5 inline-block">
                          Cupos: {p.cuposDisponibles}/{p.totalCupos} libres
                        </span>
                        <button
                          onClick={() => changeTab("promociones")}
                          className="text-[10px] font-bold bg-[#0077B6] text-white hover:bg-[#00B4D8] px-3.5 py-1.5 rounded-xl transition-colors flex items-center"
                        >
                          Reclamar Cupón
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. NUESTRAS 3 SEDES (CON MAPAS INTERACTIVOS Y SELECCIÓN) */}
      <section className="py-16 bg-slate-50" id="sedes-interactive-home-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Visítanos en Nuestras 3 Sedes
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Ubicaciones estratégicas de fácil acceso en San Juan de Lurigancho y Miraflores para brindarte comodidad y la atención inmediata que buscas.
            </p>

            {/* Sede tabs selectors */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {SEDES_MOCK.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSede(s)}
                  className={`px-4.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                    selectedSede.id === s.id
                      ? "bg-sky-600 text-white shadow-md shadow-sky-200 border-transparent"
                      : "bg-white text-slate-600 hover:text-sky-600 hover:bg-slate-50 border border-slate-100"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sede detailed display */}
          <div className="mt-12 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column Map Frame */}
            <div className="lg:col-span-7 h-[350px] lg:h-auto min-h-[350px] relative bg-slate-100 border-r border-slate-100">
              <iframe
                title={`Mapa interactivo de ${selectedSede.name}`}
                src={selectedSede.mapEmbedUrl}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Right details content */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-white">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-2">
                  📍 Ubicación Detallada {selectedSede.distrito}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-800 leading-tight">
                  {selectedSede.name}
                </h3>
                <p className="mt-4 text-xs font-semibold text-slate-500 leading-normal">
                  {selectedSede.description}
                </p>

                {/* Listing exact location */}
                <div className="mt-6 space-y-3.5">
                  <div className="flex items-start text-xs text-slate-700">
                    <MapPin className="h-4 w-4 mr-2.5 text-sky-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">{selectedSede.address}</p>
                      <p className="text-slate-400 text-[11px]">{selectedSede.distrito}, Lima - Perú</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-700">
                    <Phone className="h-4 w-4 mr-2.5 text-[#0077B6] flex-shrink-0" />
                    <div>
                      <p className="font-bold">Contacto: {selectedSede.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-700">
                    <Clock className="h-4 w-4 mr-2.5 text-emerald-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Lunes a Sábado: 9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Specialists assigned */}
                <div className="mt-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Especialistas en sede:</p>
                  <div className="flex space-x-2">
                    {selectedSede.specialists.map((esp) => (
                      <div key={esp.id} className="flex items-center space-x-2 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                        <img src={esp.photo} alt={esp.name} className="w-6 h-6 rounded-full object-cover border border-sky-100" />
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-800 leading-none">{esp.name}</p>
                          <p className="text-[8px] text-slate-400 font-semibold">{esp.specialty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                <a
                  href={selectedSede.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center bg-slate-800 text-white font-extrabold text-xs px-5 py-3 rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-2" />
                  Cómo Llegar (Google Maps)
                </a>
                <button
                  onClick={() => changeTab("sedes")}
                  className="bg-sky-50 text-sky-700 font-bold text-xs px-5 py-3 rounded-xl hover:bg-sky-100 border border-sky-100 transition-colors flex items-center justify-center"
                >
                  Ver Horarios e Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN CAMPAÑAS ODONTOLÓGICAS ESPECIALES */}
      <section className="py-16 sm:py-24 bg-white" id="campanas-home-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-600 via-[#0077B6] to-[#00B4D8] rounded-[40px] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl shadow-sky-100">
            {/* Shapes */}
            <div className="absolute top-0 right-0 w-80 h-96 bg-white/10 rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-80 h-96 bg-slate-950/15 rounded-full blur-2xl -z-10"></div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center rounded-full bg-white/20 text-[#FFA500] px-3.5 py-1 text-xs font-bold uppercase tracking-widest mb-4">
                  📢 Gran Campaña Comunitaria de Salud Dental
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Campaña Nacional de Consultas Gratuitas 🦷✨
                </h2>
                <p className="mt-4 text-sky-50 text-sm sm:text-base leading-relaxed max-w-xl">
                  Próximas Fechas oficiales: <strong className="text-white">Sábado 20 y Domingo 21 de Junio, 2026</strong>. Todo el equipo de cirujanos dentistas estará a tu disposición para diagnósticos integrales totalmente sin costo en las 3 sedes simultáneamente.
                </p>

                {/* Gifts listing */}
                <div className="mt-8 space-y-3">
                  <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center">
                    <Gift className="h-4.5 w-4.5 mr-2 text-[#FFA500]" />
                    Kit de Obsequios del Evento:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-sky-100">
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2"></span>
                      Cepillos clínicos Colgate Ortodónticos
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2"></span>
                      Cámaras intraorales con fotos impresas
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2"></span>
                      Descuento adicional en Ortodoncia activa
                    </li>
                    <li className="flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-2"></span>
                      Guías lúdicas de cepillado infantil
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right claim CTA block */}
              <div className="mt-10 lg:mt-0 lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-center">
                <Calendar className="h-10 w-10 text-[#FFA500] mx-auto mb-3" />
                <h4 className="text-md font-bold">Reserva tu Turno Preferencial</h4>
                <p className="text-[11px] text-sky-100 mt-1 max-w-xs mx-auto">
                  Evita colas y asegura tu kit de higiene reservando tu hora preferencial de evaluación hoy.
                </p>
                <a
                  href="https://wa.me/51970165171?text=Hola%20Mundo%20Dental%2C%20deseo%20registrarme%20para%20los%20diagnósticos%20gratuitos%20de%20la%20campaña."
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 w-full text-center bg-[#FFA500] text-slate-950 font-black text-xs py-3 rounded-2xl block hover:bg-yellow-400 hover:shadow-lg transition-all"
                >
                  Registrarse Gratis por WhatsApp
                </a>
                <p className="text-[9px] text-sky-200 mt-2.5">Cupos preferenciales limitados a 150 pacientes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALERÍA ANTES-DESPUÉS SNEAK PEEK */}
      <section className="py-16 sm:py-24 bg-slate-50" id="before-after-teaser-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Left description */}
            <div className="lg:col-span-5">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">
                🔬 Evidencia Clínica Real
              </span>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Casos Reales y Transformaciones Exitosas
              </h2>
              <p className="mt-4 text-xs text-slate-500 leading-relaxed font-semibold">
                Nuestra mayor alegría es devolverle la alegría de sonreír a nuestros pacientes en Lima. Explora nuestras transformaciones espectaculares de Ortodoncia correctiva avanzada, carillas estéticas de resina y blanqueamientos profundos guiados.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => changeTab("galeria")}
                  className="inline-flex items-center bg-sky-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl hover:bg-sky-700 transition-all shadow-md active:scale-95"
                >
                  Probar Slider Interactivo de Cambios
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>

            {/* Right slider teaser preview card */}
            <div className="mt-12 lg:mt-0 lg:col-span-7">
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative h-[250px] sm:h-[300px] w-full rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {/* Split images preview */}
                    <div className="w-1/2 overflow-hidden relative border-r-2 border-white">
                      <img
                        src="https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&q=80&w=400"
                        alt="Dientes antes"
                        className="absolute h-full w-auto max-w-none object-cover left-0"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-sm text-white font-bold text-[9px] px-2 py-0.5 rounded-md">ANTES</span>
                    </div>
                    <div className="w-1/2 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=400"
                        alt="Dientes después"
                        className="absolute h-full w-auto max-w-none object-cover right-0"
                      />
                      <span className="absolute bottom-2 right-2 bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md">DESPUÉS</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-slate-700">Caso #0412: Ortodoncia Metálica Completa (Roth 0.22) - 14 Meses de Tratamiento</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS CLAVE: ¿POR QUÉ ELEGIRNOS? */}
      <section className="py-16 sm:py-24 bg-white" id="why-choose-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
              ¿Por Qué Mundo Dental es tu Mejor Elección?
            </h2>
            <p className="mt-3 text-base text-slate-500">
              Cientos de familias limeñas nos eligen mes a mes por nuestra calidad médica, ética profesional y calidez.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "3 Sedes Estratégicas", desc: "Ubicados en San Juan de Lurigancho (Jardines & Próceres) y Miraflores, accesibles y confortables.", icon: Smile },
              { title: "Especialidades Completas", desc: "Bajo un mismo techo resolvemos Ortodoncia, Odontopediatría, Endodoncias, Implantología y Estética Especial.", icon: Crown },
              { title: "Precios de Confianza", desc: "Sin mentiras ni sorpresas. Consultas gratuitas de evaluación y limpiezas ultra profundas desde S/50 soles.", icon: ShieldCheck },
              { title: "Promociones Constantes", desc: "Cuponeras escolares 2x100, campañas preventivas familiares frecuentes con kits Colgate de regalo.", icon: Award },
              { title: "Cálida Atención Familiar", desc: "Nuestros odontopediatras dominan dinámicas divertidas para que tus niños se sientan tranquilos y amados.", icon: Baby },
              { title: "Materiales Quirúrgicos Top", desc: "Resinas fotocurables de última generación, brackets Roth certificados y bioseguridad del 100%.", icon: Activity },
            ].map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-sky-100 transition-colors">
                  <div className="bg-sky-100 text-sky-700 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FORMULARIO DE CONTACTO RÁPIDO & LEAD GENERATOR */}
      <section className="py-16 bg-slate-50 border-t border-slate-100" id="quick-leads-form-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-[32px] p-8 shadow-md border border-slate-100">
            <div className="text-center mb-6">
              <Smile className="h-8 w-8 text-[#0077B6] mx-auto mb-2" />
              <h3 className="text-2xl font-extrabold text-slate-800">
                Pide tu Diagnóstico Gratuito
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completa tus datos y te derivaremos al WhatsApp de la sede con un cupón pre-reservado.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-100 text-center animate-fade-in animate-pulse">
                <Smile className="h-10 w-10 mx-auto text-emerald-500 mb-2" />
                <h4 className="font-bold">¡Solicitud recibida con éxito!</h4>
                <p className="text-xs mt-1">Estamos abriendo tu chat personalizado de WhatsApp para asignarte fecha...</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Nombre Completo:</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ej. María Flores Quispe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">WhatsApp / Teléfono:</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="Ej. +51 987 654 321"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Sede de Preferencia:</label>
                    <select
                      value={leadSede}
                      onChange={(e) => setLeadSede(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="sede-sjl-jardines">SJL - Jardines Este 524</option>
                      <option value="sede-sjl-proceres">SJL - Próceres 2257</option>
                      <option value="sede-miraflores">Miraflores - Petit Thouars 4350</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Servicio que Necesita:</label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-sky-500"
                    >
                      <option value="srv-limpieza">Limpieza Dental S/50</option>
                      <option value="srv-ortodoncia">Ortodoncia (Brackets)</option>
                      <option value="srv-odontopediatria">Odontopediatría (niños)</option>
                      <option value="srv-blanqueamiento">Blanqueamiento Dental</option>
                      <option value="srv-implantes">Implantes Dentales</option>
                      <option value="srv-curaciones">Curaciones / Emergencias</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Mensaje o Dolor / Consulta (opcional):</label>
                  <textarea
                    rows={2}
                    value={leadMsg}
                    onChange={(e) => setLeadMsg(e.target.value)}
                    placeholder="Cuéntanos brevemente qué deseas consultar o si presentas dolor activo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-slate-400"
                  ></textarea>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 bg-sky-600 text-white hover:bg-sky-700 rounded-2xl font-bold text-xs shadow-lg shadow-sky-100 transition-all inline-flex items-center justify-center cursor-pointer"
                  >
                    Agendar Evaluación de Regalo en WhatsApp
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                  <p className="text-[10px] text-slate-400 font-medium mt-2">
                    *Al enviar, se abrirá WhatsApp con el mensaje configurado. ¡Es simple!
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
