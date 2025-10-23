/**
 * Componente Card estilo Instagram
 * Blanco/Negro, bordes sutiles, sombras mínimas
 */
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`w-[80%] border border-gray-200 rounded-none  ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-10 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-10 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-10 py-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
