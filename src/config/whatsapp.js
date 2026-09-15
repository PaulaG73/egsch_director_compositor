/** WhatsApp: número, pie de página y solicitudes de productos */

export const WHATSAPP_NUMBER_DIGITS = '56996450950'

const PUBLIC_SITE_FROM_ENV = process.env.VUE_APP_PUBLIC_SITE_URL || ''
const WHATSAPP_FALLBACK_SITE_ORIGIN = 'https://egschdirectorcompositor.netlify.app'

/**
 * Página estática con meta OG → imagen de la tarjeta del producto.
 * WhatsApp no previsualiza bien JPG sueltos; necesita HTML con og:image.
 */
const PRODUCT_SHARE_BY_IMAGE = {
  '/img/Queen2.jpg': '/share/queen.html',
  '/img/Withney2.jpg': '/share/whitney.html',
  '/img/Nino1.jpeg': '/share/nino.html',
  '/img/Mi_pobre_angelito.jpg': '/share/mi-pobre-angelito.html',
  '/img/Frozen.jpg': '/share/frozen.html',
  '/img/Rey_leon.jpg': '/share/rey-leon.html',
}

function digitsOnly() {
  return WHATSAPP_NUMBER_DIGITS.replace(/\D/g, '')
}

function normalizeHttpsRoot(url) {
  const u = String(url || '')
    .trim()
    .replace(/\/+$/, '')
  if (!u) return ''
  return u.replace(/^http:\/\//i, 'https://')
}

/** Origen HTTPS público para adjuntar vista previa del producto en el mensaje. */
function getShareBaseOrigin() {
  let origin = normalizeHttpsRoot(PUBLIC_SITE_FROM_ENV)
  if (!origin) origin = normalizeHttpsRoot(WHATSAPP_FALLBACK_SITE_ORIGIN)
  if (origin) return origin

  if (typeof window !== 'undefined' && window.location?.origin) {
    const o = window.location.origin.replace(/\/+$/, '')
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o)) return ''
    return normalizeHttpsRoot(o)
  }

  return ''
}

function normalizeAssetPath(assetPath) {
  if (!assetPath || typeof assetPath !== 'string') return ''
  const trimmed = assetPath.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed)
      return u.pathname || ''
    } catch {
      return ''
    }
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

/**
 * URL HTTPS pública para la vista previa en WhatsApp:
 * preferir página /share/*.html con og:image de la tarjeta;
 * si no hay página, caer al JPG directo.
 */
function resolveProductPreviewUrl(assetPath) {
  const base = getShareBaseOrigin()
  if (!base) return ''

  const path = normalizeAssetPath(assetPath)
  if (!path) return ''

  const sharePath = PRODUCT_SHARE_BY_IMAGE[path]
  if (sharePath) return `${base}${sharePath}`

  return `${base}${path}`
}

function priceForWhatsAppMessage(price) {
  if (!price || typeof price !== 'string') return ''
  return price.trim().replace(/\$/g, '').replace(/\s+/g, ' ').trim()
}

