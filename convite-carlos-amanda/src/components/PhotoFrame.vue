<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: 'Foto dos noivos' },
  label: { type: String, default: 'Sua foto aqui' },
  ratio: { type: String, default: '4 / 5' }
})

const failed = ref(false)
watch(() => props.src, () => (failed.value = false))

// Respeita a pasta base do site (funciona em subpastas)
function resolve(path) {
  if (/^(https?:)?\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
</script>

<template>
  <figure class="frame">
    <div class="inner">
      <!-- Foto real: altura automática, nunca é cortada -->
      <img
        v-if="src && !failed"
        :src="resolve(src)"
        :alt="alt"
        loading="lazy"
        @error="failed = true"
      />
      <!-- Espaço reservado quando não há foto -->
      <div v-else class="placeholder" :style="{ aspectRatio: ratio }">
        <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
          <path
            d="M24 40 C 8 28, 6 16, 14 11 C 19 8, 23 11, 24 15 C 25 11, 29 8, 34 11 C 42 16, 40 28, 24 40 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
          />
        </svg>
        <span>{{ label }}</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.frame {
  margin: 0;
  padding: 8px;
  background: var(--white);
  border: 1px solid var(--gold-light);
  border-radius: 6px;
  box-shadow: 0 10px 28px rgba(138, 106, 36, 0.14);
}
.inner {
  position: relative;
  border: 1px solid var(--gold);
  border-radius: 3px;
  padding: 5px;
  background: var(--ivory);
}
.inner::before,
.inner::after {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--gold);
  pointer-events: none;
}
.inner::before {
  top: -5px;
  left: -5px;
  border-right: 0;
  border-bottom: 0;
  border-top-left-radius: 8px;
}
.inner::after {
  bottom: -5px;
  right: -5px;
  border-left: 0;
  border-top: 0;
  border-bottom-right-radius: 8px;
}
img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 2px;
}
.placeholder {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--gold);
  background: repeating-linear-gradient(45deg, #fbf7ea, #fbf7ea 10px, #f6efdb 10px, #f6efdb 20px);
  font-style: italic;
  font-size: 1.05rem;
  text-align: center;
  padding: 12px;
}
</style>
