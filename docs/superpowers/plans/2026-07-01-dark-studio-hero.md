# Red Bull Dark Studio Hero — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o hero scroll-driven da landing Red Bull em uma experiência de estúdio escuro premium: gradiente escuro com dithering, piso refletivo, coreografia refinada da lata (entrada → bump → burst) e reveal final com logo Red Bull + lettering "Red Bull te dá asas.", em estrutura pinada pronta para seções futuras.

**Spec:** `docs/superpowers/specs/2026-07-01-dark-studio-hero-design.md` (aprovado)

**Architecture:** Um único ScrollTrigger (criado em `HeroSection`) pina a `<section>` do hero e faz scrub de um master timeline com duração fixa 7.5. `Scene` (3D, dentro do Canvas) e `OverlayType` (DOM) recebem o timeline por prop e inserem tweens em tempos absolutos definidos em `src/lib/phases.ts`.

**Tech Stack:** Next.js 14 (App Router), React Three Fiber 8, drei 9 (`MeshReflectorMaterial`, `Environment`, `Lightformer`, `Instances`), GSAP 3.13 (`ScrollTrigger`, `SplitText`, `@gsap/react`), @react-three/postprocessing (`DepthOfField`, `Vignette`, `Noise`).

**Regras do usuário (obrigatórias):** NUNCA adicionar comentários no código. NUNCA criar blocos de summary/JSDoc. O código abaixo já respeita isso — copiar como está.

**Verificação neste projeto:** não há infra de testes unitários e o produto é 3D/visual; a verificação por tarefa é `npx tsc --noEmit` (rápido) e, nos marcos, `npm run build` + inspeção visual com Playwright (Task 10). Não criar infra de teste unitário (YAGNI).

**File structure (resultado final):**

| Arquivo | Responsabilidade | Ação |
|---|---|---|
| `src/lib/phases.ts` | Tempos absolutos das fases do timeline | Criar |
| `src/app/layout.tsx` | Fonte Anton via next/font (`--font-display`) | Modificar |
| `src/app/globals.css` | Base escura global | Modificar |
| `src/app/page.tsx` | Composição: HeroSection + placeholder da próxima seção | Reescrever |
| `src/components/HeroSection.tsx` | Section pinada, master timeline, Canvas + overlay | Criar |
| `src/components/Scene.tsx` | Coreografia 3D inserida no timeline recebido | Reescrever |
| `src/components/Backdrop.tsx` | Gradiente escuro com dithering + piso refletivo | Reescrever |
| `src/components/Lights.tsx` | Iluminação de estúdio (rims, softbox, fill, acento vermelho) | Reescrever |
| `src/components/Effects.tsx` | DOF retunado + Vignette + Noise | Reescrever |
| `src/components/ShockRing.tsx` | Anel de choque do impacto | Criar |
| `src/components/ClonedCans.tsx` | 8 instâncias com targets autorados determinísticos | Modificar |
| `src/components/OverlayType.tsx` | Logo + lettering com SplitText | Criar |
| `public/redbull-logo.svg` | Logo oficial (substituível pelo usuário) | Baixar |
| `src/components/{RingAccent,Cloud,Sky,Balloons,EmergenceCloud}.tsx` | Código morto | Deletar |

---

## Chunk 1: Fundação e ambiente 3D

### Task 1: Dependências, fases e fundação global

**Files:**
- Modify: `package.json` (via npm)
- Create: `src/lib/phases.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Delete: `src/components/Cloud.tsx`, `src/components/Sky.tsx`, `src/components/Balloons.tsx`, `src/components/EmergenceCloud.tsx`

- [ ] **Step 1: Upgrade do GSAP para 3.13+ (SplitText gratuito)**

Run: `npm install gsap@^3.13.0`
Expected: instala sem erros; `npm ls gsap` mostra `gsap@3.13.x` ou superior (o lockfile já resolve para 3.15.0 — o comando praticamente só atualiza o range no `package.json`; quase no-op é o esperado)

- [ ] **Step 2: Verificar que SplitText existe no pacote**

Run: `node -e "const {SplitText} = require('gsap/SplitText'); console.log(typeof SplitText)"`
Expected: imprime `function`

- [ ] **Step 3: Criar `src/lib/phases.ts`**

```ts
export const PHASES = {
  entry: 0,
  impact: 2.15,
  burst: 2.7,
  reveal: 4.6,
  hold: 6.8,
  end: 7.5,
};
```

- [ ] **Step 4: Reescrever `src/app/globals.css`**

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  background: #05080f;
  color: #f4f4f6;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

canvas {
  display: block;
  touch-action: none;
}
```

