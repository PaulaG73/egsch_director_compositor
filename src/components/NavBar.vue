<template>
  <div class="navBar">
    <nav id="navbar-principal" class="navbar navbar-expand-lg navbar-dark bg-maestro-profundo border-bottom py-2 py-md-3 nav-maestro">
      <div class="container-fluid px-3 px-lg-4 navbar-inner">
        <div class="lang-switcher d-flex align-items-center flex-wrap gap-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            type="button"
            class="lang-switcher__btn"
            :class="{ 'lang-switcher__btn--active': locale === lang.code }"
            :aria-label="lang.label"
            :title="lang.label"
            @click="setLanguage(lang.code)"
          >
            <span class="lang-switcher__flag" aria-hidden="true">
              <!-- Chile -->
              <svg v-if="lang.code === 'es'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="30" height="10" fill="#fff"/>
                <rect y="10" width="30" height="10" fill="#d52b1e"/>
                <rect width="10" height="10" fill="#0039a6"/>
                <polygon
                  fill="#fff"
                  points="5,1.6 5.85,4.2 8.6,4.2 6.4,5.85 7.2,8.5 5,6.85 2.8,8.5 3.6,5.85 1.4,4.2 4.15,4.2"
                />
              </svg>
              <!-- Reino Unido (simplificada) -->
              <svg v-else-if="lang.code === 'en'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="30" height="20" fill="#012169"/>
                <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" stroke-width="4"/>
                <path d="M0,0 L30,20 M30,0 L0,20" stroke="#c8102e" stroke-width="2"/>
                <path d="M15,0 V20 M0,10 H30" stroke="#fff" stroke-width="6"/>
                <path d="M15,0 V20 M0,10 H30" stroke="#c8102e" stroke-width="3.2"/>
              </svg>
              <!-- Francia -->
              <svg v-else-if="lang.code === 'fr'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="10" height="20" fill="#002395"/>
                <rect x="10" width="10" height="20" fill="#fff"/>
                <rect x="20" width="10" height="20" fill="#ed2939"/>
              </svg>
              <!-- Alemania -->
              <svg v-else-if="lang.code === 'de'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="30" height="6.67" fill="#000"/>
                <rect y="6.67" width="30" height="6.67" fill="#dd0000"/>
                <rect y="13.33" width="30" height="6.67" fill="#ffce00"/>
              </svg>
              <!-- Italia -->
              <svg v-else-if="lang.code === 'it'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="10" height="20" fill="#009246"/>
                <rect x="10" width="10" height="20" fill="#fff"/>
                <rect x="20" width="10" height="20" fill="#ce2b37"/>
              </svg>
              <!-- Brasil -->
              <svg v-else-if="lang.code === 'pt'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20">
                <rect width="30" height="20" fill="#009c3b"/>
                <polygon points="15,2 28,10 15,18 2,10" fill="#ffdf00"/>
                <circle cx="15" cy="10" r="4.2" fill="#002776"/>
              </svg>
            </span>
          </button>
        </div>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          :aria-label="t('nav.openMenu')"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3 align-items-lg-center">
            <li class="nav-item">
              <a class="nav-link" href="#servicios">{{ t('nav.servicios') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#trayectoria">{{ t('nav.trayectoria') }}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#productos-sinfonicos">{{ t('nav.productos') }}</a>
            </li>
            <li v-for="link in navLinks" :key="link.href" class="nav-item">
              <a class="nav-link" :href="link.href">{{ t(link.labelKey) }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n/useI18n'

const { locale, t, setLocale } = useI18n()

const navLinks = [
  { href: '#testimonios', labelKey: 'nav.testimonios' },
  { href: '#contacto', labelKey: 'nav.contacto' },
]

const languages = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
]

function setLanguage(code) {
  setLocale(code)
}
</script>

<style scoped>
.navbar-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.lang-switcher {
  order: 1;
  margin-left: auto;
  flex-shrink: 1;
  max-width: calc(100% - 3.5rem);
  justify-content: flex-end;
}

.navbar-toggler {
  order: 2;
  margin-left: 0.5rem;
  border-color: rgba(255, 255, 255, 0.35);
}

.navbar-collapse {
  order: 3;
  flex-basis: 100%;
}

@media (min-width: 992px) {
  .lang-switcher {
    order: 3;
    margin-left: 1rem;
    max-width: none;
    flex-shrink: 0;
  }

  .navbar-collapse {
    order: 2;
    flex-basis: auto;
    flex-grow: 1;
  }
}

.nav-maestro {
  border-color: var(--ms-border) !important;
  box-shadow: 0 1px 0 0 rgba(var(--ms-accent-rgb), 0.35);
}

.nav-maestro .nav-link {
  font-family: var(--font-body);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.92);
}

.nav-maestro .navbar-nav .nav-link {
  position: relative;
  padding-inline: 0.75rem;
  padding-block: 0.4rem;
  border-radius: 0.4rem;
  font-size: clamp(0.82rem, 2vw, 0.95rem);
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.nav-maestro .navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0.15rem;
  width: 0;
  height: 2px;
  border-radius: 2px;
  background-color: var(--ms-accent);
  transform: translateX(-50%);
  transition: width 0.28s ease;
}

.nav-maestro .navbar-nav .nav-link:hover,
.nav-maestro .navbar-nav .nav-link:focus-visible {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.nav-maestro .navbar-nav .nav-link:hover::after,
.nav-maestro .navbar-nav .nav-link:focus-visible::after {
  width: calc(100% - 1.1rem);
}

@media (prefers-reduced-motion: reduce) {
  .nav-maestro .navbar-nav .nav-link {
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .nav-maestro .navbar-nav .nav-link:hover,
  .nav-maestro .navbar-nav .nav-link:focus-visible {
    transform: none;
  }

  .nav-maestro .navbar-nav .nav-link::after {
    transition: width 0.15s ease;
  }
}

.lang-switcher__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.05rem;
  height: 2.05rem;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.45rem;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.15s ease;
}

.lang-switcher__btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
}

.lang-switcher__btn--active {
  background: rgba(var(--ms-accent-rgb), 0.35);
  border-color: rgba(var(--ms-accent-rgb), 0.65);
  box-shadow: 0 0 0 1px rgba(var(--ms-accent-rgb), 0.25);
}

.lang-switcher__btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.55);
  outline-offset: 2px;
}

.lang-switcher__flag {
  display: inline-flex;
  width: 1.35rem;
  height: 0.92rem;
  border-radius: 0.15rem;
  overflow: hidden;
  line-height: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
}

.lang-switcher__flag svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
