<template>
  <NavBar />

  <!-- Hero / Sobre mí -->
  <section id="sobre-mi" class="home-section home-section--ink py-4 py-md-5">
    <div class="container hero d-flex flex-column flex-lg-row-reverse align-items-center justify-content-center gap-4 gap-lg-5">
      <div
        ref="heroFotoShellRef"
        class="hero-foto-shell"
        :class="{ 'hero-foto-shell--in-view': heroFotoInView }"
      >
        <div class="hero-foto">
          <img
            class="hero-foto__img"
            :src="heroFotoSrc"
            :alt="t('hero.photoAlt')"
            loading="eager"
            decoding="async"
          >
        </div>
      </div>
      <div class="hero-texto text-center text-lg-start">
        <h1 class="hero-titulo mb-3">
          <span class="hero-titulo__lineas">{{ t('hero.disciplines') }}</span>
          <span class="hero-cita">{{ t('hero.quote') }}</span>
        </h1>
        <p class="hero-subtitulo mb-3 mb-md-4">
          <span class="hero-subtitulo__nombre">Eduardo Gajardo Schmidlin</span>
          <span class="hero-subtitulo__rol">{{ t('hero.role') }}</span>
        </p>
        <a
          class="hero-cta"
          :href="heroWhatsappHref"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="hero-cta__label">{{ t('hero.cta') }}</span>
        </a>
      </div>
    </div>
    <SectionScrollUp />
  </section>

  <!-- Reproductor de video (franja provisional) -->
  <section id="video" class="home-section home-section--slate py-2">
    <div class="container">
      <div class="video-player-shell">
        <div class="video-player-placeholder" role="region" aria-label="Reproductor de video">
          <svg class="video-player-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445"/>
          </svg>
          <p class="video-player-label mb-0">Video próximamente</p>
        </div>
      </div>
      <SectionScrollUp />
    </div>
  </section>

  <!-- Trayectoria -->
  <section id="trayectoria" class="home-section home-section--ink home-section--trayectoria py-4 py-md-5">
    <div class="container trayectoria">
      <h2 class="section-title mb-3 mb-md-4">{{ t('nav.trayectoria') }}</h2>

      <div
        ref="trayectoriaItemsRef"
        class="trayectoria__carousel"
        :class="{ 'trayectoria__carousel--in-view': trayectoriaInView }"
      >
        <button
          type="button"
          class="trayectoria__arrow trayectoria__arrow--prev"
          aria-label="Hito anterior"
          @click="trayectoriaPrev"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
          </svg>
        </button>

        <div class="trayectoria__viewport">
          <div
            class="trayectoria__track"
            :style="{ '--trayectoria-slide': trayectoriaSlide }"
          >
            <article
              v-for="(item, index) in trayectoriaItems"
              :key="item.mark"
              class="trayectoria__item"
              :class="{ 'trayectoria__item--in-view': trayectoriaInView }"
              :style="{ '--trayectoria-i': index }"
            >
              <span class="trayectoria__mark" aria-hidden="true">{{ item.mark }}</span>
              <div class="trayectoria__body">
                <h3 class="trayectoria__item-title">{{ item.title }}</h3>
                <p class="trayectoria__lead mb-0">{{ item.text }}</p>
              </div>
            </article>
          </div>
        </div>

        <button
          type="button"
          class="trayectoria__arrow trayectoria__arrow--next"
          aria-label="Hito siguiente"
          @click="trayectoriaNext"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
          </svg>
        </button>
      </div>

      <div class="trayectoria__dots" role="tablist" aria-label="Hitos de trayectoria">
        <button
          v-for="(item, index) in trayectoriaItems"
          :key="`dot-${item.mark}`"
          type="button"
          class="trayectoria__dot"
          :class="{ 'trayectoria__dot--active': trayectoriaSlide === index }"
          role="tab"
          :aria-selected="trayectoriaSlide === index"
          :aria-label="`Ir a ${item.title}`"
          @click="goToTrayectoria(index)"
        >
          {{ item.mark }}
        </button>
      </div>

      <SectionScrollUp />
    </div>
  </section>

  <!-- Servicios -->
  <section id="servicios" class="home-section home-section--slate py-4 py-md-5">
    <div class="container">
      <h2 class="section-title mb-4 mb-md-5">{{ t('nav.servicios') }}</h2>
    </div>
    <ProductCarousel
      :items="servicios"
      aria-label="servicios"
      compact
    >
      <template #default="{ item: servicio }">
        <article class="servicio-card h-100 d-flex flex-column">
          <div v-if="!servicio.image" class="servicio-card__icon" aria-hidden="true">
            <svg v-if="servicio.icon === 'composicion'" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
              <path d="M9 13c0 .552-.448 1-1 1s-1-.448-1-1V5c0-.552.448-1 1-1s1 .448 1 1z"/>
              <path d="M6 12.036V13c0 .552-.448 1-1 1s-1-.448-1-1v-.964c-.725-.35-1.22-.998-1.22-1.752 0-.754.495-1.402 1.22-1.752V7c0-.552.448-1 1-1s1 .448 1 1v1.536c.725.35 1.22.998 1.22 1.752 0 .754-.495 1.402-1.22 1.752"/>
            </svg>
            <svg v-else-if="servicio.icon === 'arreglos'" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
              <path d="M4.603 12.087a.5.5 0 0 1-.707-.707L10.793 4.5a.5.5 0 1 1 .707.707z"/>
            </svg>
            <svg v-else-if="servicio.icon === 'direccion'" xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 0 0-5 5v1a1 1 0 0 1-2 0V8a7 7 0 1 1 14 0v1a1 1 0 0 1-2 0V8a5 5 0 0 0-5-5"/>
              <path d="M5 10a3 3 0 1 1 6 0v3a3 3 0 1 1-6 0z"/>
            </svg>
          </div>
          <h3 class="servicio-card__titulo">{{ t(`services.${servicio.titleKey}`) }}</h3>
          <p class="servicio-card__descripcion">{{ servicio.descripcion }}</p>
          <div v-if="servicio.image" class="servicio-card__media">
            <img
              :src="servicio.image"
              :alt="t(`services.${servicio.titleKey}`)"
              class="servicio-card__img"
              loading="lazy"
            >
          </div>
          <div v-if="servicio.detalle" class="servicio-card__actions mt-auto">
            <button
              type="button"
              class="btn btn-link servicio-card__mas"
              @click="openServicioDetalle(servicio)"
            >
              Ver más
            </button>
          </div>
        </article>
      </template>
    </ProductCarousel>
    <div class="container">
      <SectionScrollUp />
    </div>
  </section>

  <ServiceDetailModal
    :open="servicioModalOpen"
    :servicio="servicioModalActivo"
    :titulo="servicioModalActivo ? t(`services.${servicioModalActivo.titleKey}`) : ''"
    :cta-label="servicioModalActivo?.ctaLabel || 'Cotiza aquí'"
    :cotiza-href="servicioModalActivo ? cotizaMailto(t(`services.${servicioModalActivo.titleKey}`)) : '#'"
    @close="closeServicioDetalle"
  />

  <!-- Productos Sinfónicos -->
  <section id="productos-sinfonicos" class="home-section home-section--ink pt-4 pt-md-5 pb-2 pb-md-3">
    <div class="container text-center">
      <h2 class="section-title mb-4">{{ t('nav.productosSinfonicos') }}</h2>
      <div class="productos-grid">
        <CardComponent
          v-for="proyecto in productosSinfonicos"
          :key="proyecto.id"
          :product-id="proyecto.id"
          :title="proyecto.title"
          :subtitle="proyecto.subtitle || ''"
          :image="proyecto.image"
          :opciones="proyecto.opciones"
          :temas="proyecto.temas || []"
          :agotado="Boolean(proyecto.agotado)"
          :image-position="proyecto.imagePosition || ''"
        />
      </div>
    </div>
    <SectionScrollUp />
  </section>

  <!-- Música de Películas -->
  <section id="musica-peliculas" class="home-section home-section--slate pt-4 pt-md-5 pb-2 pb-md-3">
    <div class="container text-center">
      <h2 class="section-title mb-4">{{ t('nav.musicaPeliculas') }}</h2>
    </div>
    <ProductCarousel
      :items="musicaPeliculas"
      aria-label="música de películas / musicales"
      compact
    />
    <SectionScrollUp />
  </section>

  <!-- Testimonios (placeholder) -->
  <section id="testimonios" class="home-section home-section--ink py-4 py-md-5">
    <div class="container">
      <h2 class="section-title mb-3">{{ t('nav.testimonios') }}</h2>
      <p class="section-placeholder mb-0">Contenido próximamente.</p>
      <SectionScrollUp />
    </div>
  </section>

  <div id="contacto">
    <FooterComponent />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import NavBar from '../components/NavBar'
