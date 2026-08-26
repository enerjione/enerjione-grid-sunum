/* ==================================================================
   ENERJIONE GRID — SUNUM İÇERİĞİ

   GÖRSELLER
     PICTURE klasörüne (ve alt klasörlerine) koyduğunuz her görsel
     otomatik bulunur. Slayttaki "image" alanına dosya adını yazın:
       image: '1'         -> PICTURE/1.png
       image: 'sn20'      -> PICTURE/sn20.png
       image: 'HARITA'    -> PICTURE/PLATFORM/HARİTA.png
     Türkçe karakter ve alt klasör farkı otomatik eşlenir.

   VİDEO
     video: '1'           -> PICTURE/VIDEO/1.mp4
     Scroll videoyu kare kare sürer; geri kaydırınca geri sarar.
     Aynı videoyu kullanan ard arda iki slayt daha uzun sürüş verir.

   KAMERA (arka plan görselleri için)
     focus = { x, y, zoom, at }
       x,y  -> GÖRSEL üzerinde odaklanılacak nokta (%)
       zoom -> yakınlaşma çarpanı (1 = tam görsel)
       at   -> o noktanın EKRANDA duracağı yer (%)
     Ard arda iki slayt aynı görseli kullanırsa kesme olmaz,
     kamera yumuşakça hareket eder.

   SLAYT TÜRLERİ (kind)
     hero · product · screen · hub · steps · outro · (boş = standart)

   YERLEŞİM (align)
     left · bottom · center · split · screen · hub
   ================================================================== */

const files = import.meta.glob('../PICTURE/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF,svg,SVG}', {
  eager: true, query: '?url', import: 'default',
})

/* Türkçe karakterleri sadeleştirip anahtar üret */
const fold = (s) =>
  s.normalize('NFC')
    .replace(/[İIı]/g, 'I').replace(/[Şş]/g, 'S').replace(/[Ğğ]/g, 'G')
    .replace(/[Üü]/g, 'U').replace(/[Öö]/g, 'O').replace(/[Çç]/g, 'C')
    .toUpperCase()

export const images = {}
for (const [path, url] of Object.entries(files)) {
  const rel = path.replace('../PICTURE/', '')
  const file = rel.split('/').pop()
  const bare = file.replace(/\.[^.]+$/, '')
  const relBare = rel.replace(/\.[^.]+$/, '')
  for (const k of [file, bare, relBare, fold(bare), fold(relBare)]) {
    if (!(k in images)) images[k] = url
  }
}

const vidFiles = import.meta.glob('../PICTURE/VIDEO/*.{mp4,MP4,webm,WEBM,mov,MOV,m4v,M4V}', {
  eager: true, query: '?url', import: 'default',
})

export const videos = {}
for (const [path, url] of Object.entries(vidFiles)) {
  const file = path.split('/').pop()
  const bare = file.replace(/\.[^.]+$/, '')
  for (const k of [file, bare, fold(bare)]) if (!(k in videos)) videos[k] = url
}

/* --- 3B modeller: PICTURE/GLB veya MODEL klasoru --- */
const glbFiles = {
  ...import.meta.glob('../PICTURE/**/*.{glb,GLB,gltf,GLTF}', { eager: true, query: '?url', import: 'default' }),
  ...import.meta.glob('../MODEL/*.{glb,GLB,gltf,GLTF}', { eager: true, query: '?url', import: 'default' }),
}

export const models = {}
for (const [path, url] of Object.entries(glbFiles)) {
  const file = path.split('/').pop()
  const bare = file.replace(/\.[^.]+$/, '')
  for (const k of [file, bare, fold(bare)]) if (!(k in models)) models[k] = url
}

/* --- marka logolari: BRAND klasoru --- */
const brandFiles = import.meta.glob('../BRAND/*.{png,PNG,svg,SVG,webp,WEBP}', {
  eager: true, query: '?url', import: 'default',
})

export const brand = {}
for (const [path, url] of Object.entries(brandFiles)) {
  const file = path.split('/').pop()
  const bare = file.replace(/\.[^.]+$/, '')
  for (const k of [file, bare, fold(bare)]) if (!(k in brand)) brand[k] = url
}

export const logoUrl = brand['E1_GRID_LOGO_LIGHT'] || brand['e1_grid_logo_light']
export const horstmannUrl = brand['HORSTMANN LOGO'] || brand['horstmann logo']
export const faviconUrl = brand['E1_GRID_FAVICON'] || brand['e1_grid_favicon']

/* --- diger EnerjiOne markalari: BRAND/URUNLER klasoru ---
   Dosya adi etiket olur:  e1_solar.png  ->  E1 SOLAR
   Sira icin basa numara koyabilirsiniz: 1-e1_solar.png                */