- [ ] **Step 5: Adicionar fonte Anton em `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Red Bull — Scroll Experience",
  description: "Immersive scroll-driven Red Bull landing section.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={anton.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Deletar código morto (arquivos não importados por ninguém)**

Run: `git rm src/components/Cloud.tsx src/components/Sky.tsx src/components/Balloons.tsx src/components/EmergenceCloud.tsx`
Expected: 4 arquivos removidos. NÃO remover `RingAccent.tsx` ainda (Scene.tsx atual importa; sai na Task 8).

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: upgrade gsap to 3.13, add phases module, dark globals, Anton font, remove dead components"
```

### Task 2: Logo oficial da Red Bull

**Files:**
- Create: `public/redbull-logo.svg`

- [ ] **Step 1: Localizar o SVG oficial**

Usar WebSearch/WebFetch para localizar o SVG do logo Red Bull (touros + sol) em fonte pública. Candidatos em ordem:
1. Wikimedia/Wikipedia (arquivo do verbete "Red Bull" ou "Red Bull GmbH")
2. Repositórios de logos vetoriais públicos (worldvectorlogo, seeklogo — versão SVG)

- [ ] **Step 2: Baixar para `public/redbull-logo.svg`**

Run (ajustar URL encontrada): `curl -L -o public/redbull-logo.svg "<URL_DO_SVG>"`

- [ ] **Step 3: Validar o arquivo**

Run: `Get-Content public/redbull-logo.svg -TotalCount 3`
Expected: conteúdo começa com `<?xml` ou `<svg`. Se vier HTML (página de erro) ou binário: tentar próximo candidato.

**Fallback obrigatório se todos falharem:** criar `public/redbull-logo.svg` tipográfico local (texto "RED BULL" em duas linhas, path/text SVG, cores `#DB0A40` e `#FFC906` sobre transparente) e AVISAR o usuário no resumo final que o asset é placeholder e deve ser substituído pelo oficial (basta trocar o arquivo em `public/`).

- [ ] **Step 4: Commit**

```bash
git add public/redbull-logo.svg
git commit -m "feat: add Red Bull logo asset"
```

### Task 3: Backdrop — gradiente escuro com dithering + piso refletivo

**Files:**
- Rewrite: `src/components/Backdrop.tsx`

- [ ] **Step 1: Reescrever `src/components/Backdrop.tsx` (conteúdo completo)**

```tsx
"use client";

import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const CENTER_COLOR = new THREE.Color("#0d1b2e");
const EDGE_COLOR = new THREE.Color("#05080f");

function GradientDome() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      depthWrite: false,
      side: THREE.BackSide,
      uniforms: {
        centerColor: { value: CENTER_COLOR.clone() },
        edgeColor: { value: EDGE_COLOR.clone() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 centerColor;
        uniform vec3 edgeColor;
        varying vec3 vWorldPosition;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec3 dir = normalize(vWorldPosition - cameraPosition);
          float facing = clamp(dot(dir, vec3(0.0, 0.0, -1.0)), 0.0, 1.0);
          float radial = pow(facing, 3.0);
          vec3 col = mix(edgeColor, centerColor, radial);
          col += (hash(gl_FragCoord.xy) - 0.5) * (2.0 / 255.0);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  return (
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[50, 32, 16]} />
    </mesh>
  );
}

function ReflectiveFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <planeGeometry args={[40, 40]} />
      <MeshReflectorMaterial
        color="#080c14"
        resolution={1024}
        blur={[400, 100]}
        mixBlur={0.9}
        mixStrength={2}
        roughness={0.7}
        mirror={0.5}
        depthScale={0.6}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
      />
    </mesh>
  );
}

export default function Backdrop() {
  return (
    <group>
      <GradientDome />
      <ReflectiveFloor />
    </group>
  );
}
```

Nota: `cameraPosition` é uniform built-in do three em `ShaderMaterial` — não declarar. O `ContactShadows` anterior sai de cena (o reflexo ancora a lata). Valores do reflector são ponto de partida — calibrar visualmente na Task 10 se necessário.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/Backdrop.tsx
git commit -m "feat: dark dithered gradient dome and reflective floor"
```

### Task 4: Iluminação de estúdio

**Files:**
- Rewrite: `src/components/Lights.tsx`

- [ ] **Step 1: Reescrever `src/components/Lights.tsx` (conteúdo completo)**

```tsx
"use client";

