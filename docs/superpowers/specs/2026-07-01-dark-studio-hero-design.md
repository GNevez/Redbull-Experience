# Red Bull Scroll Experience — Hero "Estúdio Escuro"

**Data:** 2026-07-01
**Status:** Aprovado pelo usuário (direção e abordagem)

> **Revisão 2026-07-02 (v3 — céu + seções 2/3):** o chão/piso foi removido por decisão do usuário — o fundo é apenas o domo gradiente ("céu") com Sparkles. Frame inicial = céu vazio (lata entra caindo de cima com o scroll). Canvas agora é FIXO global atrás de seções sticky (sem pin), orquestrado por `Experience.tsx` com 4 timelines `{ heroScrub, burst, fall, roll }`. Novas seções: S2 "queda" (latas despencam com o scroll; o clone `HERO_CLONE_INDEX` freia no centro; textos "Asas para o seu dia."), S3 "rolagem" (lata rola direita→esquerda em cartwheel — `rotation.order = "ZXY"` — revelando 3 statements, fecho vermelho). Badge fixo branco com a logo no canto superior esquerdo (`LogoBadge.tsx`). Robustez: burst usa `fromTo` explícito nos props compartilhados com o scrub e o drop termina antes de `BURST_TRIGGER`; `onReverseComplete` do burst re-renderiza o `heroScrub`; `onEnter` do `fall` força `burst.progress(1)` + `invalidate()` para scroll rápido.
>
> **Revisão 2026-07-02 (v2 — intro cinemática):** após feedback do usuário, a coreografia de entrada foi substituída. A lata não entra mais voando (parecia sair do chão); ela começa no centro em silhueta (rims apenas, hint "role para revelar") e o scroll acende o estúdio — spot superior, pool de luz no piso (`FloorPool.tsx`), turntable e dolly-in. Ao cruzar `BURST_TRIGGER` (62% do pin de 350%), a sequência bump→burst→logo→lettering toca **automaticamente em tempo real** num segundo timeline (`burst`, pausado, disparado por `onUpdate`; reverte acelerado ao voltar o scroll) — o usuário não faz mais scrub da explosão. Arquitetura: `HeroSection` cria `{ scrub, burst }` (`HeroTimelines`) e distribui por prop. Constantes em `phases.ts` (`SCRUB_DURATION`, `BURST_TRIGGER`, `BURST`). Sparkles adicionam atmosfera. As seções de coreografia abaixo descrevem a v1 e permanecem como registro histórico.

## Contexto

