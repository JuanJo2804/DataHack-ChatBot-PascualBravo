/**
 * Servicio de Chatbot RAG
 * 
 * Maneja toda la comunicación con el backend RAG de Pascual Bravo.
 * Endpoints:
 *   POST /sessions  → Crea nueva sesión conversacional
 *   POST /chat      → Envía pregunta y obtiene respuesta RAG con citas
 *   GET  /health    → Verifica estado del backend (DB + LLMs)
 */

import { ChatResponse, ChatApiResponse } from '../types';
import { CHATBOT_ENDPOINTS, API_CONFIG } from './config';

/**
 * Clase para manejar la comunicación con el backend RAG
 */
class ChatbotService {
  /**
   * Crea una nueva sesión conversacional en el backend
   * 
   * @returns session_id generado por el backend
   * 
   * @example
   * ```ts
   * const sessionId = await chatbotService.createSession();
   * // sessionId = "550e8400-e29b-41d4-a716-446655440000"
   * ```
   */
  async createSession(): Promise<string> {
    const response = await this.fetchWithRetry(
      CHATBOT_ENDPOINTS.SESSIONS,
      {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`Error creando sesión: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.session_id;
  }

  /**
   * Envía una pregunta al RAG y obtiene respuesta con citas
   * 
   * @param question - La pregunta del usuario
   * @param sessionId - ID de sesión (obtenido de createSession)
   * @returns Respuesta del chatbot con citas y confianza
   * 
   * @example
   * ```ts
   * const response = await chatbotService.sendMessage(
   *   '¿Cuáles son los programas disponibles?',
   *   'session-uuid'
   * );
   * console.log(response.message);       // "Los programas son... [1] [2]"
   * console.log(response.citations);      // [{ id: 1, url: "...", ... }]
   * console.log(response.confident);      // true
   * ```
   */
  async sendMessage(
    question: string,
    sessionId: string
  ): Promise<ChatResponse> {
    try {
      const payload = {
        session_id: sessionId,
        question,
      };

      const response = await this.fetchWithRetry(
        CHATBOT_ENDPOINTS.CHAT,
        {
          method: 'POST',
          headers: API_CONFIG.DEFAULT_HEADERS,
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          (errData as any).detail || `Error del servidor: HTTP ${response.status}`
        );
      }

      const data: ChatApiResponse = await response.json();

      return {
        message: data.answer,
        success: true,
        citations: data.citations,
        confident: data.confident,
      };
    } catch (error) {
      console.error('Error en sendMessage:', error);
      const errorMsg = error instanceof Error
        ? error.message
        : 'Lo siento, hubo un error al procesar tu pregunta.';
      return {
        message: errorMsg,
        success: false,
      };
    }
  }

  /**
   * Verifica el estado del backend RAG (DB + LLM providers)
   * 
   * @returns true si el backend está operativo
   * 
   * @example
   * ```ts
   * const isHealthy = await chatbotService.checkHealth();
   * if (!isHealthy) console.warn('Backend no disponible');
   * ```
   */
  async checkHealth(): Promise<{
    ok: boolean;
    status?: string;
    database?: boolean;
    providers?: string[];
  }> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.HEALTH, {
        method: 'GET',
      });

      if (!response.ok) {
        return { ok: false };
      }

      const data = await response.json();
      return {
        ok: data.status === 'ok',
        status: data.status,
        database: data.database,
        providers: data.providers,
      };
    } catch {
      return { ok: false };
    }
  }

  /**
   * Limpia la conversación (crea una nueva sesión)
   * Como el backend no tiene endpoint de clear, simplemente
   * retornamos un nuevo session_id
   */
  async clearChat(_sessionId: string): Promise<boolean> {
    // El backend RAG no expone endpoint de clear,
    // la estrategia es crear una nueva sesión
    return true;
  }

  /**
   * Stub para mantener compatibilidad con el hook
   * El backend RAG no expone endpoint de historial
   */
  async getHistory(_sessionId: string): Promise<never[]> {
    return [];
  }

  /**
   * Realiza fetch con reintentos automáticos y timeout
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
