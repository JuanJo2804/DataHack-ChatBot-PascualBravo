/**
 * Configuración de API - Punto central para endpoints y configuración
 * 
 * Conecta con el backend RAG en FastAPI (puerto 8000)
 */

// ===== URL BASE DEL BACKEND RAG =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ===== ENDPOINTS DEL CHATBOT RAG =====
export const CHATBOT_ENDPOINTS = {
  // Endpoint para enviar preguntas al RAG
  CHAT: `${API_BASE_URL}/chat`,
  // Endpoint para crear una nueva sesión conversacional
  SESSIONS: `${API_BASE_URL}/sessions`,
  // Endpoint para verificar estado del backend (DB + LLMs)
  HEALTH: `${API_BASE_URL}/health`,
  // Endpoint para registrar feedback de respuestas del asistente
  FEEDBACK: `${API_BASE_URL}/feedback`,
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
  // Timeout para peticiones (en ms) - mayor para el RAG que puede tardar
  TIMEOUT: 30000,
  // Reintentos automáticos para peticiones fallidas
  RETRIES: 2,
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
 */
export const getApiBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return process.env.API_URL || API_BASE_URL;
  }
  return process.env.NEXT_PUBLIC_API_URL || API_BASE_URL;
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
