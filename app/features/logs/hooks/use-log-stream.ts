import { useQuery } from '@tanstack/react-query';
import { NormalizedEvent } from '../schemas';

const QUERY_KEY = 'observatory-feed';

export function useLogStream() {
   const { data, isLoading, error } = useQuery<NormalizedEvent[]>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const res = await fetch('/api/logs');
      if (!res.ok) throw new Error('Failed to resolve server telemetry dataset');
      return res.json();
    },
    staleTime: 30000,           
    refetchInterval: 60000,     
    refetchOnWindowFocus: false, 
    initialData: [],
  });

  return {
    logs: data,
    isLoading,
    error,
  };
}