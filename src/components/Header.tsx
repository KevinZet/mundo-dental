import { useState } from "react";
import { Smile, Menu, X, Phone, Users } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  changeTab: (tab: string) => void;
}

export default function Header({ activeTab, changeTab }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "inicio", label: "Inicio" },
    { id: "servicios", label: "Servicios" },
    { id: "sedes", label: "Nuestras Sedes" },
    { id: "promociones", label: "Promociones" },
    { id: "galeria", label: "Galería de Cambios" },
    { id: "blog", label: "Consejos" },
    { id: "contacto", label: "Contacto" },
  ];

  return (
    <nav className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm" id="main-nav-bar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => changeTab("inicio")}>
            <div className="bg-sky-600 text-white p-2.5 rounded-2xl flex items-center justify-center shadow-md shadow-sky-200">
              <Smile className="h-6 w-6" />
            </div>
            <div className="ml-3 select-none">
              <span className="text-xl font-bold text-slate-800 tracking-tight font-sans">
                Mundo <span className="text-sky-600">Dental</span>
              </span>
              <p className="text-[10px] font-medium tracking-widest text-[#00B4D8] uppercase">
                Estética y Brackets
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => changeTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-sky-50 text-sky-600 font-semibold"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Contact Actions & CRM Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="tel:+51970165171"
              className="flex items-center text-xs font-semibold text-sky-700 bg-sky-50 px-3.5 py-2 rounded-xl border border-sky-100 hover:bg-sky-100 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 mr-1.5 text-[#0077B6]" />
              SJL / Miraflores
            </a>

            <button
              onClick={() => changeTab("admin")}
              className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                activeTab === "admin"
                  ? "bg-amber-500 text-white shadow-amber-200"
                  : "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-slate-200"
              }`}
              id="crm-toggle-btn"
            >
              <Users className="h-4 w-4 mr-1.5" />
              Portal Médico (CRM)
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => changeTab("admin")}
              className="p-2 rounded-xl bg-slate-800 text-white text-xs font-semibold flex items-center shadow-sm"
              id="crm-toggle-mobile-btn"
            >
              <Users className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-slate-50 focus:outline-none"
              aria-expanded="false"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-sky-100 bg-white" id="mobile-dropdown-menu">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  changeTab(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-sky-50 text-sky-600 font-bold border-l-4 border-sky-600"
                    : "text-slate-600 hover:text-sky-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2 px-4">
              <a
                href="https://wa.me/51970165171"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-sky-600 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md inline-block"
              >
                Agenda Cita WhatsApp
              </a>
              <button
                onClick={() => {
                  changeTab("admin");
                  setIsOpen(false);
                }}
                className="w-full text-center bg-slate-800 text-slate-100 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center shadow-inner"
              >
                <Users className="h-4 w-4 mr-1.5" />
                Acceso a Fichas y CRM
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
