/**
 * Servicio de Artículos
 * 
 * Maneja toda la comunicación relacionada con artículos
 * Soporta tanto almacenamiento local (localStorage) como remoto (backend)
 */

import {
  Articulo,
  CreateArticuloPayload,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import { ARTICULOS_ENDPOINTS, API_CONFIG } from './config';

/**
 * Clase para manejar artículos
 * Puede trabajar con localStorage o con un backend remoto
 */
class ArticulosService {
  private useLocalStorage = true; // Cambiar a false cuando el backend esté listo

  /**
   * Obtiene todos los artículos
   * Primero intenta desde el backend, si falla usa localStorage
   */
  async getAll(): Promise<Articulo[]> {
    if (!this.useLocalStorage) {
      return this.getAllFromBackend();
    }
    return this.getAllFromLocalStorage();
  }

  /**
   * Obtiene artículos del backend
   */
  private async getAllFromBackend(): Promise<Articulo[]> {
    try {
      const response = await this.fetchWithRetry(
        ARTICULOS_ENDPOINTS.GET_ALL,
        { method: 'GET' }
      );

      if (!response.ok) {
        console.warn('Error obteniendo artículos del backend, usando localStorage');
        return this.getAllFromLocalStorage();
      }

      const data = await response.json() as ApiResponse<Articulo[]>;
      return data.data || [];
    } catch (error) {
      console.error('Error al obtener artículos del backend:', error);
      return this.getAllFromLocalStorage();
    }
  }

  /**
   * Obtiene artículos de localStorage
   */
  private getAllFromLocalStorage(): Articulo[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('articulos');
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene un artículo por ID
   */
  async getById(id: number | string): Promise<Articulo | null> {
    if (!this.useLocalStorage) {
      return this.getByIdFromBackend(id);
    }
    return this.getByIdFromLocalStorage(id);
  }

  /**
   * Obtiene artículo del backend
   */
  private async getByIdFromBackend(id: number | string): Promise<Articulo | null> {
    try {
      const response = await this.fetchWithRetry(
        ARTICULOS_ENDPOINTS.GET_BY_ID(id),
        { method: 'GET' }
      );

      if (!response.ok) {
        return this.getByIdFromLocalStorage(id);
      }

      const data = await response.json() as ApiResponse<Articulo>;
      return data.data || null;
    } catch (error) {
      console.error(`Error al obtener artículo ${id}:`, error);
      return this.getByIdFromLocalStorage(id);
    }
  }

  /**
   * Obtiene artículo de localStorage
   */
  private getByIdFromLocalStorage(id: number | string): Articulo | null {
    const articulos = this.getAllFromLocalStorage();
    return articulos.find((a) => a.id === Number(id)) || null;
  }

  /**
   * Crea un nuevo artículo
   */
  async create(payload: CreateArticuloPayload): Promise<Articulo | null> {
    if (!this.useLocalStorage) {
      return this.createInBackend(payload);
    }
    return this.createInLocalStorage(payload);
  }

  /**
   * Crea artículo en el backend
   */
  private async createInBackend(payload: CreateArticuloPayload): Promise<Articulo | null> {
    try {
      const response = await this.fetchWithRetry(
        ARTICULOS_ENDPOINTS.CREATE,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.warn('Error creando en backend, usando localStorage');
        return this.createInLocalStorage(payload);
      }

      const data = await response.json() as ApiResponse<Articulo>;
      return data.data || null;
    } catch (error) {
      console.error('Error al crear artículo en backend:', error);
      return this.createInLocalStorage(payload);
    }
  }

  /**
   * Crea artículo en localStorage
   */
  private createInLocalStorage(payload: CreateArticuloPayload): Articulo {
    const nuevoArticulo: Articulo = {
      id: Date.now(),
      ...payload,
      fecha: new Date().toLocaleDateString('es-ES'),
    };

    const articulos = this.getAllFromLocalStorage();
    const updated = [nuevoArticulo, ...articulos];
    localStorage.setItem('articulos', JSON.stringify(updated));

    return nuevoArticulo;
  }

  /**
   * Actualiza un artículo
   */
  async update(id: number | string, payload: Partial<Articulo>): Promise<Articulo | null> {
    if (!this.useLocalStorage) {
      return this.updateInBackend(id, payload);
    }
    return this.updateInLocalStorage(id, payload);
  }

  /**
   * Actualiza en el backend
   */
  private async updateInBackend(
    id: number | string,
    payload: Partial<Articulo>
  ): Promise<Articulo | null> {
    try {
      const response = await this.fetchWithRetry(
        ARTICULOS_ENDPOINTS.UPDATE(id),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        return this.updateInLocalStorage(id, payload);
      }

      const data = await response.json() as ApiResponse<Articulo>;
      return data.data || null;
    } catch (error) {
      console.error(`Error actualizando artículo ${id}:`, error);
      return this.updateInLocalStorage(id, payload);
    }
  }

  /**
   * Actualiza en localStorage
   */
  private updateInLocalStorage(
    id: number | string,
    payload: Partial<Articulo>
  ): Articulo | null {
    const articulos = this.getAllFromLocalStorage();
    const index = articulos.findIndex((a) => a.id === Number(id));

    if (index === -1) return null;

    articulos[index] = { ...articulos[index], ...payload };
    localStorage.setItem('articulos', JSON.stringify(articulos));

    return articulos[index];
  }

  /**
   * Elimina un artículo
   */
  async delete(id: number | string): Promise<boolean> {
    if (!this.useLocalStorage) {
      return this.deleteFromBackend(id);
    }
    return this.deleteFromLocalStorage(id);
  }

  /**
   * Elimina del backend
   */
  private async deleteFromBackend(id: number | string): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(
        ARTICULOS_ENDPOINTS.DELETE(id),
        { method: 'DELETE' }
      );

      if (!response.ok) {
        return this.deleteFromLocalStorage(id);
      }

      return true;
    } catch (error) {
      console.error(`Error eliminando artículo ${id}:`, error);
      return this.deleteFromLocalStorage(id);
    }
  }

  /**
   * Elimina de localStorage
   */
  private deleteFromLocalStorage(id: number | string): boolean {
    const articulos = this.getAllFromLocalStorage();
    const filtered = articulos.filter((a) => a.id !== Number(id));

    if (filtered.length === articulos.length) return false;

    localStorage.setItem('articulos', JSON.stringify(filtered));
    return true;
  }

  /**
   * Busca artículos por término
   */
  async search(query: string): Promise<Articulo[]> {
    const articulos = await this.getAll();
    const lowerQuery = query.toLowerCase();

    return articulos.filter(
      (a) =>
        a.titulo.toLowerCase().includes(lowerQuery) ||
        a.contenido.toLowerCase().includes(lowerQuery) ||
        a.resumen.toLowerCase().includes(lowerQuery) ||
        a.autor.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filtra artículos por categoría
   */
  async getByCategory(category: string): Promise<Articulo[]> {
    const articulos = await this.getAll();
    return articulos.filter((a) => a.categoriasOrientadas.includes(category));
  }

  /**
   * Cambia entre localStorage y backend
   * Útil para testing o transición gradual
   */
  setUseLocalStorage(use: boolean): void {
    this.useLocalStorage = use;
  }

  /**
   * Realiza fetch con reintentos
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = API_CONFIG.RETRIES
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeout);
        return response;
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve =>
          setTimeout(resolve, API_CONFIG.RETRY_DELAY)
        );
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }
}

// Exportar instancia única
export const articulosService = new ArticulosService();

export default ArticulosService;
