import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useIsTouch from '../hooks/useIsTouch'

// Builds a binary tree laid out as an inverted cone.
// Level L has 2^L nodes spread around a circle of radius L * 0.45.
function buildTree(depth) {
  const nodes = []
  for (let L = 0; L < depth; L++) {
    for (let i = 0; i < 2 ** L; i++) {
      const a = ((i + 0.5) / 2 ** L) * Math.PI * 2
      const r = L * 0.45
      nodes.push({ L, x: Math.cos(a) * r, y: (depth / 2 - L) * 0.6, z: Math.sin(a) * r })
    }
  }
  // Edges: every node connects to its parent (index = 2^(L-1) - 1 + floor(i/2))
  const edges = []
  nodes.forEach((n, idx) => {
    if (n.L === 0) return
    const i = idx - (2 ** n.L - 1)
    const p = nodes[2 ** (n.L - 1) - 1 + (i >> 1)]
    edges.push(p.x, p.y, p.z, n.x, n.y, n.z)
  })
  return { nodes, edges: new Float32Array(edges) }
}

function Tree({ depth, mobile }) {
  const group = useRef()
  const inner = useRef()
  const leaves = useRef()
  const { nodes, edges } = useMemo(() => buildTree(depth), [depth])

  // InstancedMesh: all spheres of a kind in ONE draw call (key for 60fps).
  useLayoutEffect(() => {
    const d = new THREE.Object3D()
    let a = 0, b = 0
    nodes.forEach((n) => {
      d.position.set(n.x, n.y, n.z)
      d.updateMatrix()
      if (n.L === depth - 1) leaves.current.setMatrixAt(b++, d.matrix) // leaves
      else inner.current.setMatrixAt(a++, d.matrix)                    // internal nodes
    })
    inner.current.instanceMatrix.needsUpdate = true
    leaves.current.instanceMatrix.needsUpdate = true
  }, [nodes, depth])

  useFrame((state, dt) => {
    const g = group.current
    const { x, y } = state.pointer
    const scroll = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1)

    g.rotation.y += dt * 0.2                                   // constant spin
    g.rotation.x += (0.4 + y * 0.25 - g.rotation.x) * 0.05     // smooth lerp toward the cursor
    g.position.y = scroll * 4                                  // the tree "climbs" as you scroll
    // Desktop: tree sits right, behind the photo. Mobile: centered.
        // Centered behind the photo; follows the cursor slightly
    g.position.x += (x * 0.5 - g.position.x) * 0.05
  })

  const leafCount = 2 ** (depth - 1)
  return (
    <group ref={group}>
      <instancedMesh ref={inner} args={[null, null, leafCount - 1]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#22d3ee" />
      </instancedMesh>
      <instancedMesh ref={leaves} args={[null, null, leafCount]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial color="#f472b6" />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[edges, 3]} /></bufferGeometry>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.45} />
      </lineSegments>
    </group>
  )
}

// Faint dust of particles so the background never feels empty.
function Particles({ count }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1)
      arr.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3)
    }
    return arr
  }, [count])
  useFrame((_, dt) => { ref.current.rotation.y += dt * 0.02 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.02} color="#a78bfa" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function CanvasBackground() {
  const touch = useIsTouch()
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Touch devices: shallower tree, fewer particles, dpr 1, no antialias to keep 60fps */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={touch ? 1 : [1, 1.5]}
        gl={{ antialias: !touch, powerPreference: 'high-performance' }}
        eventSource={document.body}
        eventPrefix="client"
      >
        <Tree depth={touch ? 5 : 6} mobile={touch} />
        <Particles count={touch ? 400 : 1500} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/60 to-ink" />
    </div>
  )
}