'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useChat } from '@/app/hooks/useChat';
import { FeedbackRating } from '@/app/lib/types';

const feedbackReasonByRating: Record<Exclude<FeedbackRating, 'helpful'>, string> = {
  not_helpful: 'Esto no respondió mi pregunta',
  wrong: 'Esta información es incorrecta',
  incomplete: 'Me faltó información',
  missing_info: 'El bot dijo que no tenía información, pero debería',
};

const feedbackLabelByRating: Record<FeedbackRating, string> = {
  helpful: 'Útil',
  not_helpful: 'No respondió',
  wrong: 'Incorrecta',
  incomplete: 'Incompleta',
  missing_info: 'Falta info',
};

export default function Home() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [feedbackCommentByMessageId, setFeedbackCommentByMessageId] = useState<Record<number, string>>({});

  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isLoading,
    isSessionReady,
    error,
    feedbackByTurnId,
    feedbackLoadingTurnId,
    feedbackErrorByTurnId,
    submitFeedback,
  } = useChat({ autoCreateSession: true });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading || !isSessionReady) {
      return;
    }

    void sendMessage(inputValue);
  };

  const handleFeedback = (turnId: number, messageId: number, rating: FeedbackRating) => {
    const comment = feedbackCommentByMessageId[messageId]?.trim();
    const reason = comment || (rating === 'helpful'
      ? undefined
      : feedbackReasonByRating[rating]);

    void submitFeedback(turnId, rating, reason);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#121314] text-zinc-100">
      <div className="pointer-events-none absolute -left-28 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 pt-8 text-center">
          <p className="mb-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Asistente institucional
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            Chat de Pascual Bravo
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Haz una pregunta y recibe una respuesta basada en la base de conocimiento.
          </p>
        </header>

        <section className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div>
              <p className="text-sm font-medium text-zinc-100">Asistente IA</p>
              <p className="text-xs text-zinc-400">
                {isSessionReady ? 'Conectado y listo para responder' : 'Conectando con el backend...'}
              </p>
            </div>
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isSessionReady ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[90%] sm:max-w-[80%]">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-300 text-zinc-900'
                          : 'border border-white/10 bg-zinc-900/80 text-zinc-100'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.citations.map((citation) => (
                          <a
                            key={citation.id}
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate rounded-md border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-xs text-sky-200 transition-colors hover:bg-sky-400/20"
                            title={citation.snippet}
                          >
                            [{citation.id}] {citation.title}
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.sender === 'bot' && msg.confident === false && (
                      <p className="mt-1 px-1 text-xs text-amber-300">
                        Respuesta con baja confianza
                      </p>
                    )}

                    {msg.sender === 'bot' && msg.id > 1 && (
                      <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/60 p-3">
                        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                          ¿Te sirvió esta respuesta?
                        </p>

                        <textarea
                          value={feedbackCommentByMessageId[msg.id] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFeedbackCommentByMessageId((prev) => ({
                              ...prev,
                              [msg.id]: value,
                            }));
                          }}
                          maxLength={300}
                          placeholder="Comentario (opcional)"
                          disabled={typeof msg.turnId !== 'number' || (typeof msg.turnId === 'number' && Boolean(feedbackByTurnId[msg.turnId]))}
                          className="mb-3 min-h-20 w-full rounded-lg border border-white/15 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <div className="flex flex-wrap gap-2">
                          {(Object.keys(feedbackLabelByRating) as FeedbackRating[]).map((rating) => {
                            const turnId = msg.turnId;
                            const canSendFeedback = typeof turnId === 'number';
                            const alreadyRated = canSendFeedback
                              ? Boolean(feedbackByTurnId[turnId])
                              : false;
                            const isSelected = canSendFeedback
                              ? feedbackByTurnId[turnId] === rating
                              : false;
                            const isSending = canSendFeedback
                              ? feedbackLoadingTurnId === turnId
                              : false;

                            return (
                              <button
                                key={`${msg.id}-${rating}`}
                                type="button"
                                onClick={() => {
                                  if (typeof msg.turnId === 'number') {
                                    handleFeedback(msg.turnId, msg.id, rating);
                                  }
                                }}
                                disabled={!canSendFeedback || alreadyRated || isSending}
                                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                                  isSelected
                                    ? 'bg-emerald-300 text-zinc-900'
                                    : 'border border-white/20 bg-white/5 text-zinc-200 hover:bg-white/10'
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >
                                {feedbackLabelByRating[rating]}
                              </button>
                            );
                          })}
                        </div>

                        {typeof msg.turnId === 'number' && feedbackLoadingTurnId === msg.turnId && (
                          <p className="mt-2 text-xs text-zinc-400">Enviando feedback...</p>
                        )}

                        {typeof msg.turnId === 'number' && feedbackByTurnId[msg.turnId] && (
                          <p className="mt-2 text-xs text-emerald-300">
                            Gracias. Feedback registrado como: {feedbackLabelByRating[feedbackByTurnId[msg.turnId]]}
                          </p>
                        )}

                        {typeof msg.turnId === 'number' && feedbackErrorByTurnId[msg.turnId] && (
                          <p className="mt-2 text-xs text-red-300">
                            {feedbackErrorByTurnId[msg.turnId]}
                          </p>
                        )}

                        {typeof msg.turnId !== 'number' && (
                          <p className="mt-2 text-xs text-zinc-500">
                            Feedback no disponible para este turno porque el backend no devolvió turn_id.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-zinc-300">
                    <span className="inline-flex gap-1" aria-label="Generando respuesta">
                      <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '120ms' }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: '240ms' }}>●</span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5">
            {error && (
              <p className="mb-3 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isSessionReady ? 'Escribe tu pregunta...' : 'Conectando...'}
                disabled={isLoading || !isSessionReady}
                className="h-12 flex-1 rounded-xl border border-white/15 bg-zinc-950/70 px-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-300/50 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isLoading || !isSessionReady}
                className="h-12 rounded-xl bg-amber-300 px-5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                {isLoading ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}