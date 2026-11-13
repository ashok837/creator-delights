import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Environment, Lightformer, Sparkles } from '@react-three/drei'

const gold = { color: '#d4af37', metalness: 1, roughness: 0.22 }
const body = { color: '#141414', metalness: 0.7, roughness: 0.35 }

function Camera() {
  const g = useRef()
  useFrame(({ pointer, clock }, dt) => {
    const s = Math.min(1, clock.elapsedTime / 1.4)
    g.current.scale.setScalar(0.2 + 0.8 * (1 - Math.pow(1 - s, 3)))
    g.current.rotation.y += (pointer.x * 0.7 - 0.45 - g.current.rotation.y) * dt * 2.5
    g.current.rotation.x += (-pointer.y * 0.4 + 0.1 - g.current.rotation.x) * dt * 2.5
  })
  return (
    <Float speed={2} rotationIntensity={0.25} floatIntensity={1.2}>
      <group ref={g}>
        <RoundedBox args={[3.2, 2.1, 1.3]} radius={0.18} smoothness={4}><meshStandardMaterial {...body} /></RoundedBox>
        <RoundedBox args={[3.22, 0.9, 1.32]} radius={0.12} position={[0, 0.55, 0]}><meshStandardMaterial color="#e8dcc4" metalness={0.5} roughness={0.4} /></RoundedBox>
        <RoundedBox args={[1.1, 0.5, 0.9]} radius={0.1} position={[0, 1.3, -0.05]}><meshStandardMaterial {...body} /></RoundedBox>
        <mesh position={[-1.15, 1.2, 0.2]}><boxGeometry args={[0.5, 0.3, 0.4]} /><meshStandardMaterial {...gold} /></mesh>
        <mesh position={[1.1, 1.2, 0.3]}><cylinderGeometry args={[0.22, 0.22, 0.14, 32]} /><meshStandardMaterial {...gold} /></mesh>
        <mesh position={[1.1, 1.32, 0.3]}><cylinderGeometry args={[0.1, 0.1, 0.1, 24]} /><meshStandardMaterial color="#b11" metalness={0.4} roughness={0.3} /></mesh>
        <group position={[0, -0.05, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[1, 1.05, 0.7, 64]} /><meshStandardMaterial {...body} /></mesh>
          <mesh position={[0, 0.7, 0]}><torusGeometry args={[1, 0.07, 24, 64]} /><meshStandardMaterial {...gold} /></mesh>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.78, 0.78, 0.5, 64]} /><meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} /></mesh>
          <mesh position={[0, 0.76, 0]}><cylinderGeometry args={[0.62, 0.62, 0.05, 64]} /><meshPhysicalMaterial color="#10203a" metalness={0.9} roughness={0.03} clearcoat={1} /></mesh>
          <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.3, 0.3, 0.02, 48]} /><meshStandardMaterial color="#05060a" metalness={1} roughness={0.05} /></mesh>
        </group>
        <mesh position={[-1.3, 0.6, 0.67]}><circleGeometry args={[0.1, 24]} /><meshBasicMaterial color="#fff" /></mesh>
      </group>
    </Float>
  )
}

export default function Camera3D() {
  return (
    <Canvas camera={{ position: [0, 0.3, 7], fov: 40 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} aria-label="Interactive 3D camera">
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 5]} intensity={90} color="#ffd98a" />
      <pointLight position={[-5, -2, 4]} intensity={50} color="#e8dcc4" />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -4]} scale={[12, 5, 1]} />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 3]} scale={[4, 6, 1]} color="#ffd98a" />
        <Lightformer form="ring" intensity={3} position={[5, 0, 4]} scale={4} color="#e8dcc4" />
      </Environment>
      <Camera />
      <Sparkles count={40} scale={8} size={2.5} speed={0.4} color="#d4af37" />
    </Canvas>
  )
}
