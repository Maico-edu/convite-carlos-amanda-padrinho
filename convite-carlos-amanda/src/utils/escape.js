// Geometria do botão "Não" fujão.
// Todas as coordenadas são relativas à "arena" (a área onde os botões podem andar)
// e representam o canto superior esquerdo de cada retângulo.

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by)

export function overlaps(a, b, pad = 0) {
  return (
    a.x < b.x + b.w + pad &&
    a.x + a.w > b.x - pad &&
    a.y < b.y + b.h + pad &&
    a.y + a.h > b.y - pad
  )
}

// Posição de descanso: "Sim" e "Não" lado a lado, centralizados na arena.
// Em telas muito estreitas, um embaixo do outro.
export function restLayout({ W, H, sw, sh, nw, nh }, { edge = 8, gap = 14 } = {}) {
  const total = sw + gap + nw
  if (total <= W - 2 * edge) {
    const x0 = (W - total) / 2
    return {
      yes: { x: x0, y: (H - sh) / 2 },
      no: { x: x0 + sw + gap, y: (H - nh) / 2 }
    }
  }
  const y0 = (H - (sh + gap + nh)) / 2
  return {
    yes: { x: (W - sw) / 2, y: y0 },
    no: { x: (W - nw) / 2, y: y0 + sh + gap }
  }
}

// Depois que o "Não" foge pela primeira vez, o "Sim" fica no centro.
export function centeredYes({ W, H, sw, sh }) {
  return { x: (W - sw) / 2, y: (H - sh) / 2 }
}

// Região onde o canto do botão pode ficar, dentro da arena e com margem.
export function fullRegion({ arena, button, edge = 8 }) {
  return {
    minX: edge,
    minY: edge,
    maxX: Math.max(edge, arena.w - button.w - edge),
    maxY: Math.max(edge, arena.h - button.h - edge)
  }
}

// Mesma região, mas limitada ao que está visível na tela agora.
// Retorna null se a parte visível for pequena demais para o botão.
export function visibleRegion({ arenaRect, viewport, arena, button, edge = 8 }) {
  const minX = Math.max(edge, viewport.left - arenaRect.left + edge)
  const minY = Math.max(edge, viewport.top - arenaRect.top + edge)
  const maxX = Math.min(arena.w - button.w - edge, viewport.right - arenaRect.left - button.w - edge)
  const maxY = Math.min(arena.h - button.h - edge, viewport.bottom - arenaRect.top - button.h - edge)
  if (maxX < minX || maxY < minY) return null
  return { minX, minY, maxX, maxY }
}

function axis(min, max, step) {
  if (max <= min) return [min]
  const n = Math.max(1, Math.ceil((max - min) / step))
  return Array.from({ length: n + 1 }, (_, i) => min + ((max - min) * i) / n)
}

// Escolhe para onde o "Não" vai fugir.
// - nunca encosta no "Sim" (obstacle) e nunca sai das regiões permitidas;
// - prefere lugares longe do ponteiro e diferentes do lugar atual;
// - tem um pouco de sorte no meio, para não repetir sempre o mesmo canto.
export function pickSpot({ regions, button, obstacle, from, pointer = null, rng = Math.random }) {
  const fromCenter = { x: from.x + button.w / 2, y: from.y + button.h / 2 }

  // do mais exigente ao mais flexível, caso a arena seja pequena
  const tiers = [
    { pad: 14, travel: 70, away: 90 },
    { pad: 10, travel: 30, away: 40 },
    { pad: 4, travel: 0, away: 0 },
    { pad: 0, travel: 0, away: 0 }
  ]

  for (const tier of tiers) {
    for (const region of regions) {
      if (!region) continue
      const options = []
      for (const y of axis(region.minY, region.maxY, 16)) {
        for (const x of axis(region.minX, region.maxX, 16)) {
          const px = clamp(x + (rng() - 0.5) * 10, region.minX, region.maxX)
          const py = clamp(y + (rng() - 0.5) * 10, region.minY, region.maxY)
          const rect = { x: px, y: py, w: button.w, h: button.h }
          if (overlaps(rect, obstacle, tier.pad)) continue
          const cx = px + button.w / 2
          const cy = py + button.h / 2
          if (dist(cx, cy, fromCenter.x, fromCenter.y) < tier.travel) continue
          if (pointer && dist(cx, cy, pointer.x, pointer.y) < tier.away) continue
          options.push({ x: px, y: py, cx, cy })
        }
      }
      if (options.length) {
        const ref = pointer ?? fromCenter
        let best = options[0]
        let bestScore = -Infinity
        for (const o of options) {
          const score = dist(o.cx, o.cy, ref.x, ref.y) + rng() * 120
          if (score > bestScore) {
            best = o
            bestScore = score
          }
        }
        return { x: Math.round(best.x), y: Math.round(best.y) }
      }
    }
  }
  return { x: from.x, y: from.y }
}
