# 🤖 DataHack ChatBot - Frontend Pascual Bravo

> **Reto DataHack 2026**: Frontend escalable para un chatbot MCP que busca información en tiempo real desde el backend

## 🎯 Descripción del Proyecto

Este es el **frontend** de un sistema de chatbot inteligente que:

- 💬 Responde preguntas en **tiempo real** usando un backend con MCP (Model Context Protocol)
- 📚 Busca información sobre **artículos, programas, costos y más**
- 🔄 Mantiene contexto en conversaciones mediante **session IDs**
- 🏗️ Está diseñado para ser **altamente escalable y modular**
- ⚡ Funciona tanto con **localStorage local** como con **backend remoto**

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd DataHack-ChatBot-PascualBravo

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn

## 🏗️ Arquitectura Escalable

Para información detallada sobre la arquitectura, estructura de carpetas y cómo integrar el backend, lee:

📖 **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Documentación completa de integración

## ⚙️ Configuración Rápida

### 1. Configurar URLs del Backend

Edita `.env.local`:

```bash
# Backend API (artículos, datos, etc.)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Servidor MCP Chatbot
NEXT_PUBLIC_MCP_CHATBOT_URL=http://localhost:3002
```

### 2. Verificar Endpoints

Los endpoints están centralizados en `app/lib/api/config.ts`:

```typescript
export const CHATBOT_ENDPOINTS = {
  SEND_MESSAGE: `${MCP_CHATBOT_URL}/api/chat/message`,
  GET_HISTORY: `${MCP_CHATBOT_URL}/api/chat/history`,
  CLEAR_CHAT: `${MCP_CHATBOT_URL}/api/chat/clear`,
};

export const ARTICULOS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/api/articulos`,
  CREATE: `${API_BASE_URL}/api/articulos`,
  // ...
};
```

## 📂 Estructura del Proyecto

```
app/
├── lib/
│   ├── api/                 # 🔌 Servicios de API
│   │   ├── config.ts        # ⚙️ Configuración centralizada
│   │   ├── chatbot.ts       # 🤖 Servicio del chatbot
│   │   └── articulos.ts     # 📄 Servicio de artículos
│   └── types/               # 📘 Tipos TypeScript
├── hooks/                   # 🪝 Hooks personalizados
│   └── useChat.ts           # Lógica del chatbot
├── components/
│   └── chat/                # 💬 Componentes del chat
│       ├── ChatModal.tsx
│       ├── ChatMessage.tsx
│       ├── ChatInput.tsx
│       └── ChatButton.tsx
├── articulos/               # 📝 Páginas de artículos
├── page.tsx                 # 🏠 Página principal
└── layout.tsx               # 🎨 Layout
```

## 🔌 Integración con Backend

### Paso 1: Backend Mínimo Requerido

Tu backend debe tener estos endpoints:

```http
POST /api/chat/message
GET /api/chat/history?sessionId=xyz
POST /api/chat/clear
GET /api/articulos
```

### Paso 2: Formato de Respuesta Esperado

```json
{
  "success": true,
  "data": {
    "message": "Respuesta del chatbot"
  }
}
```

### Paso 3: Cambiar de localStorage a Backend

En `app/lib/api/articulos.ts`:

```typescript
class ArticulosService {
  private useLocalStorage = false;  // ← Cambiar cuando backend esté listo
}
```

## 🛠️ Servicios Disponibles

### Servicio de Chatbot

```typescript
import { chatbotService } from '@/app/lib/api/chatbot';

// Enviar mensaje
await chatbotService.sendMessage('¿Cuáles son los programas?');

// Obtener historial
await chatbotService.getHistory('session-id');

// Limpiar chat
await chatbotService.clearChat('session-id');
```

### Servicio de Artículos

```typescript
import { articulosService } from '@/app/lib/api/articulos';

// Obtener todos
const articulos = await articulosService.getAll();

// Buscar
const resultados = await articulosService.search('ingeniería');

// Por categoría
await articulosService.getByCategory('oferta-pregrados');
```

## 🪝 Hook useChat

```typescript
import { useChat } from '@/app/hooks/useChat';

export default function Page() {
  const chat = useChat({ enableAutoSave: true });

  const handleSend = async (e) => {
    e.preventDefault();
    await chat.sendMessage(chat.inputValue);
  };

  return (
    <div>
      {chat.messages.map(msg => (
        <p key={msg.id}>{msg.text}</p>
      ))}
      <input 
        value={chat.inputValue}
        onChange={(e) => chat.setInputValue(e.target.value)}
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
```

## 📝 Componentes Disponibles

- **ChatModal**: Modal principal del chatbot
- **ChatMessage**: Componente individual de mensaje
- **ChatInput**: Campo de entrada
- **ChatButton**: Botón flotante

## 🎨 Tecnologías

- ⚛️ React 19
- 🔗 Next.js 16 (Turbopack)
- 📘 TypeScript
- 🎨 Tailwind CSS v4
- 💾 localStorage (transicional)

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_MCP_CHATBOT_URL
```

### Docker

```bash
docker build -t datahack-chatbot .
docker run -p 3000:3000 datahack-chatbot
```

## 📚 Documentación Completa

Para información detallada sobre:
- Integración con backend
- Especificación de APIs
- Troubleshooting
- Variables de entorno
- Deployment

**Lee [ARCHITECTURE.md](./ARCHITECTURE.md)**

## 🐛 Troubleshooting

### El chatbot no responde
1. Verifica que el servidor MCP está corriendo
2. Revisa `NEXT_PUBLIC_MCP_CHATBOT_URL` en `.env.local`
3. Abre DevTools (F12) y revisa la pestaña "Network"

### Error CORS
Tu backend debe tener CORS habilitado:

```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
```

## 📞 Soporte

Para soporte, revisa [ARCHITECTURE.md](./ARCHITECTURE.md) o abre un issue en el repositorio.

---

**Última actualización**: 21 de Abril de 2026
**Reto**: DataHack 2026 - Pascual Bravo