/** CTA Contáctame del footer. Incluye página de vista previa con el título del hero. */
export function getWhatsAppFooterUrl() {
  const digits = digitsOnly()
  if (!digits) return '#'

  const previewUrl = `${WHATSAPP_FALLBACK_SITE_ORIGIN}/compartir.html`
  const text = [
    'Hola Eduardo, estoy escribiendo desde tu página web y quisiera conversar contigo sobre un tema en particular. Estás disponible?',
    '',
    previewUrl,
  ].join('\n')

  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

/** CTA Contáctame del hero. Incluye página de vista previa con el título del hero. */
export function getWhatsAppHeroUrl() {
  const digits = digitsOnly()
  if (!digits) return '#'

  const previewUrl = `${WHATSAPP_FALLBACK_SITE_ORIGIN}/compartir.html`
  const text = [
    'Hola Eduardo, te contacto desde tu página web. Me gustaría conversar contigo sobre un proyecto musical.',
    '',
    previewUrl,
  ].join('\n')

  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

/**
 * WhatsApp para una opción de producto (partitura / formato).
 * Incluye siempre la URL de vista previa de la tarjeta del producto.
 * @param {{
 *   productId?: string,
 *   title?: string,
 *   subtitle?: string,
 *   image?: string,
 *   opcion?: { id?: string, nombre?: string, descripcion?: string, price?: string }
 * }} payload
 */
export function getWhatsAppProductOptionUrl(payload) {
  const digits = digitsOnly()
  if (!digits) return '#'

  const title = typeof payload?.title === 'string' ? payload.title.trim() : ''
  const subtitle = typeof payload?.subtitle === 'string' ? payload.subtitle.trim() : ''
  const opcion = payload?.opcion && typeof payload.opcion === 'object' ? payload.opcion : {}
  const opcionNombre = typeof opcion.nombre === 'string' ? opcion.nombre.trim() : ''
  const price = typeof opcion.price === 'string' ? opcion.price.trim() : ''
  const previewUrl = resolveProductPreviewUrl(payload?.image || '')

  const parts = ['Hola, quiero solicitar:']
  if (title) parts.push(title)
  if (subtitle) parts.push(subtitle)
  if (opcionNombre) parts.push(`Opción: ${opcionNombre}`)
  parts.push('')

  if (previewUrl && /^https:\/\//i.test(previewUrl)) {
    parts.push(previewUrl)
    parts.push('')
  }

  const priceTxt = priceForWhatsAppMessage(price)
  if (priceTxt) {
    parts.push(`Precio (USD): ${priceTxt}`)
  }

  const text = parts.join('\n').trimEnd()
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

/**
 * WhatsApp para selección de obra(s) + opción(es) (p. ej. Queen / Nino Bravo).
 * Incluye siempre la URL de vista previa de la tarjeta del producto.
 * @param {{
 *   productId?: string,
 *   title?: string,
 *   subtitle?: string,
 *   image?: string,
 *   formato?: { id?: string, nombre?: string, price?: string },
 *   formatos?: Array<{ id?: string, nombre?: string, price?: string }>,
 *   temas?: Array<{ id?: string, nombre?: string, esCompleto?: boolean, price?: string }>,
 *   totalUsd?: number | null,
 *   totalLabel?: string,
 *   promoUsd?: number | null,
 *   promoLabel?: string
 * }} payload
 */
export function getWhatsAppProductSelectionUrl(payload) {
  const digits = digitsOnly()
  if (!digits) return '#'

  const title = typeof payload?.title === 'string' ? payload.title.trim() : ''
  const subtitle = typeof payload?.subtitle === 'string' ? payload.subtitle.trim() : ''
  const temas = Array.isArray(payload?.temas) ? payload.temas : []
  const previewUrl = resolveProductPreviewUrl(payload?.image || '')

  let formatos = Array.isArray(payload?.formatos) ? payload.formatos : []
  if (!formatos.length && payload?.formato && typeof payload.formato === 'object') {
    formatos = [payload.formato]
  }

  const parts = ['Hola, quiero solicitar:']
  if (title) parts.push(title)
  if (subtitle) parts.push(subtitle)
  parts.push('')

  if (temas.length) {
    parts.push(temas.length === 1 ? 'Obra:' : 'Obras:')
    for (const tema of temas) {
      const nombre = typeof tema?.nombre === 'string' ? tema.nombre.trim() : ''
      if (!nombre) continue
      parts.push(`• ${nombre}`)
    }
    parts.push('')
  }

  if (formatos.length) {
    parts.push(formatos.length === 1 ? 'Opción:' : 'Opciones:')
    for (const formato of formatos) {
      const nombre = typeof formato?.nombre === 'string' ? formato.nombre.trim() : ''
      if (!nombre) continue
      const priceTxt = priceForWhatsAppMessage(
        typeof formato?.price === 'string' ? formato.price : '',
      )
      parts.push(priceTxt ? `• ${nombre} — ${priceTxt}` : `• ${nombre}`)
    }
    parts.push('')
  }

  const totalUsd = payload?.totalUsd
  if (typeof totalUsd === 'number' && Number.isFinite(totalUsd)) {
    const rounded = Math.round(totalUsd * 100) / 100
    const text =
      Number.isInteger(rounded)
        ? String(rounded)
        : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    parts.push(`Total (USD): US$ ${text}`)
  } else if (typeof payload?.totalLabel === 'string' && payload.totalLabel.trim()) {
    parts.push(payload.totalLabel.trim())
  }

  const promoUsd = payload?.promoUsd
  if (typeof promoUsd === 'number' && Number.isFinite(promoUsd)) {
    const rounded = Math.round(promoUsd * 100) / 100
    const text =
      Number.isInteger(rounded)
        ? String(rounded)
        : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    parts.push(`Precio promo (todas las opciones): US$ ${text}`)
  } else if (typeof payload?.promoLabel === 'string' && payload.promoLabel.trim()) {
    parts.push(payload.promoLabel.trim())
  }

  if (
    (typeof totalUsd === 'number' && Number.isFinite(totalUsd)) ||
    (typeof promoUsd === 'number' && Number.isFinite(promoUsd)) ||
    (typeof payload?.totalLabel === 'string' && payload.totalLabel.trim()) ||
    (typeof payload?.promoLabel === 'string' && payload.promoLabel.trim())
  ) {
    parts.push('')
  }

  if (previewUrl && /^https:\/\//i.test(previewUrl)) {
    parts.push(previewUrl)
  }

  const text = parts.join('\n').trimEnd()
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

export function isWhatsAppConfigured() {
  return digitsOnly().length > 0
}
