<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { invite } from '../config/invite.js'
import { buildWhatsAppUrl } from '../utils/whatsapp.js'
import { restLayout, centeredYes, fullRegion, visibleRegion, pickSpot, overlaps } from '../utils/escape.js'
import { vReveal } from '../directives/reveal.js'
import Floral from './Floral.vue'
import RingsArt from './RingsArt.vue'

const q = invite.question
const whatsappUrl = computed(() => buildWhatsAppUrl(invite.whatsapp.number, invite.whatsapp.message))

// Imagem da pergunta (respeita a pasta base do site, como o PhotoFrame)
const imageFailed = ref(false)
const imageUrl = computed(() => import.meta.env.BASE_URL + String(q.image || '').replace(/^\/+/, ''))

const EDGE = 8 // margem mínima até a borda da arena
const GAP = 14 // espaço entre os botões lado a lado
const PROXIMITY = 64 // distância (mouse) em que o "Não" já foge
const COOLDOWN = 170 // ms mínimos entre uma fuga e outra

const arena = ref(null)
const yesSlot = ref(null)
const noSlot = ref(null)

const yes = ref({ x: 0, y: 0 })
const no = ref({ x: 0, y: 0 })
const ready = ref(false)
const fled = ref(false)
const attempts = ref(0)
const message = ref('')
const accepted = ref(false)

let lastFlee = 0
let messageTimer = 0
let resizeObserver = null

function measure() {
  const a = arena.value
  const s = yesSlot.value
  const n = noSlot.value
  if (!a || !s || !n) return null
  return {
    W: a.clientWidth,
    H: a.clientHeight,
    sw: s.offsetWidth,
    sh: s.offsetHeight,
    nw: n.offsetWidth,
    nh: n.offsetHeight
  }
}

// Posiciona (ou reposiciona, se a tela mudar de tamanho) os dois botões
function layout() {
  const m = measure()
  if (!m || !m.W) return
  if (!fled.value) {
    const rest = restLayout(m, { edge: EDGE, gap: GAP })
    yes.value = rest.yes
    no.value = rest.no
    return
  }
  const yesPos = centeredYes(m)
  yes.value = yesPos
  const region = fullRegion({ arena: { w: m.W, h: m.H }, button: { w: m.nw, h: m.nh }, edge: EDGE })
  const x = Math.min(Math.max(no.value.x, region.minX), region.maxX)
  const y = Math.min(Math.max(no.value.y, region.minY), region.maxY)
  const noRect = { x, y, w: m.nw, h: m.nh }
  const yesRect = { x: yesPos.x, y: yesPos.y, w: m.sw, h: m.sh }
  no.value = overlaps(noRect, yesRect, 6)
    ? pickSpot({
        regions: [region],
        button: { w: m.nw, h: m.nh },
        obstacle: yesRect,
        from: { x, y }
      })
    : { x, y }
}

function getViewport() {
  const vv = window.visualViewport
  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      right: vv.offsetLeft + vv.width,
      bottom: vv.offsetTop + vv.height
    }
  }
  return {
    left: 0,
    top: 0,
    right: document.documentElement.clientWidth,
    bottom: window.innerHeight
  }
}

function maybeSay() {
  const list = q.escapeMessages
  const n = attempts.value
  // só de vez em quando: na 2ª tentativa e depois a cada 3
  if (!list?.length || n < 2 || (n - 2) % 3 !== 0) return
  message.value = list[Math.floor((n - 2) / 3) % list.length]
  clearTimeout(messageTimer)
  messageTimer = setTimeout(() => (message.value = ''), 3200)
}

// Faz o "Não" fugir. `e` é o evento de ponteiro (null quando vem do teclado).
function flee(e) {
  const m = measure()
  if (!m) return
  lastFlee = performance.now()
  fled.value = true

  // o "Sim" vai para o centro e o "Não" escolhe um lugar longe dele
  const yesPos = centeredYes(m)
  yes.value = yesPos

  const rect = arena.value.getBoundingClientRect()
  const arenaSize = { w: m.W, h: m.H }
  const button = { w: m.nw, h: m.nh }
  const pointer = e ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : null

  no.value = pickSpot({
    regions: [
      visibleRegion({ arenaRect: rect, viewport: getViewport(), arena: arenaSize, button, edge: EDGE }),
      fullRegion({ arena: arenaSize, button, edge: EDGE })
    ],
    button,
    obstacle: { x: yesPos.x, y: yesPos.y, w: m.sw, h: m.sh },
    from: no.value,
    pointer
  })

  attempts.value += 1
  maybeSay()
}

