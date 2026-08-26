/* ==================================================================
   DİL DESTEĞİ — Türkçe / English

   Sunumun kaynak dili Türkçedir. Aşağıdaki sözlük, Türkçe metni
   İngilizce karşılığıyla eşler. Ekranda görünen her metin t() veya
   deepT() üzerinden geçtiği için yeni bir dil eklemek yalnızca yeni
   bir sözlük eklemek demektir.

   VARSAYILAN DİL
     Sağ üstteki TR / EN düğmesiyle anlık değiştirebilirsiniz; seçim
     tarayıcıda saklanır. Build'in hangi dille açılacağını sabitlemek
     isterseniz aşağıdaki DEFAULT_LANG değerini 'en' yapın.
   ================================================================== */

export const DEFAULT_LANG = 'tr'

export const LANGS = [
  { id: 'tr', label: 'TR', flag: 'tr', title: 'Türkçe' },
  { id: 'en', label: 'EN', flag: 'gb', title: 'English' },
]

const STORE_KEY = 'e1.lang'

function readStored() {
  try {
    const v = localStorage.getItem(STORE_KEY)
    return v === 'tr' || v === 'en' ? v : null
  } catch {
    return null
  }
}

let LANG = readStored() || DEFAULT_LANG

export const getLang = () => LANG

export function setLang(next) {
  LANG = next === 'en' ? 'en' : 'tr'
  try { localStorage.setItem(STORE_KEY, LANG) } catch {}
  if (typeof document !== 'undefined') document.documentElement.lang = LANG
  return LANG
}

if (typeof document !== 'undefined') document.documentElement.lang = LANG

/* --- tek metin --- */
export function t(v) {
  if (LANG === 'tr' || typeof v !== 'string') return v
  const hit = EN[v]
  return hit === undefined ? v : hit
}

/* Bu alanlar metin degil; gorsel/dosya/anahtar adi tasir.
   Cevrilirlerse gorseller bulunamaz, o yuzden dokunulmaz. */
const SKIP_KEYS = new Set([
  'image', 'video', 'model', 'models', 'shot', 'src', 'icon', 'Icon',
  'logo', 'glyph', 'plate', 'flag', 'favicon',
  'id', 'key', 'kind', 'align', 'type', 'code', 'tone', 'ar', 'num',
  'cta', 'mail', 'phone', 'url', 'href', 'className',
])

/* --- iç içe veri (slayt nesneleri, dizi sabitleri) ---
   Sözlükte karşılığı olmayan metinler olduğu gibi kalır; ayrıca
   SKIP_KEYS'teki alanlar hiç çeviriye sokulmaz. */
export function deepT(v) {
  if (typeof v === 'string') return t(v)
  if (Array.isArray(v)) return v.map(deepT)
  if (v && typeof v === 'object' && !v.$$typeof && Object.getPrototypeOf(v) === Object.prototype) {
    const out = {}
    for (const k of Object.keys(v)) out[k] = SKIP_KEYS.has(k) ? v[k] : deepT(v[k])
    return out
  }
  return v
}

/* ==================================================================
   SÖZLÜK — Türkçe : English
   ================================================================== */

