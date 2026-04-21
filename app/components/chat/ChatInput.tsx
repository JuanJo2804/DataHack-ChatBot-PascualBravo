/**
 * Componente ChatInput
 * Campo de entrada para mensajes del usuario
 */

'use client';

import { FormEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder = 'Escribe tu mensaje...',
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {isLoading ? (
          <span className="inline-block animate-spin">⟳</span>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40337462,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16350843 C3.34915502,0.9 2.40337462,0.9 1.77946707,1.4716179 C0.994623095,2.0430634 0.837654326,3.1328822 1.15159189,3.92062196 L3.03521743,10.3616149 C3.03521743,10.5187123 3.19218622,10.6758097 3.50612381,10.6758097 L16.6915026,11.4613055 C16.6915026,11.4613055 17.1624089,11.4613055 17.1624089,12.0328509 C17.1624089,12.6315722 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
          </svg>
        )}
      </button>
    </form>
  );
}
