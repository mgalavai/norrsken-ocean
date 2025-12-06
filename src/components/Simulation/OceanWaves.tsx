// Ocean waves adapted from Zelda Wind Waker
// Source: https://github.com/Robpayot/zelda-project-public

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float timeWave;
uniform float yScale;
uniform float yStrength;

varying vec2 vUv;
varying float vDepth;

float calculateSurface(float x, float z, float time) {
    float y = 0.0;
    y += (sin(x * 1.0 / yScale + time * 1.0) + sin(x * 2.3 / yScale + time * 1.5) + sin(x * 3.3 / yScale + time * 0.4)) / 3.0;
    y += (sin(z * 0.2 / yScale + time * 1.8) + sin(z * 1.8 / yScale + time * 1.8) + sin(z * 2.8 / yScale + time * 0.8)) / 3.0;
    return y;
}

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Apply wave displacement
    pos.z += yStrength * calculateSurface(pos.x, pos.y, timeWave);
    pos.z -= yStrength * calculateSurface(0.0, 0.0, timeWave);
    
    // Fade waves at edges
    float circle = distance(vec2(pos.x, pos.y), vec2(0.0));
    pos.z *= (0.5 - circle * 0.01);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = clamp(-mvPosition.z / 100.0, 0.0, 1.0);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 color;
uniform vec3 deepColor;
uniform float timeWave;

varying vec2 vUv;
varying float vDepth;

void main() {
    // Gradient from shallow to deep
    vec3 oceanColor = mix(color, deepColor, vDepth);
    
    // Cel-shaded wave highlights (Wind Waker style)
    float wave = sin(vUv.x * 20.0 + timeWave * 2.0) * 0.5 + 0.5;
    wave += sin(vUv.y * 15.0 + timeWave * 1.5) * 0.5 + 0.5;
    wave *= 0.5;
    
    // Add bright highlights on wave peaks
    float highlight = smoothstep(0.7, 0.9, wave);
    oceanColor = mix(oceanColor, vec3(0.8, 0.95, 1.0), highlight * 0.4);
    
    // Add foam texture
    float foam = step(0.85, wave);
    oceanColor = mix(oceanColor, vec3(1.0), foam * 0.3);
    
    gl_FragColor = vec4(oceanColor, 1.0);
}
`;

export const OceanWaves = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.timeWave.value = state.clock.elapsedTime * 0.5;
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100, 200, 200]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    timeWave: { value: 0 },
                    yScale: { value: 8.0 },
                    yStrength: { value: 5.0 },
                    color: { value: new THREE.Color('#3a8dbd') },
                    deepColor: { value: new THREE.Color('#0a2a4a') },
                }}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};