const EN = {
  /* ---------------- gezinme ---------------- */
  'Giriş': 'Intro',
  'Cihaz Yerleşimi': 'Device Layout',
  'Pole Master Kit': 'Pole Master Kit',
  'Toplama Kapasitesi': 'Collection Capacity',
  'Akıllı Mod': 'Smart Mode',
  'Arıza Bölgesi': 'Fault Section',
  'Arıza Tipi': 'Fault Type',
  'Veri Aktarımı': 'Data Transfer',
  'Arıza Konumlandırma': 'Fault Localization',
  'Harita ve Saha': 'Map & Field',
  'Çevrimdışı Harita': 'Offline Map',
  'Hat Yönetimi': 'Line Management',
  'Arıza Künyesi': 'Fault Record',
  'Canlı Cihaz': 'Live Device',
  'Alarm Yönetimi': 'Alarm Management',
  'Analiz ve Bakım': 'Analytics & Maintenance',
  'Raporlama': 'Reporting',
  'Kullanıcı Rolleri': 'User Roles',
  'Denetim Kaydı': 'Audit Log',
  'Bildirimler': 'Notifications',
  'Mobil Uygulama': 'Mobile App',
  'Dil Desteği': 'Language Support',
  'Ölçeklenebilirlik': 'Scalability',
  'Siber Güvenlik': 'Cyber Security',
  'Entegrasyon': 'Integration',
  'İletişim': 'Contact',
  'Kaydırın': 'Scroll',

  /* ---------------- S1 — giriş ---------------- */
  'Arızayı aramayın.\nDoğru noktaya gidin.': 'Skip the search.\nGo straight to it.',
  'Orta gerilim hatlarında arıza bölgesini daraltan ve saha ekibini doğru noktaya yönlendiren operasyon platformu.':
    'An operations platform that narrows the fault section on medium-voltage lines and sends the field crew directly to the right spot.',
  'ARIZA\nKONUMU': 'FAULT\nLOCATION',
  'SAHA\nDONANIMI': 'FIELD\nHARDWARE',
  'HARİTA VE\nSAHA': 'MAP &\nFIELD',
  'ANLIK\nBİLDİRİM': 'INSTANT\nALERTS',
  'OUTBOUND\nENTEGRASYON': 'OUTBOUND\nINTEGRATION',
  'KURUMSAL\nGÜVENLİK': 'ENTERPRISE\nSECURITY',

  /* ---------------- S2 — cihaz yerleşimi ---------------- */
  'SAHA DONANIMI': 'FIELD HARDWARE',
  'Cihazlar doğrudan\nhattın üzerine kelepçelenir.': 'Clamped directly onto\nthe line itself.',
  'Her faz iletkenine ayrı bir cihaz takılır ve hat boyunca kesintisiz bir algılama zinciri oluşur. Montaj enerji kesilmeden, yerden yapılır; cihaz enerjisini de hattın kendisinden alır.':
    'A separate device is fitted to each phase conductor, forming an uninterrupted detection chain along the line. Installation is done from the ground without de-energising, and the device harvests its own power from the line.',
  'İLETKEN ÜSTÜNE': 'ON THE CONDUCTOR',
  'Her faz iletkenine ayrı cihaz kelepçelenir': 'A separate device clamps onto each phase conductor',
  'ENERJİLİ MONTAJ': 'LIVE-LINE INSTALLATION',
  'Hat kesilmeden, yerden takılabilir': 'Fitted from the ground with the line energised',
  'ALGILAMA ZİNCİRİ': 'DETECTION CHAIN',
  'Hat boyunca kesintisiz izleme': 'Continuous monitoring along the line',

  /* ---------------- S3 — Smart Navigator 2.0 ---------------- */
  'SAHA DONANIMI · SMART NAVIGATOR 2.0': 'FIELD HARDWARE · SMART NAVIGATOR 2.0',
  'Smart Navigator 2.0\nhavai hat arıza gösterge cihazı.': 'Smart Navigator 2.0\noverhead line fault indicator.',
  'Enerjili hatta, faz iletkeninin üzerine doğrudan kelepçelenir; montaj yerden yapılabilir. Kısa devreyi yön bilgisiyle ve toprak arızasını yerinde algılar, sonucu hem 360° optik göstergeyle hem de telsizle direk üstü kite bildirir.':
    'Clamps directly onto the live phase conductor and can be installed from the ground. It detects short circuits with directional information and earth faults on the spot, then reports the result both through a 360° optical indicator and by radio to the pole-mounted kit.',
  'YÖN BİLGİLİ ALGILAMA': 'DIRECTIONAL DETECTION',
  'Kısa devre, toprak arızası ve gerilim kaybı ayrı ayrı': 'Short circuit, earth fault and loss of voltage, each separately',
  '360° OPTİK GÖSTERGE': '360° OPTICAL INDICATOR',
  'Gündüz 50 m, gece 150 m mesafeden görünür': 'Visible from 50 m by day, 150 m at night',
  'ÇİFT KANAL': 'DUAL CHANNEL',
  '868 MHz yerel telsiz + 4G LTE CAT-M1 / 450 MHz': '868 MHz local radio + 4G LTE CAT-M1 / 450 MHz',
  'YERDEN MONTAJ': 'GROUND-LEVEL FITTING',
  'Enerjili hatta, 33 mm’ye kadar iletken çapı': 'On live lines, conductor diameter up to 33 mm',
  'ÖLÇÜM ARALIĞI': 'MEASURING RANGE',
  'KISA DEVRE DAYANIMI': 'SHORT-CIRCUIT WITHSTAND',
  'HATTAN ŞARJ': 'LINE HARVESTING',
  'ÇALIŞMA SICAKLIĞI': 'OPERATING TEMPERATURE',
  'KORUMA SINIFI': 'INGRESS PROTECTION',
  'AĞIRLIK': 'WEIGHT',
  'Reset: manuel (mıknatıs / USB), uzaktan veya otomatik. Sabit eşik seçeneğiyle 2.000 A’e kadar.':
    'Reset: manual (magnet / USB), remote or automatic. Up to 2,000 A with the fixed-threshold option.',

  /* ---------------- S4 — Pole Master Kit ---------------- */
  'SAHA DONANIMI · POLE MASTER KIT': 'FIELD HARDWARE · POLE MASTER KIT',
  'Pole Master Kit\ndirek üstü toplayıcı ve haberleşme kiti.': 'Pole Master Kit\npole-top collector and comms unit.',
  'Direğe monte edilir, kendi enerjisini güneş panelinden üretir. Çevresindeki cihazlardan gelen veriyi toplar ve şifreli olarak merkeze taşır; bağlantı koptuğunda veriyi sahada tamponlar.':
    'Mounted on the pole and powered by its own solar panel. It collects data from the surrounding devices and carries it to the centre encrypted; if the link drops, it buffers the data in the field.',
  '9 CİHAZA KADAR': 'UP TO 9 DEVICES',
  'Üç ölçüm setini, yani dokuz cihazı tek noktada toplar': 'Collects three measurement sets — nine devices — at a single point',
  'SOLAR BESLEME': 'SOLAR POWER',
  '5 A altındaki hatlarda güneş paneli ve batarya ile': 'Solar panel and battery on lines below 5 A',
  'MERKEZE İLETİM': 'UPLINK TO CENTRE',
  'Toplanan veri şifreli olarak sunucuya veya buluta': 'Collected data goes encrypted to the server or cloud',
  'YEREL TAMPONLAMA': 'LOCAL BUFFERING',
  'Bağlantı koptuğunda veri sahada saklanır': 'Data is stored in the field when the link drops',
  'TOPLAMA KAPASİTESİ': 'COLLECTION CAPACITY',
  '3 set / 9 cihaz': '3 sets / 9 devices',
  'YEREL TELSİZ': 'LOCAL RADIO',
  'MERKEZ BAĞLANTISI': 'CENTRE LINK',
  'İki cihaz birlikte çalışır: LC hat üstünde ölçer, Pole Master Kit direk üstünde toplar. Modelleri fareyle sürükleyerek çevirebilirsiniz.':
    'The two devices work together: the LC measures on the line, the Pole Master Kit collects on the pole. Drag the models with your mouse to rotate them.',
  'POLE MASTER KIT': 'POLE MASTER KIT',
  'SMART NAVIGATOR LC': 'SMART NAVIGATOR LC',

  /* ---------------- S5 — kapasite ---------------- */
  'Tek toplayıcı,\nüç set, dokuz cihaz.': 'One collector,\nthree sets, nine units.',
  'Bir ölçüm seti hattın üç fazını izleyen üç cihazdan oluşur. Direk üstündeki tek bir Pole Master Kit, üç ayrı ölçüm setini yani toplam dokuz cihazı birden toplar ve merkeze tek kanaldan iletir.':
    'A measurement set consists of three devices monitoring the three phases of the line. A single pole-mounted Pole Master Kit collects three separate sets — nine devices in total — and forwards them to the centre over one channel.',
  'ÜÇ FAZ, ÜÇ CİHAZ': 'THREE PHASES, THREE DEVICES',
  'Her ölçüm setinde R, S ve T fazı ayrı izlenir': 'Phases R, S and T are monitored separately in each set',
  'TEK KANAL': 'SINGLE CHANNEL',
  'Dokuz cihazın verisi tek bağlantı üzerinden gider': 'Data from nine devices travels over one link',
  'direk üstü toplayıcı': 'pole-mounted collector',
  'ÖLÇÜM SETİ': 'MEASUREMENT SET',
  'CİHAZ': 'DEVICE',
  'TOPLAYICI': 'COLLECTOR',

  /* ---------------- akıllı mod ---------------- */
  'HORSTMANN AKILLI MOD': 'HORSTMANN SMART MODE',
  'Arıza yoksa uyur,\narıza olunca uyanır.': 'It sleeps when idle,\nwakes on a fault.',
  'UYKU MODU': 'SLEEP MODE',
  'Modem kapalı, tüketim minimumda': 'Modem off, consumption at a minimum',
  'ANINDA UYANMA': 'INSTANT WAKE-UP',
  'Arıza algılandığı an bildirim gider': 'A notification is sent the instant a fault is detected',
  'PERİYODİK RAPOR': 'PERIODIC REPORT',
  'Belirli aralıklarla toplu veri gönderimi': 'Batched data transmission at set intervals',
  'KENDİNİ ŞARJ EDER': 'SELF-CHARGING',
  '5 A üzeri hatta harici besleme gerekmez': 'Self-powered above 5 A',
  'ARIZA ANI': 'FAULT EVENT',
  'modem kapalı': 'modem off',
  'arıza / periyot': 'fault / interval',
  'GÖNDERİM': 'TRANSMISSION',
  'şifreli iletim': 'encrypted transfer',
  'geri döner': 'returns',
  'UYKU · MODEM KAPALI': 'SLEEP · MODEM OFF',
  'Hattan kendini şarj eder': 'Self-charging from the line',
  'Güneş paneli ile beslenir': 'Solar powered',
  'Şebeke bağlantısı gerektirmez': 'No mains supply needed',

  /* ---------------- S6 — arıza bölgesi ---------------- */
  'ARIZA BÖLGESİ': 'FAULT SECTION',
  'Son algılayan cihaz ile ilk\nalgılamayan cihaz arasındaki kesim.':
    'From the last device that saw the fault\nto the first that did not.',
  'Aranacak alan tüm hat değil, yalnızca bu iki nokta arasıdır. Sistem bu kesimin uzunluğunu ve hangi direkler arasında kaldığını doğrudan verir.':
    'The area to search is not the whole line, only what lies between these two points. The system gives you the length of that span and the poles it falls between.',
  'SON ALGILAYAN': 'LAST TO DETECT',
  'İLK ALGILAMAYAN': 'FIRST NOT TO DETECT',
  'ARIZA VAR': 'FAULT',
  'ARIZA YOK': 'NO FAULT',

  /* ---------------- S7 — arıza tipi ---------------- */
  'ARIZA SINIFLANDIRMA': 'FAULT CLASSIFICATION',
  'Her arıza aynı değildir;\nsistem tipini de ayırt eder.': 'Not all faults are alike;\nthe system tells them apart.',
  'Kalıcı ve geçici arızalar, faz-faz ile faz-toprak arızaları ayrı sınıflandırılır.':
    'Permanent and transient faults, and phase-to-phase versus phase-to-earth faults, are classified separately.',
  'KALICI ARIZA': 'PERMANENT FAULT',
  'Kesici açık kalır, hat enerjisiz kalır. Arızanın fiziksel bir sebebi vardır ve müdahale şarttır.':
    'The breaker stays open and the line stays dead. The fault has a physical cause and intervention is required.',
  'İletken kopması': 'Conductor break',
  'Direk devrilmesi': 'Pole collapse',
  'İzolatör delinmesi': 'Insulator puncture',
  'Hatta düşen ağaç': 'Tree fallen on the line',
  'GEÇİCİ ARIZA': 'TRANSIENT FAULT',
  'Kesici tekrar kapanır, hat kendiliğinden normale döner. Sebep anlıktır, kalıcı hasar bırakmaz.':
    'The breaker recloses and the line returns to normal by itself. The cause is momentary and leaves no lasting damage.',
  'Rüzgârda iletken teması': 'Conductor clash in wind',
  'Kuş veya hayvan teması': 'Bird or animal contact',
  'Yıldırım kaynaklı atlama': 'Lightning-induced flashover',
  'Dala sürtünme': 'Branch brushing the line',

  /* ---------------- S8 — veri aktarımı ---------------- */
  'VERİ AKTARIMI': 'DATA TRANSFER',
  'Saha verisi kablosuz\nolarak merkeze akar.': 'Field data flows to the\ncentre over the air.',
  'Ölçümler, olaylar ve cihaz sağlık bilgileri şifreli olarak aktarılır. Merkez, müşterinin kendi sunucusu ya da EnerjiOne bulutu olabilir; bağlantı koptuğunda veri sahada tamponlanır.':
    'Measurements, events and device health data are transferred encrypted. The centre can be the customer’s own server or the EnerjiOne cloud; if the link drops, data is buffered in the field.',
  'TAŞIMA PROTOKOLLERİ': 'TRANSPORT PROTOCOLS',

  /* ---------------- platform ekranları ---------------- */
  'ARIZA KONUMLANDIRMA': 'FAULT LOCALIZATION',
  'Arıza noktasını tahmin etmek yerine arıza bölgesini görün.': 'See the fault section instead of guessing the fault point.',
  'Hat üzerindeki son arıza algılayan nokta ile ilk algılamayan nokta birlikte değerlendirilir; aranacak kesim daraltılarak ekip hedefli müdahale eder.':
    'The last point on the line that detected the fault and the first that did not are evaluated together; the span to search narrows and the crew responds with a clear target.',
  'KONUMLANDIRMA': 'LOCALIZATION',
  'İki direk arasına kadar daraltılmış arıza bölgesi': 'Fault section narrowed down to between two poles',
  'ÇOKLU ARIZA': 'MULTIPLE FAULTS',
  'Aynı hatta bağımsız bölgeler ayrı izlenebilir': 'Independent sections on the same line are tracked separately',
  'SAHA SONUCU': 'FIELD OUTCOME',
  'Daha az hat taraması, daha hedefli yönlendirme': 'Less line patrolling, better targeted dispatch',

  'HARİTA VE SAHA OPERASYONU': 'MAP & FIELD OPERATIONS',
  'Arıza bölgesini harita üzerinde tek bakışta görün.': 'See the fault section on the map at a glance.',
  'Aktif arıza kaydı; konum, etkilenen hat bölümü, olay anındaki ölçümler ve sorumlu ekip bilgisiyle birlikte tek ekranda yönetilir.':
    'The active fault record — location, affected line section, readings at the moment of the event and the responsible crew — is managed on a single screen.',
  'HARİTA': 'MAP',
  'Sağlıklı ve arızalı hat bölümleri ayrıştırılır': 'Healthy and faulted line sections are told apart',
  'ATAMA': 'ASSIGNMENT',
  'Arıza sorumlu kişi veya ekibe yönlendirilir': 'The fault is routed to the responsible person or crew',
  'GEÇMİŞ': 'HISTORY',
  'Tekrarlayan olaylar aynı hat üzerinden izlenir': 'Recurring events are tracked on the same line',

  'ÇEVRİMDIŞI HARİTA': 'OFFLINE MAP',
  'İnternet olmayan sahada da harita çalışır.': 'The map works in the field even without internet.',
  'Harita altlığı sunucuya önceden indirilir. Saha ekibi internet çekmeyen bölgede de hat topolojisini, direkleri ve arıza konumunu harita üzerinde görür.':
    'The base map is downloaded to the server in advance. Even where there is no signal, the crew sees line topology, poles and the fault location on the map.',
  'YEREL ALTLIK': 'LOCAL BASE MAP',
  'Harita verisi kurum sunucusunda saklanır': 'Map data is held on the organisation’s own server',
  'İNTERNETSİZ ÇALIŞMA': 'WORKS OFFLINE',
  'Dış servise bağımlılık yok': 'No dependency on an external service',
  'AYNI GÖRÜNÜM': 'IDENTICAL VIEW',
  'Çevrimiçi ile birebir aynı hat ve cihaz konumları': 'Exactly the same line and device positions as online',

  'HAT VE DİREK YÖNETİMİ': 'LINE & POLE MANAGEMENT',
  'Şebeke verinizi olduğu gibi içeri alın.': 'Bring your network data in as it is.',
  'Hat, direk ve cihaz kayıtları Excel veya CSV ile toplu olarak içeri aktarılır, aynı biçimde dışarı alınır. Farklı marka harita ve CBS uygulamalarından aldığınız direk çıktıları doğrudan sisteme aktarılabilir.':
    'Line, pole and device records are imported in bulk via Excel or CSV and exported the same way. Pole exports from third-party mapping and GIS applications can be loaded straight into the system.',
  'EXCEL / CSV': 'EXCEL / CSV',
  'Toplu içeri ve dışarı aktarım': 'Bulk import and export',
  'HARİTA ÇIKTILARI': 'MAP EXPORTS',
  'Farklı marka CBS ve harita uygulamalarından direk aktarımı': 'Pole import from third-party GIS and mapping tools',
  'TOPOLOJİ KURULUMU': 'TOPOLOGY SETUP',
  'Direk sırası ve hat bağlantıları tek seferde tanımlanır': 'Pole order and line connections defined in one pass',
  'GÜNCELLEME': 'UPDATES',
  'Değişen şebeke yeniden yüklenerek güncellenir': 'A changed network is updated by reloading it',

  'ARIZA KÜNYESİ': 'FAULT RECORD',
  'Her arıza, olay anındaki değerleriyle birlikte saklanır.': 'Every fault is stored together with the readings at the moment it happened.',
  'Konum, etkilenen hat bölümü, ölçümler, süre ve müdahale adımları tek kayıt altında toplanır; olay kapandıktan sonra da geriye dönük incelenebilir.':
    'Location, affected line section, measurements, duration and response steps are gathered in one record and can be reviewed after the event is closed.',
  'OLAY ANI': 'MOMENT OF EVENT',
  'Arıza anındaki kritik değerler': 'Critical values at the instant of the fault',
  'SÜRE': 'DURATION',
  'Açılış, müdahale ve kapanış zamanları': 'Open, response and close timestamps',
  'NOTLAR': 'NOTES',
  'Ekip yorumları ve çözüm kaydı': 'Crew comments and resolution record',

  'CANLI CİHAZ GÖRÜNÜRLÜĞÜ': 'LIVE DEVICE VISIBILITY',
  'Sahadaki her cihazın durumunu tek ekranda yönetin.': 'Manage the status of every field device on one screen.',
  'Cihazın ölçümleri, çalışma modu, haberleşme kalitesi, batarya durumu, alarmları ve olay geçmişi birlikte sunulur.':
    'Device readings, operating mode, link quality, battery status, alarms and event history are presented together.',
  'CANLI ÖLÇÜMLER': 'LIVE READINGS',
  'Akım, gerilim, sıcaklık ve cihaz sinyalleri': 'Current, voltage, temperature and device signals',
  'CİHAZ SAĞLIĞI': 'DEVICE HEALTH',
  'Batarya, haberleşme ve çalışma modu': 'Battery, communications and operating mode',
  'TEK KAYIT': 'ONE RECORD',
  'Alarm, olay, konfigürasyon ve rapor aynı cihazda': 'Alarms, events, configuration and reports on one device',

  'MERKEZİ ALARM YÖNETİMİ': 'CENTRAL ALARM MANAGEMENT',
  'Alarmı görmekten öte, müdahale sürecini yönetin.': 'Go beyond seeing the alarm — manage the response.',
  'Öncelik, durum, sorumlu kullanıcı, süre, yorum ve tekrar sıklığı tek alarm kaydı altında izlenir; hiçbir işlem görünmez kalmaz.':
    'Priority, status, assignee, duration, comments and recurrence are tracked under a single alarm record; no action goes unseen.',
  'Alarm oluşur': 'Alarm is raised',
  'Operatör onaylar': 'Operator acknowledges',
  'Sorumlu atanır': 'Owner is assigned',
  'Müdahale kaydedilir': 'Response is logged',
  'Olay geçmişe alınır': 'Event moves to history',

  'ANALİZ VE BAKIM KARARLARI': 'ANALYTICS & MAINTENANCE DECISIONS',
  'Geçmiş veriyi bakım önceliğine dönüştürün.': 'Turn historical data into maintenance priorities.',
  'Hat, bölge, cihaz, zaman ve arıza sebebi bazındaki analizler; tekrar eden sorunları ve bakım odağını görünür hale getirir.':
    'Analyses by line, region, device, time and fault cause reveal recurring problems and where maintenance should focus.',
  'YOĞUNLUK': 'CONCENTRATION',
  'Sorunların hangi hat ve bölgelerde biriktiği': 'Which lines and regions problems pile up on',
  'TEKRAR': 'RECURRENCE',
  'Aynı hatta yeniden oluşan arızalar': 'Faults reappearing on the same line',
  'Arıza ve çözüm zamanlarının karşılaştırılması': 'Comparison of fault and resolution times',
  'SAĞLIK': 'HEALTH',
  'Cihaz ve haberleşme performansının izlenmesi': 'Monitoring device and communication performance',

  'RAPORLAMA VE İZLENEBİLİRLİK': 'REPORTING & TRACEABILITY',
  'Paylaşılabilir, denetlenebilir kayıt.': 'A record you can share and audit.',
  'Arıza, cihaz ve olay bazında standart rapor üretilir. PDF çıktılar saha paylaşımına hazırdır; aynı veri Excel ve CSV olarak da dışa aktarılabilir.':
    'Standard reports are produced per fault, device and event. PDF outputs are ready to share in the field, and the same data can be exported as Excel or CSV.',
  'ARIZA RAPORU': 'FAULT REPORT',
  'CİHAZ DURUM RAPORU': 'DEVICE STATUS REPORT',
  'OLAY RAPORU': 'EVENT REPORT',
  'TABLO ÇIKTISI': 'TABLE EXPORT',
  'STANDART ÇIKTI': 'STANDARD OUTPUT',
  'PDF ve saha paylaşımına uygun biçim': 'PDF, formatted for sharing in the field',
  'İZLENEBİLİRLİK': 'TRACEABILITY',
  'Açılıştan kapanışa kadar tam kayıt': 'A complete record from open to close',
  'Kartlara tıklayarak rapor türleri arasında geçiş yapabilirsiniz. Örnek çıktılardaki değerler test senaryosuna aittir.':
    'Click the cards to switch between report types. The values in the sample outputs come from a test scenario.',
  'Excel · CSV · PDF olarak dışa aktarılır': 'Exported as Excel · CSV · PDF',
  'TARİH': 'DATE',
  'TİP': 'TYPE',
  'KALICI': 'PERMANENT',
  'GEÇİCİ': 'TRANSIENT',

  /* ---------------- roller ---------------- */
  'ROL VE YETKİ YÖNETİMİ': 'ROLE & PERMISSION MANAGEMENT',
  'Herkes yalnızca\nişini ve bölgesini görür.': 'Everyone sees only\ntheir own work and region.',
  'Kurulumdan operasyona kadar her ekip kendi yetkisiyle çalışır. Kullanıcılar ekiplere, ekipler bölgelere atanır; alarm ve bildirimler yalnızca ilgili bölgenin ekibine gider. Installer rolü tüm yetkilere sahiptir.':
    'From commissioning to operations, every team works within its own permissions. Users are assigned to teams and teams to regions; alarms and notifications reach only the crew of the region concerned. The Installer role holds every permission.',
  'ROL BAZLI ERİŞİM': 'ROLE-BASED ACCESS',
  'Yetki dışı ekran ve işlem görünmez': 'Screens and actions outside your role stay hidden',
  'EKİP VE BÖLGE': 'TEAMS & REGIONS',
  'Ekipler bölgelere atanır, kapsam netleşir': 'Teams are assigned to regions, scope becomes clear',
  'GEREKSİZ BİLDİRİM YOK': 'NO NOISE',
  'Alarm yalnızca ilgili ekibe ulaşır': 'An alarm reaches only the crew it concerns',
  'DENETİM KAYDI': 'AUDIT LOG',
  'Her işlem kullanıcı ve zamanla saklanır': 'Every action is stored with user and timestamp',
  'ROL': 'ROLE',
  'KURULUM': 'COMMISSIONING',
  'KONFİG.': 'CONFIG.',
  'MÜDAHALE': 'RESPONSE',
  'EKİP / BÖLGE': 'TEAM / REGION',
  'RAPOR': 'REPORTS',
  'KULLANICI': 'USERS',
  'TÜM YETKİLER': 'ALL PERMISSIONS',
  'Saha kurulum ekibi': 'Field commissioning crew',
  'Tam yetkili rol. Kurulum, konfigürasyon, ekip ve bölge tanımları dahil her işlemi yapabilir.':
    'Full-permission role. Can perform every action, including commissioning, configuration and team and region definitions.',
  'Sistem mühendisi': 'Systems engineer',
  'Konfigürasyon, eşik değerleri, haberleşme ve entegrasyon ayarları': 'Configuration, thresholds, communications and integration settings',
  'Operasyon yöneticisi': 'Operations manager',
  'Ekip atama, bölge tanımı, kullanıcı ve yetki yönetimi, denetim kaydı': 'Crew assignment, region definition, user and permission management, audit log',
  'Vardiya operatörü': 'Shift operator',
  'Alarm izleme, onaylama ve müdahale adımlarının kaydı': 'Alarm monitoring, acknowledgement and logging of response steps',
  'EKİP YÖNETİMİ': 'TEAM MANAGEMENT',
  'Kullanıcılar ekiplere, ekipler bölgelere atanır': 'Users are assigned to teams, teams to regions',
  'BÖLGE AYRIMI': 'REGIONAL SCOPE',
  'Her ekip yalnızca kendi bölgesinin hatlarını görür': 'Each crew sees only the lines in its own region',
  'HEDEFLİ BİLDİRİM': 'TARGETED ALERTS',
  'Alarm herkese değil, ilgili ekibe gider': 'An alarm goes to the right crew, not to everyone',

  /* ---------------- denetim kaydı ---------------- */
  'OLAY VE DENETİM KAYDI': 'EVENT & AUDIT LOG',
  'Sistemde olan biten\nkayıt dışı kalmaz.': 'Nothing in the system\ngoes unrecorded.',
  'Cihaz olayları, kullanıcı girişleri, konfigürasyon değişiklikleri ve alarm işlemleri tek bir akışta toplanır. Kategori, öncelik, kullanıcı ve cihaz bazında filtrelenir; dışarı aktarılabilir.':
    'Device events, user logins, configuration changes and alarm actions are gathered into a single stream. It can be filtered by category, priority, user and device, and exported.',
  'TEK AKIŞ': 'ONE STREAM',
  'Cihaz, kullanıcı ve sistem olayları bir arada': 'Device, user and system events side by side',
  'KİM YAPTI': 'WHO DID IT',
  'Her işlem kullanıcı ve zaman damgasıyla': 'Every action with its user and timestamp',
  'FİLTRE VE DIŞA AKTARIM': 'FILTER & EXPORT',
  'Kategori, öncelik ve cihaz bazında süzme': 'Filtering by category, priority and device',

  /* ---------------- bildirimler ---------------- */
  'ARIZA VE ALARM BİLDİRİMİ': 'FAULT & ALARM NOTIFICATIONS',
  'Arıza olduğu anda\ndoğru kişiye ulaşır.': 'The right person\nknows instantly.',
  'Bildirim; bölge, hat, arıza aralığı, tahmini mesafe ve harita konumuyla birlikte gider. Kural motoru olayı önceliğe, bölgeye ve sorumlu ekibe göre yönlendirir; webhook ile n8n veya Make gibi otomasyon araçlarına da aktarılabilir.':
    'The notification carries the region, line, fault span, estimated distance and map location. The rule engine routes the event by priority, region and responsible crew, and a webhook can pass it on to automation tools such as n8n or Make.',
  'Ekip grubuna anlık mesaj olarak düşer': 'Lands in the crew group as an instant message',
  'Kanal ve gruplara bot üzerinden iletilir': 'Delivered to channels and groups through a bot',
  'İnternet çekmeyen sahada da ulaşır': 'Gets through even where there is no data signal',
  'Ölçüm tablosu ve harita ile detaylı alarm': 'A detailed alarm with a readings table and map',
  'Mobil Bildirim': 'Push Notification',
  'EnerjiOne mobil uygulamasına anlık push': 'An instant push to the EnerjiOne mobile app',
  'Webhook · n8n': 'Webhook · n8n',
  'Olay verisi n8n, Make veya kendi sisteminize gönderilir': 'Event data is sent to n8n, Make or your own system',
  'ARIZA ALGILANIR': 'FAULT IS DETECTED',
  'Cihaz olayı anında merkeze iletir': 'The device reports the event to the centre at once',
  'KURAL MOTORU EŞLEŞTİRİR': 'RULE ENGINE MATCHES',
  'Bölge, hat ve önceliğe göre sorumluyu bulur': 'Finds the owner by region, line and priority',
  'YALNIZCA İLGİLİ EKİBE GİDER': 'ONLY THE RIGHT CREW IS ALERTED',
  'Alarm herkese değil, o hattın ekibine düşer': 'The alarm goes to that line’s crew, not to everyone',
  'SEÇİLEN KANALDAN ULAŞIR': 'DELIVERED ON THE CHOSEN CHANNEL',
  'WhatsApp, Telegram, SMS, e-posta, mobil, webhook': 'WhatsApp, Telegram, SMS, e-mail, mobile, webhook',
  'Arıza Ekibi': 'Fault Crew',
  'kanal · bot': 'channel · bot',
  'EnerjiOne Grid, Murat, Selim, +5': 'EnerjiOne Grid, Murat, Selim, +5',
  'BUGÜN': 'TODAY',
  'HAT ARIZASI': 'LINE FAULT',
  'Bölge': 'Region',
  'Hat': 'Line',
  'Arıza aralığı': 'Fault span',
  'Cihazlar arası': 'Between devices',
  'Tahmini mesafe': 'Estimated distance',
  'Kesim uzunluğu': 'Section length',
  'Konum': 'Location',
  'DEMO-3 – hat ucu': 'DEMO-3 – line end',
  '848 m – 1,12 km (hat başından)': '848 m – 1.12 km (from line start)',
  '848 m – 1,12 km (hat başından), 272 m’lik kesim': '848 m – 1.12 km (from line start), a 272 m section',
  'Ekip yola çıktı, 20 dk içinde bölgedeyiz.': 'Crew is on the way, we will be on site in 20 minutes.',
  'EnerjiOne Grid · 1,2B görüntülenme · 10:44': 'EnerjiOne Grid · 1.2K views · 10:44',
  'kısa mesaj': 'text message',
  'Kesim: 272 m': 'Section: 272 m',
  '[Kritik] Haberleşme arızası — SN-00014': '[Critical] Communication failure — SN-00014',
  '⚠ Yeni Alarm — Kritik': '⚠ New Alarm — Critical',
  'Haberleşme arızası': 'Communication failure',
  'Cihaz haberleşmesinde sorun var.': 'There is a problem with the device link.',
  'ANA HAT': 'MAIN LINE',
  'BÖLGE': 'REGION',
  'ZAMAN': 'TIME',
  'Bu e-posta, alarm kuralının “E-posta gönder” seçeneği açık olduğu için gönderildi.':
    'This e-mail was sent because the “Send e-mail” option is enabled on the alarm rule.',
  'Çarşamba, 12 Ağustos': 'Wednesday, 12 August',
  'şimdi': 'now',
  'Ankara · Direk #1 – Direk #2 arası kalıcı arıza.': 'Ankara · Permanent fault between pole #1 and pole #2.',
  'Faz A–B': 'Phase A–B',
  'Konum ekli': 'Location attached',
  'Haritada Aç': 'Open in Map',
  'Ekibe Ata': 'Assign to Crew',
  'n8n · Arıza Otomasyonu': 'n8n · Fault Automation',
  'Aktif': 'Active',
  'olay JSON': 'event JSON',
  'konum': 'location',
  'ölçüm': 'readings',
  'webhook tetiklendi': 'webhook triggered',
  'Direk #1 – Direk #2': 'Pole #1 – Pole #2',

  /* ---------------- mobil ---------------- */
  'MOBİL UYGULAMA': 'MOBILE APP',
  'Saha ekibi aynı sistemi\ncebinden kullanır.': 'The same system,\nin the crew’s pocket.',
  'Harita, alarm, olay ve cihaz ölçümleri mobil uygulamada da aynı verilerle çalışır. Ekip sahadayken arıza bölgesini haritada görür, alarmı onaylar ve müdahale notunu yerinde girer.':
    'Map, alarms, events and device readings run on the same data in the mobile app. On site, the crew sees the fault section on the map, acknowledges the alarm and enters the response note where they stand.',
  'SAHADA HARİTA': 'MAP IN THE FIELD',
  'Arıza bölgesi ve hat topolojisi cepte': 'Fault section and line topology in your pocket',
  'YERİNDE ONAY': 'ON-SITE ACKNOWLEDGEMENT',
  'Alarm onayı ve müdahale notu sahadan': 'Acknowledge alarms and log notes from the field',
  'İNDİR': 'GET IT ON',
  'Harita': 'Map',
  'Arıza Konumu': 'Fault Location',
  'Alarmlar': 'Alarms',
  'Olaylar': 'Events',
  'Alarm Detayı': 'Alarm Detail',
  'Cihaz Ölçümleri': 'Device Readings',
  'Arıza Yorumları': 'Fault Comments',
  'Cihaz Listesi': 'Device List',
  'Ölçüm Detayı': 'Reading Detail',
  'Mühendislik': 'Engineering',
  'Faz Ölçümleri': 'Phase Readings',
  'Kullanıcı Yönetimi': 'User Management',
  'Bildirim Ayarları': 'Notification Settings',
  'Canlı Değerler': 'Live Values',
  'Giriş Ekranı': 'Login Screen',
  'Sistem Durumu': 'System Status',
  'Harita Detayı': 'Map Detail',
  'Sinyal Listesi': 'Signal List',
  'Cihaz Alarmları': 'Device Alarms',

  /* ---------------- dil ---------------- */
  'ÇOK DİLLİ ARAYÜZ': 'MULTILINGUAL INTERFACE',
  'Ekip hangi dili konuşuyorsa\nsistem de onu konuşur.': 'The system speaks\nyour crew’s language.',
  'Arayüz dili kullanıcı bazında seçilir; aynı kurulumda farklı kullanıcılar farklı dilde çalışabilir. Raporlar da seçilen dilde üretilir. Yeni bir dil eklemek yalnızca çeviri dosyası eklemekten ibarettir, yazılım değişikliği gerektirmez.':
    'The interface language is chosen per user, so different people can work in different languages on the same installation. Reports are produced in the selected language too. Adding a new language means adding a translation file — no software change required.',
  'KARMA EKİPLER': 'MIXED TEAMS',
  'Yerel ve yabancı ekipler aynı sistemde': 'Local and international crews on one system',
  'ÇIKTILAR DA ÇEVİRİLİ': 'OUTPUTS TRANSLATED TOO',
  'Rapor ve bildirimler seçilen dilde': 'Reports and notifications in the chosen language',
  'KULLANICI BAZINDA': 'PER USER',
  'Her kullanıcı kendi arayüz dilini seçer': 'Each user picks their own interface language',
  'RAPOR DİLİ': 'REPORT LANGUAGE',
  'Çıktılar da seçilen dilde üretilir': 'Outputs are produced in the selected language',
  'GENİŞLETİLEBİLİR': 'EXTENSIBLE',
  'Yeni dil eklemek çeviri dosyası eklemektir': 'Adding a language means adding a translation file',
  'VARSAYILAN': 'DEFAULT',
  'HAZIR': 'AVAILABLE',
  'TALEP ÜZERİNE': 'ON REQUEST',

  /* ---------------- ölçeklenebilirlik ---------------- */
  'ÖLÇEKLENEBİLİRLİK VE SÜREKLİLİK': 'SCALABILITY & CONTINUITY',
  'Sistem sizinle\nbirlikte büyür.': 'The system grows\nalong with you.',
  'Tek bir pilot hatla başlayın, aynı kurulumu bölge geneline kadar büyütün. Mimari değişmez; kapasite gerektiği kadar genişler. Kritik kurulumlarda yedekli çalışma seçeneğiyle hizmet sürekliliği güvence altına alınır.':
    'Start with a single pilot line and grow the same installation to cover a whole region. The architecture stays the same; capacity expands as far as you need. On critical installations, an optional redundant setup safeguards service continuity.',
  'PARALEL İŞLEME': 'PARALLEL PROCESSING',
  'Her gateway kendi cihaz kümesini bağımsız yönetir': 'Each gateway manages its own device cluster independently',
  'HOT STANDBY': 'HOT STANDBY',
  'İsteğe bağlı yedekli kurulum, otomatik devralma': 'Optional redundant installation with automatic failover',
  'AYNI KURULUM, BÜYÜYEN ÖLÇEK': 'SAME INSTALLATION, GROWING SCALE',
  'PİLOT HAT': 'PILOT LINE',
  'İLÇE': 'DISTRICT',
  'GENİŞLETİLMİŞ': 'EXTENDED',
  'gateway eklenerek': 'by adding gateways',
  'HOT STANDBY — İSTEĞE BAĞLI YEDEKLİ KURULUM': 'HOT STANDBY — OPTIONAL REDUNDANT INSTALLATION',
  'AKTİF SUNUCU': 'ACTIVE SERVER',
  'tüm trafiği karşılar': 'handles all traffic',
  'ÇALIŞIYOR': 'RUNNING',
  'ANLIK EŞİTLEME': 'LIVE SYNC',
  'YEDEK SUNUCU': 'STANDBY SERVER',
  'devralmaya hazır bekler': 'waiting, ready to take over',
  'SÜREKLİ EŞİTLEME': 'CONTINUOUS SYNC',
  'Yedek sunucu, aktif sunucuyla anlık olarak senkron tutulur': 'The standby server is kept in sync with the active one in real time',
  'OTOMATİK DEVRALMA': 'AUTOMATIC FAILOVER',
  'Aktif sunucu düşerse yedek saniyeler içinde devreye girer': 'If the active server goes down, the standby takes over within seconds',
  'KESİNTİSİZ SAHA': 'UNINTERRUPTED FIELD',
  'Cihaz verisi ve alarmlar akmaya devam eder, kayıp olmaz': 'Device data and alarms keep flowing, nothing is lost',

  /* ---------------- güvenlik ---------------- */
  'SİBER GÜVENLİK': 'CYBER SECURITY',
  'Kritik altyapıya yakışan\ngüvenlik yaklaşımı.': 'Security worthy of\ncritical infrastructure.',
  'Sistem müşterinin kendi altyapısında çalışır; veri dışarı çıkmaz. Saha ile merkez arasındaki iletişim şifrelidir, erişim rol bazlıdır ve her işlem denetlenebilir kayıt altına alınır.':
    'The system runs on the customer’s own infrastructure and no data leaves it. Communication between field and centre is encrypted, access is role-based and every action is written to an auditable log.',
  'UÇTAN UCA ŞİFRELEME': 'END-TO-END ENCRYPTION',
  'Cihazdan merkeze kadar korunan iletim': 'Protected transmission from device to centre',
  'VERİ EGEMENLİĞİ': 'DATA SOVEREIGNTY',
  'On-prem kurulum, dışarı veri çıkışı yok': 'On-prem installation, no data leaves the premises',
  'AĞ KATMANI': 'NETWORK LAYER',
  'Güvenlik duvarı': 'Firewall',
  'Ağ ayrımı (VLAN / DMZ)': 'Network segmentation (VLAN / DMZ)',
  'İLETİM KATMANI': 'TRANSPORT LAYER',
  'Uçtan uca TLS şifreleme': 'End-to-end TLS encryption',
  'İmzalı yazılım güncellemesi': 'Signed firmware updates',
  'ERİŞİM KATMANI': 'ACCESS LAYER',
  'Rol bazlı yetkilendirme': 'Role-based authorisation',
  'Kimlik doğrulama': 'Authentication',
  'İZLEME KATMANI': 'MONITORING LAYER',
  'Süreli uzaktan bakım': 'Time-limited remote maintenance',
  'VERİ SİZDE KALIR': 'YOUR DATA STAYS YOURS',
  'On-prem kurulum · dışarı veri çıkışı yok': 'On-prem installation · no data leaves the premises',

  /* ---------------- entegrasyon ---------------- */
  'AÇIK ENTEGRASYON KATMANI': 'OPEN INTEGRATION LAYER',
  'Olay verisini ihtiyacınız olan yere taşıyın.': 'Take event data wherever you need it.',
  'Tek olay kaynağı, hazır çıkışlar. SCADA telekontrolden otomasyon ve bildirim kanallarına kadar.':
    'One event source, ready-made outputs — from SCADA telecontrol to automation and notification channels.',
  'On-Prem': 'On-prem',
  'Gerçek zamanlı': 'Real time',
  'Denetlenebilir': 'Auditable',
  'Rol bazlı yetki': 'Role-based access',
  'SCADA telekontrol': 'SCADA telecontrol',
  'Saha veri alışverişi': 'Field data exchange',
  'Outbound publish': 'Outbound publish',
  'Dağıtım otomasyonu protokolü': 'Distribution automation protocol',
  'HTTP event çıkışı': 'HTTP event output',
  'Otomasyon akışları': 'Automation workflows',
  'Senaryo otomasyonu': 'Scenario automation',
  'Anlık alarm bildirimi': 'Instant alarm notification',
  'Grup ve kanal bildirimi': 'Group and channel notification',
  'Rapor ve alarm gönderimi': 'Report and alarm delivery',
  'ARIZA OLAYI': 'FAULT EVENT',
  'KURAL MOTORU': 'RULE ENGINE',
  'ÇOKLU ÇIKIŞ': 'MULTIPLE OUTPUTS',
  'SCADA VE SAHA PROTOKOLLERİ': 'SCADA & FIELD PROTOCOLS',
  'OTOMASYON VE BİLDİRİM': 'AUTOMATION & NOTIFICATION',
  'ÖNE ÇIKAN': 'FEATURED',
  'SMS · E-POSTA': 'SMS · E-MAIL',
  'E-posta': 'E-mail',

  /* ---------------- kapanış ---------------- */
  'Şebekenizi görünür,\nmüdahalenizi hedefli hale getirin.': 'A visible network,\na targeted response.',
  'EnerjiOne Grid bir dashboard değil; arıza bilgisini saha aksiyonuna dönüştüren operasyon platformudur. Canlı demo ve kendi hat topolojinize özel saha senaryosu için EnerjiOne ekibiyle iletişime geçin.':
    'EnerjiOne Grid is not a dashboard; it is an operations platform that turns fault data into field action. Contact the EnerjiOne team for a live demo and a field scenario built around your own line topology.',
  'ENERJIONE AİLESİ': 'THE ENERJIONE FAMILY',
  'Satış ve Proje Yöneticisi': 'Sales & Project Manager',
  'Ad Soyad': 'Full Name',
  'fotoğraf ekle': 'add photo',

  /* ---------------- 3B görüntüleyici ---------------- */
  'Sürükleyerek çevirin · çift tık sıfırlar': 'Drag to rotate · double-click to reset',
  '3B model yükleniyor…': 'Loading 3D model…',
  'Model yüklenemedi': 'Model could not be loaded',
  'Denetim kaydı': 'Audit log',
  'Cihaz normal şartlarda modemini kapatıp derin uyku moduna geçer. Arıza akımını algıladığı anda uyanır, bildirimi saniyeler içinde gönderir; belirli aralıklarla da kendiliğinden uyanıp topladığı ölçümleri iletir. Enerjisini hattan alır: 5 A üzerindeki hatlarda kendini şarj eder, harici beslemeye ihtiyaç duymaz.':
    'Under normal conditions the device shuts down its modem and drops into deep sleep. It wakes the instant it senses fault current and sends the alert within seconds; at set intervals it also wakes on its own to report the readings it has gathered. It draws its power from the line: on lines above 5 A it charges itself and needs no external supply.',
  'HAT': 'LINE',
  'cihaz': 'devices',
  'Ekibe Ata': 'Assign to Crew',
  'Fotoğraf seçmek için tıklayın': 'Click to choose a photo',
  'BEKLEMEDE': 'ON STANDBY',
  'Otomatik yedekleme ve geri dönüş': 'Automatic backup and restore',
  'UYKU': 'SLEEP',
  'UYANMA': 'WAKE',
  'Ekran ': 'Screen ',
}

export default t
