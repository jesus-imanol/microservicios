import { useQuery } from '@tanstack/react-query';
import { postCouplesService } from '../../infrastructure/api/postCouplesService';

/**
 * Hook para buscar posts por tag
 * @param {string} tag - Tag a buscar
 * @param {boolean} enabled - Si la query debe ejecutarse (para búsquedas condicionales)
 */
export const usePostsByTag = (tag, enabled = true) => {
  return useQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => postCouplesService.getPostsByTag(tag),
    enabled: enabled && !!tag, // Solo ejecutar si enabled es true y hay tag
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
