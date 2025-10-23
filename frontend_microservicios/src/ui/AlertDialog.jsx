import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogHeader, DialogContent, DialogFooter } from './Dialog';
import { Button } from './Button';

/**
 * Alert Dialog para confirmaciones estilo Instagram
 */
export const AlertDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '¿Estás seguro?',
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <DialogContent className="text-center py-6">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-gray-100'}`}>
            <AlertTriangle 
              size={32} 
              className={variant === 'danger' ? 'text-red-600' : 'text-gray-600'} 
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-6">{description}</p>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
