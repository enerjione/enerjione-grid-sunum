import { deepT, t as t18 } from './i18n'
import { useState, useEffect, useRef } from 'react'

/* gercek bayraklar — flag-icons paketinden (yalnizca kullanilanlar paketlenir) */
import flagTR from 'flag-icons/flags/4x3/tr.svg'
import flagGB from 'flag-icons/flags/4x3/gb.svg'
import flagDE from 'flag-icons/flags/4x3/de.svg'
import flagFR from 'flag-icons/flags/4x3/fr.svg'
import flagES from 'flag-icons/flags/4x3/es.svg'
import flagRU from 'flag-icons/flags/4x3/ru.svg'
import flagAZ from 'flag-icons/flags/4x3/az.svg'
import flagSA from 'flag-icons/flags/4x3/sa.svg'
import flagIT from 'flag-icons/flags/4x3/it.svg'

const FLAG_SRC = {
  tr: flagTR, gb: flagGB, de: flagDE, fr: flagFR,
  es: flagES, ru: flagRU, az: flagAZ, sa: flagSA, it: flagIT,
}
import { Globe, Check, UserCog, FileText, Languages, Radio, Layers, Smartphone, UserRound, Mail, Phone } from 'lucide-react'

/* ==================================================================
   1) POLE MASTER KAPASİTESİ — 3 set / 9 cihaz
   Bir toplayıcı, üç ölçüm noktasının üç fazını birden toplar.
   ================================================================== */

const PHASES = ['R', 'S', 'T']

const VBP = { w: 1000, h: 640 }
const PHUB = { x: 500, y: 320 }

const CLUSTERS = [
  { id: 'a', name: 'SET 1', x: 190, y: 122, pos: 'tl' },
  { id: 'b', name: 'SET 2', x: 810, y: 122, pos: 'tr' },
  { id: 'c', name: 'SET 3', x: 500, y: 556, pos: 'b' },
]

const ppct = (x, y) => ({ left: (x / VBP.w) * 100 + '%', top: (y / VBP.h) * 100 + '%' })

/* RF rozetleri: her haberlesme yolunun orta noktasi */
const RF_POINTS = [
  { id: 'a', x: 352, y: 232 },
  { id: 'b', x: 648, y: 232 },
  { id: 'c', x: 670, y: 440 },
]

/* kumeden merkeze giden yol (akis iceri dogru) */
function rfPath(c) {
  if (c.pos === 'b') {
    /* alttaki yol POLE MASTER KIT yazisinin uzerinden gecmesin diye saga yaylanir */
    const bx = c.x + 120
    const by = c.y - 44
    const hx = PHUB.x + 92
    const hy = PHUB.y + 26
    return `M ${bx} ${by} C ${bx + 90} ${by - 40}, ${hx + 80} ${hy + 70}, ${hx} ${hy}`
  }
  const sx = c.x + (c.pos === 'tl' ? 96 : -96)
  const sy = c.y + 52
  const ex = PHUB.x + (c.pos === 'tl' ? -84 : 84)
  const ey = PHUB.y - 34
  return `M ${sx} ${sy} C ${sx + (c.pos === 'tl' ? 90 : -90)} ${sy + 60}, ${ex + (c.pos === 'tl' ? -70 : 70)} ${ey - 46}, ${ex} ${ey}`
}

