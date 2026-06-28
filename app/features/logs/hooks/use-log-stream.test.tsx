import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogStream } from '../hooks/use-log-stream';
import { NormalizedEvent } from '../schemas';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, 
    },
  },
});

describe('useLogStream Custom Asynchronous Data Hook', () => {
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    if (!global.window.fetch) {
      global.window.fetch = jest.fn();
    }
    
    fetchSpy = jest.spyOn(global.window, 'fetch');
  });

  afterEach(() => {
    if (fetchSpy) {
      fetchSpy.mockRestore();
    }
  });

  it('should initialize with an empty array logs array on mount while loading', () => {
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogStream(), { wrapper });

    expect(result.current.logs).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should successfully populate logs array once the proxy endpoint completes', async () => {
    const mockPayload: NormalizedEvent[] = [
      {
        id: 'ak2026test',
        timestamp: '2026-06-28T12:00:00.000Z',
        readableTime: '2026-06-28 12:00:00 (UTC)',
        source: 'AK',
        category: 'earthquake',
        severity: 'critical',
        title: 'M 4.6 - Southern Alaska',
        message: 'Telemetry metrics verified.',
        metadata: { metricValue: 4.6, secondaryLabel: '10.0km Depth' },
      },
    ];

    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPayload),
      } as Response)
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogStream(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].id).toBe('ak2026test');
    expect(result.current.logs[0].severity).toBe('critical');
  });

  it('should catch error if the backend throws a 500 error', async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      } as Response)
    );

    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useLogStream(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.logs).toEqual([]);
  });
});