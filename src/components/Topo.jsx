import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useScroll } from 'framer-motion'
import * as THREE from 'three'
import useIsTouch from '../hooks/useIsTouch'

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const buildFragment = (octaves) => /* glsl */ `
  uniform float uTime, uScroll, uOpacity, uBump, uScale, uLevels, uMode, uAspect;
  uniform vec2 uPtr;
  uniform vec3 uColA, uColB, uInk;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < ${octaves}; i++) {
      v += a * vnoise(p);
      p = r * p * 2.03 + 17.3;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0) * uScale;
    vec2 p = q * (1.0 + 0.3 * uScroll);
    p.x += uScroll * 1.6 + uTime * 0.045;
    p.y += uTime * 0.02;

    float dCursor = length(q - uPtr);
    float bump = uBump * exp(-dCursor * dCursor * 2.2);
    float h = fbm(p) + uScroll * 0.35 + bump;

    float f = h * uLevels;
    float w = fwidth(f);
    float dist = min(fract(f), 1.0 - fract(f));
    float slope = length(vec2(dFdx(h), dFdy(h)));
    float thick = 1.0 + 1.2 * smoothstep(0.012, 0.07, slope);
    float isIdx = step(mod(floor(f), 5.0), 0.5);
    float lineA = (1.0 - smoothstep(0.0, w * mix(1.1, 2.6, isIdx) * thick, dist))
                * mix(0.26, 0.48, isIdx) * mix(1.0, 0.8, uMode);

    float ns = dot(normalize(vec3(-dFdx(h) * 110.0, -dFdy(h) * 110.0, 1.0)),
                   normalize(vec3(-0.5, 0.62, 0.6)));
    ns = ns * 0.5 + 0.5;
    float fillA = mix(pow(ns, 2.2) * 0.15, (1.0 - ns) * 0.12, uMode);
    vec3 fillCol = mix(mix(uColA, uColB, 0.45), uInk, uMode);

    float peak = smoothstep(0.70 - bump * 0.5, 0.92 - bump * 0.35, h) * mix(1.0, 0.8, uMode);
    vec3 lineCol = mix(uColA, uColB, peak);
    float glowA = peak * peak * 0.08 * (1.0 - uMode);

    vec3 col = fillCol;
    float a = fillA;
    col = mix(col, lineCol, lineA);
    a += lineA * (1.0 - a);
    col = mix(col, uColB, glowA);
    a += glowA * (1.0 - a);

    gl_FragColor = vec4(col, a * uOpacity);
  }
`

const PALETTE = {
  dark:  { c1: [1.0, 0.3, 0.43],   c2: [1.0, 0.69, 0.3],  ink: [0.64, 0.61, 0.69], mode: 0 },
  light: { c1: [0.88, 0.11, 0.39], c2: [1.0, 0.54, 0.12], ink: [0.41, 0.38, 0.45], mode: 1 },
}

function useDataTheme(onChange) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')
  useEffect(() => {
    const mo = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme || 'dark')
      onChange()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [onChange])
  return theme
}

const srgb = (rgb, color) => color.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace)

function Field({ touch, reduce, scrollY, scrollP }) {
  const invalidate = useThree((s) => s.invalidate)
  const theme = useDataTheme(invalidate)
  const target = useRef([0, 0])
  const current = useRef([0, 0])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uOpacity: { value: 1 },
    uBump: { value: touch || reduce ? 0 : 0.3 },
    uScale: { value: 2.6 },
    uLevels: { value: touch ? 8 : 10 },
    uMode: { value: 0 },
    uAspect: { value: 1 },
    uPtr: { value: new THREE.Vector2() },
    uColA: { value: new THREE.Color() },
    uColB: { value: new THREE.Color() },
    uInk: { value: new THREE.Color() },
  }), [touch, reduce])

  useEffect(() => {
    const p = PALETTE[theme]
    srgb(p.c1, uniforms.uColA.value)
    srgb(p.c2, uniforms.uColB.value)
    srgb(p.ink, uniforms.uInk.value)
    uniforms.uMode.value = p.mode
  }, [theme, uniforms])

  useEffect(() => {
    if (touch || reduce) return
    const move = (e) => {
      target.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        1 - (e.clientY / window.innerHeight) * 2,
      ]
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [touch, reduce])

  useEffect(() => {
    if (!reduce) return
    invalidate()
    const off = scrollY.on('change', invalidate)
    window.addEventListener('pointermove', invalidate, { passive: true })
    return () => {
      off()
      window.removeEventListener('pointermove', invalidate)
    }
  }, [reduce, scrollY, invalidate])

  useFrame((state, delta) => {
    uniforms.uTime.value = reduce ? 0 : state.clock.elapsedTime
    uniforms.uAspect.value = state.size.width / Math.max(state.size.height, 1)
    uniforms.uScroll.value = Math.min(Math.max(scrollP.get() || 0, 0), 1)
    uniforms.uOpacity.value =
      1 - 0.55 * Math.min((scrollY.get() || 0) / Math.max(window.innerHeight, 1), 1)

    if (!touch && !reduce) {
      const k = 1 - Math.exp(-delta * 5)
      current.current[0] += (target.current[0] - current.current[0]) * k
      current.current[1] += (target.current[1] - current.current[1]) * k
      uniforms.uPtr.value.set(
        current.current[0] * uniforms.uAspect.value * uniforms.uScale.value * 0.5,
        current.current[1] * uniforms.uScale.value * 0.5,
      )
    }
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={buildFragment(touch ? 2 : 3)}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

export default function Topo() {
  const touch = useIsTouch()
  const reduce = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )
  const { scrollY, scrollYProgress } = useScroll()

  return (
    <Canvas
      dpr={touch ? 1 : [1, 1.5]}
      flat
      frameloop={reduce ? 'demand' : 'always'}
      gl={{ antialias: !touch, alpha: true, powerPreference: 'high-performance' }}
    >
      <Field touch={touch} reduce={reduce} scrollY={scrollY} scrollP={scrollYProgress} />
    </Canvas>
  )
}
