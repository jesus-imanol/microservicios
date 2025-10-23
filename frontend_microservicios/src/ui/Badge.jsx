/**
 * Componente Badge para tags estilo Instagram
 */
export const Badge = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
