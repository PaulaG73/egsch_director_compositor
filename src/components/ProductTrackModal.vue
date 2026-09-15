<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="track-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @keydown.esc.prevent="close"
    >
      <button
        type="button"
        class="track-modal__backdrop"
        aria-label="Cerrar"
        @click="close"
      />
      <div class="track-modal__panel" ref="panelRef">
        <header class="track-modal__header">
          <div class="track-modal__heading min-w-0">
            <p class="track-modal__eyebrow mb-1">{{ title }}</p>
            <h2 :id="titleId" class="track-modal__title mb-0">{{ modalTitle }}</h2>
          </div>
          <button
            type="button"
            class="track-modal__close"
            aria-label="Cerrar menú"
            @click="close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
          </button>
        </header>

        <p class="track-modal__hint mb-0">
          Marca una o varias opciones. Precios en dólares americanos (USD).
        </p>

        <ul v-if="temas.length > 1" class="track-modal__seleccion list-unstyled mb-0">
          <li v-for="tema in temas" :key="tema.id" class="track-modal__seleccion-item">
            {{ tema.nombre }}
          </li>
        </ul>

        <ul class="track-modal__list list-unstyled mb-0">
          <li
            v-for="opcion in opciones"
            :key="opcion.id"
            class="track-modal__item"
            :class="{
              'track-modal__item--selected': selectedFormatoIds.includes(opcion.id),
              'track-modal__item--disabled': !isOpcionDisponible(opcion),
            }"
          >
            <label class="track-modal__label" :class="{ 'track-modal__label--disabled': !isOpcionDisponible(opcion) }">
              <input
                type="checkbox"
                class="track-modal__check"
                :checked="selectedFormatoIds.includes(opcion.id)"
                :disabled="!isOpcionDisponible(opcion)"
                :aria-label="opcion.nombre"
                @change="toggleFormato(opcion)"
              >
              <span class="track-modal__opcion-info min-w-0">
                <span class="track-modal__nombre">{{ opcion.nombre }}</span>
                <span v-if="opcion.descripcion" class="track-modal__desc">{{ opcion.descripcion }}</span>
                <span class="track-modal__precio">{{ priceForOpcion(opcion) }}</span>
              </span>
            </label>
          </li>
        </ul>

        <footer class="track-modal__footer">
          <p class="track-modal__resumen mb-0">{{ resumenFormatos }}</p>
          <p class="track-modal__total mb-0" :class="{ 'track-modal__total--pending': totalUsd == null && selectedFormatos.length > 0 }">
            {{ totalLabel }}
          </p>
          <p
            v-if="promoUsd != null"
            class="track-modal__promo mb-0"
          >
            Precio promo (todas las opciones): {{ formatUsd(promoUsd) }}
          </p>
          <a
            class="btn btn-whatsapp wa-pill-btn track-modal__wa"
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            :aria-disabled="!canSubmit"
            :class="{ 'opacity-50 pe-none': !canSubmit }"
            aria-label="Solicitar selección por WhatsApp"
            @click="onSubmitClick"
          >
            <svg
              class="wa-pill-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span class="wa-pill-label">Solicita aquí</span>
          </a>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { getWhatsAppProductSelectionUrl, isWhatsAppConfigured } from '@/config/whatsapp'

const props = defineProps({
  open: { type: Boolean, default: false },
  productId: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
  temas: { type: Array, default: () => [] },
  opciones: { type: Array, default: () => [] },
})

const emit = defineEmits(['close'])

const titleId = `track-modal-title-${Math.random().toString(36).slice(2, 9)}`
const panelRef = ref(null)
const selectedFormatoIds = ref([])

const whatsappReady = computed(() => isWhatsAppConfigured())

const isCompleto = computed(() => props.temas.some((t) => t.esCompleto))
const temaCount = computed(() => props.temas.length)

