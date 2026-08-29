import { Global, Module, OnModuleInit } from '@nestjs/common';
import { appLogger } from '../logger/pino-logger';

/**
 * Lightweight tracing hook. If @opentelemetry/sdk-node is available and
 * OTEL_EXPORTER_OTLP_ENDPOINT is set, tracing will be enabled; otherwise it is a no-op.
 */
@Global()
@Module({})
export class TracingModule implements OnModuleInit {
  async onModuleInit() {
    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (!endpoint) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { NodeSDK } = require('@opentelemetry/sdk-node');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
      const sdk = new NodeSDK({
        endpoint,
        instrumentations: [getNodeAutoInstrumentations()],
      });
      await sdk.start();
      appLogger.info({ msg: 'Tracing started', endpoint });
    } catch (err) {
      appLogger.warn({ msg: 'Tracing disabled (missing deps?)', err });
    }
  }
}
