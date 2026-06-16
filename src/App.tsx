import { useDentalState } from "./useDentalState";
import Header from "./components/Header";
import DentibotChat from "./components/DentibotChat";
import LandingHome from "./components/LandingHome";
import ServicesList from "./components/ServicesList";
import SedesExplorer from "./components/SedesExplorer";
import PromotionsPage from "./components/PromotionsPage";
import BeforeAfterGallery from "./components/BeforeAfterGallery";
import DentalBlog from "./components/DentalBlog";
import ContactUs from "./components/ContactUs";
import AdminCRM from "./components/AdminCRM";
import { Smile, Phone, MapPin, CheckCircle } from "lucide-react";

export default function App() {
  const {
    pacientes,
    citas,
    promociones,
    activeTab,
    changeTab,
    addAppointment,
    updateAppointmentStatus,
    updatePromotionDetails,
    addPatient,
    addPatientTreatment,
    messages,
    isChatLoading,
    submitChat
  } = useDentalState();

  // Determine what panel content to render based on the active tab route
  const renderTabContent = () => {
    switch (activeTab) {
      case "inicio":
        return (
          <LandingHome
            promociones={promociones}
            changeTab={changeTab}
            addAppointment={addAppointment}
          />
        );
      case "servicios":
        return <ServicesList />;
      case "sedes":
        return <SedesExplorer />;
      case "promociones":
        return (
          <PromotionsPage
            promociones={promociones}
            updatePromotionDetails={updatePromotionDetails}
            addAppointment={addAppointment}
          />
        );
      case "galeria":
        return <BeforeAfterGallery />;
      case "blog":
        return <DentalBlog />;
      case "contacto":
        return <ContactUs />;
      case "admin":
        return (
          <AdminCRM
            pacientes={pacientes}
            citas={citas}
            promociones={promociones}
            updateAppointmentStatus={updateAppointmentStatus}
            updatePromotionDetails={updatePromotionDetails}
            addPatient={addPatient}
            addPatientTreatment={addPatientTreatment}
            addAppointment={addAppointment}
          />
        );
      default:
        return (
          <LandingHome
            promociones={promociones}
            changeTab={changeTab}
            addAppointment={addAppointment}
          />
        );
    }
  };

  // Hide common layout elements like standard client Header, Footer, and Dentibot Chat bubble when inside the CRM Portal
  const isCrmMode = activeTab === "admin";

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col justify-between selection:bg-sky-200 selection:text-[#0077B6]" id="app-dental-root">
      
      {/* 1. Header (Navbar) */}
      <Header activeTab={activeTab} changeTab={changeTab} />

      {/* 2. Main Tab Body */}
      <main className="flex-grow">
        {renderTabContent()}
      </main>

      {/* 3. Floating Assistant Bubble (Hidden inside Clinical Portal to free up space) */}
      {!isCrmMode && (
        <DentibotChat
          messages={messages}
          isChatLoading={isChatLoading}
          submitChat={submitChat}
          changeTab={changeTab}
        />
      )}

      {/* 4. Footer Component (Hidden inside Clinical Portal to avoid overflow cluttering) */}
      {!isCrmMode && (
        <footer className="bg-slate-900 text-slate-100 font-sans border-t border-slate-800" id="main-public-footer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Brand and slogans */}
              <div className="col-span-1 md:col-span-4 space-y-4">
                <div className="flex items-center space-x-3.5">
                  <div className="bg-sky-600 text-white p-2 rounded-xl flex items-center justify-center">
                    <Smile className="h-5.5 w-5.5" />
                  </div>
                  <span className="text-lg font-bold text-slate-100 tracking-tight">
                    Clínicas Mundo Dental
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  "Nuestra misión es tu sonrisa". Brindamos tratamientos odontológicos de excelencia con cirujanos calificados y modernidad clínica en Lima.
                </p>
                <div className="flex space-x-2 text-[10px] text-sky-400 font-bold uppercase tracking-wider bg-slate-950 p-3 rounded-2xl w-fit border border-slate-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 self-center animate-ping"></span>
                  <span>Evaluación & Diagnóstico gratuito online</span>
                </div>
              </div>

              {/* Specific Location directories */}
              <div className="col-span-1 md:col-span-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-[#00B4D8]" />
                  Sedese en Lima (3 ubicaciones):
                </h4>
                <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
                  <li>
                    <strong className="text-slate-200">SJL Jardines:</strong> Jardines Este 524 - San Juan de Lurigancho (Altura Estación Los Jardines)
                  </li>
                  <li>
                    <strong className="text-slate-200">SJL Próceres:</strong> Av. Próceres de la Independencia 2257 - SJL
                  </li>
                  <li>
                    <strong className="text-slate-200">Sede Miraflores:</strong> Av. Petit Thouars 4350 - Oficina 304 - Miraflores (Cerca a Av. Angamos)
                  </li>
                </ul>
              </div>

              {/* Call center details */}
              <div className="col-span-1 md:col-span-3 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-emerald-400" />
                  Central Telefónica:
                </h4>
                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                  <p className="text-sm text-slate-100 font-black">+51 970 165 171</p>
                  <p className="text-sm text-slate-100 font-black">+51 991 555 222</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-semibold">Atención telefónica: Lunes a Sábado de 9:00 AM a 8:00 PM</p>
                </div>
              </div>

            </div>

            {/* Bottom Credit declars */}
            <div className="mt-12 pt-8 border-t border-slate-800/80 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-4">
              <p>© 2026 Clínicas Mundo Dental. Lima, Perú. Todos los derechos reservados.</p>
              <div className="flex justify-center space-x-4">
                <a href="#contacto" onClick={() => changeTab("contacto")} className="hover:text-slate-300 transition-colors">Contacto directo</a>
                <span>•</span>
                <a href="#servicios" onClick={() => changeTab("servicios")} className="hover:text-slate-300 transition-colors">Especialistas</a>
                <span>•</span>
                <a href="#admin" onClick={() => changeTab("admin")} className="hover:text-slate-300 transition-colors font-bold text-amber-500">Acceso Médico (CRM)</a>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
