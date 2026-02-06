import dotenv from 'dotenv';
import { spawn } from 'node:child_process';
import { waitForPostgres } from './wait-for-postgres';
import { waitForRedis } from './wait-for-redis';

dotenv.config({ path: '.env.development' });

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

async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`\n🛑 Dev encerrando (${signal})...`);

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

    console.log('✅ Servidor finalizado.');
  }

  console.log('📦 Parando containers...');
  await execute('npm', ['run', 'services:stop']);

  process.exit(0);
}

['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach((sig) =>
  process.on(sig, shutdown),
);

process.on('uncaughtException', async (err) => {
  console.error('💥 uncaughtException:', err);
  await shutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  console.error('💥 unhandledRejection:', reason);
  await shutdown('unhandledRejection');
});

async function main() {
  if (!process.env.POSTGRES_URL || !process.env.REDIS_URL) {
    console.error('❌ POSTGRES_URL ou REDIS_URL não definidos');
    process.exit(1);
  }

  console.log('📦 Subindo containers...');
  await execute('npm', ['run', 'services:up']);

  await waitForPostgres({ connectionString: process.env.POSTGRES_URL });
  await waitForRedis({ connectionString: process.env.REDIS_URL });

  console.log('🔄 Rodando migrações...');
  const migrationCode = await execute('npm', ['run', 'prisma:migrate']);

  if (migrationCode !== 0) {
    console.error('❌ Migração falhou');
    await shutdown('migration_failed');
    return;
  }

  console.log('🚀 Iniciando servidor...');
  serverProcess = run('npx', ['tsx', 'watch', 'src/server.ts']);

  serverProcess.on('exit', (code: number | null) => {
    if (!shuttingDown) {
      console.log(`⚠️ Server caiu com código ${code}`);
      shutdown('server_exit');
    }
  });
}

main();
