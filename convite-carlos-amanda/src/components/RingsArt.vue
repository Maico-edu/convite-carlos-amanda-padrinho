<script setup>
// Ilustração própria (SVG): alianças douradas sobre uma fita de cetim, com gipsófila.
// [x, y, raio] de cada florzinha
const sprigs = [
  [12, 22, 3], [24, 28, 3.4], [31, 36, 3], [40, 40, 3.6], [47, 48, 3], [55, 53, 3.4],
  [62, 62, 3.6], [70, 68, 3], [76, 78, 3.4], [83, 85, 3.8], [88, 96, 3.2], [95, 90, 3.4],
  [68, 52, 3.2], [44, 28, 3], [58, 38, 3.4],
  [34, 6, 3], [50, 12, 3.4], [60, 22, 3], [74, 20, 3.6], [88, 27, 3.2], [100, 26, 3.6],
  [112, 30, 3], [126, 30, 3.4], [96, 36, 3]
]
</script>

<template>
  <svg
    class="rings-art"
    viewBox="0 0 360 210"
    role="img"
    aria-label="Duas alianças douradas sobre uma fita de cetim"
  >
    <defs>
      <linearGradient id="ra-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fffdf7" />
        <stop offset="1" stop-color="#f0e6cd" />
      </linearGradient>
      <linearGradient id="ra-ribbon" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset=".55" stop-color="#f6eedb" />
        <stop offset="1" stop-color="#e8dab6" />
      </linearGradient>
      <linearGradient id="ra-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f5df9f" />
        <stop offset=".5" stop-color="#c39a45" />
        <stop offset="1" stop-color="#8a6a24" />
      </linearGradient>
      <linearGradient id="ra-gold-b" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f5df9f" />
        <stop offset=".5" stop-color="#c8a04a" />
        <stop offset="1" stop-color="#94722a" />
      </linearGradient>
      <filter id="ra-blur" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
      <clipPath id="ra-round"><rect width="360" height="210" rx="22" /></clipPath>
      <clipPath id="ra-weave"><circle cx="187.6" cy="132.8" r="13" /></clipPath>
    </defs>

    <g clip-path="url(#ra-round)">
      <rect width="360" height="210" fill="url(#ra-bg)" />

      <!-- fita de cetim -->
      <path
        d="M-10 168 C 60 132, 118 176, 190 150 S 310 96, 372 118 L 372 150 C 312 132, 250 182, 186 192 S 60 212, -10 200 Z"
        fill="url(#ra-ribbon)"
        opacity=".92"
      />
      <path
        d="M-10 172 C 60 138, 118 180, 190 155 S 310 101, 372 123"
        fill="none"
        stroke="#fff"
        stroke-width="1.3"
        opacity=".75"
      />
      <path d="M300 -10 C 292 40, 330 70, 372 64 L 372 -10 Z" fill="url(#ra-ribbon)" opacity=".6" />

      <!-- gipsófila -->
      <g fill="none" stroke="#9c9a66" stroke-width="1" stroke-linecap="round" opacity=".7">
        <path d="M-4 20 C 30 30, 56 52, 88 96" />
        <path d="M12 -4 C 40 12, 78 24, 126 30" />
      </g>
      <g>
        <g v-for="(s, i) in sprigs" :key="i">
          <circle :cx="s[0]" :cy="s[1]" :r="s[2]" fill="#fffdf8" stroke="#cdb77f" stroke-width=".7" />
          <circle :cx="s[0]" :cy="s[1]" r=".9" fill="#c39a45" opacity=".6" />
        </g>
      </g>

      <!-- sombra das alianças -->
      <ellipse cx="180" cy="146" rx="62" ry="9" fill="#8a6a24" opacity=".28" filter="url(#ra-blur)" />

      <!-- alianças -->
      <g class="rings">
        <g>
          <circle cx="158" cy="116" r="34" fill="none" stroke="url(#ra-gold)" stroke-width="8" />
          <circle cx="158" cy="116" r="30" fill="none" stroke="#8a6a24" stroke-width=".8" opacity=".35" />
          <circle
            cx="158" cy="116" r="34" fill="none" stroke="#fff8de" stroke-width="1.6"
            stroke-linecap="round" stroke-dasharray="64 200" opacity=".6"
            transform="rotate(-165 158 116)"
          />
        </g>
        <g>
          <circle cx="202" cy="102" r="34" fill="none" stroke="url(#ra-gold-b)" stroke-width="8" />
          <circle cx="202" cy="102" r="30" fill="none" stroke="#8a6a24" stroke-width=".8" opacity=".35" />
          <circle
            cx="202" cy="102" r="34" fill="none" stroke="#fff8de" stroke-width="1.6"
            stroke-linecap="round" stroke-dasharray="64 200" opacity=".6"
            transform="rotate(-150 202 102)"
          />
        </g>
        <!-- a primeira aliança passa por cima da segunda neste ponto: efeito de elos -->
        <g clip-path="url(#ra-weave)">
          <circle cx="158" cy="116" r="34" fill="none" stroke="url(#ra-gold)" stroke-width="8" />
          <circle cx="158" cy="116" r="30" fill="none" stroke="#8a6a24" stroke-width=".8" opacity=".35" />
        </g>
      </g>

      <!-- brilhos -->
      <path
        class="spark"
        d="M246 56 L248.4 65.6 L258 68 L248.4 70.4 L246 80 L243.6 70.4 L234 68 L243.6 65.6 Z"
        fill="#d9bd78"
      />
      <path
        class="spark s2"
        d="M120 78 L121.6 84.4 L128 86 L121.6 87.6 L120 94 L118.4 87.6 L112 86 L118.4 84.4 Z"
        fill="#d9bd78"
      />
    </g>
    <rect x=".5" y=".5" width="359" height="209" rx="21.5" fill="none" stroke="#d9bd78" stroke-opacity=".7" />
  </svg>
</template>

<style scoped>
.rings-art {
  display: block;
  width: 100%;
  height: auto;
}
.rings {
  animation: float 6s ease-in-out infinite;
}
.spark {
  animation: twinkle 3.4s ease-in-out infinite;
}
.s2 {
  animation-delay: 1.6s;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 0.95; }
}
</style>
