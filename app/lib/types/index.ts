/**
 * Tipos compartidos para toda la aplicación
 */

// ===== Chat =====
export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  data?: any;
}

// ===== Artículos =====
export interface Articulo {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  contenido: string;
  resumen: string;
  imagen: string;
  categoriasOrientadas: string[];
  fecha: string;
}

export interface CreateArticuloPayload {
  titulo: string;
  autor: string;
  categoria: string;
  contenido: string;
  resumen: string;
  imagen: string;
  categoriasOrientadas: string[];
}

// ===== API Response =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
