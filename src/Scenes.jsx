import { deepT, t as t18 } from './i18n'
import { useMemo } from 'react'

/* ==================================================================
   1) PARALLAX ZEMİN — ekran ve hub slaytlarının arkasında akan alan
   ================================================================== */

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const DEPTHS = [
  { n: 26, size: [1.5, 3], speed: 0.25, alpha: 0.30 },
  { n: 20, size: [2.5, 5], speed: 0.55, alpha: 0.50 },
  { n: 10, size: [4, 7], speed: 1.00, alpha: 0.75 },
]

export function ParticleField() {
  const layers = useMemo(() => {
    const rnd = mulberry32(20260825)
    return DEPTHS.map((d, li) => ({
      ...d,
      dots: Array.from({ length: d.n }, () => {
        const hue = rnd()
        return {
          x: rnd() * 100,
          y: rnd() * 100,
          s: d.size[0] + rnd() * (d.size[1] - d.size[0]),
          dur: 7 + rnd() * 12,
          delay: -rnd() * 12,
          tone: hue > 0.82 ? 'warm' : hue > 0.35 ? 'cool' : 'pale',
        }
      }),
      li,
    }))
  }, [])

  return (
    <div className="field" aria-hidden="true">
      <div className="field__grid" />
      <div className="field__glow" />
      {layers.map((l) => (
        <div className="field__depth" key={l.li} style={{ '--sp': l.speed }}>
          {l.dots.map((d, i) => (
            <i
              key={i}
              className={'pt pt--' + d.tone}
              style={{
                left: d.x + '%',
                top: d.y + '%',
                width: d.s + 'px',
                height: d.s + 'px',
                opacity: l.alpha,
                animationDuration: d.dur + 's',
                animationDelay: d.delay + 's',
              }}
            />
          ))}
        </div>
      ))}
      <svg className="field__arcs" viewBox="0 0 1000 560" fill="none" preserveAspectRatio="none">
        <path d="M-40 120 C 240 40, 760 40, 1040 140" stroke="rgba(255,255,255,.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M-40 430 C 260 520, 740 520, 1040 420" stroke="rgba(255,255,255,.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d="M-40 280 C 300 180, 700 380, 1040 260" stroke="rgba(89,166,255,.09)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

/* ==================================================================
   2) 3B MONİTÖR — uygulama ekran görüntüsü
   ================================================================== */

export function DeviceScreen({ src, portrait }) {
  if (!src) return null
  return (
    <div className={'device' + (portrait ? ' device--portrait' : '')}>
      <div className="device__glow" />
      <div className="device__frame">
        <div className="device__bar">
          <i /><i /><i />
        </div>
        <img src={src} alt="" />
        <div className="device__sheen" />
      </div>
      <div className="device__floor" />
    </div>
  )
}

/* ==================================================================
   3) ENTEGRASYON HUB'I
   Ortada EnerjiOne, iki yanda gercek marka logolariyla kanallar.
   plate: 'white' -> seffaf/beyaz zeminli logo, beyaz plaka icinde
   plate: 'bleed' -> kendi zemini olan logo, plakayi tamamen doldurur
   plate: 'glyph' -> gomulu SVG simge (logosu olmayan kanallar)
   ================================================================== */

const VB = { w: 1000, h: 560 }
const HUB = { x: 500, y: 280 }

const LEFT = [
  { id: 'iec',    logo: 'IEC104',    plate: 'bleed', name: 'IEC 60870-5-104', desc: 'SCADA telekontrol',     y: 96,  featured: true },
  { id: 'modbus', logo: 'MODBUS',    plate: 'white', name: 'Modbus TCP', desc: 'Saha veri alışverişi', y: 196 },
  { id: 'mqtt',   logo: 'MQTT',      plate: 'white', name: 'MQTT',       desc: 'Outbound publish',     y: 296 },
  { id: 'dnp3',   logo: 'DNP3',     plate: 'white', name: 'DNP3',            desc: 'Dağıtım otomasyonu protokolü', y: 396 },
  { id: 'api',    logo: 'API_LOGO',  plate: 'white', name: 'REST / Webhook',  desc: 'HTTP event çıkışı',     y: 496 },
]

const RIGHT = [
  { id: 'n8n',   logo: 'N8N',       plate: 'bleed', name: 'n8n',       desc: 'Otomasyon akışları',    y: 86 },
  { id: 'make',  logo: 'MAKE-LOGO', plate: 'bleed', name: 'Make',      desc: 'Senaryo otomasyonu',    y: 190 },
  { id: 'wa',    logo: 'WHATSAPP',  plate: 'white', name: 'WhatsApp',  desc: 'Anlık alarm bildirimi', y: 294 },
  { id: 'tg',    glyph: 'telegram', plate: 'glyph', name: 'Telegram',  desc: 'Grup ve kanal bildirimi', y: 398 },
  { id: 'mail',  glyph: 'mail',     plate: 'glyph', name: 'E-posta',   desc: 'Rapor ve alarm gönderimi', y: 502 },
]

const pct = (x, y) => ({ left: (x / VB.w) * 100 + '%', top: (y / VB.h) * 100 + '%' })

function wirePath(side, y) {
  const sx = side === 'left' ? HUB.x - 78 : HUB.x + 78
  const ex = side === 'left' ? 352 : 648
  const c = side === 'left' ? -66 : 66
  return `M ${sx} ${HUB.y} C ${sx + c} ${HUB.y}, ${ex - c} ${y}, ${ex} ${y}`
}

export function IntegrationHub({ logo, images = {} }) {
  const all = [
    ...deepT(LEFT).map((n) => ({ ...n, side: 'left', x: 196 })),
    ...deepT(RIGHT).map((n) => ({ ...n, side: 'right', x: 804 })),
  ]

  return (
    <div className="hub">
      <svg className="hub__wires" viewBox={`0 0 ${VB.w} ${VB.h}`} fill="none" preserveAspectRatio="none">
        {all.map((n, i) => {
          const d = wirePath(n.side, n.y)
          return (
            <g key={n.id}>
              <path d={d} stroke="rgba(255,255,255,.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path
                className="hub__flow"
                d={d}
                stroke={n.featured ? '#ffb066' : 'rgba(255,176,102,.6)'}
                strokeWidth={n.featured ? 2.4 : 1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={n.featured ? '16 240' : '10 240'}
                style={{
                  animationDelay: `${i * 0.75}s`,
                  animationDuration: n.featured ? '5s' : '7s',
                }}
              />
            </g>
          )
        })}
      </svg>

      <div className="hub__core" style={pct(HUB.x, HUB.y)}>
        <span className="hub__pulse" />
        <span className="hub__pulse hub__pulse--2" />
        <div className="hub__tile">{logo && <img src={logo} alt="EnerjiOne" />}</div>
        <div className="hub__flowline">
          <span>{t18('ARIZA OLAYI')}</span><em /><span>{t18('KURAL MOTORU')}</span><em /><span className="is-out">{t18('ÇOKLU ÇIKIŞ')}</span>
        </div>
      </div>

      <div className="hub__group hub__group--l">{t18('SCADA VE SAHA PROTOKOLLERİ')}</div>
      <div className="hub__group hub__group--r">{t18('OTOMASYON VE BİLDİRİM')}</div>

      {all.map((n) => (
        <div
          key={n.id}
          className={'chan chan--' + n.side + (n.featured ? ' chan--featured' : '')}
          style={{ ...pct(n.x, n.y), '--f': (n.y % 7) * 0.4 }}
        >
          {n.featured && <span className="chan__badge">{t18('ÖNE ÇIKAN')}</span>}
          <span className={'chan__logo chan__logo--' + n.plate + (n.wide ? ' chan__logo--wide' : '')}>
            {n.plate === 'glyph'
              ? <ChanGlyph id={n.glyph} />
              : images[n.logo] && <img src={images[n.logo]} alt="" />}
          </span>
          <span className="chan__text">
            <b>{n.name}</b>
            <em>{n.desc}</em>
          </span>
          <i className="chan__led" />
        </div>
      ))}
    </div>
  )
}

function ChanGlyph({ id }) {
  if (id === 'telegram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="glyph glyph--telegram">
        <circle cx="12" cy="12" r="12" fill="#2AABEE" />
        <path d="M18.6 7.1 16.7 17c-.13.66-.55.82-1.1.51l-3.06-2.26-1.48 1.42c-.16.16-.3.3-.62.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.9-4.59c.55-.2 1.03.13.85.98Z" fill="#fff" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className="glyph glyph--mail">
      <rect x="1.5" y="4" width="21" height="16" rx="3" fill="#2f3b52" />
      <path d="M3 7.4 12 13.4 21 7.4" stroke="#dfe8f8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17 9.3 11.6M21 17l-6.3-5.4" stroke="rgba(223,232,248,.55)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
