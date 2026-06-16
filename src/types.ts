export interface Especialista {
  id: string;
  name: string;
  specialty: string;
  cop: string; // Colegiado del Perú
  photo: string;
  stars: number;
}

export interface Sede {
  id: string;
  name: string;
  address: string;
  distrito: string;
  phone: string;
  mapEmbedUrl: string;
  googleMapsUrl: string;
  description: string;
  specialists: Especialista[];
  image: string;
}

export interface Servicio {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  detailedPoints: string[];
  duration: string;
  priceText: string;
  icon: string; // Lucide icon identifier
}

export interface Promocion {
  id: string;
  title: string;
  description: string;
  code: string;
  oldPrice: number;
  newPrice: number;
  cuposDisponibles: number;
  totalCupos: number;
  fechaVencimiento: string;
  isActive: boolean;
  isSchoolPromo?: boolean;
}

export interface Campania {
  id: string;
  title: string;
  subtitle: string;
  dateStr: string;
  durationHours: string;
  location: string;
  description: string;
  benefits: string[];
  gifts: string[];
  isActive: boolean;
}

export interface CitaTratamiento {
  date: string;
  treatment: string;
  specialistName: string;
  notes: string;
  cost: number;
}

export interface Paciente {
  id: string;
  name: string;
  phone: string;
  dni: string;
  age: number;
  email?: string;
  locationPreference: string; // Sede ID
  recordNumber: string; // Codigo HC
  notes: string;
  registrationDate: string;
  treatmentsHistory: CitaTratamiento[];
}

export interface Cita {
  id: string;
  patientName: string;
  patientPhone: string;
  patientDni: string;
  sedeId: string;
  serviceId: string;
  specialistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: "pendiente" | "confirmada" | "atendida" | "cancelada";
  notes: string;
  cost: number;
  promoApplied?: string; // Promo ID
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

// Chat interface
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