const selectedFormatos = computed(() =>
  props.opciones.filter((o) => selectedFormatoIds.value.includes(o.id)),
)

const canSubmit = computed(
  () =>
    whatsappReady.value &&
    props.temas.length > 0 &&
    selectedFormatos.value.length > 0,
)

const modalTitle = computed(() => {
  if (isCompleto.value) return 'Concierto completo'
  if (temaCount.value === 1) return props.temas[0]?.nombre || 'Obra seleccionada'
  return `${temaCount.value} obras seleccionadas`
})

const resumenFormatos = computed(() => {
  const n = selectedFormatos.value.length
  if (!n) return 'Ninguna opción seleccionada'
  return n === 1 ? '1 opción seleccionada' : `${n} opciones seleccionadas`
})

/** Extrae un monto USD numérico desde número o texto (ignora placeholders tipo XX). */
function parseUsdAmount(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) return value
  if (typeof value !== 'string') return null
  const raw = value.trim()
  if (!raw || /xx/i.test(raw)) return null
  const normalized = raw.replace(/,/g, '')
  const match = normalized.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null
  const n = Number(match[1])
  return Number.isFinite(n) ? n : null
}

function formatUsd(amount) {
  if (amount == null || !Number.isFinite(amount)) return 'US$ XX'
  const rounded = Math.round(amount * 100) / 100
  const text =
    Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `US$ ${text}`
}

function unitUsdForOpcion(opcion) {
  if (!opcion) return null
  if (isCompleto.value) {
    return (
      parseUsdAmount(opcion.precioCompletoUsd) ??
      parseUsdAmount(opcion.priceCompleto) ??
      parseUsdAmount(opcion.price)
    )
  }
  return (
    parseUsdAmount(opcion.precioTemaUsd) ??
    parseUsdAmount(opcion.priceTema) ??
    parseUsdAmount(opcion.price)
  )
}

/** Score Coro no aplica solo si ninguna obra de la selección tiene coro. */
function isOpcionDisponible(opcion) {
  if (!opcion) return false
  if (/score-coro/i.test(String(opcion.id))) {
    return props.temas.some((t) => !t.sinCoro)
  }
  return true
}

/** Obras a las que aplica una opción (p. ej. Score Coro excluye sinCoro). */
function temasParaOpcion(opcion) {
  if (!opcion) return []
  return props.temas.filter((tema) => {
    if (tema.sinCoro && /score-coro/i.test(String(opcion.id))) return false
    return true
  })
}

/** Precio USD de una obra concreta para una opción (p. ej. Full Score por tema). */
function temaUsdForOpcion(tema, opcion) {
  if (!tema || !opcion) return null
  if (tema.sinCoro && /score-coro/i.test(String(opcion.id))) return null
  if (tema.esCompleto) {
    return (
      parseUsdAmount(tema.preciosUsd?.[opcion.id]) ??
      unitUsdForOpcion(opcion)
    )
  }
  return (
    parseUsdAmount(tema.preciosUsd?.[opcion.id]) ??
    unitUsdForOpcion(opcion)
  )
}

function lineTotalUsd(opcion) {
  if (!opcion) return null
  if (!isOpcionDisponible(opcion)) return null
  if (isCompleto.value) {
    return temaUsdForOpcion(props.temas[0], opcion) ?? unitUsdForOpcion(opcion)
  }

  const aplicables = temasParaOpcion(opcion)
  if (!aplicables.length) return null

  const hasPerTema = aplicables.some(
    (tema) => parseUsdAmount(tema?.preciosUsd?.[opcion.id]) != null,
  )
  if (hasPerTema) {
    let sum = 0
    for (const tema of aplicables) {
      const p = temaUsdForOpcion(tema, opcion)
      if (p == null) return null
      sum += p
    }
    return sum
  }

  const unit = unitUsdForOpcion(opcion)
  if (unit == null) return null
  return unit * Math.max(aplicables.length, 1)
}

