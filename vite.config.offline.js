import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'

/* ==================================================================
   ÇEVRİMDIŞI SÜRÜM — hiçbir kurulum gerektirmeden açılır

   Amaç: index.html dosyasına çift tıklayınca Windows'ta ve Mac'te
   doğrudan tarayıcıda açılsın. Bunun için iki şey gerekiyor:

   1) Klasik <script> çıktısı
      Tarayıcılar file:// adresinde <script type="module"> yüklemez
      (CORS engeli). Bu yüzden tek parça IIFE üretiyoruz.

   2) 3B modeller base64 gömülü
      three.js GLB dosyasını XHR ile okur; file:// adresinde XHR de
      engelli. GLB'yi data URI olarak gömdüğümüzde three.js dosyayı
      ağa çıkmadan çözer.

   Görseller, yazı tipleri ve bayraklar <img>/CSS url() ile
   yüklendiği için dosya olarak kalabilir; onlar file:// üzerinde
   sorunsuz çalışır.
   ================================================================== */

const MODEL_MIME = { glb: 'model/gltf-binary', gltf: 'model/gltf+json' }

function inlineModels() {
  return {
    name: 'inline-models',
    enforce: 'pre',
    load(id) {
      const file = id.split('?')[0]
      const ext = file.split('.').pop().toLowerCase()
      if (!MODEL_MIME[ext]) return null
      const b64 = fs.readFileSync(file).toString('base64')
      return `export default "data:${MODEL_MIME[ext]};base64,${b64}"`
    },
  }
}

/* klasorun icine kisa bir kullanim notu birakir */
function readme(outDir) {
  const metin = [
    'ENERJIONE GRID — TANITIM SUNUMU',
    '================================',
    '',
    'KURULUM GEREKTIRMEZ.',
    '',
    'Windows : index.html dosyasina cift tiklayin.',
    'Mac     : index.html dosyasina cift tiklayin.',
    '',
    'Sunum varsayilan tarayicinizda acilir. Chrome, Edge, Safari ve',
    'Firefox ile calisir; internet baglantisi gerekmez.',
    '',
    'KULLANIM',
    '  Fare tekerlegi / trackpad  : slaytlar arasi gecis',
    '  Yon tuslari, PageUp/Down   : slaytlar arasi gecis',
    '  3B cihazlar                : surukleyerek cevirin, cift tik sifirlar',
    '  Tam ekran                  : F11 (Windows) / Ctrl+Cmd+F (Mac)',
    '',
    'ONEMLI',
    '  "icerik" klasoru sunumun parcasidir; silmeyin ve index.html ile',
    '  ayni klasorde kalsin. Tasirken klasorun tamamini kopyalayin.',
    '',
  ].join('\r\n')
  return {
    name: 'readme',
    closeBundle() {
      fs.writeFileSync(`${outDir}/OKU-BENI.txt`, metin, 'utf8')
    },
  }
}

/* module/crossorigin etiketlerini file:// uyumlu hale getirir */
function classicScripts() {
  return {
    name: 'classic-scripts',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/<script type="module" crossorigin/g, '<script defer')
        .replace(/<script type="module"/g, '<script defer')
        .replace(/ crossorigin(?=[ >])/g, '')
        .replace(/<link rel="modulepreload"[^>]*>/g, '')
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [inlineModels(), react(), classicScripts(), readme('SUNUM')],
  publicDir: false,
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    outDir: 'SUNUM',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    modulePreload: false,
    target: 'es2018',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 200000,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'icerik/sunum.js',
        assetFileNames: 'icerik/[name]-[hash][extname]',
      },
    },
  },
})
