import { deepT, t as t18 } from './i18n'
import {
  Cpu, UserCog, Headset, Check, Minus,
  Users, MapPinned, BellOff,
  Server, ServerCog, ArrowLeftRight, Boxes, DatabaseBackup, CircleCheck,
  Router, Plus, Infinity as InfinityIcon,
  ShieldCheck, BrickWall, LockKeyhole, KeyRound, ScrollText, Network, Clock,
  Fingerprint, BadgeCheck,
} from 'lucide-react'
import { faviconUrl } from './slides'

/* ==================================================================
   1) KULLANICI ROLLERİ - yetki matrisi + ekip / bölge yönetimi
   ================================================================== */

const CAPS = ['KURULUM', 'KONFİG.', 'MÜDAHALE', 'EKİP / BÖLGE', 'RAPOR', 'KULLANICI']

const ROLES = [
  {
    key: 'installer', Icon: ShieldCheck,
    name: 'Sistem Yöneticisi', tr: 'Kurulum ve sistem sorumlusu',
    desc: 'Tam yetkili rol. Kurulum, konfigürasyon, ekip ve bölge tanımları dahil her işlemi yapabilir.',
    perms: [1, 1, 1, 1, 1, 1],
    all: true,
  },
  {
    key: 'engineer', Icon: Cpu,
    name: 'Engineer', tr: 'Sistem mühendisi',
    desc: 'Konfigürasyon, eşik değerleri, haberleşme ve entegrasyon ayarları',
    perms: [0, 1, 1, 1, 1, 1],
  },
  {
    key: 'manager', Icon: UserCog,
    name: 'Operation Manager', tr: 'Operasyon yöneticisi',
    desc: 'Ekip atama, bölge tanımı, kullanıcı ve yetki yönetimi, denetim kaydı',
    perms: [0, 0, 1, 1, 1, 1],
  },
  {
    key: 'operator', Icon: Headset,
    name: 'Operator', tr: 'Vardiya operatörü',
    desc: 'Alarm izleme, onaylama ve müdahale adımlarının kaydı',
    perms: [0, 0, 1, 0, 1, 0],
  },
]

const ROLE_FOOT = [
  { Icon: Users, t: 'EKİP YÖNETİMİ', d: 'Kullanıcılar ekiplere, ekipler bölgelere atanır' },
  { Icon: MapPinned, t: 'BÖLGE AYRIMI', d: 'Her ekip yalnızca kendi bölgesinin hatlarını görür' },
  { Icon: BellOff, t: 'HEDEFLİ BİLDİRİM', d: 'Alarm herkese değil, ilgili ekibe gider' },
]

