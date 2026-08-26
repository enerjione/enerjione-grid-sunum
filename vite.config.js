import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Windows'ta bir dosya kopyalanirken (GLB / MP4 gibi buyuk dosyalar)
   izleyici o dosyaya girmeye calisirsa EBUSY firlatiyor ve sunucu
   cokuyordu. Hatayi yakalayip yok sayiyoruz. */
function watcherErrorGuard() {
  const soft = new Set(['EBUSY', 'EPERM', 'ENOENT', 'EACCES', 'EMFILE'])
  return {
    name: 'watcher-error-guard',
    configureServer(server) {
      server.watcher.on('error', (err) => {
        if (err && soft.has(err.code)) {
          server.config.logger.warn(`[izleyici] dosya mesgul, atlandi: ${err.path || err.message}`)
          return
        }
        server.config.logger.error(String(err))
      })
      process.on('uncaughtException', (err) => {
        if (err && soft.has(err.code)) {
          server.config.logger.warn(`[izleyici] dosya mesgul, atlandi: ${err.path || err.message}`)
          return
        }
        throw err
      })
    },
  }
}

export default defineConfig({
  base: './',                 // Electron file:// icin zorunlu
  plugins: [react(), watcherErrorGuard()],
  publicDir: false,
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 8000,
  },
  server: {
    port: 5199,
    open: true,
    watch: {
      awaitWriteFinish: { stabilityThreshold: 1200, pollInterval: 120 },
      ignorePermissionErrors: true,
      ignored: [
        '**/PICTURE/VIDEO/**',
        '**/_kullanilmiyor/**',
        '**/*.mp4', '**/*.mov', '**/*.avi', '**/*.mkv',
        '**/*.pdf', '**/*.docx', '**/*.pptx',
        '**/release/**', '**/dist/**', '**/node_modules/**',
      ],
    },
  },
})
