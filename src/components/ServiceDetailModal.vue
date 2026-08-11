<template>
  <Teleport to="body">
    <div
      v-if="open && servicio"
      class="servicio-modal"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <button
        type="button"
        class="servicio-modal__backdrop"
        aria-label="Cerrar"
        @click="emit('close')"
      />
      <div class="servicio-modal__panel" ref="panelRef">
        <header class="servicio-modal__header">
          <h2 :id="titleId" class="servicio-modal__title mb-0">
            {{ titulo }}
          </h2>
          <button
            type="button"
            class="servicio-modal__close"
            aria-label="Cerrar"
            @click="emit('close')"
          >
            ×
          </button>
        </header>

        <div class="servicio-modal__body">
          <p v-if="detalle.gancho" class="servicio-modal__gancho">
            {{ detalle.gancho }}
          </p>
          <p v-if="detalle.intro" class="servicio-modal__intro">
            {{ detalle.intro }}
          </p>

          <section
            v-for="(seccion, sIndex) in detalle.secciones || []"
            :key="sIndex"
            class="servicio-modal__seccion"
          >
            <h3 class="servicio-modal__seccion-titulo">{{ seccion.titulo }}</h3>
            <p v-if="seccion.intro" class="servicio-modal__seccion-intro">
              {{ seccion.intro }}
            </p>
            <ul class="servicio-modal__lista">
              <li
                v-for="(item, iIndex) in seccion.items || []"
                :key="iIndex"
                class="servicio-modal__item"
              >
                <strong class="servicio-modal__item-titulo">{{ item.titulo }}:</strong>
                {{ item.texto }}
              </li>
            </ul>
          </section>

          <div v-if="detalle.cierre" class="servicio-modal__cierre">
            <h3 v-if="detalle.cierreTitulo" class="servicio-modal__seccion-titulo">
              {{ detalle.cierreTitulo }}
            </h3>
            <p class="servicio-modal__cierre-texto mb-0">{{ detalle.cierre }}</p>
          </div>
        </div>

        <footer class="servicio-modal__footer">
          <a
            class="btn btn-outline-success servicio-modal__cta"
            :href="cotizaHref"
            @click="emit('close')"
          >
            {{ ctaLabel }}
          </a>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  servicio: { type: Object, default: null },
  titulo: { type: String, default: '' },
  cotizaHref: { type: String, default: '#' },
  ctaLabel: { type: String, default: 'Cotiza aquí' },
})

const emit = defineEmits(['close'])

const panelRef = ref(null)
const titleId = `servicio-modal-title-${Math.random().toString(36).slice(2, 9)}`

const detalle = computed(() => props.servicio?.detalle || {})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.addEventListener('keydown', onKeydown)
      document.body.style.overflow = 'hidden'
      await nextTick()
      panelRef.value?.focus?.()
    } else {
      document.removeEventListener('keydown', onKeydown)
      document.body.style.overflow = ''
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.servicio-modal {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.servicio-modal__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  padding: 0;
  margin: 0;
  cursor: pointer;
  background: rgba(5, 8, 14, 0.72);
}

.servicio-modal__panel {
  position: relative;
  z-index: 1;
  width: min(100%, 40rem);
  max-height: min(88vh, 44rem);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ms-border);
  border-radius: 0.75rem;
  background: var(--ms-surface);
  color: var(--ms-text);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
  overflow: hidden;
}

.servicio-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem 0.85rem;
  border-bottom: 1px solid rgba(var(--ms-accent-rgb), 0.28);
}

.servicio-modal__title {
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2.8vw, 1.35rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.3;
  color: var(--ms-accent-on-dark);
}

.servicio-modal__close {
  flex: 0 0 auto;
  width: 2rem;
  height: 2rem;
  border: 1px solid rgba(var(--ms-accent-rgb), 0.45);
  border-radius: 50%;
  background: transparent;
  color: var(--ms-text);
  font-size: 1.35rem;
  line-height: 1;
  cursor: pointer;
}

.servicio-modal__close:hover,
.servicio-modal__close:focus-visible {
  border-color: rgba(var(--ms-accent-rgb), 0.85);
  background: rgba(var(--ms-accent-rgb), 0.18);
}

.servicio-modal__body {
  padding: 1rem 1.25rem 1.25rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--ms-accent-rgb), 0.4) transparent;
}

.servicio-modal__gancho {
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 2.2vw, 1.08rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.45;
  color: var(--ms-text);
  margin: 0 0 0.85rem;
}

.servicio-modal__intro,
.servicio-modal__cierre-texto,
.servicio-modal__seccion-intro {
  font-family: var(--font-body);
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--ms-text-muted);
  text-align: justify;
  margin: 0 0 1.15rem;
}

.servicio-modal__seccion-intro {
  margin-bottom: 0.75rem;
}

.servicio-modal__seccion {
  margin-bottom: 1.25rem;
}

.servicio-modal__seccion-titulo {
  font-family: var(--font-display);
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.035em;
  color: var(--ms-accent-on-dark);
  margin: 0 0 0.65rem;
}

.servicio-modal__lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
}

.servicio-modal__item {
  font-family: var(--font-body);
  font-size: 0.86rem;
  line-height: 1.6;
  color: var(--ms-text-muted);
  padding-left: 0.85rem;
  border-left: 2px solid rgba(var(--ms-accent-rgb), 0.45);
  text-align: left;
}

.servicio-modal__item-titulo {
  color: var(--ms-text);
  font-weight: 600;
}

.servicio-modal__cierre {
  margin-top: 0.35rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.servicio-modal__footer {
  padding: 0.9rem 1.25rem 1.15rem;
  border-top: 1px solid rgba(var(--ms-accent-rgb), 0.22);
  display: flex;
  justify-content: center;
}

.servicio-modal__cta {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: none;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  white-space: normal;
  max-width: 100%;
  line-height: 1.35;
  text-align: center;
}
</style>
