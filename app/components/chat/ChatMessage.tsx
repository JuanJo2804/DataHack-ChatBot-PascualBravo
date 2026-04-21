/**
 * Componente ChatMessage
 * Renderiza un mensaje individual del chat
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
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          message.sender === 'user'
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-gray-300 text-gray-900 rounded-bl-none'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
