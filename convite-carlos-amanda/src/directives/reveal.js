// v-reveal: o bloco aparece suavemente quando entra na tela ao rolar a página.
// Cada componente define o visual da classe .reveal (e .reveal.in).

let observer = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  )
  return observer
}

export const vReveal = {
  mounted(el) {
    const io = getObserver()
    if (!io) {
      el.classList.add('in')
      return
    }
    io.observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  }
}