import FooterComponent from '../components/FooterComponent.vue'
import ProductCarousel from '../components/ProductCarousel.vue'
import CardComponent from '../components/CardComponent.vue'
import SectionScrollUp from '../components/SectionScrollUp.vue'
import ServiceDetailModal from '../components/ServiceDetailModal.vue'
import productosSinfonicos from '../data/productosSinfonicos.json'
import musicaPeliculas from '../data/musicaPeliculas.json'
import servicios from '../data/servicios.json'
import { useI18n } from '@/i18n/useI18n'
import { getWhatsAppHeroUrl } from '@/config/whatsapp'

const { t } = useI18n()
const heroWhatsappHref = getWhatsAppHeroUrl()

/** Correo provisional para cotizaciones de servicios */
const SERVICIOS_EMAIL = 'paulagajardosch@gmail.com'

function cotizaMailto(titulo) {
  const subject = encodeURIComponent(`Cotización — ${titulo}`)
  const body = encodeURIComponent(
    `Hola,\n\nMe interesa cotizar el servicio de ${titulo}.\n\nSaludos.`,
  )
  return `mailto:${SERVICIOS_EMAIL}?subject=${subject}&body=${body}`
}

const servicioModalOpen = ref(false)
const servicioModalActivo = ref(null)

function openServicioDetalle(servicio) {
  servicioModalActivo.value = servicio
  servicioModalOpen.value = true
}