import { Environment, Lightformer } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} color="#dfe8ff" />

      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#f5ecdc" />

      <Environment resolution={256} background={false}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#dce6f5"
          position={[-6, 1, 2]}
          rotation={[0, Math.PI / 2.6, 0]}
          scale={[1.5, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          color="#e8eef8"
          position={[6, 1, 2]}
          rotation={[0, -Math.PI / 2.6, 0]}
          scale={[1.5, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#ffffff"
          position={[0, 6, 3]}
          rotation={[-Math.PI / 2.4, 0, 0]}
          scale={[10, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.8}
          color="#aebdd8"
          position={[0, -5, 4]}
          scale={[10, 3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.3}
          color="#ff2a2a"
          position={[-8, -1, -2]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[2, 6, 1]}
        />
      </Environment>
    </>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/Lights.tsx
git commit -m "feat: studio lighting with silver rims and subtle red accent"
```

### Task 5: Pós-processamento — DOF retunado + Vignette + Noise

**Files:**
- Rewrite: `src/components/Effects.tsx`

- [ ] **Step 1: Reescrever `src/components/Effects.tsx` (conteúdo completo)**

```tsx
"use client";

import {
  EffectComposer,
  DepthOfField,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        worldFocusDistance={6}
        worldFocusRange={5}
        focalLength={0.02}
        bokehScale={2.5}
        height={700}
      />
      <Vignette offset={0.3} darkness={0.55} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
    </EffectComposer>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/Effects.tsx
git commit -m "feat: retuned depth of field with vignette and film grain"
```

### Task 6: ShockRing

**Files:**
- Create: `src/components/ShockRing.tsx`

- [ ] **Step 1: Criar `src/components/ShockRing.tsx` (conteúdo completo)**

```tsx
"use client";

import { forwardRef } from "react";
import * as THREE from "three";

const ShockRing = forwardRef<THREE.Mesh>(function ShockRing(_props, ref) {
  return (
    <mesh
      ref={ref}
      position={[0, -3.38, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={0.2}
    >
      <ringGeometry args={[0.92, 1, 64]} />
      <meshBasicMaterial
        color="#c8d4e6"
        transparent
        opacity={0}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
});

export default ShockRing;
```

Nota: fica em `y = -3.38` (2 cm acima do piso) para evitar z-fighting. A animação (escala 0.2→6, opacidade 0.5→0) é inserida pelo `Scene` na Task 8. O arquivo fica sem uso até lá — esperado.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros

- [ ] **Step 3: Commit**

```bash
git add src/components/ShockRing.tsx
git commit -m "feat: add impact shock ring component"
```

### Task 7: ClonedCans — targets autorados determinísticos

**Files:**
- Rewrite: `src/components/ClonedCans.tsx`

- [ ] **Step 1: Reescrever `src/components/ClonedCans.tsx` (conteúdo completo)**

Mudanças: remove `Math.random()`/`computeTargets`, targets viram array autorado simétrico (4 esquerda, 4 direita, rotação base −π/2 com variações escolhidas à mão), exporta `CLONE_COUNT`.

```tsx
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useCanParts } from "@/hooks/useCanModel";

export const CLONE_COUNT = 8;
export const CLONE_SCALE = 9;

export interface CloneTarget {
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

export interface ClonedCansHandle {
  group: THREE.Group | null;
  items: (THREE.Object3D | null)[];
  targets: CloneTarget[];
}

const TARGETS: CloneTarget[] = [
  {
    position: new THREE.Vector3(-3.0, 0.55, 1.4),
    rotation: new THREE.Euler(-1.45, 0.5, -0.2),
  },
  {
    position: new THREE.Vector3(3.0, -0.25, 1.2),
    rotation: new THREE.Euler(-1.7, -0.6, 0.25),
  },
  {
    position: new THREE.Vector3(-3.5, -1.0, -0.8),
    rotation: new THREE.Euler(-1.35, 1.1, 0.1),
  },
  {
    position: new THREE.Vector3(3.5, 1.05, -0.6),
    rotation: new THREE.Euler(-1.8, -1.2, -0.15),
  },
  {
    position: new THREE.Vector3(-2.7, 1.55, -2.6),
    rotation: new THREE.Euler(-1.55, 1.9, 0.3),
  },
  {
    position: new THREE.Vector3(2.7, -1.55, -2.4),
    rotation: new THREE.Euler(-1.5, -2.0, -0.3),
  },
  {
    position: new THREE.Vector3(-3.9, -0.15, -3.6),
    rotation: new THREE.Euler(-1.65, 2.6, 0.05),
  },
  {
    position: new THREE.Vector3(3.9, 0.3, -3.8),
    rotation: new THREE.Euler(-1.4, -2.7, -0.05),
  },
];

const ClonedCans = forwardRef<ClonedCansHandle>(function ClonedCans(
  _props,
  ref,
) {
  const { geometry, material } = useCanParts();
  const groupRef = useRef<THREE.Group>(null);
  const itemRefs = useRef<(THREE.Object3D | null)[]>([]);

  useImperativeHandle(ref, () => ({
    get group() {
      return groupRef.current;
    },
    get items() {
      return itemRefs.current;
    },
    targets: TARGETS,
  }));

  return (
    <group ref={groupRef} visible={false}>
      <Instances geometry={geometry} material={material} limit={CLONE_COUNT}>
        {TARGETS.map((_, i) => (
          <Instance
            key={i}
            ref={(el: THREE.Object3D | null) => {
              itemRefs.current[i] = el;
            }}
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.001}
          />
        ))}
      </Instances>
    </group>
  );
});

export default ClonedCans;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros (o `Scene.tsx` atual continua compatível com a interface)

- [ ] **Step 3: Build de marco do Chunk 1**

Run: `npm run build`
Expected: build passa sem erros

- [ ] **Step 4: Commit**

```bash
git add src/components/ClonedCans.tsx
git commit -m "feat: deterministic hand-authored symmetric clone targets"
```

---

## Chunk 2: Estrutura pinada, coreografia e overlay

### Task 8: HeroSection + page.tsx + Scene com timeline por prop

**Files:**
- Create: `src/components/HeroSection.tsx`
- Rewrite: `src/app/page.tsx`
- Rewrite: `src/components/Scene.tsx`
- Delete: `src/components/RingAccent.tsx`
- Create (stub temporário): `src/components/OverlayType.tsx`

- [ ] **Step 1: Criar stub de `src/components/OverlayType.tsx`** (implementação real na Task 9; o stub permite compilar o HeroSection)

```tsx
"use client";

import gsap from "gsap";

interface OverlayTypeProps {
  timeline: gsap.core.Timeline | null;
}

export default function OverlayType(_props: OverlayTypeProps) {
  return null;
}
```

- [ ] **Step 2: Criar `src/components/HeroSection.tsx` (conteúdo completo)**

```tsx
"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Scene from "./Scene";
import OverlayType from "./OverlayType";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=500%",
          pin: true,
          scrub: 1,
        },
      });
      tl.set({}, {}, PHASES.end);
      setTimeline(tl);
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "100vh", overflow: "hidden" }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 100 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor("#05080f", 1);
          scene.background = new THREE.Color("#05080f");
        }}
      >
        <Suspense fallback={null}>
          <Scene timeline={timeline} />
        </Suspense>
      </Canvas>
      <OverlayType timeline={timeline} />
    </section>
  );
}
```

Nota: `tl.set({}, {}, PHASES.end)` fixa a duração do timeline em 7.5 desde a criação — o mapeamento scroll→tempo fica estável mesmo com Scene/Overlay inserindo tweens depois (GLTF carrega sob Suspense).

- [ ] **Step 3: Reescrever `src/app/page.tsx` (conteúdo completo)**

```tsx
import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070b12",
        }}
      >
        <p
          style={{
            color: "#3a4356",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontSize: "0.85rem",
          }}
        >
          Próxima seção
        </p>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Reescrever `src/components/Scene.tsx` (conteúdo completo)**

Coreografia completa por fases (tempos de `PHASES`): entrada em arco com `fromTo` (determinístico em scrub reverso), bump com squash/stretch + camera shake + ShockRing, burst com clones em escala cheia + overshoot elástico na chegada, bob senoidal com gating por clone.

```tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Backdrop from "./Backdrop";
import Lights from "./Lights";
import MainCan from "./MainCan";
import ShockRing from "./ShockRing";
import ClonedCans, { ClonedCansHandle, CLONE_SCALE } from "./ClonedCans";
import Effects from "./Effects";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CAN_SCALE = 9;
const START = { x: -3.2, y: -3.6, z: -6 };

interface SceneProps {
  timeline: gsap.core.Timeline | null;
}

export default function Scene({ timeline }: SceneProps) {
  const mainCanRef = useRef<THREE.Group>(null);
  const clonesRef = useRef<ClonedCansHandle>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const camera = useThree((state) => state.camera);

  useGSAP(
    () => {
      const mainCan = mainCanRef.current;
      const clones = clonesRef.current;
      const ring = ringRef.current;
      if (!timeline || !mainCan || !clones || !ring) return;

      const cloneGroup = clones.group;
      const cloneItems = clones.items;
      const targets = clones.targets;
      const ringMaterial = ring.material as THREE.MeshBasicMaterial;

      timeline.set(mainCan, { visible: true }, 0);
      if (cloneGroup) timeline.set(cloneGroup, { visible: false }, 0);

      timeline.fromTo(
        mainCan.position,
        { x: START.x },
        { x: 0, duration: 2.0, ease: "power2.inOut" },
        0,
      );
      timeline.fromTo(
        mainCan.position,
        { y: START.y },
        { y: 0.6, duration: 1.3, ease: "power2.out" },
        0,
      );
      timeline.to(
        mainCan.position,
        { y: 0, duration: 0.85, ease: "power1.inOut" },
        1.3,
      );
      timeline.fromTo(
        mainCan.position,
        { z: START.z },
        { z: 0, duration: 2.0, ease: "power2.out" },
        0,
      );

      timeline.fromTo(
        mainCan.rotation,
        { y: -1.6 },
        { y: Math.PI * 2 + 0.08, duration: 2.0, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        mainCan.rotation,
        { x: 0.5 },
        { x: 0, duration: 1.8, ease: "power2.out" },
        0,
      );
      timeline.fromTo(
        mainCan.rotation,
        { z: 0.35 },
        { z: 0, duration: 1.8, ease: "power2.out" },
        0,
      );

      timeline.fromTo(
        mainCan.scale,
        { x: CAN_SCALE * 0.6, y: CAN_SCALE * 0.6, z: CAN_SCALE * 0.6 },
        { x: CAN_SCALE, y: CAN_SCALE, z: CAN_SCALE, duration: 2.0, ease: "power2.out" },
        0,
      );

      timeline.to(
        mainCan.scale,
        {
          x: CAN_SCALE * 1.12,
          y: CAN_SCALE * 0.9,
          z: CAN_SCALE * 1.12,
          duration: 0.15,
          ease: "power2.out",
        },
        PHASES.impact,
      );
      timeline.to(
        mainCan.scale,
        {
          x: CAN_SCALE,
          y: CAN_SCALE,
          z: CAN_SCALE,
          duration: 0.55,
          ease: "elastic.out(1, 0.5)",
        },
        PHASES.impact + 0.15,
      );
      timeline.to(
        mainCan.position,
        { y: -0.12, duration: 0.15, ease: "power2.out" },
        PHASES.impact,
      );
      timeline.to(
        mainCan.position,
        { y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" },
        PHASES.impact + 0.15,
      );

      timeline.to(
        camera.position,
        {
          keyframes: [
            { x: 0.06, y: -0.04, duration: 0.05 },
            { x: -0.05, y: 0.03, duration: 0.05 },
            { x: 0.03, y: -0.02, duration: 0.05 },
            { x: 0, y: 0, duration: 0.05 },
          ],
        },
        PHASES.impact,
      );

      timeline.fromTo(
        ring.scale,
        { x: 0.2, y: 0.2, z: 0.2 },
        { x: 6, y: 6, z: 6, duration: 0.8, ease: "power3.out" },
        PHASES.impact,
      );
      timeline.to(
        ringMaterial,
        {
          keyframes: [
            { opacity: 0.5, duration: 0.08 },
            { opacity: 0, duration: 0.72, ease: "power2.out" },
          ],
        },
        PHASES.impact,
      );

      if (cloneGroup) timeline.set(cloneGroup, { visible: true }, PHASES.burst);
      timeline.set(mainCan, { visible: false }, PHASES.burst);

      cloneItems.forEach((item, i) => {
        if (!item) return;
        const target = targets[i];
        const delay = i * 0.05;

        timeline.set(
          item.scale,
          { x: CLONE_SCALE, y: CLONE_SCALE, z: CLONE_SCALE },
          PHASES.burst,
        );
        timeline.fromTo(
          item.position,
          { x: 0, y: 0, z: 0 },
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
            duration: 1.8,
            ease: "power2.out",
          },
          PHASES.burst + delay,
        );
        timeline.fromTo(
          item.rotation,
          { x: -Math.PI / 2, y: 0, z: 0 },
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
            duration: 2.0,
            ease: "power1.out",
          },
          PHASES.burst + delay,
        );
        timeline.to(
          item.scale,
          {
            x: CLONE_SCALE * 1.06,
            y: CLONE_SCALE * 1.06,
            z: CLONE_SCALE * 1.06,
            duration: 0.15,
            ease: "power2.in",
          },
          PHASES.burst + delay + 1.5,
        );
        timeline.to(
          item.scale,
          {
            x: CLONE_SCALE,
            y: CLONE_SCALE,
            z: CLONE_SCALE,
            duration: 0.4,
            ease: "elastic.out(1, 0.5)",
          },
          PHASES.burst + delay + 1.65,
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [timeline] },
  );

  useFrame((state) => {
    const clones = clonesRef.current;
    if (!timeline || !clones) return;
    const t = timeline.time();
    clones.items.forEach((item, i) => {
      if (!item) return;
      const release = PHASES.burst + i * 0.05 + 1.8;
      if (t > release) {
        const target = clones.targets[i];
        item.position.y =
          target.position.y +
          Math.sin(state.clock.elapsedTime * (0.8 + i * 0.13) + i * 1.7) * 0.05;
      }
    });
  });

  return (
    <>
      <Backdrop />
      <Lights />
      <MainCan ref={mainCanRef} />
      <ClonedCans ref={clonesRef} />
      <ShockRing ref={ringRef} />
      <Effects />
    </>
  );
}
```

Notas de intenção (não "corrigir" na implementação):
- O retorno elástico do bump (~2.85) e o ShockRing (~2.95) atravessam `burst` (2.7) de propósito — a lata principal já está invisível e o anel é independente.
- O bob por `useFrame` só ativa por clone quando `timeline.time()` passa do fim do tween de posição daquele clone (`burst + i*0.05 + 1.8`).
- A opacidade do ShockRing usa `to` com keyframes (não `fromTo`) para o material permanecer em 0 antes do impacto em qualquer direção de scrub.
- No frame do swap, a lata principal termina o giro em `2π + 0.08` e os clones nascem com `rotation.y = 0` (~4.6° de diferença no rótulo). Se a Task 10 mostrar o swap "estalando", trocar o alvo do giro de entrada para exatamente `Math.PI * 2` é a correção barata.

- [ ] **Step 5: Deletar `src/components/RingAccent.tsx`**

Run: `git rm src/components/RingAccent.tsx`
Expected: removido; nada mais o importa

- [ ] **Step 6: Typecheck + build**

Run: `npx tsc --noEmit`
Expected: sem erros
Run: `npm run build`
Expected: build passa

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: pinned hero section with shared master timeline and refined can choreography"
```

### Task 9: OverlayType — logo + lettering com SplitText

**Files:**
- Rewrite: `src/components/OverlayType.tsx` (substitui o stub)

- [ ] **Step 1: Reescrever `src/components/OverlayType.tsx` (conteúdo completo)**

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { PHASES } from "@/lib/phases";

gsap.registerPlugin(useGSAP, SplitText);

interface OverlayTypeProps {
  timeline: gsap.core.Timeline | null;
}

export default function OverlayType({ timeline }: OverlayTypeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const letteringRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const logo = logoRef.current;
      const lettering = letteringRef.current;
      if (!timeline || !logo || !lettering) return;

      const split = SplitText.create(lettering, {
        type: "chars",
        mask: "chars",
      });
      gsap.set(lettering, { visibility: "visible" });

      timeline.fromTo(
        logo,
        { opacity: 0, scale: 0.85, filter: "blur(12px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        PHASES.reveal,
      );
      timeline.fromTo(
        split.chars,
        { yPercent: 120 },
        { yPercent: 0, duration: 0.6, stagger: 0.035, ease: "power4.out" },
        PHASES.reveal + 0.4,
      );

      return () => {
        split.revert();
      };
    },
    { scope: rootRef, dependencies: [timeline] },
  );

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
      }}
    >
      <div style={{ filter: "drop-shadow(0 0 28px rgba(170, 200, 255, 0.22))" }}>
        <img
          ref={logoRef}
          src="/redbull-logo.svg"
          alt="Red Bull"
          style={{
            width: "clamp(180px, 26vw, 380px)",
            display: "block",
            opacity: 0,
          }}
        />
      </div>
      <h1
        ref={letteringRef}
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 400,
          textTransform: "uppercase",
          fontSize: "clamp(2.5rem, 8vw, 7rem)",
          letterSpacing: "-0.01em",
          lineHeight: 1.05,
          textAlign: "center",
          color: "#f4f4f6",
          textShadow: "0 0 32px rgba(160, 190, 255, 0.18)",
          visibility: "hidden",
        }}
      >
        Red Bull te dá asas.
      </h1>
    </div>
  );
}
```

Notas:
- O glow do logo fica num wrapper para não conflitar com o tween de `filter: blur()` do `<img>`.
- `visibility: hidden` inline no `h1` evita flash pré-hidratação; o `gsap.set` libera após o split (os chars já estão em `yPercent: 120` dentro das máscaras pelo `fromTo`).
- O warning de lint `@next/next/no-img-element` é aceitável (SVG estático em `public/`, sem ganho com `next/image`).
- O split pode rodar antes da Anton terminar de carregar (next/font usa swap); split por chars tolera reflow, então o risco é baixo. Se as métricas saírem erradas nos screenshots da Task 10, fazer o split após `document.fonts.ready`.

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit`
Expected: sem erros
Run: `npm run build`
Expected: build passa (warnings de lint sobre `<img>` são aceitáveis)

- [ ] **Step 3: Commit**

```bash
git add src/components/OverlayType.tsx
git commit -m "feat: logo and lettering reveal with SplitText masked chars"
```

### Task 10: Verificação visual end-to-end

**Files:**
- Nenhum arquivo de produto (screenshots no scratchpad)

Referência: skill example-skills:webapp-testing (Playwright).

- [ ] **Step 1: Subir o dev server em background**

Run: `npm run dev` (background)
Expected: pronto em `http://localhost:3000`

- [ ] **Step 2: Screenshots nos pontos-chave via Playwright**

Escrever script Playwright no scratchpad que:
1. Abre `http://localhost:3000` em viewport 1600×900, coleta erros de console.
2. Para cada progresso `p` em `[0, 0.29, 0.36, 0.45, 0.62, 0.75, 0.98]`: `window.scrollTo(0, p * 5 * window.innerHeight)`, espera ~1.5s (scrub 1), tira screenshot.
3. Scrolla até `6 * innerHeight` (fim do documento) + espera + screenshot (placeholder "Próxima seção" preenchendo a viewport, pin solto).

Expected por screenshot:
- `p=0`: fundo azul-noite escuro sem banding, lata pequena entrando do canto inferior esquerdo, reflexo no piso.
- `p=0.29`: lata central grande, levemente squashed ou anel de choque visível.
- `p=0.36`: instante do swap (t≈2.7) — deve parecer UMA lata central intacta, sem pop/estalo visível.
- `p=0.45`: latas espalhando para os lados, centro esvaziando.
- `p=0.62`: 8 latas assentadas simétricas + logo aparecendo no centro (blur saindo).
- `p=0.75`: logo nítido + lettering "RED BULL TE DÁ ASAS." revelado ou revelando.
- `p=0.98`: composição final completa e estável.
- Pós-hero: seção "Próxima seção" na tela.

- [ ] **Step 3: Validar console**

Expected: zero erros de console (Three/GSAP/React). Warnings conhecidos aceitáveis: lint `no-img-element`.

- [ ] **Step 4: Calibração visual (se necessário)**

Se algum screenshot revelar problema (banding, reflexo forte/fraco demais, DOF exagerado, composição desequilibrada, timing ruim), ajustar SOMENTE os valores numéricos indicados como calibráveis (reflector, DOF, intensidades de luz, posições de target) e repetir os screenshots do ponto afetado.

- [ ] **Step 5: Derrubar o dev server e commit final**

```bash
git add -A
git commit -m "chore: visual calibration after end-to-end verification"
```

(Se não houve calibração, pular o commit.)
