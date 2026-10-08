<template>
  <div
    class="card product-card h-100 d-flex flex-column shadow-sm"
    :class="[
      agotado ? 'product-card--agotado border-secondary' : 'border-success',
      { 'product-card--compact': compact },
    ]"
  >
    <div class="card-img-wrap card-img-wrap--product flex-shrink-0">
      <span v-if="agotado" class="product-card-img-badge product-card-agotado-badge">{{ t('catalogue.soldOut') }}</span>
      <img
        :src="image"
        class="card-img-top"
        :class="{ 'product-card-img--agotado': agotado }"
        :style="imagePositionStyle"
        :alt="`${title}${subtitle ? `. ${subtitle}` : ''}${agotado ? ` (${t('catalogue.soldOut')})` : ''}`"
        loading="lazy"
      >
    </div>

    <div class="card-body product-card-body d-flex flex-column flex-grow-1">
      <div class="card-heading flex-shrink-0 w-100 text-center">
        <h6 class="card-title fw-bold mb-1">{{ title }}</h6>
        <p v-if="subtitle" class="card-subtitle mb-0">{{ subtitle }}</p>
      </div>

      <template v-if="hasTemas">
        <p class="card-temas-label mb-0">{{ t('catalogue.works') }}</p>
        <p class="card-temas-hint mb-0">
          {{ t('catalogue.worksHint') }}
        </p>
        <ul class="card-temas list-unstyled mb-0 flex-grow-1 text-start min-w-0">
          <li
            v-for="(tema, index) in temas"
            :key="tema.id || index"
            class="card-tema"
            :class="{
              'card-tema--completo': tema.esCompleto,
              'card-tema--selected': selectedIds.includes(tema.id),
            }"
          >
            <label v-if="!agotado" class="card-tema__label">
              <input
                type="checkbox"
                class="card-tema__check"
                :checked="selectedIds.includes(tema.id)"
                :aria-label="tema.nombre"
                @change="toggleTema(tema)"
              >
              <span class="card-tema__nombre">{{ tema.nombre }}</span>
            </label>
            <span v-else class="card-tema__nombre card-tema__nombre--static">{{ tema.nombre }}</span>
          </li>
        </ul>
        <div v-if="!agotado" class="card-temas-footer">
          <p class="card-temas-resumen mb-0">{{ resumenSeleccion }}</p>
          <button
            type="button"
            class="btn card-temas-cta"
            :disabled="!canOpenFormatos"
            @click="openTrackModal"
          >
            {{ t('catalogue.seeOptions') }}
          </button>
        </div>
      </template>

      <div v-else class="card-formatos-simple flex-grow-1 d-flex flex-column">
        <p class="card-temas-label mb-0">{{ t('catalogue.options') }}</p>
        <p class="card-temas-hint mb-0">
          {{ t('catalogue.optionsHint') }}
        </p>
        <div v-if="!agotado" class="card-temas-footer mt-auto">
          <button
            type="button"
            class="btn card-temas-cta"
            @click="openTrackModal"
          >
            {{ t('catalogue.seeOptions') }}
          </button>
        </div>
      </div>
    </div>

    <ProductTrackModal
      :open="modalOpen"
      :product-id="productId"
      :title="title"
      :subtitle="subtitle"
      :image="image"
      :temas="modalTemas"
      :opciones="opciones"
      @close="closeTrackModal"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ProductTrackModal from './ProductTrackModal.vue'
import { useI18n } from '@/i18n/useI18n'

const { t } = useI18n()

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    required: true,
  },
  opciones: {
    type: Array,
    required: true,
    validator(v) {
      if (!Array.isArray(v) || v.length < 1) return false
      return v.every(
        (o) =>
          o &&
          typeof o === 'object' &&
          typeof o.nombre === 'string' &&
          o.nombre.trim().length > 0 &&
          typeof o.price === 'string' &&
          o.price.trim().length > 0,
      )
    },
  },
  temas: {
    type: Array,
    default: () => [],
  },
  agotado: {
    type: Boolean,
    default: false,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  imagePosition: {
    type: String,
    default: '',
  },
})

const hasTemas = computed(() => Array.isArray(props.temas) && props.temas.length > 0)

const modalOpen = ref(false)
const selectedIds = ref([])

