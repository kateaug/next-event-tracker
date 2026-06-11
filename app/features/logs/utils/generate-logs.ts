import { LogEntry, LogLevel, SERVICES } from '../schemas';

const MESSAGES: Record<LogLevel, string[]> = {
  info: ['User login successful', 'Cache hit for session token', 'Database connection verified', 'Worker sync completed'],
  warn: ['High memory threshold warning', 'API rate limit approaching for client IP', 'DB connection pool near limit'],
  error: ['Failed to process payment charge', 'Internal server error 500', 'Token verification expired', 'Database timeout'],
  debug: ['Payload size: 1024 bytes', 'Routing event dispatch initialised', 'Sanitising query params'],
};

export function generateMockLogs(count: number): LogEntry[] {
  const levels: LogLevel[] = ['info', 'info', 'info', 'debug', 'warn', 'error'];
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const messageList = MESSAGES[level];
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    
    let statusCode: number | undefined;
    if (level === 'error') statusCode = 500;
    else if (level === 'warn') statusCode = 429;
    else statusCode = 200;

    return {
      id: `log-${now}-${index}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(now - index * 1000).toISOString(),
      level,
      service,
      message,
      statusCode,
      latencyMs: level === 'info' ? Math.floor(Math.random() * 120) + 10 : Math.floor(Math.random() * 1200) + 200,
    };
  });
}
