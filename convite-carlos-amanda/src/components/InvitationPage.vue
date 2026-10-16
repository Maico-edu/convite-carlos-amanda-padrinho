<script setup>
import { invite } from '../config/invite.js'
import { vReveal } from '../directives/reveal.js'
import Floral from './Floral.vue'
import Divider from './Divider.vue'
import PhotoFrame from './PhotoFrame.vue'
import FinalQuestion from './FinalQuestion.vue'

defineEmits(['back'])
</script>

<template>
  <main class="page">
    <article class="paper">
      <div class="corner tl"><Floral /></div>
      <div class="corner tr"><Floral /></div>
      <div class="corner bl"><Floral /></div>
      <div class="corner br"><Floral /></div>

      <!-- 1. Abertura: boas-vindas, nomes e frase -->
      <header class="hero">
        <p class="welcome rise" style="--d: 0.1s">{{ invite.welcome }}</p>
        <h1 class="names rise" style="--d: 0.25s">
          {{ invite.groom }} <span class="amp">&amp;</span> {{ invite.bride }}
        </h1>
        <p class="headline rise" style="--d: 0.4s">{{ invite.headline }}</p>
        <p class="tagline rise" style="--d: 0.55s">{{ invite.tagline }}</p>
      </header>

      <Divider />

      <!-- 2. Foto principal + galeria -->
      <section class="photos reveal" v-reveal aria-label="Fotos dos noivos">
        <div class="main-photo">
          <PhotoFrame
            :src="invite.photos.main"
            alt="Carlos e Amanda"
            label="Foto principal do casal"
            ratio="4 / 5"
          />
        </div>
        <div class="gallery" v-if="invite.photos.gallery.length">
          <PhotoFrame
            v-for="(photo, i) in invite.photos.gallery"
            :key="i"
            :src="photo"
            :alt="`Carlos e Amanda — foto ${i + 2}`"
            :label="`Foto ${i + 2}`"
            ratio="1 / 1"
          />
        </div>
      </section>

      <Divider />

      <!-- 3. A carta -->
      <section class="letter" aria-labelledby="letter-title">
        <h2 id="letter-title" class="letter-title reveal" v-reveal>{{ invite.letter.title }}</h2>
        <p
          v-for="(p, i) in invite.letter.paragraphs"
          :key="i"
          class="reveal"
          v-reveal
          :class="{ solo: !p.text }"
        >
          <template v-if="p.text">{{ p.text }}</template>
          <strong v-if="p.highlight" class="accent">{{ p.highlight }}</strong>
        </p>
        <div class="signoff reveal" v-reveal>
          <span class="with-love">{{ invite.letter.signoff }}</span>
          <span class="sign">{{ invite.groom }} &amp; {{ invite.bride }}</span>
        </div>
      </section>

      <!-- 4. Data e local -->
      <template v-if="invite.showEvents">
        <Divider />
        <section class="events-wrap reveal" v-reveal aria-labelledby="events-title">
          <h2 id="events-title" class="events-title">{{ invite.eventsTitle }}</h2>
          <div class="events">
            <div v-for="ev in [invite.ceremony, invite.dinner]" :key="ev.title" class="event">
              <h3>{{ ev.title }}</h3>
              <p class="strong">{{ ev.date }}</p>
              <p>{{ ev.time }}</p>
              <p class="place">{{ ev.place }}</p>
              <p class="addr">{{ ev.address }}</p>
            </div>
          </div>
        </section>
      </template>

      <Divider />

      <!-- 5. Versículo -->
      <figure class="verse reveal" v-reveal>
        <span class="quote-mark" aria-hidden="true">“</span>
        <blockquote>
          <p>{{ invite.verse.text }}</p>
        </blockquote>
        <figcaption>{{ invite.verse.reference }}</figcaption>
        <span class="verse-rule" aria-hidden="true"></span>
        <p v-if="invite.verse.note" class="verse-note">{{ invite.verse.note }}</p>
      </figure>
    </article>

    <!-- 6. A pergunta final -->
    <FinalQuestion />

    <button type="button" class="back" @click="$emit('back')">↩ Voltar ao envelope</button>
  </main>
</template>

<style scoped>
.page {
  min-height: 100dvh;
  padding: clamp(14px, 4vw, 48px) clamp(10px, 3vw, 24px) 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.paper {
  position: relative;
  width: 100%;
  max-width: 760px;
  padding: clamp(76px, 12vw, 96px) clamp(22px, 7vw, 72px) clamp(56px, 8vw, 80px);
  text-align: center;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 254, 250, 1)),
    var(--white);
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
  width: clamp(80px, 20vw, 150px);
  opacity: 0.5;
  pointer-events: none;
}
.tl { top: 0; left: 0; }
.tr { top: 0; right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0; transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1, -1); }

.paper > :not(.corner) {
  position: relative;
}

/* abertura */
.welcome {
  margin: 0 0 6px;
  font-style: italic;
  font-size: clamp(1.15rem, 3.8vw, 1.5rem);
  color: var(--gold-dark);
}

