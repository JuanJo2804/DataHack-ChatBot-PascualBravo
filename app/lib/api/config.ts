/**
 * Configuración de API - Punto central para endpoints y configuración
 * 
 * Modifica estas variables para conectar con tu backend
 */

// ===== URLs DE ENDPOINTS =====
// En producción, usa variables de entorno (process.env.NEXT_PUBLIC_API_URL)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MCP_CHATBOT_URL = process.env.NEXT_PUBLIC_MCP_CHATBOT_URL || 'http://localhost:3002';

// ===== ENDPOINTS DE CHATBOT =====
export const CHATBOT_ENDPOINTS = {
  // Endpoint principal para enviar mensajes al chatbot MCP
  SEND_MESSAGE: `${MCP_CHATBOT_URL}/api/chat/message`,
  // Endpoint para obtener respuestas en tiempo real
  GET_RESPONSE: `${MCP_CHATBOT_URL}/api/chat/response`,
  // Endpoint para obtener historial
  GET_HISTORY: `${MCP_CHATBOT_URL}/api/chat/history`,
  // Endpoint para limpiar conversación
  CLEAR_CHAT: `${MCP_CHATBOT_URL}/api/chat/clear`,
} as const;

// ===== ENDPOINTS DE ARTÍCULOS =====
export const ARTICULOS_ENDPOINTS = {
  // Obtener todos los artículos
  GET_ALL: `${API_BASE_URL}/api/articulos`,
  // Obtener artículo por ID
  GET_BY_ID: (id: string | number) => `${API_BASE_URL}/api/articulos/${id}`,
  // Crear nuevo artículo
  CREATE: `${API_BASE_URL}/api/articulos`,
  // Actualizar artículo
  UPDATE: (id: string | number) => `${API_BASE_URL}/api/articulos/${id}`,
  // Eliminar artículo
  DELETE: (id: string | number) => `${API_BASE_URL}/api/articulos/${id}`,
  // Búsqueda y filtrado
  SEARCH: `${API_BASE_URL}/api/articulos/search`,
  // Obtener por categoría
  BY_CATEGORY: (category: string) => `${API_BASE_URL}/api/articulos/category/${category}`,
} as const;

// ===== CONFIGURACIÓN DE PETICIONES =====
export const API_CONFIG = {
  // Timeout para peticiones (en ms)
  TIMEOUT: 10000,
  // Reintentos automáticos para peticiones fallidas
  RETRIES: 3,
  // Delay entre reintentos (en ms)
  RETRY_DELAY: 1000,
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Obtiene la URL base de la API
 * Útil para cambiar dinámicamente según el ambiente
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // En servidor, usa variable de entorno
    return process.env.API_URL || API_BASE_URL;
  }
  // En cliente, usa la variable de entorno pública
  return process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
};

/**
 * Obtiene la URL del MCP chatbot
 */
export const getMcpChatbotUrl = (): string => {
  return process.env.NEXT_PUBLIC_MCP_CHATBOT_URL || MCP_CHATBOT_URL;
};

/**
 * Valida si una URL es válida
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
