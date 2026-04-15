import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';
import { AppRoutes } from '@/routes/index.jsx';
import PwaUpdateBanner from '@/shared/components/PwaUpdateBanner';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <PwaUpdateBanner />
    </QueryClientProvider>
  );
}
