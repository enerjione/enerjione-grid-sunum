# EnerjiOne GRID — Tanıtım Sunumu

Orta gerilim hatlarında arıza bölgesini daraltan EnerjiOne GRID platformunun,
kaydırma ile ilerleyen sinematik tanıtım sunumu. React + Vite ile yazılmıştır;
3B cihaz modelleri three.js ile gösterilir.

Sunumu üç şekilde açabilirsiniz:

| Yöntem | Ne zaman |
| --- | --- |
| **Canlı yayın** (GitHub Pages) | Link paylaşmak, tarayıcıdan hızlı açmak için |
| **`SUNUM` klasörü** | Kurulumsuz, çevrimdışı sunum — Windows ve Mac |
| **`npm run dev`** | Sunumu düzenlemek için |

---

## Canlı yayın

`main` dalına her gönderimde sunum otomatik derlenir ve GitHub Pages'e yayınlanır.
Yayın akışı: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

Elle tetiklemek için: **Actions → Sunumu GitHub Pages'e yayınla → Run workflow**

## Kurulumsuz sürüm (çevrimdışı)

```bash
npm install
npm run build:offline
```

`SUNUM/` klasörü oluşur. Klasörün tamamını kopyalayın; içindeki `index.html`
dosyasına **çift tıklamak yeterlidir** — Windows'ta ve Mac'te, hiçbir şey
kurmadan, internet olmadan çalışır.

Bunun için iki şey yapılır: çıktı tek parça klasik `<script>` olarak üretilir
(tarayıcılar `file://` adresinde ES modül yüklemez) ve 3B modeller base64
gömülür (three.js modeli XHR ile okur, o da `file://` üzerinde engellidir).

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
| İngilizce çeviri | `src/i18n.js` |
| Görünüm / düzen | `src/styles.css` |

Görseller ve modeller klasörden otomatik bulunur; Türkçe karakterli dosya
adları da eşlenir.

### Dil

Sağ üstteki bayrak düğmeleriyle Türkçe ↔ İngilizce geçiş yapılır; seçim
tarayıcıda saklanır. Sunumun **hangi dille açılacağını** sabitlemek için
`src/i18n.js` içindeki `DEFAULT_LANG` değerini `'tr'` veya `'en'` yapın.

### Sunum sırasında

| | |
| --- | --- |
| Fare tekerleği, yön tuşları, PageUp/Down | Slaytlar arası geçiş |
| 3B cihazlar | Sürükleyerek çevirin, çift tık sıfırlar |
| Kapanış sayfasındaki kart | Sunumu yapan kişinin bilgileri — tıklayıp yazın |

---

## Depoda olmayanlar

`.gitignore` şunları dışarıda tutar: `node_modules/`, üretilen çıktılar
(`dist/`, `SUNUM/`, `release/`) ve `_orijinal_modeller/` — sunumda
kullanılmayan 56 MB'lik sıkıştırılmamış 3B model. Onu da yedeklemek
isterseniz `.gitignore` içinden ilgili satırı silin.
