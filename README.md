# EnerjiOne GRID - Tanıtım Sunumu

Orta gerilim hatlarında arıza bölgesini daraltan EnerjiOne GRID platformunun,
kaydırma ile ilerleyen sinematik tanıtım sunumu. 27 slayt, Türkçe ve İngilizce.
React + Vite ile yazılmıştır; 3B cihaz modelleri three.js ile gösterilir.

Sunumu üç şekilde açabilirsiniz:

| Yöntem | Ne zaman |
| --- | --- |
| **Canlı yayın** (GitHub Pages) | Link paylaşmak, tarayıcıdan hızlı açmak için |
| **`SUNUM` klasörü** | Kurulumsuz, çevrimdışı sunum - Windows ve Mac |
| **`npm run dev`** | Sunumu düzenlemek için |

---

## Canlı yayın

<https://enerjione.github.io/enerjione-grid-sunum/>

`main` dalına her gönderimde sunum otomatik derlenir ve GitHub Pages'e yayınlanır
(yaklaşık 30 saniye). Yayın akışı: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Elle tetiklemek için: **Actions → Sunumu GitHub Pages'e yayınla → Run workflow**

## Kurulumsuz sürüm (çevrimdışı)

```bash
npm install
npm run build:offline
```

`SUNUM/` klasörü oluşur (~75 MB). Klasörün tamamını kopyalayın; içindeki
`index.html` dosyasına **çift tıklamak yeterlidir** - Windows'ta ve Mac'te,
hiçbir şey kurmadan, internet olmadan çalışır.

Bunun için iki şey yapılır: çıktı tek parça klasik `<script>` olarak üretilir
(tarayıcılar `file://` adresinde ES modül yüklemez) ve 3B modeller base64
gömülür (three.js modeli XHR ile okur, o da `file://` üzerinde engellidir).
Ayrıntı: [`vite.config.offline.js`](vite.config.offline.js)

## Geliştirme

```bash
npm install
npm run dev
```

---

## Sunumu düzenlemek

| Ne yapmak istiyorsunuz | Nereye bakın |
| --- | --- |
| Slayt metni, sırası, görseli | `src/slides.js` |
| Yeni görsel eklemek | `PICTURE/` klasörüne bırakın, dosya adıyla çağırın |
| Mobil ekran görüntüleri | `PICTURE/MOBILE/1.png, 2.png …` (etiketler `slides.js` içinde) |
| 3B model | `PICTURE/GLB/*.glb` |
| Marka logoları | `BRAND/` ve `BRAND/URUNLER/` |
| Sunucu paketi tablosu (S15) | `src/Platform.jsx` → `TIERS`, `CAP_ROWS` |
| Rol ve yetki matrisi | `src/Platform.jsx` → `ROLES` |
| Bildirim kanalları ve aşamaları | `src/Notify.jsx` → `CHANNELS`, `NSTEPS` |
| İngilizce çeviri | `src/i18n.js` |
| Görünüm / düzen | `src/styles.css` |

Görseller ve modeller klasörden otomatik bulunur; Türkçe karakterli dosya
adları da eşlenir.

### Dil

Sağ üstteki bayrak düğmeleriyle Türkçe ↔ İngilizce geçiş yapılır; seçim
tarayıcıda saklanır. Sunumun **hangi dille açılacağını** sabitlemek için
`src/i18n.js` içindeki `DEFAULT_LANG` değerini `'tr'` veya `'en'` yapın.

Çeviri sözlüğü Türkçe metni anahtar olarak kullanır. Bir slaytta metni
değiştirdiğinizde `src/i18n.js` içindeki karşılığını da güncelleyin; sözlükte
karşılığı olmayan metin İngilizcede olduğu gibi kalır.

`deepT()` yalnızca metin alanlarını çevirir. `image`, `model`, `icon`, `logo`,
`flag`, `id`, `type` gibi alanlar `SKIP_KEYS` listesindedir ve çeviriye
girmez - girseydi görseller bulunamazdı.

### İngilizce yazarken satır uzunluğu