function closeServicioDetalle() {
  servicioModalOpen.value = false
  servicioModalActivo.value = null
}

/** Foto del director en `public/img/image_maestro.jpg` */
const heroFotoSrc = '/img/image_maestro.jpg'

const trayectoriaItems = [
  {
    mark: 'I',
    title: 'Dirección Sinfónica en La Araucanía',
    text:
      'Tras una destacada labor liderando la Orquesta Sinfónica Juvenil Armando Dufey (período consolidado hasta 2025), es actualmente director Titular de la Orquesta Sinfónica de la Universidad Católica de Temuco y de su Coro Sinfónico, impulsando la descentralización de la música clásica con montajes de alto nivel técnico.',
  },
  {
    mark: 'II',
    title: 'Grandes Óperas en Santiago',
    text:
      'En la escena capitalina, destaca de forma recurrente su dirección musical para las producciones de Merlín Comunicaciones. Al mando de la Orquesta Filodramática de Chile, ha liderado con rotundo éxito de crítica y público obras cumbres del repertorio universal, incluyendo títulos estelares como Carmen de Bizet en teatros de renombre como CorpArtes y las conmemoraciones líricas internacionales en homenaje a Puccini (Gianni Schicchi) y Tosca entre otras. Recientemente Pagliacci y Cavalleria Rusticana.',
  },
  {
    mark: 'III',
    title: 'Catálogo de Partituras desde el Podio',
    text:
      'Su experiencia guiando agrupaciones de cámara, coros y grandes orquestas sinfónicas en Europa y Chile se plasma en un catálogo exclusivo de arreglos, composiciones y orquestaciones. Cada partitura en esta tienda garantiza un balance sonoro óptimo, máxima legibilidad y soluciones orquestales pensadas por un director, para directores.',
  },
]

