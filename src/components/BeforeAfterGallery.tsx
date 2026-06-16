import { useState } from "react";
import { Smile, Sliders, Check, MessageSquare, Star } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  duration: string;
  specialist: string;
  beforeImg: string;
  afterImg: string;
  description: string;
  testimonial: {
    patientName: string;
    text: string;
    age: number;
    stars: number;
  };
}

const CLINICAL_CASES: CaseStudy[] = [
  {
    id: "case-ortodoncia",
    title: "Corrección de Apiñamiento Severo de Brackets",
    category: "Ortodoncia (Brackets)",
    duration: "14 Meses",
    specialist: "Dr. Carlos Mendoza",
    beforeImg: "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80&w=600",
    description: "Paciente de 24 años presentaba maloclusión Clase I con apiñamiento severo delantero. Se instalaron brackets metálicos con sistema slot 0.22, logrando una guía canina perfecta, balance masticatorio y ampliación estética del arco de la sonrisa.",
    testimonial: {
      patientName: "Karen Ramos Flores",
      age: 24,
      stars: 5,
      text: "¡No puedo creer el cambio! Tenía mucha vergüenza de sonreír en mi trabajo de ventas. El Dr. Carlos Mendoza tuvo una paciencia de oro y me explicó cada ajuste mensual de mis brackets. ¡Se los recomiendo a ojos cerrados!",
    },
  },
  {
    id: "case-blanqueamiento",
    title: "Blanqueamiento Ultrasónico y LED Express",
    category: "Estética Dental / Blanqueamiento",
    duration: "1 Sesión (1 Hora)",
    specialist: "Dra. Natalia Ruiz",
    beforeImg: "https://images.unsplash.com/photo-1581594549595-35e6edbe7e7c?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1579684389782-64d84b5e905d?auto=format&fit=crop&q=80&w=600",
    description: "Remoción profunda de pigmentos y manchas severas de café y cigarrillos en una sola cita. Se utilizó peróxido de hidrógeno al 35% activado por luz azul halógena fría LED, protegiendo las encías y mitigando cualquier rastro de sensibilidad dental posterior.",
    testimonial: {
      patientName: "Juan Carlos Loli",
      age: 38,
      stars: 5,
      text: "Excelente y veloz. En una hora mis dientes aclararon varios tonos. Lo mejor es que no me dolió nada y las encías quedaron perfectas gracias a las cremas protectoras que usó la doctora Natalia Ruiz.",
    },
  },
  {
    id: "case-carillas",
    title: "Diseño de Sonrisa Completo con Carillas de Resina",
    category: "Estética / Rehabilitación Oral",
    duration: "2 Sesiones",
    specialist: "Dr. Carlos Mendoza",
    beforeImg: "https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=600",
    afterImg: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600",
    description: "Transformación anatómica frontal del sector anterior (6 piezas superiores). Reconstrucción y aumento de dimensión vertical con carillas indirectas de composite de alta estratificación pulida, cerrando diastemas de nacimiento molestos.",
    testimonial: {
      patientName: "Sofía Martínez Salas",
      age: 31,
      stars: 5,
      text: "Siempre soñé con dientes parejitos y blancos. Me diseñaron la sonrisa antes de hacérmela para poder ver cómo quedaría. ¡El resultado superó mis expectativas de lejos! Les agradezco de corazón.",
    },
  },
];

export default function BeforeAfterGallery() {
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const activeCase = CLINICAL_CASES[activeCaseIdx];

  // Range Slider Value State (0 to 100 representing width of Left/Before image)
  const [sliderVal, setSliderVal] = useState(50);

  return (
    <div className="py-12 bg-slate-50/50 font-sans" id="before-after-gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">
            ✨ Sonrisas que Inspiran Confianza
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Galería Antes y Después Intermitente
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Utiliza la barra deslizable central de la foto para alternar entre el estado inicial de salud de los pacientes (Izquierda) y el espectacular resultado estético (Derecha).
          </p>

          {/* Cases Selector buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 max-w-2xl mx-auto shadow-sm">
            {CLINICAL_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCaseIdx(idx);
                  setSliderVal(50); // Reset slider
                }}
                className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCaseIdx === idx
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {c.category}
              </button>
            ))}
          </div>
        </div>

        {/* Core compare view workspace */}
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-10 items-center">
          
          {/* Left Column Dynamic Interactive Slider */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Interactive Compare container */}
            <div className="relative w-full max-w-lg aspect-video sm:h-[350px] rounded-3xl overflow-hidden shadow-xl border-4 border-white select-none bg-slate-100">
              
              {/* After Image: bottom layers (fully visible) */}
              <img
                src={activeCase.afterImg}
                alt="Resultado Final Después"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <span className="absolute bottom-4 right-4 bg-emerald-600/90 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl uppercase shadow-md select-none z-10 tracking-widest">
                Sonrisa después ✨
              </span>

              {/* Before Image: overlayed cropped mask from width */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderVal}%` }}
              >
                <img
                  src={activeCase.beforeImg}
                  alt="Estado Inicial Antes"
                  className="absolute inset-y-0 left-0 w-full h-full object-cover max-w-none shadow-inner"
                  style={{ width: "100%", height: "100%" }} // Fits perfectly
                />
                <span className="absolute bottom-4 left-4 bg-slate-900/70 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl uppercase shadow-md select-none tracking-widest z-10">
                  Antes del caso 🦷
                </span>
              </div>

              {/* Central Divider Bar Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderVal}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs select-none">
                  ↔
                </div>
              </div>

              {/* Range Slider Overlay covering the viewport container to control value from drag */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Desliza para ver la transformación antes y después"
              />
            </div>

            {/* Slider hint caption */}
            <p className="text-[10px] font-bold text-slate-400 mt-4 flex items-center">
              <Sliders className="h-3.5 w-3.5 mr-1 text-sky-500 animate-pulse" />
              Desliza el dedo o mouse sobre la foto para ver los detalles.
            </p>
          </div>

          {/* Right Column Clinical description & testimonial */}
          <div className="mt-10 lg:mt-0 lg:col-span-12 xl:col-span-5 space-y-6">
            
            {/* Case particulars card */}
            <div className="bg-white rounded-3xl p-6.5 border border-slate-100 shadow-sm">
              <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">Ficha Clínica e Historial</span>
              <h3 className="text-xl font-bold text-slate-800 leading-tight">
                {activeCase.title}
              </h3>
              
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-emerald-500" />
                  Duración: <strong className="text-slate-700 ml-1">{activeCase.duration}</strong>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-emerald-500" />
                  Tratante: <strong className="text-slate-700 ml-1">{activeCase.specialist}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                {activeCase.description}
              </p>
            </div>

            {/* Patient testimonial bubble */}
            <div className="bg-sky-50 rounded-3xl p-6.5 border border-sky-100 relative">
              <MessageSquare className="h-10 w-10 text-sky-200 absolute top-5 right-5 -z-1" />
              
              <div className="flex items-center mb-3">
                {[...Array(activeCase.testimonial.stars)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#FFA500] text-[#FFA500]" />
                ))}
              </div>

              <blockquote className="text-xs font-medium text-slate-700 italic leading-relaxed">
                "{activeCase.testimonial.text}"
              </blockquote>

              <div className="mt-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {activeCase.testimonial.patientName[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">{activeCase.testimonial.patientName}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Satisfecha / {activeCase.testimonial.age} años / Lima</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
