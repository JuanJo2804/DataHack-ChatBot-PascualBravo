/**
 * Componente ChatMessage
 * Renderiza un mensaje individual del chat con soporte para citas del RAG
 */

'use client';

import { ChatMessage as ChatMessageType } from '@/app/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="max-w-xs">
        <div
          className={`px-4 py-2 rounded-lg ${
            message.sender === 'user'
              ? 'bg-purple-600 text-white rounded-br-none'
              : 'bg-gray-300 text-gray-900 rounded-bl-none'
          }`}
        >
          {message.text}
        </div>

        {/* Renderizar citas si existen */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-1 space-y-1">
            {message.citations.map((citation) => (
              <a
                key={citation.id}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded hover:bg-purple-100 transition-colors truncate"
                title={citation.snippet}
              >
                [{citation.id}] {citation.title}
              </a>
            ))}
          </div>
        )}

        {/* Indicador de baja confianza */}
        {message.sender === 'bot' && message.confident === false && (
          <p className="text-xs text-amber-600 mt-1 px-1">
            ⚠ Respuesta con baja confianza
          </p>
        )}
      </div>
    </div>
  );
}