const heroFotoShellRef = ref(null)
const heroFotoInView = ref(false)
const trayectoriaItemsRef = ref(null)
const trayectoriaInView = ref(false)
const trayectoriaSlide = ref(0)
const reduceMotion = ref(false)

let heroFotoObserver = null
let trayectoriaObserver = null

function goToTrayectoria(index) {
  const total = trayectoriaItems.length
  trayectoriaSlide.value = ((index % total) + total) % total
}

function trayectoriaPrev() {
  goToTrayectoria(trayectoriaSlide.value - 1)
}

function trayectoriaNext() {
  goToTrayectoria(trayectoriaSlide.value + 1)
}

function setupHeroFotoReveal() {
  if (reduceMotion.value) {
    heroFotoInView.value = true
    return
  }
  const shell = heroFotoShellRef.value
  if (!shell) {
    heroFotoInView.value = true
    return
  }
  if (typeof IntersectionObserver === 'undefined') {
    heroFotoInView.value = true
    return
  }
  heroFotoObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          heroFotoInView.value = true
          heroFotoObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
  )
  heroFotoObserver.observe(shell)
}

function setupTrayectoriaReveal() {
  if (reduceMotion.value) {
    trayectoriaInView.value = true
    return
  }
  const root = trayectoriaItemsRef.value
  if (!root) {
    trayectoriaInView.value = true
    return
  }
  if (typeof IntersectionObserver === 'undefined') {
    trayectoriaInView.value = true
    return
  }
  trayectoriaObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          trayectoriaInView.value = true
          trayectoriaObserver?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
  )
  trayectoriaObserver.observe(root)
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  setupHeroFotoReveal()
  setupTrayectoriaReveal()
})

onUnmounted(() => {
  heroFotoObserver?.disconnect()
  heroFotoObserver = null
  trayectoriaObserver?.disconnect()
  trayectoriaObserver = null
})

</script>

<style scoped>
.home-section {
  background-color: var(--ms-ink);
}

.home-section--ink {
  background-color: var(--ms-ink);
}

.home-section--slate {
  background-color: var(--ms-slate);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 4vw, 1.9rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--ms-text);
  position: relative;
  display: inline-block;
  padding-bottom: 0.75rem;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: clamp(2.5rem, 18vw, 3.75rem);
  height: 3px;
  transform: translateX(-50%);
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--ms-accent) 0%,
    rgba(var(--ms-accent-rgb), 0.5) 100%
  );
  opacity: 0.88;
}

.section-placeholder {
  font-family: var(--font-body);
  color: var(--ms-text-muted);
  font-size: clamp(0.9rem, 2.2vw, 1rem);
}

.home-section--trayectoria {
  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.home-section--trayectoria::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 55% 50% at 12% 35%,
      rgba(var(--ms-accent-rgb), 0.14) 0%,
      transparent 65%
    ),
    radial-gradient(
      ellipse 45% 40% at 92% 70%,
      rgba(var(--ms-accent-rgb), 0.08) 0%,
      transparent 70%
    );
}

.trayectoria {
  max-width: 46rem;
  margin-inline: auto;
  text-align: center;
}

.trayectoria__carousel {
  position: relative;
  text-align: left;
}

/* Controles solo en md+ */
.trayectoria__arrow,
.trayectoria__dots {
  display: none;
}

.trayectoria__viewport {
  position: relative;
}

.trayectoria__track {
  display: grid;
  gap: 1.35rem;
  position: relative;
}

/* Móvil: eje vertical */
.trayectoria__track::before {
  content: '';
  position: absolute;
  left: 1.15rem;
  top: 0.55rem;
  bottom: 0.55rem;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(var(--ms-accent-rgb), 0.75) 0%,
    rgba(var(--ms-accent-rgb), 0.2) 100%
  );
}

