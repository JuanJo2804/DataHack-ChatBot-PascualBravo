/**
 * Hook personalizado useChat
 * 
 * Maneja toda la lógica del chatbot RAG incluyendo:
 * - Creación de sesión con POST /sessions
 * - Envío de preguntas con POST /chat
 * - Gestión de citas (citations) en las respuestas
 * - Indicador de confianza (confident)
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, Citation } from '@/app/lib/types';
import { chatbotService } from '@/app/lib/api/chatbot';

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  enableAutoSave?: boolean;
  /** Si true, crea la sesión automáticamente al montar el hook */
  autoCreateSession?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  /** Indica si la sesión fue creada exitosamente */
  isSessionReady: boolean;
  /** Indica si el backend está disponible */
  isBackendHealthy: boolean | null;
  
  // Métodos
  setInputValue: (value: string) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => Promise<void>;
  resetError: () => void;
  loadHistory: () => Promise<void>;
  /** Crea una nueva sesión en el backend */
  createSession: () => Promise<void>;
  /** Verifica la salud del backend */
  checkHealth: () => Promise<boolean>;
}

/**
 * Hook para manejar la lógica del chatbot RAG
 * 
 * @example
 * ```tsx
 * const chat = useChat({ autoCreateSession: true });
 * 
 * return (
 *   <>
 *     {chat.messages.map(msg => (
 *       <div key={msg.id}>
 *         <strong>{msg.sender}:</strong> {msg.text}
 *         {msg.citations?.map(c => (
 *           <a key={c.id} href={c.url}>[{c.id}] {c.title}</a>
 *         ))}
 *       </div>
 *     ))}
 *     <input 
 *       value={chat.inputValue}
 *       onChange={(e) => chat.setInputValue(e.target.value)}
 *     />
 *     <button 
 *       onClick={() => chat.sendMessage(chat.inputValue)}
 *       disabled={chat.isLoading || !chat.isSessionReady}
 *     >
 *       Enviar
 *     </button>
 *   </>
 * );
 * ```
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialMessages = [
      { id: 1, text: '¡Hola! Soy el asistente de Pascual Bravo. ¿En qué puedo ayudarte?', sender: 'bot' },
    ],
    enableAutoSave = false,
    autoCreateSession = true,
  } = options;

  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  
  // Referencias
  const sessionIdRef = useRef<string>('');
  const messageCountRef = useRef(initialMessages.length);
  const isCreatingSession = useRef(false);

  /**
   * Crea una nueva sesión en el backend RAG (POST /sessions)
   */
  const createSession = useCallback(async () => {
    if (isCreatingSession.current) return;
    isCreatingSession.current = true;

    try {
      setError(null);
      const newSessionId = await chatbotService.createSession();
      sessionIdRef.current = newSessionId;
      setIsSessionReady(true);
      console.log('Sesión creada:', newSessionId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error creando sesión';
      setError(errorMsg);
      setIsSessionReady(false);
      console.error('Error al crear sesión:', err);
    } finally {
      isCreatingSession.current = false;
    }
  }, []);

  /**
   * Verifica la salud del backend (GET /health)
   */
  const checkHealth = useCallback(async (): Promise<boolean> => {
    const result = await chatbotService.checkHealth();
    setIsBackendHealthy(result.ok);
    return result.ok;
  }, []);

  // Crear sesión automáticamente al montar
  useEffect(() => {
    if (autoCreateSession) {
      createSession();
    }
  }, [autoCreateSession, createSession]);

  // Guardar en localStorage si está habilitado
  useEffect(() => {
    if (enableAutoSave && typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      localStorage.setItem('chatSessionId', sessionIdRef.current);
    }
  }, [messages, enableAutoSave]);

  /**
   * Envía un mensaje al chatbot RAG (POST /chat)
   */
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      if (!isSessionReady || !sessionIdRef.current) {
        setError('No hay sesión activa. Reconectando...');
        await createSession();
        if (!sessionIdRef.current) {
          setError('No se pudo crear la sesión. ¿El backend está corriendo?');
          return;
        }
      }

      setError(null);
      setIsLoading(true);

      try {
        // Agregar mensaje del usuario
        const userMessage: ChatMessage = {
          id: messageCountRef.current + 1,
          text: message,
          sender: 'user',
          timestamp: new Date(),
        };
        messageCountRef.current++;

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');

        // Obtener respuesta del RAG
        const response = await chatbotService.sendMessage(
          message,
          sessionIdRef.current
        );

        if (!response.success) {
          throw new Error(response.message || 'Error al obtener respuesta');
        }

        // Agregar respuesta del bot con citas
        const botMessage: ChatMessage = {
          id: messageCountRef.current + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
          citations: response.citations,
          confident: response.confident,
        };
        messageCountRef.current++;

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMsg);
        console.error('Error en sendMessage:', err);

        // Agregar mensaje de error al chat
        const errorMessage: ChatMessage = {
          id: messageCountRef.current + 1,
          text: `Lo siento, hubo un error: ${errorMsg}`,
          sender: 'bot',
          timestamp: new Date(),
        };
        messageCountRef.current++;

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isSessionReady, createSession]
  );

  /**
   * Limpia el chat y crea una nueva sesión
   */
  const clearChat = useCallback(async () => {
    try {
      // Crear nueva sesión (equivale a limpiar el contexto en el RAG)
      await createSession();
      setMessages(initialMessages);
      messageCountRef.current = initialMessages.length;
      setError(null);
      setInputValue('');
    } catch (err) {
      console.error('Error al limpiar chat:', err);
      setError('No se pudo limpiar el chat');
    }
  }, [initialMessages, createSession]);

  /**
   * Carga el historial de la conversación
   * Nota: El backend RAG actual no expone un endpoint de historial
   */
  const loadHistory = useCallback(async () => {
    // El backend RAG no expone endpoint de historial por ahora
    console.info('El backend RAG no soporta cargar historial actualmente');
  }, []);

  /**
   * Resetea el error
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    inputValue,
    isLoading,
    error,
    sessionId: sessionIdRef.current,
    isSessionReady,
    isBackendHealthy,
    setInputValue,
    sendMessage,
    clearChat,
    resetError,
    loadHistory,
    createSession,
    checkHealth,
  };
}
