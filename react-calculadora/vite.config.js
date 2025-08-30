import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE': JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'https://calculadora-production-d64c.up.railway.app/api' 
        : 'http://localhost:3000/api'
    )
  }
})
