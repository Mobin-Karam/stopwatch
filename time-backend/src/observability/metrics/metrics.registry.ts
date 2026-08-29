import client from 'prom-client';

client.collectDefaultMetrics({
  prefix: 'time_backend_',
  register: client.register,
});

export const httpRequestDuration = new client.Histogram({
  name: 'time_backend_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

export const metricsRegister = client.register;
