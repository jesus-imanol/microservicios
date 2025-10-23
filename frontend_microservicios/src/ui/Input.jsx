import { forwardRef } from 'react';

/**
 * Componente Input estilo Instagram
 */
export const Input = forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`
        w-full px-4 py-2.5
        bg-gray-50 border-2 rounded-md
        text-sm text-gray-900 placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white
        disabled:bg-gray-100 disabled:cursor-not-allowed
        transition-all duration-200
        ${error ? 'border-red-400 focus:ring-red-500' : 'border-gray-200'}
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';
