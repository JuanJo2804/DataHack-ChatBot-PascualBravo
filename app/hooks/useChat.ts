/**
 * Hook personalizado useChat
 * 
 * Maneja toda la lógica del chatbot incluyendo:
 * - Envío y recepción de mensajes
 * - Gestión del estado de la conversación
 * - Integración con el servicio del chatbot
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatResponse } from '@/app/lib/types';
import { chatbotService } from '@/app/lib/api/chatbot';

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  enableAutoSave?: boolean;
}

interface UseChatReturn {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  sessionId: string;
  
  // Métodos
  setInputValue: (value: string) => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  resetError: () => void;
  loadHistory: () => Promise<void>;
}

/**
 * Hook para manejar la lógica del chatbot
 * 
 * @example
 * ```tsx
 * const chat = useChat({
 *   initialMessages: [],
 *   enableAutoSave: true,
 * });
 * 
 * return (
 *   <>
 *     {chat.messages.map(msg => (
 *       <div key={msg.id}>
 *         <strong>{msg.sender}:</strong> {msg.text}
 *       </div>
 *     ))}
 *     <input 
 *       value={chat.inputValue}
 *       onChange={(e) => chat.setInputValue(e.target.value)}
 *     />
 *     <button onClick={() => chat.sendMessage(chat.inputValue)}>
 *       Enviar
 *     </button>
 *   </>
 * );
 * ```
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialMessages = [
      { id: 1, text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' },
    ],
    enableAutoSave = false,
  } = options;

  // Estado
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Referencias
  const sessionIdRef = useRef<string>('');
  const messageCountRef = useRef(initialMessages.length);

  // Generar session ID al montar
  useEffect(() => {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Guardar en localStorage si está habilitado
  useEffect(() => {
    if (enableAutoSave && typeof window !== 'undefined') {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
      localStorage.setItem('chatSessionId', sessionIdRef.current);
    }
  }, [messages, enableAutoSave]);

  /**
   * Envía un mensaje al chatbot
   */
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

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

        // Obtener respuesta del chatbot
        const response = await chatbotService.sendMessage(
          message,
          sessionIdRef.current
        );

        if (!response.success) {
          throw new Error(response.message || 'Error al obtener respuesta');
        }

        // Agregar respuesta del bot
        const botMessage: ChatMessage = {
          id: messageCountRef.current + 1,
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
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
    []
  );

  /**
   * Limpia el chat
   */
  const clearChat = useCallback(async () => {
    try {
      await chatbotService.clearChat(sessionIdRef.current);
      setMessages(initialMessages);
      messageCountRef.current = initialMessages.length;
      setError(null);
      setInputValue('');
    } catch (err) {
      console.error('Error al limpiar chat:', err);
      setError('No se pudo limpiar el chat');
    }
  }, [initialMessages]);

  /**
   * Carga el historial de la conversación
   */
  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const history = await chatbotService.getHistory(sessionIdRef.current);
      if (history.length > 0) {
        setMessages(history);
        messageCountRef.current = history.length;
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('No se pudo cargar el historial');
    } finally {
      setIsLoading(false);
    }
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
    setInputValue,
    sendMessage,
    clearChat,
    resetError,
    loadHistory,
  };
}