function unitPriceLabel(opcion) {
  if (!isOpcionDisponible(opcion)) return 'No aplica (sin coro)'
  const line = lineTotalUsd(opcion)
  if (line != null) return formatUsd(line)
  if (isCompleto.value) return opcion?.priceCompleto || opcion?.price || 'US$ XX'
  return opcion?.priceTema || opcion?.price || 'US$ XX'
}

function priceForOpcion(opcion) {
  if (!isOpcionDisponible(opcion)) return 'No aplica (sin coro en la selección)'
  const line = lineTotalUsd(opcion)
  const aplicables = temasParaOpcion(opcion)
  const n = aplicables.length
  if (line != null) {
    if (isCompleto.value || temaCount.value <= 1) return formatUsd(line)
    if (n < temaCount.value) {
      return `Suma de ${n} de ${temaCount.value} obras: ${formatUsd(line)}`
    }
    return `Suma de ${n} obras: ${formatUsd(line)}`
  }
  const unitLabel = unitPriceLabel(opcion)
  if (isCompleto.value || temaCount.value <= 1) return unitLabel
  if (n < temaCount.value) return `${unitLabel} × ${n} de ${temaCount.value} obras`
  return `${unitLabel} × ${n} obras`
}

const totalUsd = computed(() => {
  if (!selectedFormatos.value.length) return null
  let sum = 0
  for (const opcion of selectedFormatos.value) {
    const line = lineTotalUsd(opcion)
    if (line == null) return null
    sum += line
  }
  return sum
})

const totalLabel = computed(() => {
  if (!selectedFormatos.value.length) return 'Total: US$ 0'
  if (totalUsd.value == null) return 'Total: por cotizar (precios provisionales)'
  return `Total: ${formatUsd(totalUsd.value)}`
})

/** Cada obra tiene seleccionadas todas las opciones que le aplican. */
function temaTieneTodasSusOpciones(tema) {
  if (!tema) return false
  const aplicables = props.opciones.filter((opcion) => {
    if (!isOpcionDisponible(opcion)) return false
    if (tema.sinCoro && /score-coro/i.test(String(opcion.id))) return false
    return true
  })
  if (!aplicables.length) return false
  return aplicables.every((o) => selectedFormatoIds.value.includes(o.id))
}

/** Precio promo si cada obra tiene todas sus opciones aplicables marcadas. */
const promoUsd = computed(() => {
  if (!props.temas.length || !selectedFormatos.value.length) return null
  if (!props.temas.every((tema) => temaTieneTodasSusOpciones(tema))) return null
  let sum = 0
  for (const tema of props.temas) {
    const promo = parseUsdAmount(tema.precioPromoUsd)
    if (promo == null) return null
    sum += promo
  }
  return sum
})

const promoLabel = computed(() => {
  if (promoUsd.value == null) return ''
  return `Precio promo (todas las opciones): ${formatUsd(promoUsd.value)}`
})

const whatsappHref = computed(() => {
  if (!canSubmit.value) return '#'
  return getWhatsAppProductSelectionUrl({
    productId: props.productId,
    title: props.title,
    subtitle: props.subtitle,
    image: props.image,
    formatos: selectedFormatos.value.map((opcion) => ({
      ...opcion,
      price: priceForOpcion(opcion),
    })),
    temas: props.temas,
    totalUsd: totalUsd.value,
    totalLabel: totalLabel.value,
    promoUsd: promoUsd.value,
    promoLabel: promoLabel.value,
  })
})

function toggleFormato(opcion) {
  if (!isOpcionDisponible(opcion)) return
  const id = opcion.id
  if (selectedFormatoIds.value.includes(id)) {
    selectedFormatoIds.value = selectedFormatoIds.value.filter((x) => x !== id)
  } else {
    selectedFormatoIds.value = [...selectedFormatoIds.value, id]
  }
}

function close() {
  emit('close')
}

