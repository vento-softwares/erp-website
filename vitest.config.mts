import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': import.meta.dirname,
      // `server-only` throws outside a React Server environment; it's a no-op in tests.
      'server-only': path.join(import.meta.dirname, 'test/server-only-stub.ts'),
    },
  },
  test: {
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**'],
  },
});
