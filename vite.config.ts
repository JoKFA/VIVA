import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function vendorChunk(id: string) {
  const normalizedId = id.replace(/\\/g, '/')

  if (!normalizedId.includes('/node_modules/')) {
    return undefined
  }

  if (normalizedId.includes('/node_modules/@supabase/')) {
    return 'vendor-supabase'
  }

  if (
    normalizedId.includes('/node_modules/framer-motion/') ||
    normalizedId.includes('/node_modules/motion-dom/') ||
    normalizedId.includes('/node_modules/motion-utils/')
  ) {
    return 'vendor-motion'
  }

  if (normalizedId.includes('/node_modules/lucide-react/')) {
    return 'vendor-icons'
  }

  if (
    normalizedId.includes('/node_modules/react/') ||
    normalizedId.includes('/node_modules/react-dom/') ||
    normalizedId.includes('/node_modules/react-router-dom/') ||
    normalizedId.includes('/node_modules/scheduler/')
  ) {
    return 'vendor-react'
  }

  return 'vendor'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'SUPABASE_VITE_'],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: vendorChunk,
      },
    },
  },
})
