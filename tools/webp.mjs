/* ==================================================================
   BÜYÜK ARKA PLAN GÖRSELLERİNİ WEBP'YE ÇEVİRİR

   Sunumun arka planları 7680x4320 PNG olarak çekildi; her biri ~24 MB.
   Yerelde sorun değil ama internet üzerinden ilk açılışta sayfa uzun
   süre boş kalıyordu. Bu betik onları 5120 piksel genişliğinde, q=92
   WebP'ye çevirir — gözle fark edilmeyen bir kayıpla ~16 kat küçülür.

   KULLANIM
     node tools/webp.mjs deneme    -> sadece boyutları gösterir
     node tools/webp.mjs           -> PICTURE/ içine .webp yazar

   sharp kurulu değilse:  npm i -D sharp

   Çevirdikten sonra PNG'leri PICTURE/ içinden çıkarın; aksi halde
   görsel arama PNG'yi bulur ve WebP kullanılmaz. Orijinaller
   _orijinal_gorseller/ klasöründe duruyor.
   ================================================================== */

import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const KAYNAK = path.join(KOK, '_orijinal_gorseller')
const HEDEF = path.join(KOK, 'PICTURE')

const GENISLIK = 5120          // 5K - sunum en fazla 1.30x yakinlasiyor
const KALITE = 92

const mb = (n) => (n / 1048576).toFixed(2) + ' MB'
const deneme = process.argv[2] === 'deneme'

const dosyalar = fs.existsSync(KAYNAK)
  ? fs.readdirSync(KAYNAK).filter((f) => /\.(png|jpe?g)$/i.test(f))
  : []

if (!dosyalar.length) {
  console.log('_orijinal_gorseller/ klasöründe çevrilecek görsel yok.')
  process.exit(0)
}

for (const ad of dosyalar) {
  const girdi = path.join(KAYNAK, ad)
  const eski = fs.statSync(girdi).size

  if (deneme) {
    for (const q of [80, 86, 92]) {
      const buf = await sharp(girdi).resize({ width: GENISLIK, withoutEnlargement: true })
        .webp({ quality: q, effort: 5 }).toBuffer()
      console.log(`${ad}  q=${q}  ${mb(buf.length)}`)
    }
    continue
  }

  const cikti = path.join(HEDEF, ad.replace(/\.[^.]+$/, '.webp'))
  await sharp(girdi)
    .resize({ width: GENISLIK, withoutEnlargement: true })
    .webp({ quality: KALITE, effort: 6 })
    .toFile(cikti)

  const yeni = fs.statSync(cikti).size
  console.log(`${ad} -> ${path.basename(cikti)}   ${mb(eski)} -> ${mb(yeni)}   (${(eski / yeni).toFixed(1)}x küçük)`)
}
