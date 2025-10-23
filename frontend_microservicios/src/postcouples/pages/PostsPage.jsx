import { useState } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import { usePosts } from '../application/hooks/usePosts';
import { useDeletePost } from '../application/hooks/useDeletePost';
import { usePostsByTag } from '../application/hooks/usePostsByTag';
import { PostFeed } from '../components/PostFeed';
import { SearchBar } from '../components/SearchBar';
import { CreatePostDialog } from '../components/CreatePostDialog';
import { EditPostDialog } from '../components/EditPostDialog';
import { AlertDialog } from '../../ui/AlertDialog';
import { Button } from '../../ui/Button';

/**
 * Página principal de Posts estilo Instagram
 */
export const PostsPage = () => {
  // Estados para modals
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  
  // Estado para búsqueda
  const [searchTag, setSearchTag] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Hooks de queries
  const { data: allPosts, isLoading: isLoadingAll } = usePosts();
  const { data: searchResults, isLoading: isLoadingSearch } = usePostsByTag(
    searchTag,
    isSearching
  );
  const deletePostMutation = useDeletePost();

  // Determinar qué posts mostrar
  const posts = isSearching ? searchResults : allPosts;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;

  // Handlers
  const handleSearch = (tag) => {
    setSearchTag(tag);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    setSearchTag('');
    setIsSearching(false);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPost) {
      await deletePostMutation.mutateAsync(selectedPost.id);
      setIsDeleteAlertOpen(false);
      setSelectedPost(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header con más espacio */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 w-full shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-pink-500 to-red-500 p-3 rounded-xl shadow-lg">
                  <Heart className="text-white" size={28} fill="white" />
                </div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
                  CouplesApp
                </h1>
              </div>
              <p className="text-sm text-gray-500 ml-16">
                Creado por <span className="font-semibold text-gray-700">Jesús Imanol Castillo Avendaño</span>
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-3 bg-black hover:bg-gray-800 text-white px-8 py-4 text-base font-bold shadow-lg hover:shadow-xl"
            >
              <Plus size={24} />
              Publicar
            </Button>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="w-full max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
          </div>
          
          {/* Indicador de búsqueda activa */}
          {isSearching && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-700 bg-blue-50 border border-blue-200 px-5 py-3 rounded-full inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Resultados para: <strong>#{searchTag}</strong>
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearSearch}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Ver todo
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Feed principal centrado con más espaciado */}
      <main className="w-full flex justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          <PostFeed
            posts={posts}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
      </main>

      {/* Dialogs */}
      <CreatePostDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      <EditPostDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => {
          setIsDeleteAlertOpen(false);
          setSelectedPost(null);
        }}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar publicación?"
        description="Esta acción no se puede deshacer. La publicación será eliminada permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};
