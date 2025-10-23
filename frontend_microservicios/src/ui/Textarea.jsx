import { forwardRef } from 'react';

/**
 * Componente Textarea estilo Instagram
 */
export const Textarea = forwardRef(({ 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        w-full px-3 py-2 
        bg-white border rounded-md
        text-sm text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
        disabled:bg-gray-100 disabled:cursor-not-allowed
        resize-none
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';