export function RoleMatrix() {
  return (
    <div className="roles">
      <div className="roles__head">
        <span className="roles__hcell roles__hcell--name">{t18('ROL')}</span>
        {deepT(CAPS).map((c) => <span className="roles__hcell" key={c}>{c}</span>)}
      </div>

      {deepT(ROLES).map(({ key, Icon, name, tr, desc, perms, all }, i) => (
        <div className={'role' + (all ? ' role--all' : '')} key={key} style={{ animationDelay: `${i * 0.12}s` }}>
          <span className="role__id">
            <i className="role__ic"><Icon size={19} strokeWidth={1.85} /></i>
            <span className="role__tx">
              <b>{name}{all && <span className="role__badge">{t18('TÜM YETKİLER')}</span>}</b>
              <em>{tr}</em>
              <span className="role__desc">{desc}</span>
            </span>
          </span>
          {perms.map((p, j) => (
            <span className={'role__cell' + (p ? ' is-on' : '')} key={j}>
              {p ? <Check size={15} strokeWidth={2.9} /> : <Minus size={14} strokeWidth={2.4} />}
            </span>
          ))}
        </div>
      ))}

      <div className="roles__foot">
        {deepT(ROLE_FOOT).map(({ Icon, t, d }) => (
          <span className="rfoot" key={t}>
            <i><Icon size={16} strokeWidth={1.9} /></i>
            <span>
              <b>{t}</b>
              <em>{d}</em>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ==================================================================
   2) ÖLÇEKLENEBİLİRLİK + HOT STANDBY
   ================================================================== */

/* Sunucu paketleri. Kapasite baglanti noktasi cinsindendir; bir nokta
   bir toplayicidir ve 3-9 saha cihazi tasir (uc faz = uc cihaz, uc set). */
const TIERS = ['PILOT', 'STANDARD', 'PRO', 'ENTERPRISE']

const CAP_ROWS = [
  { k: 'Bağlantı noktası', v: ['100', '300', '500', '1.000'] },
  { k: 'Saha cihazı',      v: ['300 – 900', '900 – 2.700', '1.500 – 4.500', '3.000 – 9.000'] },
  { k: 'Yedeklilik',       v: ['-', 'Opsiyonel', 'Önerilir', 'Hot standby'] },
]

const HA_STEPS = [
  { n: '01', t: 'SÜREKLİ EŞİTLEME', d: 'Yedek sunucu, aktif sunucuyla anlık olarak senkron tutulur' },
  { n: '02', t: 'OTOMATİK DEVRALMA', d: 'Aktif sunucu düşerse yedek saniyeler içinde devreye girer' },
  { n: '03', t: 'KESİNTİSİZ SAHA', d: 'Cihaz verisi ve alarmlar akmaya devam eder, kayıp olmaz' },
]

export function ScaleDiagram() {
  return (
    <div className="scale">
      {/* --- genisleme kapasitesi --- */}
      <div className="grow">
        <div className="grow__head">
          <span className="hrule" />
          <b className="grow__hi">{t18('AYNI KURULUM, BÜYÜYEN ÖLÇEK')}</b>
        </div>

        <div className="caps">
          <div className="caps__head">
            <span className="caps__rk" />
            {TIERS.map((tier, i) => (
              <span className={'caps__th' + (i === TIERS.length - 1 ? ' is-top' : '')} key={tier}>
                {tier}
              </span>
            ))}
          </div>

          {deepT(CAP_ROWS).map((r, ri) => (
            <div className="caps__row" key={r.k} style={{ '--i': ri }}>
              <span className="caps__rk">{r.k}</span>
              {r.v.map((v, i) => (
                <span className={'caps__cell' + (i === r.v.length - 1 ? ' is-top' : '')} key={i}>
                  {v}
                </span>
              ))}
            </div>
          ))}
        </div>

        <span className="caps__note">
          {t18('Her bağlantı noktası bir toplayıcıdır ve 3 – 9 saha cihazı taşır.')}
        </span>
      </div>

      {/* --- sureklilik --- */}
      <div className="hax">
        <div className="hax__head">
          <span className="hrule" />
          <b className="hax__hi">{t18('HOT STANDBY - PRO VE ENTERPRISE PAKETLERİNDE ÖNERİLİR')}</b>
        </div>

        <div className="ha">
          <div className="ha__node ha__node--active">
            <span className="ha__mark">
              <span className="ha__pulsering" />
              {faviconUrl && <img src={faviconUrl} alt="" />}
            </span>
            <b>{t18('AKTİF SUNUCU')}</b>
            <em>{t18('tüm trafiği karşılar')}</em>
            <span className="ha__state"><i />{t18('ÇALIŞIYOR')}</span>
          </div>

          <div className="ha__link">
            <span className="ha__linktx">{t18('ANLIK EŞİTLEME')}</span>
            <svg className="ha__wire" viewBox="0 0 160 10" preserveAspectRatio="none">
              <line x1="0" y1="5" x2="160" y2="5" stroke="rgba(255,255,255,.14)" strokeWidth="1"
                strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
              <line className="ha__pulse" x1="0" y1="5" x2="160" y2="5" stroke="#59a6ff" strokeWidth="2.4"
                strokeDasharray="10 90" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span className="ha__sync"><ArrowLeftRight size={13} strokeWidth={2.2} /></span>
          </div>

          <div className="ha__node ha__node--standby">
            <span className="ha__mark ha__mark--wait">
              {faviconUrl && <img src={faviconUrl} alt="" />}
            </span>
            <b>{t18('YEDEK SUNUCU')}</b>
            <em>{t18('devralmaya hazır bekler')}</em>
            <span className="ha__state ha__state--wait"><i />{t18('BEKLEMEDE')}</span>
          </div>
        </div>

        <div className="hax__steps">
          {deepT(HA_STEPS).map((st, i) => (
            <div className="hstep" key={st.n} style={{ '--i': i }}>
              <b>{st.n}</b>
              <span>
                <em>{st.t}</em>
                <i>{st.d}</i>
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

/* ==================================================================
   3) SİBER GÜVENLİK - katmanlı savunma
   ================================================================== */

const LAYERS = [
  {
    k: 1, Icon: BrickWall, t: 'AĞ KATMANI',
    items: ['Güvenlik duvarı', 'Ağ ayrımı (VLAN / DMZ)'],
  },
  {
    k: 2, Icon: LockKeyhole, t: 'İLETİM KATMANI',
    items: ['Uçtan uca TLS şifreleme', 'İmzalı yazılım güncellemesi'],
  },
  {
    k: 3, Icon: KeyRound, t: 'ERİŞİM KATMANI',
    items: ['Rol bazlı yetkilendirme', 'Kimlik doğrulama'],
  },
  {
    k: 4, Icon: ScrollText, t: 'İZLEME KATMANI',
    items: ['Denetim kaydı', 'Süreli uzaktan bakım'],
  },
]

function Layer({ list, i = 0 }) {
  if (i >= list.length) {
    return (
      <div className="core">
        <span className="core__pulse" />
        <span className="core__pulse core__pulse--2" />
        <span className="core__orb"><ShieldCheck size={26} strokeWidth={1.7} /></span>
        <b>{t18('VERİ SİZDE KALIR')}</b>
        <em>{t18('On-prem kurulum · dışarı veri çıkışı yok')}</em>
        <span className="core__chip">
          <DatabaseBackup size={12} strokeWidth={2.2} />{t18('Otomatik yedekleme ve geri dönüş')}
        </span>
      </div>
    )
  }
  const L = list[i]
  const { Icon } = L
  return (
    <div className={'ring ring--' + L.k} style={{ '--i': i }}>
      <span className="ring__band">
        <span className="ring__tag"><Icon size={13} strokeWidth={2} />{L.t}</span>
        <span className="ring__items">
          {L.items.map((it) => <i key={it}>{it}</i>)}
        </span>
      </span>
      <Layer list={list} i={i + 1} />
    </div>
  )
}

export function SecurityShield() {
  return (
    <div className="sec">
      <div className="shield">
        <Layer list={deepT(LAYERS)} />
      </div>
    </div>
  )
}
