import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';

function AxisPoint({ point }) {
  const [hovered, setHovered] = useState(false);
  const enter = (event) => {
    event.stopPropagation();
    setHovered(true);
    if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
  };
  const leave = (event) => {
    event.stopPropagation();
    setHovered(false);
    if (typeof document !== 'undefined') document.body.style.cursor = '';
  };

  return <group position={point.position} onPointerOver={enter} onPointerOut={leave}>
    <mesh scale={hovered ? 1.45 : 1}>
      <sphereGeometry args={[.09, 18, 18]}/>
      <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={hovered ? .8 : .18} roughness={.28}/>
    </mesh>
    <Html distanceFactor={7} position={[.13, .13, 0]} style={{ pointerEvents: 'none' }}>
      <span className={`scene-tooltip ${hovered ? 'is-visible' : ''}`}>
        <b>{point.label}</b>
        <small>{point.detail}</small>
      </span>
    </Html>
  </group>;
}

function SceneRig({ axisPoints }) {
  const rig = useRef(null);
  useFrame((state, delta) => {
    if (!rig.current) return;
    const scroll = Math.min(window.scrollY, 1200);
    rig.current.rotation.y += delta * .12;
    rig.current.rotation.y += scroll * .000012;
    rig.current.rotation.x = Math.sin(state.clock.elapsedTime * .4) * .06 + state.pointer.y * .08;
    rig.current.rotation.z = state.pointer.x * .035;
  });

  return <group ref={rig} rotation={[.2, -.38, .08]}>
    <Float speed={1.2} rotationIntensity={.18} floatIntensity={.45}>
      <mesh castShadow>
        <icosahedronGeometry args={[.9, 2]}/>
        <meshStandardMaterial color="#d7d0c0" roughness={.26} metalness={.05} emissive="#718368" emissiveIntensity={.12}/>
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, .012, 8, 64]}/>
        <meshBasicMaterial color="#aa6a4d" transparent opacity={.8}/>
      </mesh>
      <mesh rotation={[0, Math.PI / 2, .42]}>
        <torusGeometry args={[1.34, .008, 8, 64]}/>
        <meshBasicMaterial color="#aaa0c6" transparent opacity={.75}/>
      </mesh>
    </Float>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[1.2, 0, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#718368"/></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[-1.2, 0, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#718368"/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aa6a4d"/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aa6a4d"/></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.2]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aaa0c6"/></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, -1.2]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aaa0c6"/></mesh>
    {axisPoints.map((point) => <AxisPoint key={point.label} point={point}/>) }
  </group>;
}

export default function ThreeScene({ axisPoints }) {
  return <Canvas className="three-canvas" dpr={[1, 1.5]} camera={{ position: [3.6, 2.7, 5.1], fov: 42 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.5}/>
    <directionalLight position={[4, 5, 4]} intensity={2.8} color="#fffaf0"/>
    <pointLight position={[-4, -2, 2]} intensity={6} distance={8} color="#718368"/>
    <pointLight position={[3, 0, -2]} intensity={4} distance={7} color="#aa6a4d"/>
    <SceneRig axisPoints={axisPoints}/>
    <OrbitControls enablePan={false} enableZoom={false} enableRotate={false}/>
  </Canvas>;
}