const selectedTemas = computed(() =>
  props.temas.filter((t) => selectedIds.value.includes(t.id)),
)

const obraUnica = computed(() => [
  {
    id: `${props.productId}-obra`,
    nombre: props.subtitle
      ? `${props.title} — ${props.subtitle}`
      : props.title,
  },
])

const modalTemas = computed(() =>
  hasTemas.value ? selectedTemas.value : obraUnica.value,
)

const canOpenFormatos = computed(() => selectedTemas.value.length > 0)

const resumenSeleccion = computed(() => {
  const n = selectedTemas.value.length
  if (!n) return t.value('catalogue.noneSelected')
  if (selectedTemas.value.some((tema) => tema.esCompleto)) return t.value('catalogue.fullConcertSelected')
  return n === 1 ? t.value('catalogue.oneWork') : t.value('catalogue.nWorks', { n })
})

const imagePositionStyle = computed(() => {
  const pos = props.imagePosition?.trim()
  return pos ? { objectPosition: pos } : undefined
})

function toggleTema(tema) {
  const id = tema.id
  const checked = !selectedIds.value.includes(id)

  if (tema.esCompleto) {
    selectedIds.value = checked ? [id] : []
    return
  }

  const completo = props.temas.find((t) => t.esCompleto)
  let next = selectedIds.value.filter((x) => x !== completo?.id)

  if (checked) {
    if (!next.includes(id)) next = [...next, id]
  } else {
    next = next.filter((x) => x !== id)
  }
  selectedIds.value = next
}

function openTrackModal() {
  if (hasTemas.value && !canOpenFormatos.value) return
  modalOpen.value = true
}

function closeTrackModal() {
  modalOpen.value = false
}
</script>

<style scoped>
.product-card {
  min-height: 0;
  border-radius: 1.125rem;
  overflow: visible;
  --bs-card-inner-border-radius: calc(1.125rem - 1px);
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.42),
    0 2px 10px rgba(0, 0, 0, 0.28);
}

.product-card-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.55rem 0.7rem 0.75rem;
}

.card-img-wrap {
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 1.125rem 1.125rem 0 0;
}

.card-img-wrap--product {
  position: relative;
}

.product-card-img-badge {
  position: absolute;
  top: 0.55rem;
  z-index: 2;
  border-radius: 0.4rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}

.product-card-agotado-badge {
  left: 50%;
  translate: -50% 0;
  padding: 0.38rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  background: linear-gradient(145deg, #6a6a6a, #3d3d3d);
  border: 1px solid rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.product-card-img--agotado {
  filter: grayscale(1) brightness(0.9);
}

.product-card--agotado .card-title,
.product-card--agotado .card-subtitle,
.product-card--agotado .card-opcion,
.product-card--agotado .card-tema {
  opacity: 0.88;
}

.card-img-top {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

@media (max-width: 575.98px) {
  .card-img-wrap {
    aspect-ratio: 16 / 10;
    height: auto;
  }
}

.card-heading {
  margin-bottom: 0.55rem;
}

.card-title {
  font-family: var(--font-display);
  font-size: clamp(0.72rem, 1.55vw, 0.92rem);
  line-height: 1.2;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.68rem, 1.8vw, 0.8rem);
  line-height: 1.3;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(var(--ms-accent-rgb), 0.95);
  font-weight: 600;
}

.card-temas-label {
  font-family: var(--font-body);
  font-size: clamp(0.68rem, 1.7vw, 0.76rem);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(var(--ms-accent-rgb), 0.95);
  margin-bottom: 0.2rem !important;
}

.card-temas-hint {
  font-family: var(--font-body);
  font-size: clamp(0.68rem, 1.6vw, 0.74rem);
  line-height: 1.35;
  color: #555;
  margin-bottom: 0.4rem !important;
}

.card-temas {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
  max-height: 16.5rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--ms-accent-rgb), 0.4) transparent;
}

.card-tema {
  border-top: 1px solid rgba(var(--ms-accent-rgb), 0.28);
}

.card-tema:first-child {
  border-top: none;
}

.card-tema--completo {
  background: rgba(var(--ms-accent-rgb), 0.08);
  border-radius: 0.4rem;
  margin-bottom: 0.15rem;
}

