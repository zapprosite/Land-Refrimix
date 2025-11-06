import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    reporters: ['default'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      lines: 0.9,
      functions: 0.9,
      branches: 0.9,
      statements: 0.9,
      include: ['src/**'],
      exclude: ['src/server.ts'],
    },
  },
});