.trayectoria__item {
  display: grid;
  grid-template-columns: 2.3rem minmax(0, 1fr);
  gap: 0.75rem 0.95rem;
  align-items: start;
  opacity: 0;
  transform: translateX(-1.1rem);
  transition:
    opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--trayectoria-i, 0) * 0.12s);
}

.trayectoria__item--in-view {
  opacity: 1;
  transform: translateX(0);
}

.trayectoria__mark {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  font-family: var(--font-display);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #e8f0fb;
  background:
    radial-gradient(
      circle at 35% 30%,
      rgba(168, 196, 232, 0.4) 0%,
      rgba(var(--ms-accent-rgb), 0.5) 42%,
      rgba(var(--ms-deep-rgb), 0.98) 78%
    );
  border: 1px solid rgba(var(--ms-accent-rgb), 0.65);
  border-radius: 50%;
  box-shadow:
    0 0 0 4px var(--ms-ink),
    0 0 16px rgba(var(--ms-accent-rgb), 0.3);
  line-height: 1;
  justify-self: center;
}

.trayectoria__body {
  min-width: 0;
}

.trayectoria__item-title {
  font-family: var(--font-display);
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  font-weight: 600;
  letter-spacing: 0.045em;
  line-height: 1.3;
  color: var(--ms-text);
  margin: 0 0 0.55rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.35rem;
}

.trayectoria__item-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 2rem;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    var(--ms-accent-on-dark) 0%,
    rgba(var(--ms-accent-rgb), 0.12) 100%
  );
}

.trayectoria__lead {
  font-family: var(--font-body);
  font-size: clamp(0.74rem, 1.55vw, 0.82rem);
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.68);
  text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
  padding-right: 0.85rem;
}

/* md+: un hito a la vez, carrusel lateral */
@media (min-width: 768px) {
  .trayectoria {
    max-width: none;
    width: 100%;
  }

  .trayectoria__carousel {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.75rem 1.15rem;
  }

  .trayectoria__arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.55rem;
    height: 2.55rem;
    padding: 0;
    border: 1px solid rgba(var(--ms-accent-rgb), 0.55);
    border-radius: 50%;
    background: rgba(var(--ms-accent-rgb), 0.16);
    color: var(--ms-accent-on-dark);
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease;
  }

  .trayectoria__arrow:hover,
  .trayectoria__arrow:focus-visible {
    background: rgba(var(--ms-accent-rgb), 0.3);
    border-color: rgba(var(--ms-accent-rgb), 0.9);
  }

  .trayectoria__arrow:active {
    transform: scale(0.96);
  }

  .trayectoria__arrow:focus-visible {
    outline: 2px solid rgba(var(--ms-accent-rgb), 0.45);
    outline-offset: 2px;
  }

  .trayectoria__viewport {
    overflow: hidden;
    min-width: 0;
  }

  .trayectoria__track {
    display: flex;
    gap: 0;
    transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
    transform: translateX(calc(var(--trayectoria-slide, 0) * -100%));
  }

  .trayectoria__track::before {
    display: none;
  }

  .trayectoria__item {
    flex: 0 0 100%;
    width: 100%;
    grid-template-columns: 2.7rem minmax(0, 1fr);
    gap: 1rem 1.25rem;
    padding: 0.35rem 0.25rem 0.5rem;
    opacity: 1;
    transform: none;
    transition: none;
  }

  .trayectoria__carousel--in-view .trayectoria__item {
    opacity: 1;
    transform: none;
  }

  .trayectoria__mark {
    width: 2.7rem;
    height: 2.7rem;
    font-size: 0.88rem;
  }

  .trayectoria__item-title {
    font-size: clamp(1rem, 2vw, 1.15rem);
  }

  .trayectoria__item-title::after {
    width: 2.4rem;
  }

  .trayectoria__lead {
    font-size: clamp(0.84rem, 1.45vw, 0.95rem);
    line-height: 1.7;
    max-width: none;
    padding-right: 0;
  }

  .trayectoria__dots {
    display: flex;
    justify-content: center;
    gap: 0.55rem;
    margin-top: 1.15rem;
  }

  .trayectoria__dot {
    min-width: 2.1rem;
    height: 2.1rem;
    padding: 0 0.4rem;
    border-radius: 999px;
    border: 1px solid rgba(var(--ms-accent-rgb), 0.4);
    background: transparent;
    color: rgba(255, 255, 255, 0.65);
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .trayectoria__dot:hover,
  .trayectoria__dot:focus-visible {
    border-color: rgba(var(--ms-accent-rgb), 0.8);
    color: var(--ms-text);
  }

  .trayectoria__dot--active {
    background: rgba(var(--ms-accent-rgb), 0.28);
    border-color: rgba(var(--ms-accent-rgb), 0.85);
    color: var(--ms-accent-on-dark);
  }
}

