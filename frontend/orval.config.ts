import { defineConfig } from 'orval';

export default defineConfig({
  authentication: {
    input: {
      target: 'http://95.216.121.250:8005/schema/',
      filters: {
        tags: ['Authentication'],
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/authentication/authentication.ts',
      schemas: 'src/api/authentication/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  users: {
    input: {
      target: 'http://95.216.121.250:8005/schema/',
      filters: {
        tags: ['Users'],
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/users/users.ts',
      schemas: 'src/api/users/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'src/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
