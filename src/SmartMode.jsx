import { deepT, t as t18 } from './i18n'
import { Moon, Zap, Send, BatteryCharging, Sun } from 'lucide-react'

/* ==================================================================
   HORSTMANN AKILLI MOD + ENERJİ YÖNETİMİ

   Üst: uyku / uyanma döngüsü. Tarama çizgisi soldan sağa süzülür,
        üzerinden geçtiği olay parlar.
   Orta: durum şeridi (semboller ile)
   Alt : iki ürünün besleme şekli — hattan şarj ve güneş paneli
   ================================================================== */

const CYCLE = 11
const VB = { w: 1000, h: 344 }
const BASE = 268
const TOP_SMALL = 146
const TOP_FAULT = 50

const EVENTS = [
  { x: 178, kind: 'wake',  label: 'PERİYODİK RAPOR' },
  { x: 386, kind: 'wake',  label: 'PERİYODİK RAPOR' },
  { x: 610, kind: 'fault', label: 'ARIZA ANI' },
  { x: 838, kind: 'wake',  label: 'PERİYODİK RAPOR' },
]

const STATES = [
  { Icon: Moon, t: 'UYKU', d: 'modem kapalı' },
  { Icon: Zap, t: 'UYANMA', d: 'arıza / periyot' },
  { Icon: Send, t: 'GÖNDERİM', d: 'şifreli iletim' },
  { Icon: Moon, t: 'UYKU', d: 'geri döner' },
]

const timeAt = (x) => (x / VB.w) * CYCLE

export default function SmartMode({ images = {} }) {
  return (
    <div className="smart">
      {/* ---------- döngü grafiği ---------- */}
      <svg className="smart__svg" viewBox={`0 0 ${VB.w} ${VB.h}`} fill="none">
        <defs>
          <linearGradient id="smFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff8a1f" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff8a1f" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="smFadeRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4b4b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="smSweep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9fd0ff" stopOpacity="0" />
            <stop offset="35%" stopColor="#9fd0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#9fd0ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" y1={76 + i * 62} x2={VB.w} y2={76 + i * 62}
            stroke="rgba(255,255,255,.04)" strokeWidth="1" />
        ))}

        <line x1="0" y1={BASE} x2={VB.w} y2={BASE} stroke="rgba(255,255,255,.2)" strokeWidth="1.5" strokeDasharray="2 7" />
        <text x="4" y={BASE + 21} className="smtx smtx--dim">{t18('UYKU · MODEM KAPALI')}</text>

        {deepT(EVENTS).map((e, i) => {
          const top = e.kind === 'fault' ? TOP_FAULT : TOP_SMALL
          const w = e.kind === 'fault' ? 26 : 17
          const color = e.kind === 'fault' ? '#ff4b4b' : '#ffa444'
          return (
            <g key={i} className="smev"
              style={{ animationDelay: `${timeAt(e.x) - CYCLE}s`, animationDuration: `${CYCLE}s` }}>
              <rect x={e.x - w / 2} y={top} width={w} height={BASE - top} rx={w / 2}
                fill={e.kind === 'fault' ? 'url(#smFadeRed)' : 'url(#smFade)'} />
              <path
                d={`M ${e.x - w / 2} ${BASE} L ${e.x - w / 2} ${top + 8} Q ${e.x} ${top - 10} ${e.x + w / 2} ${top + 8} L ${e.x + w / 2} ${BASE}`}
                stroke={color} strokeWidth="2.4" strokeLinejoin="round" fill="none" />
              <circle cx={e.x} cy={top - 4} r={e.kind === 'fault' ? 6 : 4.5} fill={color} />
              <text x={e.x} y={top - 20} className={'smtx' + (e.kind === 'fault' ? ' smtx--red' : '')} textAnchor="middle">
                {e.label}
              </text>
            </g>
          )
        })}

        <g className="smsweep" style={{ animationDuration: `${CYCLE}s` }}>
          <rect x="-1.5" y="16" width="3" height={BASE - 4} fill="url(#smSweep)" />
          <circle cx="0" cy={BASE} r="5" fill="#9fd0ff" />
          <circle className="smsweep__halo" cx="0" cy={BASE} r="11" fill="none" stroke="#9fd0ff" strokeWidth="1.2" />
        </g>
      </svg>

      {/* ---------- durum şeridi ---------- */}
      <div className="smart__states">
        {deepT(STATES).map(({ Icon, t, d }, i) => (
          <span key={i} className="smst"
            style={{ animationDelay: `${(i * CYCLE) / 4 - CYCLE}s`, animationDuration: `${CYCLE}s` }}>
            <i className="smst__ic"><Icon size={17} strokeWidth={1.9} /></i>
            <span className="smst__tx">
              <b>{t}</b>
              <em>{d}</em>
            </span>
          </span>
        ))}
      </div>

      {/* ---------- enerji / besleme ---------- */}
      <div className="smart__power">
        <div className="pwr">
          <span className="pwr__shot">
            {images['sn20'] && <img src={images['sn20']} alt="" />}
          </span>
          <span className="pwr__tx">
            <b>Smart Navigator 2.0</b>
            <em>{t18('Hattan kendini şarj eder')}</em>
            <span className="pwr__tag"><BatteryCharging size={14} strokeWidth={2} />{t18('5 A üzeri hatta harici besleme gerekmez')}</span>
          </span>
          <Battery />
        </div>

        <div className="pwr">
          <span className="pwr__shot">
            {images['pole_master_kit'] && <img src={images['pole_master_kit']} alt="" />}
          </span>
          <span className="pwr__tx">
            <b>Pole Master Kit</b>
            <em>{t18('Güneş paneli ile beslenir')}</em>
            <span className="pwr__tag pwr__tag--sun"><Sun size={14} strokeWidth={2} />{t18('Şebeke bağlantısı gerektirmez')}</span>
          </span>
          <Solar />
        </div>
      </div>
    </div>
  )
}