const urunFiles = import.meta.glob('../BRAND/URUNLER/*.{png,PNG,svg,SVG,webp,WEBP,jpg,JPG}', {
  eager: true, query: '?url', import: 'default',
})

export const brandIcons = Object.entries(urunFiles)
  .sort(([a], [b]) => a.localeCompare(b, 'tr'))
  .map(([path, url]) => {
    const file = path.split('/').pop().replace(/\.[^.]+$/, '')
    const label = file.replace(/^\d+[-_.\s]*/, '').replace(/[-_]+/g, ' ').trim().toLocaleUpperCase('tr')
    return { url, label }
  })


/* --- mobil ekranlar: PICTURE/MOBILE icindeki tum gorseller sirayla --- */
const MOBILE_LABELS = {
  1: 'Harita',              2: 'Arıza Konumu',      3: 'Alarmlar',
  4: 'Olaylar',             5: 'Alarm Detayı',      6: 'Cihaz Ölçümleri',
  7: 'Arıza Yorumları',     8: 'Cihaz Listesi',     9: 'Ölçüm Detayı',
  10: 'Mühendislik',       11: 'Faz Ölçümleri',    12: 'Kullanıcı Yönetimi',
  13: 'Bildirim Ayarları', 14: 'Canlı Değerler',   15: 'Giriş Ekranı',
  16: 'Bildirimler',       17: 'Sistem Durumu',    18: 'Harita Detayı',
  19: 'Sinyal Listesi',    20: 'Cihaz Alarmları',
}

export function mobileShots() {
  return Object.keys(images)
    .filter((k) => /^MOBILE\/\d+$/.test(k))
    .map((k) => ({ k, n: parseInt(k.split('/')[1], 10) }))
    .sort((a, b) => a.n - b.n)
    .map(({ k, n }) => ({ image: k, label: MOBILE_LABELS[n] || 'Ekran ' + n }))
}

