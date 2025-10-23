import { apiClient } from './config';

/**
 * Servicio para manejar todas las operaciones CRUD de Posts
 */
export const postCouplesService = {
  /**
   * Obtener todos los posts
   * GET /post_couples
   */
  getAllPosts: async () => {
    const response = await apiClient.get('/post_couples');
    return response.data.data; // Extraer el array 'data' de la respuesta
  },

  /**
   * Obtener un post por ID
   * GET /posts/:id
   */
  getPostById: async (id) => {
    const response = await apiClient.get(`/post_couples/${id}`);
    return response.data;
  },

  /**
   * Buscar posts por tag
   * GET /post_couples/etiqueta/:tag
   */
  getPostsByTag: async (tag) => {
    const response = await apiClient.get(`/post_couples/tag/${tag}`);
    return response.data.data; // Extraer el array 'data' de la respuesta
  },

  /**
   * Crear un nuevo post
   * POST /post_couples
   * @param {Object} postData - { titulo, contenido, etiquetas, categoria, nombre_anonimo }
   */
  createPost: async (postData) => {
    const response = await apiClient.post('/post_couples', {
      titulo: postData.titulo,
      contenido: postData.contenido,
      etiquetas: postData.etiquetas,
      categoria: postData.categoria || 'General',
      nombre_anonimo: postData.nombre_anonimo || 'Anónimo'
    });
    return response.data;
  },

  /**
   * Actualizar un post existente
   * PUT /post_couples/:id
   * @param {string} id - ID del post
   * @param {Object} postData - { titulo, contenido, etiquetas, categoria }
   */
  updatePost: async (id, postData) => {
    const response = await apiClient.put(`/post_couples/${id}`, {
      titulo: postData.titulo,
      contenido: postData.contenido,
      etiquetas: postData.etiquetas,
      categoria: postData.categoria || 'General'
    });
    return response.data;
  },

  /**
   * Eliminar un post
   * DELETE /post_couples/:id
   */
  deletePost: async (id) => {
    const response = await apiClient.delete(`/post_couples/${id}`);
    return response.data;
  },

  /**
   * Dar me gusta a un post
   * PATCH /post_couples/:id/like
   */
  likePost: async (id) => {
    const response = await apiClient.patch(`/post_couples/${id}/like`);
    return response.data;
  },
};
