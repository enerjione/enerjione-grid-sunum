import { deepT, t as t18 } from './i18n'
/* Görsel üzerine binen animasyonlu HUD katmanları */

/* ------------------------------------------------------------------
   1) ÖLÇÜ / ARIZA BÖLGESİ
   Konumlar App.jsx içinde her karede güncellenir; kamera hareket
   ettiğinde HUD görselin üzerinde sabit kalır.
   - wires   : cihazlar arasındaki arızalı hat parçaları (yanıp söner)
   - callout : etiketler gökyüzünde durur, cihaza ince çizgiyle bağlanır
------------------------------------------------------------------- */
export function Measure({ cfg }) {
  const dim = cfg.showDim !== false
  const wires = cfg.wires || []

  return (
    <>
      {wires.length > 0 && (
        <svg className="wirefx" aria-hidden="true">
          {wires.map((_, i) => (
            <path className="wirepath" key={'w' + i} style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </svg>
      )}

      <span className="mk mk--a" data-state={cfg.a.state}>
        <span className="mk__ring" />
        <span className="mk__ring mk__ring--2" />
        <span className="mk__dot" />
      </span>
      <span className="mk mk--b" data-state={cfg.b.state}>
        <span className="mk__ring" />
        <span className="mk__ring mk__ring--2" />
        <span className="mk__dot" />
      </span>

      <span className="lead lead--a" data-state={cfg.a.state} />
      <span className="lead lead--b" data-state={cfg.b.state} />

      <div className="callout callout--a" data-state={cfg.a.state}>
        <div className="callout__name">{cfg.a.name}</div>
        <div className="callout__tag">{cfg.a.tag}</div>
        {cfg.a.sub && <div className="callout__sub">{cfg.a.sub}</div>}
      </div>
      <div className="callout callout--b" data-state={cfg.b.state}>
        <div className="callout__name">{cfg.b.name}</div>
        <div className="callout__tag">{cfg.b.tag}</div>
        {cfg.b.sub && <div className="callout__sub">{cfg.b.sub}</div>}
      </div>

      {dim && (
        <>
          <span className="dim__ext dim__ext--a" />
          <span className="dim__ext dim__ext--b" />
          <span className="dim__line" />
          <span className="dim__label">
            <b>{cfg.zone}</b>
            <em>{cfg.distance}</em>
          </span>
        </>
      )}
    </>
  )
}

/* ------------------------------------------------------------------
   2) OUTBOUND HABERLEŞME — merkezden dış sistemlere
------------------------------------------------------------------- */
const CHANNELS = [
  { label: 'SCADA', y: 40 },
  { label: 'IEC 104', y: 116 },
  { label: 'MODBUS TCP', y: 192 },
  { label: 'MQTT', y: 268 },
  { label: 'REST / WEBHOOK', y: 344 },
  { label: 'SMS · E-POSTA', y: 420 },
]

export function Outbound() {
  const hub = { x: 46, y: 230 }
  return (
    <svg className="ovsvg ovsvg--outbound" viewBox="0 0 440 470" fill="none">
      <defs>
        <linearGradient id="obg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff7a2f" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffb066" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {deepT(CHANNELS).map((c, i) => {
        const d = `M ${hub.x + 16} ${hub.y} C 130 ${hub.y}, 150 ${c.y + 17}, 214 ${c.y + 17}`
        return (
          <g key={c.label}>
            <path d={d} stroke="rgba(255,255,255,.16)" strokeWidth="1.4" />
            <path
              className="flow"
              d={d}
              stroke="url(#obg)"
              strokeWidth="2.2"
              strokeDasharray="4 38"
              style={{ animationDelay: `${i * 0.28}s` }}
            />
            <rect x="214" y={c.y} width="212" height="34" rx="17"
              fill="rgba(10,16,28,.66)" stroke="rgba(255,255,255,.16)" strokeWidth="1" />
            <text x="234" y={c.y + 22} className="ovtext ovtext--sm">{c.label}</text>
          </g>
        )
      })}

      <circle cx={hub.x} cy={hub.y} r="30" fill="rgba(255,122,47,.12)" />
      <circle className="hubring" cx={hub.x} cy={hub.y} r="30" stroke="rgba(255,122,47,.5)" strokeWidth="1.4" />
      <circle cx={hub.x} cy={hub.y} r="15" fill="#ff7a2f" />
      <text x={hub.x} y={hub.y + 56} className="ovtext ovtext--sm" textAnchor="middle">GRID</text>
    </svg>
  )
}
