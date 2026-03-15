import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ShaderPlane, EnergyRing } from "@/components/ui/background-paper-shaders";

export function ShaderBackground() {
  return (
    <div className="absolute inset-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Suspense fallback={null}>
          <ShaderPlane position={[0, 0, 0]} color1="#ffffff" color2="#000000" />
          <EnergyRing radius={1.5} position={[0, 0, -0.5]} />
          <EnergyRing radius={2.2} position={[0, 0, -1]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
