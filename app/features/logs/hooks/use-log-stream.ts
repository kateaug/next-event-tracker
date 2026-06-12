import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateMockLogs } from '../utils/generate-logs';
import { LogEntry } from '../schemas';

const LOG_QUERY_KEY = 'live-log-stream';

export function useLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const searchParams = useSearchParams();
  
  const activeLevel = searchParams.get('level');
  const activeService = searchParams.get('service');

  // Initialize once on load
  useEffect(() => {
    setLogs(generateMockLogs(4000));
  }, []);

  useQuery({
    queryKey: [LOG_QUERY_KEY, activeLevel, activeService],
    queryFn: async () => {
      const freshLogs = generateMockLogs(3);
      setLogs((prev) => [...freshLogs, ...prev].slice(0, 15000));
      return freshLogs;
    },
    refetchInterval: 1000,
  });

  return { logs };
}