// Computador: foge quando o cursor chega perto
function onArenaMove(e) {
  if (e.pointerType === 'touch') return
  if (performance.now() - lastFlee < COOLDOWN) return
  const r = noSlot.value?.getBoundingClientRect()
  if (!r) return
  const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right)
  const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom)
  if (Math.hypot(dx, dy) < PROXIMITY) flee(e)
}

// Celular (toque) e qualquer clique: foge no momento em que o dedo encosta
function onNoDown(e) {
  flee(e)
}

// Teclado (Enter/Espaço) ou clique que escapou do pointerdown
function onNoClick() {
  if (performance.now() - lastFlee < 400) return
  flee(null)
}

function onYes() {
  accepted.value = true
  message.value = ''
}

onMounted(() => {
  layout()
  // só liga as transições depois do primeiro posicionamento
  requestAnimationFrame(() => (ready.value = true))

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(layout)
    ;[arena.value, yesSlot.value, noSlot.value].forEach((el) => el && resizeObserver.observe(el))
  } else {
    window.addEventListener('resize', layout)
  }
  // as fontes mudam a largura dos botões quando terminam de carregar
  document.fonts?.ready.then(layout)
})

onBeforeUnmount(() => {
  clearTimeout(messageTimer)
  resizeObserver?.disconnect()
  window.removeEventListener('resize', layout)
})

const slotStyle = (p) => ({ transform: `translate3d(${p.x}px, ${p.y}px, 0)` })
</script>

<template>
  <section class="final reveal" v-reveal aria-labelledby="final-question">
    <div class="corner tl"><Floral /></div>
    <div class="corner tr"><Floral /></div>

    <p class="eyebrow">{{ q.eyebrow }}</p>
    <p class="intro">{{ q.intro }}</p>

    <!-- Imagem definida em invite.js (question.image). Sem imagem, usa a ilustração. -->
    <div class="art">
      <img
        v-if="q.image && !imageFailed"
        class="art-img"
        :src="imageUrl"
        :alt="q.imageAlt"
        width="688"
        height="402"
        loading="lazy"
        @error="imageFailed = true"
      />
      <RingsArt v-else />
    </div>

    <h2 id="final-question" class="question">{{ q.text }}</h2>
    <p class="sub">{{ q.subtext }}</p>

    <!-- área onde o "Não" pode fugir -->
    <div ref="arena" class="arena" :class="{ ready }" @pointermove="onArenaMove">
      <div ref="yesSlot" class="slot slot-yes" :style="slotStyle(yes)">
        <a
          class="btn btn-yes"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="onYes"
        >
          {{ q.yes }}
        </a>
      </div>
      <div ref="noSlot" class="slot slot-no" :style="slotStyle(no)">
        <button
          type="button"
          class="btn btn-no"
          @pointerdown.prevent="onNoDown"
          @click.prevent="onNoClick"
        >
          {{ q.no }}
        </button>
      </div>
    </div>

    <!-- espaço reservado: o texto aparece sem empurrar o layout -->
    <div class="status" role="status" aria-live="polite">
      <p v-if="accepted" class="thanks">
        {{ q.accepted }}
        <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer">{{ q.fallback }}</a>
      </p>
      <Transition name="whisper" mode="out-in">
        <p v-if="message && !accepted" :key="message" class="whisper">{{ message }}</p>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.final {
  position: relative;
  width: 100%;
  max-width: 620px;
  margin: 64px auto 0;
  padding: clamp(64px, 11vw, 76px) clamp(18px, 6vw, 56px) clamp(28px, 5vw, 44px);
  text-align: center;
  background: linear-gradient(180deg, #fffdf6, #f7efd9);
  border: 1px solid var(--gold-light);
  border-radius: 6px;
  box-shadow:
    0 0 0 8px var(--white),
    0 0 0 9px var(--gold-light),
    0 24px 60px rgba(120, 90, 30, 0.2);
  overflow: hidden;
}

.corner {
  position: absolute;
  top: 0;
  width: clamp(70px, 18vw, 120px);
  opacity: 0.45;
  pointer-events: none;
}
.tl { left: 0; }
.tr { right: 0; transform: scaleX(-1); }

.final > :not(.corner) {
  position: relative;
}

.eyebrow {
  margin: 0;
  font-size: clamp(0.82rem, 2.8vw, 0.95rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-dark);
}

.intro {
  margin: 10px 0 22px;
  font-family: var(--script);
  font-size: clamp(2.1rem, 8.4vw, 3rem);
  line-height: 1.2;
  color: var(--gold);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
}

.art {
  width: min(100%, 340px);
  margin: 0 auto 26px;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--gold-light);
  box-shadow: 0 14px 30px rgba(138, 106, 36, 0.18);
}
.art-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 688 / 402;
  object-fit: cover;
}

