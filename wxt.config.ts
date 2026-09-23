import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  manifest: {
    name: 'ChatVault',
    description: 'Back up and export AI chatbot conversations locally.',
    version: '0.1.0',
    permissions: ['storage'],
    host_permissions: [],
  },
});
