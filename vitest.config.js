import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@':           resolve(__dirname, 'src'),
      '@features':   resolve(__dirname, 'src/features'),
      '@shared':     resolve(__dirname, 'src/shared'),
      '@api':        resolve(__dirname, 'src/api'),
      '@layouts':    resolve(__dirname, 'src/layouts'),
      '@routes':     resolve(__dirname, 'src/routes'),
      '@lib':        resolve(__dirname, 'src/lib'),
      '@utils':      resolve(__dirname, 'src/utils'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
