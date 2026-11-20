// Loads the check through Vite so the app's aliases and import.meta.env work
import { resolve } from 'node:path';
import { createServer } from 'vite';

const src = (dir) => resolve(import.meta.dirname, '..', 'src', dir);

const server = await createServer({
  configFile: false,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  resolve: {
    alias: {
      '@constants': src('constants'),
      '@definition': src('definition'),
      '@services': src('services'),
    },
  },
});

// The app warns on every unrecognized label; the report lists them instead
console.warn = () => {};

try {
  const { default: main } = await server.ssrLoadModule(
    '/scripts/check-source-materials.ts'
  );
  await main();
} finally {
  await server.close();
}
