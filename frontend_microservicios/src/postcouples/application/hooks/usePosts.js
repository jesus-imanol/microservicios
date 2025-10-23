import { useQuery } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para obtener todos los posts
 * Usa React Query para cachear y manejar el estado de la petición
 */
export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postCouplesService.getAllPosts,
    staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
    refetchOnWindowFocus: true, // Refrescar al volver a la ventana
  });
};