.card-tema--selected:not(.card-tema--completo) {
  background: rgba(var(--ms-accent-rgb), 0.05);
}

.card-tema__label {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.45rem 0.35rem;
  cursor: pointer;
  margin: 0;
}

.card-tema__check {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: rgba(var(--ms-accent-rgb), 1);
  flex-shrink: 0;
}

.card-tema__nombre {
  font-family: var(--font-body);
  font-size: clamp(0.78rem, 2vw, 0.88rem);
  font-weight: 700;
  line-height: 1.25;
  color: #222;
}

.card-tema__nombre--static {
  display: block;
  padding: 0.5rem 0.35rem;
}

.card-temas-footer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.45rem;
  margin-top: 0.55rem;
  padding-top: 0.55rem;
  border-top: 1px solid rgba(var(--ms-accent-rgb), 0.28);
}

.card-temas-resumen {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: #555;
  text-align: center;
}

.card-temas-cta {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  background: rgba(var(--ms-accent-rgb), 1);
  border: 0;
  border-radius: 999px;
  padding: 0.45rem 1rem;
}

.card-temas-cta:hover:not(:disabled),
.card-temas-cta:focus-visible:not(:disabled) {
  background: var(--ms-accent-hover, #9a1f28);
  color: #fff;
}

.card-temas-cta:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.card-opciones {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}

.card-opcion {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.45rem;
  padding: 0.55rem 0;
  border-top: 1px solid rgba(var(--ms-accent-rgb), 0.35);
}

.card-opcion:first-child {
  border-top: none;
  padding-top: 0;
}

.card-opcion__nombre {
  font-family: var(--font-body);
  font-size: clamp(0.78rem, 2vw, 0.9rem);
  font-weight: 700;
  line-height: 1.25;
  color: #222;
}

.card-opcion__price {
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 2vw, 0.95rem);
  font-weight: 800;
  color: rgba(var(--ms-accent-rgb), 1);
  margin-top: 0.25rem;
}

.card-opcion__wa {
  align-self: flex-start;
  padding: 0.35rem 0.75rem 0.35rem 0.65rem;
}

.card-opcion__wa .wa-pill-label {
  font-size: 0.72rem;
}

.product-card--compact {
  border-radius: 0.85rem;
  --bs-card-inner-border-radius: calc(0.85rem - 1px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.38),
    0 2px 8px rgba(0, 0, 0, 0.24);
}

.product-card--compact .product-card-body {
  padding: 0.4rem 0.5rem 0.5rem;
}

.product-card--compact .card-img-wrap {
  aspect-ratio: 4 / 3;
  border-radius: 0.85rem 0.85rem 0 0;
}

.product-card--compact .card-heading {
  margin-bottom: 0.35rem;
}

.product-card--compact .card-title {
  font-size: clamp(0.82rem, 2.2vw, 0.98rem);
  line-height: 1.2;
}

.product-card--compact .card-subtitle {
  font-size: clamp(0.6rem, 1.5vw, 0.7rem);
  line-height: 1.25;
}

.product-card--compact .card-temas {
  max-height: 12.5rem;
}

.product-card--compact .card-tema__label {
  padding: 0.35rem 0.25rem;
  gap: 0.45rem;
}

.product-card--compact .card-tema__nombre {
  font-size: clamp(0.68rem, 1.7vw, 0.78rem);
}

.product-card--compact .card-temas-cta {
  font-size: 0.74rem;
  padding: 0.38rem 0.85rem;
}

.product-card--compact .card-opcion {
  gap: 0.3rem;
  padding: 0.35rem 0;
}

.product-card--compact .card-opcion__nombre {
  font-size: clamp(0.68rem, 1.7vw, 0.78rem);
  line-height: 1.2;
}

.product-card--compact .card-opcion__price {
  font-size: clamp(0.72rem, 1.8vw, 0.82rem);
  margin-top: 0.1rem;
}

.product-card--compact .card-opcion__wa {
  padding: 0.25rem 0.55rem 0.25rem 0.45rem;
}

.product-card--compact .card-opcion__wa .wa-pill-label {
  font-size: 0.64rem;
}

.product-card--compact .card-opcion__wa .wa-pill-icon {
  width: 0.9rem;
  height: 0.9rem;
}
</style>
