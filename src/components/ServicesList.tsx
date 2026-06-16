import { Search, Smile, HelpCircle, Phone, ArrowUpRight } from "lucide-react";
import { SERVICIOS_MOCK } from "../data";
import { useState } from "react";

export default function ServicesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todo");

  const filteredServices = SERVICIOS_MOCK.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.fullDesc.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "todo") return matchesSearch;
    if (selectedCategory === "estetica" && (s.id.includes("blanqueamiento") || s.id.includes("estetica") || s.id.includes("ortodoncia"))) {
      return matchesSearch;
    }
    if (selectedCategory === "ninos" && s.id.includes("odontopediatria")) {
      return matchesSearch;
    }
    if (selectedCategory === "cirugia" && s.id.includes("implantes")) {
      return matchesSearch;
    }
    if (selectedCategory === "general" && (s.id.includes("limpieza") || s.id.includes("curaciones") || s.id.includes("endodoncia"))) {
      return matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="py-12 bg-slate-50/50 font-sans" id="services-page-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            🦷 Todas las especialidades en un solo lugar
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Nuestros Tratamientos Odontológicos
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Mundo Dental reúne a profesionales calificados en cada rama clínica. Brindamos diagnósticos con cámaras intraorales y planes financiados a tu alcance.
          </p>
        </div>

        {/* Filter controls */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar especialidad (brackets, profilaxis...)"
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Categorias Tabs */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: "todo", label: "Todos" },
              { id: "general", label: "Odontología General / Limpieza" },
              { id: "estetica", label: "Estética y Brackets" },
              { id: "ninos", label: "Odontopediatría" },
              { id: "cirugia", label: "Implantes" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-sky-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:text-sky-600 hover:bg-sky-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid list */}
        <div className="mt-8 grid grid-cols-1 gap-8" id="services-grid-rendering">
          {filteredServices.length > 0 ? (
            filteredServices.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hover:border-sky-100 transition-colors"
                id={`service-card-${s.id}`}
              >
                {/* Left col: Title and full description */}
                <div className="lg:col-span-7">
                  <div className="flex items-center space-x-3.5 mb-4">
                    <div className="bg-sky-50 text-[#0077B6] p-2.5 rounded-xl">
                      <Smile className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-800">{s.title}</h2>
                      <p className="text-[10px] text-[#00B4D8] font-bold uppercase tracking-wider">{s.duration} aprox.</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {s.fullDesc}
                  </p>

                  {/* Bullet points checklist */}
                  <div className="mt-6">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1.5 text-sky-500" />
                      ¿Qué incluye el tratamiento?
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                      {s.detailedPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2.5 mt-1.5 flex-shrink-0"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right col: Price point and WhatsApp triggers */}
                <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6.5 text-center flex flex-col justify-between h-full border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Valor del Tratamiento</span>
                    <p className="text-xs font-bold text-slate-500">Mundo Dental Promocional:</p>
                    <p className="text-xl font-black text-slate-800 mt-1 md:text-2xl">{s.priceText}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Financiamiento disponible en ortodoncias y cirugías.</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200/60">
                    <a
                      href={`https://wa.me/51970165171?text=Hola%20Mundo%20Dental%2C%20deseo%20reservar%20mi%20cita%20con%20diagnóstico%20gratuito%20para%20el%20servicio%3A%20*${encodeURIComponent(s.title)}*.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center bg-sky-600 text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-sky-700 shadow-lg shadow-sky-50 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5 mr-2" />
                      Reservar Vacante por WhatsApp
                      <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                    </a>
                    <p className="text-[9px] text-slate-400 font-medium mt-2">Escríbenos para consultas de horarios de especialistas.</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-400">
              <Smile className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="font-bold text-xs">No encontramos especialidades coincidentes con la búsqueda.</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("todo"); }}
                className="mt-4 text-xs font-bold text-sky-600 underline"
              >
                Limpiar filtros de búsqueda
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
