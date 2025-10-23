import { MoreVertical, Heart, MessageCircle, Bookmark, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { useState } from 'react';
import { useLikePost } from '../application/hooks/useLikePost';

/**
 * Componente PostCard estilo Instagram
 * Card individual para mostrar un post
 */
export const PostCard = ({ post, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const likePostMutation = useLikePost();

  const handleLike = async () => {
    console.log('[PostCard] handleLike clicked for post:', post.id);
    try {
      setIsLiked(!isLiked);
      await likePostMutation.mutateAsync(post.id);
      console.log('[PostCard] Like successful');
    } catch (error) {
      console.error('[PostCard] Like error:', error);
      // Revertir el estado visual si falla
      setIsLiked(isLiked);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Card className="">
      {/* Header con título y menú */}
      <CardHeader className="flex flex-row items-start justify-between pb-6 border-b border-gray-100">
        <div className="flex-1 space-y-4">
          <h3 className="font-bold text-2xl text-gray-900 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
            {post.titulo}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-gray-900 hover:underline cursor-pointer">
              @{post.nombre_anonimo}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{formatDate(post.fecha_publicacion)}</span>
          </div>
        </div>
        
        {/* Menú de opciones */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} className="text-gray-600" />
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit(post);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(post);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="py-8 space-y-6">
        {/* Categoría */}
        <div>
          <Badge variant="primary" className="text-sm font-bold px-4 py-2">
            {post.categoria}
          </Badge>
        </div>
        
        {/* Texto del contenido */}
        <p className="text-gray-700 text-lg leading-loose whitespace-pre-wrap">
          {post.contenido}
        </p>
      </CardContent>

      {/* Footer con tags y acciones */}
      <CardFooter className="flex flex-col gap-6 pt-6">
        {/* Tags */}
        {post.etiquetas && post.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {post.etiquetas.map((tag, index) => (
              <Badge key={index} variant="default" className="text-sm font-semibold px-4 py-2 cursor-pointer hover:bg-gray-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Acciones estilo Twitter */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-12">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors group ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
              disabled={likePostMutation.isPending}
            >
              <Heart 
                size={20} 
                strokeWidth={2} 
                className={`group-hover:scale-110 transition-transform ${
                  isLiked ? 'fill-red-500' : 'group-hover:fill-red-500'
                }`}
              />
              <span className="text-sm font-medium">{post.num_me_gusta || 0}</span>
            </button>
            <button className="text-gray-600 hover:text-blue-500 transition-colors hover:scale-110">
              <MessageCircle size={20} strokeWidth={2} />
            </button>
            <button className="text-gray-600 hover:text-green-500 transition-colors hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 1l4 4-4 4" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <path d="M7 23l-4-4 4-4" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>
          <button className="text-gray-600 hover:text-blue-500 transition-colors hover:scale-110">
            <Bookmark size={20} strokeWidth={2} />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
