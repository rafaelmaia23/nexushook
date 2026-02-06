import dotenv from 'dotenv';
import { app } from '@/app';
import type { Server } from 'http';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.env.development',
});

const PORT = Number(process.env.PORT) || 3000;

let server: Server;

function startServer() {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  });
}

let isShuttingDown = false;

async function shutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n🛑 Encerrando servidor (${signal})...`);

  await new Promise<void>((resolve) => {
    server.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar servidor HTTP:', err);
      } else {
        console.log('✅ Servidor HTTP fechado');
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
  console.error('💥 uncaughtException:', err);
  await shutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  console.error('💥 unhandledRejection:', reason);
  await shutdown('unhandledRejection');
});

startServer();