@media (prefers-reduced-motion: reduce) {
  .trayectoria__item {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .trayectoria__track {
    transition: none;
  }
}

/* Hero */
.hero-foto-shell {
  --foto-ancho: min(100%, 22rem);
  flex: 0 0 auto;
  width: var(--foto-ancho);
  margin-inline: auto;
  position: relative;
  opacity: 0;
  transform: scale(0.96) translateY(14px);
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-foto-shell--in-view {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.hero-foto {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: transparent;
  /* Sin borde duro: la viñeta funde la foto con el fondo de la sección */
  -webkit-mask-image: radial-gradient(
    ellipse 92% 88% at 50% 42%,
    #000 42%,
    rgba(0, 0, 0, 0.85) 62%,
    rgba(0, 0, 0, 0.35) 78%,
    transparent 100%
  );
  mask-image: radial-gradient(
    ellipse 92% 88% at 50% 42%,
    #000 42%,
    rgba(0, 0, 0, 0.85) 62%,
    rgba(0, 0, 0, 0.35) 78%,
    transparent 100%
  );
}

.hero-foto::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 78% 72% at 50% 40%,
    transparent 48%,
    rgba(10, 10, 10, 0.45) 72%,
    var(--ms-ink) 100%
  );
}

@media (min-width: 992px) {
  .hero-texto {
    flex: 1 1 0;
    max-width: min(100%, 42rem);
  }

  .hero-foto-shell {
    /* Tablet landscape / desktop estrecho: foto más contenida */
    --foto-ancho: min(36%, 16rem);
    margin-inline: 0;
    flex: 0 1 auto;
  }
}

@media (min-width: 1200px) {
  .hero-foto-shell {
    --foto-ancho: min(38%, 22rem);
  }
}

.hero-foto__img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
}

