import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      "@type": "/types",
      "@client": "/srcTs/client",
      "@base": "/srcTs/base",
      "@util": "/srcTs/util",
      "@utils_": "/srcTs/utils.ts",
      "@log": "/srcTs/log",
      "@handlers": "/srcTs/handlers"
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['srcTs/**/*.test.ts']
  },
});
