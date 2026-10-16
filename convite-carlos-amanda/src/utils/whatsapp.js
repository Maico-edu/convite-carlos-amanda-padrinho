// Converte "+55 31 9089-6457" em "553190896457" (somente dígitos, como exige o wa.me)
export function toWhatsAppNumber(raw) {
  return String(raw ?? '').replace(/\D/g, '')
}

// Link universal: abre o app no celular e o WhatsApp Web no computador,
// já com a mensagem preenchida (a pessoa revisa e envia manualmente).
export function buildWhatsAppUrl(number, message) {
  const digits = toWhatsAppNumber(number)
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message ?? '')}`
}