@media (prefers-reduced-motion: reduce) {
  .hero-foto-shell {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.hero-texto {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 100%;
  position: relative;
  z-index: 1;
}

@media (min-width: 992px) {
  .hero-texto {
    flex: 1 1 0;
    max-width: min(100%, 38rem);
  }
}

.hero-titulo {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.03em;
  color: var(--ms-text);
}

.hero-titulo__lineas {
  display: block;
  white-space: nowrap;
  font-size: clamp(0.48rem, 2.55vw, 1.05rem);
  letter-spacing: 0.015em;
}

.hero-cita {
  display: block;
  margin-top: 0.35rem;
  font-style: italic;
  color: var(--ms-accent-on-dark);
  font-weight: 600;
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: clamp(0.68rem, 3.2vw, 1.05rem);
}

.hero-subtitulo {
  font-family: var(--font-body);
  line-height: 1.55;
  color: var(--ms-text-muted);
}

.hero-subtitulo__nombre,
.hero-subtitulo__rol {
  display: block;
  white-space: normal;
}

.hero-subtitulo__nombre {
  font-size: clamp(0.58rem, 2.7vw, 0.92rem);
}

.hero-subtitulo__rol {
  font-size: clamp(0.54rem, 2.4vw, 0.82rem);
}

.hero-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  padding: 0.72rem 1.85rem 0.78rem;
  border: 1px solid rgba(var(--ms-accent-rgb), 0.55);
  border-radius: 999px;
  background: linear-gradient(
    165deg,
    rgba(var(--ms-accent-rgb), 0.18) 0%,
    rgba(var(--ms-accent-rgb), 0.05) 100%
  );
  color: var(--ms-accent-on-dark);
  text-decoration: none;
  transition:
    color 0.28s ease,
    background-color 0.28s ease,
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    transform 0.22s ease;
}

.hero-cta__label {
  font-family: var(--font-display);
  font-size: clamp(0.72rem, 1.8vw, 0.88rem);
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  line-height: 1;
}

.hero-cta:hover,
.hero-cta:focus-visible {
  color: #fff;
  background: rgba(var(--ms-accent-rgb), 0.32);
  border-color: rgba(var(--ms-accent-rgb), 0.95);
  box-shadow:
    0 0 0 1px rgba(var(--ms-accent-rgb), 0.28),
    0 10px 28px rgba(0, 0, 0, 0.28);
  transform: translateY(-2px);
}

.hero-cta:focus-visible {
  outline: 2px solid rgba(var(--ms-accent-rgb), 0.55);
  outline-offset: 3px;
}

.hero-cta:active {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta {
    transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
  }

  .hero-cta:hover,
  .hero-cta:focus-visible,
  .hero-cta:active {
    transform: none;
  }
}

@media (min-width: 1200px) {
  .hero-subtitulo__nombre,
  .hero-subtitulo__rol {
    white-space: nowrap;
  }
}

/* Video */
.video-player-shell {
  max-width: 100%;
  margin-inline: auto;
}

.video-player-placeholder {
  height: clamp(3.25rem, 8vw, 4.25rem);
  border-radius: 0.45rem;
  background: linear-gradient(160deg, #141c2a 0%, #0f0f0f 100%);
  border: 1px solid var(--ms-border);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: var(--ms-text-muted);
}

.video-player-icon {
  opacity: 0.45;
  flex-shrink: 0;
}

.video-player-label {
  font-size: 0.85rem;
  letter-spacing: 0.02em;
}

/* Servicios */
.servicio-card {
  text-align: center;
  padding: 1.5rem 1.15rem;
  border-radius: 0.85rem;
  background: var(--ms-surface);
  border: 1px solid var(--ms-border);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.servicio-card:hover {
  transform: translateY(-3px);
  border-color: rgba(var(--ms-accent-rgb), 0.35);
}

.servicio-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  margin-bottom: 0.85rem;
  border-radius: 50%;
  background: rgba(var(--ms-accent-rgb), 0.18);
  color: var(--ms-accent-on-dark);
}

.servicio-card__titulo {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.3;
  /* Reserva 2 líneas de título para alinear descripciones */
  min-height: calc(1.05rem * 1.3 * 2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ms-text);
  margin-bottom: 0.65rem;
}

.servicio-card__descripcion {
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--ms-text-muted);
  text-align: center;
  margin-bottom: 1.15rem;
  flex-grow: 1;
}

.servicio-card__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
}

.servicio-card__mas {
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ms-accent-on-dark);
  text-decoration: none;
  padding: 0.15rem 0.35rem;
}

.servicio-card__mas:hover,
.servicio-card__mas:focus-visible {
  color: var(--ms-text);
  text-decoration: underline;
}

.servicio-card__media {
  width: 78%;
  max-width: 11.5rem;
  margin: 0 auto 1.15rem;
  padding: 0.35rem;
  border: 1px solid rgba(var(--ms-accent-rgb), 0.45);
  border-radius: 0.4rem;
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.servicio-card__img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 0.2rem;
}

.productos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  max-width: 22rem;
  margin: 0 auto;
  text-align: left;
}

@media (min-width: 768px) {
  .productos-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: 42rem;
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .servicio-card {
    transition: none;
  }

  .servicio-card:hover {
    transform: none;
  }
}
</style>