İngilizce cümleler Türkçeden uzundur ve başlıklar fazladan satıra taşabilir.
Sözlükteki `\n` işaretleri satır sonlarını elle belirler; yeni bir başlık
çevirirken her satırı Türkçesiyle yaklaşık aynı uzunlukta tutun.

### Sunum sırasında

| | |
| --- | --- |
| Fare tekerleği, yön tuşları, PageUp/Down | Slaytlar arası geçiş |
| 3B cihazlar | Sürükleyerek çevirin, çift tık sıfırlar |
| Kapanış sayfasındaki kart | Sunumu yapan kişinin bilgileri - tıklayıp yazın |

---

## Tasarım kuralları

Sunum [impeccable.style/slop](https://impeccable.style/slop/) kataloğuna göre
denetlendi ve tespit edilen kalıplar giderildi. Yeni slayt eklerken aynı
disiplini korumak için:

| Kural | Gerekçe |
| --- | --- |
| **Uzun tire (—) kullanma**, kısa tire (-) kullan | Metinde AI ritmi izlenimi verir |
| **Her şey kart değil.** 2-4 maddelik liste kutulu kart değil, ayraçlı liste olsun | Aynı boy kart ızgarası en yaygın AI izi |
| **İkonu kutuya alma.** İkon yazının yanında düz dursun | "İkon kutusu + başlık + metin" jenerik şablondur |
| **Animasyon veriyi anlatsın.** Durum değişmiyorsa nabız atmasın | Süs animasyon dikkat çalar, bilgi vermez |
| **Parlama üç yerde:** arızalı cihaz, aktif sunucu, hub merkezi | Her kenar ışık saçınca vurgu kalmaz |
| **Mockup'ta gölge, kartta çerçeve.** İkisi birden değil | İnce çerçeve + geniş gölge birlikte kullanılmaz |
| **Cam efekti (blur) yalnızca iOS kilit ekranında** | Gerçek arayüzü taklit ettiği tek yer orası |
| **Kart köşesi 14 px.** Cihaz mockup'ları kendi oranını korur | 20 px üstü yuvarlaklık kartı yumuşak bloba çevirir |
| **Numara ancak gerçek bir sıra varsa** (alarm akışı, bildirim aşamaları) | Özellik listesine numara vermek sahte yapı kurar |
| **Başlıkta "X değil, Y" kalıbını tekrarlama** | Üst üste gelince yapay durur; giriş başlığı istisna |
| **Dekoratif grid / hale arka planı yok** | Grid yalnızca harita, plan, ölçüm yüzeylerinde |

Denetimi tekrarlamak için:

```bash
npx impeccable detect src
```

Beklenen çıktı: **0 hata**. Tek uyarı, WhatsApp mockup'ının nokta desenli duvar
kâğıdıdır; gerçek uygulamayı taklit ettiği için bilinçli bırakılmıştır.

---

## Görsel boyutları

Arka plan görselleri 7680x4320 PNG olarak çekildi (her biri ~24 MB). İnternet
üzerinden ilk açılışı hızlandırmak için 5120 piksel genişliğinde WebP'ye
çevrildiler - gözle fark edilmeyen bir kayıpla **~16 kat** küçüldüler
(48 MB -> 3 MB, ilk açılış 30 saniyeden 1 saniyeye indi). Orijinaller
`_orijinal_gorseller/` klasöründe duruyor.

Yeni bir büyük görseli aynı şekilde çevirmek için orijinali
`_orijinal_gorseller/` içine koyup:

```bash
node tools/webp.mjs deneme   # önce boyutlara bakın
node tools/webp.mjs          # PICTURE/ içine .webp yazar
```

PNG'yi `PICTURE/` içinde bırakmayın; görsel arama önce PNG'yi bulur ve WebP
kullanılmaz. Betik `sharp` kullanır; kurulu değilse `npm i -D sharp`.

## Depoda olmayanlar

`.gitignore` şunları dışarıda tutar: `node_modules/`, üretilen çıktılar
(`dist/`, `SUNUM/`, `release/`) ve `_orijinal_modeller/` - sunumda
kullanılmayan 56 MB'lik sıkıştırılmamış 3B model. Onu da yedeklemek
isterseniz `.gitignore` içinden ilgili satırı silin.