export const slides = [
  /* =================================================================
     BÖLÜM 1 — SAHA
     ================================================================= */
  {
    id: 'hero',
    image: '1',
    kind: 'hero',
    logo: true,
    nav: 'Giriş',
    align: 'topright',
    focus: { x: 44, y: 54, zoom: 1.16, at: { x: 38, y: 58 } },
    headline: 'Arızayı aramayın.\nDoğru noktaya gidin.',
    body: 'Orta gerilim hatlarında arıza bölgesini daraltan ve saha ekibini doğru noktaya yönlendiren operasyon platformu.',
    tiles: [
      { icon: 'Crosshair', t: 'ARIZA\nKONUMU' },
      { icon: 'Cpu', t: 'SAHA\nDONANIMI' },
      { icon: 'Map', t: 'HARİTA VE\nSAHA' },
      { icon: 'BellRing', t: 'ANLIK\nBİLDİRİM' },
      { icon: 'Network', t: 'OUTBOUND\nENTEGRASYON' },
      { icon: 'ShieldCheck', t: 'KURUMSAL\nGÜVENLİK' },
    ],
  },
  {
    id: 'yerlesim',
    image: '1',                     // aynı görsel -> kesme yok, kamera yaklaşır
    nav: 'Cihaz Yerleşimi',
    num: 'S1',
    align: 'left',
    focus: { x: 44, y: 40, zoom: 1.30, at: { x: 64, y: 44 } },
    eyebrow: 'SAHA DONANIMI',
    headline: 'Cihazlar doğrudan\nhattın üzerine kelepçelenir.',
    body: 'Her faz iletkenine ayrı bir cihaz takılır ve hat boyunca kesintisiz bir algılama zinciri oluşur. Montaj enerji kesilmeden, yerden yapılır; cihaz enerjisini de hattın kendisinden alır.',
    items: [
      { icon: 'Layers', title: 'İLETKEN ÜSTÜNE', text: 'Her faz iletkenine ayrı cihaz kelepçelenir' },
      { icon: 'Wrench', title: 'ENERJİLİ MONTAJ', text: 'Hat kesilmeden, yerden takılabilir' },
      { icon: 'Waypoints', title: 'ALGILAMA ZİNCİRİ', text: 'Hat boyunca kesintisiz izleme' },
    ],
  },
  {
    id: 'sn20',
    kind: 'model',
    model: 'SN20_3D',                 // PICTURE/GLB/SN20_3D.glb
    nav: 'Smart Navigator 2.0',
    num: 'S2',
    align: 'screen',
    eyebrow: 'SAHA DONANIMI · SMART NAVIGATOR 2.0',
    brand: 'horstmann',
    headline: 'Smart Navigator 2.0\nhavai hat arıza gösterge cihazı.',
    body: 'Enerjili hatta, faz iletkeninin üzerine doğrudan kelepçelenir; montaj yerden yapılabilir. Kısa devreyi yön bilgisiyle ve toprak arızasını yerinde algılar, sonucu hem 360° optik göstergeyle hem de telsizle direk üstü kite bildirir.',
    items: [
      { icon: 'AlertTriangle', title: 'YÖN BİLGİLİ ALGILAMA', text: 'Kısa devre, toprak arızası ve gerilim kaybı ayrı ayrı' },
      { icon: 'Crosshair', title: '360° OPTİK GÖSTERGE', text: 'Gece ve gündüz yüksek görünürlük' },
      { icon: 'Network', title: 'ÇİFT KANAL', text: '868 MHz yerel telsiz + 4G LTE CAT-M1 / 450 MHz' },
      { icon: 'Wrench', title: 'YERDEN MONTAJ', text: 'Enerjili hatta, 33 mm’ye kadar iletken çapı' },
    ],
    specs: [
      { k: 'ÖLÇÜM ARALIĞI', v: '7–1.200 A' },
      { k: 'KISA DEVRE DAYANIMI', v: '40 kA / 1 s' },
      { k: 'HATTAN ŞARJ', v: '≥ 5 A' },
      { k: 'ÇALIŞMA SICAKLIĞI', v: '−40…+85 °C' },
      { k: 'KORUMA SINIFI', v: 'IP68' },
      { k: 'AĞIRLIK', v: '~1,5 kg' },
    ],
    note: 'Reset: manuel (mıknatıs / USB), uzaktan veya otomatik. Sabit eşik seçeneğiyle 2.000 A’e kadar.',
  },
  {
    id: 'polemaster',
    kind: 'model',
    models: [
      { model: 'POLE_MASTER_3D', label: 'POLE MASTER KIT', fit: 1.0 },
      { model: 'SN_LC', label: 'SMART NAVIGATOR LC', fit: 1.0 },
    ],
    nav: 'Pole Master Kit',
    num: 'S3',
    align: 'screen',
    eyebrow: 'SAHA DONANIMI · POLE MASTER KIT',
    brand: 'horstmann',
    headline: 'Pole Master Kit\ndirek üstü toplayıcı ve haberleşme kiti.',
    body: 'Direğe monte edilir, kendi enerjisini güneş panelinden üretir. Çevresindeki cihazlardan gelen veriyi toplar ve şifreli olarak merkeze taşır; bağlantı koptuğunda veriyi sahada tamponlar.',
    items: [
      { icon: 'Boxes', title: '9 CİHAZA KADAR', text: 'Üç ölçüm setini, yani dokuz cihazı tek noktada toplar' },
      { icon: 'BatteryCharging', title: 'SOLAR BESLEME', text: '5 A altındaki hatlarda güneş paneli ve batarya ile' },
      { icon: 'Network', title: 'MERKEZE İLETİM', text: 'Toplanan veri şifreli olarak sunucuya veya buluta' },
      { icon: 'Database', title: 'YEREL TAMPONLAMA', text: 'Bağlantı koptuğunda veri sahada saklanır' },
    ],
    specs: [
      { k: 'TOPLAMA KAPASİTESİ', v: '3 set / 9 cihaz' },
      { k: 'YEREL TELSİZ', v: '868 MHz' },
      { k: 'MERKEZ BAĞLANTISI', v: '4G LTE' },
    ],
    note: 'İki cihaz birlikte çalışır: LC hat üstünde ölçer, Pole Master Kit direk üstünde toplar. Modelleri fareyle sürükleyerek çevirebilirsiniz.',
  },
  {
    id: 'pmkkapasite',
    kind: 'pmk',
    nav: 'Toplama Kapasitesi',
    num: 'S4',
    align: 'panel',
    eyebrow: 'TOPLAMA KAPASİTESİ',
    headline: 'Tek toplayıcı,\nüç set, dokuz cihaz.',
    body: 'Bir ölçüm seti hattın üç fazını izleyen üç cihazdan oluşur. Direk üstündeki tek bir Pole Master Kit, üç ayrı ölçüm setini yani toplam dokuz cihazı birden toplar ve merkeze tek kanaldan iletir.',
    items: [
      { icon: 'Layers', title: 'ÜÇ FAZ, ÜÇ CİHAZ', text: 'Her ölçüm setinde R, S ve T fazı ayrı izlenir' },
      { icon: 'Network', title: 'TEK KANAL', text: 'Dokuz cihazın verisi tek bağlantı üzerinden gider' },
    ],
  },
  {
    id: 'akillimod',
    kind: 'smart',
    nav: 'Akıllı Mod',
    num: 'S5',
    align: 'smart',
    eyebrow: 'HORSTMANN AKILLI MOD',
    headline: 'Arıza yoksa uyur,\narıza olunca uyanır.',
    body: 'Cihaz normal şartlarda modemini kapatıp derin uyku moduna geçer. Arıza akımını algıladığı anda uyanır, bildirimi saniyeler içinde gönderir; belirli aralıklarla da kendiliğinden uyanıp topladığı ölçümleri iletir. Enerjisini hattan alır: 5 A üzerindeki hatlarda kendini şarj eder, harici beslemeye ihtiyaç duymaz.',
    items: [
      { icon: 'Moon', title: 'UYKU MODU', text: 'Modem kapalı, tüketim minimumda' },
      { icon: 'Zap', title: 'ANINDA UYANMA', text: 'Arıza algılandığı an bildirim gider' },
      { icon: 'Timer', title: 'PERİYODİK RAPOR', text: 'Belirli aralıklarla toplu veri gönderimi' },
      { icon: 'BatteryCharging', title: 'KENDİNİ ŞARJ EDER', text: '5 A üzeri hatta harici besleme gerekmez' },
    ],
  },
  {
    id: 'bolge',
    image: '4',
    nav: 'Arıza Bölgesi',
    num: 'S6',
    align: 'bottom',
    focus: { x: 50, y: 40, zoom: 1.12, at: { x: 50, y: 42 } },
    eyebrow: 'ARIZA BÖLGESİ',
    headline: 'Arızayı ilk gören cihaz ile\ngörmeyen ilk cihaz arasındaki kesim.',
    body: 'Arızayı gören cihazlar kırmızı yanar, görmeyenler yeşil kalır. Aranacak alan tüm hat değil, yalnızca bu iki cihazın arasıdır; sistem bu kesimin uzunluğunu ve hangi direkler arasında kaldığını doğrudan verir.',
    overlay: {
      type: 'measure',
      showDim: true,
      cardY: 15,
      // üç fazın arızalı hat parçaları (yanıp söner)
      wires: [
        { ax: 42.6, ay: 28.9, bx: 57.1, by: 29.2, sag: 0.35 },
        { ax: 42.6, ay: 36.1, bx: 57.1, by: 36.6, sag: 0.30 },
        { ax: 42.6, ay: 42.3, bx: 57.1, by: 42.7, sag: 0.25 },
      ],
      a: { x: 42.6, y: 37.2, state: 'fault', name: 'ARIZAYI İLK GÖREN', tag: 'ARIZA VAR', sub: 'SN-2.0 · 10412' },
      b: { x: 57.1, y: 37.7, state: 'ok', name: 'ARIZAYI GÖRMEYEN', tag: 'ARIZA YOK', sub: 'SN-2.0 · 10413' },
      dimY: 48,
      zone: 'ARIZA BÖLGESİ',
      distance: '1.6 km',
    },
  },
  {
    id: 'arizatipi',
    image: 's7_tam',                 // tam ekran gorsel
    nav: 'Arıza Tipi',
    num: 'S7',
    align: 'bottom',
    focus: { x: 50, y: 42, zoom: 1.04, at: { x: 50, y: 40 } },
    eyebrow: 'ARIZA SINIFLANDIRMA',
    headline: 'Her arıza aynı değildir;\nsistem tipini de ayırt eder.',
    body: 'Kalıcı ve geçici arızalar, faz-faz ile faz-toprak arızaları ayrı sınıflandırılır.',
    pairs: [
      {
        tone: 'fault', icon: 'AlertTriangle', title: 'KALICI ARIZA',
        text: 'Kesici açık kalır, hat enerjisiz kalır. Arızanın fiziksel bir sebebi vardır ve müdahale şarttır.',
        ex: [
          { icon: 'Cable', t: 'İletken kopması' },
          { icon: 'TowerControl', t: 'Direk devrilmesi' },
          { icon: 'ShieldOff', t: 'İzolatör delinmesi' },
          { icon: 'TreePine', t: 'Hatta düşen ağaç' },
        ],
      },
      {
        tone: 'temp', icon: 'RotateCcw', title: 'GEÇİCİ ARIZA',
        text: 'Kesici tekrar kapanır, hat kendiliğinden normale döner. Sebep anlıktır, kalıcı hasar bırakmaz.',
        ex: [
          { icon: 'Wind', t: 'Rüzgârda iletken teması' },
          { icon: 'Bird', t: 'Kuş veya hayvan teması' },
          { icon: 'CloudLightning', t: 'Yıldırım kaynaklı atlama' },
          { icon: 'TreePine', t: 'Dala sürtünme' },
        ],
      },
    ],
  },
  {
    id: 'veri',
    image: 's8_tam',                 // tam ekran gorsel
    nav: 'Veri Aktarımı',
    num: 'S8',
    align: 'bottom',
    focus: { x: 50, y: 50, zoom: 1.0, at: { x: 50, y: 50 } },
    eyebrow: 'VERİ AKTARIMI',
    headline: 'Saha verisi kablosuz\nolarak merkeze akar.',
    body: 'Ölçümler, olaylar ve cihaz sağlık bilgileri şifreli olarak aktarılır. Merkez, müşterinin kendi sunucusu ya da EnerjiOne bulutu olabilir; bağlantı koptuğunda veri sahada tamponlanır.',
    logos: [
      { key: 'DNP3' },
    ],
  },

  /* =================================================================
     BÖLÜM 2 — YAZILIM  (ekran görüntüleri 3B monitör içinde)
     ================================================================= */
  {
    id: 's01',
    flip: true,
    image: 'HAT ARIZASI',
    kind: 'screen',
    nav: 'Arıza Konumlandırma',
    num: '01',
    align: 'screen',
    eyebrow: 'ARIZA KONUMLANDIRMA',
    headline: 'Arıza noktasını tahmin etmek yerine arıza bölgesini görün.',
    body: 'Hat üzerindeki son arıza algılayan nokta ile ilk algılamayan nokta birlikte değerlendirilir; aranacak kesim daraltılarak ekip hedefli müdahale eder.',
    items: [
      { icon: 'Crosshair', title: 'KONUMLANDIRMA', text: 'İki direk arasına kadar daraltılmış arıza bölgesi' },
      { icon: 'Layers', title: 'ÇOKLU ARIZA', text: 'Aynı hatta bağımsız bölgeler ayrı izlenebilir' },
      { icon: 'Route', title: 'SAHA SONUCU', text: 'Daha az hat taraması, daha hedefli yönlendirme' },
    ],
  },
  {
    id: 's02',
    image: 'HARITA',
    kind: 'screen',
    nav: 'Harita ve Saha',
    num: '02',
    align: 'screen',
    eyebrow: 'HARİTA VE SAHA OPERASYONU',
    headline: 'Arıza bölgesini harita üzerinde tek bakışta görün.',
    body: 'Aktif arıza kaydı; konum, etkilenen hat bölümü, olay anındaki ölçümler ve sorumlu ekip bilgisiyle birlikte tek ekranda yönetilir.',
    items: [
      { icon: 'Map', title: 'HARİTA', text: 'Sağlıklı ve arızalı hat bölümleri ayrıştırılır' },
      { icon: 'UserCheck', title: 'ATAMA', text: 'Arıza sorumlu kişi veya ekibe yönlendirilir' },
      { icon: 'History', title: 'GEÇMİŞ', text: 'Tekrarlayan olaylar aynı hat üzerinden izlenir' },
    ],
  },
  {
    id: 's02b',
    image: 'CEVRIMDISI_HARITA',
    kind: 'screen',
    flip: true,
    nav: 'Çevrimdışı Harita',
    num: '03',
    align: 'screen',
    eyebrow: 'ÇEVRİMDIŞI HARİTA',
    headline: 'İnternet olmayan sahada da harita çalışır.',
    body: 'Harita altlığı sunucuya önceden indirilir. Saha ekibi internet çekmeyen bölgede de hat topolojisini, direkleri ve arıza konumunu harita üzerinde görür.',
    items: [
      { icon: 'Map', title: 'YEREL ALTLIK', text: 'Harita verisi kurum sunucusunda saklanır' },
      { icon: 'Server', title: 'İNTERNETSİZ ÇALIŞMA', text: 'Dış servise bağımlılık yok' },
      { icon: 'Crosshair', title: 'AYNI GÖRÜNÜM', text: 'Çevrimiçi ile birebir aynı hat ve cihaz konumları' },
    ],
  },
  {
    id: 's02c',
    image: 'HAT_YONETIMI',
    kind: 'screen',
    nav: 'Hat Yönetimi',
    num: '04',
    align: 'screen',
    eyebrow: 'HAT VE DİREK YÖNETİMİ',
    headline: 'Şebeke verinizi olduğu gibi içeri alın.',
    body: 'Hat, direk ve cihaz kayıtları Excel veya CSV ile toplu olarak içeri aktarılır, aynı biçimde dışarı alınır. Farklı marka harita ve CBS uygulamalarından aldığınız direk çıktıları doğrudan sisteme aktarılabilir.',
    items: [
      { icon: 'FileText', title: 'EXCEL / CSV', text: 'Toplu içeri ve dışarı aktarım' },
      { icon: 'Map', title: 'HARİTA ÇIKTILARI', text: 'Farklı marka CBS ve harita uygulamalarından direk aktarımı' },
      { icon: 'Waypoints', title: 'TOPOLOJİ KURULUMU', text: 'Direk sırası ve hat bağlantıları tek seferde tanımlanır' },
      { icon: 'RefreshCw', title: 'GÜNCELLEME', text: 'Değişen şebeke yeniden yüklenerek güncellenir' },
    ],
  },
  {
    id: 's03',
    flip: true,
    image: 'ARIZA DETAY',
    kind: 'screen',
    nav: 'Arıza Künyesi',
    num: '05',
    align: 'screen',
    eyebrow: 'ARIZA KÜNYESİ',
    headline: 'Her arıza, olay anındaki değerleriyle birlikte saklanır.',
    body: 'Konum, etkilenen hat bölümü, ölçümler, süre ve müdahale adımları tek kayıt altında toplanır; olay kapandıktan sonra da geriye dönük incelenebilir.',
    items: [
      { icon: 'Clock', title: 'OLAY ANI', text: 'Arıza anındaki kritik değerler' },
      { icon: 'Timer', title: 'SÜRE', text: 'Açılış, müdahale ve kapanış zamanları' },
      { icon: 'NotebookPen', title: 'NOTLAR', text: 'Ekip yorumları ve çözüm kaydı' },
    ],
  },
  {
    id: 's04',
    image: 'CIHAZ DETAY',
    kind: 'screen',
    nav: 'Canlı Cihaz',
    num: '06',
    align: 'screen',
    eyebrow: 'CANLI CİHAZ GÖRÜNÜRLÜĞÜ',
    headline: 'Sahadaki her cihazın durumunu tek ekranda yönetin.',
    body: 'Cihazın ölçümleri, çalışma modu, haberleşme kalitesi, batarya durumu, alarmları ve olay geçmişi birlikte sunulur.',
    items: [
      { icon: 'Activity', title: 'CANLI ÖLÇÜMLER', text: 'Akım, gerilim, sıcaklık ve cihaz sinyalleri' },
      { icon: 'BatteryCharging', title: 'CİHAZ SAĞLIĞI', text: 'Batarya, haberleşme ve çalışma modu' },
      { icon: 'Database', title: 'TEK KAYIT', text: 'Alarm, olay, konfigürasyon ve rapor aynı cihazda' },
    ],
  },
  {
    id: 's05',
    flip: true,
    image: 'ALARM',
    kind: 'screen',
    nav: 'Alarm Yönetimi',
    num: '07',
    align: 'screen',
    eyebrow: 'MERKEZİ ALARM YÖNETİMİ',
    headline: 'Alarmı görmekten öte, müdahale sürecini yönetin.',
    body: 'Öncelik, durum, sorumlu kullanıcı, süre, yorum ve tekrar sıklığı tek alarm kaydı altında izlenir; hiçbir işlem görünmez kalmaz.',
    steps: ['Alarm oluşur', 'Operatör onaylar', 'Sorumlu atanır', 'Müdahale kaydedilir', 'Olay geçmişe alınır'],
  },
  {
    id: 's06',
    image: 'TREND',
    kind: 'screen',
    nav: 'Analiz ve Bakım',
    num: '08',
    align: 'screen',
    eyebrow: 'ANALİZ VE BAKIM KARARLARI',
    headline: 'Geçmiş veriyi bakım önceliğine dönüştürün.',
    body: 'Hat, bölge, cihaz, zaman ve arıza sebebi bazındaki analizler; tekrar eden sorunları ve bakım odağını görünür hale getirir.',
    items: [
      { icon: 'Flame', title: 'YOĞUNLUK', text: 'Sorunların hangi hat ve bölgelerde biriktiği' },
      { icon: 'RefreshCw', title: 'TEKRAR', text: 'Aynı hatta yeniden oluşan arızalar' },
      { icon: 'Timer', title: 'SÜRE', text: 'Arıza ve çözüm zamanlarının karşılaştırılması' },
      { icon: 'HeartPulse', title: 'SAĞLIK', text: 'Cihaz ve haberleşme performansının izlenmesi' },
    ],
  },
  {
    id: 's07',
    flip: true,
    kind: 'docs',
    nav: 'Raporlama',
    num: '09',
    align: 'screen',
    eyebrow: 'RAPORLAMA VE İZLENEBİLİRLİK',
    headline: 'Paylaşılabilir, denetlenebilir kayıt.',
    body: 'Arıza, cihaz ve olay bazında standart rapor üretilir. PDF çıktılar saha paylaşımına hazırdır; aynı veri Excel ve CSV olarak da dışa aktarılabilir.',
    docs: [
      { image: 'RAPOR', label: 'ARIZA RAPORU', type: 'PDF', ar: '792 / 892' },
      { image: 'CIHAZ_RAPOR', label: 'CİHAZ DURUM RAPORU', type: 'PDF', ar: '790 / 886' },
      { image: 'OLAY_RAPOR', label: 'OLAY RAPORU', type: 'PDF', ar: '1115 / 782' },
      { kind: 'csv', label: 'TABLO ÇIKTISI', type: 'CSV', ar: '4 / 3' },
    ],
    items: [
      { icon: 'FileText', title: 'STANDART ÇIKTI', text: 'PDF ve saha paylaşımına uygun biçim' },
      { icon: 'ScanLine', title: 'İZLENEBİLİRLİK', text: 'Açılıştan kapanışa kadar tam kayıt' },
    ],
    note: 'Kartlara tıklayarak rapor türleri arasında geçiş yapabilirsiniz. Örnek çıktılardaki değerler test senaryosuna aittir.',
  },
  {
    id: 'roller',
    kind: 'roles',
    nav: 'Kullanıcı Rolleri',
    num: '10',
    align: 'panel',
    eyebrow: 'ROL VE YETKİ YÖNETİMİ',
    headline: 'Herkes yalnızca\nişini ve bölgesini görür.',
    body: 'Kurulumdan operasyona kadar her ekip kendi yetkisiyle çalışır. Kullanıcılar ekiplere, ekipler bölgelere atanır; alarm ve bildirimler yalnızca ilgili bölgenin ekibine gider. Installer rolü tüm yetkilere sahiptir.',
    items: [
      { icon: 'KeyRound', title: 'ROL BAZLI ERİŞİM', text: 'Yetki dışı ekran ve işlem görünmez' },
      { icon: 'Users', title: 'EKİP VE BÖLGE', text: 'Ekipler bölgelere atanır, kapsam netleşir' },
      { icon: 'BellOff', title: 'GEREKSİZ BİLDİRİM YOK', text: 'Alarm yalnızca ilgili ekibe ulaşır' },
      { icon: 'ScrollText', title: 'DENETİM KAYDI', text: 'Her işlem kullanıcı ve zamanla saklanır' },
    ],
  },
  {
    id: 'olaylar',
    image: 'OLAYLAR',
    kind: 'screen',
    nav: 'Denetim Kaydı',
    num: '11',
    align: 'screen',
    eyebrow: 'OLAY VE DENETİM KAYDI',
    headline: 'Sistemde olan biten\nkayıt dışı kalmaz.',
    body: 'Cihaz olayları, kullanıcı girişleri, konfigürasyon değişiklikleri ve alarm işlemleri tek bir akışta toplanır. Kategori, öncelik, kullanıcı ve cihaz bazında filtrelenir; dışarı aktarılabilir.',
    items: [
      { icon: 'ScrollText', title: 'TEK AKIŞ', text: 'Cihaz, kullanıcı ve sistem olayları bir arada' },
      { icon: 'UserCheck', title: 'KİM YAPTI', text: 'Her işlem kullanıcı ve zaman damgasıyla' },
      { icon: 'ScanLine', title: 'FİLTRE VE DIŞA AKTARIM', text: 'Kategori, öncelik ve cihaz bazında süzme' },
    ],
  },
  {
    id: 'bildirim',
    kind: 'notify',
    nav: 'Bildirimler',
    num: '12',
    align: 'notify',
    eyebrow: 'ARIZA VE ALARM BİLDİRİMİ',
    headline: 'Arıza olduğu anda\ndoğru kişiye ulaşır.',
    body: 'Bildirim; bölge, hat, arıza aralığı, tahmini mesafe ve harita konumuyla birlikte gider. Kural motoru olayı önceliğe, bölgeye ve sorumlu ekibe göre yönlendirir; webhook ile n8n veya Make gibi otomasyon araçlarına da aktarılabilir.',
  },
  {
    id: 'mobil',
    kind: 'mobile',
    nav: 'Mobil Uygulama',
    num: '13',
    align: 'panel',
    eyebrow: 'MOBİL UYGULAMA',
    headline: 'Saha ekibi aynı sistemi\ncebinden kullanır.',
    body: 'Harita, alarm, olay ve cihaz ölçümleri mobil uygulamada da aynı verilerle çalışır. Ekip sahadayken arıza bölgesini haritada görür, alarmı onaylar ve müdahale notunu yerinde girer.',
    shots: mobileShots(),
    items: [
      { icon: 'Map', title: 'SAHADA HARİTA', text: 'Arıza bölgesi ve hat topolojisi cepte' },
      { icon: 'CircleCheck', title: 'YERİNDE ONAY', text: 'Alarm onayı ve müdahale notu sahadan' },
    ],
    stores: true,
  },
  {
    id: 'dil',
    kind: 'lang',
    nav: 'Dil Desteği',
    num: '14',
    align: 'panel',
    eyebrow: 'ÇOK DİLLİ ARAYÜZ',
    headline: 'Ekip hangi dili konuşuyorsa\nsistem de onu konuşur.',
    body: 'Arayüz dili kullanıcı bazında seçilir; aynı kurulumda farklı kullanıcılar farklı dilde çalışabilir. Raporlar da seçilen dilde üretilir. Yeni bir dil eklemek yalnızca çeviri dosyası eklemekten ibarettir, yazılım değişikliği gerektirmez.',
    items: [
      { icon: 'Users', title: 'KARMA EKİPLER', text: 'Yerel ve yabancı ekipler aynı sistemde' },
      { icon: 'FileText', title: 'ÇIKTILAR DA ÇEVİRİLİ', text: 'Rapor ve bildirimler seçilen dilde' },
    ],
  },
  {
    id: 'olcek',
    kind: 'scale',
    nav: 'Ölçeklenebilirlik',
    num: '15',
    align: 'panel',
    eyebrow: 'ÖLÇEKLENEBİLİRLİK VE SÜREKLİLİK',
    headline: 'Sistem sizinle\nbirlikte büyür.',
    body: 'Tek bir pilot hatla başlayın, aynı kurulumu bölge geneline kadar büyütün. Mimari değişmez; kapasite gerektiği kadar genişler. Kritik kurulumlarda yedekli çalışma seçeneğiyle hizmet sürekliliği güvence altına alınır.',
    items: [
      { icon: 'Boxes', title: 'PARALEL İŞLEME', text: 'Her gateway kendi cihaz kümesini bağımsız yönetir' },
      { icon: 'ServerCog', title: 'HOT STANDBY', text: 'İsteğe bağlı yedekli kurulum, otomatik devralma' },
    ],
  },
  {
    id: 'guvenlik',
    kind: 'security',
    nav: 'Siber Güvenlik',
    num: '16',
    align: 'panel',
    eyebrow: 'SİBER GÜVENLİK',
    headline: 'Kritik altyapıya yakışan\ngüvenlik yaklaşımı.',
    body: 'Sistem müşterinin kendi altyapısında çalışır; veri dışarı çıkmaz. Saha ile merkez arasındaki iletişim şifrelidir, erişim rol bazlıdır ve her işlem denetlenebilir kayıt altına alınır.',
    items: [
      { icon: 'LockKeyhole', title: 'UÇTAN UCA ŞİFRELEME', text: 'Cihazdan merkeze kadar korunan iletim' },
      { icon: 'Server', title: 'VERİ EGEMENLİĞİ', text: 'On-prem kurulum, dışarı veri çıkışı yok' },
    ],
  },
  {
    id: 's08',
    kind: 'hub',
    nav: 'Entegrasyon',
    num: '17',
    align: 'hub',
    eyebrow: 'AÇIK ENTEGRASYON KATMANI',
    headline: 'Olay verisini ihtiyacınız olan yere taşıyın.',
    body: 'Tek olay kaynağı, hazır çıkışlar. SCADA telekontrolden otomasyon ve bildirim kanallarına kadar.',
    chips: ['On-Prem', 'Gerçek zamanlı', 'Denetlenebilir', 'Rol bazlı yetki'],
  },
  {
    id: 'outro',
    image: '1',
    kind: 'outro',
    nav: 'İletişim',
    align: 'center',
    focus: { x: 50, y: 50, zoom: 1.30, at: { x: 50, y: 50 } },
    headline: 'Şebekenizi görünür,\nmüdahalenizi hedefli hale getirin.',
    body: 'EnerjiOne Grid bir dashboard değil; arıza bilgisini saha aksiyonuna dönüştüren operasyon platformudur. Canlı demo ve kendi hat topolojinize özel saha senaryosu için EnerjiOne ekibiyle iletişime geçin.',
    logo: true,
    brandStrip: true,
    /* Sunumu yapan kisi — buradan varsayilan verebilir,
       uygulama icinde alanlara tiklayarak da degistirebilirsiniz. */
    presenter: {
      name: 'Fikret Şafak',
      role: 'Satış ve Proje Yöneticisi',
      mail: 'fikret.safak@enerjione.com',
      phone: '+90 500 000 00 00',
    },
    cta: 'enerjione.com',
  },
]

export default slides
