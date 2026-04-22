/**
 * Índice de exportaciones - Servicios de API
 */

export { chatbotService } from './chatbot';
export { articulosService } from './articulos';
export { 
  CHATBOT_ENDPOINTS, 
  ARTICULOS_ENDPOINTS, 
  API_CONFIG,
  getApiBaseUrl,
  isValidUrl,
} from './config';

export type { ChatMessage, ChatResponse, ChatApiResponse, Citation, Articulo, ApiResponse } from '../types';
