import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, AlertTriangle, BatteryCharging, CircleCheck, Clock, Crosshair, Database,
  FileText, Flame, HeartPulse, History, Landmark, Layers, Map, Network, NotebookPen,
  RefreshCw, Route, ScanLine, Server, Split, Target, Timer, UserCheck, Waypoints, Wrench,
  KeyRound, ScrollText, Boxes, ServerCog, LockKeyhole, ShieldCheck, Fingerprint, HardHat, Cpu, UserCog,
  Moon, Zap, Send, Sun, Users, BellOff, MapPinned,
  TreePine, Bird, Wind, CloudLightning, Cable, TowerControl, ShieldOff, RotateCcw, ArrowRight,
  BellRing,
  ChevronRight,
} from 'lucide-react'

import { slides, images, videos, models, logoUrl, horstmannUrl, faviconUrl, brandIcons } from './slides'
import { deepT, t as t18, getLang, setLang, LANGS as UI_LANGS } from './i18n'
import flagTRsvg from 'flag-icons/flags/4x3/tr.svg'
import flagGBsvg from 'flag-icons/flags/4x3/gb.svg'

const LANG_FLAG = { tr: flagTRsvg, gb: flagGBsvg }
import { buildGroups, groupState, videoProgress, computeCam, project, clamp } from './camera'
import { Measure } from './Overlays'
import { ParticleField, DeviceScreen, IntegrationHub } from './Scenes'
import Model3D from './Model3D'
import SmartMode from './SmartMode'
import { RoleMatrix, ScaleDiagram, SecurityShield } from './Platform'
import { PoleCapacity, LanguagePanel, MobileApp, ReportDeck, StoreBadges, PresenterCard, HeroStrip } from './Extras'
import { NotifySlide } from './Notify'
import { scrollState } from './scrollStore'

const ICONS = {
  Activity, AlertTriangle, BatteryCharging, CircleCheck, Clock, Crosshair, Database,
  FileText, Flame, HeartPulse, History, Landmark, Layers, Map, Network, NotebookPen,
  RefreshCw, Route, ScanLine, Server, Split, Target, Timer, UserCheck, Waypoints, Wrench,
  KeyRound, ScrollText, Boxes, ServerCog, LockKeyhole, ShieldCheck, Fingerprint, HardHat, Cpu, UserCog,
  Moon, Zap, Send, Sun, Users, BellOff, MapPinned,
  TreePine, Bird, Wind, CloudLightning, Cable, TowerControl, ShieldOff, RotateCcw, ArrowRight,
  BellRing,
}

const LAST = slides.length - 1
const SCENE_KINDS = new Set(['screen', 'docs', 'hub', 'model', 'smart', 'photo', 'art', 'roles', 'scale', 'security', 'pmk', 'lang', 'mobile', 'notify'])
const PANELS = { roles: RoleMatrix, scale: ScaleDiagram, security: SecurityShield, lang: LanguagePanel }

