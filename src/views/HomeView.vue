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
          <span class="hero-titulo__nombre">Eduardo Gajardo Schmidlin</span>
          <span class="hero-titulo__rol">{{ t('hero.role') }}</span>
        </h1>
        <p class="hero-subtitulo mb-0">
          <span class="hero-subtitulo__lineas">{{ t('hero.disciplines') }}</span>
          <span class="hero-cita">{{ t('hero.quote') }}</span>
        </p>
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
      <h2 class="section-title mb-4 mb-md-5">{{ t('nav.trayectoria') }}</h2>
      <div ref="trayectoriaItemsRef" class="trayectoria__items">
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
            <ScrollRevealLines
              class="trayectoria__lead"
              :text="item.text"
              :active="trayectoriaInView"
            />
          </div>
        </article>
      </div>
      <SectionScrollUp />
    </div>
  </section>

  <!-- Productos Sinfónicos -->
  <section id="productos-sinfonicos" class="home-section home-section--slate pt-4 pt-md-5 pb-2 pb-md-3">
    <div class="container text-center">
      <h2 class="section-title mb-4">{{ t('nav.productosSinfonicos') }}</h2>
    </div>
    <ProductCarousel
      :items="productosSinfonicos"
      aria-label="productos sinfónicos"
    />
    <SectionScrollUp />
  </section>

  <!-- Música de Películas -->
  <section id="musica-peliculas" class="home-section home-section--ink pt-4 pt-md-5 pb-2 pb-md-3">
    <div class="container text-center">
      <h2 class="section-title mb-4">{{ t('nav.musicaPeliculas') }}</h2>
    </div>
    <ProductCarousel
      :items="musicaPeliculas"
      aria-label="música de películas"
      compact
    />
    <SectionScrollUp />
  </section>

  <!-- Servicios -->
  <section id="servicios" class="home-section home-section--slate py-4 py-md-5">
    <div class="container">
      <h2 class="section-title mb-4 mb-md-5">{{ t('nav.servicios') }}</h2>
      <div class="row g-3 g-md-4 justify-content-center">
        <div
          v-for="servicio in servicios"
          :key="servicio.id"
          class="col-12 col-sm-6 col-lg-3"
        >
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
        </div>
      </div>
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
import SectionScrollUp from '../components/SectionScrollUp.vue'
import ScrollRevealLines from '../components/ScrollRevealLines.vue'
import ServiceDetailModal from '../components/ServiceDetailModal.vue'
import productosSinfonicos from '../data/productosSinfonicos.json'
import musicaPeliculas from '../data/musicaPeliculas.json'
import servicios from '../data/servicios.json'
import { useI18n } from '@/i18n/useI18n'

const { t } = useI18n()

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
const reduceMotion = ref(false)

let heroFotoObserver = null
let trayectoriaObserver = null

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
      ellipse 70% 55% at 18% 28%,
      rgba(var(--ms-accent-rgb), 0.16) 0%,
      transparent 62%
    ),
    radial-gradient(
      ellipse 55% 45% at 88% 78%,
      rgba(var(--ms-accent-rgb), 0.08) 0%,
      transparent 70%
    );
}

.trayectoria {
  max-width: 46rem;
  margin-inline: auto;
  text-align: center;
}

.trayectoria__items {
  display: grid;
  gap: 0;
  text-align: left;
  position: relative;
  padding-left: 0.15rem;
}

.trayectoria__items::before {
  content: '';
  position: absolute;
  left: 1.25rem;
  top: 0.7rem;
  bottom: 0.7rem;
  width: 2px;
  background: linear-gradient(
    180deg,
    rgba(var(--ms-accent-rgb), 0.85) 0%,
    rgba(var(--ms-accent-rgb), 0.35) 45%,
    rgba(var(--ms-accent-rgb), 0.08) 100%
  );
  box-shadow: 0 0 18px rgba(var(--ms-accent-rgb), 0.25);
}

.trayectoria__item {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0.9rem 1.15rem;
  align-items: start;
  padding: 1.5rem 0.35rem 1.7rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  opacity: 0;
  transform: translateY(1.1rem);
  transition:
    opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.75s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease;
  transition-delay: calc(var(--trayectoria-i, 0) * 0.14s);
}

