'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Articulo {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  contenido: string;
  resumen: string;
  imagen: string;
  categoriasOrientadas: string[];
  fecha: string;
}

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [messages, setMessages] = useState([
    { id: 1, text: '¡Hola! ¿En qué puedo ayudarte?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const articulosGuardados = JSON.parse(localStorage.getItem('articulos') || '[]');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setArticulos(articulosGuardados);
  }, []);

  const slides = [
    { id: 1, title: 'Formar', subtitle: 'Excelencia', color: 'bg-purple-900' },
    { id: 2, title: 'Servir', subtitle: 'Comunidad', color: 'bg-indigo-900' },
    { id: 3, title: 'Cuidar', subtitle: 'Ambiente', color: 'bg-purple-800' },
    { id: 4, title: 'Innovar', subtitle: 'Futuro', color: 'bg-violet-900' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages([...messages, newMessage]);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: 'Gracias por tu mensaje. Estamos aquí para ayudarte.',
        sender: 'bot'
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);

    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">PB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Pascual Bravo</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600 items-center">
            <a href="#" className="hover:text-purple-600">Académico</a>
            <a href="#" className="hover:text-purple-600">Bienestar</a>
            <button onClick={() => router.push('/articulos/new')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Publicar Artículo
            </button>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } ${slide.color}`}
          >
            <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex items-center">
              <div className="pl-12 text-white">
                <h2 className="text-6xl font-bold mb-4">{slide.title}</h2>
                <p className="text-4xl font-light">{slide.subtitle}</p>
              </div>
            </div>
            {/* Decorative flowers (placeholder) */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        ))}

        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-yellow-400 w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenido a Pascual Bravo</h1>
          <p className="text-xl text-gray-600">
            Una institución comprometida con la excelencia académica y el bienestar integral
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {['Formar', 'Servir', 'Cuidar'].map((item) => (
            <div key={item} className="bg-linear-to-br from-purple-50 to-indigo-50 p-8 rounded-lg border border-purple-200 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-purple-900 mb-3">{item}</h3>
              <p className="text-gray-700">
                Comprometidos con los valores que nos definen como institución universitaria.
              </p>
            </div>
          ))}
        </div>

        {/* Sección de Artículos Publicados */}
        {articulos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos Publicados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articulos.map((articulo) => (
                <div key={articulo.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {articulo.imagen && (
                    <img src={articulo.imagen} alt={articulo.titulo} className="w-full h-48 object-cover" loading="lazy" />
                  )}
                  <div className="p-4">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {articulo.categoriasOrientadas.map((cat) => (
                        <span key={cat} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          {cat.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{articulo.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{articulo.resumen}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{articulo.autor}</span>
                      <span>{articulo.fecha}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {articulos.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 mb-4">Aún no hay artículos publicados</p>
            <button
              onClick={() => router.push('/articulos/new')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Ser el primero en publicar
            </button>
          </div>
        )}
      </main>

      {/* Botón flotante de Chat */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all hover:shadow-xl z-40"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-2xl flex flex-col h-96 z-50 border border-gray-200">
          {/* Chat Header */}
          <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-bold text-lg">Asistente Pascual Bravo</h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:bg-purple-700 p-1 rounded"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-300 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40337462,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16350843 C3.34915502,0.9 2.40337462,0.9 1.77946707,1.4716179 C0.994623095,2.0430634 0.837654326,3.1328822 1.15159189,3.92062196 L3.03521743,10.3616149 C3.03521743,10.5187123 3.19218622,10.6758097 3.50612381,10.6758097 L16.6915026,11.4613055 C16.6915026,11.4613055 17.1624089,11.4613055 17.1624089,12.0328509 C17.1624089,12.6315722 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