/* --- şarj olan batarya sembolü --- */
function Battery() {
  return (
    <svg className="bat" viewBox="0 0 52 26" fill="none" aria-hidden="true">
      <rect x="1.2" y="1.2" width="43" height="23.6" rx="6" stroke="rgba(255,255,255,.34)" strokeWidth="1.6" />
      <rect x="46" y="8.5" width="4.6" height="9" rx="1.8" fill="rgba(255,255,255,.34)" />
      <rect className="bat__fill" x="4.4" y="4.4" width="8" height="17.2" rx="3.4" fill="#2fe08a" />
      <path d="M25.6 5.6 19.4 14.6h4.8l-1.6 6.6 6.6-9.4h-5l1.4-6.2Z" fill="#08131f" stroke="#0b1a12" strokeWidth="0.5" />
    </svg>
  )
}

/* --- güneş paneli sembolü --- */
function Solar() {
  return (
    <svg className="bat bat--sun" viewBox="0 0 52 26" fill="none" aria-hidden="true">
      <circle className="sun__glow" cx="13" cy="13" r="6" fill="#ffb066" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a}
          x1={13 + Math.cos((a * Math.PI) / 180) * 8.4}
          y1={13 + Math.sin((a * Math.PI) / 180) * 8.4}
          x2={13 + Math.cos((a * Math.PI) / 180) * 11.4}
          y2={13 + Math.sin((a * Math.PI) / 180) * 11.4}
          stroke="rgba(255,176,102,.7)" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <g className="sun__panel">
        <rect x="27" y="5" width="23" height="16" rx="2.4" fill="rgba(89,166,255,.18)" stroke="rgba(140,190,255,.6)" strokeWidth="1.3" />
        <path d="M34.7 5v16M42.4 5v16M27 10.3h23M27 15.7h23" stroke="rgba(140,190,255,.42)" strokeWidth="1" />
      </g>
    </svg>
  )
}
