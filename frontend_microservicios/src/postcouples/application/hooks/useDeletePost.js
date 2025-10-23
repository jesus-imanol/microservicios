import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para eliminar un post
 * Actualiza optimísticamente la UI
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCouplesService.deletePost,
    onMutate: async (postId) => {
      // Cancela refetch en curso para evitar sobrescribir actualización optimista
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot del valor previo
      const previousPosts = queryClient.getQueryData(['posts']);

      // Actualización optimista: remueve el post de la caché
      queryClient.setQueryData(['posts'], (old) =>
        old?.filter((post) => post.id !== postId)
      );

      return { previousPosts };
    },
    onError: (error, postId, context) => {
      // Si hay error, revierte al estado previo
      queryClient.setQueryData(['posts'], context.previousPosts);
      console.error('Error al eliminar post:', error);
    },
    onSettled: () => {
      // Siempre refrescar después de éxito o error
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
