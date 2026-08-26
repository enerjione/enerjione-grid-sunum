/* Kamera matematiği — görsel üzerinde odak noktası + yakınlaşma */

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t

export function normFocus(f) {
  const b = f || {}
  return {
    x: b.x ?? 50,
    y: b.y ?? 50,
    zoom: b.zoom ?? 1.08,
    at: { x: b.at?.x ?? 50, y: b.at?.y ?? 50 },
  }
}

export function zoomBy(f, k) {
  return { ...f, zoom: f.zoom * k, at: { ...f.at } }
}

export function lerpFocus(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    zoom: lerp(a.zoom, b.zoom, t),
    at: { x: lerp(a.at.x, b.at.x, t), y: lerp(a.at.y, b.at.y, t) },
  }
}

/* görselin "contain" olarak yerleştiği dikdörtgen (px) */
export function fitRect(aspect, vw, vh) {
  const va = vw / vh
  if (aspect > va) {
    const w = vw, h = vw / aspect
    return { x: 0, y: (vh - h) / 2, w, h }
  }
  const h = vh, w = vh * aspect
  return { x: (vw - w) / 2, y: 0, w, h }
}

/* odak -> ekran dönüşümü (translate px + scale) */
export function computeCam(aspect, f, vw, vh) {
  const r = fitRect(aspect, vw, vh)
  const s = Math.max(0.25, f.zoom)
  const px = r.x + r.w * (f.x / 100)
  const py = r.y + r.h * (f.y / 100)

  let tx = (f.at.x / 100) * vw - s * px
  let ty = (f.at.y / 100) * vh - s * py

  const iw = r.w * s
  const ih = r.h * s

  // görsel ekranı kapatabiliyorsa kenarlarda boşluk bırakma
  if (iw >= vw) tx = clamp(tx, vw - s * (r.x + r.w), -s * r.x)
  else tx = (vw - iw) / 2 - s * r.x

  if (ih >= vh) ty = clamp(ty, vh - s * (r.y + r.h), -s * r.y)
  else ty = (vh - ih) / 2 - s * r.y

  return { tx, ty, s, rect: r }
}

/* görsel üzerindeki (%x, %y) noktasının ekrandaki px karşılığı */
export function project(cam, x, y) {
  const { tx, ty, s, rect } = cam
  return {
    x: tx + s * (rect.x + rect.w * (x / 100)),
    y: ty + s * (rect.y + rect.h * (y / 100)),
  }
}

/* ard arda aynı kaynağı kullanan slaytları tek katmanda birleştir.
   srcs[i] = { url, video }  — video ise scroll ile kare kare sürülür. */
export function buildGroups(slides, srcs) {
  const groups = []
  slides.forEach((s, i) => {
    const { url = null, video = false } = srcs[i] || {}
    const last = groups[groups.length - 1]
    const sameEmpty = last && !last.url && !url && !last.video && !video && last.end === i - 1
    if (sameEmpty || (last && last.url && url && last.url === url && last.end === i - 1)) {
      last.end = i
      last.focuses.push(normFocus(s.focus))
    } else {
      groups.push({
        url, video,
        start: i, end: i,
        focuses: [normFocus(s.focus)],
        key: (url || 'empty') + '#' + i,
      })
    }
  })
  return groups
}

/* video grubunda scroll ilerlemesi -> 0..1 zaman konumu
   (giriş ve çıkış geçişlerini de kapsar, geri kaydırınca geri sarar) */
export function videoProgress(g, p) {
  const span = g.end - g.start + 2
  return clamp((p - (g.start - 1)) / span, 0, 1)
}

/* p (kesirli slayt konumu) için grubun kamerası ve opaklığı */
export function groupState(g, p) {
  const { start, end, focuses } = g
  let f
  if (p <= start) {
    const from = zoomBy(focuses[0], 0.9)
    f = lerpFocus(from, focuses[0], clamp(p - start + 1, 0, 1))
  } else if (p >= end) {
    const to = zoomBy(focuses[focuses.length - 1], 1.12)
    f = lerpFocus(focuses[focuses.length - 1], to, clamp(p - end, 0, 1))
  } else {
    const i = Math.floor(p)
    const t = p - i
    f = lerpFocus(focuses[i - start], focuses[i - start + 1], t)
  }

  const dist = p < start ? start - p : p > end ? p - end : 0
  const opacity = dist >= 1 ? 0 : Math.pow(1 - dist, 0.55)

  return { focus: f, opacity }
}
