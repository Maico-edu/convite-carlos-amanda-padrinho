<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { invite } from '../config/invite.js'
import Floral from './Floral.vue'

const emit = defineEmits(['opened'])
const isOpen = ref(false)
let timer = null

function openEnvelope() {
  if (isOpen.value) return
  isOpen.value = true
  // aguarda a animação (aba + carta subindo) antes de trocar de tela
  timer = setTimeout(() => emit('opened'), 1500)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <main class="stage">
    <div class="corner tl"><Floral /></div>
    <div class="corner tr"><Floral /></div>
    <div class="corner bl"><Floral /></div>
    <div class="corner br"><Floral /></div>

    <button
      type="button"
      class="envelope-btn"
      :class="{ open: isOpen }"
      aria-label="Abrir o convite de Carlos e Amanda para padrinhos e madrinhas"
      @click="openEnvelope"
    >
      <div class="envelope">
        <!-- fundo interno -->
        <div class="back"></div>

        <!-- carta que sobe de dentro do envelope -->
        <div class="letter">
          <span class="letter-names">{{ invite.groom }} &amp; {{ invite.bride }}</span>
        </div>

        <!-- frente (bolso) com os nomes -->
        <div class="front-wrap">
          <div class="front"></div>
        </div>
        <div class="front-text">
          <span class="names">{{ invite.groom }} &amp; {{ invite.bride }}</span>
          <span class="invited">Vocês estão convidados!</span>
        </div>

        <!-- aba que abre -->
        <div class="flap-wrap">
          <div class="flap"></div>
        </div>

        <!-- selo de cera dourado -->
        <div class="seal" aria-hidden="true">
          <span>C&amp;A</span>
        </div>
      </div>
    </button>

    <p class="hint" :class="{ gone: isOpen }">Toque no envelope para abrir</p>
  </main>
</template>

<style scoped>
.stage {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  overflow: hidden;
}

/* ornamentos florais discretos nos cantos */
.corner {
  position: absolute;
  width: clamp(110px, 24vw, 220px);
  opacity: 0.55;
  pointer-events: none;
}
.tl { top: 0; left: 0; }
.tr { top: 0; right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1, -1); }

.envelope-btn {
  --w: min(88vw, 540px);
  position: relative;
  z-index: 2;
  width: var(--w);
  aspect-ratio: 3 / 2;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  perspective: 1400px;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.4s ease;
}
.envelope-btn:not(.open):hover {
  transform: translateY(-4px) scale(1.012);
}
.envelope-btn:focus-visible {
  outline: 2px dashed var(--gold);
  outline-offset: 8px;
}

.envelope {
  position: relative;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 22px 26px rgba(120, 90, 30, 0.22));
}

/* camadas */
.back,
.front-wrap,
.flap-wrap,
.letter {
  position: absolute;
}
.back {
  inset: 0;
  border-radius: 6px;
  background: linear-gradient(160deg, #efe5cb, #e6d9b6);
  border: 1px solid var(--gold-light);
}

/* carta */
.letter {
  left: 6%;
  width: 88%;
  top: 6%;
  height: 88%;
  z-index: 2;
  background: var(--white);
  border: 1px solid var(--gold-light);
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 9%;
  box-shadow: inset 0 0 0 5px var(--white), inset 0 0 0 6px var(--gold-light);
  transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1) 0.45s;
}
.letter-names {
  word-spacing: 0.18em;
  font-family: var(--script);
  color: var(--gold);
  font-size: clamp(1.4rem, 5.5vw, 2.2rem);
}
.open .letter {
  transform: translateY(-62%) scale(1.04);
}

/* frente do envelope: tudo menos o triângulo superior */
.front-wrap {
  inset: 0;
  z-index: 3;
  filter: drop-shadow(0 -1px 1px rgba(138, 106, 36, 0.35));
}
.front {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  clip-path: polygon(0 0, 50% 54%, 100% 0, 100% 100%, 0 100%);
  background:
    linear-gradient(160deg, rgba(255, 255, 255, 0.7), transparent 55%),
    linear-gradient(180deg, #fbf6e8, #f1e7cd);
}

/* textos na frente */
.front-text {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 9%;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.open .front-text {
  opacity: 0;
}
.names {
  word-spacing: 0.18em;
  font-family: var(--script);
  font-size: clamp(2rem, 9vw, 3.6rem);
  line-height: 1.1;
  color: var(--gold);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}
.invited {
  font-style: italic;
  letter-spacing: 0.08em;
  font-size: clamp(1rem, 3.6vw, 1.35rem);
  color: var(--gold-dark);
}

/* aba */
.flap-wrap {
  left: 0;
  top: 0;
  width: 100%;
  height: 54%;
  z-index: 5;
  transform-origin: top center;
  transition: transform 0.7s cubic-bezier(0.5, 0, 0.2, 1), z-index 0s linear 0.35s;
  filter: drop-shadow(0 3px 3px rgba(138, 106, 36, 0.3));
}
.flap {
  width: 100%;
  height: 100%;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #fffdf5, #f3e9cf);
  transition: background 0.4s ease 0.3s;
}
.open .flap-wrap {
  transform: rotateX(180deg);
  z-index: 1;
}
.open .flap {
  background: linear-gradient(0deg, #efe3c3, #e4d5ad);
}

/* selo */
.seal {
  position: absolute;
  left: 50%;
  top: 54%;
  width: clamp(46px, 13%, 70px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  z-index: 6;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 28%, #f0d98f, var(--gold) 55%, var(--gold-dark));
  box-shadow: 0 3px 8px rgba(90, 65, 10, 0.4), inset 0 0 0 3px rgba(255, 255, 255, 0.25);
  transition: opacity 0.4s ease, transform 0.5s ease;
}
.seal span {
  font-family: var(--script);
  color: #fff7dc;
  font-size: clamp(1rem, 3.4vw, 1.5rem);
  text-shadow: 0 1px 2px rgba(90, 65, 10, 0.5);
}
.open .seal {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}

/* dica abaixo do envelope */
.hint {
  position: relative;
  z-index: 2;
  margin: 34px 0 0;
  font-style: italic;
  font-size: clamp(1.05rem, 3.6vw, 1.3rem);
  letter-spacing: 0.06em;
  color: var(--gold-dark);
  animation: pulse 2.4s ease-in-out infinite;
  transition: opacity 0.4s ease;
}
.hint.gone {
  opacity: 0;
  animation: none;
}
@keyframes pulse {
  0%, 100% { opacity: 0.55; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}
</style>