let lastWaOpenMs = 0
function onSubmitClick(e) {
  if (!canSubmit.value) {
    e.preventDefault()
    return
  }
  const now = Date.now()
  if (now - lastWaOpenMs < 2000) {
    e.preventDefault()
  } else {
    lastWaOpenMs = now
  }
}

watch(
  () => props.temas.map((t) => t.id).join('|'),
  () => {
    selectedFormatoIds.value = selectedFormatoIds.value.filter((id) => {
      const opcion = props.opciones.find((o) => o.id === id)
      return opcion ? isOpcionDisponible(opcion) : false
    })
  },
)

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      selectedFormatoIds.value = []
      document.body.style.overflow = 'hidden'
      await nextTick()
      panelRef.value?.querySelector('input:not([disabled]), button, a')?.focus?.()
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>

<style scoped>
.track-modal {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.track-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.72);
  cursor: pointer;
}

.track-modal__panel {
  position: relative;
  z-index: 1;
  width: min(100%, 28rem);
  max-height: min(88vh, 40rem);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.15rem 1.15rem 1rem;
  border-radius: 1rem;
  background: #121820;
  border: 1px solid var(--ms-border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  color: var(--ms-text);
  text-align: left;
}

.track-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.track-modal__eyebrow {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ms-accent-on-dark);
}

.track-modal__title {
  font-family: var(--font-display);
  font-size: clamp(1rem, 3vw, 1.2rem);
  font-weight: 600;
  line-height: 1.3;
}

.track-modal__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.track-modal__close:hover,
.track-modal__close:focus-visible {
  color: #fff;
  border-color: rgba(var(--ms-accent-rgb), 0.5);
}

.track-modal__hint {
  font-family: var(--font-body);
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--ms-text-muted);
}

.track-modal__seleccion {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-height: 6.5rem;
  overflow-y: auto;
  padding: 0.55rem 0.65rem;
  border-radius: 0.45rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  scrollbar-width: thin;
}

.track-modal__seleccion-item {
  font-family: var(--font-body);
  font-size: 0.78rem;
  line-height: 1.35;
  color: var(--ms-text-muted);
}

.track-modal__seleccion-item::before {
  content: '• ';
  color: var(--ms-accent-on-dark);
}

.track-modal__list {
  overflow-y: auto;
  min-height: 0;
  flex: 1 1 auto;
  padding-right: 0.15rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--ms-accent-rgb), 0.4) transparent;
}

.track-modal__item {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.track-modal__item:first-child {
  border-top: none;
}

.track-modal__item--selected {
  background: rgba(var(--ms-accent-rgb), 0.1);
  border-radius: 0.45rem;
}

.track-modal__item--disabled {
  opacity: 0.55;
}

.track-modal__label {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 0.65rem;
  padding: 0.7rem 0.4rem;
  cursor: pointer;
  margin: 0;
}

.track-modal__label--disabled {
  cursor: not-allowed;
}

.track-modal__check {
  width: 1.05rem;
  height: 1.05rem;
  margin-top: 0.15rem;
  accent-color: var(--ms-accent);
  flex-shrink: 0;
}

.track-modal__opcion-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.track-modal__nombre {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--ms-text);
}

.track-modal__desc {
  font-family: var(--font-body);
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--ms-text-muted);
}

.track-modal__precio {
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--ms-accent-on-dark);
  margin-top: 0.15rem;
}

.track-modal__footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  padding-top: 0.35rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.track-modal__resumen {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--ms-text-muted);
  text-align: center;
}

.track-modal__total {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 800;
  color: var(--ms-accent-on-dark);
  text-align: center;
  letter-spacing: 0.01em;
}

.track-modal__total--pending {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--ms-text-muted);
}

.track-modal__promo {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 700;
  color: #7dcea0;
  text-align: center;
  line-height: 1.35;
}

.track-modal__wa {
  align-self: center;
}
</style>
