import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'openapi-schema.yaml',
    },
    output: {
      target: './src/api',
      schemas: './src/api/models',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useInfiniteQueryParam: 'page',
        },
      },
      mock: false,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

