import { spawn } from 'node:child_process';
import { env } from '../src/config/env';
import { waitForPostgres } from './wait-for-postgres';
import { waitForRedis } from './wait-for-redis';
import { logger } from '../src/logger/logger';

const POSTGRES_URL =
  `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}` +
  `@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

const REDIS_URL = `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`;

// CONTROLE DE PROCESSO

let shuttingDown = false;
let serverProcess: ReturnType<typeof spawn> | null = null;

function execute(command: string, args: string[]): Promise<number | null> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    proc.on('exit', (code) => resolve(code));
  });
}

function run(command: string, args: string[]) {
  return spawn(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

// SHUTDOWN GRACEFUL

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`\n🛑 Dev encerrando (${signal})...`);

  if (serverProcess) {
    serverProcess.removeAllListeners('exit');

    const serverExited = new Promise((resolve) => {
      serverProcess!.on('exit', resolve);
    });

    serverProcess.kill('SIGTERM');

    await Promise.race([
      serverExited,
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    logger.info('✅ Servidor finalizado.');
  }

  logger.info('📦 Parando containers...');
  await execute('npm', ['run', 'services:stop']);

  process.exit(0);
}

['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach((sig) =>
  process.on(sig, shutdown),
);

process.on('uncaughtException', async (err) => {
  logger.error(err, '💥 uncaughtException:');
  await shutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  logger.error(reason, '💥 unhandledRejection:');
  await shutdown('unhandledRejection');
});

// BOOTSTRAP PRINCIPAL

async function main() {
  logger.info('📦 Subindo containers...');
  await execute('npm', ['run', 'services:up']);

  await waitForPostgres({ connectionString: POSTGRES_URL });
  await waitForRedis({ connectionString: REDIS_URL });

  logger.info('🔄 Rodando migrações...');
  const migrationCode = await execute('npm', ['run', 'prisma:migrate']);

  if (migrationCode !== 0) {
    logger.error('❌ Migração falhou');
    await shutdown('migration_failed');
    return;
  }

  logger.info('🚀 Iniciando servidor...');
  serverProcess = run('npx', ['tsx', 'watch', 'src/server.ts']);

  serverProcess.on('exit', (code: number | null) => {
    if (!shuttingDown) {
      logger.error(`⚠️ Server caiu com código ${code}`);
      shutdown('server_exit');
    }
  });
}

main();
