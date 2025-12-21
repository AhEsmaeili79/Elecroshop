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
      target: 'app/api/authentication/authentication.ts',
      schemas: 'app/api/authentication/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'app/api/axios-instance.ts',
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
      target: 'app/api/users/users.ts',
      schemas: 'app/api/users/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: 'app/api/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
