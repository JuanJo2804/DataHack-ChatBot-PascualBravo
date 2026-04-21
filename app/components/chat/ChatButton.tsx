/**
 * Componente ChatButton
 * Botón flotante para abrir/cerrar el chat
 */

'use client';

interface ChatButtonProps {
  onClick: () => void;
  className?: string;
}

export function ChatButton({ onClick, className = '' }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:shadow-xl z-40 ${className}`}
      aria-label="Abrir chat"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    </button>
  );
}
