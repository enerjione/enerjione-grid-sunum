import { deepT, t as t18 } from './i18n'
import { useState, useRef, useLayoutEffect } from 'react'
import { Check, Webhook } from 'lucide-react'

/* ==================================================================
   ARIZA VE ALARM BİLDİRİMLERİ
   Soldaki kanal listesinden seçilen kanalın örnek bildirimi gösterilir.
   Mockup'lar HTML ile üretilir; her ölçekte net kalır.
   ================================================================== */

export const CHANNELS = [
  { id: 'whatsapp', name: 'WhatsApp', desc: 'Ekip grubuna anlık mesaj olarak düşer' },
  { id: 'telegram', name: 'Telegram', desc: 'Kanal ve gruplara bot üzerinden iletilir' },
  { id: 'sms', name: 'SMS', desc: 'İnternet çekmeyen sahada da ulaşır' },
  { id: 'mail', name: 'E-posta', desc: 'Ölçüm tablosu ve harita ile detaylı alarm' },
  { id: 'push', name: 'Mobil Bildirim', desc: 'EnerjiOne mobil uygulamasına anlık push' },
  { id: 'webhook', name: 'Webhook · n8n', desc: 'Olay verisi n8n, Make veya kendi sisteminize gönderilir' },
]

/* bildirimin sahaya ulasana kadar izledigi yol */
const NSTEPS = [
  { t: 'ARIZA ALGILANIR', d: 'Cihaz olayı anında merkeze iletir' },
  { t: 'KURAL MOTORU EŞLEŞTİRİR', d: 'Bölge, hat ve önceliğe göre sorumluyu bulur' },
  { t: 'YALNIZCA İLGİLİ EKİBE GİDER', d: 'Alarm herkese değil, o hattın ekibine düşer', hot: true },
  { t: 'SEÇİLEN KANALDAN ULAŞIR', d: 'WhatsApp, Telegram, SMS, e-posta, mobil, webhook' },
]

