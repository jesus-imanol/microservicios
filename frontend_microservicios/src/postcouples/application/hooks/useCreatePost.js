import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para crear un nuevo post
 * Invalida la caché de posts después de crear exitosamente
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCouplesService.createPost,
    onSuccess: () => {
      // Invalida y refresca la query de posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error al crear post:', error);
    },
  });
};
