import { t as t18 } from './i18n'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { scrollState } from './scrollStore'

/* ------------------------------------------------------------------
   GLB görüntüleyici
   - scroll konumu modeli döndürür (ileri/geri)
   - fare ile sürükleyerek serbestçe çevirebilirsiniz (ataletli)
   - fare sadece üzerindeyken hafif eğim verir
   - slayt görünür değilse render durur
------------------------------------------------------------------- */

const TURN = Math.PI * 1.25      // slayt boyunca scroll dönüşü
const LERP = 0.085
const PITCH_MIN = -0.85
const PITCH_MAX = 0.85

export default function Model3D({ src, index, spin = 0.12, fit = 1.0, yaw = 0.5, pitch = 0.06 }) {
  const hostRef = useRef(null)
  const [status, setStatus] = useState('load')   // load | ok | error
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !src) return

    let disposed = false
    let raf = 0

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.setClearColor(0x000000, 0)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 0, 6)

    // dosya gerektirmeyen prosedürel ortam ışığı
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.05)
    scene.environment = envRT.texture

    const key = new THREE.DirectionalLight(0xffffff, 2.6)
    key.position.set(3.4, 4.2, 3.6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x9dc4ff, 1.1)
    fill.position.set(-4, 1.2, 2.4)
    scene.add(fill)
    const rim = new THREE.DirectionalLight(0xff8a1f, 2.2)
    rim.position.set(-2.2, 1.6, -4.2)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0x6b86b8, 0.5))

    const pivot = new THREE.Group()
    const tilt = new THREE.Group()
    const spinner = new THREE.Group()
    tilt.add(spinner)
    pivot.add(tilt)
    scene.add(pivot)

    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)   // sikistirilmis GLB destegi
    loader.load(
      src,
      (gltf) => {
        if (disposed) return
        const root = gltf.scene
        const box = new THREE.Box3().setFromObject(root)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z) || 1

        root.position.sub(center)
        root.scale.setScalar((2.6 / maxDim) * fit)
        root.traverse((o) => {
          if (o.isMesh && o.material) {
            o.material.envMapIntensity = 1.15
            if (o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace
          }
        })
        spinner.add(root)
        setStatus('ok')
      },
      undefined,
      (err) => {
        console.error('[Model3D] GLB yuklenemedi:', err)
        if (!disposed) setStatus('error')
      }
    )

    /* ---------------- fare ile sürükleme ---------------- */
    let userYaw = 0, userPitch = 0
    let velYaw = 0, velPitch = 0
    let isDown = false, lastX = 0, lastY = 0
    let held = false            // kullanıcı bir kez çevirdiyse otomatik dönüşü durdur

    const el = renderer.domElement
    el.style.touchAction = 'none'

    const onDown = (e) => {
      isDown = true; held = true
      lastX = e.clientX; lastY = e.clientY
      velYaw = velPitch = 0
      el.setPointerCapture?.(e.pointerId)
      setDragging(true)
      e.preventDefault()
    }
    const onMove = (e) => {
      if (!isDown) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX; lastY = e.clientY
      velYaw = dx * 0.0075
      velPitch = dy * 0.0055
      userYaw += velYaw
      userPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, userPitch + velPitch))
      e.preventDefault()
    }
    const onUp = (e) => {
      if (!isDown) return
      isDown = false
      el.releasePointerCapture?.(e.pointerId)
      setDragging(false)
    }
    const onDbl = () => { userYaw = 0; userPitch = 0; velYaw = velPitch = 0; held = false }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('pointerleave', onUp)
    el.addEventListener('dblclick', onDbl)

    /* ---------------- boyutlandırma ---------------- */
    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    /* ---------------- çizim döngüsü ---------------- */
    let curYaw = yaw
    let curPitch = pitch
    let t = 0

    const tick = () => {
      raf = requestAnimationFrame(tick)

      const d = scrollState.p - index
      if (Math.abs(d) > 1.15) return

      t += 0.016

      // sürükleme bittiyse atalet
      if (!isDown && (Math.abs(velYaw) > 0.00005 || Math.abs(velPitch) > 0.00005)) {
        userYaw += velYaw
        userPitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, userPitch + velPitch))
        velYaw *= 0.94
        velPitch *= 0.94
      }

      const auto = held ? 0 : t * spin * 0.12
      const hover = isDown ? 0 : scrollState.mx * 0.22

      const targetYaw = yaw + d * TURN + userYaw + auto + hover
      const targetPitch = pitch + userPitch - (isDown ? 0 : scrollState.my * 0.12)

      const k = isDown ? 0.45 : LERP
      curYaw += (targetYaw - curYaw) * k
      curPitch += (targetPitch - curPitch) * k

      spinner.rotation.y = curYaw
      tilt.rotation.x = curPitch
      pivot.position.y = Math.sin(t * 0.9) * 0.05

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('pointerleave', onUp)
      el.removeEventListener('dblclick', onDbl)
      envRT.dispose()
      pmrem.dispose()
      scene.traverse((o) => {
        if (o.isMesh) {
          o.geometry?.dispose?.()
          const m = o.material
          if (Array.isArray(m)) m.forEach((x) => x.dispose?.())
          else m?.dispose?.()
        }
      })
      renderer.dispose()
      el.parentNode?.removeChild(el)
    }
  }, [src, index, spin, fit, yaw, pitch])

  return (
    <div className={'model' + (dragging ? ' is-dragging' : '')}>
      <div className="model__glow" />
      <div className="model__stage" ref={hostRef} />
      <div className="model__floor" />
      {status === 'ok' && <div className="model__hint">{t18('Sürükleyerek çevirin · çift tık sıfırlar')}</div>}
      {status === 'load' && <div className="model__msg">{t18('3B model yükleniyor…')}</div>}
      {status === 'error' && <div className="model__msg model__msg--err">{t18('Model yüklenemedi')}</div>}
    </div>
  )
}