.trayectoria__item--in-view {
  opacity: 1;
  transform: translateY(0);
}

.trayectoria__item:last-child {
  border-bottom: none;
  padding-bottom: 0.4rem;
}

.trayectoria__mark {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-family: var(--font-display);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #e8f0fb;
  background:
    radial-gradient(
      circle at 35% 30%,
      rgba(168, 196, 232, 0.45) 0%,
      rgba(var(--ms-accent-rgb), 0.55) 42%,
      rgba(var(--ms-deep-rgb), 0.98) 78%
    );
  border: 1px solid rgba(var(--ms-accent-rgb), 0.7);
  border-radius: 50%;
  box-shadow:
    0 0 0 5px var(--ms-ink),
    0 0 22px rgba(var(--ms-accent-rgb), 0.35);
  line-height: 1;
}

.trayectoria__body {
  min-width: 0;
  padding-top: 0.15rem;
}

.trayectoria__item-title {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2.6vw, 1.28rem);
  font-weight: 600;
  letter-spacing: 0.055em;
  line-height: 1.3;
  color: var(--ms-text);
  margin: 0 0 0.85rem;
  position: relative;
  display: inline-block;
  padding-bottom: 0.45rem;
}

.trayectoria__item-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 2.4rem;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    var(--ms-accent-on-dark) 0%,
    rgba(var(--ms-accent-rgb), 0.15) 100%
  );
}

:deep(.trayectoria__lead) {
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 1.9vw, 0.9rem);
  line-height: 1.7;
  letter-spacing: 0.01em;
  color: rgba(255, 255, 255, 0.7);
  max-width: 38rem;
  text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
}

@media (min-width: 768px) {
  .trayectoria__items {
    padding-left: 0.45rem;
  }

  .trayectoria__items::before {
    left: 1.5rem;
  }

  .trayectoria__item {
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 1.1rem 1.6rem;
    padding: 1.75rem 0.5rem 1.95rem 0;
  }

  .trayectoria__mark {
    width: 3rem;
    height: 3rem;
    font-size: 0.95rem;
  }

  .trayectoria__item-title::after {
    width: 3rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .trayectoria__item {
    opacity: 1;
    transform: none;
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
  .hero-foto-shell {
    /* Tablet landscape / desktop estrecho: foto más contenida */
    --foto-ancho: min(40%, 17.5rem);
    margin-inline: 0;
    flex: 0 1 auto;
  }
}

@media (min-width: 1200px) {
  .hero-foto-shell {
    --foto-ancho: min(42%, 26rem);
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
}

@media (min-width: 992px) {
  .hero-texto {
    flex: 1 1 0;
    max-width: min(100%, 36rem);
  }
}

.hero-titulo {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0.03em;
  color: var(--ms-text);
}

.hero-titulo__nombre,
.hero-titulo__rol {
  display: block;
  white-space: normal;
}

@media (min-width: 1200px) {
  .hero-titulo__nombre,
  .hero-titulo__rol {
    white-space: nowrap;
  }
}

.hero-titulo__nombre {
  font-size: clamp(0.78rem, 4.2vw, 1.5rem);
}

.hero-titulo__rol {
  font-size: clamp(0.68rem, 3.5vw, 1.28rem);
}

.hero-subtitulo {
  font-family: var(--font-body);
  line-height: 1.55;
  color: var(--ms-text-muted);
}

.hero-subtitulo__lineas {
  display: block;
  white-space: normal;
  font-size: clamp(0.62rem, 3vw, 1rem);
}

.hero-cita {
  display: block;
  margin-top: 0.35rem;
  font-style: italic;
  color: var(--ms-accent-on-dark);
  font-weight: 600;
  white-space: normal;
  font-size: clamp(0.62rem, 3vw, 1rem);
}

@media (min-width: 1200px) {
  .hero-subtitulo__lineas,
  .hero-cita {
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

@media (prefers-reduced-motion: reduce) {
  .servicio-card {
    transition: none;
  }

  .servicio-card:hover {
    transform: none;
  }
}
</style>