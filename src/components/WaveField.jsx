import { useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useIsTouch from '../hooks/useIsTouch'

// ── Shaders ──────────────────────────────────────────────────────────────
// Toda la ola se calcula en la GPU: la CPU solo envía unos pocos números por frame.
const vertex = /* glsl */ `
  uniform float uTime, uScroll, uSize, uPx, uPointerOn;
  uniform vec3 uPointer;
  varying float vH;
  varying float vFade;
  void main() {
    vec3 p = position;
    float zf = p.z - uScroll * 0.01;                       // el scroll hace avanzar el terreno
    // Tres ondas que se cruzan = superficie orgánica, nunca idéntica
    float h = sin(p.x * 0.35 + uTime * 0.5) * 0.55
            + sin(zf * 0.28 - uTime * 0.6) * 0.55
            + sin((p.x + zf) * 0.18 + uTime * 0.3) * 0.7;
    // Onda circular que nace en el cursor y se desvanece con la distancia
    float d = distance(p.xz, uPointer.xz);
    h += uPointerOn * exp(-d * 0.28) * sin(d * 2.4 - uTime * 4.0) * 0.9;
    p.y = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(uSize * uPx * (14.0 / -mv.z), 1.0);  // perspectiva: lejos = más pequeño
    vH = h;
    // Se desvanece hacia el horizonte y hacia los lados
    vFade = (1.0 - smoothstep(12.0, 70.0, -mv.z)) * (1.0 - smoothstep(22.0, 34.0, abs(p.x)));
  }
`
const fragment = /* glsl */ `
  uniform vec3 uCol1; uniform vec3 uCol2; uniform float uOpacity;
  varying float vH;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;                                   // punto redondo
    float a = 1.0 - smoothstep(0.15, 0.5, d);               // borde suave
    vec3 c = mix(uCol1, uCol2, smoothstep(-0.8, 1.6, vH));  // las crestas viran a ámbar
    gl_FragColor = vec4(c, a * vFade * uOpacity);
  }
`

// Mismos colores que el resto de la web, uno por tema (valores sRGB 0–1).
const PALETTE = {
  dark:  { c1: [1.0, 0.3, 0.43],   c2: [1.0, 0.69, 0.3],  blending: THREE.AdditiveBlending },
  light: { c1: [0.88, 0.11, 0.39], c2: [1.0, 0.54, 0.12], blending: THREE.NormalBlending },
}

// Lee data-theme del <html> y avisa cuando el botón sol/luna lo cambia.
function useDataTheme() {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    const mo = new MutationObserver(() => setTheme(document.documentElement.dataset.theme || 'dark'))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return theme
}

function Field({ cols, rows, touch }) {
  const theme = useDataTheme()
  const dpr = useThree((s) => s.viewport.dpr)
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Rejilla plana en el plano XZ; la altura (Y) la pone el shader.
  const positions = useMemo(() => {
    const arr = new Float32Array(cols * rows * 3)
    let i = 0
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        arr[i++] = (c / (cols - 1) - 0.5) * 60   // x: -30 … 30
        arr[i++] = 0
        arr[i++] = -62 + (r / (rows - 1)) * 70   // z: -62 … 8
      }
    return arr
  }, [cols, rows])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uScroll: { value: 0 }, uSize: { value: touch ? 2.6 : 2.2 }, uPx: { value: 1 },
    uPointer: { value: new THREE.Vector3(0, 0, -8) }, uPointerOn: { value: 0 }, uOpacity: { value: 1 },
    uCol1: { value: new THREE.Color() }, uCol2: { value: new THREE.Color() },
  }), [touch])

  useEffect(() => {
    const p = PALETTE[theme]
    uniforms.uCol1.value.setRGB(...p.c1)
    uniforms.uCol2.value.setRGB(...p.c2)
  }, [theme, uniforms])

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const hit = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    const u = uniforms
    const t = reduce ? 0 : state.clock.elapsedTime
    u.uTime.value = t
    u.uPx.value = dpr
    u.uScroll.value = window.scrollY
    // Al bajar por la página la ola se atenúa para no competir con el texto
    u.uOpacity.value = 1 - 0.55 * Math.min(window.scrollY / window.innerHeight, 1)

    let on = 0
    if (touch) {
      // Sin cursor en táctil: un "fantasma" recorre el campo solo
      hit.set(Math.sin(t * 0.3) * 9, 0, -10 + Math.cos(t * 0.23) * 6)
      on = reduce ? 0 : 1
    } else {
      // Proyecta el cursor sobre el plano del terreno (raycast contra y = 0)
      state.raycaster.setFromCamera(state.pointer, state.camera)
      on = state.raycaster.ray.intersectPlane(plane, hit) ? 1 : 0
    }
    u.uPointer.value.lerp(hit, 0.12)
    u.uPointerOn.value += (on - u.uPointerOn.value) * 0.05
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <shaderMaterial uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment}
        transparent depthWrite={false} blending={PALETTE[theme].blending} />
    </points>
  )
}

export default function WaveField() {
  const touch = useIsTouch()
  return (
    // La cámara mira el terreno desde arriba y un poco por delante, como volando a ras de la ola
    <Canvas
      camera={{ position: [0, 3.4, 9], fov: 55 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.6, -9)}
      dpr={touch ? 1 : [1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      eventSource={document.body}
      eventPrefix="client"
    >
      {/* Móvil: ~5 mil puntos. Escritorio: ~18 mil. Siguen siendo una sola llamada de dibujo. */}
      <Field cols={touch ? 70 : 150} rows={touch ? 70 : 120} touch={touch} />
    </Canvas>
  )
}