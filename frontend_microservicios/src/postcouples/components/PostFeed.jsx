import { Loader2 } from 'lucide-react';
import { PostCard } from './PostCard';

/**
 * Componente PostFeed
 * Grid de posts estilo Instagram
 */
export const PostFeed = ({ posts, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center min-h-[400px]">
        <Loader2 className="animate-spin text-gray-400" size={48} />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[800px] text-center py-20">
        <div className="w-32 h-32 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-6xl">📝</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">No hay publicaciones</h3>
        <p className="text-gray-600 text-lg max-w-md leading-relaxed">
          Sé el primero en compartir algo. Haz clic en el botón "Crear Post" para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
