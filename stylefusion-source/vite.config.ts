import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose the API_KEY env var to the client-side code.
    // JSON.stringify is needed because define does a literal text replacement.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});