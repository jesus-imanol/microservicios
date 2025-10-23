import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para actualizar un post existente
 * Invalida la caché después de actualizar
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => postCouplesService.updatePost(id, data),
    onSuccess: () => {
      // Invalida las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error al actualizar post:', error);
    },
  });
};
