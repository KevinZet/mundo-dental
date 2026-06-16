import { useState, useEffect } from "react";
import { Paciente, Cita, Promocion, Campania, BlogPost, Message } from "./types";
import { PACIENTES_MOCK, CITAS_MOCK, PROMOCIONES_MOCK, CAMPANIAS_MOCK, BLOG_MOCK } from "./data";

export function useDentalState() {
  const [pacientes, setPacientes] = useState<Paciente[]>(() => {
    const saved = localStorage.getItem("mundodental_pacientes");
    return saved ? JSON.parse(saved) : PACIENTES_MOCK;
  });

  const [citas, setCitas] = useState<Cita[]>(() => {
    const saved = localStorage.getItem("mundodental_citas");
    return saved ? JSON.parse(saved) : CITAS_MOCK;
  });

  const [promociones, setPromociones] = useState<Promocion[]>(() => {
    const saved = localStorage.getItem("mundodental_promociones");
    return saved ? JSON.parse(saved) : PROMOCIONES_MOCK;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace("#", "");
    const allowed = ["inicio", "servicios", "sedes", "promociones", "galeria", "blog", "contacto", "admin"];
    return allowed.includes(hash) ? hash : "inicio";
  });

  const [campaigns, setCampaigns] = useState<Campania[]>(CAMPANIAS_MOCK);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_MOCK);

  // Chatbot State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy **Dentibot** 🦷, tu asistente virtual de Mundo Dental. ¿En qué te puedo ayudar hoy? Pregúntame sobre nuestras promociones desde S/50, sedes o solicita tu evaluación totalmente gratuita.",
      timestamp: new Date(),
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Persist states to LocalStorage
  useEffect(() => {
    localStorage.setItem("mundodental_pacientes", JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem("mundodental_citas", JSON.stringify(citas));
  }, [citas]);

  useEffect(() => {
    localStorage.setItem("mundodental_promociones", JSON.stringify(promociones));
  }, [promociones]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const allowed = ["inicio", "servicios", "sedes", "promociones", "galeria", "blog", "contacto", "admin"];
      if (allowed.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  // Actions
  const addAppointment = (newCita: Omit<Cita, "id" | "createdAt">) => {
    const id = `cit-${Date.now()}`;
    const formattedCita: Cita = {
      ...newCita,
      id,
      createdAt: new Date().toISOString(),
    };

    // Auto-create patient record if not exists
    const exists = pacientes.some(
      (p) => p.phone === newCita.patientPhone || p.dni === newCita.patientDni
    );
    if (!exists) {
      const newPaciente: Paciente = {
        id: `pac-${Date.now()}`,
        name: newCita.patientName,
        phone: newCita.patientPhone,
        dni: newCita.patientDni,
        age: 30, // Default estimate
        locationPreference: newCita.sedeId,
        recordNumber: `HC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: "Creado automáticamente desde reservación web.",
        registrationDate: new Date().toISOString().split("T")[0],
        treatmentsHistory: [],
      };
      setPacientes((prev) => [newPaciente, ...prev]);
    }

    // Decrement promo slots if applicable
    if (newCita.promoApplied) {
      setPromociones((prev) =>
        prev.map((p) => {
          if (p.id === newCita.promoApplied && p.cuposDisponibles > 0) {
            return { ...p, cuposDisponibles: p.cuposDisponibles - 1 };
          }
          return p;
        })
      );
    }

    setCitas((prev) => [formattedCita, ...prev]);
    return formattedCita;
  };

  const updateAppointmentStatus = (id: string, status: Cita["status"]) => {
    setCitas((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          // If status is marked as "atendida", we simulate adding to patient treatment history!
          if (status === "atendida" && c.status !== "atendida") {
            const patient = pacientes.find((p) => p.dni === c.patientDni || p.phone === c.patientPhone);
            if (patient) {
              const updatedHistory = [
                {
                  date: c.date,
                  treatment: c.serviceId.replace("srv-", "").replace("-", " ").toUpperCase(),
                  specialistName: c.specialistId === "esp-1" ? "Dr. Carlos Mendoza" : 
                                  c.specialistId === "esp-2" ? "Dra. Sofía Benavides" :
                                  c.specialistId === "esp-3" ? "Dr. Luis Tapia" : "Dra. Natalia Ruiz",
                  notes: c.notes || "Tratamiento concluido de forma satisfactoria.",
                  cost: c.cost,
                },
                ...patient.treatmentsHistory,
              ];
              setPacientes((pk) =>
                pk.map((p) => (p.id === patient.id ? { ...p, treatmentsHistory: updatedHistory } : p))
              );
            }
          }
          return { ...c, status };
        }
        return c;
      })
    );
  };

  const updatePromotionDetails = (id: string, updates: Partial<Promocion>) => {
    setPromociones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addPatient = (newPaciente: Omit<Paciente, "id" | "recordNumber" | "registrationDate" | "treatmentsHistory">) => {
    const id = `pac-${Date.now()}`;
    const recordNumber = `HC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullPaciente: Paciente = {
      ...newPaciente,
      id,
      recordNumber,
      registrationDate: new Date().toISOString().split("T")[0],
      treatmentsHistory: [],
    };
    setPacientes((prev) => [fullPaciente, ...prev]);
    return fullPaciente;
  };

  const addPatientTreatment = (patientId: string, treatment: { treatment: string; specialistName: string; notes: string; cost: number }) => {
    setPacientes((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            treatmentsHistory: [
              {
                date: new Date().toISOString().split("T")[0],
                ...treatment,
              },
              ...p.treatmentsHistory,
            ],
          };
        }
        return p;
      })
    );
  };

  // Bot response dispatcher
  const submitChat = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      // Keep only last 10 messages of history to avoid payload bloat
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      const data = await res.json();
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat dispatch failed:", err);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: "Estimado paciente, tuvimos un contratiempo de red. Escríbenos directamente o llámanos a nuestro número de contacto principal **+51 970 165 171** para ayudarte al instante con una cita.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    pacientes,
    citas,
    promociones,
    campaigns,
    blogs,
    activeTab,
    changeTab,
    addAppointment,
    updateAppointmentStatus,
    updatePromotionDetails,
    addPatient,
    addPatientTreatment,
    // Chat utilities
    messages,
    isChatLoading,
    submitChat,
    setMessages
  };
}
