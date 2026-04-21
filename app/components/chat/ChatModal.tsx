/**
 * Componente ChatModal
 * Modal principal del chatbot con historial y entrada
 */

'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/app/lib/types';
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export function ChatModal({
  isOpen,
  onClose,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isLoading = false,
  title = 'Asistente Pascual Bravo',
  subtitle = 'Aquí para ayudarte',
}: ChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-2xl flex flex-col h-96 z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-purple-100">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-purple-700 p-1 rounded transition-colors"
          aria-label="Cerrar chat"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onSendMessage}
          isLoading={isLoading}
          placeholder="Escribe tu pregunta..."
        />
      </div>
    </div>
  );
}
