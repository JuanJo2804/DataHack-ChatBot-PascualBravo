# 🔗 Guía de Integración con Backend MCP

> Esta guía te ayudará a conectar el frontend con tu backend del chatbot MCP

## 📋 Contenidos

1. [Requisitos del Backend](#requisitos-del-backend)
2. [Especificación de Endpoints](#especificación-de-endpoints)
3. [Ejemplos de Implementación](#ejemplos-de-implementación)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos del Backend

Tu backend MCP debe:

- [ ] Estar en un **servidor separado** (puerto 3002 recomendado)
- [ ] Responder **JSON válido** con estructura consistente
- [ ] Tener **CORS habilitado** para http://localhost:3000
- [ ] Implementar **reintentos y timeouts** en conexiones
- [ ] Mantener **sesiones** con session IDs
- [ ] Validar entrada de datos

### Ejemplo de CORS (Express)

```javascript
const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://tudominio.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
```

---

## 🔌 Especificación de Endpoints

### 1. Enviar Mensaje al Chatbot

**Descripción**: Envía un mensaje del usuario y obtiene respuesta del chatbot MCP

**Request**:
```http
POST /api/chat/message
Content-Type: application/json
Accept: application/json

{
  "message": "¿Cuáles son los programas disponibles?",
  "sessionId": "session_1234567890_abcdef123",
  "timestamp": "2026-04-21T14:30:45.000Z",
  "userId": "user_123" // Opcional
}
```

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "message": "Los programas disponibles en Pascual Bravo son: Ingeniería...",
    "sessionId": "session_1234567890_abcdef123",
    "timestamp": "2026-04-21T14:30:50.000Z",
    "responseTime": 5000
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "No se pudo procesar la consulta",
  "message": "Error interno del servidor"
}
```

**Implementación Node.js/Express**:

```javascript
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId, timestamp, userId } = req.body;

    // Validar entrada
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El mensaje no puede estar vacío'
      });
    }

    // Procesar con MCP (tu lógica aquí)
    const response = await procesarConMCP(message, sessionId);

    // Guardar en historial (opcional)
    await guardarEnHistorial(sessionId, {
      message,
      response: response.message,
      timestamp
    });

    res.json({
      success: true,
      data: {
        message: response.message,
        sessionId,
        timestamp: new Date().toISOString(),
        responseTime: response.responseTime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

**Implementación Python/Flask**:

```python
from flask import Flask, request, jsonify
from datetime import datetime

@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        session_id = data.get('sessionId')

        if not message:
            return jsonify({
                'success': False,
                'error': 'El mensaje no puede estar vacío'
            }), 400

        # Procesar con MCP
        response = procesar_con_mcp(message, session_id)

        return jsonify({
            'success': True,
            'data': {
                'message': response['message'],
                'sessionId': session_id,
                'timestamp': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

---

### 2. Obtener Historial de Conversación

**Descripción**: Recupera el historial de mensajes de una sesión

**Request**:
```http
GET /api/chat/history?sessionId=session_1234567890_abcdef123&limit=50
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "text": "¿Cuáles son los programas?",
      "sender": "user",
      "timestamp": "2026-04-21T14:30:00.000Z"
    },
    {
      "id": 2,
      "text": "Los programas disponibles son...",
      "sender": "bot",
      "timestamp": "2026-04-21T14:30:05.000Z"
    }
  ],
  "total": 2,
  "sessionId": "session_1234567890_abcdef123"
}
```

**Implementación Express**:

```javascript
app.get('/api/chat/history', async (req, res) => {
  try {
    const { sessionId, limit = 50 } = req.query;

    const history = await obtenerHistorial(sessionId, {
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: history,
      total: history.length,
      sessionId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

### 3. Limpiar Conversación

**Descripción**: Limpia el historial de una sesión

**Request**:
```http
POST /api/chat/clear
Content-Type: application/json

{
  "sessionId": "session_1234567890_abcdef123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Conversación limpiada correctamente"
}
```

**Implementación Express**:

```javascript
app.post('/api/chat/clear', async (req, res) => {
  try {
    const { sessionId } = req.body;

    await limpiarHistorial(sessionId);

    res.json({
      success: true,
      message: 'Conversación limpiada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

### 4. Obtener Artículos (Opcional pero recomendado)

**Request**:
```http
GET /api/articulos
GET /api/articulos/{id}
POST /api/articulos
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Programas Disponibles 2026",
      "autor": "Admin",
      "categoria": "oferta-pregrados",
      "contenido": "Descripción completa...",
      "resumen": "Resumen corto...",
      "imagen": "base64_string_or_url",
      "categoriasOrientadas": ["oferta-pregrados", "fechas-inscripcion"],
      "fecha": "21/4/2026"
    }
  ]
}
```

---

## 🔧 Ejemplos de Implementación

### Backend Node.js/Express Mínimo

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// Almacenamiento en memoria (reemplazar con DB)
const sessions = {};

// Enviar mensaje
app.post('/api/chat/message', async (req, res) => {
  const { message, sessionId } = req.body;

  // Inicializar sesión si no existe
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  // Guardar mensaje del usuario
  sessions[sessionId].push({
    id: sessions[sessionId].length + 1,
    text: message,
    sender: 'user',
    timestamp: new Date().toISOString()
  });

  // Simular respuesta del MCP (reemplazar con MCP real)
  const botResponse = `Recibí tu pregunta: "${message}". Procesando...`;

  // Guardar respuesta
  sessions[sessionId].push({
    id: sessions[sessionId].length + 1,
    text: botResponse,
    sender: 'bot',
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    data: {
      message: botResponse,
      sessionId,
      timestamp: new Date().toISOString()
    }
  });
});

// Obtener historial
app.get('/api/chat/history', (req, res) => {
  const { sessionId } = req.query;
  const history = sessions[sessionId] || [];

  res.json({
    success: true,
    data: history,
    sessionId
  });
});

// Limpiar
app.post('/api/chat/clear', (req, res) => {
  const { sessionId } = req.body;
  delete sessions[sessionId];

  res.json({
    success: true,
    message: 'Conversación limpiada'
  });
});

app.listen(3002, () => {
  console.log('MCP Chatbot running on http://localhost:3002');
});
```

### Backend Python/Flask Mínimo

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Almacenamiento en memoria
sessions = {}

@app.route('/api/chat/message', methods=['POST'])
def chat_message():
    data = request.get_json()
    message = data.get('message')
    session_id = data.get('sessionId')

    # Inicializar sesión
    if session_id not in sessions:
        sessions[session_id] = []

    # Agregar mensaje del usuario
    sessions[session_id].append({
        'id': len(sessions[session_id]) + 1,
        'text': message,
        'sender': 'user',
        'timestamp': datetime.now().isoformat()
    })

    # Respuesta simulada (reemplazar con MCP)
    bot_response = f'Recibí tu pregunta: "{message}"'

    # Agregar respuesta
    sessions[session_id].append({
        'id': len(sessions[session_id]) + 1,
        'text': bot_response,
        'sender': 'bot',
        'timestamp': datetime.now().isoformat()
    })

    return jsonify({
        'success': True,
        'data': {
            'message': bot_response,
            'sessionId': session_id,
            'timestamp': datetime.now().isoformat()
        }
    })

@app.route('/api/chat/history', methods=['GET'])
def get_history():
    session_id = request.args.get('sessionId')
    history = sessions.get(session_id, [])

    return jsonify({
        'success': True,
        'data': history,
        'sessionId': session_id
    })

@app.route('/api/chat/clear', methods=['POST'])
def clear_chat():
    data = request.get_json()
    session_id = data.get('sessionId')

    if session_id in sessions:
        del sessions[session_id]

    return jsonify({
        'success': True,
        'message': 'Conversación limpiada'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3002, debug=True)
```

---

## 🧪 Testing

### Test con cURL

```bash
# Enviar mensaje
curl -X POST http://localhost:3002/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "¿Hola?",
    "sessionId": "test_session_123"
  }'

# Obtener historial
curl http://localhost:3002/api/chat/history?sessionId=test_session_123

# Limpiar
curl -X POST http://localhost:3002/api/chat/clear \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "test_session_123"}'
```

### Test desde el Frontend

```typescript
// En app/page.tsx o componente de test
import { chatbotService } from '@/app/lib/api/chatbot';

async function testBackend() {
  try {
    const response = await chatbotService.sendMessage('Test message');
    console.log('✅ Backend respondió:', response);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch from chatbot"

**Checklist**:
1. ¿El servidor está corriendo en el puerto correcto?
2. ¿CORS está habilitado?
3. ¿La URL en `.env.local` es correcta?

```bash
# Verificar que el servidor está corriendo
curl http://localhost:3002/api/chat/message
```

### Error: "Invalid JSON response"

**Solución**: Asegúrate que tu backend devuelve JSON válido:

```javascript
// ❌ Incorrecto
res.send('{"success": true}');

// ✅ Correcto
res.json({ success: true });
```

### Timeout en respuestas

**Aumentar timeout en frontend**:

```typescript
// En app/lib/api/config.ts
export const API_CONFIG = {
  TIMEOUT: 30000,  // 30 segundos
  RETRIES: 5,
  RETRY_DELAY: 2000,
};
```

### CORS error

Agrega headers en tu backend:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

---

## 📚 Siguiente Paso

Una vez tu backend esté configurado:

1. ✅ Cambia `useLocalStorage = false` en `app/lib/api/articulos.ts`
2. ✅ Actualiza las URLs en `.env.local`
3. ✅ Prueba los endpoints con cURL
4. ✅ Prueba desde el frontend

¡Tu chatbot MCP estará listo para producción! 🚀

---

**Última actualización**: 21 de Abril de 2026
