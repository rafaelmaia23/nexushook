import { Client } from 'pg';
import { logger } from '../src/shared/logger/logger';

export interface PostgresOptions {
  connectionString: string;
  timeoutMs?: number;
  intervalMs?: number;
}

export async function waitForPostgres({
  connectionString,
  timeoutMs = 60_000,
  intervalMs = 1_000,
}: PostgresOptions) {
  const start = Date.now();

  logger.info('⏳ Aguardando PostgreSQL...');

  while (true) {
    const client = new Client({ connectionString });

    try {
      // Tenta estabelecer a conexão
      await client.connect();
      // Encerra a conexão imediatamente após o sucesso
      await client.end();

      logger.info('🟢 Postgres pronto');
      return;
    } catch {
      // Garante que o cliente seja limpo em caso de falha na conexão
      try {
        await client.end();
      } catch {
        // Ignora erros ao tentar fechar uma conexão que nem abriu
      }

      // Verifica se o tempo limite foi atingido
      if (Date.now() - start > timeoutMs) {
        logger.error('\n❌ Timeout aguardando Postgres');
      }

      // Aguarda o intervalo antes da próxima tentativa
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
}