Projeto de exposição para a Red Bull: landing page Next.js 14 + React Three Fiber + GSAP ScrollTrigger, inspirada na landing da Spylt (https://github.com/ahmedragab15/spylt-gsap-website). Hoje existe um hero scroll-driven onde uma lata 3D entra, dá um "bump" e se multiplica em 8 clones que se espalham.

Problemas atuais:

- O fundo (`RadialHalo` em `Backdrop.tsx`) renderiza um branco estourado/bugado.
- O bump e o burst têm leitura fraca: clones nascem com `scale 0.001` e crescem com `back.out`, parecendo balões inflando em vez de uma multiplicação da lata.
- `ClonedCans.tsx` usa `Math.random()` na criação dos targets — composição diferente a cada reload e sem controle de arte.
- Não existe nada após o burst: sem lettering, sem logo, sem fechamento.
- Estrutura da página (`position: fixed` + trigger no `body`) não permite adicionar seções futuras.

## Objetivo

Hero de nível "exposição": ambientação de estúdio escuro premium, animação da lata refinada, e reveal final com a logo oficial da Red Bull + lettering "Red Bull te dá asas." no centro, com a página estruturada para receber novas seções depois do hero.

## Decisões aprovadas

1. Ambientação: **estúdio escuro premium** com piso refletivo real (`MeshReflectorMaterial`).
2. Lettering: **"Red Bull te dá asas."**
3. Logo: **SVG oficial baixado de fonte pública (Wikimedia Commons)** para `public/redbull-logo.svg`.
4. Estrutura: hero pinado que **libera a página para seções futuras** ao terminar.

## Arquitetura

### Estrutura da página

```
page.tsx (server component fino)
└── HeroSection.tsx (client)
    ├── <section> pinada — dona do ScrollTrigger master (pin: true, start: "top top", end: "+=500%", scrub: 1)
    ├── cria o master timeline GSAP e o guarda em useState (children re-renderizam quando ele existe)
    ├── <Canvas> → <Scene timeline={tl}> (3D)
    └── <OverlayType timeline={tl}> (DOM, por cima do canvas, pointer-events: none)
```

- **Um único ScrollTrigger pina e faz scrub** (criado em `HeroSection`). `Scene` e `OverlayType` recebem o timeline por **prop** (props atravessam o reconciler do R3F normalmente; context não atravessa — por isso prop) e inserem seus tweens em posições absolutas de tempo.
- Tempos de fase ficam em módulo compartilhado `src/lib/phases.ts`:

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

- Depois da `<section>` do hero, `page.tsx` renderiza um placeholder mínimo de próxima seção (uma `<section>` vazia com altura e cor de fundo coerentes) provando que o pin solta e a página continua.

### Componentes 3D (dentro do Canvas)

| Unidade | Responsabilidade | Interface |
|---|---|---|
| `Scene.tsx` | Orquestra: monta componentes e insere os tweens 3D no timeline recebido | prop `timeline: gsap.core.Timeline` |
| `Backdrop.tsx` | Gradiente radial escuro em shader com dithering + piso refletivo | sem props |
| `Lights.tsx` | Iluminação de estúdio (rim, softbox, fill, acento vermelho) | sem props |
| `MainCan.tsx` | Lata principal (inalterado na essência) | `ref: THREE.Group` |
| `ClonedCans.tsx` | 8 instâncias com targets simétricos determinísticos (array autorado, sem `Math.random`) | `ref: ClonedCansHandle` (mantido) |
| `ShockRing.tsx` | Anel de choque no piso no momento do impacto | `ref: THREE.Mesh` (Scene anima scale/opacity) |
| `Effects.tsx` | DepthOfField (mantido, retunado) + Vignette + Noise (grão) | sem props |

Removidos: `RingAccent.tsx` e código morto não importado (`Cloud.tsx`, `Sky.tsx`, `Balloons.tsx`, `EmergenceCloud.tsx`). Assets em `public/balloons/` permanecem (não fazem mal e são do usuário).

### Overlay DOM

| Unidade | Responsabilidade | Interface |
|---|---|---|
| `OverlayType.tsx` | Logo SVG central + lettering "Red Bull te dá asas."; insere tweens DOM no timeline (SplitText por caractere, máscara clip) | prop `timeline: gsap.core.Timeline` |

## Coreografia (tempos do timeline, duração total 7.5)

### Fase 1 — Entrada (0 → 2.15)

- Lata parte de `(-3.2, -3.6, -6)` e viaja em **arco** até o centro: x com `power2.inOut`, y sobe além do alvo (+0.6) e desce (`power2.out` / `power1.inOut`), z com `power2.out` — mantém a estrutura atual, com ajuste fino dos overlaps para o arco ler melhor.
- Rotação: giro completo em y (`2π + offset`) assentando; x/z zeram com `power2.out`.
- Escala: `0.6 × CAN_SCALE → CAN_SCALE`.

### Fase 2 — Bump (2.15 → 2.7)

- Antecipação já embutida no arco (a lata chega "caindo").
- Impacto: squash `x/z ×1.12, y ×0.9` em 0.15, retorno com `elastic.out(1, 0.5)` em 0.55.
- **Camera shake**: keyframes curtos em `camera.position.x/y` (amplitude ~0.06, duração 0.2, retorno a zero garantido no fim).
- **ShockRing**: anel plano no piso (`ringGeometry` fino, cor prata fria `#c8d4e6`, `meshBasicMaterial` transparente), escala 0.2 → 6 com `power3.out`, opacidade 0.5 → 0, duração 0.8.
- Nota intencional: o retorno elástico (~até 2.85) e o ShockRing (~até 2.95) atravessam o instante `burst` (2.7) — inofensivo, pois a lata principal já está invisível e o anel é independente. Não "corrigir" encurtando.

### Fase 3 — Burst (2.7 → 4.6)

- No instante `burst`: clones ficam visíveis **em escala cheia (`CLONE_SCALE`) na posição da lata principal**, e a lata principal fica invisível no mesmo frame — troca imperceptível (mesma geometria/material/escala).
- Cada clone voa para seu target com stagger `i × 0.05`: posição com `power2.out` (1.8), rotação com `power1.out` (2.0), **overshoot elástico curto na chegada** (scale `×1.06 → ×1` com `elastic.out`).
- Targets: array autorado simétrico — 4 latas à esquerda, 4 à direita, profundidades variadas (z entre 1.4 e −3.8), rotações fixas escolhidas à mão para a composição emoldurar o centro. Zero aleatoriedade.

### Fase 4 — Reveal (4.6 → 6.8)

- Logo Red Bull (DOM, centro): `opacity 0→1`, `scale 0.85→1`, `filter: blur(12px)→blur(0)`, `power3.out`, duração 1.2.
- Lettering "Red Bull te dá asas." (DOM, abaixo da logo): SplitText por caractere, cada char sobe de `yPercent: 120` dentro de máscara (`overflow: hidden` por linha), duração 0.6 por char, stagger 0.035, `power4.out`.

### Fase 5 — Hold (6.8 → 7.5)

- Nada novo entra; estado final segura até o pin soltar.
- Flutuação sutil das latas assentadas: bob senoidal por `useFrame` (amplitude ~0.05, frequências dessincronizadas por índice), **ativa por clone quando `timeline.time()` passa de `burst + i × 0.05 + 1.8`** (fim do tween de posição daquele clone), somada como offset ao y do target para não brigar com o tween.

## Ambientação (specs)

### Gradiente de fundo

- Esfera `BackSide` (raio 50) com `ShaderMaterial`: gradiente radial do centro da tela — `#0d1b2e` (centro) → `#05080f` (bordas), calculado em espaço de view direction. (O branco estourado atual vem da mistura para `#ffffff` sob tone mapping combinada ao cálculo em world position; a paleta escura + view direction + dithering resolve ambos.)
- **Dithering ordenado** no fragment (ruído hash × 1/255) para eliminar banding.
- `depthWrite: false`, `renderOrder: -2`.

### Piso refletivo

- Plano 40×40 em `y = -3.4`, `MeshReflectorMaterial`: `color #080c14`, `resolution 1024`, `blur [400, 100]`, `mixBlur 0.9`, `mixStrength ~2`, `roughness ~0.7`, `mirror 0.5`. Valores finais calibrados visualmente na implementação.
- `ContactShadows` atual é substituído pelo reflexo (o reflexo + luz baixa já ancoram a lata).

### Pós-processamento (`Effects.tsx`)

- `DepthOfField` mantido, retunado: foco no plano da lata central (worldFocusDistance ~6), `bokehScale ~2.5` — latas laterais ao fundo levemente suaves.
- `Vignette` (`offset ~0.3`, `darkness ~0.55`).
- `Noise` (grão de filme, `opacity ~0.04`, blend suave).

### Iluminação (`Lights.tsx`)

- `ambientLight` fraca (~0.25, tom frio).
- Key directional prata-quente suave de cima/direita (~1.2).
- `Environment` custom: 2 Lightformers strip verticais laterais (prata fria, intensidade alta — geram os rims no metal), softbox retangular superior, fill baixo fraco.
- Acento vermelho: Lightformer ou pointLight vermelho de baixa intensidade (~0.3) de um lado — sutil.

## Lettering + Logo (specs)

- **GSAP upgrade para ^3.13** (SplitText passou a ser gratuito). Registrar `SplitText` junto de `ScrollTrigger`/`useGSAP`.
- Fonte via `next/font/google`: **Anton** para o lettering (uppercase, `clamp(2.5rem, 8vw, 7rem)`, letter-spacing levemente negativo), cor `#f4f4f6` com `text-shadow` de glow frio sutil.
- Logo: `public/redbull-logo.svg` (baixado de Wikimedia Commons durante a implementação), renderizado via `<img>` com largura `clamp(180px, 26vw, 380px)`. O arquivo é tratado como **substituível pelo usuário** — basta trocar o SVG em `public/` pelo asset oficial da marca quando disponível.
- Overlay: `position: absolute; inset: 0` dentro da section pinada, `z-index` acima do canvas, `pointer-events: none`, conteúdo centralizado com flex.

## Estados iniciais e globais

- `globals.css`: `background: #05080f`, `color: #f4f4f6`.
- Canvas: `gl.setClearColor("#05080f")`, `dpr [1, 2]` mantido.
- Todos os elementos do reveal começam com `opacity: 0`/`visibility: hidden` via CSS inicial (sem flash antes da hidratação do GSAP).

## Tratamento de erros e edge cases

- **Logo indisponível**: se o download do SVG falhar na implementação, usar fallback tipográfico ("RED BULL" em Anton no lugar da logo) e avisar o usuário para fornecer o asset oficial.
- **Ordem de carga do GLTF**: `Scene` está sob `Suspense`; os tweens 3D só são inseridos quando o modelo resolve. Após inserção, chamar `ScrollTrigger.refresh()` para recalcular o pin.
- **Timeline ainda não criado**: `Scene`/`OverlayType` tratam `timeline` possivelmente `null` no primeiro render e só inserem tweens quando ele existir (dependência do `useGSAP`).
- **Reload no meio do scroll**: ScrollTrigger com scrub reconstitui o estado pelo progresso — os `fromTo`/`set` garantem estados determinísticos em qualquer ponto.
- **Resize**: ScrollTrigger cuida do recálculo do pin; tipografia com `clamp()`.

## Fora de escopo

- Conteúdo das seções futuras (apenas o placeholder estrutural).
- Suporte mobile dedicado (projeto de exposição/desktop; o layout não pode quebrar, mas não há coreografia alternativa).
- `prefers-reduced-motion`.
- Áudio, interação por mouse/hover.

## Verificação

1. `npm run build` sem erros.
2. `npm run dev` + Playwright: screenshots nos progressos ~0%, ~30% (bump), ~50% (burst), ~75% (reveal), 100% (hold) e após o hero (placeholder da próxima seção visível, pin solto).
3. Console do browser sem erros/warnings de Three ou GSAP.
4. Checagem visual: sem banding no gradiente, reflexo coerente, troca lata→clones imperceptível, lettering nítido.