/* --- kanal simgeleri: gercek logo varsa o, yoksa gomulu cizim --- */
function ChanMark({ id, images = {} }) {
  if (id === 'whatsapp' && images['WHATSAPP']) {
    return <img className="nmark" src={images['WHATSAPP']} alt="" />
  }
  if (id === 'telegram') {
    return (
      <svg className="nmark" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2AABEE" />
        <path d="M18.6 7.1 16.7 17c-.13.66-.55.82-1.1.51l-3.06-2.26-1.48 1.42c-.16.16-.3.3-.62.3l.22-3.13 5.7-5.15c.25-.22-.05-.34-.38-.12l-7.05 4.44-3.04-.95c-.66-.21-.67-.66.14-.98l11.9-4.59c.55-.2 1.03.13.85.98Z" fill="#fff" />
      </svg>
    )
  }
  if (id === 'mail') {
    return (
      <svg className="nmark" viewBox="0 0 24 24" fill="none">
        <rect x="1.5" y="4" width="21" height="16" rx="3" fill="#38455c" />
        <path d="M3 7.4 12 13.4 21 7.4" stroke="#dfe8f8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17 9.3 11.6M21 17l-6.3-5.4" stroke="rgba(223,232,248,.55)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'push') {
    return (
      <svg className="nmark" viewBox="0 0 24 24" fill="none">
        <rect x="5.5" y="1.5" width="13" height="21" rx="3.4" fill="#2a3346" stroke="#7f8ea8" strokeWidth="1.1" />
        <rect x="7.4" y="5.6" width="9.2" height="5.4" rx="1.6" fill="#ff8a1f" />
        <path d="M9 16h6" stroke="rgba(255,255,255,.35)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  if (id === 'webhook') {
    return (
      <svg className="nmark" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#1a1a24" />
        <circle cx="7.6" cy="9.4" r="2.5" stroke="#EA4B71" strokeWidth="1.5" />
        <circle cx="16.4" cy="8" r="2.3" stroke="#EA4B71" strokeWidth="1.5" />
        <circle cx="15" cy="16.4" r="2.5" stroke="#EA4B71" strokeWidth="1.5" />
        <path d="M9.9 10.2 12.9 15M10 8.7l4.2-.6M13.4 13.6l1.4 1" stroke="#EA4B71" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="nmark" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="14" rx="4" fill="#5b8fd6" />
      <path d="M8 20.5 12 17h-4z" fill="#5b8fd6" />
      <path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/* örnek arıza kaydı — gerçek bildirim biçimiyle aynı */
const F = {
  line: 'ANKARA / BR-4',
  span: 'Direk #1 – Direk #2',
  between: 'DEMO-3 – hat ucu',
  dist: '848 m – 1,12 km (hat başından), 272 m’lik kesim',
  link: 'maps.google.com/?q=37.8106516,41.5668506',
  time: '12.08.2026 10:44',
}

/* bildirimlerin içindeki küçük hat haritası */
function MiniMap({ flat }) {
  return (
    <svg className={'nmap' + (flat ? ' nmap--flat' : '')} viewBox="0 0 300 150" fill="none">
      <rect width="300" height="150" fill="#eef1e9" />
      <path d="M0 96 C 40 104, 78 118, 120 120 C 168 122, 196 92, 232 62 C 258 40, 280 30, 300 26"
        stroke="#dfe4d8" strokeWidth="14" strokeLinecap="round" />
      <path d="M14 22 C 42 30, 60 44, 58 66 C 56 88, 30 96, 4 92 Z" fill="#cfe0ee" />
      <path d="M182 128 C 208 132, 236 140, 258 150 L 150 150 Z" fill="#cfe0ee" />
      <path d="M92 116 L 150 112 L 196 96 L 224 66" stroke="#1f9d4d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M224 66 L 248 44" stroke="#e02424" strokeWidth="5" strokeLinecap="round" />
      {[[92, 116], [150, 112], [196, 96], [224, 66]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#1f9d4d" strokeWidth="2" />
      ))}
      <circle cx="248" cy="44" r="4.5" fill="#e02424" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

function Rows() {
  return (
    <>
      <span className="nrow"><b>{t18('Bölge')} / {t18('Hat')}:</b> {t18(F.line)}</span>
      <span className="nrow"><b>{t18('Arıza aralığı')}:</b> {t18(F.span)}</span>
      <span className="nrow"><b>{t18('Cihazlar arası')}:</b> {t18(F.between)}</span>
      <span className="nrow"><b>{t18('Tahmini mesafe')}:</b> {t18(F.dist)}</span>
    </>
  )
}

const MSG = [
  ['Bölge', 'Ankara'],
  ['Hat', 'BR-4'],
  ['Arıza aralığı', 'Direk #1 – Direk #2'],
  ['Cihazlar arası', 'DEMO-3 – hat ucu'],
  ['Tahmini mesafe', '848 m – 1,12 km (hat başından)'],
  ['Kesim uzunluğu', '272 m'],
]

function Ava({ logo, className = '' }) {
  return (
    <span className={'chat__ava ' + className}>
      {logo ? <img src={logo} alt="" /> : 'E1'}
    </span>
  )
}

function Chat({ kind, logo }) {
  const tg = kind === 'telegram'
  return (
    <div className={'chat chat--' + kind}>
      <div className="chat__head">
        <Ava logo={logo} />
        <span className="chat__who">
          <b>{t18(tg ? 'EnerjiOne Grid' : 'Arıza Ekibi')}</b>
          <em>{t18(tg ? 'kanal · bot' : 'EnerjiOne Grid, Murat, Selim, +5')}</em>
        </span>
      </div>

      <div className="chat__body">
        <span className="chat__day">{t18('BUGÜN')}</span>

        <div className="bubble bubble--in">
          {!tg && <span className="bubble__from">EnerjiOne Grid</span>}
          <MiniMap />
          <span className="bubble__title"><i />{t18('HAT ARIZASI')}</span>
          {deepT(MSG).map(([k, v]) => (
            <span className="msg__l" key={k}><b>{k}:</b> {v}</span>
          ))}
          <span className="msg__l msg__l--link"><b>{t18('Konum')}:</b> <a>{t18(F.link)}</a></span>
          <span className="msg__l msg__l--dim">{F.time}</span>
          <span className="bubble__meta">10:44</span>
        </div>

        {tg ? (
          <span className="chat__views">{t18('EnerjiOne Grid · 1,2B görüntülenme · 10:44')}</span>
        ) : (
          <div className="bubble bubble--out">
            <span className="msg__l">{t18('Ekip yola çıktı, 20 dk içinde bölgedeyiz.')}</span>
            <span className="bubble__meta">
              10:46
              <Check size={12} strokeWidth={3} />
              <Check size={12} strokeWidth={3} className="tick2" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function Sms({ logo }) {
  return (
    <div className="chat chat--sms">
      <div className="chat__head">
        <Ava logo={logo} />
        <span className="chat__who">
          <b>ENERJIONE</b>
          <em>{t18('kısa mesaj')}</em>
        </span>
      </div>
      <div className="chat__body">
        <div className="bubble bubble--sms">
          <span className="bubble__title"><i />{t18('HAT ARIZASI')}</span>
          <span className="nrow">{t18(F.line)}</span>
          <span className="nrow">{t18('Arıza aralığı')}: {t18(F.span)}</span>
          <span className="nrow">{t18('Kesim uzunluğu')}: 272 m</span>
          <span className="nrow nrow--link"><a>{t18(F.link)}</a></span>
          <span className="nrow">{F.time}</span>
          <span className="bubble__meta">{F.time.split(' ')[1]}</span>
        </div>
      </div>
    </div>
  )
}

function MailCard() {
  return (
    <div className="mailc">
      <div className="mailc__bar">
        <span className="mailc__subj">{t18('[Kritik] Haberleşme arızası — SN-00014')}</span>
      </div>
      <div className="mailc__body">
        <div className="mailc__alert">{t18('⚠ Yeni Alarm — Kritik')}</div>
        <div className="mailc__inner">
          <b className="mailc__t">{t18('Haberleşme arızası')}</b>
          <em className="mailc__s">{t18('Cihaz haberleşmesinde sorun var.')}</em>
          <table className="mailc__tab">
            <tbody>
              <tr><td>{t18('CİHAZ')}</td><td>SN-00014</td></tr>
              <tr><td>{t18('HAT')}</td><td>{t18('ANA HAT')}</td></tr>
              <tr><td>{t18('BÖLGE')}</td><td>ANKARA</td></tr>
              <tr><td>{t18('ZAMAN')}</td><td>10.08.2026 13:19:06</td></tr>
            </tbody>
          </table>
          <span className="mailc__note">
            Bu e-posta, alarm kuralının “E-posta gönder” seçeneği açık olduğu için gönderildi.
          </span>
        </div>
        <div className="mailc__map"><MiniMap flat /></div>
      </div>
    </div>
  )
}

/* --- mobil push bildirimi: kilit ekrani --- */
function PushCard({ logo }) {
  return (
    <div className="pushc">
      <div className="pushc__phone">
        <span className="pushc__wall" />
        <div className="pushc__status">
          <b>10:44</b>
          <span className="pushc__sys">
            <svg viewBox="0 0 20 12" className="pushc__sig"><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="4.5" y="5" width="3" height="7" rx="1" /><rect x="9" y="2.5" width="3" height="9.5" rx="1" /><rect x="13.5" y="0" width="3" height="12" rx="1" opacity=".35" /></svg>
            <svg viewBox="0 0 16 12" className="pushc__wifi"><path d="M8 10.6 5.6 8a3.4 3.4 0 0 1 4.8 0L8 10.6Z" /><path d="M3.4 5.9a6.6 6.6 0 0 1 9.2 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M1.2 3.6a9.8 9.8 0 0 1 13.6 0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <svg viewBox="0 0 26 12" className="pushc__bat"><rect x="0.6" y="0.6" width="21" height="10.8" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".55" /><rect x="2.4" y="2.4" width="15" height="7.2" rx="1.8" /><path d="M23.4 4.2v3.6a2.2 2.2 0 0 0 0-3.6Z" opacity=".55" /></svg>
          </span>
        </div>

        <div className="pushc__clock">
          <span className="pushc__day">{t18('Çarşamba, 12 Ağustos')}</span>
          <span className="pushc__time">10:44</span>
        </div>

        <div className="pushc__stack">
          <div className="pushc__ghost pushc__ghost--b" />
          <div className="pushc__ghost pushc__ghost--a" />
          <div className="pushc__note">
            <span className="pushc__app">
              <i>{logo ? <img src={logo} alt="" /> : 'E1'}</i>
              EnerjiOne Grid
              <em>{t18('şimdi')}</em>
            </span>
            <b>
              <span className="pushc__dot" />
              HAT ARIZASI · BR-4
            </b>
            <p>{t18('Ankara · Direk #1 – Direk #2 arası kalıcı arıza.')}</p>
            <span className="pushc__meta">
              <span>272 m</span>
              <span>{t18('Faz A–B')}</span>
              <span>{t18('Konum ekli')}</span>
            </span>
          </div>
        </div>

        <div className="pushc__acts">
          <span className="pushc__act pushc__act--go">{t18('Haritada Aç')}</span>
          <span className="pushc__act">{t18('Ekibe Ata')}</span>
        </div>

        <span className="pushc__bar" />
      </div>
    </div>
  )
}

/* --- n8n akisi: gercek ekran goruntusu, webhook one cikar --- */
function HookCard({ images = {} }) {
  const shot = images['n8n'] || images['n8n.png']
  return (
    <div className="n8n">
      <div className="n8n__bar">
        <span className="n8n__logo">
          {images['N8N'] ? <img src={images['N8N']} alt="" /> : <Webhook size={15} strokeWidth={2} />}
        </span>
        <b>{t18('n8n · Arıza Otomasyonu')}</b>
        <em>{t18('Aktif')}</em>
      </div>

      <div className="n8n__canvas">
        {shot && <img className="n8n__shot" src={shot} alt="n8n akışı" />}
        <span className="n8n__ring" />
        <span className="n8n__tag">
          EnerjiOne Grid
          <i>POST</i>
        </span>
      </div>

      <div className="n8n__foot">
        <span className="n8n__pill">{t18('olay JSON')}</span>
        <span className="n8n__pill">{t18('konum')}</span>
        <span className="n8n__pill">{t18('ölçüm')}</span>
        <span className="n8n__ok">{t18('webhook tetiklendi')}</span>
      </div>
    </div>
  )
}

/* --- ornegi kutuya sigacak en buyuk olcekte gosterir --- */
function Fit({ children }) {
  const box = useRef(null)
  const inner = useRef(null)
  const [k, setK] = useState(1)

  useLayoutEffect(() => {
    const b = box.current
    const i = inner.current
    if (!b || !i) return
    const fit = () => {
      const iw = i.offsetWidth
      const ih = i.offsetHeight
      if (!iw || !ih) return
      setK(Math.min(1, b.clientWidth / iw, b.clientHeight / ih))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(b)
    ro.observe(i)
    return () => ro.disconnect()
  }, [children])

  return (
    <div className="fit" ref={box}>
      <div className="fit__in" ref={inner} style={{ transform: 'scale(' + k + ')' }}>{children}</div>
    </div>
  )
}

function Mock({ id, images, logo }) {
  if (id === 'mail') return <MailCard />
  if (id === 'sms') return <Sms logo={logo} />
  if (id === 'push') return <PushCard logo={logo} />
  if (id === 'webhook') return <HookCard images={images} />
  return <Chat kind={id} logo={logo} />
}

export function NotifyPanel({ active = 'whatsapp', images = {} }) {
  return <div className="notify"><Mock id={active} images={images} /></div>
}

export function NotifySlide({ s, Eyebrow, lines, images = {}, logo }) {
  const [ch, setCh] = useState('whatsapp')
  const CH = deepT(CHANNELS)
  const cur = CH.find((c) => c.id === ch) || CH[0]
  const left = CH.slice(0, 3)
  const right = CH.slice(3)

  const Btn = (c) => (
    <button
      key={c.id}
      type="button"
      className={'nbtn nbtn--' + c.id + (ch === c.id ? ' is-on' : '')}
      onClick={() => setCh(c.id)}
    >
      <i><ChanMark id={c.id} images={images} /></i>
      <span><b>{c.name}</b></span>
    </button>
  )

  return (
    <>
      <div className="nhead">
        <Eyebrow s={s} />
        <h2 className="headline stagger">{lines(s.headline)}</h2>
        <p className="nlede stagger">{s.body}</p>

        <ol className="nsteps stagger">
          {deepT(NSTEPS).map((n, i) => (
            <li className={'nstep' + (n.hot ? ' is-hot' : '')} key={n.t}>
              <span className="nstep__n">{i + 1}</span>
              <span className="nstep__tx">
                <b>{n.t}</b>
                <em>{n.d}</em>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="nwrap stagger">
        <div className="npick npick--l">{left.map(Btn)}</div>

        <div className="nstage">
          <div className={'notify notify--' + ch} key={ch}>
            <Fit><Mock id={ch} images={images} logo={logo} /></Fit>
          </div>
        </div>

        <div className="npick npick--r">{right.map(Btn)}</div>
      </div>

      <div className="nfoot stagger" key={'f-' + ch}>
        <b className="nfoot__ch">{cur.name}</b>
        <p className="nfoot__desc">{cur.desc}</p>
      </div>
    </>
  )
}
