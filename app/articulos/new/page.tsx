'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CrearArticulo() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    categoria: '',
    contenido: '',
    resumen: '',
    categoriasOrientadas: [] as string[],
    imagen: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categoriasDisponibles = [
    { id: 'oferta-pregrados', label: 'Pregrados', icon: '🎓' },
    { id: 'oferta-posgrados', label: 'Posgrados', icon: '📚' },
    { id: 'oferta-tecnologias', label: 'Tecnologías', icon: '💻' },
    { id: 'fechas-inscripcion', label: 'Fechas de Inscripción', icon: '📅' },
    { id: 'costos', label: 'Costos', icon: '💰' },
    { id: 'perfiles-ocupacionales', label: 'Perfiles Ocupacionales', icon: '👨‍💼' },
    { id: 'requisitos-admision', label: 'Requisitos de Admisión', icon: '✅' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          imagen: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoriaChange = (categoriaId: string) => {
    setFormData(prev => ({
      ...prev,
      categoriasOrientadas: prev.categoriasOrientadas.includes(categoriaId)
        ? prev.categoriasOrientadas.filter(c => c !== categoriaId)
        : [...prev.categoriasOrientadas, categoriaId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que al menos una categoría está seleccionada
    if (formData.categoriasOrientadas.length === 0) {
      alert('Por favor selecciona al menos una categoría');
      return;
    }

    setIsSubmitting(true);

    // Crear objeto del artículo
    const nuevoArticulo = {
      id: Date.now(),
      ...formData,
      fecha: new Date().toLocaleDateString('es-ES')
    };

    // Obtener artículos existentes del localStorage
    const articulosExistentes = JSON.parse(localStorage.getItem('articulos') || '[]');

    // Agregar el nuevo artículo
    const articulosActualizados = [nuevoArticulo, ...articulosExistentes];

    // Guardar en localStorage
    localStorage.setItem('articulos', JSON.stringify(articulosActualizados));

    // Simular envío del formulario
    setTimeout(() => {
      console.log('Artículo creado:', nuevoArticulo);
      alert('¡Artículo publicado exitosamente!');
      router.push('/');
    }, 1000);
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
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
          >
            ← Volver
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Nuevo Artículo</h1>
          <p className="text-gray-600">Comparte tu conocimiento con la comunidad de Pascual Bravo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          {/* Título */}
          <div className="mb-6">
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-900 mb-2">
              Título del Artículo *
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ingresa un título atractivo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Autor */}
          <div className="mb-6">
            <label htmlFor="autor" className="block text-sm font-medium text-gray-900 mb-2">
              Nombre del Autor *
            </label>
            <input
              type="text"
              id="autor"
              name="autor"
              value={formData.autor}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Imagen del Artículo */}
          <div className="mb-6">
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-900 mb-2">
              Imagen del Artículo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imagen: '' }));
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-8l-4-4m0 0l-4 4m4-4v12m12 0a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <label htmlFor="imagen" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-purple-600 hover:text-purple-700">
                      Selecciona una imagen
                    </span>
                    <p className="mt-1 text-xs text-gray-500">O arrastra y suelta (JPG, PNG, GIF)</p>
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </div>
              )}
            </div>
          </div>

{/* Categorías Orientadas */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Categorías a las que está orientado este artículo *
            </label>
            <p className="text-xs text-gray-600 mb-4">
              Selecciona una o más categorías para que los usuarios puedan filtrar y encontrar tu artículo más fácilmente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoriasDisponibles.map((cat) => (
                <div key={cat.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    id={cat.id}
                    checked={formData.categoriasOrientadas.includes(cat.id)}
                    onChange={() => handleCategoriaChange(cat.id)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-600 cursor-pointer"
                  />
                  <label htmlFor={cat.id} className="ml-3 flex items-center gap-2 cursor-pointer flex-1">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-gray-700 font-medium">{cat.label}</span>
                  </label>
                </div>
              ))}
            </div>
            {formData.categoriasOrientadas.length === 0 && (
              <p className="text-sm text-red-500 mt-4">Por favor selecciona al menos una categoría</p>
            )}
            {formData.categoriasOrientadas.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Categorías seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.categoriasOrientadas.map((catId) => {
                    const cat = categoriasDisponibles.find(c => c.id === catId);
                    return (
                      <span
                        key={catId}
                        className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-purple-300"
                      >
                        {cat?.icon} {cat?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resumen */}
          <div className="mb-6">
            <label htmlFor="resumen" className="block text-sm font-medium text-gray-900 mb-2">
              Resumen *
            </label>
            <textarea
              id="resumen"
              name="resumen"
              value={formData.resumen}
              onChange={handleChange}
              required
              placeholder="Escribe un resumen breve del artículo (máximo 200 caracteres)"
              maxLength={200}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.resumen.length}/200</p>
          </div>

          {/* Contenido */}
          <div className="mb-8">
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-900 mb-2">
              Contenido del Artículo *
            </label>
            <textarea
              id="contenido"
              name="contenido"
              value={formData.contenido}
              onChange={handleChange}
              required
              placeholder="Escribe el contenido completo de tu artículo..."
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Artículo'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}