.names {
  word-spacing: 0.18em;
  margin: 0;
  font-family: var(--script);
  font-weight: 400;
  font-size: clamp(3rem, 14vw, 5.6rem);
  line-height: 1.15;
  color: var(--gold);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
}
.amp {
  font-size: 0.8em;
  color: var(--gold-light);
}

.headline {
  margin: 10px 0 0;
  font-size: clamp(1.15rem, 3.8vw, 1.45rem);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold-dark);
}
.tagline {
  margin: 14px auto 0;
  max-width: 480px;
  font-style: italic;
  font-size: clamp(1.15rem, 3.8vw, 1.4rem);
  line-height: 1.6;
}

/* fotos */
.photos {
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: center;
}
.main-photo {
  width: min(100%, 460px);
}
.gallery {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  align-items: start;
}
@media (max-width: 480px) {
  .gallery {
    gap: 8px;
  }
}

/* carta */
.letter-title {
  margin: 0 auto 28px;
  max-width: 560px;
  font-family: var(--script);
  font-weight: 400;
  font-size: clamp(2rem, 7.4vw, 2.9rem);
  line-height: 1.3;
  color: var(--gold);
}
.letter p {
  margin: 0 auto 1.3em;
  max-width: 540px;
  font-size: clamp(1.2rem, 3.9vw, 1.42rem);
  line-height: 1.75;
}
.accent {
  display: block;
  margin-top: 0.3em;
  font-style: italic;
  font-weight: 600;
  font-size: 1.12em;
  line-height: 1.5;
  color: var(--gold-dark);
}
.letter p.solo .accent {
  margin-top: 0.4em;
}
.signoff {
  margin-top: 8px;
}
.with-love {
  display: block;
  font-style: italic;
  font-size: clamp(1.15rem, 3.8vw, 1.4rem);
}
.sign {
  display: block;
  word-spacing: 0.18em;
  margin-top: 2px;
  font-family: var(--script);
  font-size: clamp(2.4rem, 9vw, 3.3rem);
  line-height: 1.2;
  color: var(--gold);
}

/* data e local */
.events-title {
  margin: 0 0 22px;
  font-size: clamp(0.95rem, 3.2vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-dark);
}
.events {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
}
@media (max-width: 600px) {
  .events {
    grid-template-columns: 1fr;
  }
}
.event h3 {
  margin: 0 0 10px;
  font-family: var(--script);
  font-weight: 400;
  font-size: clamp(2rem, 7vw, 2.6rem);
  color: var(--gold);
}
.event p {
  margin: 4px 0;
  font-size: clamp(1.1rem, 3.5vw, 1.3rem);
}
.event .strong {
  font-weight: 600;
  letter-spacing: 0.05em;
}
.event .place {
  margin-top: 10px;
  font-style: italic;
}
.event .addr {
  font-size: 1rem;
  opacity: 0.85;
}

/* versículo: uma pausa emocional, em bloco próprio */
.verse {
  position: relative;
  margin: 12px auto 0;
  max-width: 540px;
  padding: clamp(44px, 9vw, 60px) clamp(20px, 6vw, 44px) clamp(30px, 6vw, 40px);
  background: linear-gradient(180deg, #fbf6e8, #f3ead3);
  border: 1px solid var(--gold-light);
  border-radius: 4px;
  box-shadow: inset 0 0 0 6px #fbf6e8, inset 0 0 0 7px var(--gold-light);
}
.quote-mark {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--script);
  font-size: 5rem;
  line-height: 1;
  color: var(--gold-light);
  pointer-events: none;
}
.verse blockquote {
  margin: 0;
}
.verse blockquote p {
  margin: 0 0 14px;
  font-style: italic;
  font-size: clamp(1.4rem, 4.8vw, 1.8rem);
  line-height: 1.55;
}
.verse figcaption {
  color: var(--gold-dark);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.95rem;
}
.verse-rule {
  display: block;
  width: 56px;
  height: 1px;
  margin: 20px auto;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.verse-note {
  margin: 0 auto;
  max-width: 400px;
  font-size: clamp(1.1rem, 3.7vw, 1.28rem);
  line-height: 1.6;
  opacity: 0.92;
}

/* botão discreto para voltar ao envelope */
.back {
  margin-top: 36px;
  padding: 10px 22px;
  background: transparent;
  color: var(--gold-dark);
  border: 1px solid var(--gold-light);
  border-radius: 999px;
  font-style: italic;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}
.back:hover,
.back:focus-visible {
  background: var(--gold);
  color: var(--white);
  outline: none;
}

/* entrada suave: o topo aparece ao abrir o envelope; o resto, ao rolar (v-reveal) */
.rise {
  opacity: 0;
  animation: rise 0.8s ease forwards;
  animation-delay: calc(0.15s + var(--d, 0s));
}
@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: none; }
}
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  transition-delay: var(--d, 0s);
}
.reveal.in {
  opacity: 1;
  transform: none;
}
</style>
