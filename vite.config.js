import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svrg from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    svrg()
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