.question {
  margin: 0 auto;
  max-width: 460px;
  font-size: clamp(1.7rem, 6.4vw, 2.35rem);
  font-weight: 600;
  line-height: 1.22;
  color: var(--gold-dark);
}

.sub {
  margin: 14px auto 0;
  max-width: 400px;
  font-size: clamp(1.15rem, 4vw, 1.35rem);
  line-height: 1.55;
}

/* arena: o "Não" só anda aqui dentro */
.arena {
  position: relative;
  width: 100%;
  height: 240px;
  margin-top: 8px;
  touch-action: manipulation;
}
@media (min-width: 600px) {
  .arena {
    height: 250px;
  }
}

.slot {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  will-change: transform;
}
.arena.ready .slot {
  transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
}
.slot-yes { z-index: 1; }
.slot-no { z-index: 2; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35em;
  min-height: 56px;
  padding: 0 clamp(22px, 7vw, 34px);
  border-radius: 999px;
  font-family: var(--serif);
  font-size: clamp(1.2rem, 4.6vw, 1.4rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow 0.3s ease, filter 0.3s ease, background 0.3s ease, transform 0.15s ease;
}
.btn:focus-visible {
  outline: 2px dashed var(--gold-dark);
  outline-offset: 4px;
}

.btn-yes {
  color: #fffdf5;
  border: 0;
  background: linear-gradient(180deg, #ad8631, #8a6a24);
  box-shadow: 0 8px 20px rgba(138, 106, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  animation: glow 3.2s ease-in-out infinite;
}
.btn-yes:active {
  transform: scale(0.97);
}
@media (hover: hover) {
  .btn-yes:hover {
    filter: brightness(1.07);
    box-shadow: 0 10px 26px rgba(138, 106, 36, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.28);
  }
}

.btn-no {
  color: #6f541b;
  background: #efe6d1;
  border: 1px solid rgba(184, 146, 63, 0.4);
  box-shadow: 0 4px 12px rgba(138, 106, 36, 0.12);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
@media (hover: hover) {
  .btn-no:hover {
    background: #e8dcc0;
  }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 8px 20px rgba(138, 106, 36, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28); }
  50% { box-shadow: 0 8px 28px rgba(184, 146, 63, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.28); }
}

/* mensagens leves */
.status {
  position: relative;
  min-height: 3.6em;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.whisper,
.thanks {
  margin: 0;
  font-style: italic;
  font-size: clamp(1.1rem, 3.8vw, 1.3rem);
  line-height: 1.45;
  color: var(--gold-dark);
}
.whisper {
  position: absolute;
}
.thanks a {
  display: inline-block;
  margin-left: 4px;
  color: var(--gold-dark);
  text-underline-offset: 3px;
}
.whisper-enter-active,
.whisper-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.whisper-enter-from,
.whisper-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* entrada ao rolar a página */
.reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.9s ease, transform 0.9s ease;
}
.reveal.in {
  opacity: 1;
  transform: none;
}
</style>