export function PoleCapacity({ images = {} }) {
  return (
    <div className="pmk">
      <div className="pmk__stage">
        <svg className="pmk__wires" viewBox={`0 0 ${VBP.w} ${VBP.h}`} fill="none" preserveAspectRatio="none">
          {CLUSTERS.map((c, i) => {
            const d = rfPath(c)
            return (
              <g key={c.id}>
                <path d={d} stroke="rgba(255,255,255,.12)" strokeWidth="1.2"
                  strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
                <path
                  className="pmk__flow"
                  d={d}
                  stroke="#ffb066" strokeWidth="2.2" strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="14 190"
                  style={{ animationDelay: `${i * 1.1}s` }}
                />
              </g>
            )
          })}
        </svg>

        {/* haberlesme yolunun uzerindeki RF rozetleri */}
        {RF_POINTS.map((r, i) => (
          <span className="rfbadge" key={r.id} style={{ ...ppct(r.x, r.y), '--i': i }}>
            <Radio size={11} strokeWidth={2.4} />RF
          </span>
        ))}

        {/* merkez: Pole Master Kit — dogrudan yerlestirilmis */}
        <div className="pmk__hub" style={ppct(PHUB.x, PHUB.y)}>
          <span className="pmk__halo" />
          <span className="pmk__ring" />
          <span className="pmk__ring pmk__ring--2" />
          {images['pole_master_kit'] && (
            <img className="pmk__img" src={images['pole_master_kit']} alt="" />
          )}
          <span className="pmk__name">
            <b>{t18('POLE MASTER KIT')}</b>
            <em>{t18('direk üstü toplayıcı')}</em>
          </span>
        </div>

        {/* uc olcum seti — kartsiz */}
        {CLUSTERS.map((c, i) => (
          <div className={'lcset lcset--' + c.pos} key={c.id} style={{ ...ppct(c.x, c.y), '--i': i }}>
            <span className="lcset__row">
              {PHASES.map((ph, k) => (
                <span className="lc" key={ph} style={{ '--k': k }}>
                  {images['SMART_LC'] && <img className="lc__img" src={images['SMART_LC']} alt="" />}
                  <em>{ph}</em>
                </span>
              ))}
            </span>
            <span className="lcset__tx">
              <b>{c.name}</b>
            </span>
          </div>
        ))}
      </div>

      <div className="pmk__stats">
        <span><b>1</b><em>{t18('TOPLAYICI')}</em></span>
        <span className="pmk__x">×</span>
        <span><b>3</b><em>{t18('ÖLÇÜM SETİ')}</em></span>
        <span className="pmk__x">=</span>
        <span className="is-hi"><b>9</b><em>{t18('CİHAZ')}</em></span>
      </div>
    </div>
  )
}

/* ==================================================================
   2) DİL DESTEĞİ
   ================================================================== */

const LANGS = [
  { code: 'TR', name: 'Türkçe', flag: 'tr', on: true, note: 'VARSAYILAN' },
  { code: 'EN', name: 'English', flag: 'gb', on: true },
  { code: 'DE', name: 'Deutsch', flag: 'de' },
  { code: 'FR', name: 'Français', flag: 'fr' },
  { code: 'ES', name: 'Español', flag: 'es' },
  { code: 'IT', name: 'Italiano', flag: 'it' },
  { code: 'RU', name: 'Русский', flag: 'ru' },
  { code: 'AZ', name: 'Azərbaycan', flag: 'az' },
  { code: 'AR', name: 'العربية', flag: 'sa' },
]

const LANG_FACTS = [
  { Icon: UserCog, t: 'KULLANICI BAZINDA', d: 'Her kullanıcı kendi arayüz dilini seçer' },
  { Icon: FileText, t: 'RAPOR DİLİ', d: 'Çıktılar da seçilen dilde üretilir' },
  { Icon: Languages, t: 'GENİŞLETİLEBİLİR', d: 'Yeni dil eklemek çeviri dosyası eklemektir' },
]

/* --- bayrak: once PICTURE/FLAGS icindeki dosya, yoksa flag-icons --- */
function Flag({ id, images = {} }) {
  const src = images['FLAGS/' + id] || images['FLAGS/' + id.toUpperCase()] || FLAG_SRC[id]
  if (!src) return null
  return <img className="flag flag--real" src={src} alt="" />
}

