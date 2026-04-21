/**
 * Servicio de Chatbot MCP
 * 
 * Maneja toda la comunicación con el backend del MCP chatbot
 * Se encarga de enviar mensajes, obtener respuestas y gestionar la conversación
 */

import { ChatMessage, ChatResponse, ApiResponse } from '../types';
import { CHATBOT_ENDPOINTS, API_CONFIG } from './config';

/**
 * Clase para manejar la comunicación con el MCP Chatbot
 * Proporciona métodos para enviar mensajes y obtener respuestas
 */
class ChatbotService {
  /**
   * Envía un mensaje al chatbot MCP
   * 
   * @param message - El mensaje del usuario
   * @param sessionId - ID de sesión (opcional, para mantener contexto)
   * @returns Respuesta del chatbot
   * 
   * @example
   * ```ts
   * const response = await chatbotService.sendMessage('¿Cuáles son los programas disponibles?');
   * console.log(response.message);
   * ```
   */
  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<ChatResponse> {
    try {
      const payload = {
        message,
        sessionId: sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
      };

      const response = await this.fetchWithRetry(
        CHATBOT_ENDPOINTS.SEND_MESSAGE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json() as ApiResponse<{ message: string }>;

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar mensaje al chatbot');
      }

      return {
        message: data.data?.message || 'No se pudo obtener respuesta',
        success: data.success,
        data: data.data,
      };
    } catch (error) {
      console.error('Error en sendMessage:', error);
      return {
        message: 'Lo siento, hubo un error al procesar tu pregunta.',
        success: false,
      };
    }
  }

  /**
   * Obtiene el historial de la conversación
   * 
   * @param sessionId - ID de sesión
   * @returns Array de mensajes del historial
   */
  async getHistory(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await this.fetchWithRetry(
        `${CHATBOT_ENDPOINTS.GET_HISTORY}?sessionId=${sessionId}`,
        {
          method: 'GET',
        }
      );

      const data = await response.json() as ApiResponse<ChatMessage[]>;

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener historial');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error en getHistory:', error);
      return [];
    }
  }

  /**
   * Limpia la conversación del chatbot
   * 
   * @param sessionId - ID de sesión
   */
  async clearChat(sessionId: string): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(
        CHATBOT_ENDPOINTS.CLEAR_CHAT,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error en clearChat:', error);
      return false;
    }
  }

  /**
   * Realiza una búsqueda en la base de datos usando el chatbot
   * Útil para consultas más complejas
   * 
   * @param query - Consulta de búsqueda
   * @param filters - Filtros adicionales (opcional)
   */
  async search(
    query: string,
    filters?: Record<string, any>
  ): Promise<any[]> {
    try {
      const payload = {
        query,
        filters,
        timestamp: new Date().toISOString(),
      };

      const response = await this.fetchWithRetry(
        `${CHATBOT_ENDPOINTS.SEND_MESSAGE}/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json() as ApiResponse<any[]>;

      if (!response.ok) {
        throw new Error(data.error || 'Error en búsqueda');
      }

      return data.data || [];
    } catch (error) {
      console.error('Error en search:', error);
      return [];
    }
  }

  /**
   * Genera un ID de sesión único
   * Útil para mantener contexto entre conversaciones
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Realiza fetch con reintentos automáticos
   * Mejora la confiabilidad de la comunicación con el backend
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = API_CONFIG.RETRIES
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve =>
          setTimeout(resolve, API_CONFIG.RETRY_DELAY)
        );
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export const chatbotService = new ChatbotService();

export default ChatbotService;
