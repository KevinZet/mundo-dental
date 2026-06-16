import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Init AI client
const aiKey = process.env.GEMINI_API_KEY;
let ai: any = null;

if (aiKey) {
  ai = new GoogleGenAI({ apiKey: aiKey });
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Dental Bot Assistant
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "El mensaje es requerido" });
  }

  if (!ai) {
    // Graceful fallback when API key is missing
    return res.json({
      text: "¡Hola! Bienvenido a Mundo Dental 🦷. En este momento estoy operando en modo básico. Te puedo ayudar a contactar con nosotros vía WhatsApp (+51 970 165 171) para cualquiera de nuestras sedes:\n\nSJL Jardines (Jardines Este 524),\nSJL Próceres (Próceres de la Independencia 2257),\nMiraflores (Av. Petit Thouars 4350, Of. 304).",
      suggestedQuestions: ["¿Cuáles son las promociones?", "Quiero agendar cita", "Sedes de atención"],
    });
  }

  try {
    const systemInstruction = `
Eres "Dentibot", el asistente virtual de la clínica odontológica "Mundo Dental". Tu objetivo es asesorar a los pacientes sobre servicios, sedes, promociones y ayudarles a agendar citas.
Mantén un tono cálido, profesional, de confianza y empático. Responde en español de forma directa y resumida (un par de párrafos cortos como máximo, con emojis dentales 🦷✨).

INFORMACIÓN CLAVE DE MUNDO DENTAL:
- Eslogan: "Nuestra misión es tu sonrisa"
- Sedes en Lima (3):
  1) Jardines Este 524 - San Juan de Lurigancho (SJL).
  2) Próceres de la Independencia 2257 - SJL.
  3) Av. Petit Thouars 4350, Oficina 304 - Miraflores.
- Contactos / WhatsApp: +51 970 165 171 o +51 991 555 222.
- Especialidades clave:
  * Ortodoncia (Brackets: metálicos, estéticos, autoligantes)
  * Odontopediatría (niños)
  * Estética dental y Blanqueamiento dental
  * Implantología y Prótesis Dentales
  * Limpieza Dental, Profilaxis y Fluorización
  * Endodoncias, Curaciones con resinas y Rehabilitación Oral. El dolor de muela se considera una Emergencia Dental.
- Promociones vigentes:
  * Limpieza dental completa desde S/50 (incluye profilaxis).
  * Promoción escolar 2x100 soles (ideal para niños, incluye evaluación y fluorización/limpieza).
  * Citas de evaluación odontológica/diagnóstico totalmente gratuitas.
  * Hasta 50% de descuento en tratamientos especializados.

DIRECTIVAS:
- Invita siempre de forma sutil a agendar una cita por WhatsApp con un enlace fácil o indicando los números.
- Si el paciente pregunta precios específicos que no tenemos listados, dale un rango aproximado amigable e invita a la consulta gratuita de evaluación para presupuesto exacto.
- Genera respuestas estructuradas usando viñetas pequeñas para facilitar la lectura. No uses respuestas excesivamente largas.
`;

    // Process previous messages into formatted logs for content parameters
    const chatContents = history && history.length > 0 
      ? history.map((h: any) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        }))
      : [];

    chatContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const textResponse = response.text || "Disculpa, no pude procesar la consulta. ¿Podrías repetirla?";

    // Generate dynamic simple quick-reply suggestions based on response context
    let suggestedQuestions = ["Ver promociones", "Sedes de atención", "Agendar cita por WhatsApp"];
    const textLower = textResponse.toLowerCase();
    if (textLower.includes("sede") || textLower.includes("dirección") || textLower.includes("dónde")) {
      suggestedQuestions = ["¿Cómo llegar a las sedes?", "Horarios de atención", "Precios de Limpieza S/50"];
    } else if (textLower.includes("promo") || textLower.includes("precio") || textLower.includes("descuento")) {
      suggestedQuestions = ["Quiero la promo escolar 2x100", "Consulta Gratuita", "Sedes de atención"];
    } else if (textLower.includes("ortodoncia") || textLower.includes("brackets") || textLower.includes("niño")) {
      suggestedQuestions = ["¿Cuánto cuestan los brackets?", "Odontopediatría para niños", "Agendar Consulta"];
    }

    return res.json({
      text: textResponse,
      suggestedQuestions,
    });
  } catch (error: any) {
    console.error("Chat Assistant Error:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar el mensaje.",
      text: "Disculpa, tuve un pequeño contratiempo dental técnico. ¿Te gustaría que te comunique directamente por WhatsApp con recepción? Llamando o escribiendo al +51 970 165 171 te agendaremos al instante.",
      suggestedQuestions: ["Sedes de atención", "Promociones vigentes"],
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MUNDO DENTAL] Server running on http://localhost:${PORT}`);
  });
}

startServer();
