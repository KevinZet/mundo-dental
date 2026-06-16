import React, { useState } from "react";
import { Smile, Phone, MapPin, Clock, Send, Globe, Facebook, Instagram, Video, CheckCircle } from "lucide-react";
import { SEDES_MOCK } from "../data";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sede, setSede] = useState("sede-sjl-jardines");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setSent(true);

    const targetSedeInfo = SEDES_MOCK.find(s => s.id === sede);
    const textMsg = encodeURIComponent(
      `¡Hola Mundo Dental! He rellenado el formulario de contacto para la sede *${targetSedeInfo?.name}*.\n\nDatos:\n- Nombre: ${name}\n- Teléfono: ${phone}\n- Mensaje: ${message || "Deseo solicitar información de citas."}`
    );
    const whatsappUrl = `https://wa.me/51970165171?text=${textMsg}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setName("");
      setPhone("");
      setMessage("");
      setSent(false);
    }, 1200);
  };

  return (
    <div className="py-12 bg-slate-50/50 font-sans" id="contacto-page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">
            📞 Estamos esperándote
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Ponte en Contacto con Mundo Dental
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Resuelve dudas puntuales sobre presupuestos o reserva tu vacante al instante escribiendo a nuestras líneas dedicadas.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-10 max-w-6xl mx-auto items-start">
          
          {/* Left Column details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-6.5 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center">
                <Smile className="h-5 w-5 mr-2 text-sky-600" />
                Nuestros Contactos Directos
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#0077B6] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Llamadas o WhatsApp:</p>
                    <p className="text-sm text-slate-800 font-extrabold mt-1">+51 970 165 171</p>
                    <p className="text-sm text-slate-800 font-extrabold mt-0.5">+51 991 555 222</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Línea Horaria clínica:</p>
                    <p className="text-sm text-slate-800 font-bold mt-1">Lunes a Sábado:</p>
                    <p className="text-xs text-slate-500 font-semibold">9:00 AM a 8:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-sky-600 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nuestras Redes Oficiales:</p>
                    <div className="flex space-x-3 mt-2.5">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-400 hover:text-sky-600 transition-colors"
                      >
                        <Facebook className="h-4.5 w-4.5" />
                      </a>
                      <a
                        href="https://instagram.com/mundodental.lima"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Instagram className="h-4.5 w-4.5" />
                      </a>
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center font-bold text-xs"
                      >
                        TikTok
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro details block lists directions simplified */}
            <div className="bg-[#0077B6] rounded-3xl p-6 text-white space-y-4">
              <h4 className="text-sm font-black">Nuestras 3 Direcciones:</h4>
              <ul className="space-y-3.5 text-xs text-sky-100 font-medium">
                <li className="flex items-start">
                  <MapPin className="h-4.5 w-4.5 mr-2 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>SJL Jardines: Jardines Este 524</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4.5 w-4.5 mr-2 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>SJL Próceres: Av. Próceres de la Independencia 2257</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4.5 w-4.5 mr-2 text-yellow-300 flex-shrink-0 mt-0.5" />
                  <span>Miraflores: Av. Petit Thouars 4350 - Oficina 304</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column interactive Form */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="bg-white rounded-3xl p-6.5 sm:p-8 border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6">Formulario de Contacto Rápido</h3>
              
              {sent ? (
                <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl text-center border border-emerald-100 animate-pulse">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-bold">¡Formulario enviado!</h4>
                  <p className="text-xs mt-1">Abriendo WhatsApp para atención preferencial de recepción...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Tu Nombre Completo:</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Juan Manuel Torres"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">WhatsApp / Celular:</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. +51 912345678"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Sede que Consulta:</label>
                      <select
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none"
                      >
                        <option value="sede-sjl-jardines">SJL - Jardines Este 524</option>
                        <option value="sede-sjl-proceres">SJL - Próceres 2257</option>
                        <option value="sede-miraflores">Miraflores - Petit Thouars 4350</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Escribe tu Consulta detallada:</label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe qué tratamiento necesitas, si presentas dolor o deseas cotizaciones específicas de Brackets o Implantes dentales..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 text-right">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md flex items-center justify-center cursor-pointer"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensaje y Chatear
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
