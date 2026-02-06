import { createClient } from 'redis';

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

  process.stdout.write('🟡 Aguardando Redis');

  while (true) {
    const client = createClient({ url: connectionString });

    // Tratamento de erro básico para o EventEmitter do Redis não quebrar o processo
    client.on('error', () => {});

    try {
      await client.connect();
      await client.ping();
      await client.disconnect();

      console.log('\n🟢 Redis pronto');
      return;
    } catch {
      // Tenta desconectar para limpar handles pendentes
      try {
        await client.disconnect();
      } catch {
        // Ignora erro se já estiver desconectado
      }

      process.stdout.write('.');

      if (Date.now() - start > timeoutMs) {
        throw new Error('\n❌ Timeout aguardando Redis');
      }

      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
}
