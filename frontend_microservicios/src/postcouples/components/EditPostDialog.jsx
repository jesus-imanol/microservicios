import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Badge } from '../../ui/Badge';
import { useUpdatePost } from '../application/hooks/useUpdatePost';

/**
 * Dialog para editar posts existentes
 */
export const EditPostDialog = ({ isOpen, onClose, post }) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const updatePostMutation = useUpdatePost();

  // Cargar datos del post cuando se abre el dialog
  useEffect(() => {
    if (post && isOpen) {
      setValue('titulo', post.titulo);
      setValue('contenido', post.contenido);
      setValue('categoria', post.categoria);
      setTags(post.etiquetas || []);
    }
  }, [post, isOpen, setValue]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data) => {
    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: {
          titulo: data.titulo,
          contenido: data.contenido,
          etiquetas: tags,
          categoria: data.categoria || 'General',
        },
      });
      
      handleClose();
    } catch (error) {
      console.error('Error al actualizar post:', error);
    }
  };

  const handleClose = () => {
    reset();
    setTags([]);
    setTagInput('');
    onClose();
  };

  if (!post) return null;

  return (
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <DialogHeader onClose={handleClose}>
        Editar Publicación
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <div className="space-y-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <Input
                {...register('categoria')}
                placeholder="General"
              />
            </div>

            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                {...register('titulo', { 
                  required: 'El título es requerido',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                })}
                placeholder="¿Qué quieres compartir?"
                error={!!errors.titulo}
              />
              {errors.titulo && (
                <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
              )}
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido *
              </label>
              <Textarea
                {...register('contenido', { 
                  required: 'El contenido es requerido',
                  minLength: { value: 10, message: 'Mínimo 10 caracteres' }
                })}
                placeholder="Escribe tu historia..."
                rows={6}
                error={!!errors.contenido}
              />
              {errors.contenido && (
                <p className="text-red-500 text-xs mt-1">{errors.contenido.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Agregar tag..."
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  variant="outline"
                  size="md"
                >
                  <Plus size={20} />
                </Button>
              </div>
              
              {/* Lista de tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="flex items-center gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={updatePostMutation.isPending}
          >
            {updatePostMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};
