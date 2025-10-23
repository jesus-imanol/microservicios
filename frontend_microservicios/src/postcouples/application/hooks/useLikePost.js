import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para dar me gusta a un post
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      console.log('[useLikePost] Enviando like para post:', postId);
      const result = await postCouplesService.likePost(postId);
      console.log('[useLikePost] Respuesta:', result);
      return result;
    },
    
    // Actualización optimista
    onMutate: async (postId) => {
      console.log('[useLikePost] onMutate - postId:', postId);
      
      // Cancelar queries en curso
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot del estado anterior
      const previousPosts = queryClient.getQueryData(['posts']);

      // Actualizar optimistamente
      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return old;
        return old.map((post) =>
          post.id === postId
            ? { ...post, num_me_gusta: post.num_me_gusta + 1 }
            : post
        );
      });

      return { previousPosts };
    },

    onSuccess: () => {
      console.log('[useLikePost] Success!');
    },

    // Si falla, revertir
    onError: (err, postId, context) => {
      console.error('[useLikePost] Error:', err);
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },

    // Refrescar después de éxito o error
    onSettled: () => {
      console.log('[useLikePost] Settled - invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
