
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostsPage } from './postcouples/pages/PostsPage';
import './App.css';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsPage />
    </QueryClientProvider>
  );
}

export default App;
