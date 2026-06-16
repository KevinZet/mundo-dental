import React, { useState } from "react";
import { Promocion } from "../types";
import { SEDES_MOCK } from "../data";
import { Sparkles, Calendar, Tag, CheckCircle, FileText, Gift, Phone, AlertCircle } from "lucide-react";

interface PromotionsPageProps {
  promociones: Promocion[];
  updatePromotionDetails: (id: string, updates: Partial<Promocion>) => void;
  addAppointment: (cita: any) => any;
}

export default function PromotionsPage({ promociones, updatePromotionDetails, addAppointment }: PromotionsPageProps) {
  const [selectedPromo, setSelectedPromo] = useState<Promocion | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedSede, setSelectedSede] = useState("sede-sjl-jardines");
  const [claimedCoupon, setClaimedCoupon] = useState<{ code: string; promoTitle: string; valueCode: string } | null>(null);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPromo || !patientName || !patientPhone) return;

    // Generate unique verification code
    const uniqueHash = Math.floor(1000 + Math.random() * 9000);
    const generatedValCode = `MD-${selectedPromo.code}-${uniqueHash}`;

    // Record booking in local storage
    addAppointment({
      patientName,
      patientPhone,
      patientDni: "N/A",
      sedeId: selectedSede,
      serviceId: selectedPromo.id.includes("limpieza") ? "srv-limpieza" :
                 selectedPromo.id.includes("escolar") ? "srv-odontopediatria" : "srv-estetica",
      specialistId: "esp-4",
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      status: "pendiente",
      notes: `Cupón Reclamado Online: ${generatedValCode}. Sede solicitada: ${selectedSede}`,
      cost: selectedPromo.newPrice,
      promoApplied: selectedPromo.id,
    });

    setClaimedCoupon({
      code: selectedPromo.code,
      promoTitle: selectedPromo.title,
      valueCode: generatedValCode,
    });

    // Create custom whatsapp url
    const targetSedeInfo = SEDES_MOCK.find(s => s.id === selectedSede);
    const textMsg = encodeURIComponent(
      `¡Hola Mundo Dental! He reclamado mi cupón de promoción online: *${selectedPromo.title}* de S/ ${selectedPromo.newPrice}. Mi código de validación único es: *${generatedValCode}*.\n\nMis datos:\n- Nombre: ${patientName}\n- Teléfono: ${patientPhone}\n- Sede preferida: *${targetSedeInfo?.name}*\n\nDeseo coordinar la hora de mi evaluación gratuita. ¡Muchas gracias!`
    );
    const whatsappUrl = `https://wa.me/51970165171?text=${textMsg}`;

    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1500);
  };

  const handleClose = () => {
    setSelectedPromo(null);
    setPatientName("");
    setPatientPhone("");
    setClaimedCoupon(null);
  };

  return (
    <div className="py-12 bg-slate-50/50 font-sans" id="promotions-manager-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#FFA500] bg-amber-50 border border-amber-100 px-3.5 py-1 rounded-full uppercase tracking-widest inline-block">
            🎁 Campañas Odontológicas y Descuentos
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">
            Promociones Vigentes Mundo Dental
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Reclama tu cupón digital haciendo clic sobre las ofertas deseadas. Cupos limitados por sede para garantizar una atención fluida.
          </p>
        </div>

        {/* Catalog layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {promociones.map((p) => {
            const hasDiscount = p.oldPrice > 0;
            const isSchool = p.isSchoolPromo;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-[32px] border p-6.5 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${
                  p.isActive ? "border-slate-100 opacity-100" : "border-slate-200 opacity-50"
                }`}
                id={`deal-card-${p.id}`}
              >
                {/* School or Hot badge */}
                {isSchool && (
                  <span className="absolute top-0 right-0 bg-teal-500 text-white font-extrabold text-[10px] px-4 py-1.5 rounded-bl-3xl uppercase tracking-wider">
                    Colegios 2x100
                  </span>
                )}
                {!isSchool && p.newPrice === 50 && (
                  <span className="absolute top-0 right-0 bg-[#FFA500] text-slate-950 font-extrabold text-[10px] px-4 py-1.5 rounded-bl-3xl uppercase tracking-wider">
                    Super Promo S/50
                  </span>
                )}

                <div>
                  <div className="flex items-center space-x-2.5 mb-4 text-[#0077B6]">
                    <Tag className="h-5 w-5" />
                    <span className="text-xs font-bold tracking-widest uppercase">CÓDIGO: {p.code}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
                    {p.title}
                  </h3>
                  
                  <p className="text-xs text-slate-500 mt-3 leading-relaxed font-semibold">
                    {p.description}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {hasDiscount ? (
                      <span className="text-xs text-slate-400 line-through">S/ {p.oldPrice} soles</span>
                    ) : (
                      <span className="text-xs text-slate-400">Consulta gratuita</span>
                    )}
                    <p className="text-2xl font-black text-[#0077B6] leading-none mt-1">
                      {p.newPrice === 0 ? "¡COMPLETAMENTE GRATIS!" : `S/ ${p.newPrice}`}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
                      {p.cuposDisponibles} de {p.totalCupos} cupos libres
                    </span>

                    {p.isActive ? (
                      <button
                        onClick={() => setSelectedPromo(p)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors block"
                      >
                        Reclamar Cupón
                      </button>
                    ) : (
                      <span className="block text-xs font-bold text-slate-400 uppercase py-2 bg-slate-100 rounded-xl px-4">
                        Agotado / Caducado
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Claim Promotion Modal overlay */}
        {selectedPromo && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl border border-sky-50 animation-scale-up" id="claim-coupon-modal">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-sky-600 to-[#00B4D8] text-white p-6 relative">
                <h3 className="text-lg font-extrabold flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
                  Cupón Digital: {selectedPromo.code}
                </h3>
                <p className="text-xs text-sky-100 mt-1">Estás pre-reservando la oferta de *{selectedPromo.title}*</p>
                <button
                  onClick={handleClose}
                  className="absolute top-5 right-5 text-sky-100 hover:text-white bg-white/10 p-1.5 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {claimedCoupon ? (
                  <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                    <h4 className="text-md font-bold text-emerald-800">¡Cupón Reservado Exitosamente!</h4>
                    <p className="text-xs text-emerald-600 mt-1">Tu código de validación médica es:</p>
                    <p className="text-xl font-black text-slate-800 tracking-wider bg-white border border-dashed border-emerald-400 py-2.5 px-4 rounded-xl mt-3 inline-block">
                      {claimedCoupon.valueCode}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-4 leading-loose">
                      Estamos abriendo tu WhatsApp para sincronizar con nuestro personal de la sede seleccionada. Por favor, remite el mensaje pre-escrito en tu chat automáticamente.
                    </p>
                    
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleClose(); }}
                      className="mt-6 text-xs font-bold text-sky-600 underline block"
                    >
                      Volver a Promociones
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleClaimSubmit} className="space-y-4">
                    <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-xs text-sky-800 leading-relaxed font-semibold">
                      🎁 Costo Promoción: <strong className="text-slate-900">{selectedPromo.newPrice === 0 ? "GRATUITO" : `S/ ${selectedPromo.newPrice}`} soles</strong>.
                      <span className="block text-[10px] text-sky-600 mt-1 font-medium">Incluye diagnóstico digital odontológico completo con cámara intraoral especial.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Tu Nombre y Apellido:</label>
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Ej. Roberto Quispe Ramos"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">WhatsApp de Contacto:</label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="Ej. 987654321"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Sede preferida de canje:</label>
                      <select
                        value={selectedSede}
                        onChange={(e) => setSelectedSede(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none"
                      >
                        <option value="sede-sjl-jardines">SJL - Jardines Este 524</option>
                        <option value="sede-sjl-proceres">SJL - Próceres 2257</option>
                        <option value="sede-miraflores">Miraflores - Av. Petit Thouars 4350</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full text-center bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-lg shadow-sky-100 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Canjear y agendar vía WhatsApp
                    </button>
                    <p className="text-[9px] text-slate-400 text-center leading-normal">
                      *El canje disminuye en 1 cupo disponible el stock de la sucursal de Mundo Dental.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
