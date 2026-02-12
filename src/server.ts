import { app } from '@/app';
import type { Server } from 'http';
import { config } from '@/config/config';
import { logger } from './core/logger/logger';

const PORT = config.app.port;

let server: Server;

function startServer() {
  server = app.listen(PORT, () => {
    logger.info(`🚀 Server rodando em http://localhost:${PORT}`);
  });
}

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`\n🛑 Encerrando servidor (${signal})...`);

  await new Promise<void>((resolve) => {
    server.close((err) => {
      if (err) {
        logger.error(err, '❌ Erro ao fechar servidor HTTP:');
      } else {
        logger.info('✅ Servidor HTTP fechado');
      }
      resolve();
    });
  });

  process.exit(0);
}

['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach((signal) => {
  process.on(signal, shutdown);
});

process.on('uncaughtException', async (err) => {
  logger.error(err, '💥 uncaughtException:');
  await shutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  logger.error(reason, '💥 unhandledRejection:');
  await shutdown('unhandledRejection');
});

startServer();
