import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@':           resolve(process.cwd(), 'src'),
      '@features':   resolve(process.cwd(), 'src/features'),
      '@shared':     resolve(process.cwd(), 'src/shared'),
      '@api':        resolve(process.cwd(), 'src/api'),
      '@layouts':    resolve(process.cwd(), 'src/layouts'),
      '@routes':     resolve(process.cwd(), 'src/routes'),
      '@lib':        resolve(process.cwd(), 'src/lib'),
      '@utils':      resolve(process.cwd(), 'src/utils'),
      '@components': resolve(process.cwd(), 'src/components'),
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
