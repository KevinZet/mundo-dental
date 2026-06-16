import React, { useState } from "react";
import { Paciente, Cita, Promocion } from "../types";
import { SEDES_MOCK, SERVICIOS_MOCK, ESPECIALISTAS_MOCK } from "../data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  Calendar,
  Users,
  Tag,
  CircleDollarSign,
  CheckCircle,
  FileText,
  Clock,
  Phone,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Bell,
  Gift,
  ToggleLeft,
  X,
  PlayCircle
} from "lucide-react";

interface AdminCRMProps {
  pacientes: Paciente[];
  citas: Cita[];
  promociones: Promocion[];
  updateAppointmentStatus: (id: string, status: Cita["status"]) => void;
  updatePromotionDetails: (id: string, updates: Partial<Promocion>) => void;
  addPatient: (paciente: any) => any;
  addPatientTreatment: (patientId: string, treatment: any) => void;
  addAppointment: (cita: any) => any;
}

export default function AdminCRM({
  pacientes,
  citas,
  promociones,
  updateAppointmentStatus,
  updatePromotionDetails,
  addPatient,
  addPatientTreatment,
  addAppointment,
}: AdminCRMProps) {
  // Navigation tabs in CRM
  const [activePanel, setActivePanel] = useState<"dashboard" | "calendario" | "pacientes" | "promociones" | "automatizaciones">("dashboard");

  // Selection states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedSedeFilter, setSelectedSedeFilter] = useState("todo");
  const [selectedServiceFilter, setSelectedServiceFilter] = useState("todo");

  // Search states
  const [patientSearch, setPatientSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // CRM Fast Actions Modals
  const [isNewPatientModal, setIsNewPatientModal] = useState(false);
  const [isNewAppointmentModal, setIsNewAppointmentModal] = useState(false);

  // New Patient Form state
  const [newPtName, setNewPtName] = useState("");
  const [newPtPhone, setNewPtPhone] = useState("");
  const [newPtDni, setNewPtDni] = useState("");
  const [newPtAge, setNewPtAge] = useState(30);
  const [newPtSede, setNewPtSede] = useState("sede-sjl-jardines");
  const [newPtNotes, setNewPtNotes] = useState("");

  // New Appointment Form state
  const [newApPt, setNewApPt] = useState("");
  const [newApPhone, setNewApPhone] = useState("");
  const [newApSede, setNewApSede] = useState("sede-sjl-jardines");
  const [newApService, setNewApService] = useState("srv-limpieza");
  const [newApSpecialist, setNewApSpecialist] = useState("esp-1");
  const [newApDate, setNewApDate] = useState("2026-06-16");
  const [newApTime, setNewApTime] = useState("09:00");
  const [newApNotes, setNewApNotes] = useState("");

  // Evolution/Treatment Session Form state
  const [newTreatTxt, setNewTreatTxt] = useState("");
  const [newTreatDoctor, setNewTreatDoctor] = useState("Dr. Carlos Mendoza");
  const [newTreatNotes, setNewTreatNotes] = useState("");
  const [newTreatCost, setNewTreatCost] = useState(120);

  // Simulator Logs for Automation
  const [automationLogs, setAutomationLogs] = useState<Array<{
    id: string;
    time: string;
    type: string;
    patient: string;
    status: string;
    channel: string;
    msg: string;
  }>>([
    {
      id: "log-1",
      time: "13:10:05",
      type: "Recordatorio 24h",
      patient: "María Elena Quispe",
      status: "Entregado",
      channel: "WhatsApp Business API",
      msg: "Estimada María, Mundo Dental le recuerda su cita de ORTODONCIA mañana 17 de Junio a las 15:00 horas en la Sede SJL Jardines. Favor de confirmar con un SI.",
    },
    {
      id: "log-2",
      time: "12:44:00",
      type: "Post-Tratamiento Follow-Up",
      patient: "Ana Sofía Benítez",
      status: "Entregado",
      channel: "WhatsApp Business API",
      msg: "Estimada mamita de Ana Sofía, le saluda la Dra. Sofía de Mundo Dental. ¿Cómo superó Ana la aplicación de flúor de ayer? Cuente con nosotros ante cualquier molestia.",
    },
    {
      id: "log-3",
      time: "10:00:15",
      type: "Cumpleaños Feliz 🎂",
      patient: "Luis Alberto Tapia Alva",
      status: "Efectivo",
      channel: "SMS Gateway",
      msg: "¡Feliz Cumpleaños Luis! 🎉 Mundo Dental le desea un día radiante. Reclame su profilaxis gratuita de regalo en cualquier sede de SJL o Miraflores.",
    }
  ]);

  // ----------------------------------------------------
  // DYNAMIC STATS CALCULATION
  // ----------------------------------------------------
  const totalAppointmentsCount = citas.length;
  const totalEarnings = citas
    .filter((c) => c.status !== "cancelada")
    .reduce((sum, c) => sum + c.cost, 0);
  const totalPatientsCount = pacientes.length;
  const activePromoCount = promociones.filter((p) => p.isActive).length;

  // Sedes Populatity Calculation for Recharts BarChart
  const sedePopularityData = SEDES_MOCK.map((s) => {
    const count = citas.filter((c) => c.sedeId === s.id).length;
    return { name: s.distrito, citas: count };
  });

  // Patient type calculation (new vs returning) for Recharts PieChart
  const ptTypeData = [
    { name: "Nuevos Registrados", value: pacientes.length - 2, color: "#00B4D8" },
    { name: "Recurrentes Activos", value: 2, color: "#0077B6" },
  ];

  // Daily Frequency array for LineChart
  const appointmentsDelayData = [
    { date: "12 Jun", citas: 4 },
    { date: "13 Jun", citas: 6 },
    { date: "14 Jun", citas: 8 },
    { date: "15 Jun", citas: 12 },
    { date: "16 Jun", citas: citas.filter(c => c.date === "2026-06-16").length },
    { date: "17 Jun", citas: citas.filter(c => c.date === "2026-06-17").length },
    { date: "18 Jun", citas: citas.filter(c => c.date === "2026-06-18").length },
  ];

  // Treatment earnings distribution
  const earningsDataObj = SERVICIOS_MOCK.map((srv) => {
    const total = citas
      .filter((c) => c.serviceId === srv.id && c.status !== "cancelada")
      .reduce((sum, c) => sum + c.cost, 0);
    return { name: srv.title.split("(")[0], ingresos: total };
  });

  // Filter appointments list of calendar
  const filteredCitas = citas.filter((c) => {
    const matchesSede = selectedSedeFilter === "todo" || c.sedeId === selectedSedeFilter;
    const matchesService = selectedServiceFilter === "todo" || c.serviceId === selectedServiceFilter;
    const matchesSearch = c.patientName.toLowerCase().includes(appointmentSearch.toLowerCase()) || 
                          c.patientPhone.includes(appointmentSearch);
    return matchesSede && matchesService && matchesSearch;
  });

  // Filter patients list
  const filteredPatients = pacientes.filter((p) => {
    return (
      p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      p.dni.includes(patientSearch) ||
      p.phone.includes(patientSearch)
    );
  });

  // Handle clinicalevolution notes submissions
  const handleEvolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !newTreatTxt) return;

    addPatientTreatment(selectedPatientId, {
      treatment: newTreatTxt,
      specialistName: newTreatDoctor,
      notes: newTreatNotes || "Control de rutina.",
      cost: newTreatCost,
    });

    // Reset evolution form
    setNewTreatTxt("");
    setNewTreatNotes("");
    setNewTreatCost(120);

    // Alert simulation
    const targetPt = pacientes.find(p => p.id === selectedPatientId);
    if (targetPt) {
      alert(`Historial Clínico actualizado para ${targetPt.name}.`);
    }
  };

  // Add Patient from administration modal
  const handleAddNewPt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPtName || !newPtPhone) return;

    addPatient({
      name: newPtName,
      phone: newPtPhone,
      dni: newPtDni || "N/A",
      age: Number(newPtAge) || 30,
      locationPreference: newPtSede,
      notes: newPtNotes || "Ingresado en ventanilla por recepción.",
    });

    setNewPtName("");
    setNewPtPhone("");
    setNewPtDni("");
    setNewPtNotes("");
    setIsNewPatientModal(false);
  };

  // Add Appointment booking from admin console
  const handleAddNewAp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApPt || !newApPhone) return;

    addAppointment({
      patientName: newApPt,
      patientPhone: newApPhone,
      patientDni: "N/A",
      sedeId: newApSede,
      serviceId: newApService,
      specialistId: newApSpecialist,
      date: newApDate,
      time: newApTime,
      status: "confirmada",
      notes: newApNotes || "Fijado directamente desde agenda presencial.",
      cost: newApService === "srv-limpieza" ? 50 : 120,
    });

    setNewApPt("");
    setNewApPhone("");
    setNewApNotes("");
    setIsNewAppointmentModal(false);
  };

  // Simuate dispatching 24h WhatsApp notification
  const triggerSimulatedAlert = (type: string, patientName: string, destination: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const id = `log-${Date.now()}`;
    let mockContent = "";

    if (type === "Recordatorio") {
      mockContent = `Estimado ${patientName}, Mundo Dental le recuerda asistir a su cita mañana para su profilaxis ultrasónica. Sede elegida de canje.`;
    } else if (type === "Campania") {
      mockContent = `¡Mundo Dental Informa! Campaña comunitaria de salud dental en todas las sedes este fin de semana. ¡Traiga a un familiar gratis!`;
    } else {
      mockContent = `Estimada ${patientName}, nos complace saludarle. ¿Presentó molestias post operatorias con su reciente profilaxis? Calidez Mundo Dental.`;
    }

    const newLog = {
      id,
      time: timestamp,
      type: type === "Recordatorio" ? "Recordatorio 24h" : type === "Campania" ? "Broadcast Campaña" : "Follow-Up Clínico",
      patient: patientName,
      status: "Transmitido",
      channel: "WhatsApp Business Cloud API",
      msg: mockContent,
    };

    setAutomationLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans border-t-4 border-amber-500" id="crm-administration-hub">
      {/* CRM Navigation Sub-header */}
      <div className="bg-slate-950 px-4 py-4.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500 text-slate-950 p-2 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Sistema de Gestión Interna</span>
              <h2 className="text-md font-bold text-slate-200">Portal Clínico Mundo Dental CRM</h2>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex space-x-1.5 flex-wrap">
            {[
              { id: "dashboard", label: "Dashboard", Icon: TrendingUp },
              { id: "calendario", label: "Calendario de Citas", Icon: Calendar },
              { id: "pacientes", label: "Expediente y Fichas", Icon: Users },
              { id: "promociones", label: "Ofertas y Cupos", Icon: Tag },
              { id: "automatizaciones", label: "Notificaciones API", Icon: Bell },
            ].map((p) => {
              const SubIcon = p.Icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePanel(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center ${
                    activePanel === p.id
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <SubIcon className="h-4 w-4 mr-1.5" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP STATUS HIGHLIGHTS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Citas Registradas</span>
              <p className="text-2xl font-black text-slate-100 mt-1">{totalAppointmentsCount}</p>
              <p className="text-[9px] text-[#00B4D8] font-bold mt-1">Sedes SJL y Miraflores</p>
            </div>
            <div className="p-3 bg-sky-900/40 text-[#00B4D8] rounded-2xl"><Calendar className="h-5 w-5" /></div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Ingresos Proyectados</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">S/ {totalEarnings}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">Excluye cancelaciones</p>
            </div>
            <div className="p-3 bg-emerald-950/40 text-emerald-400 rounded-2xl"><CircleDollarSign className="h-5 w-5" /></div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Fichas de Pacientes</span>
              <p className="text-2xl font-black text-indigo-400 mt-1">{totalPatientsCount}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">Médicas activas</p>
            </div>
            <div className="p-3 bg-indigo-950/40 text-indigo-400 rounded-2xl"><Users className="h-5 w-5" /></div>
          </div>

          <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Promociones Activas</span>
              <p className="text-2xl font-black text-amber-500 mt-1">{activePromoCount}</p>
              <p className="text-[9px] text-slate-400 font-bold mt-1">4 cupones configurados</p>
            </div>
            <div className="p-3 bg-amber-950/40 text-amber-500 rounded-2xl"><Tag className="h-5 w-5" /></div>
          </div>
        </div>

        {/* ----------------------------------------------------
            PANEL 1: DASHBOARD METRICS VIEW (Recharts)
            ---------------------------------------------------- */}
        {activePanel === "dashboard" && (
          <div className="space-y-8 animate-fade-in" id="crm-dashboard-visuals">
            
            {/* Quick Action buttons */}
            <div className="flex space-x-3.5">
              <button
                onClick={() => setIsNewPatientModal(true)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-sky-950 transition-colors"
                id="fast-add-patient-btn"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Registrar Paciente Nuevo
              </button>
              
              <button
                onClick={() => setIsNewAppointmentModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center shadow-lg shadow-indigo-950 transition-colors"
                id="fast-add-appointment-btn"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Agendar Cita Nuevo
              </button>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily frequency chart */}
              <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Actividad y Citas de la Semana</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentsDelayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00B4D8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00B4D8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="date" stroke="#888" fontSize={10} />
                      <YAxis stroke="#888" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                      <Area type="monotone" dataKey="citas" stroke="#00B4D8" fillOpacity={1} fill="url(#colorCitas)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sede workload popularity bar */}
              <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Citas Atendidas por Sede (Lima)</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sedePopularityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="name" stroke="#888" fontSize={10} />
                      <YAxis stroke="#888" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                      <Bar dataKey="citas" fill="#0077B6" radius={[10, 10, 0, 0]}>
                        {sedePopularityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 2 ? "#FFA500" : "#0077B6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Patient return rates pie chart */}
              <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Estructura General de Pacientes</h4>
                <div className="h-[250px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ptTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ptTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 10 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Earnings by Services category */}
              <div className="bg-slate-950 rounded-[32px] p-6 border border-slate-800/60">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ingresos Estimados por Servicio (S/.)</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={earningsDataObj} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeNoData="true" stroke="#222" />
                      <XAxis type="number" stroke="#888" fontSize={10} />
                      <YAxis dataKey="name" type="category" stroke="#888" fontSize={9} width={90} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                      <Bar dataKey="ingresos" fill="#40E0D0" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            PANEL 2: CALENDARIO DE CITAS / LISTADO
            ---------------------------------------------------- */}
        {activePanel === "calendario" && (
          <div className="space-y-6 animate-fade-in" id="crm-appointments-calendar">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4.5 rounded-3xl border border-slate-800/60">
              {/* Search appointments */}
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  placeholder="Buscar cita por paciente o fono..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-9 py-2 text-xs text-slate-300 outline-none focus:border-amber-500"
                />
              </div>

              {/* Filter coordinates Sede */}
              <div className="flex space-x-2 w-full sm:w-auto">
                <select
                  value={selectedSedeFilter}
                  onChange={(e) => setSelectedSedeFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3.5 py-2 outline-none text-slate-300"
                >
                  <option value="todo">Todas las Sedes</option>
                  <option value="sede-sjl-jardines">SJL Jardines</option>
                  <option value="sede-sjl-proceres">SJL Próceres</option>
                  <option value="sede-miraflores">Miraflores</option>
                </select>

                <select
                  value={selectedServiceFilter}
                  onChange={(e) => setSelectedServiceFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3.5 py-2 outline-none text-slate-300"
                >
                  <option value="todo">Todos los Servicios</option>
                  <option value="srv-limpieza">Limpieza Profunda</option>
                  <option value="srv-ortodoncia">Ortodoncia</option>
                  <option value="srv-odontopediatria">Odontopediatría</option>
                  <option value="srv-implantes">Implantes</option>
                </select>
              </div>
            </div>

            {/* List Table of Scheduled active */}
            <div className="bg-slate-950 rounded-[32px] border border-slate-800/60 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-400">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">Paciente / Contacto</th>
                      <th className="p-4">Sede / Doctor</th>
                      <th className="p-4">Servicio solicitado</th>
                      <th className="p-4">Fijado (Día/Hora)</th>
                      <th className="p-4">Monto S/.</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-center">Acciones Coordinación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredCitas.map((c) => {
                      const targetSede = SEDES_MOCK.find((s) => s.id === c.sedeId);
                      const targetService = SERVICIOS_MOCK.find((sr) => sr.id === c.serviceId);
                      const targetSpec = ESPECIALISTAS_MOCK.find((sp) => sp.id === c.specialistId);

                      return (
                        <tr key={c.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4">
                            <p className="font-extrabold text-slate-100">{c.patientName}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{c.patientPhone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{targetSede?.name.replace("Sede ", "")}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{targetSpec?.name}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg font-bold">
                              {targetService?.title.split("(")[0]}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{c.date}</p>
                            <p className="text-[10px] text-amber-500 font-semibold mt-0.5 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {c.time}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="font-extrabold text-emerald-400">S/ {c.cost}</p>
                          </td>
                          <td className="p-4">
                            <select
                              value={c.status}
                              onChange={(e) => updateAppointmentStatus(c.id, e.target.value as any)}
                              className={`text-[10px] font-bold rounded-lg px-2.5 py-1 outline-none ${
                                c.status === "confirmada"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                  : c.status === "atendida"
                                  ? "bg-sky-950 text-sky-400 border border-sky-800"
                                  : c.status === "cancelada"
                                  ? "bg-rose-950/60 text-rose-400 border border-rose-800"
                                  : "bg-amber-950 text-amber-400 border border-amber-800"
                              }`}
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmado</option>
                              <option value="atendida">Atendido</option>
                              <option value="cancelada">Cancelado</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => triggerSimulatedAlert("Recordatorio", c.patientName, c.patientPhone)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[9px] px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors inline-flex items-center"
                            >
                              <Phone className="h-3 w-3 mr-1" />
                              Recordar por WhatsApp
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            PANEL 3: GESTIÓN DE PACIENTES EXPEDIENTES
            ---------------------------------------------------- */}
        {activePanel === "pacientes" && (
          <div className="space-y-6 animate-fade-in" id="crm-patients-panel-view">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Patient list filter column */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800/60 rounded-3xl p-5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    placeholder="Filtrar por nombre or DNI..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-9 py-2 text-xs text-slate-300 outline-none"
                  />
                </div>

                <div className="divide-y divide-slate-800/50 max-h-[400px] overflow-y-auto pr-1">
                  {filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPatientId(p.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                        selectedPatientId === p.id ? "bg-amber-500/10 border-l-4 border-amber-500" : "hover:bg-slate-900/30"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-100">{p.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">DNI: {p.dni} / HC: {p.recordNumber}</p>
                      </div>
                      <span className="text-[9px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded-md">Ver ficha</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Medical details Card */}
              <div className="lg:col-span-8">
                {selectedPatientId ? (
                  (() => {
                    const patient = pacientes.find((p) => p.id === selectedPatientId);
                    if (!patient) return null;

                    return (
                      <div className="bg-slate-950 border border-slate-800/60 rounded-[32px] overflow-hidden shadow-sm" id="patient-comprehensive-clinical-card">
                        {/* banner */}
                        <div className="bg-slate-900 px-6.5 py-5 border-b border-slate-800 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">EXPEDIENTE HISTÓRICO ACTIVO</span>
                            <h3 className="text-lg font-extrabold text-slate-100 mt-0.5">{patient.name}</h3>
                          </div>
                          <p className="text-xs font-bold text-slate-400">HC: {patient.recordNumber}</p>
                        </div>

                        {/* core statistics */}
                        <div className="p-6.5 sm:p-8 space-y-8">
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50 text-xs">
                            <div>
                              <p className="text-slate-500 font-bold tracking-wide">DNI:</p>
                              <p className="text-slate-200 font-bold mt-1">{patient.dni}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-bold tracking-wide">Edad del Paciente:</p>
                              <p className="text-slate-200 font-bold mt-1">{patient.age} años</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-bold tracking-wide">Móvil WhatsApp:</p>
                              <p className="text-slate-200 font-bold mt-1">{patient.phone}</p>
                            </div>
                            <div>
                              <p className="text-slate-500 font-bold tracking-wide">Sede Preferida:</p>
                              <p className="text-slate-200 font-bold mt-1 uppercase">
                                {patient.locationPreference.replace("sede-", "").replace("-", " ")}
                              </p>
                            </div>
                          </div>

                          {/* Treatment Log list */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
                              <FileText className="h-4.5 w-4.5 mr-2 text-sky-500" />
                              Historial de Intervenciones y Profilaxis:
                            </h4>

                            <div className="space-y-3">
                              {patient.treatmentsHistory && patient.treatmentsHistory.length > 0 ? (
                                patient.treatmentsHistory.map((tr, idx) => (
                                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <p className="font-extrabold text-slate-200">{tr.treatment}</p>
                                      <span className="text-[10px] text-slate-500 font-bold">{tr.date}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-medium">Médico: {tr.specialistName}</p>
                                    <div className="bg-slate-950/60 p-2 rounded-xl mt-2 text-[11px] text-slate-400 font-medium">
                                      {tr.notes}
                                    </div>
                                    <p className="text-right text-emerald-400 font-black mt-2">Costo: S/ {tr.cost} soles</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-500 italic p-4 bg-slate-900 rounded-2xl">
                                  No registra intervenciones concluidas previas.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick intervention evolution writer */}
                          <div className="pt-6 border-t border-slate-800">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                              ✍️ Anotar Sesión de Evolución Clínica:
                            </h4>

                            <form onSubmit={handleEvolutionSubmit} className="space-y-3 bg-slate-900/40 p-5 rounded-2xl border border-slate-850">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nombre Tratamiento concluido:</label>
                                  <input
                                    type="text"
                                    required
                                    value={newTreatTxt}
                                    onChange={(e) => setNewTreatTxt(e.target.value)}
                                    placeholder="Ej. Profilaxis + fluorización barniz"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Especialista Tratante:</label>
                                  <select
                                    value={newTreatDoctor}
                                    onChange={(e) => setNewTreatDoctor(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                                  >
                                    <option>Dr. Carlos Mendoza</option>
                                    <option>Dra. Sofía Benavides</option>
                                    <option>Dr. Luis Tapia</option>
                                    <option>Dra. Natalia Ruiz</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Costo de la Sesión S/. :</label>
                                  <input
                                    type="number"
                                    required
                                    value={newTreatCost}
                                    onChange={(e) => setNewTreatCost(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Anotación Médica / Indicaciones:</label>
                                  <input
                                    type="text"
                                    value={newTreatNotes}
                                    onChange={(e) => setNewTreatNotes(e.target.value)}
                                    placeholder="Pacientes en correcto cuidado, etc."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="text-right pt-2">
                                <button
                                  type="submit"
                                  className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                                >
                                  Inscribir en Historial Clínico
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-slate-950 rounded-[32px] p-12 border border-slate-800 text-center text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-slate-600" />
                    <p className="text-xs font-bold">Selecciona un paciente de la lista izquierda para visualizar su ficha dental integral y actualizar tratamientos.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            PANEL 4: PROMOCIONES CONTROLLER
            ---------------------------------------------------- */}
        {activePanel === "promociones" && (
          <div className="space-y-6 animate-fade-in" id="crm-promotions-section-view">
            <div className="bg-slate-950 border border-slate-800/60 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6.5 border-b border-slate-800">
                <h3 className="text-md font-bold text-slate-200">Panel de Control de Promociones y Automatización</h3>
                <p className="text-xs text-slate-500 mt-1">Habilita o deshabilita cupones mundiales, incrementa cupos y altera plazos límite.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-400">
                  <thead className="bg-slate-900 text-slate-300 font-bold uppercase tracking-widest text-[9px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">Título Promo</th>
                      <th className="p-4">Código</th>
                      <th className="p-4">Precio Regular</th>
                      <th className="p-4">Precio Oferta S/.</th>
                      <th className="p-4">Cupos Disponibles</th>
                      <th className="p-4">Vencimiento</th>
                      <th className="p-4">Estado Publicación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {promociones.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/35 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-slate-100">{p.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm">{p.description}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {p.code}
                          </span>
                        </td>
                        <td className="p-4">S/ {p.oldPrice}</td>
                        <td className="p-4 font-black text-emerald-400">S/ {p.newPrice}</td>
                        <td className="p-4">
                          <input
                            type="number"
                            value={p.cuposDisponibles}
                            onChange={(e) => updatePromotionDetails(p.id, { cuposDisponibles: Number(e.target.value) })}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs w-16 outline-none text-center"
                          />
                          <span className="text-[10px] text-slate-500 ml-1.5 font-bold">/ {p.totalCupos}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-200">
                          <input
                            type="text"
                            value={p.fechaVencimiento}
                            onChange={(e) => updatePromotionDetails(p.id, { fechaVencimiento: e.target.value })}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs w-28 outline-none text-center"
                          />
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => updatePromotionDetails(p.id, { isActive: !p.isActive })}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${
                              p.isActive
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {p.isActive ? "ACTIVO / AL AIRE" : "DESACTIVADO"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            PANEL 5: AUTOMATIZACIONES TERMINAL API
            ---------------------------------------------------- */}
        {activePanel === "automatizaciones" && (
          <div className="space-y-6 animate-fade-in" id="crm-api-logs-terminal">
            <div className="bg-slate-950 rounded-[32px] border border-slate-800/60 p-6">
              <h3 className="text-md font-bold text-slate-200 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-yellow-500 animate-bounce" />
                Terminal de Notificaciones Automatizadas (WhatsApp API)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Sincronizador en segundo plano emitirá recordatorios 24 horas antes, promociones masivas y felicitaciones post-tratamiento.</p>

              {/* Action simulate buttons */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button
                  onClick={() => triggerSimulatedAlert("Recordatorio", "María Elena Quispe", "98345109")}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center"
                >
                  <PlayCircle className="h-4 w-4 mr-1.5" />
                  Simular Recordatorio 24h
                </button>
                <button
                  onClick={() => triggerSimulatedAlert("Campania", "Broadcast General", "Todas")}
                  className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Simular Alerta de Campaña
                </button>
                <button
                  onClick={() => triggerSimulatedAlert("FollowUp", "Juan Carlos Flores", "97211584")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center"
                >
                  <Activity className="h-4 w-4 mr-1.5" />
                  Simular Post-Operativo (Encuesta)
                </button>
              </div>

              {/* Logs display */}
              <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-4.5 font-mono text-[10px] text-slate-300 space-y-3.5 max-h-[350px] overflow-y-auto">
                <p className="text-slate-500 block pb-2 border-b border-slate-900">// LOGS DE TELEMETRÍA WHATSAPP BUSINESS API - MUNDO DENTAL 🦷</p>
                {automationLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-yellow-500 font-extrabold">[{log.time}]</span>
                      <span className="bg-slate-850 px-2 py-0.5 rounded text-sky-400 font-bold">{log.type}</span>
                      <span className="text-slate-400">Paciente: <strong className="text-slate-200">{log.patient}</strong></span>
                      <span className="text-emerald-400 font-black">● {log.status}</span>
                    </div>
                    <p className="text-slate-400 italic font-medium leading-relaxed mt-1">"{log.msg}"</p>
                    <p className="text-[9px] text-slate-500 text-right">Canal de transporte: {log.channel}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          MODAL A: NUEVO PACIENTE
          ---------------------------------------------------- */}
      {isNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-slate-900 text-slate-100 p-5 flex justify-between items-center">
              <h3 className="text-md font-bold">Registrar Ficha Clínica de Paciente Nuevo</h3>
              <button onClick={() => setIsNewPatientModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddNewPt} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={newPtName}
                    onChange={(e) => setNewPtName(e.target.value)}
                    placeholder="Ej. Pedro Castillo Flores"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Celular WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={newPtPhone}
                    onChange={(e) => setNewPtPhone(e.target.value)}
                    placeholder="Ej. 983115442"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Documento DNI:</label>
                  <input
                    type="text"
                    value={newPtDni}
                    onChange={(e) => setNewPtDni(e.target.value)}
                    placeholder="8 dígitos"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Edad:</label>
                  <input
                    type="number"
                    value={newPtAge}
                    onChange={(e) => setNewPtAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sede de atención:</label>
                  <select
                    value={newPtSede}
                    onChange={(e) => setNewPtSede(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="sede-sjl-jardines">SJL Jardines</option>
                    <option value="sede-sjl-proceres">SJL Próceres</option>
                    <option value="sede-miraflores">Miraflores</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Observaciones Iniciales:</label>
                <input
                  type="text"
                  value={newPtNotes}
                  onChange={(e) => setNewPtNotes(e.target.value)}
                  placeholder="Ej. Paciente con bruxismo nocturno fuerte"
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs"
                />
              </div>

              <div className="text-right pt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewPatientModal(false)}
                  className="px-4 py-2 border text-[10px] font-bold rounded-lg uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white hover:bg-sky-700 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                >
                  Registrar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MODAL B: AGENDAR NUEVA CITA DESDE CRM
          ---------------------------------------------------- */}
      {isNewAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 text-slate-800">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-slate-900 text-slate-100 p-5 flex justify-between items-center">
              <h3 className="text-md font-bold">Agendar Nueva Cita Médica</h3>
              <button onClick={() => setIsNewAppointmentModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddNewAp} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nombre Paciente:</label>
                  <input
                    type="text"
                    required
                    value={newApPt}
                    onChange={(e) => setNewApPt(e.target.value)}
                    placeholder="Ej. Carlos Ramos Flores"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Celular / Móvil:</label>
                  <input
                    type="tel"
                    required
                    value={newApPhone}
                    onChange={(e) => setNewApPhone(e.target.value)}
                    placeholder="Fono"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Sede:</label>
                  <select
                    value={newApSede}
                    onChange={(e) => setNewApSede(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="sede-sjl-jardines">SJL Jardines</option>
                    <option value="sede-sjl-proceres">SJL Próceres</option>
                    <option value="sede-miraflores">Miraflores</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tratamiento:</label>
                  <select
                    value={newApService}
                    onChange={(e) => setNewApService(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="srv-limpieza">Limpieza S/50</option>
                    <option value="srv-ortodoncia">Ortodoncia (Brackets)</option>
                    <option value="srv-odontopediatria">Odontopediatría</option>
                    <option value="srv-implantes">Implantes Dentales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Especialista COP:</label>
                  <select
                    value={newApSpecialist}
                    onChange={(e) => setNewApSpecialist(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="esp-1">Dr. Carlos Mendoza</option>
                    <option value="esp-2">Dra. Sofía Benavides</option>
                    <option value="esp-3">Dr. Luis Tapia</option>
                    <option value="esp-4">Dra. Natalia Ruiz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Fecha programada:</label>
                  <input
                    type="date"
                    value={newApDate}
                    onChange={(e) => setNewApDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hora programada:</label>
                  <input
                    type="text"
                    value={newApTime}
                    onChange={(e) => setNewApTime(e.target.value)}
                    placeholder="Ej. 10:30"
                    className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Notas agenda:</label>
                <input
                  type="text"
                  value={newApNotes}
                  onChange={(e) => setNewApNotes(e.target.value)}
                  placeholder="Viene con promoción activa..."
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2.5 text-xs"
                />
              </div>

              <div className="text-right pt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewAppointmentModal(false)}
                  className="px-4 py-2 border text-[10px] font-bold rounded-lg uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                >
                  Confirmar Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
