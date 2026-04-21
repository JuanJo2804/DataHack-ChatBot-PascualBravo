# 🚀 DataHack ChatBot - Frontend (Pascual Bravo)

> **Reto DataHack 2026**: Chatbot MCP que busca información en tiempo real desde el backend

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Guía de Integración Backend](#guía-de-integración-backend)
7. [Uso de Servicios](#uso-de-servicios)
8. [Componentes](#componentes)
9. [Hooks Personalizados](#hooks-personalizados)
10. [Variables de Entorno](#variables-de-entorno)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 📖 Descripción General

Este es el **frontend** de un reto DataHack para crear un **chatbot MCP** (Model Context Protocol) escalable que puede:

- **Responder preguntas en tiempo real** basadas en datos de la base de datos
- **Buscar información** sobre artículos, programas, costos, etc.
- **Mantener contexto** en conversaciones
- **Integrarse fácilmente** con backends externos

### Stack Tecnológico

- ⚛️ **React 19** con hooks
- 🔗 **Next.js 16** (App Router)
- 📘 **TypeScript** para type-safety
- 🎨 **Tailwind CSS v4** para estilos
- 💾 **localStorage** para persistencia local (transicional)
- 🔄 **API Service Layer** para comunicación backend

---

## 🏗️ Arquitectura

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐     ┌──────────────────────────────┐  │
│  │   UI Components  │     │   Hooks (useChat, etc)       │  │
│  │  - ChatModal     │────▶│                              │  │
│  │  - ChatInput     │     └────────────────┬─────────────┘  │
│  │  - ChatButton    │                      │                │
│  └──────────────────┘                      ▼                │
│                                   ┌──────────────────────┐   │
│                                   │   API Services       │   │
│                                   │ - chatbotService     │   │
│                                   │ - articulosService   │   │
│                                   └────────┬─────────────┘   │
│                                            │                 │
└────────────────────────────────────────────┼─────────────────┘
                                             │
                ┌────────────────────────────┼────────────────────┐
                │                            │                    │
                ▼                            ▼                    ▼
         ┌──────────────┐          ┌──────────────────┐   ┌────────────┐
         │ MCP Chatbot  │          │  API Backend     │   │ localStorage│
         │ Server       │          │  (Artículos)     │   │  (Local)   │
         │ (localhost:  │          │  (localhost:     │   │            │
         │  3002)       │          │   3001)          │   └────────────┘
         └──────────────┘          └──────────────────┘
```

### Estructura de Capas

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │  (Componentes React)
│  (ChatModal, ChatInput, Pages)          │
├─────────────────────────────────────────┤
│         BUSINESS LOGIC LAYER            │  (Hooks)
│  (useChat, useArticulos, etc)           │
├─────────────────────────────────────────┤
│         SERVICE LAYER                   │  (API Services)
│  (chatbotService, articulosService)     │
├─────────────────────────────────────────┤
│         DATA LAYER                      │  (localStorage, Backend)
│  (Persistencia de datos)                │
└─────────────────────────────────────────┘
```

---

## 📦 Instalación

### Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd DataHack-ChatBot-PascualBravo

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local

# 4. Editar .env.local con tus valores
nano .env.local

# 5. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local

# URL del servidor API backend (artículos, usuarios, etc.)
NEXT_PUBLIC_API_URL=http://localhost:3001

# URL del servidor MCP Chatbot
NEXT_PUBLIC_MCP_CHATBOT_URL=http://localhost:3002
```

### 2. Archivo de Configuración API

El archivo `app/lib/api/config.ts` contiene la configuración centralizada:

```typescript
// Cambiar endpoints según tu backend
export const CHATBOT_ENDPOINTS = {
  SEND_MESSAGE: `${MCP_CHATBOT_URL}/api/chat/message`,
  GET_RESPONSE: `${MCP_CHATBOT_URL}/api/chat/response`,
  GET_HISTORY: `${MCP_CHATBOT_URL}/api/chat/history`,
};

export const ARTICULOS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/api/articulos`,
  CREATE: `${API_BASE_URL}/api/articulos`,
  // ...
};
```

### 3. Configuración de Timeout y Reintentos

En `app/lib/api/config.ts`:

```typescript
export const API_CONFIG = {
  TIMEOUT: 10000,        // Timeout de 10 segundos
  RETRIES: 3,           // Reintentar 3 veces
  RETRY_DELAY: 1000,    // Esperar 1 segundo entre reintentos
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};
```

---

## 📂 Estructura del Proyecto

```
DataHack-ChatBot-PascualBravo/
├── app/
│   ├── lib/                          # Servicios y utilidades
│   │   ├── api/
│   │   │   ├── config.ts             # ⚙️ Configuración centralizada
│   │   │   ├── chatbot.ts            # 🤖 Servicio del chatbot MCP
│   │   │   ├── articulos.ts          # 📄 Servicio de artículos
│   │   │   └── index.ts              # Exportaciones
│   │   └── types/
│   │       └── index.ts              # 📘 Tipos TypeScript compartidos
│   │
│   ├── hooks/                        # Hooks personalizados
│   │   └── useChat.ts                # 💬 Lógica del chatbot
│   │
│   ├── components/
│   │   ├── chat/                     # Componentes del chatbot
│   │   │   ├── ChatModal.tsx         # Modal principal del chat
│   │   │   ├── ChatMessage.tsx       # Componente de mensaje
│   │   │   ├── ChatInput.tsx         # Campo de entrada
│   │   │   ├── ChatButton.tsx        # Botón flotante
│   │   │   └── index.ts              # Exportaciones
│   │   └── shared/                   # Componentes reutilizables
│   │
│   ├── articulos/                    # Páginas de artículos
│   │   └── new/
│   │       └── page.tsx              # Formulario de creación
│   │
│   ├── page.tsx                      # Página principal
│   ├── layout.tsx                    # Layout raíz
│   └── globals.css                   # Estilos globales
│
├── public/                           # Assets estáticos
├── .env.example                      # Plantilla de variables
├── .env.local                        # Variables locales (git ignorado)
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md                         # Este archivo
```

---

## 🔌 Guía de Integración Backend

### Paso 1: Configurar URLs del Backend

Edita `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://tu-servidor-api:3001
NEXT_PUBLIC_MCP_CHATBOT_URL=http://tu-servidor-mcp:3002
```

### Paso 2: Actualizar Endpoints (Opcional)

Si tus endpoints difieren, edita `app/lib/api/config.ts`:

```typescript
// Ejemplo: Si tu endpoint es /v1/chat/send
export const CHATBOT_ENDPOINTS = {
  SEND_MESSAGE: `${MCP_CHATBOT_URL}/v1/chat/send`,
  // ...
};
```

### Paso 3: Especificación de API Esperada

#### Endpoint: Enviar Mensaje al Chatbot

```http
POST /api/chat/message
Content-Type: application/json

{
  "message": "¿Cuáles son los programas disponibles?",
  "sessionId": "session_xyz",
  "timestamp": "2026-04-21T10:30:00.000Z"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "message": "Los programas disponibles son: ...",
    "sessionId": "session_xyz",
    "timestamp": "2026-04-21T10:30:05.000Z"
  }
}
```

#### Endpoint: Obtener Historial

```http
GET /api/chat/history?sessionId=session_xyz
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "¿Cuáles son los programas?",
      "sender": "user",
      "timestamp": "2026-04-21T10:30:00Z"
    },
    {
      "id": 2,
      "text": "Los programas son: ...",
      "sender": "bot",
      "timestamp": "2026-04-21T10:30:05Z"
    }
  ]
}
```

#### Endpoint: Artículos

```http
GET /api/articulos
GET /api/articulos/{id}
POST /api/articulos
PATCH /api/articulos/{id}
DELETE /api/articulos/{id}
```

### Paso 4: Probar Integración

```typescript
// app/page.tsx o cualquier componente
'use client';

import { chatbotService } from '@/app/lib/api/chatbot';

export default function TestPage() {
  const handleTest = async () => {
    const response = await chatbotService.sendMessage('Hola');
    console.log('Respuesta del backend:', response);
  };

  return (
    <button onClick={handleTest}>
      Probar integración con backend
    </button>
  );
}
```

### Paso 5: Cambiar de localStorage a Backend

En `app/lib/api/articulos.ts`, cambia:

```typescript
class ArticulosService {
  private useLocalStorage = false;  // ← Cambiar a false cuando backend esté listo
}
```

---

## 🛠️ Uso de Servicios

### Servicio de Chatbot

```typescript
import { chatbotService } from '@/app/lib/api/chatbot';

// Enviar mensaje
const response = await chatbotService.sendMessage(
  '¿Cuál es el costo de los programas?',
  'session-id-123'
);
console.log(response.message);

// Obtener historial
const history = await chatbotService.getHistory('session-id-123');

// Limpiar chat
await chatbotService.clearChat('session-id-123');

// Búsqueda avanzada
const results = await chatbotService.search(
  'programas de ingeniería',
  { category: 'oferta-pregrados' }
);
```

### Servicio de Artículos

```typescript
import { articulosService } from '@/app/lib/api/articulos';

// Obtener todos
const articulos = await articulosService.getAll();

// Obtener uno
const articulo = await articulosService.getById(123);

// Crear
const nuevo = await articulosService.create({
  titulo: 'Mi Artículo',
  autor: 'Juan',
  categoria: 'oferta-pregrados',
  contenido: '...',
  resumen: '...',
  imagen: 'base64...',
  categoriasOrientadas: ['oferta-pregrados'],
});

// Buscar
const resultados = await articulosService.search('ingeniería');

// Por categoría
const porCategoria = await articulosService.getByCategory('oferta-pregrados');
```

---

## 🎨 Componentes

### ChatModal

Modal principal del chatbot con historial y entrada.

```typescript
import { ChatModal } from '@/app/components/chat';
import { useChat } from '@/app/hooks/useChat';

export default function Page() {
  const chat = useChat({ enableAutoSave: true });
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await chat.sendMessage(chat.inputValue);
  };

  return (
    <>
      <ChatModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={chat.messages}
        inputValue={chat.inputValue}
        onInputChange={chat.setInputValue}
        onSendMessage={handleSendMessage}
        isLoading={chat.isLoading}
        title="Asistente Pascual Bravo"
      />
    </>
  );
}
```

### ChatMessage

Componente individual de mensaje.

```typescript
import { ChatMessage } from '@/app/components/chat/ChatMessage';

<ChatMessage 
  message={{
    id: 1,
    text: "¡Hola!",
    sender: "bot"
  }} 
/>
```

### ChatInput

Campo de entrada para mensajes.

```typescript
import { ChatInput } from '@/app/components/chat/ChatInput';

<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSend}
  isLoading={false}
  placeholder="Tu pregunta..."
/>
```

### ChatButton

Botón flotante para abrir/cerrar chat.

```typescript
import { ChatButton } from '@/app/components/chat/ChatButton';

<ChatButton onClick={() => setIsOpen(!isOpen)} />
```

---

## 🪝 Hooks Personalizados

### useChat

Hook principal para manejar la lógica del chatbot.

```typescript
import { useChat } from '@/app/hooks/useChat';

export default function Component() {
  const chat = useChat({
    initialMessages: [
      { id: 1, text: '¡Hola!', sender: 'bot' }
    ],
    enableAutoSave: true,  // Guardar en localStorage
  });

  // Propiedades y métodos disponibles
  console.log(chat.messages);        // Array de mensajes
  console.log(chat.inputValue);      // Valor del input
  console.log(chat.isLoading);       // Si está cargando
  console.log(chat.error);           // Mensajes de error
  console.log(chat.sessionId);       // ID de sesión

  // Métodos
  chat.setInputValue('nuevo texto');
  await chat.sendMessage('¿Cómo estás?');
  await chat.clearChat();
  await chat.loadHistory();
  chat.resetError();
}
```

---

## 🔐 Variables de Entorno

### Desarrollo (.env.local)

```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# MCP Chatbot
NEXT_PUBLIC_MCP_CHATBOT_URL=http://localhost:3002

# Node env
NODE_ENV=development
```

### Producción (variables reales)

```bash
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_MCP_CHATBOT_URL=https://chatbot.tudominio.com
NODE_ENV=production
```

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar CLI de Vercel
npm i -g vercel

# Deploy
vercel

# Con variables de entorno
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_MCP_CHATBOT_URL
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
```

### Netlify

Crea `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@/app/lib/api'"

**Solución**: Verifica que `jsconfig.json` o `tsconfig.json` tiene la configuración de paths:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Error: "CORS policy"

**Solución**: El backend debe tener CORS habilitado:

```javascript
// En tu backend (ejemplo con Express)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Chatbot no responde

**Checklist**:
1. ¿El servidor MCP está corriendo en el puerto correcto?
2. ¿La variable `NEXT_PUBLIC_MCP_CHATBOT_URL` está configurada?
3. ¿El backend devuelve JSON válido?
4. Abre DevTools (F12) y verifica la pestaña "Network"

### localStorage no persiste

**Solución**: Verifica que no estés en navegación privada/incógnita. Algunos navegadores deshabilitan localStorage en estos modos.

---

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 🤝 Contribuir

Este es un proyecto del reto DataHack 2026. Para contribuir:

1. Crea una rama para tu feature: `git checkout -b feature/mejora`
2. Commit tus cambios: `git commit -am 'Agrega mejora'`
3. Push a la rama: `git push origin feature/mejora`
4. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](./LICENSE) para más detalles.

---

## 👥 Autores

- **DataHack Team** - Reto 2026 Pascual Bravo

---

## 📞 Soporte

Para soporte técnico, contacta al equipo de desarrollo o abre un issue en el repositorio.

**Última actualización**: 21 de Abril de 2026
