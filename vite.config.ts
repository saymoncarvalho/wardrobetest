import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the use of process.env.API_KEY in the client-side code
    // without crashing during the build or runtime on Vercel.
    'process.env': process.env
  }
});