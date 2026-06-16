# Mundo Dental

Sistema web profesional para la clinica odontologica **Mundo Dental**, con 3 sedes en Lima (San Juan de Lurigancho y Miraflores).

Incluye pagina web publica con chatbot asistente por IA y panel CRM para gestion de citas, pacientes y promociones.

## Caracteristicas

- Landing page con informacion de servicios, sedes y promociones
- Chatbot "Dentibot" con asistente virtual para pacientes
- Galeria de antes y despues
- Blog dental
- Panel CRM para administracion de citas, pacientes e historial clinico
- Sistema de promociones con codigos de descuento

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Vite
- Express (backend para API del chatbot)
- Google Generative AI (Gemini) para el chatbot

## Ejecucion local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu GEMINI_API_KEY

# Ejecutar en desarrollo
npm run dev
```

## Build y produccion

```bash
npm run build
npm start
```

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `GEMINI_API_KEY` | API key de Google Generative AI para el chatbot |
| `APP_URL` | URL base de la aplicacion (opcional) |

## Estructura

```
src/
  components/     # Componentes React (Header, DentibotChat, AdminCRM, etc.)
  data.ts         # Datos mock de sedes, servicios, especialistas
  types.ts        # Definiciones de tipos TypeScript
  useDentalState.ts  # Logica de estado principal
  App.tsx          # Componente raiz
server.ts         # Backend Express con API del chatbot
```

## Licencia

Proyecto privado. Todos los derechos reservados.