export default function App() {
  const scrollerRef = useRef(null)
  const layerRefs = useRef([])
  const bgRefs = useRef([])
  const contentRefs = useRef([])
  const overlayRefs = useRef({})
  const scrimRefs = useRef({})
  const fieldRef = useRef(null)
  const barRef = useRef(null)
  const aspects = useRef({})

  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [lang, setLangState] = useState(getLang())

  /* metinler secilen dile cevrilir; yapisal alanlar aynen kalir */
  const SL = useMemo(() => deepT(slides), [lang])

  const srcs = useMemo(
    () => slides.map((s) =>
      s.video ? { url: videos[s.video] || null, video: true }
              : { url: SCENE_KINDS.has(s.kind) ? null : images[s.image] || null, video: false }
    ),
    []
  )
  const groups = useMemo(() => buildGroups(slides, srcs), [srcs])
  const groupOfSlide = useMemo(() => {
    const m = []
    groups.forEach((g, gi) => { for (let i = g.start; i <= g.end; i++) m[i] = gi })
    return m
  }, [groups])

  /* ---- görselleri önden yükle ---- */
  useEffect(() => {
    const pics = [...new Set(groups.filter((g) => g.url && !g.video).map((g) => g.url))]
    if (!pics.length) { setReady(true); return }
    let left = pics.length
    const done = () => { if (--left <= 0) setReady(true) }
    pics.forEach((u) => {
      const img = new Image()
      img.onload = () => { aspects.current[u] = img.naturalWidth / Math.max(1, img.naturalHeight); done() }
      img.onerror = done
      img.src = u
    })
    const t = setTimeout(() => setReady(true), 9000)
    return () => clearTimeout(t)
  }, [groups])

  /* ---- fare ile hafif parallax ---- */
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let tx = 0, ty = 0, cx = 0, cy = 0
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      root.style.setProperty('--mx', cx.toFixed(4))
      root.style.setProperty('--my', cy.toFixed(4))
      scrollState.mx = cx
      scrollState.my = cy
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  /* ---- her karede kamera, video zamanı, opaklık ve HUD ---- */
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    let lastIdx = -1

    const tick = () => {
      const vw = el.clientWidth || 1
      const vh = el.clientHeight || 1
      const p = clamp(el.scrollTop / vh, 0, LAST)
      scrollState.p = p
      const cams = []

      groups.forEach((g, gi) => {
        const { focus, opacity } = groupState(g, p)
        const node = bgRefs.current[gi]

        if (g.video && node) {
          if (node.videoWidth) aspects.current[g.url] = node.videoWidth / Math.max(1, node.videoHeight)
          const dur = node.duration
          if (dur > 0 && node.readyState >= 2 && !node.seeking) {
            const target = videoProgress(g, p) * (dur - 0.04)
            if (Math.abs(node.currentTime - target) > 0.033) node.currentTime = target
          }
        }

        const aspect = (g.url && aspects.current[g.url]) || 16 / 9
        const cam = computeCam(aspect, focus, vw, vh)
        cams[gi] = cam

        const lay = layerRefs.current[gi]
        if (lay) {
          lay.style.opacity = opacity
          lay.style.visibility = opacity <= 0.002 ? 'hidden' : 'visible'
        }
        if (node) {
          node.style.transform =
            `translate3d(${cam.tx.toFixed(2)}px, ${cam.ty.toFixed(2)}px, 0) scale(${cam.s.toFixed(4)})`
        }
      })

      let wLeft = 0, wRight = 0, wBottom = 0, wCenter = 0, wField = 0

      for (let i = 0; i <= LAST; i++) {
        const d = p - i
        const ad = Math.abs(d)
        const w = Math.max(0, 1 - ad)
        const s = slides[i]
        const align = s.align || 'left'

        if (align === 'topright') wRight += w
        else if (align === 'bottom') wBottom += w
        else if (align === 'center' || align === 'hub') wCenter += w
        else wLeft += w

        if (SCENE_KINDS.has(s.kind)) wField += w

        const ct = contentRefs.current[i]
        if (ct) {
          const t = Math.min(1, ad * 1.45)
          const o = Math.max(0, 1 - t * t)
          ct.style.opacity = o
          ct.style.visibility = o <= 0.002 ? 'hidden' : 'visible'
          ct.style.transform = `translate3d(0, ${(-d * 7).toFixed(2)}vh, 0)`
          ct.style.setProperty('--d', clamp(d, -1, 1).toFixed(3))
        }

        const ov = overlayRefs.current[i]
        if (ov) {
          const o = Math.max(0, 1 - Math.min(1, ad * 1.7))
          ov.style.opacity = o
          ov.style.visibility = o <= 0.002 ? 'hidden' : 'visible'
          if (o > 0.002) positionMeasure(ov, s.overlay, cams[groupOfSlide[i]])
        }
      }

      const S = scrimRefs.current
      if (S.left) S.left.style.opacity = Math.min(1, wLeft)
      if (S.right) S.right.style.opacity = Math.min(1, wRight)
      if (S.bottom) S.bottom.style.opacity = Math.min(1, wBottom)
      if (S.center) S.center.style.opacity = Math.min(1, wCenter)
      if (fieldRef.current) {
        const o = Math.min(1, wField)
        fieldRef.current.style.opacity = o
        fieldRef.current.style.visibility = o <= 0.002 ? 'hidden' : 'visible'
      }

      if (barRef.current) barRef.current.style.transform = `scaleX(${(p / LAST).toFixed(4)})`

      const idx = clamp(Math.round(p), 0, LAST)
      if (idx !== lastIdx) { lastIdx = idx; setActive(idx) }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [groups, groupOfSlide])

  const goTo = (i) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ top: clamp(i, 0, LAST) * el.clientHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const onKey = (e) => {
      // metin duzenlenirken slayt kisayollari calismasin (bosluk vs.)
      const t = e.target
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      const k = e.key
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); goTo(active + 1) }
      else if (['ArrowUp', 'ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); goTo(active - 1) }
      else if (k === 'Home') { e.preventDefault(); goTo(0) }
      else if (k === 'End') { e.preventDefault(); goTo(LAST) }
      else if (k === 'f' || k === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  return (
    <div className={'app' + (ready ? ' is-ready' : '')}>

      {/* ---------- arka plan katmanları ---------- */}
      <div className="stage" aria-hidden="true">
        {groups.map((g, gi) => (
          <div key={g.key} className="layer" ref={(n) => (layerRefs.current[gi] = n)}>
            {g.url && !g.video && <div className="layer__blur" style={{ backgroundImage: `url(${g.url})` }} />}
            {g.video ? (
              <video
                ref={(n) => (bgRefs.current[gi] = n)}
                className="bg" src={g.url || undefined}
                muted playsInline preload="auto" disablePictureInPicture
              />
            ) : (
              <div
                ref={(n) => (bgRefs.current[gi] = n)}
                className={'bg' + (g.url ? '' : ' bg--empty')}
                style={g.url ? { backgroundImage: `url(${g.url})` } : undefined}
              />
            )}
          </div>
        ))}

        <div className="fieldwrap" ref={fieldRef}><ParticleField /></div>

        <div className="scrim scrim--left"   ref={(n) => (scrimRefs.current.left = n)} />
        <div className="scrim scrim--right"  ref={(n) => (scrimRefs.current.right = n)} />
        <div className="scrim scrim--bottom" ref={(n) => (scrimRefs.current.bottom = n)} />
        <div className="scrim scrim--center" ref={(n) => (scrimRefs.current.center = n)} />
        <div className="vignette" />
        <div className="grain" />
      </div>

      {/* ---------- HUD katmanı ---------- */}
      <div className="overlays" aria-hidden="true">
        {SL.map((s, i) =>
          s.overlay ? (
            <div key={s.id} className={'ov ov--' + s.overlay.type} ref={(n) => (overlayRefs.current[i] = n)}>
              {s.overlay.type === 'measure' && <Measure cfg={s.overlay} />}
            </div>
          ) : null
        )}
      </div>

      {/* ---------- üst çubuk: sadece logo ---------- */}
      <header className={'topbar' + (slides[active]?.logo ? ' topbar--nologo' : '')}>
        <img className="logo" src={logoUrl} alt="EnerjiOne GRID" />
        <div className="topbar__right">
          <div className="topbar__count">
            {String(active + 1).padStart(2, '0')} <i />{String(slides.length).padStart(2, '0')}
          </div>
          <div className="langsw" role="group" aria-label="Language">
            {UI_LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={'langsw__b' + (lang === l.id ? ' is-on' : '')}
                title={l.title}
                aria-label={l.title}
                onClick={() => setLangState(setLang(l.id))}
              >
                <img src={LANG_FLAG[l.flag]} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="progress"><i ref={barRef} /></div>
      </header>

      {/* ---------- nokta navigasyonu ---------- */}
      <nav className="dots" aria-label="Slayt navigasyonu">
        {SL.map((s, i) =>
          s.sub ? null : (
            <button
              key={s.id}
              className={'dot' + (i === active || (slides[active]?.sub && slides[active].nav === s.nav) ? ' is-active' : '')}
              onClick={() => goTo(i)}
              aria-label={s.nav}
            >
              <span className="dot__label">{s.nav}</span>
            </button>
          )
        )}
      </nav>

      {/* ---------- slaytlar ---------- */}
      <div className="scroller" ref={scrollerRef}>
        {SL.map((s, i) => (
          <section className={'slide slide--' + (s.align || 'left')} data-id={s.id} key={s.id}>
            <div
              className={'content content--' + (s.kind || 'default') + (s.flip ? ' is-flip' : '')}
              ref={(n) => (contentRefs.current[i] = n)}
              data-active={i === active ? 'true' : 'false'}
            >
              <Slide s={s} i={i} />
            </div>
            {s.num && <div className="watermark" aria-hidden="true">{s.num}</div>}
          </section>
        ))}
      </div>

      <button className={'hint' + (active === 0 ? ' is-on' : '')} onClick={() => goTo(active + 1)}>
        <span>{t18('Kaydırın')}</span>
        <i />
      </button>

      <div className="boot">
        <img className="boot__logo" src={logoUrl} alt="" />
        <div className="boot__ring" />
      </div>
    </div>
  )
}

/* ================================================================== */

function positionMeasure(ov, cfg, cam) {
  if (!cfg || cfg.type !== 'measure' || !cam) return

  const a = project(cam, cfg.a.x, cfg.a.y)
  const b = project(cam, cfg.b.x, cfg.b.y)
  const cardY = project(cam, 0, cfg.cardY ?? 15).y

  ov.style.setProperty('--ax', a.x.toFixed(1) + 'px')
  ov.style.setProperty('--ay', a.y.toFixed(1) + 'px')
  ov.style.setProperty('--bx', b.x.toFixed(1) + 'px')
  ov.style.setProperty('--by', b.y.toFixed(1) + 'px')
  ov.style.setProperty('--cy', cardY.toFixed(1) + 'px')

  if (cfg.showDim !== false) {
    ov.style.setProperty('--dy', project(cam, 0, cfg.dimY ?? 55).y.toFixed(1) + 'px')
  }

  const wires = cfg.wires || []
  if (wires.length) {
    const nodes = ov.querySelectorAll('.wirepath')
    for (let k = 0; k < wires.length; k++) {
      const n = nodes[k]
      if (!n) continue
      const w = wires[k]
      const p1 = project(cam, w.ax, w.ay)
      const p2 = project(cam, w.bx, w.by)
      // iletkenin sarkmasini takip eden ikinci dereceden egri
      const sagPx = cam.s * cam.rect.h * ((w.sag ?? 0.3) / 100)
      const cx = (p1.x + p2.x) / 2
      const cy = (p1.y + p2.y) / 2 + sagPx * 2
      n.setAttribute('d', `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`)
    }
  }
}

/* ================================================================== */

function Slide({ s, i }) {
  const kind = s.kind || 'default'

  if (!s.headline && !s.body && !s.eyebrow && !s.products) return null

  if (kind === 'hero') {
    return (
      <>
        {s.logo && logoUrl && (
          <img className="hero__logo stagger" src={logoUrl} alt="EnerjiOne GRID" />
        )}
        <h1 className="headline headline--hero stagger">{lines(s.headline)}</h1>
        <p className="body body--lead stagger">{s.body}</p>
        {s.tiles && (
          <div className="tiles stagger">
            {s.tiles.map((t, k) => {
              const Ic = ICONS[t.icon] || Target
              return (
                <span className="tile" key={t.t} style={{ '--i': k }}>
                  <i><Ic size={24} strokeWidth={1.7} /></i>
                  <b>{lines(t.t)}</b>
                </span>
              )
            })}
          </div>
        )}
        {s.logoStrip && (
          <div className="stagger"><HeroStrip items={s.logoStrip} images={images} /></div>
        )}
      </>
    )
  }

  if (kind === 'outro') {
    return (
      <>
        <div className="outro__main">
        {s.logo && logoUrl && (
          <img className="outro__logo stagger" src={logoUrl} alt="EnerjiOne GRID" />
        )}
        <h2 className="headline headline--hero stagger">{lines(s.headline)}</h2>
        <p className="body body--wide stagger">{s.body}</p>
        {s.cta && <div className="cta stagger">{s.cta}</div>}
        {s.brandStrip && brandIcons.length > 0 && (
          <div className="brands stagger">
            <span className="brands__label">{t18('ENERJIONE AİLESİ')}</span>
            <div className="brands__row">
              {brandIcons.map((b, i) => (
                <span className="brandc" key={b.label} style={{ '--i': i }}>
                  <img src={b.url} alt="" />
                  <em>{b.label}</em>
                </span>
              ))}
            </div>
          </div>
        )}
        </div>
        {s.presenter && <PresenterCard defaults={s.presenter === true ? {} : s.presenter} />}
      </>
    )
  }

  if (kind === 'product') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
        </div>
        <div className="split__media stagger">
          {s.products.map((p) => (
            <figure className="product" key={p.title}>
              <div className="product__shot">
                {images[p.image] && <img src={images[p.image]} alt="" />}
              </div>
              <figcaption>
                <b>{p.title}</b>
                <span>{p.text}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </>
    )
  }

  if (kind === 'model') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
          {s.specs && (
            <div className="specs stagger">
              {s.specs.map((sp) => (
                <span className="spec" key={sp.k}>
                  <b>{sp.v}</b>
                  <em>{sp.k}</em>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="split__media split__media--model stagger">
          {s.models ? (
            <div className="duo">
              {s.models.map((m) => (
                <div className="duo__item" key={m.model}>
                  <Model3D src={models[m.model]} index={i} fit={m.fit} yaw={m.yaw} />
                  <span className="duo__label">{m.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <Model3D src={models[s.model]} index={i} fit={s.fit} yaw={s.yaw} />
          )}
          {s.brand === 'horstmann' && horstmannUrl && (
            <div className="maker maker--under">
              <span className="maker__plate"><img src={horstmannUrl} alt="Horstmann Germany" /></span>
            </div>
          )}
        </div>
      </>
    )
  }

  if (kind === 'art') {
    return (
      <>
        <div
          className="art stagger"
          style={{ '--art-ratio': s.artRatio || '1672 / 520', '--art-shift': s.artShift || '0%' }}
        >
          <span className="art__glow" />
          {images[s.image] && <img src={images[s.image]} alt="" />}
        </div>
        <div className="artfoot">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          {s.pairs ? <Pairs pairs={s.pairs} /> : (s.body && <p className="body stagger">{s.body}</p>)}
        </div>
      </>
    )
  }

  if (kind === 'photo') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
        </div>
        <div className="split__media split__media--photo stagger">
          <figure className={'shot' + (s.cutout ? ' shot--cut' : '')}>
            <span className="shot__glow" />
            {images[s.image] && <img src={images[s.image]} alt="" />}
            <span className="shot__sheen" />
          </figure>
        </div>
      </>
    )
  }

  if (kind === 'pmk') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
        </div>
        <div className="split__media split__media--panel split__media--pmk stagger">
          <PoleCapacity images={images} />
        </div>
      </>
    )
  }

  if (PANELS[kind]) {
    const Panel = PANELS[kind]
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
        </div>
        <div className={'split__media split__media--panel split__media--' + kind + ' stagger'}>
          <Panel images={images} />
        </div>
      </>
    )
  }

  if (kind === 'smart') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
        </div>
        <div className="split__media split__media--smart stagger">
          <SmartMode images={images} />
        </div>
      </>
    )
  }

  if (kind === 'notify') {
    return <NotifySlide s={s} Eyebrow={Eyebrow} lines={lines} images={images} logo={faviconUrl} />
  }

  if (kind === 'mobile') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
          {s.stores && <div className="stagger"><StoreBadges /></div>}
        </div>
        <div className="split__media split__media--mobile stagger">
          <MobileApp images={images} shots={s.shots} />
        </div>
      </>
    )
  }

  if (kind === 'docs') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
          {s.note && <div className="note stagger">{s.note}</div>}
        </div>
        <div className="split__media split__media--docs stagger">
          <ReportDeck images={images} docs={s.docs} />
        </div>
      </>
    )
  }

  if (kind === 'screen') {
    return (
      <>
        <div className="split__text">
          <Eyebrow s={s} />
          <h2 className="headline stagger">{lines(s.headline)}</h2>
          <p className="body stagger">{s.body}</p>
          {s.items && <Items items={s.items} compact />}
          {s.steps && <Steps s={s} />}
          {s.note && <div className="note stagger">{s.note}</div>}
        </div>
        <div className="split__media stagger">
          <DeviceScreen src={images[s.image]} portrait={s.portrait} />
        </div>
      </>
    )
  }

  if (kind === 'hub') {
    return (
      <>
        <div className="hubhead">
          <Eyebrow s={s} />
          <h2 className="headline headline--wide stagger">{lines(s.headline)}</h2>
          <p className="body body--wide stagger">{s.body}</p>
        </div>
        <div className="hubwrap stagger">
          <IntegrationHub logo={faviconUrl || logoUrl} images={images} />
        </div>
        {s.chips && (
          <div className="hubchips stagger">
            {s.chips.map((c) => <span className="tag" key={c}>{c}</span>)}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <Eyebrow s={s} />
      {s.headline && <h2 className="headline stagger">{lines(s.headline)}</h2>}
      {s.pairs ? <Pairs pairs={s.pairs} /> : (s.body && <p className="body stagger">{s.body}</p>)}
      {s.logos && (
        <div className="slogos stagger">
          <span className="slogos__label">{t18('TAŞIMA PROTOKOLLERİ')}</span>
          <span className="slogos__row">
            {s.logos.map((l) => (
              <span className="slogo" key={l.key}>
                {images[l.key] && <img src={images[l.key]} alt="" />}
                {l.label && <em>{l.label}</em>}
              </span>
            ))}
          </span>
        </div>
      )}
      {s.items && <Items items={s.items} />}
      {s.steps && <Steps s={s} />}
      {s.note && <div className="note stagger">{s.note}</div>}
    </>
  )
}

function Pairs({ pairs }) {
  return (
    <div className="pairs stagger">
      {pairs.map((p) => {
        const Head = ICONS[p.icon] || AlertTriangle
        return (
          <div className={'pair pair--' + p.tone} key={p.title}>
            <span className="pair__top">
              <i className="pair__ic"><Head size={19} strokeWidth={1.85} /></i>
              <b>{p.title}</b>
              <span className="pair__dot" />
            </span>
            <em>{p.text}</em>
            {p.ex && (
              <div className="pair__grid">
                {p.ex.map((e) => {
                  const EIc = ICONS[e.icon] || Zap
                  return (
                    <span className="pex" key={e.t}>
                      <i><EIc size={15} strokeWidth={1.9} /></i>
                      {e.t}
                    </span>
                  )
                })}
              </div>
            )}
            {p.result && (
              <span className="pair__res">
                <ArrowRight size={13} strokeWidth={2.4} />
                {p.result}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Eyebrow({ s }) {
  if (!s.eyebrow) return null
  return (
    <div className="eyebrow stagger">
      {s.num && <span className="eyebrow__num">{s.num}</span>}
      <i />
      {s.eyebrow}
    </div>
  )
}

function Items({ items, compact }) {
  if (!items?.length) return null
  return (
    <div className={'items stagger items--' + items.length + (compact ? ' items--compact' : '')}>
      {items.map((it) => {
        const Icon = ICONS[it.icon] || Target
        return (
          <div className="item" key={it.title}>
            <span className="item__ic"><Icon size={17} strokeWidth={1.8} /></span>
            <div>
              <div className="item__title">{it.title}</div>
              <div className="item__text">{it.text}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Steps({ s }) {
  return (
    <div className="steps stagger">
      {s.stepsTitle && <div className="steps__title">{s.stepsTitle}</div>}
      <ol className="steps__list">
        {s.steps.map((t, i) => (
          <li key={t}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            <span>{t}</span>
            {i < s.steps.length - 1 && <ChevronRight className="steps__arrow" size={13} strokeWidth={2} />}
          </li>
        ))}
      </ol>
    </div>
  )
}

function lines(text = '') {
  return text.split('\n').map((l, i) => <span className="line" key={i}>{l}</span>)
}
