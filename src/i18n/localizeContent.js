import { translate } from './messages'
import { serviciosCopy } from './serviciosCopy'

const TEMA_KEY = {
  'queen-tema-01': 'catalogue.queenOverture',
  'nino-tema-10': 'catalogue.overture',
  'peliculas-tema-08': 'catalogue.overtureMedley',
  'peliculas-tema-01': 'catalogue.homeAlone',
  'peliculas-tema-02': 'catalogue.letItGo',
  'peliculas-tema-03': 'catalogue.lionKing',
  'peliculas-tema-04': 'catalogue.spiderMan',
  'peliculas-tema-05': 'catalogue.avengers',
  'peliculas-tema-06': 'catalogue.jurassic',
  'peliculas-tema-07': 'catalogue.oz',
  'peliculas-tema-09': 'catalogue.beauty',
}

function optionKind(id) {
  const key = String(id || '')
  if (key.includes('full-score')) return 'fullScore'
  if (key.includes('score-coro')) return 'choralScore'
  if (key.includes('partes')) return 'parts'
  return ''
}

function mergeDetalle(base, loc) {
  if (!base || !loc) return base
  const secciones = (base.secciones || []).map((sec, index) => {
    const translated = loc.secciones?.[index]
    if (!translated) return sec
    return {
      ...sec,
      titulo: translated.titulo || sec.titulo,
      intro: translated.intro || sec.intro,
      items: (sec.items || []).map((item, itemIndex) => ({
        ...item,
        titulo: translated.items?.[itemIndex]?.titulo || item.titulo,
        texto: translated.items?.[itemIndex]?.texto || item.texto,
      })),
    }
  })
  return {
    ...base,
    gancho: loc.gancho || base.gancho,
    intro: loc.intro || base.intro,
    cierreTitulo: loc.cierreTitulo || base.cierreTitulo,
    cierre: loc.cierre || base.cierre,
    secciones,
  }
}

export function localizeServicios(list, locale) {
  return list.map((servicio) => {
    const pack = serviciosCopy[servicio.titleKey]?.[locale]
    if (!pack) return servicio
    return {
      ...servicio,
      descripcion: pack.descripcion || servicio.descripcion,
      ctaLabel: pack.ctaLabel || servicio.ctaLabel,
      detalle: mergeDetalle(servicio.detalle, pack.detalle),
    }
  })
}

export function localizeProduct(product, locale) {
  const t = (path) => translate(locale, path)
  const title = product.id === '4' ? t('catalogue.filmTitle') : product.title
  const subtitle = product.subtitle === 'Sinfónico' ? t('catalogue.symphonic') : product.subtitle
  return {
    ...product,
    title,
    subtitle,
    temas: (product.temas || []).map((tema) => {
      if (tema.esCompleto) return { ...tema, nombre: t('catalogue.fullConcert') }
      const path = TEMA_KEY[tema.id]
      return path ? { ...tema, nombre: t(path) } : { ...tema }
    }),
    opciones: (product.opciones || []).map((opcion) => {
      const kind = optionKind(opcion.id)
      if (!kind) return { ...opcion }
      return {
        ...opcion,
        nombre: t(`catalogue.${kind}`),
        descripcion: t(`catalogue.${kind}Desc`),
      }
    }),
  }
}

export function localizeProducts(list, locale) {
  return list.map((product) => localizeProduct(product, locale))
}