export function LanguagePanel({ images = {} }) {
  return (
    <div className="lang">
      <div className="lang__grid">
        {deepT(LANGS).map((l, i) => (
          <div className={'lcard' + (l.on ? ' is-on' : '')} key={l.code} style={{ '--i': i }}>
            <span className="lcard__flag"><Flag id={l.flag} images={images} /></span>
            <span className="lcard__tx">
              <b>{l.name}</b>
            </span>
            <span className="lcard__st">
              {l.on
                ? <i className="is-ready"><Check size={12} strokeWidth={3} />{l.note || t18('HAZIR')}</i>
                : <i>{t18('TALEP ÜZERİNE')}</i>}
            </span>
          </div>
        ))}
      </div>

      <div className="lang__facts">
        {deepT(LANG_FACTS).map(({ Icon, t, d }) => (
          <span className="lfact" key={t}>
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
   3) MOBIL UYGULAMA — telefon mockup, ekranlar tiklanarak degisir
   ================================================================== */

export function MobileApp({ images = {}, shots = [] }) {
  const list = deepT(shots).filter((s) => images[s.image])
  const n = list.length
  const [i, setI] = useState(0)
  const [seed, setSeed] = useState(0)
  const navRef = useRef(null)

  /* ekranlar kendiliginden ilerler; butona basilinca sayac sifirlanir */
  useEffect(() => {
    if (n < 2) return
    const t = setTimeout(() => setI((v) => (v + 1) % n), 4200)
    return () => clearTimeout(t)
  }, [i, seed, n])

  /* liste aktif ekrani ortalayacak sekilde kendi kendine kayar */
  useEffect(() => {
    const el = navRef.current
    if (!el) return
    const btn = el.children[i]
    if (!btn) return
    const top = btn.offsetTop - el.clientHeight / 2 + btn.offsetHeight / 2
    el.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }, [i])

  if (!n) return null

  return (
    <div className="mob">
      <div className="mob__phone">
        <span className="mob__glow" />
        <div className="mob__frame">
          <span className="mob__notch" />
          <div className="mob__screen">
            {list.map((s, k) => (
              <img key={s.image} src={images[s.image]} alt="" className={k === i ? 'is-on' : ''} />
            ))}
          </div>
          <span className="mob__home" />
        </div>
      </div>

      <div className="mob__nav" ref={navRef}>
        {list.map((s, k) => (
          <button
            key={s.image}
            type="button"
            className={'mbtn' + (k === i ? ' is-on' : '')}
            onClick={() => { setI(k); setSeed((v) => v + 1) }}
          >
            <span>{s.label}</span>
            {k === i && <i key={seed + '-' + k} className="mbtn__fill" />}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ==================================================================
   4) RAPOR DESTESI — kartlar ust uste, tiklanan one cikar
   ================================================================== */

const CSV_ROWS = [
  ['25.08.2026 10:11', 'SN-00001', 'KALICI', '1.240 m'],
  ['25.08.2026 09:47', 'SN-00014', 'GEÇİCİ', '—'],
  ['24.08.2026 22:03', 'SN-00008', 'KALICI', '820 m'],
  ['24.08.2026 18:35', 'SN-00021', 'GEÇİCİ', '—'],
  ['24.08.2026 11:12', 'SN-00003', 'KALICI', '2.150 m'],
]

function CsvSheet() {
  return (
    <span className="csv">
      <span className="csv__bar">
        <i /><i /><i />
        <b>arizalar_2026-08.csv</b>
      </span>
      <span className="csv__head">
        <i>{t18('TARİH')}</i><i>{t18('CİHAZ')}</i><i>{t18('TİP')}</i><i>MESAFE</i>
      </span>
      {CSV_ROWS.map((r, k) => (
        <span className="csv__row" key={k}>
          {r.map((c, j) => <i key={j} className={j === 2 ? (c === 'KALICI' ? 'is-bad' : 'is-warn') : ''}>{c}</i>)}
        </span>
      ))}
      <span className="csv__foot">{t18('Excel · CSV · PDF olarak dışa aktarılır')}</span>
    </span>
  )
}

export function ReportDeck({ images = {}, docs = [] }) {
  const [i, setI] = useState(0)
  const n = docs.length
  if (!n) return null

  return (
    <div className="deck">
      <div className="deck__stack">
        {docs.map((d, k) => {
          const off = (k - i + n) % n
          return (
            <button
              key={d.label}
              type="button"
              className={'rcard' + (off === 0 ? ' is-front' : '')}
              style={{ '--off': off, '--ar': d.ar || '79 / 89', zIndex: n - off }}
              onClick={() => setI(k)}
              aria-label={d.label}
            >
              <span className="rcard__page">
                {d.kind === 'csv'
                  ? <CsvSheet />
                  : images[d.image] && <img src={images[d.image]} alt="" />}
              </span>
              <span className="rcard__tag">
                <i>{d.type}</i>{d.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="deck__tabs">
        {docs.map((d, k) => (
          <button
            key={d.label}
            type="button"
            className={'dtab' + (k === i ? ' is-on' : '')}
            onClick={() => setI(k)}
          >
            <i>{d.type}</i>
            <span>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ==================================================================
   5) UYGULAMA MAGAZASI ROZETLERI
   ================================================================== */

export function StoreBadges() {
  return (
    <div className="stores">
      <span className="store">
        <svg className="store__ic" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#00D7FE" d="M3.6 2.2c-.3.3-.5.8-.5 1.4v16.8c0 .6.2 1.1.5 1.4l.1.1L13 12.1v-.2L3.7 2.2h-.1z" />
          <path fill="#FFBC00" d="M16.1 15.2 13 12.1v-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2l-3.7 2.1-.1-.1z" />
          <path fill="#FF3A44" d="m16.2 15.1-3.2-3.1-9.4 9.4c.4.4 1 .4 1.7.1l10.9-6.2" />
          <path fill="#00F076" d="M16.2 8.9 5.3 2.7c-.7-.4-1.3-.3-1.7.1l9.4 9.3 3.2-3.2z" />
        </svg>
        <span className="store__tx">
          <em>{t18('İNDİR')}</em>
          <b>Google Play</b>
        </span>
      </span>

      <span className="store">
        <svg className="store__ic store__ic--apple" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.9-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13M14.6 4.9c.71-.87 1.19-2.07 1.06-3.27-1.02.04-2.26.68-3 1.55-.66.77-1.24 2-1.08 3.17 1.14.09 2.3-.58 3.02-1.45" />
        </svg>
        <span className="store__tx">
          <em>{t18('İNDİR')}</em>
          <b>App Store</b>
        </span>
      </span>
    </div>
  )
}

/* ==================================================================
   6) SUNUMU YAPAN KARTI
   Alanlara tiklayip yazabilirsiniz; degisiklikler tarayicida saklanir.
   Fotograf icin karenin uzerine tiklayip dosya secin.
   ================================================================== */

const PRES_KEY = 'e1.presenter'
const PRES_PHOTO = 'e1.presenter.photo'

const PRES_DEF = {
  name: 'Ad Soyad',
  role: 'Satış ve Proje Yöneticisi',
  mail: 'ad.soyad@enerjione.com',
  phone: '+90 500 000 00 00',
}

function readStore(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function PresenterCard({ defaults = {} }) {
  const base = { ...PRES_DEF, ...defaults }
  const [d, setD] = useState(() => ({ ...base, ...readStore(PRES_KEY, {}) }))
  const [photo, setPhoto] = useState(() => {
    try { return localStorage.getItem(PRES_PHOTO) || defaults.photo || '' } catch { return defaults.photo || '' }
  })

  const save = (next) => {
    setD(next)
    try { localStorage.setItem(PRES_KEY, JSON.stringify(next)) } catch {}
  }

  const edit = (k) => (e) => {
    const v = e.currentTarget.textContent.replace(/\s+/g, ' ').trim()
    save({ ...d, [k]: v || base[k] })
    if (!v) e.currentTarget.textContent = base[k]
  }

  const pick = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      setPhoto(r.result)
      try { localStorage.setItem(PRES_PHOTO, r.result) } catch {}
    }
    r.readAsDataURL(f)
  }

  const F = (k, cls) => (
    <span
      className={cls}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={edit(k)}
      key={k + ':' + d[k]}
    >
      {t18(d[k])}
    </span>
  )

  return (
    <aside className="pres">
      <label className="pres__photo" title={t18('Fotoğraf seçmek için tıklayın')}>
        {photo
          ? <img src={photo} alt="" />
          : <span className="pres__ph"><UserRound size={30} strokeWidth={1.5} /><em>{t18('fotoğraf ekle')}</em></span>}
        <input type="file" accept="image/*" onChange={pick} hidden />
      </label>

      <div className="pres__tx">
        {F('name', 'pres__name')}
        {F('role', 'pres__role')}
      </div>

      <div className="pres__lines">
        <span className="pres__row">
          <i><Mail size={14} strokeWidth={2} /></i>
          {F('mail', 'pres__val')}
        </span>
        <span className="pres__row">
          <i><Phone size={14} strokeWidth={2} /></i>
          {F('phone', 'pres__val')}
        </span>
      </div>

    </aside>
  )
}

/* ==================================================================
   7) ANA SAYFA LOGO SERIDI — gercek logolar + gomulu simgeler
   ================================================================== */

function StripGlyph({ id }) {
  if (id === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2AABEE" />
        <path d="M18.6 7.1 16.7 17c-.13.66-.55.82-1.1.51l-3.06-2.26-1.48 1.42c-.16.16-.3.3-.62.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.9-4.59c.55-.2 1.03.13.85.98Z" fill="#fff" />
      </svg>
    )
  }
  if (id === 'sms') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="1.5" y="3.5" width="21" height="15" rx="4.5" fill="#5b8fd6" />
        <path d="M8.5 21 13 17.5H8z" fill="#5b8fd6" />
        <path d="M7 9h10M7 13h6.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'mail') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="1.5" y="4" width="21" height="16" rx="3.4" fill="#38455c" />
        <path d="M3 7.6 12 13.6 21 7.6" stroke="#dfe8f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17 9.4 11.5M21 17l-6.4-5.5" stroke="rgba(223,232,248,.55)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'play') {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path fill="#00D7FE" d="M3.6 2.2c-.3.3-.5.8-.5 1.4v16.8c0 .6.2 1.1.5 1.4l.1.1L13 12.1v-.2L3.7 2.2h-.1z" />
        <path fill="#FFBC00" d="M16.1 15.2 13 12.1v-.2l3.1-3.1.1.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2l-3.7 2.1-.1-.1z" />
        <path fill="#FF3A44" d="m16.2 15.1-3.2-3.1-9.4 9.4c.4.4 1 .4 1.7.1l10.9-6.2" />
        <path fill="#00F076" d="M16.2 8.9 5.3 2.7c-.7-.4-1.3-.3-1.7.1l9.4 9.3 3.2-3.2z" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path fill="#111" d="M17.05 12.54c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.9-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.28-1.27 3.13-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.75-4.13M14.6 4.9c.71-.87 1.19-2.07 1.06-3.27-1.02.04-2.26.68-3 1.55-.66.77-1.24 2-1.08 3.17 1.14.09 2.3-.58 3.02-1.45" />
    </svg>
  )
}

export function HeroStrip({ items = [], images = {} }) {
  return (
    <div className="hstrip">
      {items.map((it, k) => (
        <span className="hstrip__i" key={it.k || it.g || k} title={it.t || ''}>
          {it.k
            ? (images[it.k] ? <img src={images[it.k]} alt="" /> : null)
            : <StripGlyph id={it.g} />}
        </span>
      ))}
    </div>
  )
}
