import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

/**
 * Barra de búsqueda por tags estilo Instagram
 */
export const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tag... (ej: Viaje, Playa, Aventura)"
            className="pl-12 pr-10 py-3.5 text-base"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary" size="md" className="min-w-[120px]">
          Buscar
        </Button>
      </div>
    </form>
  );
};
