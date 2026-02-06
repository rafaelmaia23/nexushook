import { createClient } from 'redis';
import { logger } from '../src/logger/logger';

export interface RedisOptions {
  connectionString: string;
  timeoutMs?: number;
  intervalMs?: number;
}

export async function waitForRedis({
  connectionString,
  timeoutMs = 30_000,
  intervalMs = 1_000,
}: RedisOptions) {
  const start = Date.now();

  logger.info('⏳ Aguardando Redis...');

  while (true) {
    const client = createClient({ url: connectionString });

    // Tratamento de erro básico para o EventEmitter do Redis não quebrar o processo
    client.on('error', () => {});

    try {
      await client.connect();
      await client.ping();
      await client.destroy();

      logger.info('🟢 Redis pronto');
      return;
    } catch {
      // Tenta desconectar para limpar handles pendentes
      try {
        await client.destroy();
      } catch {
        // Ignora erro se já estiver desconectado
      }

      if (Date.now() - start > timeoutMs) {
        logger.error('\n❌ Timeout aguardando Redis');
      }

      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
}
